"use client"

import { fileToBase64 } from "@/utils/utils"
import { useFormik } from "formik"
import { ChangeEvent } from "react"
import { mixed, number, object, string } from "yup"
import { POST } from "../action"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

const Form = () => {
    const router = useRouter()
    const schemaValidation = object().shape({
        photo: mixed().required("Foto  tidak boleh kosong!")
            .test({
                name: "FileSize",
                message: "Ukuran berkas maksimal 5mb!",
                test: value => {
                    const file = value as File
                    const maxSize = 5 * 1024 * 1024 // 5MB
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
                    const file = value as File
                    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
                    if (allowedTypes.includes(file.type)) {
                        return true
                    } else {
                        return false
                    }
                }
            }),
        name: string().required("Nama kategori tidak boleh kosong!"),
        price: number().required("Harga tidak boleh kosong!").min(1, "Harga harus lebih dari 0!")
    })

    const { values, isSubmitting, setErrors, handleChange, handleSubmit, errors, setFieldValue } = useFormik({
        initialValues: {
            photo: null as null | File,
            name: "",
            price: 0
        },
        validationSchema: schemaValidation,
        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append("photo", await fileToBase64(values.photo as File) as string)
            formData.append("name", values.name)
            formData.append("price", values.price.toString())

            const response = await POST(formData)
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
        if(target){
            const file = target.item(0)
            if(file){
                setFieldValue("photo", file)
            }else{
                setErrors({
                    photo: "Berkas tidak ditemukan!"
                })
            }
        }
    }

    return <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Unggah Foto</legend>
                <input type="file" className="file-input file-input-ghost" onChange={handleFileChange} />
                <span className="fieldset-label text-error">{ errors.photo }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama Kategori</legend>
                <input type="text" className="input input-bordered w-full" name="name" placeholder="Super" value={values.name} onChange={handleChange} />
                <span className="fieldset-label text-error">{ errors.name }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Harga</legend>
                <input type="number" className="input input-bordered w-full" name="price" placeholder="100000" value={values.price} onChange={handleChange} />
                <span className="fieldset-label text-error">{ errors.price }</span>
            </fieldset>

            <div className="col-span-3 flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    { isSubmitting ? <div className="loading"></div> : null }
                    <span>Simpan</span>
                </button>
            </div>
        </div>
    </form>
}

export default Form