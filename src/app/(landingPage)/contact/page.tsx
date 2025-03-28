import Image from "next/image"

const page = () => {
    return <main>
        <div className="relative hero min-h-screen rounded-b-3xl overflow-hidden">
            <Image
                src={"/images/hotel-pinangsia-yakarta-20201031100437.jpg"}
                alt="Background image"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1]"
            />
            <div className="hero-overlay bg-opacity-40"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md leading-relaxed">
                    <h2 className="text-xl font-medium pb-2">We are here to help you with all your needs and questions.</h2>
                    <h1 className="mb-5 text-5xl font-bold">With Us, Every Question Answered</h1>
                </div>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center p-10 bg-gray-100 pt-24 pb-24">
            <div className="text-center lg:text-left lg:w-1/3 mb-10 lg:mb-0">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Get More Information</h2>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-red-600">Address</h3>
                    <p>Jl. Pinangsia I No.55 7, RT.7/RW.5, Pinangsia, Kec. Taman Sari, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11110</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-red-600">Email</h3>
                    <p>sapporosoneval123@gmail.com</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-red-600">Phone</h3>
                    <p>+6281296958351</p>
                </div>
            </div>

            <div className="lg:w-1/2">
                <form className="bg-white shadow-md rounded-lg p-8 space-y-6">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full input input-bordered"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full input input-bordered"
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        className="w-full input input-bordered"
                    />
                    <textarea
                        placeholder="Message"
                        className="w-full input input-bordered"
                        rows={4}
                    ></textarea>
                    <button
                        type="submit"
                        className="btn btn-outline btn-error"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </main>
}

export default page