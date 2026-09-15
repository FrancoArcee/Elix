import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import LegalDrawer from "@/components/layout/LegalDrawer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELIX — Perfumería Árabe",
  description:
    "Perfumes árabes originales y body splash de las marcas más exclusivas de Oriente Medio, directo a tu puerta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${libreBaskerville.variable} bg-background font-sans text-ink antialiased`}
      >
        {children}
        <LegalDrawer />
        <Toaster
          position="top-right"
          richColors={false}
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f5f5",
              borderRadius: "0px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-montserrat)",
              fontSize: "12px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            },
          }}
        />
      </body>
    </html>
  );
}
