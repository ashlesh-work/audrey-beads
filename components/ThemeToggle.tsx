"use client";

import { useEffect, useState } from "react";

const OPTS: [string, string][] = [
  ["light", "☀️"],
  ["system", "💻"],
  ["dark", "🌙"],
];

export default function ThemeToggle() {
  const [choice, setChoice] = useState("light");

  useEffect(() => {
    setChoice(localStorage.getItem("theme") || "light");
  }, []);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem("theme") || "light") === "system") {
        document.documentElement.dataset.theme = mq.matches ? "dark" : "light";
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function set(c: string) {
    localStorage.setItem("theme", c);
    setChoice(c);
    const d = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = c === "system" ? d : c;
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTS.map(([v, ic]) => (
        <button
          key={v}
          aria-pressed={choice === v}
          aria-label={`${v} theme`}
          title={v}
          onClick={() => set(v)}
        >
          {ic}
        </button>
      ))}
    </div>
  );
}
