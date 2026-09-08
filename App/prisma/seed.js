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
