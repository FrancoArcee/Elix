import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
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
      </body>
    </html>
  );
}
