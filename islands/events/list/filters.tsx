import CTA from "@/components/buttons/cta.tsx";
import Button from "@/components/buttons/button.tsx";
import { Signal } from "@preact/signals";
import SortAscending from "$tabler/sort-ascending.tsx";
import SortDescending from "$tabler/sort-descending.tsx";

export default function HomeFilters({
  query,
  url,
}: {
  query: Signal<string>;
  url: string;
}) {
  const urlObject = new URL(url);
  const searchParams = urlObject.searchParams;

  return (
    <>
      <form
        className="flex flex-row mb-2"
        onSubmit={(e) => {
          e.preventDefault();

          if (query.value.trim() == "") {
            searchParams.delete("q");
          } else {
            searchParams.set("q", query.value.trim());
          }

          location.search =
            searchParams.toString().trim() == ""
              ? ""
              : `?${searchParams.toString()}`;
        }}
      >
        <input
          type="text"
          className="w-[32rem] mr-2"
          value={query}
          onInput={(e) => (query.value = e.currentTarget.value)}
        />
        <Button
          label={"test"}
          icon={true ? <SortAscending /> : <SortDescending />}
          href={`?a`}
        />
        <CTA btnType="cta" type="submit">
          Download virus
        </CTA>
      </form>
    </>
  );
}
