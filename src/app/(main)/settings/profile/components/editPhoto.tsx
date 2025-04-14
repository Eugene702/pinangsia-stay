"use client"

import { fileToBase64 } from "@/utils/utils"
import { useFormik } from "formik"
import { FaCheck } from "react-icons/fa"
import { mixed, object } from "yup"
import { PostPhoto } from "../action"
import { showToast } from "@/utils/toast"
import { ChangeEvent } from "react"

const EditPhoto = () => {
    const schema = object().shape({
        file: mixed().required("Berkas tidak boleh kosong!").test("FormatFile", "Format Berkas tidak valid!", value => {
            const file = value as File
            const validTypes = ["image/jpeg", "image/png", "image/jpg"]
            if(validTypes.includes(file.type)){
                return true
            }else{
                return false
            }
        })
    })
    const { handleSubmit, isSubmitting, errors, setValues } = useFormik({
        validationSchema: schema,
        initialValues: {
            file: null as File | null
        },
        onSubmit: async e => {
            const attachment = await fileToBase64(e.file!)
            const response = await PostPhoto(attachment as string)
            showToast(response.name == "SUCCESS" ? "success" : "error", response.message)
            setValues({ file: null })
        }
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(files && files.length > 0){
            setValues({ file: files[0] })
        }
    }

    return <form className="flex items-center gap-4" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ubah Foto Profil</legend>
            <input type="file" name="file" className="file-input file-input-bordered" onChange={handleChange} />
            <span className="fieldset-label text-error">{ errors.file }</span>
        </fieldset>

        <button type="submit" className="btn btn-primary btn-circle btn-sm" disabled={isSubmitting}>
            { isSubmitting ? <div className="loading"></div> : <FaCheck /> }
        </button>
    </form>
}

export default EditPhoto