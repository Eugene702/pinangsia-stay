import Link from "next/link"

type BreadcrumbsProps = {
    item: {
        text: string,
        url?: string
    }[]
}

const Breadcrumbs = ({ item }: BreadcrumbsProps) => {
    return <div className="breadcrumbs text-xs">
        <ul>
            {
                item.map((e, index) => <li key={index}>
                    {
                        e.url ? <Link href={e.url}>{ e.text }</Link> : <span>{e.text}</span>
                    }
                </li>)
            }
        </ul>
    </div>
}

export default Breadcrumbs