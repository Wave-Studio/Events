import CTA from "@/components/buttons/cta.tsx";
import Button from "@/components/buttons/button.tsx";
import { Signal } from "@preact/signals";
import SortAscending from "$tabler/sort-ascending.tsx";
import SortDescending from "$tabler/sort-descending.tsx";

export default function HomeFilters({
  query,
  url,
  ascending,
}: {
  query: Signal<string>;
  ascending: Signal<boolean>;
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

          searchParams.set("o", ascending.value ? "a" : "d");
          searchParams.set("q", query.value.trim());

          if (query.value.trim() == "") {
            searchParams.delete("q");
          }

          if (ascending.value) {
            searchParams.delete("o");
          }

          console.log(searchParams.toString());

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
          label={`Sort ${ascending.value ? "ascending" : "descending"}`}
          icon={ascending.value ? <SortAscending /> : <SortDescending />}
          onClick={() => {
            ascending.value = !ascending.value;
          }}
        />
        <CTA btnType="cta" type="submit">
          Apply
        </CTA>
      </form>
    </>
  );
}
