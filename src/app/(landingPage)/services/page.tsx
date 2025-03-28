import Image from "next/image"

const page = () => {
    return <main>
        <div className="relative hero min-h-screen rounded-b-3xl overflow-hidden">
            <Image
                src={"/images/kamar2.jpg"}
                alt="Background image"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-[-1]"
            />
            <div className="hero-overlay bg-opacity-40"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md leading-relaxed">
                    <h2 className="text-xl font-medium pb-2">Choose the type of room that suits your needs and enjoy the special services from Hotel Pinangsia.</h2>
                    <h1 className="mb-5 text-5xl font-bold">A Variety of Rooms for Every Need and Style</h1>
                </div>
            </div>
        </div>

        <div className="relative hero min-h-screen top-24">
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-full">
                    <h1 className="mb-5 text-4xl font-medium text-black pb-10">Variety of Rooms for Your Comfort</h1>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="card bg-base-300 w-64">
                            <figure className="px-4 pt-4 transition transform hover:scale-105 duration-300">
                                <Image src={"/images/kamar1.png"} alt="Superior room" className="rounded-xl w-full h-auto" width={0} height={0} sizes="100vw" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-lg font-medium text-black">Superior</h2>
                                <p className="text-xs pt-1 pb-1 text-black text-justify">
                                    Enjoy more comfort in our elegant and modern Superior room. With more space and additional amenities, these rooms are designed to give you a more comfortable and enjoyable stay.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-300 w-64">
                            <figure className="px-4 pt-4 transition transform hover:scale-105 duration-300">
                                <Image src={"/images/kamar2.jpg"} alt="Superior room" className="rounded-xl w-full h-auto" width={0} height={0} sizes="100vw" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-lg font-medium text-black">Deluxe</h2>
                                <p className="text-xs pt-1 pb-1 text-black text-justify">
                                    Our Deluxe Rooms offer a higher level of luxury with plush decor and high-end amenities. With great views and extra comforts, these rooms are the perfect choice for a longer vacation or business trip.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-300 w-64">
                            <figure className="px-4 pt-4 transition transform hover:scale-105 duration-300">
                                <Image src={"/images/kamar3.jpg"} alt="Superior room" className="rounded-xl w-full h-auto" width={0} height={0} sizes="100vw" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-lg font-medium text-black">Suite</h2>
                                <p className="text-xs pt-1 pb-1 text-black text-justify">
                                    Experience seamless luxury in our most exclusive suite. With a separate living room, luxurious bedroom and premium amenities, these rooms give you an unforgettable stay. Ideal for guests seeking ultimate luxury and privacy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
}

export default page