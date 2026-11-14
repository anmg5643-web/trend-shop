import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Products from "../components/Products.jsx";
import Cities from "../components/Cities.jsx";
import Footer from "../components/Footer.jsx";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Cities />
      </main>
      <Footer />
    </div>
  );
}
