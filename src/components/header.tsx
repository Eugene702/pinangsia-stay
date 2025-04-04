import { BreadcrumbsProps } from "@/components/breadcrumbs";
import dynamic from "next/dynamic";

const Breadcrumbs = dynamic(() => import("@/components/breadcrumbs"));
type Props = {
    title: string,
    breadcrumbs: BreadcrumbsProps["item"]
}

const Header = ({ title, breadcrumbs }: Props) => {
    return <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{ title }</h1>
        <Breadcrumbs
            item={breadcrumbs} />
    </div>
}

export default Header