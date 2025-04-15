"use client"

import { useFormik } from "formik"
import { ChangeEvent } from "react"
import { mixed, object, ref, string } from "yup"
import { post } from "../action"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { fileToBase64 } from "@/utils/utils"

export type FormValues = {
    photo: File | null
    name: string
    email: string
    telp: string
    address: string
    password: string
    repeatPassword: string
}

const Form = () => {
    const router = useRouter()
    const schemaValidation = object().shape({
        photo: mixed().required("Foto tidak boleh kosong").test({
            name: "FileSize",
            message: "Ukuran file terlalu besar!",
            test: value => {
                const file = value as File
                const maxSize = 5 * 1024 * 1024
                if(file.size > maxSize){
                    return false
                }else{
                    return true
                }
            }
        }).test({
            name: "FileType",
            message: "File tidak sesuai format",
            test: value => {
                const file = value as File
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
                if(!allowedTypes.includes(file.type)){
                    return false
                }else{
                    return true
                }
            }
        }),
        name: string().required("Nama tidak boleh kosong!"),
        email: string().email("Email tidak valid").required("Email tidak boleh kosong!"),
        telp: string().required("No. Telp tidak boleh kosong!"),
        address: string().required("Alamat tidak boleh kosong!"),
        password: string().required("Kata sandi tidak boleh kosong!").min(8, "Kata sandi minimal 8 karakter"),
        repeatPassword: string().required("Ulangi kata sandi tidak boleh kosong!").oneOf([ref("password")], "Kata sandi tidak sama!")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, setFieldValue, setErrors } = useFormik({
        validationSchema: schemaValidation,
        initialValues: {
            photo: null as File | null,
            name: "",
            email: "",
            telp: "",
            address: "",
            password: "",
            repeatPassword: ""
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("name", e.name)
            formData.append("email", e.email)
            formData.append("telp", e.telp)
            formData.append("address", e.address)
            formData.append("password", e.password)
            formData.append("repeatPassword", e.repeatPassword)
            if(e.photo){
                formData.append("photo", await fileToBase64(e.photo) as string)
            }

            const response = await post(formData)
            if(response.name === "SUCCESS"){
                showToast("success", "Akun resipsionis berhasil dibuat!")
                router.push("/users")
            }else if(response.name === "FORM_VALIDATION"){
                setErrors(response.errors!)
            }else{
                showToast("error", response.messsage!)
            }
        }
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(files && files.length > 0){
            const file = files.item(0) as File
            setFieldValue("photo", file)
        }
    }

    return <form className="grid grid-cols-3 gap-6" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Unggah Foto</legend>
            <input type="file" className="file-input file-input-ghost" name="photo" onChange={handleFileChange} />
            <span className="fieldset-label text-error">{ errors.photo }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Lengkap</legend>
            <input type="text" className="input input-bordered w-full" name="name" placeholder="Alvin" onChange={handleChange} value={values.name} />
            <span className="fieldset-label text-error">{ errors.name }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" name="email" placeholder="example@example.com" value={values.email} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.email }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Telp</legend>
            <input type="text" className="input input-bordered w-full" name="telp" placeholder="0823xxx" value={values.telp} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.telp }</span>
        </fieldset>

        <fieldset className="fieldset col-span-3">
            <legend className="fieldset-legend">Alamat</legend>
            <textarea name="address" id="address" className="textarea textarea-bordered w-full" placeholder="Tuliskan alamat tempat tinggal..." value={values.address} onChange={handleChange}></textarea>
            <span className="fieldset-label text-error">{ errors.address }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="password" placeholder="Alvin702" value={values.password} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.password }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="repeatPassword" placeholder="Alvin702" value={values.repeatPassword} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.repeatPassword }</span>
        </fieldset>

        <div className="col-span-3 flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                { isSubmitting ? <div className="loading"></div> : null }
                <span>Simpan</span>
            </button>
        </div>
    </form>
}

export default Form