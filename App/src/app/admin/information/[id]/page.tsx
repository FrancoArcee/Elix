"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import SectionForm from "@/components/admin/SectionForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditSectionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sectionId = params.id;

  const section = useAdminStore((state) =>
    state.aboutSections.find((item) => item.id === sectionId),
  );
  const updateAboutSection = useAdminStore((state) => state.updateAboutSection);

  if (!section) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Editar sección" backHref="/admin/information" />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="text-[12px] text-muted">Sección no encontrada.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Editar sección" backHref="/admin/information" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <SectionForm
          mode="edit"
          initialValues={{
            label: section.label,
            title: section.title,
            description: section.description,
            imageUrl: section.imageUrl ?? "",
          }}
          onSubmit={(values) => {
            updateAboutSection(sectionId, {
              label: values.label,
              title: values.title,
              description: values.description,
              imageUrl: values.imageUrl || undefined,
            });
            router.push("/admin/information");
          }}
          onCancel={() => router.push("/admin/information")}
        />
      </main>
    </div>
  );
}
