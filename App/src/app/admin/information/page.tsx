"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { heroSchema } from "@/schemas/information";
import { contactSchema } from "@/schemas/contact";
import { paymentMethodFormSchema } from "@/schemas/payment-method";
import {
  validateSingleField,
  validateFormData,
  type ValidationErrors,
} from "@/lib/validation";

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

const CONTACT_TYPES = [
  { value: "Instagram", label: "Instagram", fieldLabel: "@ usuario", placeholder: "@tu_usuario" },
  { value: "WhatsApp", label: "WhatsApp", fieldLabel: "Número", placeholder: "+54 9 11 0000-0000" },
  { value: "Facebook", label: "Facebook", fieldLabel: "Usuario", placeholder: "tu_usuario" },
  { value: "TikTok", label: "TikTok", fieldLabel: "@ usuario", placeholder: "@tu_usuario" },
  { value: "Twitter", label: "Twitter", fieldLabel: "@ usuario", placeholder: "@tu_usuario" },
  { value: "YouTube", label: "YouTube", fieldLabel: "Canal", placeholder: "@tu_canal" },
  { value: "Email", label: "Email", fieldLabel: "Email", placeholder: "mail@ejemplo.com" },
  { value: "Teléfono", label: "Teléfono", fieldLabel: "Número", placeholder: "+54 11 0000-0000" },
];

function getContactFieldFor(app: string) {
  return CONTACT_TYPES.find((t) => t.value === app) ?? { fieldLabel: "Dato", placeholder: "" };
}

function buildContactValue(app: string, raw: string): string {
  const lower = app.toLowerCase();
  if (lower === "whatsapp") {
    const phone = raw.replace(/[^0-9+]/g, "");
    return phone.startsWith("+") ? phone.slice(1) : phone;
  }
  if (lower === "instagram" || lower === "tiktok") {
    return raw.replace(/^@/, "").replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com)\//, "").replace(/\/$/, "");
  }
  if (lower === "twitter") {
    return raw.replace(/^@/, "").replace(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//, "").replace(/\/$/, "");
  }
  if (lower === "facebook") {
    return raw.replace(/^https?:\/\/(www\.)?facebook\.com\//, "").replace(/\/$/, "");
  }
  if (lower === "youtube") {
    return raw.replace(/^https?:\/\/(www\.)?youtube\.com\//, "").replace(/\/$/, "");
  }
  return raw;
}

function validateContactValue(app: string, raw: string): string | null {
  const result = contactSchema.safeParse({ application: app, value: raw });
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Dato de contacto inválido";
  }
  return null;
}

function extractRawValue(app: string, stored: string): string {
  const lower = app.toLowerCase();
  if (lower === "whatsapp") {
    return stored.startsWith("+") ? `+${stored}` : stored;
  }
  if (lower === "instagram") {
    return `@${stored.replace(/^@/, "")}`;
  }
  if (lower === "tiktok") {
    return `@${stored.replace(/^@/, "")}`;
  }
  if (lower === "twitter") {
    return `@${stored.replace(/^@/, "")}`;
  }
  return stored;
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
  const moveAboutSection = useAdminStore((state) => state.moveAboutSection);
  const toggleAboutVisibility = useAdminStore(
    (state) => state.toggleAboutVisibility,
  );
  const removeAboutSection = useAdminStore(
    (state) => state.removeAboutSection,
  );
  const addContact = useAdminStore((state) => state.addContact);
  const updateContact = useAdminStore((state) => state.updateContact);
  const setPrimaryContact = useAdminStore((state) => state.setPrimaryContact);
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
  const [heroErrors, setHeroErrors] = useState<ValidationErrors>({});
  const [contactForm, setContactForm] = useState<EntryFormState>({
    mode: "closed",
  });
  const [paymentForm, setPaymentForm] = useState<EntryFormState>({
    mode: "closed",
  });
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactErrors, setContactErrors] = useState<ValidationErrors>({});
  const [contactApp, setContactApp] = useState("");
  const [contactValue, setContactValue] = useState("");

  useEffect(() => {
    fetchInformationData();
  }, [fetchInformationData]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/admin/unauthorized");
    }
  }, [isUnauthorized, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success) {
      const messages: Record<string, string> = {
        created: "Sección creada",
        updated: "Sección actualizada",
      };
      if (messages[success]) toast.success(messages[success]);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    setHeroForm({ kicker: hero.kicker, title: hero.title, imageUrl: hero.imageUrl });
  }, [hero]);

  useEffect(() => {
    if (contactForm.mode === "edit") {
      const contact = contacts.find((c) => c.id === contactForm.id);
      if (contact) {
        setContactApp(contact.application);
        setContactValue(extractRawValue(contact.application, contact.value));
      }
    } else if (contactForm.mode === "new") {
      setContactApp("");
      setContactValue("");
    }
  }, [contactForm, contacts]);

  const closeForms = () => {
    setContactForm({ mode: "closed" });
    setPaymentForm({ mode: "closed" });
    setContactError(null);
    setContactErrors({});
    setContactApp("");
    setContactValue("");
  };

  const handleHeroFieldChange = (
    field: "kicker" | "title" | "imageUrl",
    value: string,
  ) => {
    const next = { ...heroForm, [field]: value };
    setHeroForm(next);
    const err = validateSingleField(heroSchema, field, next);
    setHeroErrors((prev) => ({ ...prev, [field]: err ?? "" }));
  };

  const handleHeroSubmit = async () => {
    const validation = validateFormData(heroSchema, heroForm);
    if (!validation.success) {
      setHeroErrors(validation.errors);
      return;
    }
    await updateHero(validation.data);
    setHeroEdit(false);
    toast.success("Inicio actualizado");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Información" backHref="/admin" />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <section>
            <div className="flex items-center justify-between gap-4">
              <SectionLabel>Inicio</SectionLabel>
              <button
                type="button"
                onClick={() => {
                  setHeroEdit(!heroEdit);
                  setHeroErrors({});
                }}
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
                    error={heroErrors.kicker}
                    onChange={(e) =>
                      handleHeroFieldChange("kicker", e.target.value)
                    }
                  />
                  <div className="pt-5">
                    <TextField
                      label="Título"
                      placeholder="Ej: Descubrí el arte de las fragancias árabes."
                      value={heroForm.title}
                      error={heroErrors.title}
                      onChange={(e) =>
                        handleHeroFieldChange("title", e.target.value)
                      }
                    />
                  </div>
                  <div className="pt-5">
                    <ImageDropzone
                      label="Imagen de fondo"
                      folder="hero"
                      value={heroForm.imageUrl ?? undefined}
                      onChange={(url) =>
                        handleHeroFieldChange("imageUrl", url ?? "")
                      }
                    />
                    {heroErrors.imageUrl && (
                      <p className="pt-1.5 text-[11px] leading-[14px] text-red-500">
                        {heroErrors.imageUrl}
                      </p>
                    )}
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
              {aboutSections
                .slice()
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((section, index, arr) => (
                  <InfoSectionCard
                    key={section.id}
                    id={section.id}
                    label={section.label}
                    title={section.title}
                    visible={section.visible}
                    displayNumber={index + 1}
                    isSystem={section.id === "how_to_buy" || section.isSystem}
                    canMoveUp={index > 0}
                    canMoveDown={index < arr.length - 1}
                    onMoveUp={() => moveAboutSection(section.id, "up")}
                    onMoveDown={() => moveAboutSection(section.id, "down")}
                    onToggleVisibility={
                      section.id === "how_to_buy"
                        ? undefined
                        : () => {
                            toggleAboutVisibility(section.id);
                            toast.success("Visibilidad actualizada");
                          }
                    }
                    onDelete={
                      section.id === "how_to_buy"
                        ? undefined
                        : () => {
                            removeAboutSection(section.id);
                            toast.success("Sección eliminada");
                          }
                    }
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
              {contactForm.mode === "new" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setContactError(null);
                    const trimmed = contactValue.trim();
                    if (!contactApp || !trimmed) {
                      setContactError("Completá todos los campos");
                      return;
                    }
                    const validationError = validateContactValue(contactApp, trimmed);
                    if (validationError) {
                      setContactError(validationError);
                      return;
                    }
                    const value = buildContactValue(contactApp, trimmed);
                    try {
                      await addContact({
                        application: contactApp,
                        value,
                        isPrimary: false,
                      });
                      closeForms();
                      toast.success("Contacto creado");
                    } catch (err: any) {
                      setContactError(err.message ?? "Error al guardar el contacto");
                    }
                  }}
                  className="w-full border border-ink/20 bg-background p-4"
                >
                  <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-muted">
                    Nuevo contacto
                  </p>
                  <div className="grid grid-cols-1 gap-x-3 gap-y-3 pt-4 sm:grid-cols-2">
                    <label className="block w-full">
                      <span className="pb-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.8px] text-ink">
                        Red social
                      </span>
                      <select
                        className="h-[33px] w-full appearance-none border-b border-ink/10 bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors focus:border-ink/40"
                        value={contactApp}
                        onChange={(e) => {
                          setContactApp(e.target.value);
                          setContactValue("");
                        }}
                      >
                        <option value="" disabled>
                          Seleccionar...
                        </option>
                        {CONTACT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {contactApp && (
                      <TextField
                        compact
                        label={getContactFieldFor(contactApp).fieldLabel}
                        placeholder={getContactFieldFor(contactApp).placeholder}
                        value={contactValue}
                        error={contactErrors.value}
                        onChange={(e) => {
                          setContactValue(e.target.value);
                          const err = validateSingleField(contactSchema, "value", {
                            application: contactApp,
                            value: e.target.value,
                          });
                          setContactErrors((prev) => ({ ...prev, value: err ?? "" }));
                          if (contactError) setContactError(null);
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-stretch gap-2 pt-4 sm:flex-row sm:items-start">
                    <AdminButton
                      type="submit"
                      variant="primary"
                      className="h-[31px] min-w-0 flex-1 px-4 py-2"
                    >
                      Guardar
                    </AdminButton>
                    <AdminButton
                      type="button"
                      variant="outline"
                      onClick={closeForms}
                      className="h-[31px] px-4 py-2"
                    >
                      Cancelar
                    </AdminButton>
                  </div>
                </form>
              )}
              {contactError && contactForm.mode === "new" && (
                <p className="text-[11px] leading-[16px] text-red-500">
                  {contactError}
                </p>
              )}
              {contacts.map((contact) => {
                if (contactForm.mode === "edit" && contactForm.id === contact.id) {
                  return (
                    <form
                      key={contact.id}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setContactError(null);
                        const trimmed = contactValue.trim();
                        if (!contactApp || !trimmed) {
                          setContactError("Completá todos los campos");
                          return;
                        }
                        const validationError = validateContactValue(contactApp, trimmed);
                        if (validationError) {
                          setContactError(validationError);
                          return;
                        }
                        const value = buildContactValue(contactApp, trimmed);
                        try {
                          await updateContact(contact.id, {
                            application: contactApp,
                            value,
                          });
                          closeForms();
                          toast.success("Contacto actualizado");
                        } catch (err: any) {
                          setContactError(err.message ?? "Error al guardar el contacto");
                        }
                      }}
                      className="w-full border border-ink/20 bg-background p-4"
                    >
                      <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.25px] text-muted">
                        Editar contacto
                      </p>
                      <div className="grid grid-cols-1 gap-x-3 gap-y-3 pt-4 sm:grid-cols-2">
                        <label className="block w-full">
                          <span className="pb-1.5 text-[9px] font-medium uppercase leading-[13.5px] tracking-[1.8px] text-ink">
                            Red social
                          </span>
                          <select
                            className="h-[33px] w-full appearance-none border-b border-ink/10 bg-transparent py-1.5 text-[14px] text-ink outline-none transition-colors focus:border-ink/40"
                            value={contactApp}
                            onChange={(e) => {
                              setContactApp(e.target.value);
                              setContactValue("");
                            }}
                          >
                            <option value="" disabled>
                              Seleccionar...
                            </option>
                            {CONTACT_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {contactApp && (
                          <TextField
                            compact
                            label={getContactFieldFor(contactApp).fieldLabel}
                            placeholder={getContactFieldFor(contactApp).placeholder}
                            value={contactValue}
                            error={contactErrors.value}
                            onChange={(e) => {
                              setContactValue(e.target.value);
                              const err = validateSingleField(contactSchema, "value", {
                                application: contactApp,
                                value: e.target.value,
                              });
                              setContactErrors((prev) => ({ ...prev, value: err ?? "" }));
                              if (contactError) setContactError(null);
                            }}
                          />
                        )}
                      </div>
                      {contactError && (
                        <p className="pt-2 text-[11px] leading-[16px] text-red-500">
                          {contactError}
                        </p>
                      )}
                      <div className="flex flex-col items-stretch gap-2 pt-4 sm:flex-row sm:items-start">
                        <AdminButton
                          type="submit"
                          variant="primary"
                          className="h-[31px] min-w-0 flex-1 px-4 py-2"
                        >
                          Guardar
                        </AdminButton>
                        <AdminButton
                          type="button"
                          variant="outline"
                          onClick={closeForms}
                          className="h-[31px] px-4 py-2"
                        >
                          Cancelar
                        </AdminButton>
                      </div>
                    </form>
                  );
                }
                return (
                  <InfoRow
                    key={contact.id}
                    name={contact.application}
                    value={contact.value}
                    isPrimary={contact.isPrimary}
                    onEdit={() =>
                      setContactForm({ mode: "edit", id: contact.id })
                    }
                    onDelete={() => {
                      removeContact(contact.id);
                      toast.success("Contacto eliminado");
                    }}
                    onSetPrimary={() => {
                      setPrimaryContact(contact.id);
                      toast.success("Contacto principal actualizado");
                    }}
                  />
                );
              })}
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
                  schema={paymentMethodFormSchema}
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
                      toast.success("Método de pago actualizado");
                    } else {
                      addPaymentMethod({
                        name: values.name,
                        identifier: values.identifier || undefined,
                      });
                      toast.success("Método de pago creado");
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
                  onDelete={() => {
                    removePaymentMethod(method.id);
                    toast.success("Método de pago eliminado");
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
