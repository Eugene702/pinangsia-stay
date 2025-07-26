"use client"

import { fileToBase64 } from "@/utils/utils"
import { useFormik } from "formik"
import { ChangeEvent } from "react"
import { mixed, number, object, string } from "yup"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { GetPayload, PATCH } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"

const Form = ({ roomCategory }: { roomCategory: GetPayload }) => {
    const router = useRouter()
    const schemaValidation = object().shape({
        photo: mixed()
            .test({
                name: "FileSize",
                message: "Ukuran berkas maksimal 5mb!",
                test: value => {
                    if (!value) return true
                    const file = value as File
                    const maxSize = 5 * 1024 * 1024
                    if (file.size > maxSize) {
                        return false
                    } else {
                        return true
                    }
                }
            }).test({
                name: "FileType",
                message: "Format berkas tidak sesuai!",
                test: value => {
                    if (!value) return true
                    const file = value as File
                    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
                    if (allowedTypes.includes(file.type)) {
                        return true
                    } else {
                        return false
                    }
                }
            }).nullable(),
        name: string().required("Nama kategori tidak boleh kosong!"),
        price: number().required("Harga tidak boleh kosong!").min(1, "Harga harus lebih dari 0!")
    })

    const { values, isSubmitting, setErrors, handleChange, handleSubmit, errors, setFieldValue } = useFormik({
        initialValues: {
            photo: null as null | File,
            name: roomCategory.name,
            price: roomCategory.price.toString()
        },
        validationSchema: schemaValidation,
        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("price", values.price.toString())
            if(values.photo){
                const base64 = await fileToBase64(values.photo)
                formData.append("photo", base64 as string)
            }

            const response = await PATCH(roomCategory.id, formData)
            if(response.name === "SUCCESS"){
                showToast("success", response.message)
                router.push("/category")
            }else{
                showToast("error", response.message)
            }
        }
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.files
        if (target) {
            const file = target.item(0)
            if (file) {
                setFieldValue("photo", file)
            } else {
                setErrors({
                    photo: "Berkas tidak ditemukan!"
                })
            }
        }
    }

    return <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <div className="avatar">
                    <div className="mask mask-squircle w-20">
                        <Image
                            src={getCldImageUrl({ src: roomCategory.photo })}
                            width={0}
                            height={0}
                            sizes="100vw"
                            alt={`Foto kategori kamar ${roomCategory.name}`} />
                    </div>
                </div>
                <legend className="fieldset-legend">Unggah Foto</legend>
                <input type="file" className="file-input file-input-ghost" onChange={handleFileChange} />
                <span className="fieldset-label text-error">{errors.photo}</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama Kategori</legend>
                <input type="text" className="input input-bordered w-full" name="name" placeholder="Super" value={values.name} onChange={handleChange} />
                <span className="fieldset-label text-error">{errors.name}</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Harga</legend>
                <input type="number" className="input input-bordered w-full" name="price" placeholder="100000" value={values.price} onChange={handleChange} />
                <span className="fieldset-label text-error">{errors.price}</span>
            </fieldset>

            <div className="col-span-3 flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? <div className="loading"></div> : null}
                    <span>Simpan</span>
                </button>
            </div>
        </div>
    </form>
}

export default Form