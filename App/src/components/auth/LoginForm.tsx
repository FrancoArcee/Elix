"use client";

import { useState } from "react";

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = "" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-[328px] ${className}`}
    >
      <div className="w-fit border-b border-ink pb-2">
        <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-ink">
          Iniciar sesión
        </span>
      </div>

      <div className="pt-10">
        <label
          htmlFor="email"
          className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="maria@ejemplo.com"
          className="w-full border-b border-ink/10 bg-transparent py-3 text-[14px] leading-[normal] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
        />
      </div>

      <div className="pt-6">
        <label
          htmlFor="password"
          className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="w-full border-b border-ink/10 bg-transparent py-3 text-[14px] leading-[normal] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="mt-9 h-[47px] w-full bg-ink text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-background transition-colors hover:bg-ink/90"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
