import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
  Preview,
  Font,
  Column,
  Row,
} from "@react-email/components";
import * as React from "react";
import config from "../tailwind.config.ts";

export default function LoginEmail({ otp = "123456" }: { otp: string }) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bslnt,wght%5D.ttf",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          theme: config.theme,
        }}
      >
        <Body className="bg-white text-gray-800 text-center">
          <Preview>Your authorization code to log in to Events</Preview>
          <Container className="my-8">
            <Img
              src={`https://events.deno.dev/orange-logo.png`}
              width="40"
              height="40"
              alt="Events Logo"
              className="mx-auto"
            />
            <Heading className="text mt-2 text-2xl font-bold">Events</Heading>
            <Heading className="mt-10 mb-2">Verify Your Identity</Heading>
            <Heading className="text-lg font-medium mt-0">
              Enter the following code to finish logging in.
            </Heading>
            {/* Some of the more jank classes I've written */}
            <Text className="text-2xl font-medium mt-20 mb-44 bg-gray-200 rounded-md w-max mx-auto px-6 py-3 ">
              <span className="tracking-[1em]">{otp.slice(0, 5)}</span>
              <span>{otp.slice(5)}</span>
            </Text>
            <Text>
              You can safely ignore this email if you did not request this login
              code.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
