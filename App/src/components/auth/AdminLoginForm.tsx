"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  className?: string;
};

export default function AdminLoginForm({ className = "" }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/admin");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-[339px] ${className}`}
    >
      <div className="flex justify-center lg:hidden">
        <p className="font-serif text-[20px] font-bold leading-7 tracking-[5px] text-ink">
          ELIX
        </p>
      </div>
      <h1 className="pt-12 font-serif text-[24px] font-bold leading-[32px] text-ink lg:pt-0">
        Panel de administrador
      </h1>
      <p className="pt-2 text-[12px] leading-[16px] text-muted">
        Acceso exclusivo para administradores de ELIX.
      </p>

      <div className="pt-10">
        <label
          htmlFor="admin-email"
          className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@elix.com"
          className="w-full border-b border-ink/10 bg-transparent py-3 text-[14px] leading-[normal] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
        />
      </div>

      <div className="pt-6">
        <label
          htmlFor="admin-password"
          className="block pb-2 text-[9px] font-medium uppercase leading-[13.5px] tracking-[2.25px] text-ink"
        >
          Contraseña
        </label>
        <input
          id="admin-password"
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
        Ingresar
      </button>

      <Link
        href="/"
        className="mt-4 block text-center text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:text-ink"
      >
        Volver al inicio
      </Link>
    </form>
  );
}
