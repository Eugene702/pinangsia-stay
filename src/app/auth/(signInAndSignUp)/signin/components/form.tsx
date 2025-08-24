"use client"

import { useFormik } from "formik"
import { object, string } from "yup"
import { post } from "../action"
import { signIn } from "next-auth/react"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type FormProps = {
    email: string,
    password: string
}

const Form = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    
    const schemaValidation = object().shape({
        email: string().email("Invalid email format!").required("Email is required!"),
        password: string().min(8, "Password must be at least 8 characters!").required("Password is required!")
    })

    const { values, errors, setFieldError, isSubmitting, handleSubmit, handleChange } = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: schemaValidation,
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("email", e.email)
            formData.append("password", e.password)

            const response = await post(formData)
            if (response.name == "SUCCESS") {
                await signIn("credentials", {
                    ...response.data,
                    redirect: false
                }).then(() => {
                    if(response.data!.role === "MANAGER"){
                        router.push("/dashboard")
                    }else if(response.data!.role === "RECIPIENT"){
                        router.push("/check-in")
                    }else{
                        router.push("/room-reservation")
                    }
                })
            } else if (response.name === "FORM_VALIDATION" || response.name === "ACCOUNT_NOT_ACTIVATED") {
                for (const key in response.errors) {
                    setFieldError(key, response.errors[key as keyof FormProps])
                }
                
                // Show resend activation link if account not activated
                if (response.name === "ACCOUNT_NOT_ACTIVATED") {
                    showToast("warning", "Akun belum diaktivasi. Silakan cek email Anda.")
                }
            } else {
                showToast("error", response.message!)
            }
        }
    })

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
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

            {/* Password Field */}
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
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                            errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
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

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                    </>
                )}
            </button>

            {/* Forgot Password & Resend Activation Links */}
            <div className="text-center space-y-2">
                <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700 font-medium block w-full"
                    onClick={() => showToast("info", "Forgot password feature coming soon!")}
                >
                    Forgot your password?
                </button>
                <a
                    href="/auth/resend-activation"
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium block"
                >
                    Didn't receive activation email? Resend activation email
                </a>
            </div>
        </form>
    )
}

export default Form