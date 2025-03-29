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
    children?: MenuListType[]
}

export const menuList: MenuListType[] = [
    {
        icon: <MdSpaceDashboard />,
        text: "Dashboard",
        url: "/dashboard",
        isTitle: false
    },
    {
        text: "Manajemen Pengguna",
        isTitle: true,
        url: "",
    },
    {
        text: "Daftar Pengguna",
        url: "/users",
        icon: <FaUser />,
        isTitle: false
    },
    {
        text: "Manajemen Ruangan",
        isTitle: true,
        url: "",
    },
    {
        text: "Kategori Kamar",
        url: "/category",
        icon: <BiSolidCategoryAlt />,
        isTitle: false
    },
    {
        text: "Daftar Kamar",
        url: "/rooms",
        icon: <MdBedroomChild />,
        isTitle: false
    },
    {
        text: "Manajemen Meja Resipsionis",
        isTitle: true,
        url: "",
    },
    {
        text: "Tamu Check-In",
        url: "/check-in",
        icon: <FaBuildingCircleCheck />,
        isTitle: false
    },
    {
        text: "Tamu Check-Out",
        url: "/check-out",
        icon: <FaBuildingCircleArrowRight />,
        isTitle: false
    },
    {
        text: "Riwayat Pemesanan",
        url: "/reservation-history",
        icon: <FaHistory />,
        isTitle: false
    },
    {
        text: "Portal Tamu",
        url: "/",
        isTitle: true
    },
    {
        icon: <MdBedroomParent />,
        text: "Reservasi Kamar",
        url: "/room-reservation",
        isTitle: false
    },
    {
        text: "Pemesanan Saya",
        url: "/my-booking",
        icon: <FaHistory />,
        isTitle: false
    },
    {
        text: "Transaksi Saya",
        url: "/my-transaction",
        icon: <GrTransaction />,
        isTitle: false
    },
    {
        text: "Laporan",
        url: "/",
        isTitle: true
    },
    {
        text: "Laporan",
        url: "/report",
        icon: <TbReportAnalytics />,
        isTitle: false
    },
];