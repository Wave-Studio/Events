import { AppProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

const logo = asset("/orange-logo.svg");

export default function App({ Component }: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reservations - OSS Ticketing Software for the Future</title>
        <link rel="icon" href={logo} />
        <link rel="stylesheet" href={asset("/output.css")} />
      </head>
      <body class="text-gray-900 [scrollbar-gutter:stable]">
        <Component />
      </body>
    </html>
  );
}
