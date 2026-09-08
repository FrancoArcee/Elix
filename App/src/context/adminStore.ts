import { create } from "zustand";
import { UnauthorizedError } from "@/lib/fetch-admin";
import * as heroService from "@/services/hero";
import * as informationService from "@/services/information";
import * as contactsService from "@/services/contacts";
import * as paymentMethodsService from "@/services/payment-methods";

export type HeroContent = {
  kicker: string;
  title: string;
  imageUrl: string;
};

export type AboutSection = {
  id: string;
  label: string;
  title: string;
  description: string;
  imageUrl?: string;
  visible: boolean;
};

export type ContactEntry = {
  id: string;
  application: string;
  value: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  identifier?: string;
};

export type ProductCategory = "Perfumes Árabes" | "Body Splash";

export type ProductOrientation = "Unisex" | "Masculino" | "Femenino";

export type AdminProduct = {
  id: string;
  brand: string;
  name: string;
  image: string;
  images?: string[];
  category: ProductCategory;
  badge?: string;
  outOfStock?: boolean;
  orientation?: ProductOrientation;
  olfactoryFamily?: string;
  price?: number;
  originalPrice?: number;
  sizes?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  description?: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  description?: string;
  image: string;
  color: string;
};

export type OfferCategory = ProductCategory | "Toda la colección";

export type Offer = {
  id: string;
  discount: number;
  paymentMethod: string;
  categories: OfferCategory[];
  description: string;
  active: boolean;
};

type AdminState = {
  hero: HeroContent;
  aboutSections: AboutSection[];
  contacts: ContactEntry[];
  paymentMethods: PaymentMethod[];
  products: AdminProduct[];
  categories: AdminCategory[];
  offers: Offer[];
  isUnauthorized: boolean;
  fetchInformationData: () => Promise<void>;
  updateHero: (data: HeroContent) => Promise<void>;
  addAboutSection: (
    data: Omit<AboutSection, "id" | "visible"> & { visible?: boolean },
  ) => Promise<void>;
  updateAboutSection: (id: string, data: Partial<AboutSection>) => Promise<void>;
  toggleAboutVisibility: (id: string) => Promise<void>;
  removeAboutSection: (id: string) => Promise<void>;
  addContact: (data: Omit<ContactEntry, "id">) => Promise<void>;
  updateContact: (id: string, data: Partial<ContactEntry>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  addPaymentMethod: (data: Omit<PaymentMethod, "id">) => Promise<void>;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  addProduct: (
    data: Omit<AdminProduct, "id"> & { id?: string },
  ) => void;
  updateProduct: (id: string, data: Partial<AdminProduct>) => void;
  addCategory: (data: Omit<AdminCategory, "id">) => void;
  updateCategory: (id: string, data: Partial<AdminCategory>) => void;
  addOffer: (data: Omit<Offer, "id" | "active"> & { active?: boolean }) => void;
  updateOffer: (id: string, data: Partial<Offer>) => void;
  toggleOfferActive: (id: string) => void;
  removeOffer: (id: string) => void;
};

const withAuth =
  (set: (partial: Partial<AdminState>) => void) =>
  async <T>(action: () => Promise<T>): Promise<T | undefined> => {
    try {
      return await action();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return undefined;
      }
      throw error;
    }
  };

export const useAdminStore = create<AdminState>((set, get) => ({
  isUnauthorized: false,
  hero: {
    kicker: "",
    title: "",
    imageUrl: "",
  },
  aboutSections: [],
  contacts: [],
  paymentMethods: [],
  products: [
    {
      id: "oud-royale",
      brand: "Lattafa",
      name: "Oud Royale",
      image: "/images/product-oud-royale.png",
      category: "Perfumes Árabes",
      badge: "Más vendido",
    },
    {
      id: "baccarat-rouge",
      brand: "Maison Alhambra",
      name: "Baccarat Rouge",
      image: "/images/product-baccarat-rouge.png",
      category: "Perfumes Árabes",
      badge: "Oferta",
    },
    {
      id: "velvet-rose",
      brand: "Swiss Arabian",
      name: "Velvet Rose",
      image: "/images/product-velvet-rose.png",
      category: "Perfumes Árabes",
      badge: "Nuevo",
    },
    {
      id: "noir-intense",
      brand: "Ajmal",
      name: "Noir Intense",
      image: "/images/product-noir-intense.png",
      category: "Perfumes Árabes",
    },
    {
      id: "bloom-bliss",
      brand: "ELIX Collection",
      name: "Bloom Bliss",
      image: "/images/product-bloom-bliss.png",
      category: "Body Splash",
      badge: "Más vendido",
    },
    {
      id: "amber-luxe",
      brand: "Lattafa",
      name: "Amber Luxe",
      image: "/images/product-amber-luxe.png",
      category: "Perfumes Árabes",
      badge: "Oferta",
      outOfStock: true,
    },
    {
      id: "fresh-bloom",
      brand: "ELIX Collection",
      name: "Fresh Bloom",
      image: "/images/product-fresh-bloom.png",
      category: "Body Splash",
    },
    {
      id: "sweet-velvet",
      brand: "ELIX Collection",
      name: "Sweet Velvet",
      image: "/images/product-sweet-velvet.png",
      category: "Body Splash",
      badge: "Nuevo",
    },
  ],
  categories: [
    {
      id: "perfumes-arabes",
      name: "Perfumes Árabes",
      image: "/images/cat-perfumes-arabes.png",
      color: "#F2F1EE",
    },
    {
      id: "body-splash",
      name: "Body Splash",
      image: "/images/cat-body-splash.png",
      color: "#EDE8E3",
    },
  ],
  offers: [
    {
      id: "offer-efectivo",
      discount: 20,
      paymentMethod: "Efectivo",
      categories: ["Toda la colección"],
      description: "20% off pagando en efectivo en toda la colección.",
      active: true,
    },
    {
      id: "offer-debito",
      discount: 10,
      paymentMethod: "Tarjeta de débito",
      categories: ["Perfumes Árabes"],
      description: "10% off en perfumes árabes con débito.",
      active: false,
    },
  ],

  fetchInformationData: async () => {
    set({ isUnauthorized: false });
    try {
      const [heroData, infoData, contactData, pmData] = await Promise.all([
        heroService.getHero(),
        informationService.getAdminInformation(),
        contactsService.getAdminContacts(),
        paymentMethodsService.getAdminPaymentMethods(),
      ]);

      set({
        hero: heroData
          ? { kicker: heroData.kicker, title: heroData.title, imageUrl: heroData.imageUrl }
          : get().hero,
        aboutSections: infoData.map((s) => ({
          id: s.id,
          label: s.label,
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl ?? undefined,
          visible: s.visible,
        })),
        contacts: contactData.map((c) => ({
          id: c.id,
          application: c.application,
          value: c.value,
        })),
        paymentMethods: pmData.map((p) => ({
          id: p.id,
          name: p.method,
          identifier: p.identifier ?? undefined,
        })),
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch information data:", error);
    }
  },

  updateHero: async (data) => {
    await withAuth(set)(async () => {
      await heroService.updateHero(data);
      set({ hero: data });
    });
  },

  addAboutSection: async (data) => {
    await withAuth(set)(async () => {
      const created = await informationService.createInformation({
        label: data.label,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? null,
        visible: data.visible ?? true,
      });
      set((state) => ({
        aboutSections: [
          ...state.aboutSections,
          {
            id: created.id,
            label: created.label,
            title: created.title,
            description: created.description,
            imageUrl: created.imageUrl ?? undefined,
            visible: created.visible,
          },
        ],
      }));
    });
  },

  updateAboutSection: async (id, data) => {
    await withAuth(set)(async () => {
      await informationService.updateInformation(id, {
        label: data.label,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        visible: data.visible,
      });
      set((state) => ({
        aboutSections: state.aboutSections.map((section) =>
          section.id === id ? { ...section, ...data } : section,
        ),
      }));
    });
  },

  toggleAboutVisibility: async (id) => {
    await withAuth(set)(async () => {
      const updated = await informationService.toggleInformationVisibility(id);
      set((state) => ({
        aboutSections: state.aboutSections.map((section) =>
          section.id === id ? { ...section, visible: updated.visible } : section,
        ),
      }));
    });
  },

  removeAboutSection: async (id) => {
    await withAuth(set)(async () => {
      await informationService.deleteInformation(id);
      set((state) => ({
        aboutSections: state.aboutSections.filter((section) => section.id !== id),
      }));
    });
  },

  addContact: async (data) => {
    await withAuth(set)(async () => {
      const created = await contactsService.createContact(data);
      set((state) => ({
        contacts: [
          ...state.contacts,
          { id: created.id, application: created.application, value: created.value },
        ],
      }));
    });
  },

  updateContact: async (id, data) => {
    await withAuth(set)(async () => {
      await contactsService.updateContact(id, data);
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.id === id ? { ...contact, ...data } : contact,
        ),
      }));
    });
  },

  removeContact: async (id) => {
    await withAuth(set)(async () => {
      await contactsService.deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== id),
      }));
    });
  },

  addPaymentMethod: async (data) => {
    await withAuth(set)(async () => {
      const created = await paymentMethodsService.createPaymentMethod({
        method: data.name,
        identifier: data.identifier ?? null,
      });
      set((state) => ({
        paymentMethods: [
          ...state.paymentMethods,
          { id: created.id, name: created.method, identifier: created.identifier ?? undefined },
        ],
      }));
    });
  },

  updatePaymentMethod: async (id, data) => {
    await withAuth(set)(async () => {
      await paymentMethodsService.updatePaymentMethod(id, {
        method: data.name,
        identifier: data.identifier,
      });
      set((state) => ({
        paymentMethods: state.paymentMethods.map((method) =>
          method.id === id ? { ...method, ...data } : method,
        ),
      }));
    });
  },

  removePaymentMethod: async (id) => {
    await withAuth(set)(async () => {
      await paymentMethodsService.deletePaymentMethod(id);
      set((state) => ({
        paymentMethods: state.paymentMethods.filter((method) => method.id !== id),
      }));
    });
  },

  addProduct: (data) =>
    set((state) => ({
      products: [
        { ...data, id: data.id ?? crypto.randomUUID() },
        ...state.products,
      ],
    })),
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...data } : product,
      ),
    })),
  addCategory: (data) =>
    set((state) => ({
      categories: [...state.categories, { ...data, id: crypto.randomUUID() }],
    })),
  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...data } : category,
      ),
    })),
  addOffer: (data) =>
    set((state) => ({
      offers: [
        ...state.offers,
        {
          ...data,
          id: crypto.randomUUID(),
          active: data.active ?? true,
          categories: data.categories.length ? data.categories : ["Toda la colección"],
        },
      ],
    })),
  updateOffer: (id, data) =>
    set((state) => ({
      offers: state.offers.map((offer) =>
        offer.id === id ? { ...offer, ...data } : offer,
      ),
    })),
  toggleOfferActive: (id) =>
    set((state) => ({
      offers: state.offers.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer,
      ),
    })),
  removeOffer: (id) =>
    set((state) => ({
      offers: state.offers.filter((offer) => offer.id !== id),
    })),
}));
