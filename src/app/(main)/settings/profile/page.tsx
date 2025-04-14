import { Metadata } from "next";
import { GET } from "./action";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Pengaturan Akun"
}

const Error = dynamic(() => import('@/components/error'))
const EditPhoto = dynamic(() => import('./components/editPhoto'))
const EditBiodata = dynamic(() => import('./components/editBiodata'))
const EditPassword = dynamic(() => import('./components/editPassword'))

const page = async () => {
    const response = await GET()
    if (response.name != "SUCCESS") {
        return <Error message={response.message!} />
    }

    return <main>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset  bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Ubah Foto Profil</legend>
                <EditPhoto />
            </fieldset>
            <fieldset className="fieldset col-span-3 bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Form edit biodata</legend>
                <EditBiodata response={response.data!} />
            </fieldset>
            <fieldset className="fieldset col-span-3 bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Form edit kata sandi</legend>
                <EditPassword/>
            </fieldset>
        </div>
    </main>
}

export default page