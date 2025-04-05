import dynamic from "next/dynamic"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = () => {
    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Nomor Pesanan</th>
                    <th>Kategori Kamar</th>
                    <th>Nomor Kamar</th>
                    <th>Waktu Check In</th>
                    <th>Waktu Check Out</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>123456789</td>
                    <td>Deluxe</td>
                    <td>101</td>
                    <td>2023-10-01 14:00</td>
                    <td>2023-10-05 12:00</td>
                </tr>
            </tbody>
        </table>

        <Pagination
            hasNext={false}
            hasPrev={false} />
    </>
}

export default Table