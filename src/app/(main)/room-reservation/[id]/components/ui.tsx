const Ui = () => {
    return <div className="card lg:card-side">
        <figure>
            <img
                src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                alt="Album" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">Kamar 2</h2>
            <p>Rp. 200.000,00</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary">Buat Pesanan</button>
            </div>
        </div>
    </div>
}

export default Ui