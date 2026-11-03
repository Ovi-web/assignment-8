import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-[#f4efe9] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="overflow-hidden rounded-[2rem] border border-[#d7c8b7] bg-white p-3 shadow-[0_32px_72px_rgba(16,42,63,0.08)]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <Image
                src="/custom-img-04.jpg"
                alt="Reader enjoying a book and browsing a laptop"
                width={1040}
                height={820}
                className="h-[min(70vw,520px)] min-h-64 w-full object-cover sm:h-[420px] lg:h-[520px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#102a3f]">About us</p>
            <h2 className="text-3xl font-semibold text-[#102a3f] sm:text-4xl lg:text-5xl">About BookNook</h2>
            <p className="text-base leading-8 text-[#445a6d]">
              A thoughtful space for readers to discover, share, and revisit great books. We believe every book deserves a second life and every story is better when it is passed along.
            </p>
            <p className="text-base leading-8 text-[#445a6d]">
              BookNook brings readers together with a simpler way to lend books nearby, keep track of what is on your shelf, and find the next favorite story to read together.
            </p>
            <div className="pt-2">
              <Link
                href="/all-books"
                className="inline-flex items-center justify-center rounded-full bg-[#102a3f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#183d5d]"
              >
                Our services
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="order-2 space-y-6 lg:order-1">
            <blockquote className="font-display text-3xl leading-tight text-[#102a3f] sm:text-[2.5rem]">
              “A library that grows with every reader who shares a story.”
            </blockquote>
            <p className="text-base leading-8 text-[#445a6d]">
              We make it simple to turn your reading shelf into a neighborhood resource. Share what you have loved, borrow a new favorite, and keep the joy of reading moving between readers who value thoughtful recommendations.
            </p>
          </div>

          <div className="order-1 overflow-hidden rounded-[2rem] border border-[#d7c8b7] bg-white p-3 shadow-[0_32px_72px_rgba(16,42,63,0.08)] lg:order-2">
            <div className="overflow-hidden rounded-[1.5rem]">
              <Image
                src="/custom-img-14.jpg"
                alt="Reader sitting with a book and enjoying a relaxed reading session"
                width={980}
                height={760}
                className="h-[min(60vw,420px)] min-h-60 w-full object-cover sm:h-[360px] lg:h-[420px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
