"use client"

import Link from "next/link"

const Form = () => {
    return <form action="">
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="text" className="input input-bordered w-full" name="email" placeholder="example@exampl.com" />
            <span className="fieldset-label text-error"></span>
        </fieldset>

        <fieldset className="fieldset">
            <legend className="fieldset-legend">Kata Sandi</legend>
            <input type="password" className="input input-bordered w-full" name="password" placeholder="Alvin702" />
            <span className="fieldset-label text-error"></span>
        </fieldset>


        <div className="flex justify-between">
            <Link href="/auth/forgot-password" className="link">Lupa kata sandi?</Link>
            <button type="submit" className="btn btn-primary btn-sm">Masuk</button>
        </div>
    </form>
}

export default Form