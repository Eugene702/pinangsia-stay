"use client"

import { useFormik } from "formik"
import { GetResponseType, STORE } from "../action"
import { number, object, string } from "yup"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

const Form = ({ roomCategory }: { roomCategory: GetResponseType }) => {
    const router = useRouter()
    const schemaValidation = object().shape({
        no: string().required("Nomor kamar tidak boleh kosong!"),
        categoryId: string().required("Kategori kamar tidak boleh kosong!"),
        floor: number().required("Lantai tidak boleh kosong!").typeError("Lantai harus berupa angka!").min(1, "Lantai tidak boleh kurang dari 1!")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, setErrors } = useFormik({
        validationSchema: schemaValidation,
        initialValues: {
            no: "",
            categoryId: "",
            floor: ""
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("no", e.no)
            formData.append("categoryId", e.categoryId)
            formData.append("floor", e.floor)
            const response = await STORE(formData)
            if(response.name === "SUCCESS"){
                showToast("success", response.message!)
                router.push("/rooms")
            }else{
                if(response.name === "SET_ERROR"){
                    setErrors({ ...errors, ...response.errors })
                }else{
                    showToast("error", response.message!)
                }
            }
        }
    })

    return <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nomor Kamar</legend>
                <input type="text" className="input input-bordered w-full" name="no" placeholder="001" value={values.no} onChange={handleChange} />
                <span className="fieldset-label text-error">{ errors.no }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Kategori Kamar</legend>
                <select name="categoryId" className="select select-bordered w-full" value={values.categoryId} onChange={handleChange}>
                    <option value="">Pilih kategori kamar</option>
                    {
                        roomCategory.map((e, index) => <option key={index} value={e.id}>{ e.name }</option>)
                    }
                </select>
                <span className="fieldset-label text-error">{ errors.categoryId }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Lantai</legend>
                <input type="text" className="input input-bordered w-full" name="floor" placeholder="2" value={values.floor} onChange={handleChange} />
                <span className="fieldset-label text-error">{ errors.floor }</span>
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