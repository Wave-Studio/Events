import Select from "@/islands/components/pickers/select.tsx";
import Button from "@/components/buttons/button.tsx";
import Search from "$tabler/search.tsx";
import { Signal } from "@preact/signals";

export default function TicketsFilters({
  query,
  sort,
}: {
  query: Signal<string>;
  sort: Signal<number>;
}) {
  return (
    <form
      class="flex gap-2 mt-8 flex-col md:flex-row"
      onSubmit={(e) => {
        e.preventDefault();

        const url = new URL(window.location.href);
        const searchParams = url.searchParams;

        searchParams.set("q", query.value);
        searchParams.set("s", sort.value.toString());

        if (query.value == "") searchParams.delete("q");
        if (sort.value == 0) searchParams.delete("s");

        url.search = searchParams.toString();

        location.href = url.toString();
      }}
    >
      <div class="flex gap-2">
        <Select
          options={["Purchused", "Email A-Z", "Email Z-A"]}
          selectClassName="py-2"
          className="grow"
          selected={sort.value}
          updateOption={(e) => (sort.value = e)}
        />
        <Button
          icon={<Search class="w-5 h-5" />}
          label="Search Users"
          type="submit"
        />
      </div>
    </form>
  );
}