"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Skeleton from "@/components/ui/Skeleton";
import SectionForm from "@/components/admin/SectionForm";
import { useAdminStore } from "@/context/adminStore";

export default function AdminEditSectionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sectionId = params.id;

  const aboutSections = useAdminStore((state) => state.aboutSections);
  const section = aboutSections.find((item) => item.id === sectionId);
  const updateAboutSection = useAdminStore((state) => state.updateAboutSection);
  const fetchInformationData = useAdminStore((state) => state.fetchInformationData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchInformationData().then(() => setReady(true));
  }, [fetchInformationData]);

  useEffect(() => {
    if (ready && !section) {
      notFound();
    }
  }, [ready, section]);

  if (!ready || !section) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminHeader title="Editar sección" backHref="/admin/information" />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-[672px]">
            <div className="border border-ink/10 bg-background p-5 space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-24" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="aspect-[16/9] w-full" />
              </div>
            </div>
          </div>
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
          onSubmit={async (values) => {
            await updateAboutSection(sectionId, {
              label: values.label,
              title: values.title,
              description: values.description,
              imageUrl: values.imageUrl || undefined,
            });
            router.push("/admin/information?success=updated");
          }}
          onCancel={() => router.push("/admin/information")}
        />
      </main>
    </div>
  );
}
