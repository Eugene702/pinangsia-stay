import Image from "next/image"

const page = () => {
    return <main>
        <div className="relative hero min-h-screen rounded-b-3xl overflow-hidden">
            <Image
                src={"/images/kamar3.jpg"}
                alt="Background image"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1]" // Atur agar berada di belakang konten lain
            />
            <div className="hero-overlay bg-opacity-40"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md leading-relaxed">
                    <h2 className="text-xl font-medium pb-2">Welcoming you to Hotel Pinangsia</h2>
                    <h1 className="mb-5 text-5xl font-bold">Where Comfort and Luxury Meet</h1>
                </div>
            </div>
        </div>

        <div className="relative hero min-h-screen">
            <div className="hero-content text-neutral-content">
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 text-left">
                        <p className="text-lg font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-400 pb-2">
                            Our Footsteps
                        </p>
                        <h1 className="mb-5 text-4xl font-bold text-red-600">
                            Our History and Dedication in Welcoming Every Guest
                        </h1>
                    </div>
                    <div className="w-full md:w-1/2 text-left">
                        <p className="pt-10 text-justify text-gray-800 dark:text-gray-300">
                            Hotel Pinangsia is a two-star hotel located in Jakarta, precisely in the Mangga Dua area. The hotel offers facilities such as free Wi-Fi in public areas, air-conditioned rooms, a restaurant, room service, and a 24-hour front desk. The location is very strategic, close to various places of interest such as the Wayang Museum, Mangga Dua Square, and Ancol Dreamland.
                        </p>
                        <p className="mt-4 text-justify text-gray-800 dark:text-gray-300">
                            Built with simple yet functional architecture, Hotel Pinangsia provides guests with comfort and easy access. The hotel is also known for its friendly service and adequate facilities, making it a good choice for tourists and business travelers looking for affordable accommodation in downtown Jakarta.
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div className="relative hero min-h-screen">
            <div className="hero-content text-neutral-content">
                {/* Gunakan flex-col pada mobile dan flex-row pada desktop */}
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col-reverse md:flex-row">
                    {/* Bagian Kiri (Judul) */}
                    <div className="w-full md:w-1/2 text-left mr-32">
                        <h1 className="text-lg text-red-600 pt-10 text-justify font-bold">
                            Vision
                        </h1>
                        <p className="text-lg mt-4 text-justify text-gray-800 dark:text-gray-300">
                            Hotel Pinangsia is committed to providing the best stay experience for every guest with a focus on comfort, cleanliness, and friendly service. We strive to be the first choice of guests looking for quality accommodation at affordable prices in Jakarta.
                        </p>

                        <h1 className="text-lg text-red-600 pt-10 text-justify font-bold">
                            Mission
                        </h1>
                        <ul className="list-none space-y-4 mt-4 text-gray-800 dark:text-gray-300">
                            <li>
                                <span className="font-bold">1. Providing Excellent Service:</span> We are always ready to serve our guests with 24-hour reception and various additional services such as express check-in and 24-hour room service.
                            </li>
                            <li>
                                <span className="font-bold">2. Maintain Cleanliness and Comfort:</span> We provide clean and comfortable rooms, equipped with modern amenities such as AC, TV, and WiFi to ensure guests feel right at home.
                            </li>
                            <li>
                                <span className="font-bold">3. Strategic Location:</span> Located in the heart of Jakarta, we make it easy for guests to access various shopping venues and business centers.
                            </li>
                            <li>
                                <span className="font-bold">4. Commitment to the Environment:</span> Reducing environmental impact through efficient use of energy and good waste management.
                            </li>
                            <li>
                                <span className="font-bold">5. Employee Development:</span> Improving service quality through continuous employee training to ensure consistent and quality service.
                            </li>
                        </ul>
                    </div>

                    {/* Bagian Kanan (Deskripsi) */}
                    <div className="w-full md:w-1/2 text-left pt-10">
                        <h1 className="mb-5 text-4xl font-bold text-red-600">
                            Realizing Dreams, <br />Beyond Expectations
                        </h1>
                        <div className="divider w-1/2"></div>
                        <h1 className="mb-5 text-4xl font-bold text-red-600">
                            Reaching the Future with Dedication
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </main>
}

export default page