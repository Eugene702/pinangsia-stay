import Link from "next/link"

interface BreadcrumbItem {
    label: string
    href: string
}

interface HeaderProps {
    title: string
    breadcrumbs?: BreadcrumbItem[]
    subtitle?: string
    action?: React.ReactNode
}

const Header = ({ title, breadcrumbs = [], subtitle, action }: HeaderProps) => {
    return <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between">
            <div>
                {breadcrumbs.length > 0 && (
                    <nav className="breadcrumbs text-sm mb-2">
                        <ul>
                            {breadcrumbs.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.href} className="text-gray-500 hover:text-primary transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    </div>
}

export default Header
