"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import OfferForm from "@/components/admin/OfferForm";
import OfferCard from "@/components/admin/OfferCard";
import { useAdminStore, type OfferCategory } from "@/context/adminStore";
import type { OfferFormValues } from "@/components/admin/OfferForm";

type FormState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; id: string };

export default function AdminOffersPage() {
  const offers = useAdminStore((state) => state.offers);
  const paymentMethods = useAdminStore((state) => state.paymentMethods);
  const addOffer = useAdminStore((state) => state.addOffer);
  const updateOffer = useAdminStore((state) => state.updateOffer);
  const toggleOfferActive = useAdminStore((state) => state.toggleOfferActive);
  const removeOffer = useAdminStore((state) => state.removeOffer);

  const [form, setForm] = useState<FormState>({ mode: "closed" });

  const activeOffers = offers.filter((offer) => offer.active);
  const otherOffers = offers.filter((offer) => !offer.active);

  const closeForm = () => setForm({ mode: "closed" });

  const editingOffer =
    form.mode === "edit" ? offers.find((offer) => offer.id === form.id) : undefined;

  const formOpen =
    form.mode === "new" || (form.mode === "edit" && Boolean(editingOffer));

  const handleSubmit = (values: OfferFormValues) => {
    const categories =
      values.categories.length > 0
        ? (values.categories as OfferCategory[])
        : (["Toda la colección"] as OfferCategory[]);
    const data = {
      discount: Number(values.discount),
      paymentMethod: values.paymentMethod,
      categories,
      description: values.description,
    };

    if (form.mode === "edit") {
      updateOffer(form.id, data);
    } else {
      addOffer(data);
    }
    closeForm();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Ofertas" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <AdminHeading
            title="Ofertas"
            actionLabel="+ Nueva oferta"
            onAction={() =>
              setForm((current) =>
                current.mode === "closed" ? { mode: "new" } : { mode: "closed" },
              )
            }
          />

          <div className="pt-8">
            <OfferForm
              key={form.mode === "edit" ? form.id : "new-offer"}
              open={formOpen}
              onToggle={closeForm}
              paymentMethods={paymentMethods}
              initialValues={
                editingOffer
                  ? {
                      discount: String(editingOffer.discount),
                      paymentMethod: editingOffer.paymentMethod,
                      categories: editingOffer.categories,
                      description: editingOffer.description,
                    }
                  : undefined
              }
              editing={form.mode === "edit"}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>

          {activeOffers.length > 0 && (
            <section className="pt-8">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ink" />
                <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                  Oferta activa
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-3">
                {activeOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    discount={offer.discount}
                    paymentMethod={offer.paymentMethod}
                    description={offer.description}
                    categories={offer.categories}
                    active
                    onToggleActive={() => toggleOfferActive(offer.id)}
                    onEdit={() => setForm({ mode: "edit", id: offer.id })}
                    onDelete={() => removeOffer(offer.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {otherOffers.length > 0 && (
            <section className="pt-8 pb-14">
              <div className="flex items-center gap-2">
                <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                  Otras ofertas
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-3">
                {otherOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    discount={offer.discount}
                    paymentMethod={offer.paymentMethod}
                    description={offer.description}
                    categories={offer.categories}
                    active={false}
                    onToggleActive={() => toggleOfferActive(offer.id)}
                    onEdit={() => setForm({ mode: "edit", id: offer.id })}
                    onDelete={() => removeOffer(offer.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
