const Table = () => {
    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Nomor Transaksi</th>
                    <th>Kamar yang dipesan</th>
                    <th>Total biaya</th>
                    <th>Pelunasan</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>123456</td>
                    <td>Deluxe Room</td>
                    <td>Rp 1.000.000</td>
                    <td>Belum lunas</td>
                    <td>
                        <button className="btn btn-primary btn-sm">Buat Invoice</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}

export default Table