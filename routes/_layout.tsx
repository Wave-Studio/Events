import { defineLayout } from "$fresh/server.ts";
import Footer from "../components/layout/footer.tsx";
import Navbar from "../components/layout/navbar.tsx";

export default defineLayout((req, { Component }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col grow">
        <Component />
      </div>
      <Footer />
    </div>
  );
});
