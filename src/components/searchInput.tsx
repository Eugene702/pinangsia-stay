"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent } from "react"
import { useDebouncedCallback } from "use-debounce"

type SearchProps = {
    label: string,
    placeholder: string,
    urlPrefix?: string
}

const SearchInput = ({ label, placeholder, urlPrefix }: SearchProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()

    const handleChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        const queryParams = new URLSearchParams(searchParams)
        const prefix = urlPrefix ? urlPrefix : "search"

        if (target.value != "") {
            queryParams.set(prefix, target.value)
        } else {
            queryParams.delete(prefix)
        }

        router.replace(`${pathName}?${queryParams}`)
    }, 500)

    return <fieldset className="fieldset">
        <legend className="fieldset-legend">{label}</legend>
        <input type="text" className="input input-bordered" placeholder={placeholder} onChange={handleChange} />
    </fieldset>
}

export default SearchInput