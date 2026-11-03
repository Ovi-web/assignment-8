import { Cormorant_Garamond, Manrope } from "next/font/google";
import "swiper/css";
import "swiper/css/pagination";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sansFont = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "BookNook",
  description: "A modern neighborhood library for lending, borrowing, and discovering books.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="light"
          toastOptions={{
            style: {
              background: "#fffdf9",
              border: "1px solid #d7c8b7",
              color: "#102a3f",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}