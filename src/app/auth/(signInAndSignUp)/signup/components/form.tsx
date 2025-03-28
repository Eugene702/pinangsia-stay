const Form = () => {
    return <form action="">
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Lengkap</legend>
            <input type="text" className="input input-bordered" name="name" placeholder="Alvin" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered" name="email" placeholder="example@example.com" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered" name="password" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi</legend>
            <input type="password" className="input input-bordered" name="repeatPassword" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">Daftar</button>
        </div>
    </form>
}

export default Form