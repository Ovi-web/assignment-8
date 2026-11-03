import Banner from "@/components/banner";
import AboutSection from "@/components/home/AboutSection";
import FaqSection from "@/components/home/FaqSection";
import NewArrivals from "@/components/home/NewArrivals";
import Testimonials from "@/components/home/Testimonials";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <Banner />
      <NewArrivals />
      <AboutSection />
      <FaqSection />
      <Testimonials />
    </main>
  );
}