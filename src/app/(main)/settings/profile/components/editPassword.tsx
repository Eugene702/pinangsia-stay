"use client"

import { useFormik } from "formik"
import { object, ref, string } from "yup"
import { PatchPassword } from "../action"
import { showToast } from "@/utils/toast"

export type EditPasswordFormType = {
    password: string,
    repeatPassword: string
}

const EditPassword = () => {
    const schema = object().shape({
        password: string().required("Kata sandi tidak boleh kosong!").min(8, "Kata sandi minimal 8 karakter!"),
        repeatPassword: string().required("Ulangi kata sandi tidak boleh kosong!").oneOf([ref("password")], "Kata sandi tidak sama!")
    })

    const { values, handleChange, handleSubmit, errors, isSubmitting, setValues } = useFormik({
        validationSchema: schema,
        initialValues: {
            password: "",
            repeatPassword: ""
        },
        onSubmit: async e => {
            const response = await PatchPassword(e)
            showToast(response.name === "SUCCESS" ? "success" : "error", response.message!)
            if(response.name === "SUCCESS"){
                setValues({
                    password: "",
                    repeatPassword: ""
                })
            }
        }
    })

    return <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" placeholder="Alvin702" name="password" value={values.password} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.password}</span>
        </fieldset>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" placeholder="Alvin702" name="repeatPassword" value={values.repeatPassword} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.repeatPassword}</span>
        </fieldset>

        <div className="col-span-2 flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                { isSubmitting ? <div className="loading"></div> : null }
                <span>Simpan</span>
            </button>
        </div>
    </form>
}

export default EditPassword