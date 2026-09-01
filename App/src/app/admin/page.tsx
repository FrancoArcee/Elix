import type { Metadata } from "next";
import AdminHeader from "@/components/admin/AdminHeader";
import PanelCard from "@/components/admin/PanelCard";

export const metadata: Metadata = {
  title: "ELIX — Panel de administrador",
};

const PANEL_SECTIONS = [
  {
    title: "Productos",
    description: "Agregá, editá o eliminá productos del catálogo",
    href: "/admin/products",
  },
  {
    title: "Categorías",
    description: "Gestioná las categorías disponibles en la tienda",
    href: "/admin/categories",
  },
  {
    title: "Ofertas",
    description: "Configurá descuentos y promociones activas",
    href: "/admin/offers",
  },
  {
    title: "Información",
    description:
      "Editá el contenido de la sección Nosotros y datos de contacto",
    href: "/admin/information",
  },
];

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader variant="home" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid w-full max-w-[672px] grid-cols-1 gap-4 sm:grid-cols-2">
          {PANEL_SECTIONS.map((section) => (
            <PanelCard
              key={section.title}
              title={section.title}
              description={section.description}
              href={section.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
