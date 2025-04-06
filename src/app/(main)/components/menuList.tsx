import { $Enums } from "@prisma/client";
import { JSX } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaHistory, FaUser } from "react-icons/fa";
import { FaBuildingCircleArrowRight, FaBuildingCircleCheck } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { MdBedroomChild, MdBedroomParent, MdSpaceDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

export type MenuListType = {
    url: string,
    text: string,
    icon?: JSX.Element,
    isTitle: boolean,
    children?: MenuListType[],
    role?: $Enums.Role[]
}

export const menuList: MenuListType[] = [
    {
        icon: <MdSpaceDashboard />,
        text: "Dashboard",
        url: "/dashboard",
        isTitle: false,
        role: ['MANAGER']
    },
    {
        text: "Manajemen Pengguna",
        isTitle: true,
        url: "",
        role: ['MANAGER']
    },
    {
        text: "Daftar Pengguna",
        url: "/users",
        icon: <FaUser />,
        isTitle: false,
        role: ['MANAGER']
    },
    {
        text: "Manajemen Ruangan",
        isTitle: true,
        url: "",
        role: ['MANAGER']
    },
    {
        text: "Kategori Kamar",
        url: "/category",
        icon: <BiSolidCategoryAlt />,
        isTitle: false,
        role: ['MANAGER']
    },
    {
        text: "Daftar Kamar",
        url: "/rooms",
        icon: <MdBedroomChild />,
        isTitle: false,
        role: ['MANAGER']
    },
    {
        text: "Manajemen Meja Resipsionis",
        isTitle: true,
        url: "",
        role: ['MANAGER', "RECIPIENT"]
    },
    {
        text: "Tamu Check-In",
        url: "/check-in",
        icon: <FaBuildingCircleCheck />,
        isTitle: false,
        role: ['MANAGER', "RECIPIENT"]
    },
    {
        text: "Tamu Check-Out",
        url: "/check-out",
        icon: <FaBuildingCircleArrowRight />,
        isTitle: false,
        role: ['MANAGER', "RECIPIENT"]
    },
    {
        text: "Riwayat Pemesanan",
        url: "/reservation-history",
        icon: <FaHistory />,
        isTitle: false,
        role: ['MANAGER', "RECIPIENT"]
    },
    {
        text: "Portal Tamu",
        url: "/",
        isTitle: true,
        role: ['CUSTOMER']
    },
    {
        icon: <MdBedroomParent />,
        text: "Reservasi Kamar",
        url: "/room-reservation",
        isTitle: false,
        role: ['CUSTOMER']
    },
    {
        text: "Pemesanan Saya",
        url: "/my-booking",
        icon: <FaHistory />,
        isTitle: false,
        role: ['CUSTOMER']
    },
    {
        text: "Transaksi Saya",
        url: "/my-transaction",
        icon: <GrTransaction />,
        isTitle: false,
        role: ['CUSTOMER']
    },
    {
        text: "Laporan",
        url: "/",
        isTitle: true,
        role: ['MANAGER']
    },
    {
        text: "Laporan",
        url: "/report",
        icon: <TbReportAnalytics />,
        isTitle: false,
        role: ['MANAGER']
    },
];