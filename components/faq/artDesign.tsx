import { FAQ } from "./questions.tsx";

export const artDesignFAQs: FAQ[] = [
  // {
  //   q: "Who made the logo for this website?",
  //   a: "Lukas (quick007 on discord) made the logos and designed this website.",
  // },
  {
    q: "Where are the placeholder photos from?",
    a: (
      <>
        All of our photos are from various Unsplash artists:
        <ul class="list-inside list-disc text-sm">
          <li>
            Grand Canyon, Arizona Photo by{" "}
            <a
              href="https://unsplash.com/@svenson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              class="underline"
            >
              Sven van der Pluijm
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/photos/W7EgqYJdQOE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              class="underline"
            >
              Unsplash
            </a>
          </li>
        </ul>
      </>
    ),
  },
];
