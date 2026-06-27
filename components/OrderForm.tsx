"use client";

import { useState } from "react";
import { placeOrder } from "@/app/actions";

export default function OrderForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    const res = await placeOrder(data);
    if (res.ok) {
      const name = String(data.get("name") || "friend");
      setState("done");
      setNote(`Thank you, ${name}! 🎉 Your order is in — Audrey will start making it.`);
      form.reset();
    } else {
      setState("error");
      setNote(res.error || "Something went wrong — please try again.");
    }
  }

  return (
    <form className="order-card reveal" onSubmit={onSubmit}>
      {/* honeypot — hidden from people, catches bots */}
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="field">
        <label htmlFor="oname">Your name</label>
        <input id="oname" name="name" type="text" placeholder="e.g. Maya" required maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="ostyle">Which style? (or &quot;custom&quot;)</label>
        <input id="ostyle" name="style" type="text" placeholder="e.g. Rainbow Pop — or your own colors" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="omsg">Your favorite colors / message</label>
        <textarea id="omsg" name="message" rows={3} placeholder="Tell me your colors, wrist size, or anything fun!" maxLength={500} />
      </div>
      <button className="btn" type="submit" style={{ width: "100%" }} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send my order 🎉"}
      </button>
      <p className="note">
        {note || "Your order goes straight to Audrey — she'll get it ready! 💖"}
      </p>
    </form>
  );
}
