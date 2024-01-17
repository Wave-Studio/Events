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
} from "@react-email/components";
import * as React from "react";
import config from "../tailwind.config.ts"

export default function LoginEmail({ otp = "123456" }: { otp: string }) {
  return (
    <Html>
      <Head />
      <Tailwind config={{
        theme: config.theme
      }}>
        <Body className="bg-white">
          <Container className="">
            <Img
              src={`https://events.deno.dev/orange-logo.svg`}
              width="212"
              height="88"
              alt="Plaid"
            />
            <Text >Verify Your Identity</Text>
            <Heading >
              Enter the following code to finish linking Venmo.
            </Heading>
            <Section>
              <Text>{otp}</Text>
            </Section>
            <Text>Not expecting this email?</Text>
            <Text>
              Contact{" "}
              <Link href="mailto:login@plaid.com">
                login@plaid.com
              </Link>{" "}
              if you did not request this code.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

