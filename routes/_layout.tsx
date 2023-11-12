import { defineLayout } from "$fresh/server.ts";
import Footer from "../components/layout/footer.tsx";
import Navbar from "../components/layout/navbar.tsx";
import { Partial } from "$fresh/runtime.ts";

export default defineLayout((req, { Component }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /*f-client-nav*/ />
      {/* <Partial name="navbar"> */}
      <div className="flex flex-col grow">
        <Component />
      </div>
      {/* </Partial> */}
      <Footer />
    </div>
  );
});
