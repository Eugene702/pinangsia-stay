"use client"

import Image from "next/image"
import Link from "next/link"
import { menuList, MenuListType } from "./menuList"
import { usePathname } from "next/navigation"

const Sidenav = () => {
    const pathname = usePathname()

    const renderMenu = (menu: MenuListType, index: number) => {
        if(menu.isTitle){
            return <li className="menu-title" key={index}>{ menu.text }</li>
        }

        if(menu.children === undefined){
            return <li key={index}>
                <Link href={menu.url} className={`flex items-center ${pathname.startsWith(menu.url) ? 'menu-active' : ''}`}>
                    { menu.icon }
                    <span>{ menu.text }</span>
                </Link>
            </li>
        }else{
            return <li key={index}>
                <details open={menu.children.some(child => pathname.startsWith(child.url))}>
                    <summary>{ menu.text }</summary>
                    <ul>
                        { menu.children.map((child, index) => renderMenu(child, index)) }
                    </ul>
                </details>
            </li>
        }
    }

    return <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-70 p-4 border-r border-r-gray-200">
            <li className="mb-5">
                <div className="flex items-center gap-2 cursor-default hover:bg-transparent">
                    <Image
                        src="/images/logo.png"
                        width={0}
                        height={0}
                        className="w-10 h-auto"
                        alt="Logo" />
                    <span className="text-lg font-bold">Pinangsia Stay</span>
                </div>
            </li>
            { menuList.map((menu, index) => renderMenu(menu, index)) }
        </ul>
    </div>
}

export default Sidenav