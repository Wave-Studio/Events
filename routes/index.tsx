import { useSignal } from "@preact/signals";
import CTA from "@/components/buttons/cta.tsx";
import { useState } from "preact/hooks";
import { defineRoute } from "$fresh/server.ts";
import { getUser } from "@/utils/db/kv.ts";
import ChevronDown from "$tabler/chevron-down.tsx";
import StarFilled from "$tabler/star-filled.tsx";
import { Head } from "$fresh/runtime.ts";

const metaDescription = "Event booking/reservation systems are often complex, monolithic platforms that are hard to use and harder to manage. Our mission is to create a simple, open source, and easy-to-use event ticketing system for events that don't require seating arrangements.";

export default defineRoute(async (req, ctx) => {
  const user = await getUser(req);
  const loggedIn = user != undefined;

  // DENO_DEPLOYMENT_ID will be set on prod, not local
  // 👍
  return (
    <>
      <Head>
        <meta
          property="og:title"
          content="Reservations - Open Source Ticketing tool"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://reservations.deno.dev" />
        <meta
          property="og:image"
          content="http://reservations.deno.dev/favicon.ico"
        />
        <meta
          property="og:description"
          content={metaDescription}
        />
        <meta name="description" content={metaDescription} />
        <meta name="theme-color" content="#DC6843" />
      </Head>

      <div className="flex flex-col h-[calc(100vh-4.5rem)] items-center">
        <div class="flex flex-col px-2 items-center ">
          <h1 class="text-center text-4xl font-bold -mt-3">reservations</h1>
          <div class="w-44 flex items-center mt-2">
            <div class="grow bg-gray-200 h-0.5 rounded-full" />
            <p class="w-max mx-1.5 leading-3">made simple</p>
            <div class="grow bg-gray-200 h-0.5 rounded-full" />
          </div>
        </div>
        <div className="my-auto flex flex-col pb-12">
          <a href={loggedIn ? "/events" : "/login"}>
            <CTA btnType="cta">i'm organizing</CTA>
          </a>
          <a
            href={loggedIn ? "/events?attending=true" : "/login?attending=true"}
            class="mt-4 mb-3"
          >
            <CTA btnType="secondary">i'm attending</CTA>
          </a>
          <a
            href="https://github.com/Wave-Studio/reservations"
            referrerpolicy="no-referrer"
            target="_blank"
            class="mx-auto text-sm font-medium flex rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 py-0.5 px-2 transition group"
          >
            <StarFilled class="h-5 w-5 mr-1 group-hover:text-yellow-500 transition" />
            star us on github
          </a>
        </div>

        <div class="text-lg text-gray-500">scroll for more</div>
        <ChevronDown class="h-5 w-5 animate-bounce text-gray-500" />
      </div>

      <div className="py-24 text-center px-2 max-w-xl w-full mx-auto">
        <h2 className="text-2xl font-bold">our mission</h2>
        <p className="mt-4 ">
          Event booking/reservation systems are often complex, monolithic
          platforms that are hard to use and harder to manage. Our mission is to
          create a simple, open source, and easy-to-use event ticketing system
          for events that don't require seating arrangements. We strive to
          create a frictionless experience for your attendees, boosting signup
          numbers and making sure your attendees arrive the day of.
        </p>
        <h2 className="text-2xl font-bold mt-16">why reservations?</h2>
        <p className="my-4 ">
          When it comes to managing or creating reservation systems for a
          ticketed event, traditional solutions can be cumbersome and
          challenging to use. Our platform, reservations, offers a simple, OSS,
          easy-to-use ticketing system for events that allows users to reserve
          their seats ahead of time. Our registration process lets users sign up
          online using their email and receive a QR code that serves as their
          ticket, which an event organizer can scan to confirm their
          reservation. Simplify your reservation management and provide your
          customers with a seamless booking experience today! Contact quick007
          on discord to join the closed beta.
        </p>
        <a href="/features">
          <CTA btnType="secondary" size="sm">
            All Features
          </CTA>
        </a>
        <h2 className="text-2xl font-bold mt-16">pricing</h2>
        <p className="my-4 ">
          As we're still in a closed beta, reservations is currently free for to
          use. In the future, reservations will be free to use for small free
          events. Larger events or paid events will have a small fee. See our
          expected future pricing:
        </p>
        <a href="/pricing">
          <CTA btnType="secondary" size="sm">
            Pricing
          </CTA>
        </a>
      </div>
    </>
  );
});
