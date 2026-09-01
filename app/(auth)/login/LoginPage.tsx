"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import LoginForm from "./_components/LoginForm";
import AuthShell from "../_components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in to your account"
      description="Welcome back! Please enter your details."
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
