const { PrismaClient } = require("@prisma/client")
const { randomUUID } = require("crypto")
const { hashPassword } = require("@better-auth/utils/password")

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD env vars are required.")
  process.exit(1)
}

async function seedAdmin() {
  let user = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  })

  const passwordHash = await hashPassword(ADMIN_PASSWORD)

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: `u_${randomUUID()}`,
        name: "Administrador Elix",
        email: ADMIN_EMAIL,
        role: "admin",
      },
    })
  }

  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  })

  if (account) {
    if (account.password !== passwordHash) {
      await prisma.account.update({
        where: { id: account.id },
        data: { password: passwordHash },
      })
      await prisma.session.deleteMany({ where: { userId: user.id } })
      console.log(`Admin password updated: ${ADMIN_EMAIL}`)
    } else {
      console.log(`Admin user ${ADMIN_EMAIL} already exists.`)
    }
    return
  }

  await prisma.account.create({
    data: {
      id: `a_${randomUUID()}`,
      providerId: "credential",
      issuer: "local:credential",
      accountId: user.id,
      userId: user.id,
      password: passwordHash,
    },
  })

  console.log(`Credential account created for ${ADMIN_EMAIL}`)
}

async function seedHero() {
  const existing = await prisma.hero.findFirst()
  if (existing) {
    console.log("Hero already exists, skipping.")
    return
  }

  await prisma.hero.create({
    data: {
      id: `hero_${randomUUID()}`,
      kicker: "Nueva colección — 2026",
      title: "Descubrí el arte de las fragancias árabes.",
      imageUrl: "/images/hero-coleccion.png",
    },
  })
  console.log("Hero seeded.")
}

async function seedInformation() {
  const count = await prisma.information.count()
  if (count > 0) {
    console.log("Information sections already exist, skipping.")
    return
  }

  await prisma.information.createMany({
    data: [
      {
        id: `info_${randomUUID()}`,
        label: "Quiénes somos",
        title: "ELIX nació de la pasión por las fragancias.",
        description:
          "Somos un emprendimiento argentino especializado en perfumería árabe y body splash. Importamos fragancias seleccionadas de Oriente Medio para acercarlas a quienes, como nosotros, se enamoran de un buen perfume.",
        visible: true,
        displayOrder: 0,
      },
      {
        id: `info_${randomUUID()}`,
        label: "El equipo",
        title: "Genaro y Manuel, dos personas detrás de cada fragancia.",
        description:
          "Detrás de ELIX hay dos amigos que convirtieron su admiración por la perfumería árabe en un proyecto diario.",
        visible: true,
        displayOrder: 1,
      },
    ],
  })
  console.log("Information sections seeded.")
}

async function seedContacts() {
  const count = await prisma.contact.count()
  if (count > 0) {
    console.log("Contacts already exist, skipping.")
    return
  }

  await prisma.contact.createMany({
    data: [
      {
        id: `contact_${randomUUID()}`,
        application: "WhatsApp",
        value: "+54 9 11 0000-0000",
        displayOrder: 0,
      },
      {
        id: `contact_${randomUUID()}`,
        application: "Instagram",
        value: "@elix.fragancias",
        displayOrder: 1,
      },
    ],
  })
  console.log("Contacts seeded.")
}

async function seedPaymentMethods() {
  const count = await prisma.paymentMethod.count()
  if (count > 0) {
    console.log("Payment methods already exist, skipping.")
    return
  }

  await prisma.paymentMethod.createMany({
    data: [
      {
        id: `pm_${randomUUID()}`,
        method: "Efectivo",
      },
      {
        id: `pm_${randomUUID()}`,
        method: "Transferencia bancaria",
        identifier: "CVU: 0000000000000000000000",
      },
    ],
  })
  console.log("Payment methods seeded.")
}

async function seedCategories() {
  const count = await prisma.category.count()
  if (count > 0) {
    console.log("Categories already exist, skipping.")
    return
  }

  await prisma.category.createMany({
    data: [
      {
        id: `cat_${randomUUID()}`,
        name: "Perfumes Árabes",
        color: 0xf2f1ee,
        urlImage: "/images/cat-perfumes-arabes.png",
        description: "Oud, ámbar, resinas y especias de Oriente Medio",
      },
      {
        id: `cat_${randomUUID()}`,
        name: "Body Splash",
        color: 0xede8e3,
        urlImage: "/images/cat-body-splash.png",
        description: "Frescura cotidiana con fragancias irresistibles",
      },
    ],
  })
  console.log("Categories seeded.")
}

async function seedBrands() {
  const count = await prisma.brand.count()
  if (count > 0) {
    console.log("Brands already exist, skipping.")
    return
  }

  await prisma.brand.createMany({
    data: [
      { name: "Lattafa" },
      { name: "Maison Alhambra" },
      { name: "Swiss Arabian" },
      { name: "Ajmal" },
      { name: "Al Haramain" },
      { name: "Rasasi" },
      { name: "ELIX Collection" },
    ],
  })
  console.log("Brands seeded.")
}

async function seedProducts() {
  const count = await prisma.product.count()
  if (count > 0) {
    console.log("Products already exist, skipping.")
    return
  }

  const brands = await prisma.brand.findMany()
  const categories = await prisma.category.findMany()
  if (brands.length === 0 || categories.length === 0) {
    console.log("No brands or categories found, skipping products seed.")
    return
  }

  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]))
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]))

  const products = [
    {
      name: "Oud Royale",
      brandName: "Lattafa",
      categoryName: "Perfumes Árabes",
      targetAudience: "unisex",
      price: 8900,
      fraganceFamily: "Amaderado Oriental",
      description: "Fragancia árabe oriental y amaderada que combina la profundidad del oud con la frescura de la bergamota y el cardamomo, cerrando en un fondo cálido de almizcle y ámbar gris.",
      presentation: "30ml, 50ml, 100ml",
      concentration: "edp",
      image: "/images/product-oud-royale.png",
      badge: "Más vendido",
      notes: [
        { type: "salida", noteNames: ["Bergamota", "Cardamomo"] },
        { type: "corazon", noteNames: ["Oud", "Rosa de Damasco"] },
        { type: "fondo", noteNames: ["Almizcle", "Ámbar gris"] },
      ],
    },
    {
      name: "Baccarat Rouge",
      brandName: "Maison Alhambra",
      categoryName: "Perfumes Árabes",
      targetAudience: "unisex",
      price: 12500,
      fraganceFamily: "Oriental Ambarado",
      description: "Inspirada en las fragancias más exclusivas de la perfumería internacional. Notas de azafrán, almarras y cedro se funden con un fondo ambarado de sensualidad envolvente.",
      presentation: "50ml, 100ml",
      concentration: "edp",
      image: "/images/product-baccarat-rouge.png",
      badge: "Oferta",
      notes: [],
    },
    {
      name: "Velvet Rose",
      brandName: "Swiss Arabian",
      categoryName: "Perfumes Árabes",
      targetAudience: "femenino",
      price: 7800,
      fraganceFamily: "Floral",
      description: "Un ramo de rosas envuelto en especias orientales. Rosa de Damasco, peonía y pimienta negra crean una fragancia femenina y envolvente.",
      presentation: "50ml, 100ml",
      concentration: "edp",
      image: "/images/product-velvet-rose.png",
      badge: "Nuevo",
      notes: [],
    },
    {
      name: "Noir Intense",
      brandName: "Ajmal",
      categoryName: "Perfumes Árabes",
      targetAudience: "masculino",
      price: 9500,
      fraganceFamily: "Amaderado Especiado",
      description: "Fragancia masculina intensa y misteriosa. Oud, cuero y especias se entrelazan para crear una estela de poder y elegancia.",
      presentation: "50ml, 100ml",
      concentration: "edp",
      image: "/images/product-noir-intense.png",
      notes: [],
    },
    {
      name: "Amber Luxe",
      brandName: "Lattafa",
      categoryName: "Perfumes Árabes",
      targetAudience: "unisex",
      price: 6500,
      fraganceFamily: "Oriental Ambarado",
      description: "Ámbar cálido y resinas orientales. Una fragancia reconfortante y adictiva, perfecta para la temporada fría.",
      presentation: "50ml, 100ml",
      concentration: "edt",
      image: "/images/product-amber-luxe.png",
      badge: "Oferta",
      notes: [],
    },
    {
      name: "Bloom Bliss",
      brandName: "ELIX Collection",
      categoryName: "Body Splash",
      targetAudience: "femenino",
      price: 3500,
      fraganceFamily: "Floral Frutal",
      description: "Frescura y dulzura en cada spray. Notas de peonía, melocotón y almizcle suave para el día a día.",
      presentation: "250ml",
      image: "/images/product-bloom-bliss.png",
      badge: "Más vendido",
      notes: [],
    },
    {
      name: "Fresh Bloom",
      brandName: "ELIX Collection",
      categoryName: "Body Splash",
      targetAudience: "femenino",
      price: 3500,
      fraganceFamily: "Floral",
      description: "Frescura floral con toques de cítricos y un fondo suave de almizcle. Ideal para el uso diario.",
      presentation: "250ml",
      image: "/images/product-fresh-bloom.png",
      notes: [],
    },
    {
      name: "Sweet Velvet",
      brandName: "ELIX Collection",
      categoryName: "Body Splash",
      targetAudience: "femenino",
      price: 3500,
      fraganceFamily: "Floral Frutal",
      description: "Dulzura envolvente con notas de vainilla, fresa y flores blancas. Un body splash irresistible.",
      presentation: "250ml",
      image: "/images/product-sweet-velvet.png",
      badge: "Nuevo",
      notes: [],
    },
  ]

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        brandId: brandMap[p.brandName],
        categoryId: catMap[p.categoryName],
        targetAudience: p.targetAudience,
        price: p.price,
        fraganceFamily: p.fraganceFamily ?? null,
        description: p.description ?? null,
        presentation: p.presentation ?? null,
        concentration: p.concentration ?? null,
        images: {
          create: { imageUrl: p.image, displayOrder: 0 },
        },
      },
    })

    if (p.notes) {
      for (const group of p.notes) {
        for (const noteName of group.noteNames) {
          let note = await prisma.note.findFirst({ where: { name: noteName } })
          if (!note) {
            note = await prisma.note.create({ data: { name: noteName } })
          }
          await prisma.productNote.create({
            data: {
              productId: product.id,
              noteId: note.id,
              type: group.type,
            },
          })
        }
      }
    }
  }

  console.log(`Products seeded: ${products.length}`)
}

async function seedFeaturedProducts() {
  const count = await prisma.featuredProduct.count()
  if (count > 0) {
    console.log("Featured products already exist, skipping.")
    return
  }

  const products = await prisma.product.findMany({ take: 6, orderBy: { name: "asc" } })
  if (products.length === 0) {
    console.log("No products found, skipping featured products seed.")
    return
  }

  await prisma.featuredProduct.createMany({
    data: products.map((p, i) => ({
      productId: p.id,
      displayOrder: i,
    })),
  })
  console.log(`Featured products seeded: ${products.length}`)
}

async function seedOffers() {
  const count = await prisma.offer.count()
  if (count > 0) {
    console.log("Offers already exist, skipping.")
    return
  }

  const categories = await prisma.category.findMany()
  if (categories.length === 0) {
    console.log("No categories found, skipping offers seed.")
    return
  }

  let efectivo = await prisma.paymentMethod.findFirst({ where: { method: "Efectivo" } })
  if (!efectivo) {
    efectivo = await prisma.paymentMethod.create({
      data: { id: `pm_${randomUUID()}`, method: "Efectivo" },
    })
  }

  let debito = await prisma.paymentMethod.findFirst({ where: { method: "Tarjeta de débito" } })
  if (!debito) {
    debito = await prisma.paymentMethod.create({
      data: { id: `pm_${randomUUID()}`, method: "Tarjeta de débito" },
    })
  }

  const allCategoryIds = categories.map((c) => c.id)
  const arabesCategory = categories.find((c) => c.name === "Perfumes Árabes")

  const offer1 = await prisma.offer.create({
    data: {
      id: `offer_${randomUUID()}`,
      discount: 20,
      description: "20% off pagando en efectivo en toda la colección.",
      active: true,
      offerPaymentMethods: {
        create: [{ paymentMethodId: efectivo.id }],
      },
      offerCategories: {
        create: allCategoryIds.map((categoryId) => ({ categoryId })),
      },
    },
  })

  const offer2 = await prisma.offer.create({
    data: {
      id: `offer_${randomUUID()}`,
      discount: 10,
      description: "10% off en perfumes árabes con débito.",
      active: false,
      offerPaymentMethods: {
        create: [{ paymentMethodId: debito.id }],
      },
      offerCategories: {
        create: arabesCategory ? [{ categoryId: arabesCategory.id }] : [],
      },
    },
  })

  console.log(`Offers seeded: ${offer1.id}, ${offer2.id}`)
}

async function main() {
  await seedAdmin()
  await seedHero()
  await seedInformation()
  await seedContacts()
  await seedPaymentMethods()
  await seedCategories()
  await seedBrands()
  await seedProducts()
  await seedFeaturedProducts()
  await seedOffers()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
