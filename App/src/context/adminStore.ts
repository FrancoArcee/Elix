import { create } from "zustand";

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

export type AdminProduct = {
  id: string;
  brand: string;
  name: string;
  image: string;
  category: ProductCategory;
  badge?: string;
  outOfStock?: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  description?: string;
  image: string;
  color: string;
};

type AdminState = {
  hero: HeroContent;
  aboutSections: AboutSection[];
  contacts: ContactEntry[];
  paymentMethods: PaymentMethod[];
  products: AdminProduct[];
  categories: AdminCategory[];
  addAboutSection: (
    data: Omit<AboutSection, "id" | "visible"> & { visible?: boolean },
  ) => void;
  updateAboutSection: (id: string, data: Partial<AboutSection>) => void;
  toggleAboutVisibility: (id: string) => void;
  removeAboutSection: (id: string) => void;
  addContact: (data: Omit<ContactEntry, "id">) => void;
  updateContact: (id: string, data: Partial<ContactEntry>) => void;
  removeContact: (id: string) => void;
  addPaymentMethod: (data: Omit<PaymentMethod, "id">) => void;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  addCategory: (data: Omit<AdminCategory, "id">) => void;
  updateCategory: (id: string, data: Partial<AdminCategory>) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const useAdminStore = create<AdminState>((set) => ({
  hero: {
    kicker: "Nueva colección — 2026",
    title: "Descubrí el arte de las fragancias árabes.",
    imageUrl: "/images/hero-coleccion.png",
  },
  aboutSections: [
    {
      id: "quienes-somos",
      label: "Quiénes somos",
      title: "ELIX nació de la pasión por las fragancias.",
      description:
        "Somos un emprendimiento argentino especializado en perfumería árabe y body splash. Importamos fragancias seleccionadas de Oriente Medio para acercarlas a quienes, como nosotros, se enamoran de un buen perfume.",
      visible: true,
    },
    {
      id: "el-equipo",
      label: "El equipo",
      title: "Genaro y Manuel, dos personas detrás de cada fragancia.",
      description:
        "Detrás de ELIX hay dos amigos que convirtieron su admiración por la perfumería árabe en un proyecto diario.",
      visible: true,
    },
  ],
  contacts: [
    { id: "contact-whatsapp", application: "WhatsApp", value: "+54 9 11 0000-0000" },
    { id: "contact-instagram", application: "Instagram", value: "@elix.fragancias" },
  ],
  paymentMethods: [
    { id: "payment-efectivo", name: "Efectivo", identifier: undefined },
    {
      id: "payment-transferencia",
      name: "Transferencia bancaria",
      identifier: "CVU: 0000000000000000000000",
    },
  ],
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
  addAboutSection: (data) =>
    set((state) => ({
      aboutSections: [
        ...state.aboutSections,
        { ...data, id: createId(), visible: data.visible ?? true },
      ],
    })),
  updateAboutSection: (id, data) =>
    set((state) => ({
      aboutSections: state.aboutSections.map((section) =>
        section.id === id ? { ...section, ...data } : section,
      ),
    })),
  toggleAboutVisibility: (id) =>
    set((state) => ({
      aboutSections: state.aboutSections.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section,
      ),
    })),
  removeAboutSection: (id) =>
    set((state) => ({
      aboutSections: state.aboutSections.filter((section) => section.id !== id),
    })),
  addContact: (data) =>
    set((state) => ({
      contacts: [...state.contacts, { ...data, id: createId() }],
    })),
  updateContact: (id, data) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...data } : contact,
      ),
    })),
  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    })),
  addPaymentMethod: (data) =>
    set((state) => ({
      paymentMethods: [...state.paymentMethods, { ...data, id: createId() }],
    })),
  updatePaymentMethod: (id, data) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.map((method) =>
        method.id === id ? { ...method, ...data } : method,
      ),
    })),
  removePaymentMethod: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((method) => method.id !== id),
    })),
  addCategory: (data) =>
    set((state) => ({
      categories: [...state.categories, { ...data, id: createId() }],
    })),
  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...data } : category,
      ),
    })),
}));
