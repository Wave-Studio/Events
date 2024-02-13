import useClickAway from "@/components/hooks/onClickAway.tsx";
import { useRef, useState } from "preact/hooks";
import CTA from "@/components/buttons/cta.tsx";
import X from "$tabler/x.tsx";
import { Signal } from "@preact/signals";
import { ComponentChildren } from "preact";
import Popup from "@/components/popup.tsx";

const Deletion = ({
  fetch,
  name,
  open,
  routeTo,
  children,
  customMsg,
}: {
  fetch: () => Promise<Response>;
  routeTo?: string;
  name: string;
  open: Signal<boolean>;
  children: ComponentChildren;
  customMsg?: string;
}) => {
  const [loading, setLoading] = useState<boolean | string>(false);

  const deleteEvent = async () => {
    setLoading(true);
   
    const res = await fetch();
    const data = await res.json();
    if (data.error) {
      setLoading(data.error);
    } else if (!res.ok) {
      setLoading("An unknown error occurred");
    } else {
      if (routeTo) {
        location.href = routeTo;
      }
    }
    setLoading(false);
  };

  const DeleteUI = () => {
    if (!open.value) return null;

    return (
      <Popup close={() => (open.value = false)} isOpen={open.value}>
        <h5 className="font-bold text-xl">
          Delete <span class="capitalize">{name}</span>
        </h5>
        <p>
          {customMsg || `Are you sure you want to delete this ${name}? This action is
          irrevocable and cannot be undone!`}
        </p>
        <CTA
          btnType="secondary"
          btnSize="sm"
          className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 mt-4 ml-auto"
          onClick={deleteEvent}
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </CTA>
        <button
          className="absolute right-2 top-2 p-0.5 rounded-md hover:bg-gray-200 transition"
          onClick={close}
        >
          <X class="size-5" />
        </button>
        {typeof loading == "string" && (
          <p className="text-red-500 mt-2">Error: {loading}</p>
        )}
      </Popup>
    );
  };

  return (
    <>
      {children}
      <DeleteUI />
    </>
  );
};

export default Deletion;
