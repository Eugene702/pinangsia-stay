const Form = () => {
    return <form action="">
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi Baru</legend>
            <input type="password" className="input input-bordered" name="password" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Ulangi Kata Sandi Baru</legend>
            <input type="password" className="input input-bordered" name="repeatPassword" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">Reset Kata Sandi</button>
        </div>
    </form>
}

export default Form