"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const TabList = () => {
    const pathName = usePathname()
    const isTabActive = (path: string) => pathName === path ? "tab-active" : ""

    return <div className="tabs tabs-box" role="tablist">
        <Link href="/auth/signin" role="tab" className={`tab flex-1 ${isTabActive("/auth/signin")}`}>Masuk</Link>
        <Link href="/auth/signup" role="tab" className={`tab flex-1 ${isTabActive("/auth/signup")}`}>Daftar</Link>
    </div>
}

export default TabList