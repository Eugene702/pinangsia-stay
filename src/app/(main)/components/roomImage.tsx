"use client"

import Image from "next/image"
import { useState } from "react"

interface RoomImageProps {
    src: string
    alt: string
    className?: string
}

const RoomImage = ({ src, alt, className }: RoomImageProps) => {
    const [imageSrc, setImageSrc] = useState(src)

    const handleError = () => {
        setImageSrc('/images/kamar1.png')
    }

    return (
        <Image
            src={imageSrc}
            fill
            className={className}
            alt={alt}
            onError={handleError}
        />
    )
}

export default RoomImage
