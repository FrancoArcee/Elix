import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
