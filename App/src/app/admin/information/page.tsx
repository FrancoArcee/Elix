"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import HeroPreviewCard from "@/components/admin/HeroPreviewCard";
import InfoSectionCard from "@/components/admin/InfoSectionCard";
import InfoRow from "@/components/admin/InfoRow";
import InlineEntryForm from "@/components/admin/InlineEntryForm";
import TextField from "@/components/admin/TextField";
import ImageDropzone from "@/components/admin/ImageDropzone";
import AdminButton from "@/components/admin/AdminButton";
import { useAdminStore } from "@/context/adminStore";

type EntryFormState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; id: string };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
      {children}
    </p>
  );
}

export default function AdminInformationPage() {
  const router = useRouter();
  const isUnauthorized = useAdminStore((state) => state.isUnauthorized);
  const hero = useAdminStore((state) => state.hero);
  const aboutSections = useAdminStore((state) => state.aboutSections);
  const contacts = useAdminStore((state) => state.contacts);
  const paymentMethods = useAdminStore((state) => state.paymentMethods);

  const fetchInformationData = useAdminStore(
    (state) => state.fetchInformationData,
  );
  const updateHero = useAdminStore((state) => state.updateHero);
  const toggleAboutVisibility = useAdminStore(
    (state) => state.toggleAboutVisibility,
  );
  const removeAboutSection = useAdminStore(
    (state) => state.removeAboutSection,
  );
  const addContact = useAdminStore((state) => state.addContact);
  const updateContact = useAdminStore((state) => state.updateContact);
  const removeContact = useAdminStore((state) => state.removeContact);
  const addPaymentMethod = useAdminStore((state) => state.addPaymentMethod);
  const updatePaymentMethod = useAdminStore(
    (state) => state.updatePaymentMethod,
  );
  const removePaymentMethod = useAdminStore(
    (state) => state.removePaymentMethod,
  );

  const [heroEdit, setHeroEdit] = useState(false);
  const [heroForm, setHeroForm] = useState({
    kicker: hero.kicker,
    title: hero.title,
    imageUrl: hero.imageUrl,
  });
  const [contactForm, setContactForm] = useState<EntryFormState>({
    mode: "closed",
  });
  const [paymentForm, setPaymentForm] = useState<EntryFormState>({
    mode: "closed",
  });

  useEffect(() => {
    fetchInformationData();
  }, [fetchInformationData]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/login");
    }
  }, [isUnauthorized, router]);

  useEffect(() => {
    setHeroForm({ kicker: hero.kicker, title: hero.title, imageUrl: hero.imageUrl });
  }, [hero]);

  const closeForms = () => {
    setContactForm({ mode: "closed" });
    setPaymentForm({ mode: "closed" });
  };

  const handleHeroSubmit = async () => {
    await updateHero(heroForm);
    setHeroEdit(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Información" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <section>
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>Inicio</SectionLabel>
              <button
                type="button"
                onClick={() => setHeroEdit(!heroEdit)}
                className="border border-ink/10 px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/35 hover:text-ink"
              >
                {heroEdit ? "Cancelar" : "Editar"}
              </button>
            </div>
            <div className="pt-4">
              {heroEdit ? (
                <div className="w-full max-w-[512px]">
                  <TextField
                    label="Kicker"
                    placeholder="Ej: Nueva colección — 2026"
                    value={heroForm.kicker}
                    onChange={(e) =>
                      setHeroForm((prev) => ({ ...prev, kicker: e.target.value }))
                    }
                  />
                  <div className="pt-5">
                    <TextField
                      label="Título"
                      placeholder="Ej: Descubrí el arte de las fragancias árabes."
                      value={heroForm.title}
                      onChange={(e) =>
                        setHeroForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="pt-5">
                    <ImageDropzone
                      label="Imagen de fondo"
                      value={heroForm.imageUrl ?? undefined}
                      onChange={(url) =>
                        setHeroForm((prev) => ({ ...prev, imageUrl: url ?? "" }))
                      }
                    />
                  </div>
                  <div className="flex flex-col items-stretch gap-3 pt-6 sm:flex-row sm:items-start">
                    <AdminButton
                      type="button"
                      variant="primary"
                      className="h-[39px] min-w-0 flex-1 px-5 py-3"
                      onClick={handleHeroSubmit}
                    >
                      Guardar cambios
                    </AdminButton>
                    <AdminButton
                      type="button"
                      variant="outline"
                      className="h-[39px] px-5 py-3"
                      onClick={() => setHeroEdit(false)}
                    >
                      Cancelar
                    </AdminButton>
                  </div>
                </div>
              ) : (
                <HeroPreviewCard
                  imageUrl={hero.imageUrl}
                  kicker={hero.kicker}
                  title={hero.title}
                />
              )}
            </div>
          </section>

          <section className="pt-10">
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>Nosotros</SectionLabel>
              <Link
                href="/admin/information/new"
                className="border border-ink/10 px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/35 hover:text-ink"
              >
                + Agregar
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {aboutSections.map((section) => (
                <InfoSectionCard
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  title={section.title}
                  visible={section.visible}
                  onToggleVisibility={() =>
                    toggleAboutVisibility(section.id)
                  }
                  onDelete={() => removeAboutSection(section.id)}
                />
              ))}
            </div>
          </section>

          <section className="pt-10">
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>Contacto</SectionLabel>
              <button
                type="button"
                aria-expanded={contactForm.mode === "new"}
                onClick={() =>
                  setContactForm((current) =>
                    current.mode === "new"
                      ? { mode: "closed" }
                      : { mode: "new" },
                  )
                }
                className="border border-ink/10 px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/35 hover:text-ink"
              >
                + Agregar
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {(contactForm.mode === "new" ||
                contactForm.mode === "edit") && (
                <InlineEntryForm
                  key={
                    contactForm.mode === "edit" ? contactForm.id : "new-contact"
                  }
                  title={
                    contactForm.mode === "edit"
                      ? "Editar contacto"
                      : "Nuevo contacto"
                  }
                  fields={[
                    {
                      name: "application",
                      label: "Aplicación",
                      placeholder: "WhatsApp",
                    },
                    {
                      name: "value",
                      label: "Contacto",
                      placeholder: "+54 9 11...",
                    },
                  ]}
                  initialValues={
                    contactForm.mode === "edit"
                      ? (() => {
                          const contact = contacts.find(
                            (item) => item.id === contactForm.id,
                          );
                          return contact
                            ? {
                                application: contact.application,
                                value: contact.value,
                              }
                            : undefined;
                        })()
                      : undefined
                  }
                  onSubmit={(values) => {
                    if (
                      contactForm.mode === "edit"
                    ) {
                      updateContact(contactForm.id, {
                        application: values.application,
                        value: values.value,
                      });
                    } else {
                      addContact({
                        application: values.application,
                        value: values.value,
                      });
                    }
                    closeForms();
                  }}
                  onCancel={closeForms}
                />
              )}
              {contacts.map((contact) => (
                <InfoRow
                  key={contact.id}
                  name={contact.application}
                  value={contact.value}
                  onEdit={() =>
                    setContactForm({ mode: "edit", id: contact.id })
                  }
                  onDelete={() => removeContact(contact.id)}
                />
              ))}
            </div>
          </section>

          <section className="pt-10 pb-14">
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>Métodos de pago</SectionLabel>
              <button
                type="button"
                aria-expanded={paymentForm.mode === "new"}
                onClick={() =>
                  setPaymentForm((current) =>
                    current.mode === "new"
                      ? { mode: "closed" }
                      : { mode: "new" },
                  )
                }
                className="border border-ink/10 px-3 py-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.62px] text-muted transition-colors hover:border-ink/35 hover:text-ink"
              >
                + Agregar
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {(paymentForm.mode === "new" ||
                paymentForm.mode === "edit") && (
                <InlineEntryForm
                  key={
                    paymentForm.mode === "edit" ? paymentForm.id : "new-payment"
                  }
                  title={
                    paymentForm.mode === "edit"
                      ? "Editar método de pago"
                      : "Nuevo método de pago"
                  }
                  fields={[
                    {
                      name: "name",
                      label: "Método",
                      placeholder: "Ej: Efectivo",
                    },
                    {
                      name: "identifier",
                      label: "Identificador",
                      optional: true,
                      placeholder: "CVU, alias, usuario...",
                    },
                  ]}
                  initialValues={
                    paymentForm.mode === "edit"
                      ? (() => {
                          const method = paymentMethods.find(
                            (item) => item.id === paymentForm.id,
                          );
                          return method
                            ? {
                                name: method.name,
                                identifier: method.identifier ?? "",
                              }
                            : undefined;
                        })()
                      : undefined
                  }
                  onSubmit={(values) => {
                    if (paymentForm.mode === "edit") {
                      updatePaymentMethod(paymentForm.id, {
                        name: values.name,
                        identifier: values.identifier || undefined,
                      });
                    } else {
                      addPaymentMethod({
                        name: values.name,
                        identifier: values.identifier || undefined,
                      });
                    }
                    closeForms();
                  }}
                  onCancel={closeForms}
                />
              )}
              {paymentMethods.map((method) => (
                <InfoRow
                  key={method.id}
                  name={method.name}
                  value={method.identifier}
                  onEdit={() =>
                    setPaymentForm({ mode: "edit", id: method.id })
                  }
                  onDelete={() => removePaymentMethod(method.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
