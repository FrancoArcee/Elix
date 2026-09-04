"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminHeading from "@/components/admin/AdminHeading";
import OfferCreateCard from "@/components/admin/OfferCreateCard";
import OfferCard from "@/components/admin/OfferCard";
import OfferEmptyState from "@/components/admin/OfferEmptyState";
import { useAdminStore, type OfferCategory } from "@/context/adminStore";
import type { OfferFormValues } from "@/components/admin/OfferForm";

export default function AdminOffersPage() {
  const offers = useAdminStore((state) => state.offers);
  const paymentMethods = useAdminStore((state) => state.paymentMethods);
  const addOffer = useAdminStore((state) => state.addOffer);
  const updateOffer = useAdminStore((state) => state.updateOffer);
  const toggleOfferActive = useAdminStore((state) => state.toggleOfferActive);
  const removeOffer = useAdminStore((state) => state.removeOffer);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeOffers = offers.filter((offer) => offer.active);
  const otherOffers = offers.filter((offer) => !offer.active);

  const openCreate = () => {
    setEditingId(null);
    setCreateOpen(true);
  };

  const handleCreate = (values: OfferFormValues) => {
    addOffer({
      discount: Number(values.discount),
      paymentMethod: values.paymentMethod,
      categories: values.categories as OfferCategory[],
      description: values.description,
    });
    setCreateOpen(false);
  };

  const handleEdit = (id: string, values: OfferFormValues) => {
    updateOffer(id, {
      discount: Number(values.discount),
      paymentMethod: values.paymentMethod,
      categories: values.categories as OfferCategory[],
      description: values.description,
    });
    setEditingId(null);
  };

  const renderCard = (offer: (typeof offers)[number]) => {
    const editing = editingId === offer.id;
    return (
      <OfferCard
        key={offer.id}
        discount={offer.discount}
        paymentMethod={offer.paymentMethod}
        description={offer.description}
        categories={offer.categories}
        active={offer.active}
        editing={editing}
        paymentMethods={paymentMethods}
        onToggleActive={() => toggleOfferActive(offer.id)}
        onEdit={() => {
          setCreateOpen(false);
          setEditingId(editing ? null : offer.id);
        }}
        onDelete={() => removeOffer(offer.id)}
        onSubmit={(values) => handleEdit(offer.id, values)}
        onCancelEdit={() => setEditingId(null)}
      />
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader title="Ofertas" backHref="/admin" />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <AdminHeading title="Ofertas" />

          <div className="pt-8">
            <OfferCreateCard
              open={createOpen}
              onToggle={() => {
                setEditingId(null);
                setCreateOpen((current) => !current);
              }}
              paymentMethods={paymentMethods}
              onSubmit={handleCreate}
              onCancel={() => setCreateOpen(false)}
            />
          </div>

          {activeOffers.length > 0 ? (
            <section className="pt-8">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ink" />
                <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                  Oferta activa
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-3">
                {activeOffers.map(renderCard)}
              </div>
            </section>
          ) : (
            <div className="pt-8">
              <OfferEmptyState />
            </div>
          )}

          {otherOffers.length > 0 && (
            <section className="pt-8 pb-14">
              <div className="flex items-center gap-2">
                <p className="text-[9px] uppercase leading-[13.5px] tracking-[2.7px] text-muted">
                  Otras ofertas
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-3">
                {otherOffers.map(renderCard)}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
