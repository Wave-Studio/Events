import { AppProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

const logo = asset("orange-logo.svg");

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>reservations</title>
        <link rel="icon" href={logo} />
        
      </head>
      <body class="text-gray-900">
        <Component />
      </body>
    </html>
  );
}
