"use server"

import { prisma } from "@/utils/database"
import { sendActivationEmail } from "@/utils/email"
import { generateActivationToken } from "@/utils/activation"

export const resendActivationEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return {
        name: "NOT_FOUND",
        message: "Email tidak ditemukan dalam sistem"
      }
    }

    if (user.status) {
      return {
        name: "ALREADY_ACTIVE",
        message: "Akun sudah aktif, silakan login"
      }
    }

    // Delete old activation tokens for this user
    await prisma.activationToken.deleteMany({
      where: { userId: user.id }
    })

    // Generate new activation token
    const activationToken = await generateActivationToken(user.id)
    
    // Send activation email
    await sendActivationEmail(email, user.name, activationToken)

    return {
      name: "SUCCESS",
      message: "Email aktivasi berhasil dikirim! Silakan cek kotak masuk Anda."
    }
  } catch (error) {
    console.error('Resend activation email error:', error)
    return {
      name: "SERVER_ERROR",
      message: "Terjadi kesalahan pada server"
    }
  }
}
