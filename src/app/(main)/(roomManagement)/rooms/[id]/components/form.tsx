"use client"

import { useFormik } from "formik"
import { GetRoomEditResponseType, PATCH } from "../action"
import { number, object, string } from "yup"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

const Form = ({ data }: { data: GetRoomEditResponseType }) => {
    const router = useRouter()
    const schemaValidation = object().shape({
        no: string().required("Nomor kamar tidak boleh kosong!"),
        categoryId: string().required("Kategori kamar tidak boleh kosong!"),
        floor: number().required("Lantai tidak boleh kosong!").typeError("Lantai harus berupa angka!").min(1, "Lantai tidak boleh kurang dari 1!")
    })

    const { values, errors, handleChange, handleSubmit, isSubmitting, setErrors } = useFormik({
        validationSchema: schemaValidation,
        initialValues: {
            no: data.room.no,
            categoryId: data.room.roomCategoryId,
            floor: data.room.floor
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("no", e.no)
            formData.append("categoryId", e.categoryId)
            formData.append("floor", e.floor.toString())
            formData.append("oldNo", data.room.no)
            const response = await PATCH(formData)
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Nomor Kamar <span className="text-error">*</span>
                </legend>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    name="no" 
                    placeholder="Contoh: 101, 201A, Presidential Suite" 
                    value={values.no} 
                    onChange={handleChange}
                />
                <div className="mt-1 text-xs text-gray-500">
                    Format bebas: angka, huruf, atau kombinasi
                </div>
                <span className="fieldset-label text-error">{ errors.no }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Kategori Kamar <span className="text-error">*</span>
                </legend>
                <select name="categoryId" className="select select-bordered w-full" value={values.categoryId} onChange={handleChange}>
                    <option value="">Pilih kategori kamar</option>
                    {
                        data.roomCategory.map((e, index) => <option key={index} value={e.id}>{ e.name }</option>)
                    }
                </select>
                <div className="mt-1 text-xs text-gray-500">
                    Pilih sesuai dengan tipe dan fasilitas kamar
                </div>
                <span className="fieldset-label text-error">{ errors.categoryId }</span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Lantai <span className="text-error">*</span>
                </legend>
                <input 
                    type="number" 
                    className="input input-bordered w-full" 
                    name="floor" 
                    placeholder="2" 
                    value={values.floor} 
                    onChange={handleChange}
                    min="1"
                />
                <div className="mt-1 text-xs text-gray-500">
                    Lantai minimal 1 (ground floor)
                </div>
                <span className="fieldset-label text-error">{ errors.floor }</span>
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
                        className="btn btn-warning gap-2 min-w-32" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Memperbarui...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Update Kamar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </form>
}

export default Form