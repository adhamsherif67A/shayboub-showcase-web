import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuHighlights from "@/components/MenuHighlights";
import About from "@/components/About";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MenuHighlights />
      <About />
      <Locations />
      <Footer />
    </div>
  );
};

export default Index;
