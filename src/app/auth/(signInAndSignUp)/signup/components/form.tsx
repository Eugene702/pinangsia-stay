"use client"

import { useFormik } from "formik"
import { object, ref, string } from "yup"
import { post } from "../action"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

export type FormProps = {
    name: string
    email: string
    password: string
    repeatPassword: string
}

const Form = () => {
    const router = useRouter()
    const schemaValidation = object().shape({
        name: string().required("Nama lengkap tidak boleh kosong"),
        email: string().email("Email tidak valid").required("Email tidak boleh kosong"),
        password: string().required("Kata sandi tidak boleh kosong"),
        repeatPassword: string().oneOf([ref("password")], "Kata sandi tidak sama").required("Kata sandi tidak boleh kosong"),
    })

    const { values, handleChange, handleSubmit, errors, isSubmitting, setFieldError } = useFormik({
        validationSchema: schemaValidation,
        initialValues: {
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("name", e.name)
            formData.append("email", e.email)
            formData.append("password", e.password)
            formData.append("repeatPassword", e.repeatPassword)

            const response = await post(formData)
            if(response.name === "SUCCESS"){
                showToast("success", "Akun berhasil dibuat, silahkan masuk!")
                router.push("/auth/signin")
            }else if(response.name === "FORM_VALIDATION_ERROR"){
                const { errors } = response
                setFieldError("email", errors!.email)
            }else{
                showToast("error", response.message!)
            }
        }
    })

    return <form onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Lengkap</legend>
            <input type="text" className="input input-bordered" name="name" placeholder="Alvin" value={values.name} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.name }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered" name="email" placeholder="example@example.com" value={values.email} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.email }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered" name="password" placeholder="Alvin702" value={values.password} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.password }</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
            <input type="password" className="input input-bordered" name="repeatPassword" placeholder="Alvin702" value={values.repeatPassword} onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.repeatPassword }</span>
        </fieldset>

        <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                { isSubmitting ? <div className="loading"></div> : null }
                <span>Daftar</span>
            </button>
        </div>
    </form>
}

export default Form