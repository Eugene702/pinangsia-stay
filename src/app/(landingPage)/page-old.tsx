import Image from "next/image"
import Link from "next/link"

const page = () => {
  return <main>
    <div className="relative hero min-h-screen">
      <Image
        src={"/images/hotel.webp"}
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-[-1]"
      />
      <div className="hero-overlay bg-opacity-70"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold">The Reason We All Choose</h2>
          <h1 className="mb-5 text-5xl font-bold">Pinangsia Hotel</h1>
          <p className="mb-5 leading-relaxed">
            At Hotel Pinangsia, we offer you a stay like no other by combining upscale luxury and pampering comfort. Enjoy the best facilities, friendly service and strategic location that make every moment of your stay extraordinary.
          </p>
        </div>
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-b from-transparent to-white/80"></div>

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

    <div className="relative hero min-h-min top-32 bg-red-300">
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md text-black">
          <Image src={"/images/kutip.png"} alt="kutip" className="mx-auto pb-5" width={0} height={0} sizes="100vw" />
          <p className="mb-5 text-2xl">
            “At Hotel Pinangsia, we understand the true meaning of exceptional service. Our team is dedicated to ensuring that your every visit is an experience filled with comfort and satisfaction.”
          </p>

          <div className="text-center">
            <div className="avatar mx-auto mb-3">
              <div className="w-16 rounded-full">
                <Image src={"/images/mando.jpg"} alt="hotel manager" width={0} height={0} sizes="100vw" />
              </div>
            </div>
            <p className="mb-5">Hotel Pinangsia Manager</p>
          </div>
        </div>
      </div>
    </div>

    <div className="relative hero min-h-screen top-36 mb-40">
      <div className="hero-content flex justify-start items-start w-full"> {/* flex, justify-start dan items-start untuk memaksa kiri */}
        <div className="max-w-md text-left ">
          <p className="pb-3 text-xl">Welcoming you to Hotel Pinangsia</p>
          <h1 className="mb-5 text-3xl font-medium">Welcome to Hotel Pinangsia: Where Comfort and Luxury Meet</h1>
          <p className="mb-5 leading-relaxed text-justify">
            At Hotel Pinangsia, we believe that every guest is part of our family. Located in the heart of Jakarta, we offer the perfect combination of comfort, luxury and hospitality. With modern design and attentive service, every stay here is designed to meet your needs and desires. Whether you are on a business trip or vacation, we are ready to provide an unforgettable stay.
          </p>
          <Link href="/about">
            <button className="btn btn-outline btn-error">Reach Our Story</button>
          </Link>
        </div>
      </div>
    </div>
  </main>
}

export default page