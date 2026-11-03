"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const testimonials = [
  {
    name: "Maya R.",
    title: "Weekend reader",
    quote:
      "BookNook made it easy to find books I never would have discovered on my own. The borrowing flow feels effortless and the community is genuinely warm.",
  },
  {
    name: "Daniel T.",
    title: "Student and reviewer",
    quote:
      "The interface is calm and simple, and I love how quickly I can add books I have finished. It feels like my own little neighborhood library online.",
  },
  {
    name: "Alicia W.",
    title: "Book club host",
    quote:
      "I found a few of our next book club picks here. It has become the easiest way to keep our reading list fresh and shared between everyone.",
  },
  {
    name: "Harper L.",
    title: "Parents' reading circle",
    quote:
      "The site feels polished and easy to use. I can quickly recommend books to friends and discover thoughtful reads for my family.",
  },
  {
    name: "Noah S.",
    title: "Frequent borrower",
    quote:
      "I love how easy it is to browse local recommendations and swap books with other readers. It feels personal and genuinely useful.",
  },
  {
    name: "Sophia K.",
    title: "Community member",
    quote:
      "From discovering new titles to sharing my favorites, BookNook makes reading feel like a richer part of everyday life.",
  },
];

export default function Testimonials() {
  return (
    <section className="booknook-testimonials bg-[#102a3f] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d9b98c]">Testimonials</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Readers love BookNook</h2>
        </div>

        <div className="mt-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="booknook-testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9b98c] text-sm font-semibold text-[#102a3f]">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.title}</p>
                    </div>
                  </div>

                  <div className="mb-5 flex items-center gap-1 text-[#d9b98c]" aria-label="Five star review">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>

                  <p className="text-base leading-7 text-white/80">“{testimonial.quote}”</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
