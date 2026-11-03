"use client";

import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  {
    image: "/custom-img-1.jpg",
    alt: "Reader enjoying a new book at home",
    eyebrow: "Neighborhood library",
    title: "Share the books shaping your story.",
    description:
      "Borrow, lend, and discover books that actually make your next chapter memorable.",
  },
  {
    image: "/custom-img-02.jpg",
    alt: "Warm and welcoming reading corner",
    eyebrow: "Borrow with ease",
    title: "Your library, right at your doorstep.",
    description:
      "Browse nearby shelves, borrow for a week, and bring home a story worth keeping.",
  },
  {
    image: "/custom-img-3.jpg",
    alt: "Curated shelves and thoughtful book lovers",
    eyebrow: "Built for readers",
    title: "A richer reading life, one book at a time.",
    description:
      "Curated for book lovers who want more discovery, connection, and simple sharing.",
  },
];

export default function Banner() {
  return (
    <section aria-label="Discover BookNook" className="booknook-banner">
      <Swiper
        modules={[A11y, Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        pagination={{ clickable: true }}
        aria-label="BookNook featured stories"
        className="w-full"
      >
        {slides.map((slide, index) => {
          const Heading = index === 0 ? "h1" : "h2";

          return (
            <SwiperSlide key={slide.title}>
              <div className="relative flex h-[640px] items-center overflow-hidden bg-[#1f2c36] sm:h-[660px] lg:h-[clamp(580px,34vw,760px)]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading="eager"
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,35,53,0.82)_0%,rgba(12,35,53,0.62)_42%,rgba(12,35,53,0.18)_100%)]"
                />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-8 text-white sm:px-8 lg:px-12">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9b98c]">
                    {slide.eyebrow}
                  </p>
                  <Heading className="max-w-xl text-4xl font-semibold leading-[0.9] text-white sm:text-5xl lg:text-[4rem]">
                    {slide.title}
                  </Heading>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                    {slide.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/all-books"
                      className="inline-flex items-center justify-center rounded-full bg-[#c29261] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#102a3f] transition-colors hover:bg-[#d5b48a]"
                    >
                      Browse Books
                    </Link>
                    <Link
                      href="/add-books"
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
                    >
                      Add a Book
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}