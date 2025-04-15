"use client"

import { useFormik } from "formik"
import { object, string } from "yup"
import { post } from "../action"
import { signIn } from "next-auth/react"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

export type FormProps = {
    email: string,
    password: string
}

const Form = () => {
    const router = useRouter()
    const schemaValidation = object().shape({
        email: string().email("Format email tidak benar!").required("Email tidak boleh kosong!"),
        password: string().min(8, "Kata sandi minimal 8 karakter!").required("Kata sandi tidak boleh kosong!")
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
            } else if (response.name === "FORM_VALIDATION") {
                for (const key in response.errors) {
                    setFieldError(key, response.errors[key as keyof FormProps])
                }
            } else {
                showToast("error", response.message!)
            }
        }
    })

    return <form onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" name="email" placeholder="example@exampl.com" value={values.email} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.email}</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="password" placeholder="Alvin702" value={values.password} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.password}</span>
        </fieldset>


        <div className="flex justify-between">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                {isSubmitting ? <div className="loading"></div> : null}
                <span>Masuk</span>
            </button>
        </div>
    </form>
}

export default Form