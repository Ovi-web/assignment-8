"use client";

import Image from "next/image";
import { useState } from "react";

const coverStyles = [
  "from-[#102a3f] via-[#183a57] to-[#c29261]",
  "from-[#102a3f] via-[#53657b] to-[#d9b98c]",
  "from-[#53657b] via-[#8a6d4f] to-[#d9b98c]",
  "from-[#102a3f] via-[#31516a] to-[#8a6d4f]",
  "from-[#4b392b] via-[#8a6d4f] to-[#d9b98c]",
];

export default function BookCover({
  imageUrl,
  title,
  author,
  index,
  aspectClass = "aspect-[2/3]",
  imageClassName = "object-cover",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageUrl || imageFailed) {
    return (
      <div
        role="img"
        aria-label={`Cover of ${title}`}
        className={`flex ${aspectClass} flex-col justify-between bg-gradient-to-br p-4 text-white ${
          coverStyles[index % coverStyles.length]
        }`}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/70">
          BookNook Library
        </span>
        <div>
          <p className="line-clamp-4 font-serif text-xl font-bold leading-tight">
            {title}
          </p>
          <p className="mt-3 line-clamp-2 text-xs text-white/75">{author}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} bg-[#ebe3d8]`}>
      <Image
        src={imageUrl}
        alt={`Cover of ${title}`}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 20vw"
        unoptimized
        className={imageClassName}
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}