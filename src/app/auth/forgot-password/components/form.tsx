const Form = () => {
    return <form action="">
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered" name="email" placeholder="example@example.com" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">Kirim Permintaan Reset Kata Sandi</button>
        </div>
    </form>
}

export default Form