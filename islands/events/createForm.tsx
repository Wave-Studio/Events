import { useState } from "preact/hooks";
import { User, defaultEvent } from "@/utils/db/kv.types.ts";
import StageZero from "./zero.tsx";
import StageOne from "@/islands/events/one.tsx";
import { useSignal } from "@preact/signals";


export default function CreateEvent({ user }: { user: User }) {
  const eventData = useSignal(defaultEvent(user.email));
  const [page, setPage] = useState(1);
	const [error, setError] = useState<string>()

  return (
    <div class="flex flex-col items-center mt-4">
      {page === 0 && <StageZero eventState={eventData} setPage={setPage} setError={setError} />}
      {page === 1 && <StageOne eventState={eventData} setPage={setPage} />}
			{JSON.stringify(eventData.value)}
			{page}
{error &&
			<p className="mt-6 text-red-500">
				{error}
			</p>}
    </div>
  );
}
