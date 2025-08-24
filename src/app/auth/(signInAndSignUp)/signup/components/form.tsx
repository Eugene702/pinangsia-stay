"use client"

import { useFormik } from "formik"
import { object, ref, string, mixed } from "yup"
import { extractNik, post } from "../action"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type FormProps = {
    nik: string,
    name: string
    email: string
    password: string
    repeatPassword: string
    ktpPhoto?: File
}

const Form = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [ktpPreview, setKtpPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<"EXTRACT_KTP" | null>(null)

    const schemaValidation = object().shape({
        nik: string().required("NIK is required"),
        name: string().required("Full name is required"),
        email: string().email("Invalid email format").required("Email is required"),
        password: string().min(8, "Password must be at least 8 characters").required("Password is required"),
        repeatPassword: string().oneOf([ref("password")], "Passwords don't match").required("Please confirm your password"),
        ktpPhoto: mixed<File>()
            .required("KTP/ID Card photo is required")
            .test("fileSize", "File size must be less than 5MB", (value) => {
                return !value || value.size <= 5 * 1024 * 1024
            })
            .test("fileType", "Only JPG, JPEG, PNG files are allowed", (value) => {
                return !value || ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
            })
    })

    const { values, handleChange, handleSubmit, errors, isSubmitting, setFieldError, setFieldValue } = useFormik({
        validationSchema: schemaValidation,
        initialValues: {
            nik: "",
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            ktpPhoto: undefined as File | undefined,
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("nik", e.nik)
            formData.append("name", e.name)
            formData.append("email", e.email)
            formData.append("password", e.password)
            formData.append("repeatPassword", e.repeatPassword)
            if (e.ktpPhoto) {
                formData.append("ktpPhoto", e.ktpPhoto)
            }

            const response = await post(formData)
            if (response.name === "SUCCESS") {
                showToast("success", response.message || "Akun berhasil dibuat! Silakan cek email Anda untuk aktivasi.")
                router.push("/auth/signin?message=activation-email-sent")
            } else if (response.name === "FORM_VALIDATION_ERROR") {
                const { errors } = response
                setFieldError("email", errors!.email)
            } else {
                showToast("error", response.message!)
            }
        }
    })

    const handleKtpChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append("file", file)
            setIsLoading("EXTRACT_KTP")
            const extract = await extractNik(formData)
            const { nik, name } = JSON.parse(extract.message!) as unknown as { nik: string; name: string }

            setFieldValue("ktpPhoto", file)
            setFieldValue("nik", nik)
            setFieldValue("name", name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setKtpPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            setIsLoading(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="ktpPhoto" className="block text-sm font-medium text-gray-700 mb-2">
                    KTP/ID Card Photo *
                </label>
                <div className="space-y-4">
                    <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${errors.ktpPhoto ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-red-400'
                        }`}>
                        <input
                            id="ktpPhoto"
                            type="file"
                            name="ktpPhoto"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleKtpChange}
                            disabled={isLoading === "EXTRACT_KTP"}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {
                            isLoading == "EXTRACT_KTP" ? <div className="flex justify-center items-center">
                                <div className="loading"></div>
                                <span>Sedang mengekstrak NIK...</span>
                            </div> : ktpPreview ? (
                                <div className="space-y-3">
                                    <img
                                        src={ktpPreview}
                                        alt="KTP Preview"
                                        className="mx-auto max-h-40 rounded-lg border"
                                    />
                                    <p className="text-sm text-green-600 font-medium">✓ KTP berhasil dipilih</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setKtpPreview(null)
                                            setFieldValue("ktpPhoto", undefined)
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Ganti foto
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Upload foto KTP/ID Card</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: JPG, JPEG, PNG • Maksimal 5MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Pilih File
                                    </button>
                                </div>
                            )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-blue-800">Data Aman & Terlindungi</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Foto KTP Anda akan dienkripsi dan hanya digunakan untuk verifikasi identitas sesuai regulasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {errors.ktpPhoto && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.ktpPhoto}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    NIK
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        id="nik"
                        type="text"
                        name="nik"
                        placeholder="Enter your NIK"
                        value={values.nik}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.nik ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                </div>
                {errors.nik && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.nik}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={values.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                </div>
                {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={values.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.password}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <input
                        id="repeatPassword"
                        type={showRepeatPassword ? "text" : "password"}
                        name="repeatPassword"
                        placeholder="Confirm your password"
                        value={values.repeatPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.repeatPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showRepeatPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.repeatPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.repeatPassword}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isLoading != null}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Account
                    </>
                )}
            </button>

            <div className="text-center">
                <p className="text-xs text-gray-500">
                    By creating an account, you agree to our{' '}
                    <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-medium"
                        onClick={() => showToast("info", "Terms & Conditions coming soon!")}
                    >
                        Terms & Conditions
                    </button>
                    {' '}and{' '}
                    <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-medium"
                        onClick={() => showToast("info", "Privacy Policy coming soon!")}
                    >
                        Privacy Policy
                    </button>
                </p>
            </div>
        </form >
    )
}

export default Form