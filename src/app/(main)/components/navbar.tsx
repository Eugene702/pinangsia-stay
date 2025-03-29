import Link from "next/link"
import React from "react"
import { IoLogOut, IoSettings } from "react-icons/io5"
import { RiMenu2Fill } from "react-icons/ri"

const Navbar = () => {
    return <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <label htmlFor="drawer" className="btn btn-square btn-ghost">
                <RiMenu2Fill size={20} />
            </label>
        </div>
        <div className="flex-none">
            <button className="btn btn-ghost min-w-28" popoverTarget="profileDropdown" style={{ anchorName: "--profile-dropdown" } as React.CSSProperties}>
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
                    <button className="flex items-center gap-2 text-error">
                        <IoLogOut />
                        <span>Keluar Akun</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
}

export default Navbar