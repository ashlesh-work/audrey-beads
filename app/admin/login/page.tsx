"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "../auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <div className="admin-shell">
      <div className="login-wrap">
        <h2 style={{ fontSize: "1.6rem" }}>🔑 Admin sign-in</h2>
        <p className="sub" style={{ marginBottom: "1.4rem" }}>
          Manage Audrey&apos;s website — content, photos and orders.
        </p>
        <form action={action} className="order-card" style={{ padding: "1.6rem" }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <button className="btn" type="submit" style={{ width: "100%" }} disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
          {state?.error && <p className="note" style={{ color: "var(--coral)" }}>{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
