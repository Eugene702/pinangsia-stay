import { getDate } from "../src/utils/moment"
import { PrismaClient } from "@prisma/client"
import { genSalt, hash } from "bcrypt"

const prisma = new PrismaClient()
const main = async () => {
    const salt = await genSalt(10)
    const hashPassword = await hash("pinangsiastay", salt)
    const email = "pinangsiastay@gmail.com"
    await prisma.user.upsert({
        create: {
            email: email,
            password: hashPassword,
            name: "Manajer Hotel Pinangsia",
            role: "MANAGER",
            createdAt: getDate(),
        },
        update: {},
        where: { email }
    })
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })