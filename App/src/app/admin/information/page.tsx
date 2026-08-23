"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import HeroPreviewCard from "@/components/admin/HeroPreviewCard";
import InfoSectionCard from "@/components/admin/InfoSectionCard";
import InfoRow from "@/components/admin/InfoRow";
import InlineEntryForm from "@/components/admin/InlineEntryForm";
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
  const hero = useAdminStore((state) => state.hero);
  const aboutSections = useAdminStore((state) => state.aboutSections);
  const contacts = useAdminStore((state) => state.contacts);
  const paymentMethods = useAdminStore((state) => state.paymentMethods);

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

  const [contactForm, setContactForm] = useState<EntryFormState>({
    mode: "closed",
  });
  const [paymentForm, setPaymentForm] = useState<EntryFormState>({
    mode: "closed",
  });

  const closeForms = () => {
    setContactForm({ mode: "closed" });
    setPaymentForm({ mode: "closed" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Información" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <section>
            <SectionLabel>Inicio</SectionLabel>
            <div className="pt-4">
              <HeroPreviewCard
                imageUrl={hero.imageUrl}
                kicker={hero.kicker}
                title={hero.title}
              />
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
