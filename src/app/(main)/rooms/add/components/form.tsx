const Form = () => {
    return <form>
        <div className="grid grid-cols-3 gap-6">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nomor Kamar</legend>
                <input type="text" className="input input-bordered w-full" name="no" placeholder="001" />
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Kategori Kamar</legend>
                <select name="category" id="category" className="select select-bordered w-full">
                    <option value="">Pilih kategori kamar</option>
                </select>
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Lantai</legend>
                <input type="text" className="input input-bordered w-full" name="floor" placeholder="2" />
                <span className="fieldset-label text-error"></span>
            </fieldset>

            <div className="col-span-3 flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
            </div>
        </div>
    </form>
}

export default Form