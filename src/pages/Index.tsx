import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import About from "@/components/About";
import Locations from "@/components/Locations";
import ReservationForm from "@/components/ReservationForm";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MenuSection />
      <ReservationForm />
      <About />
      <Locations />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
