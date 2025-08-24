"use server"

import { prisma } from "@/utils/database"
import { FormProps } from "./components/form"
import { getDate } from "@/utils/moment"
import { genSalt, hash } from "bcrypt"
import cloudinary from "@/utils/cloudinary"
import { GoogleGenAI, Type } from "@google/genai"

export const post = async (formData: FormData) => {
    try{
        const { name, email, password, nik } = Object.fromEntries(formData) as FormProps
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
                id: nik,
                email,
                name,
                password: hashedPassword,
                role: "CUSTOMER",
                ktpPhoto: ktpPhotoUrl,
                status: false,
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

export const extractNik = async (formData: FormData) => {
    try{
        const { file } = Object.fromEntries(formData) as { file: File }
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API })
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                { text: "Ekstrak NIK dari gambar KTP yang diunggah!" },
                {
                    inlineData: {
                        mimeType: file.type,
                        data: Buffer.from(await file.arrayBuffer()).toString("base64")
                    }
                }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nik: {
                            type: Type.STRING
                        },
                        name: {
                            type: Type.STRING
                        }
                    }
                }
            }
        })

        return {
            name: "SUCCESS",
            message: response.text
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}