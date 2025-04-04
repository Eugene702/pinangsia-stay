import Image from "next/image"
const Loading = () => {
    return <div className="w-full h-screen flex justify-center items-center">
        <Image
            src="/images/logo.png"
            width={0}
            height={0}
            sizes="100wv"
            alt="Logo Hotel Pinangsia"
            className="w-40 h-auto" />
    </div>
}

export default Loading