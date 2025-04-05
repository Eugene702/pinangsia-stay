const Form = () => {
    return <form className="grid grid-cols-3 gap-6">
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Unggah Foto</legend>
            <input type="file" className="file-input file-input-ghost" name="photo" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Lengkap</legend>
            <input type="text" className="input input-bordered w-full" name="name" placeholder="Alvin" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" name="email" placeholder="example@example.com" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" name="email" placeholder="example@example.com" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Telp</legend>
            <input type="text" className="input input-bordered w-full" name="telp" placeholder="0823xxx" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset col-span-3">
            <legend className="fieldset-legend">Alamat</legend>
            <textarea name="address" id="address" className="textarea textarea-bordered w-full" placeholder="Tuliskan alamat tempat tinggal..."></textarea>
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="password" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="repeatPassword" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <div className="col-span-3 flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
        </div>
    </form>
}

export default Form