"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import SectionForm from "@/components/admin/SectionForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminNewSectionPage() {
  const router = useRouter();
  const addAboutSection = useAdminStore((state) => state.addAboutSection);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Nueva sección" backHref="/admin/information" />
      <main className="flex flex-1 justify-center px-6 py-8 md:px-10 md:py-10">
        <SectionForm
          mode="create"
          onSubmit={async (values) => {
            await addAboutSection({
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
