import ProductDetail, {
  type ProductDetailProps,
} from "@/components/products/ProductDetail";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const CATALOG = {
  "amber-luxe": {
    brand: "Lattafa",
    name: "Amber Luxe",
    image: "/images/product-amber-luxe.png",
  },
  "oud-royale": {
    brand: "Lattafa",
    name: "Oud Royale",
    image: "/images/product-oud-royale.png",
  },
  "baccarat-rouge": {
    brand: "Maison Alhambra",
    name: "Baccarat Rouge",
    image: "/images/product-baccarat-rouge.png",
  },
  "noir-intense": {
    brand: "Ajmal",
    name: "Noir Intense",
    image: "/images/product-noir-intense.png",
  },
  "velvet-rose": {
    brand: "Swiss Arabian",
    name: "Velvet Rose",
    image: "/images/product-velvet-rose.png",
  },
  "bloom-bliss": {
    brand: "ELIX Collection",
    name: "Bloom Bliss",
    image: "/images/product-bloom-bliss.png",
  },
  "fresh-bloom": {
    brand: "ELIX Collection",
    name: "Fresh Bloom",
    image: "/images/product-fresh-bloom.png",
  },
  "sweet-velvet": {
    brand: "ELIX Collection",
    name: "Sweet Velvet",
    image: "/images/product-sweet-velvet.png",
  },
} as const;

const RELATED_PRODUCTS: Omit<ProductDetailProps["related"][number], "key">[] = [
  {
    image: "/images/product-baccarat-rouge.png",
    brand: "Maison Alhambra",
    name: "Baccarat Rouge",
    badge: "Oferta",
    surface: "surface",
    href: "/products/baccarat-rouge",
  },
  {
    image: "/images/product-velvet-rose.png",
    brand: "Swiss Arabian",
    name: "Velvet Rose",
    badge: "Nuevo",
    surface: "surface",
    href: "/products/velvet-rose",
  },
  {
    image: "/images/product-noir-intense.png",
    brand: "Ajmal",
    name: "Noir Intense",
    surface: "surface",
    href: "/products/noir-intense",
  },
  {
    image: "/images/product-bloom-bliss.png",
    brand: "ELIX Collection",
    name: "Bloom Bliss",
    badge: "Más vendido",
    surface: "surface-alt",
    href: "/products/bloom-bliss",
  },
];

const SIZES = ["30ml", "50ml", "100ml"];

const BENEFITS = [
  {
    icon: "/icons/icon-shipping-muted.svg",
    text: "Envío gratis en La Plata casco urbano",
  },
  {
    icon: "/icons/icon-shield-check.svg",
    text: "Productos importados 100% auténticos",
  },
  {
    icon: "/icons/icon-chat-muted.svg",
    text: "Cotización instantánea con servicio particular",
  },
];

const OUD_ROYALE_NOTES = [
  { label: "Salida", notes: ["Bergamota", "Cardamomo"] },
  { label: "Corazón", notes: ["Oud", "Rosa de Damasco"] },
  { label: "Fondo", notes: ["Almizcle", "Ámbar gris"] },
];

type DetailData = Omit<
  ProductDetailProps,
  "brand" | "name" | "image" | "related"
>;

const DETAILS: Record<string, DetailData> = {
  "oud-royale": {
    sizes: SIZES,
    defaultSize: "100ml",
    benefits: BENEFITS,
    olfactoryNotes: OUD_ROYALE_NOTES,
    description:
      "Fragancia árabe oriental y amaderada que combina la profundidad del oud con la frescura de la bergamota y el cardamomo, cerrando en un fondo cálido de almizcle y ámbar gris. Una estela intensa y elegante, pensada para las ocasiones donde querés dejar huella.",
    characteristics: [
      "Disponible en 30ml, 50ml y 100ml",
      "Producto importado 100% auténtico",
      "Envío gratis en La Plata casco urbano",
      "Cotización instantánea con servicio particular",
    ],
  },
};

const DEFAULT_DETAIL: DetailData = {
  sizes: SIZES,
  defaultSize: "100ml",
  benefits: BENEFITS,
  olfactoryNotes: [],
};

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const product = CATALOG[id as keyof typeof CATALOG] ?? CATALOG["oud-royale"];
  const detail = DETAILS[id] ?? DEFAULT_DETAIL;

  return (
    <ProductDetail
      brand={product.brand}
      name={product.name}
      image={product.image}
      sizes={detail.sizes}
      defaultSize={detail.defaultSize}
      benefits={detail.benefits}
      olfactoryNotes={detail.olfactoryNotes}
      description={detail.description}
      characteristics={detail.characteristics}
      related={RELATED_PRODUCTS}
    />
  );
}
