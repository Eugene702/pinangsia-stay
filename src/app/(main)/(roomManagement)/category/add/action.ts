"use server"

import cloudinary from "@/utils/cloudinary"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { revalidatePath } from "next/cache"

export const POST = async (formData: FormData) => {
    try{
        const { photo, name, price, description } = Object.fromEntries(formData)
        
        // Handle additional images
        const additionalImages = formData.getAll('additionalImages') as string[]
        
        // Handle facilities and details
        const facilities = formData.getAll('facilities') as string[]
        const amenities = formData.getAll('amenities') as string[]
        const roomSize = formData.get('roomSize') as string
        const maxOccupancy = formData.get('maxOccupancy') as string
        const bedType = formData.get('bedType') as string
        const viewType = formData.get('viewType') as string
        const policies = formData.getAll('policies') as string[]

        // Upload main photo
        const result = await cloudinary.v2.uploader.upload(photo as string, {
            folder: "room-management/category",
            resource_type: "image"
        })

        // Upload additional images
        const uploadedImages: string[] = []
        for (const image of additionalImages) {
            if (image) {
                const imageResult = await cloudinary.v2.uploader.upload(image, {
                    folder: "room-management/category/gallery",
                    resource_type: "image"
                })
                uploadedImages.push(imageResult.public_id)
            }
        }

        // Create room category with details
        const roomCategory = await prisma.roomCategory.create({
            data: {
                name: name as string,
                price: Number(price),
                photo: result.public_id,
                // images: uploadedImages, // TODO: Enable after Prisma client regeneration
                description: description as string,
                createdAt: getDate(),
                detail: {
                    create: {
                        description: description as string,
                        facilities: facilities.filter(f => f.trim() !== ''),
                        amenities: amenities.filter(a => a.trim() !== ''),
                        roomSize: roomSize ? parseInt(roomSize) : null,
                        maxOccupancy: maxOccupancy ? parseInt(maxOccupancy) : 2,
                        bedType: bedType || null,
                        viewType: viewType || null,
                        policies: policies.filter(p => p.trim() !== ''),
                    }
                }
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Kategori berhasil ditambahkan!",
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!",
        }
    }
}