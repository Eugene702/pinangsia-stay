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

    return <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Foto Profil <span className="text-error">*</span>
                </legend>
                <input 
                    type="file" 
                    className="file-input file-input-bordered w-full" 
                    name="photo" 
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg"
                />
                <div className="mt-1 text-xs text-gray-500">
                    Format: JPG, PNG. Maksimal 5MB
                </div>
                <span className="fieldset-label text-error">{ errors.photo }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nama Lengkap <span className="text-error">*</span>
                </legend>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    name="name" 
                    placeholder="Contoh: John Doe" 
                    onChange={handleChange} 
                    value={values.name} 
                />
                <div className="mt-1 text-xs text-gray-500">
                    Masukkan nama lengkap pengguna
                </div>
                <span className="fieldset-label text-error">{ errors.name }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    Email <span className="text-error">*</span>
                </legend>
                <input 
                    type="email" 
                    className="input input-bordered w-full" 
                    name="email" 
                    placeholder="user@example.com" 
                    value={values.email} 
                    onChange={handleChange} 
                />
                <div className="mt-1 text-xs text-gray-500">
                    Email harus valid dan unik
                </div>
                <span className="fieldset-label text-error">{ errors.email }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Telepon <span className="text-error">*</span>
                </legend>
                <input 
                    type="tel" 
                    className="input input-bordered w-full" 
                    name="telp" 
                    placeholder="08123456789" 
                    value={values.telp} 
                    onChange={handleChange} 
                />
                <div className="mt-1 text-xs text-gray-500">
                    Nomor telepon yang dapat dihubungi
                </div>
                <span className="fieldset-label text-error">{ errors.telp }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Kata Sandi <span className="text-error">*</span>
                </legend>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    name="password" 
                    placeholder="Minimal 8 karakter" 
                    value={values.password} 
                    onChange={handleChange} 
                />
                <div className="mt-1 text-xs text-gray-500">
                    Kata sandi minimal 8 karakter
                </div>
                <span className="fieldset-label text-error">{ errors.password }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Konfirmasi Kata Sandi <span className="text-error">*</span>
                </legend>
                <input 
                    type="password" 
                    className="input input-bordered w-full" 
                    name="repeatPassword" 
                    placeholder="Ulangi kata sandi" 
                    value={values.repeatPassword} 
                    onChange={handleChange} 
                />
                <div className="mt-1 text-xs text-gray-500">
                    Harus sama dengan kata sandi di atas
                </div>
                <span className="fieldset-label text-error">{ errors.repeatPassword }</span>
            </fieldset>

            <fieldset className="fieldset col-span-1 lg:col-span-3">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Alamat <span className="text-error">*</span>
                </legend>
                <textarea 
                    name="address" 
                    className="textarea textarea-bordered w-full h-24" 
                    placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta" 
                    value={values.address} 
                    onChange={handleChange}
                />
                <div className="mt-1 text-xs text-gray-500">
                    Alamat lengkap tempat tinggal
                </div>
                <span className="fieldset-label text-error">{ errors.address }</span>
            </fieldset>

            <div className="col-span-1 lg:col-span-3">
                <div className="divider"></div>
                <div className="flex justify-end gap-3">
                    <button 
                        type="button" 
                        className="btn btn-ghost"
                        onClick={() => window.history.back()}
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary gap-2 min-w-32" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Tambah Pengguna
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </form>
}

export default Form