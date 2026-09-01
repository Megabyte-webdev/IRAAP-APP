import ReconnectingWebSocket from "reconnecting-websocket";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

type QueuedMessage = {
  type: string;
  payload: any;
};

class WebSocketService {
  private socket: ReconnectingWebSocket | null = null;

  private listeners: Record<string, Function[]> = {};

  private token: string | null = null;

  private state: ConnectionState = "disconnected";

  private stateListeners = new Set<(state: ConnectionState) => void>();

  private pendingQueue: QueuedMessage[] = [];

  private readonly queueLimit = 100;

  private manualDisconnect = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.registerNetworkEvents();
    }
  }
  private refreshHandler: (() => Promise<string | null>) | null = null;
  setRefreshHandler(handler: () => Promise<string | null>) {
    this.refreshHandler = handler;
  }

  //  NETWORK

  private registerNetworkEvents() {
    window.addEventListener("offline", () => {
      console.warn("[WS] offline");

      this.setState("disconnected");
    });

    window.addEventListener("online", () => {
      console.log("[WS] online");

      if (this.socket) {
        this.setState("reconnecting");
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (
        document.visibilityState === "visible" &&
        this.token &&
        navigator.onLine &&
        this.state === "disconnected"
      ) {
        this.connect(this.token);
      }
    });
  }

  //  STATE

  private setState(state: ConnectionState) {
    if (this.state === state) return;

    console.log("[WS STATE]", this.state, "->", state);

    this.state = state;

    this.stateListeners.forEach((cb) => cb(state));
  }

  getState() {
    return this.state;
  }

  get connectionState() {
    return this.state;
  }

  onStateChange(cb: (state: ConnectionState) => void) {
    this.stateListeners.add(cb);

    cb(this.state);
  }

  offStateChange(cb: (state: ConnectionState) => void) {
    this.stateListeners.delete(cb);
  }

  //  CONNECT

  connect(token: string, force = false) {
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_WS_URL;

    if (!url) throw new Error("NEXT_PUBLIC_WS_URL missing");

    this.token = token;

    if (
      !force &&
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("[WS] already connected");

      return;
    }

    if (force && this.socket) {
      console.log("[WS] forcing reconnect");

      this.manualDisconnect = true;

      this.socket.close(1000, "forced reconnect");

      this.socket = null;
    }

    this.manualDisconnect = false;

    this.setState("connecting");

    this.socket = new ReconnectingWebSocket(
      `${url}?token=${encodeURIComponent(token)}`,
      [],
      {
        maxRetries: Infinity,

        minReconnectionDelay: 3000,

        maxReconnectionDelay: 30000,

        reconnectionDelayGrowFactor: 2,

        connectionTimeout: 20000,

        minUptime: 10000,
      },
    );

    this.registerEvents();
  }

  //  EVENTS

  private registerEvents() {
    if (!this.socket) return;

    this.socket.addEventListener("open", () => {
      console.log("[WS] connected");

      this.setState("connected");

      setTimeout(() => this.flushQueue(), 500);
    });

    this.socket.addEventListener("close", (event) => {
      console.log("[WS CLOSED]", {
        code: event.code,
        reason: event.reason,
      });

      if (event.code === 4401) {
        console.log("[WS] token expired");

        this.handleHandshakeTokenExpired();
        return;
      }

      if (this.manualDisconnect) {
        this.manualDisconnect = false;

        this.setState("disconnected");

        return;
      }

      if (event.code === 1000) {
        this.setState("disconnected");

        return;
      }

      this.setState("reconnecting");
    });

    this.socket.addEventListener("error", (error) => {
      console.warn("[WS ERROR]", error);
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "auth:error") {
          if (parsed.code === "TOKEN_EXPIRED") {
            this.handleHandshakeTokenExpired();
          }

          return;
        }

        if (parsed.type === "pong") return;

        const handlers = this.listeners[parsed.type] || [];

        handlers.forEach((cb) =>
          cb({
            type: parsed.type,
            client_id: parsed.client_id,
            data: parsed.data,
            payload: parsed.payload,
          }),
        );
      } catch (err) {
        console.error("[WS PARSE ERROR]", err);
      }
    });
  }

  //  EVENTS API

  on(event: string, callback: Function) {
    this.listeners[event] ??= [];

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    this.listeners[event] =
      this.listeners[event]?.filter((cb) => cb !== callback) || [];
  }

  //  SEND

  emit(type: string, payload: any = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      if (type !== "ping") {
        if (this.pendingQueue.length >= this.queueLimit) {
          this.pendingQueue.shift();
        }

        this.pendingQueue.push({
          type,
          payload,
        });
      }

      return false;
    }

    this.socket.send(
      JSON.stringify({
        type,
        ...payload,
      }),
    );

    return true;
  }

  private flushQueue() {
    if (!this.connected || this.pendingQueue.length === 0) return;

    console.log("[WS] flushing", this.pendingQueue.length);

    while (this.pendingQueue.length > 0) {
      const message = this.pendingQueue.shift();

      if (!message) break;

      this.emit(message.type, message.payload);
    }
  }

  //  DISCONNECT

  disconnect() {
    this.pendingQueue = [];

    this.token = null;

    if (this.socket) {
      this.manualDisconnect = true;

      this.socket.close(1000, "manual disconnect");

      this.socket = null;
    }

    this.setState("disconnected");
  }

  updateToken(token: string) {
    this.token = token;
  }

  get connected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private async handleHandshakeTokenExpired() {
    if (!this.refreshHandler) {
      console.error("[WS] no refresh handler registered");
      return;
    }

    try {
      console.log("[WS] handshake token expired; refreshing before reconnect...");
      const newToken = await this.refreshHandler();
      if (!newToken) {
        this.disconnect();
        return;
      }

      // This path is reached only when the server rejected a connection attempt.
      // A healthy, already-authenticated websocket is never replaced just because
      // its HTTP access token was refreshed.
      this.connect(newToken, true);
    } catch (err) {
      console.error("[WS] handshake refresh error", err);
      this.disconnect();
    }
  }
}

export const websocket = new WebSocketService();
