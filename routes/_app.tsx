import { PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import { Partial } from "$fresh/runtime.ts";

const logo = asset("/orange-logo.svg");

export default function App({ Component }: PageProps) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Events - OSS Ticketing Software for the Future</title>
				<link rel="icon" href={logo} />
				<link rel="stylesheet" href={asset("/styles.css")} />
			</head>
			<body class="text-gray-900 [scrollbar-gutter:stable]" /*f-client-nav*/>
				{/* <Partial name="body"> */}
				<Component />
				{/* </Partial> */}
			</body>
		</html>
	);
}
