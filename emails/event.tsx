import {
	Body,
	Button,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";
import config from "../tailwind.config.ts";

export default function LoginEmail() {
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
					<Preview>Tickets for the {`{{EVENT-NAME}}`} event!</Preview>
					<Container className="my-8">
						<Img
							src={`https://events.deno.dev/orange-logo.png`}
							width="40"
							height="40"
							alt="Events Logo"
							className="mx-auto"
						/>
						<Heading className="text mt-2 text-2xl font-bold">Events</Heading>
						<Heading className="mt-10 mb-0">Your Tickets!</Heading>
						<Text className="mt-0">{`{{EVENT-NAME}}`}</Text>

						{/* <Heading className="font-bold mt-4 text-xl">Your QR Code</Heading>
            <Text>You'll scan this when entering your event. </Text> */}
						<Container className="bg-gray-100 w-80">
							<p className="border font-semibold text-gray-700  text-sm rounded-md mb-2 mx-auto mt-4 px-2 py-1">
								{`{{TICKETS}}`} ticket(s)
							</p>
							<img
								src={`{{QR-VALUE}}`}
								alt="QR Code"
								width={232}
								className="mb-4"
							/>
						</Container>
					</Container>
					<Container className="my-8">
						<Button
							href="{{TICKET-LINK}}"
							className="mr-3 rounded-md font-semibold peer z-10 hover:brightness-95 transition hover:focus:ring-1 hover:focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed bg-theme-normal ring-[#da7351] text-white px-4 py-2"
						>
							View Ticket
						</Button>
						<a
							href="{{EVENT-LINK}}"
							rel="_blank"
							className="ml-3 rounded-md font-semibold peer z-10 hover:brightness-95 transition hover:focus:ring-1 hover:focus:brightness-100 disabled:brightness-90 disabled:cursor-not-allowed bg-gray-300 ring-gray-400/50 text-gray-800 px-4 py-2"
						>
							View Event
						</a>
						<p className="mt-8 text-sm">
							Buttons not working? Copy and paste this in your browser:{" "}
							{`{{TICKET-LINK}}`}
						</p>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
