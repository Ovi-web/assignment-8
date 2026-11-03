import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail } from "lucide-react";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com", icon: "◎" },
  { label: "Facebook", href: "https://www.facebook.com", icon: "f" },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: "in" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#d7c8b7] bg-[#f4efe9] text-[#102a3f]">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-14">
        <Link href="/" aria-label="BookNook home">
          <Image
            src="/logo.png"
            alt="BookNook Online Library"
            width={200}
            height={56}
            className="h-auto w-[min(60vw,200px)] object-contain"
          />
        </Link>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#53657b] sm:text-base">
          Discover your next favorite read, share books from your shelf, and
          bring readers together—one story at a time.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#53657b]">
          <a
            href="mailto:official@booknook.com"
            className="inline-flex max-w-full items-center gap-2 break-all transition-colors hover:text-[#8a6d4f]"
          >
            <Mail aria-hidden="true" size={16} />
            official@booknook.com
          </a>
          <a
            href="mailto:official@booknook.com"
            className="inline-flex items-center gap-2 transition-colors hover:text-[#8a6d4f]"
          >
            <AtSign aria-hidden="true" size={16} />
            Send us a message
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="flex size-11 items-center justify-center rounded-full border border-[#d7c8b7] bg-[#fffdf9] text-sm font-bold text-[#102a3f] shadow-[0_8px_24px_rgba(16,42,63,0.08)] transition-colors hover:border-[#c29261] hover:bg-[#ebe3d8]"
            >
              <span aria-hidden="true">{icon}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-[#d7c8b7]">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-[#53657b] sm:px-6">
          © 2026 BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}