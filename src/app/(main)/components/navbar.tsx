"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CSSProperties } from "react"
import { IoLogOut, IoSettings } from "react-icons/io5"
import { RiMenu2Fill } from "react-icons/ri"

const Navbar = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const handleOnClickSignOut = async () => {
        await signOut({
            redirect: false
        })
            .then(() => router.push("/auth"))
    }

    return <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <label htmlFor="drawer" className="btn btn-square btn-ghost">
                <RiMenu2Fill size={20} />
            </label>
        </div>
        <div className="flex-none">
            {
                status != "loading" ?
                    status === "authenticated" ? <>
                        <button className="btn btn-ghost min-w-28" popoverTarget="profileDropdown" style={{ anchorName: "--profile-dropdown" } as CSSProperties}>
                            <div className="avatar">
                                <div className="w-8 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>

                            <span>Eugene Feilian Putra Rangga</span>
                        </button>

                        <ul className="dropdown dropdown-bottom menu w-52 rounded-box bg-base-100 shadow-sm" popover="auto" id="profileDropdown" style={{ positionAnchor: "--profile-dropdown" } as React.CSSProperties}>
                            <li><Link href="/settings/profile">
                                <IoSettings />
                                <span>Pengaturan Akun</span>
                            </Link></li>
                            <li>
                                <button className="flex items-center gap-2 text-error" onClick={handleOnClickSignOut}>
                                    <IoLogOut />
                                    <span>Keluar Akun</span>
                                </button>
                            </li>
                        </ul>
                    </> : <button className="btn btn-ghost" onClick={handleOnClickSignOut}>Silahkan login kembali</button> : <div className="loading"></div>
            }
        </div>
    </div>
}

export default Navbar