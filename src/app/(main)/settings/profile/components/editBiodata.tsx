"use client"

import { number, object, string } from "yup"
import { GetResponseType, StoreBiodata } from "../action"
import { useFormik } from "formik"
import { showToast } from "@/utils/toast"

export type EditFormBiodataType = {
    name: string,
    email: string,
    telp: string,
    address: string
}

const EditBiodata = ({ response }: { response: GetResponseType }) => {
    const schema = object().shape({
        name: string().required("Nama lengkap tidak boleh kosong!"),
        email: string().email("Email tidak valid!").required("Email tidak boleh kosong!"),
        telp: number().required("Telp tidak boleh kosong!"),
        address: string().required("Alamat tidak boleh kosong!")
    })

    const { values, errors, isSubmitting, handleChange, handleSubmit, setErrors } = useFormik({
        validationSchema: schema,
        initialValues: {
            name: response.name,
            email: response.email,
            telp: response.telp,
            address: response.address
        },
        onSubmit: async e => {
            const response = await StoreBiodata(e as EditFormBiodataType)
            if (response.name === "ERRORS") {
                setErrors({ ...response.error })
            }else{
                showToast(response.name === "SUCCESS" ? "success" : "error", response.message!)
            }
        }
    })

    return <form className="grid grid-cols-3 gap-6 col-span-3" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Lengkap</legend>
            <input type="text" className="input input-bordered w-full" placeholder="Alvin" name="name" value={values.name} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.name}</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" placeholder="example@example" name="email" value={values.email} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.email}</span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Telp</legend>
            <input type="text" className="input input-bordered w-full" placeholder="088xxx" name="telp" defaultValue={values.telp || ""} onChange={handleChange} />
            <span className="fieldset-label text-error">{errors.telp}</span>
        </fieldset>

        <fieldset className="fieldset col-span-3">
            <legend className="fieldset-legend">Alamat</legend>
            <textarea name="address" className="textarea textarea-bordered w-full" placeholder="Tuliskan alamat disini..." value={values.address || ""} onChange={handleChange}></textarea>
            <span className="fieldset-label text-error">{errors.address}</span>
        </fieldset>

        <div className="col-span-3 flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                {isSubmitting ? <div className="loading"></div> : null}
                <span>Simpan</span>
            </button>
        </div>
    </form>
}

export default EditBiodata