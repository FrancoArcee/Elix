import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-surface lg:block lg:min-h-screen">
        <Image
          src="/images/auth-elix-fragancias.jpg"
          alt="Colección de fragancias ELIX"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="absolute bottom-12 left-12 block transition-opacity hover:opacity-80"
        >
          <p className="font-serif text-[30px] font-bold leading-[36px] tracking-[7.5px] text-white">
            ELIX
          </p>
          <p className="pt-3 text-[14px] leading-[20px] text-white/60">
            El arte de las fragancias árabes.
          </p>
        </Link>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <AdminLoginForm />
      </div>
    </main>
  );
}
