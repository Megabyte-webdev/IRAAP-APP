import ReconnectingWebSocket from "reconnecting-websocket";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

class WebSocketService {
  private socket: ReconnectingWebSocket | null = null;
  private listeners: Record<string, Function[]> = {};
  private pingInterval?: NodeJS.Timeout;
  private token: string | null = null;
  private state: ConnectionState = "disconnected";
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();
  private isManualReconnect = false;
  private pendingQueue: Array<{ type: string; payload: any }> = [];

  // AuthContext sets this — called when server rejects the token
  public onAuthFailure: (() => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.registerNetworkEvents();
    }
  }

  // ---------------- NETWORK ----------------

  private registerNetworkEvents() {
    window.addEventListener("offline", () => {
      this.setState("disconnected");
    });

    window.addEventListener("online", () => {
      if (this.socket) {
        this.setState("reconnecting");
      }
    });

    // Mobile: reconnect when tab comes back to foreground
    document.addEventListener("visibilitychange", () => {
      if (
        document.visibilityState === "visible" &&
        this.token &&
        this.state === "disconnected" &&
        navigator.onLine
      ) {
        this.connect(this.token, true);
      }
    });
  }

  // ---------------- STATE ----------------

  // Add this helper to map browser WebSocket states to your custom states
  private getMappedState(readyState: number): ConnectionState {
    switch (readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
      default:
        return "disconnected";
    }
  }

  // Update your setState to be more resilient
  private setState(state: ConnectionState) {
    // Only update if it actually changes
    if (this.state === state) return;
    this.state = state;

    // Trigger listeners
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

  // ---------------- CONNECT ----------------

  connect(token: string, force = false) {
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_WS_URL;
    if (!url) return;

    this.token = token;

    if (this.socket) {
      const state = this.socket.readyState;
      if (
        !force &&
        (state === WebSocket.OPEN || state === WebSocket.CONNECTING)
      ) {
        return;
      }

      this.stopPing();
      this.socket.close();
      this.socket = null;
    }

    this.isManualReconnect = force;
    this.setState("connecting");

    this.socket = new ReconnectingWebSocket(`${url}?token=${token}`, [], {
      maxRetries: Infinity,
      minReconnectionDelay: 2000,
      maxReconnectionDelay: 15000,
      reconnectionDelayGrowFactor: 1.5,
      connectionTimeout: 20000,
      minUptime: 5000,
    });

    this.registerEvents();
  }

  // ---------------- EVENTS ----------------

  private registerEvents() {
    if (!this.socket) return;

    this.socket.addEventListener("open", () => {
      this.isManualReconnect = false;
      this.setState("connected");
      this.startPing();
      this.flushQueue();
    });

    this.socket.addEventListener("close", (event) => {
      this.stopPing();

      if (event.code === 4001 || event.code === 4003) {
        this.setState("disconnected");
        // Don't reconnect — token is bad. Tell AuthContext to handle it.
        this.onAuthFailure?.();
        return;
      }

      if (this.isManualReconnect) {
        this.setState("connecting");
        this.isManualReconnect = false;
        return;
      }

      if (!navigator.onLine) {
        this.setState("disconnected");
        return;
      }

      this.setState("reconnecting");
    });

    this.socket.addEventListener("error", () => {
      if (navigator.onLine) {
        console.warn("Socket reconnecting...");
      }
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data);
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
        console.error("Socket parse error:", err);
      }
    });
  }

  // ---------------- PING ----------------

  private startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.connected) {
        this.emit("ping");
      }
    }, 25000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }

  // ---------------- EVENTS API ----------------

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    this.listeners[event] =
      this.listeners[event]?.filter((cb) => cb !== callback) || [];
  }

  // ---------------- SEND ----------------

  emit(type: string, payload: any = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      if (type !== "ping") {
        this.pendingQueue.push({ type, payload });
      }
      return;
    }
    this.socket.send(JSON.stringify({ type, ...payload }));
  }

  private flushQueue() {
    if (this.pendingQueue.length === 0) return;
    const queue = [...this.pendingQueue];
    this.pendingQueue = [];
    for (const { type, payload } of queue) {
      this.socket?.send(JSON.stringify({ type, ...payload }));
    }
  }

  // ---------------- DISCONNECT ----------------

  disconnect() {
    this.stopPing();
    this.token = null;

    if (this.socket) {
      this.socket.close(1000, "manual disconnect");
      this.socket = null;
    }

    this.setState("disconnected");
  }

  reconnectWithToken(newToken: string) {
    this.connect(newToken, true);
  }

  // ---------------- GETTERS ----------------

  get connected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const websocket = new WebSocketService();
