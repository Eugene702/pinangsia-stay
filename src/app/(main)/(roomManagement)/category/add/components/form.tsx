"use client"

const Form = () => {
    return <form>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Unggah Foto</legend>
                <input type="file" className="file-input file-input-ghost" />
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama Kategori</legend>
                <input type="text" className="input input-bordered w-full" name="name" placeholder="Super" />
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Harga</legend>
                <input type="number" className="input input-bordered w-full" name="price" placeholder="100000" />
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <div className="col-span-3 flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
            </div>
        </div>
    </form>
}

export default Form