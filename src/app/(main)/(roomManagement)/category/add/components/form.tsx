"use client"

import { fileToBase64 } from "@/utils/utils"
import { useFormik } from "formik"
import { ChangeEvent } from "react"
import { mixed, number, object, string, array } from "yup"
import { POST } from "../action"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

const Form = () => {
    const router = useRouter()
    const schemaValidation = object().shape({
        photo: mixed().required("Foto  tidak boleh kosong!")
            .test({
                name: "FileSize",
                message: "Ukuran berkas maksimal 5mb!",
                test: value => {
                    const file = value as File
                    const maxSize = 5 * 1024 * 1024
                    if (file.size > maxSize) {
                        return false
                    } else {
                        return true
                    }
                }
            }).test({
                name: "FileType",
                message: "Format berkas tidak sesuai!",
                test: value => {
                    const file = value as File
                    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
                    if (allowedTypes.includes(file.type)) {
                        return true
                    } else {
                        return false
                    }
                }
            }),
        name: string().required("Nama kategori tidak boleh kosong!"),
        price: number().required("Harga tidak boleh kosong!").min(1, "Harga harus lebih dari 0!"),
        description: string().optional(),
        additionalImages: array().optional(),
        facilities: array().of(string()).optional(),
        amenities: array().of(string()).optional(),
        roomSize: string().optional(),
        maxOccupancy: number().min(1, "Kapasitas minimal 1 orang").optional(),
        bedType: string().optional(),
        viewType: string().optional(),
        policies: array().of(string()).optional()
    })

    const { values, isSubmitting, setErrors, handleChange, handleSubmit, errors, setFieldValue } = useFormik({
        initialValues: {
            photo: null as null | File,
            additionalImages: [] as File[],
            name: "",
            price: 0,
            description: "",
            facilities: [""],
            amenities: [""],
            roomSize: "",
            maxOccupancy: 2,
            bedType: "",
            viewType: "",
            policies: [""]
        },
        validationSchema: schemaValidation,
        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append("photo", await fileToBase64(values.photo as File) as string)
            formData.append("name", values.name)
            formData.append("price", values.price.toString())
            formData.append("description", values.description)
            
            // Add additional images
            for (const image of values.additionalImages) {
                if (image) {
                    formData.append("additionalImages", await fileToBase64(image) as string)
                }
            }
            
            // Add facilities, amenities, policies
            values.facilities.forEach(facility => {
                if (facility.trim()) formData.append("facilities", facility.trim())
            })
            values.amenities.forEach(amenity => {
                if (amenity.trim()) formData.append("amenities", amenity.trim())
            })
            values.policies.forEach(policy => {
                if (policy.trim()) formData.append("policies", policy.trim())
            })
            
            // Add room details
            if (values.roomSize) formData.append("roomSize", values.roomSize)
            formData.append("maxOccupancy", values.maxOccupancy.toString())
            if (values.bedType) formData.append("bedType", values.bedType)
            if (values.viewType) formData.append("viewType", values.viewType)

            const response = await POST(formData)
            if(response.name === "SUCCESS"){
                showToast("success", response.message)
                router.push("/category")
            }else{
                showToast("error", response.message)
            }
        }
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.files
        if(target){
            const file = target.item(0)
            if(file){
                setFieldValue("photo", file)
            }else{
                setErrors({
                    photo: "Berkas tidak ditemukan!"
                })
            }
        }
    }

    const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)
            setFieldValue("additionalImages", fileArray)
        }
    }

    const addField = (fieldName: 'facilities' | 'amenities' | 'policies') => {
        const currentArray = values[fieldName] as string[]
        setFieldValue(fieldName, [...currentArray, ""])
    }

    const removeField = (fieldName: 'facilities' | 'amenities' | 'policies', index: number) => {
        const currentArray = values[fieldName] as string[]
        const newArray = currentArray.filter((_, i) => i !== index)
        setFieldValue(fieldName, newArray)
    }

    const updateField = (fieldName: 'facilities' | 'amenities' | 'policies', index: number, value: string) => {
        const currentArray = [...(values[fieldName] as string[])]
        currentArray[index] = value
        setFieldValue(fieldName, currentArray)
    }

    return <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Foto Kategori <span className="text-error">*</span>
                    </legend>
                    <div className="mt-2">
                        <input 
                            type="file" 
                            className="file-input file-input-bordered w-full" 
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/jpg"
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            Format: JPG, PNG. Maksimal 5MB. Disarankan ukuran 800x600px.
                        </div>
                    </div>
                    <span className="fieldset-label text-error">{ errors.photo }</span>
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Nama Kategori <span className="text-error">*</span>
                    </legend>
                    <input 
                        type="text" 
                        className="input input-bordered w-full" 
                        name="name" 
                        placeholder="Contoh: Deluxe, Superior, Standard" 
                        value={values.name} 
                        onChange={handleChange}
                    />
                    <span className="fieldset-label text-error">{ errors.name }</span>
                </fieldset>
            </div>

            <div className="space-y-4">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Harga per Malam <span className="text-error">*</span>
                    </legend>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                        <input 
                            type="number" 
                            className="input input-bordered w-full pl-12" 
                            name="price" 
                            placeholder="500000" 
                            value={values.price} 
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        Masukkan harga dalam Rupiah tanpa titik atau koma
                    </div>
                    <span className="fieldset-label text-error">{ errors.price }</span>
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Keterangan
                    </legend>
                    <textarea 
                        className="textarea textarea-bordered w-full resize-none" 
                        name="description" 
                        placeholder="Deskripsi kategori kamar, fasilitas yang tersedia, ukuran ruangan, dll. (opsional)" 
                        value={values.description} 
                        onChange={handleChange}
                        rows={4}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                        Berikan deskripsi yang menarik untuk kategori kamar ini
                    </div>
                    <span className="fieldset-label text-error">{ errors.description }</span>
                </fieldset>
            </div>

            {/* Gallery Images Section */}
            <div className="col-span-1 lg:col-span-2">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Galeri Gambar Tambahan
                    </legend>
                    <div className="mt-2">
                        <input 
                            type="file" 
                            className="file-input file-input-bordered w-full" 
                            onChange={handleAdditionalImagesChange}
                            accept="image/jpeg,image/png,image/jpg"
                            multiple
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            Pilih beberapa gambar untuk galeri kamar. Format: JPG, PNG. Maksimal 5MB per gambar.
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* Room Details Section */}
            <div className="col-span-1 lg:col-span-2">
                <div className="divider">
                    <span className="text-base font-medium">Detail Kamar</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Ukuran Kamar (m²)</legend>
                        <input 
                            type="number" 
                            className="input input-bordered w-full" 
                            name="roomSize" 
                            placeholder="25" 
                            value={values.roomSize} 
                            onChange={handleChange}
                            min="0"
                        />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Kapasitas Maksimal</legend>
                        <input 
                            type="number" 
                            className="input input-bordered w-full" 
                            name="maxOccupancy" 
                            placeholder="2" 
                            value={values.maxOccupancy} 
                            onChange={handleChange}
                            min="1"
                        />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Tipe Tempat Tidur</legend>
                        <select 
                            className="select select-bordered w-full" 
                            name="bedType" 
                            value={values.bedType} 
                            onChange={handleChange}
                        >
                            <option value="">Pilih Tipe Bed</option>
                            <option value="Single Bed">Single Bed</option>
                            <option value="Twin Bed">Twin Bed</option>
                            <option value="Double Bed">Double Bed</option>
                            <option value="Queen Bed">Queen Bed</option>
                            <option value="King Bed">King Bed</option>
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Pemandangan</legend>
                        <select 
                            className="select select-bordered w-full" 
                            name="viewType" 
                            value={values.viewType} 
                            onChange={handleChange}
                        >
                            <option value="">Pilih Pemandangan</option>
                            <option value="City View">City View</option>
                            <option value="Garden View">Garden View</option>
                            <option value="Pool View">Pool View</option>
                            <option value="Street View">Street View</option>
                            <option value="No View">No View</option>
                        </select>
                    </fieldset>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="col-span-1 lg:col-span-2">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Fasilitas Kamar
                    </legend>
                    <div className="space-y-2">
                        {values.facilities.map((facility, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input input-bordered flex-1" 
                                    placeholder="Contoh: AC, TV LED 32 inch, WiFi gratis" 
                                    value={facility}
                                    onChange={(e) => updateField('facilities', index, e.target.value)}
                                />
                                {values.facilities.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-ghost btn-square btn-sm text-error"
                                        onClick={() => removeField('facilities', index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="btn btn-outline btn-sm gap-2"
                            onClick={() => addField('facilities')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Fasilitas
                        </button>
                    </div>
                </fieldset>
            </div>

            {/* Amenities Section */}
            <div className="col-span-1 lg:col-span-2">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Amenitas Tambahan
                    </legend>
                    <div className="space-y-2">
                        {values.amenities.map((amenity, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input input-bordered flex-1" 
                                    placeholder="Contoh: Handuk, Sabun mandi, Shampoo, Sandal" 
                                    value={amenity}
                                    onChange={(e) => updateField('amenities', index, e.target.value)}
                                />
                                {values.amenities.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-ghost btn-square btn-sm text-error"
                                        onClick={() => removeField('amenities', index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="btn btn-outline btn-sm gap-2"
                            onClick={() => addField('amenities')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Amenitas
                        </button>
                    </div>
                </fieldset>
            </div>

            {/* Policies Section */}
            <div className="col-span-1 lg:col-span-2">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Kebijakan Kamar
                    </legend>
                    <div className="space-y-2">
                        {values.policies.map((policy, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input input-bordered flex-1" 
                                    placeholder="Contoh: Check-in 14:00, Check-out 12:00, Dilarang merokok" 
                                    value={policy}
                                    onChange={(e) => updateField('policies', index, e.target.value)}
                                />
                                {values.policies.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="btn btn-ghost btn-square btn-sm text-error"
                                        onClick={() => removeField('policies', index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="btn btn-outline btn-sm gap-2"
                            onClick={() => addField('policies')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Kebijakan
                        </button>
                    </div>
                </fieldset>
            </div>

            <div className="col-span-1 lg:col-span-2">
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Simpan Kategori
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </form>
}

export default Form