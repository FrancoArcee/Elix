"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth";
import {
  validateSingleField,
  validateFormData,
  type ValidationErrors,
} from "@/lib/validation";

type AdminLoginFormProps = {
  className?: string;
};

export default function AdminLoginForm({
  className = "",
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const err = validateSingleField(loginSchema, "email", {
      email: val,
      password,
    });
    setErrors((prev) => ({ ...prev, email: err ?? "" }));
    setServerError(null);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    const err = validateSingleField(loginSchema, "password", {
      email,
      password: val,
    });
    setErrors((prev) => ({ ...prev, password: err ?? "" }));
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const validation = validateFormData(loginSchema, { email, password });
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    const { error: signInError } = await signIn.email({
      email: validation.data.email,
      password: validation.data.password,
    });

    setLoading(false);

    if (signInError) {
      setServerError("Email o contraseña incorrectos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-[339px] ${className}`}
      noValidate
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
          autoComplete="email"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          placeholder="admin@elix.com"
          className={`w-full border-b bg-transparent py-3 text-[14px] leading-[normal] text-ink outline-none transition-colors placeholder:text-muted ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-ink/10 focus:border-ink"
          }`}
        />
        {errors.email && (
          <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
            {errors.email}
          </p>
        )}
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => handlePasswordChange(event.target.value)}
          placeholder="••••••••"
          className={`w-full border-b bg-transparent py-3 text-[14px] leading-[normal] text-ink outline-none transition-colors placeholder:text-muted ${
            errors.password
              ? "border-red-500 focus:border-red-500"
              : "border-ink/10 focus:border-ink"
          }`}
        />
        {errors.password && (
          <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      {serverError && (
        <p className="pt-4 text-[12px] leading-[16px] text-red-500">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-9 h-[47px] w-full bg-ink text-[10px] font-medium uppercase leading-[15px] tracking-[1.8px] text-background transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar"}
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
