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

async function main() {
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

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })