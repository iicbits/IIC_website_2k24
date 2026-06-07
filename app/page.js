import Image from "next/image";
import Hero from "./Home/components/Hero";
import IntroIIC from "./Home/components/IntroIIC";
import Events from "./Home/components/Events";
import Resources from "./Home/components/Resources";
import JoinUs from "./Home/components/JoinUs";
import FAQComponent from "./Home/components/Faqs";
import Testimonials from "./Home/components/Testimonials";
import Spotlight from "./Home/components/Spotlight";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <div className="md:min-h-screen h-fit w-full py-4">
        <div className="absolute w-full md:h-full flex justify-center md:items-end pt-24 md:pt-0 z-10 text-3xl lg:text-9xl font-bold tracking-wider text-gray-300/50">
          INCUBATION CENTRE
        </div>
        <div className="relative z-0">
          <Image
            src="/home/banner_IC.webp"
            alt="Incubation Centre"
            width={700}
            height={400}
            className="object-fit w-full"
            priority
          />
        </div>
      </div>
      <IntroIIC />
      <Events />
      <Spotlight />
      {/* <Resources /> */}
      <Testimonials />
      <FAQComponent />
      <JoinUs />
    </main>
  );
}
