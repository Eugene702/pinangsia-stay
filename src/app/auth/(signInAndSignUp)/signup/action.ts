"use server"

import { prisma } from "@/utils/database"
import { FormProps } from "./components/form"
import { getDate } from "@/utils/moment"
import { genSalt, hash } from "bcrypt"
import cloudinary from "@/utils/cloudinary"

export const post = async (formData: FormData) => {
    try{
        const { name, email, password } = Object.fromEntries(formData) as FormProps
        const ktpPhotoFile = formData.get("ktpPhoto") as File
        
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(user){
            return {
                name: "FORM_VALIDATION_ERROR",
                errors: {
                    email: "Email sudah terdaftar!"
                }
            }
        }

        // Upload KTP photo to Cloudinary
        let ktpPhotoUrl = null
        if (ktpPhotoFile && ktpPhotoFile.size > 0) {
            const ktpBuffer = await ktpPhotoFile.arrayBuffer()
            const ktpBase64 = Buffer.from(ktpBuffer).toString('base64')
            const ktpDataUri = `data:${ktpPhotoFile.type};base64,${ktpBase64}`
            
            const uploadResult = await cloudinary.v2.uploader.upload(ktpDataUri, {
                folder: 'pinangsia-stay/ktp',
                resource_type: 'image'
            })
            ktpPhotoUrl = uploadResult.secure_url
        }

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "CUSTOMER",
                ktpPhoto: ktpPhotoUrl,
                createdAt: getDate()
            } as any
        })

        return {
            name: "SUCCESS"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}