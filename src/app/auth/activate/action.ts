"use server"

import { validateActivationToken, activateUser } from "@/utils/activation"

export const activateAccount = async (token: string) => {
  try {
    const validation = await validateActivationToken(token)
    
    if (!validation.valid) {
      return {
        name: "VALIDATION_ERROR",
        message: validation.error
      }
    }
    
    if (validation.user && validation.tokenId) {
      await activateUser(validation.user.id, validation.tokenId)
      
      return {
        name: "SUCCESS",
        message: `Selamat ${validation.user.name}! Akun Anda berhasil diaktifkan.`
      }
    }
    
    return {
      name: "ERROR",
      message: "Terjadi kesalahan saat mengaktifkan akun"
    }
  } catch (error) {
    console.error('Activation error:', error)
    return {
      name: "SERVER_ERROR",
      message: "Terjadi kesalahan pada server"
    }
  }
}
