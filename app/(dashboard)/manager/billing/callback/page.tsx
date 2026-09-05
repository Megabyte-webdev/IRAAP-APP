"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/app/_lib/api-client";
import Link from "next/link";

export default function BillingCallbackPage() {
  const params = useSearchParams();
  const reference = params.get("reference");
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    if (!reference) {
      setMessage("Payment reference is missing.");
      return;
    }
    api.get(`/manager/billing/verify/${encodeURIComponent(reference)}`)
      .then((response) => {
        setMessage(response.data?.paid ? "Payment confirmed. Your organization subscription is active." : "Payment is still being processed. You can return to the dashboard and check billing status shortly.");
      })
      .catch(() => setMessage("We could not confirm this payment yet. Please return to the dashboard and check your billing status."));
  }, [reference]);

  return (
    <main className="min-h-full bg-slate-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Payment status</h1>
        <p className="mt-3 text-sm text-slate-500">{message}</p>
        <Link href="/manager" className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Return to organization</Link>
      </div>
    </main>
  );
}
