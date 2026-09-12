import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import LegalDrawer from "@/components/layout/LegalDrawer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
        className={`${dmSans.variable} bg-background font-sans text-ink antialiased`}
      >
        {children}
        <LegalDrawer />
      </body>
    </html>
  );
}
