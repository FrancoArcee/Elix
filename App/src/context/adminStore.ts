import { create } from "zustand";
import { UnauthorizedError } from "@/lib/fetch-admin";
import * as heroService from "@/services/hero";
import * as informationService from "@/services/information";
import * as contactsService from "@/services/contacts";
import * as paymentMethodsService from "@/services/payment-methods";
import * as categoryService from "@/services/categories";
import * as offerService from "@/services/offers";
import * as productService from "@/services/products";
import * as brandService from "@/services/brands";
import * as featuredService from "@/services/featured";

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
  brandId: string;
  name: string;
  image: string;
  images?: string[];
  category: ProductCategory;
  categoryId: string;
  badge?: string;
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

export type AdminBrand = {
  id: string;
  name: string;
};

export type AdminFeatured = {
  id: string;
  productId: string;
  displayOrder: number;
  product: {
    id: string;
    name: string;
    brand: string;
    image: string | null;
  };
};

export type OfferCategory = ProductCategory | "Toda la colección";

export type Offer = {
  id: string;
  discount: number;
  paymentMethod: string;
  categories: string[];
  description: string;
  active: boolean;
};

type AdminState = {
  hero: HeroContent;
  aboutSections: AboutSection[];
  contacts: ContactEntry[];
  paymentMethods: PaymentMethod[];
  products: AdminProduct[];
  brands: AdminBrand[];
  featured: AdminFeatured[];
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
  fetchProducts: () => Promise<void>;
  addProduct: (data: {
    name: string;
    brandId: string;
    categoryId: string;
    targetAudience: string;
    description?: string;
    price?: number;
    fraganceFamily?: string;
    presentation?: string;
    concentration?: string;
    images?: { url: string }[];
    notes?: { noteName: string; type: string }[];
  }) => Promise<void>;
  updateProduct: (id: string, data: {
    name: string;
    brandId: string;
    categoryId: string;
    targetAudience: string;
    description?: string;
    price?: number;
    fraganceFamily?: string;
    presentation?: string;
    concentration?: string;
    images?: { url: string }[];
    notes?: { noteName: string; type: string }[];
  }) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  fetchBrands: () => Promise<void>;
  addBrand: (data: { name: string }) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  addFeatured: (productId: string) => Promise<void>;
  removeFeatured: (productId: string) => Promise<void>;
  reorderFeatured: (orderedIds: string[]) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addCategory: (data: Omit<AdminCategory, "id">) => Promise<void>;
  updateCategory: (id: string, data: Partial<AdminCategory>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  fetchOffers: () => Promise<void>;
  addOffer: (data: Omit<Offer, "id" | "active"> & { active?: boolean }) => Promise<void>;
  updateOffer: (id: string, data: Partial<Offer>) => Promise<void>;
  toggleOfferActive: (id: string) => Promise<void>;
  removeOffer: (id: string) => Promise<void>;
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
  products: [],
  brands: [],
  featured: [],
  categories: [],
  offers: [],

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

  fetchProducts: async () => {
    set({ isUnauthorized: false });
    try {
      const data = await productService.getAdminProducts();
      set({
        products: data.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          brandId: p.brandId,
          category: p.category as ProductCategory,
          categoryId: p.categoryId,
          image: p.image ?? "/images/product-oud-royale.png",
          images: Array.isArray(p.images)
            ? p.images.map((img: string | { url: string }) => typeof img === "string" ? img : img.url)
            : [],
          price: p.price ?? undefined,
          fraganceFamily: p.fraganceFamily ?? undefined,
          concentration: p.concentration ?? undefined,
          orientation: p.targetAudience === "masculino" ? "Masculino" : p.targetAudience === "femenino" ? "Femenino" : "Unisex",
          presentation: p.presentation ?? undefined,
          description: p.description ?? undefined,
        })),
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch products:", error);
    }
  },

  addProduct: async (data) => {
    await withAuth(set)(async () => {
      const created = await productService.createProduct(data);
      set((state) => ({
        products: [
          {
            id: created.id,
            name: created.name,
            brand: created.brand,
            brandId: created.brandId,
            category: created.category as ProductCategory,
            categoryId: created.categoryId,
            image: created.image ?? "/images/product-oud-royale.png",
            images: Array.isArray(created.images)
              ? created.images.map((img: string | { url: string }) => typeof img === "string" ? img : img.url)
              : [],
            price: created.price ?? undefined,
            fraganceFamily: created.fraganceFamily ?? undefined,
            concentration: created.concentration ?? undefined,
            orientation: created.targetAudience === "masculino" ? "Masculino" : created.targetAudience === "femenino" ? "Femenino" : "Unisex",
            presentation: created.presentation ?? undefined,
            description: created.description ?? undefined,
          },
          ...state.products,
        ],
      }));
    });
  },

  updateProduct: async (id, data) => {
    await withAuth(set)(async () => {
      const updated = await productService.updateProduct(id, data);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id
            ? {
                ...product,
                name: updated.name,
                brand: updated.brand,
                brandId: updated.brandId,
                category: updated.category as ProductCategory,
                categoryId: updated.categoryId,
                image: updated.image ?? product.image,
                images: Array.isArray(updated.images)
                  ? updated.images.map((img: string | { url: string }) => typeof img === "string" ? img : img.url)
                  : product.images,
                price: updated.price ?? undefined,
                fraganceFamily: updated.fraganceFamily ?? undefined,
                concentration: updated.concentration ?? undefined,
                orientation: updated.targetAudience === "masculino" ? "Masculino" : updated.targetAudience === "femenino" ? "Femenino" : "Unisex",
                presentation: updated.presentation ?? undefined,
                description: updated.description ?? undefined,
              }
            : product,
        ),
      }));
    });
  },

  removeProduct: async (id) => {
    await withAuth(set)(async () => {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    });
  },

  fetchBrands: async () => {
    set({ isUnauthorized: false });
    try {
      const data = await brandService.getAdminBrands();
      set({ brands: data });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch brands:", error);
    }
  },

  addBrand: async (data) => {
    await withAuth(set)(async () => {
      const created = await brandService.createBrand(data);
      set((state) => ({
        brands: [...state.brands, created].sort((a, b) => a.name.localeCompare(b.name)),
      }));
    });
  },

  fetchFeatured: async () => {
    set({ isUnauthorized: false });
    try {
      const data = await featuredService.getAdminFeatured();
      set({ featured: data });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch featured products:", error);
    }
  },

  addFeatured: async (productId) => {
    await withAuth(set)(async () => {
      const created = await featuredService.addFeatured(productId);
      set((state) => ({
        featured: [...state.featured, created].sort((a, b) => a.displayOrder - b.displayOrder),
      }));
    });
  },

  removeFeatured: async (productId) => {
    await withAuth(set)(async () => {
      await featuredService.removeFeatured(productId);
      set((state) => ({
        featured: state.featured.filter((f) => f.productId !== productId),
      }));
    });
  },

  reorderFeatured: async (orderedIds) => {
    await withAuth(set)(async () => {
      await featuredService.reorderFeatured(orderedIds);
      set((state) => ({
        featured: state.featured
          .map((f) => ({
            ...f,
            displayOrder: orderedIds.indexOf(f.productId),
          }))
          .sort((a, b) => a.displayOrder - b.displayOrder),
      }));
    });
  },
  fetchCategories: async () => {
    set({ isUnauthorized: false });
    try {
      const data = await categoryService.getAdminCategories();
      set({
        categories: data.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          image: c.urlImage ?? "",
          color: c.color,
        })),
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch categories:", error);
    }
  },

  addCategory: async (data) => {
    await withAuth(set)(async () => {
      const created = await categoryService.createCategory({
        name: data.name,
        description: data.description ?? "",
        color: data.color,
        urlImage: data.image || null,
      });
      set((state) => ({
        categories: [
          ...state.categories,
          {
            id: created.id,
            name: created.name,
            description: created.description,
            image: created.urlImage ?? "",
            color: created.color,
          },
        ],
      }));
    });
  },

  updateCategory: async (id, data) => {
    await withAuth(set)(async () => {
      await categoryService.updateCategory(id, {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.image !== undefined && { urlImage: data.image || null }),
      });
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...data } : category,
        ),
      }));
    });
  },

  removeCategory: async (id) => {
    await withAuth(set)(async () => {
      await categoryService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }));
    });
  },
  addOffer: async (data) => {
    await withAuth(set)(async () => {
      const created = await offerService.createOffer({
        discount: data.discount,
        paymentMethod: data.paymentMethod,
        categories: data.categories.length ? data.categories : ["Toda la colección"],
        description: data.description,
        active: data.active ?? true,
      });
      set((state) => ({
        offers: [created, ...state.offers],
      }));
    });
  },
  updateOffer: async (id, data) => {
    await withAuth(set)(async () => {
      const updated = await offerService.updateOffer(id, {
        ...(data.discount !== undefined && { discount: data.discount }),
        ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
        ...(data.categories !== undefined && { categories: data.categories }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.active !== undefined && { active: data.active }),
      });
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === id ? updated : offer
        ),
      }));
    });
  },
  toggleOfferActive: async (id) => {
    await withAuth(set)(async () => {
      const current = get().offers.find((o) => o.id === id);
      if (!current) return;
      const updated = await offerService.updateOffer(id, { active: !current.active });
      const allOffers = await offerService.getAdminOffers();
      set({ offers: allOffers });
    });
  },
  removeOffer: async (id) => {
    await withAuth(set)(async () => {
      await offerService.deleteOffer(id);
      set((state) => ({
        offers: state.offers.filter((offer) => offer.id !== id),
      }));
    });
  },
  fetchOffers: async () => {
    set({ isUnauthorized: false });
    try {
      const data = await offerService.getAdminOffers();
      set({ offers: data });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set({ isUnauthorized: true });
        return;
      }
      console.error("Failed to fetch offers:", error);
    }
  },
}));
