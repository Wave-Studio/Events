import { Event, getUser, kv, Roles } from "@/utils/db/kv.ts";
import { AppContext } from "$fresh/server.ts";
import { renderToString } from "preact-render-to-string";
import CTA from "@/components/buttons/cta.tsx";
import imageKit from "../../../../utils/imagekit/index.ts";
import World from "$tabler/world.tsx";
import Scan from "$tabler/text-scan-2.tsx";
import Edit from "$tabler/edit.tsx";
import { ComponentChildren } from "preact";
import { signal } from "@preact/signals";
import Button from "@/components/buttons/button.tsx";
import HomeFilters from "@/islands/events/list/filters.tsx";

export default async function Homepage(req: Request, ctx: AppContext) {
	const url = new URL(req.url);
	const searchParams = url.searchParams;
	const query = signal<string>(searchParams.get("q") ?? "");
	const ascending = signal<boolean>((searchParams.get("o") ?? "a") == "a");
	const user = await getUser(req);

	if (user == undefined) {
		return new Response(undefined, {
			headers: {
				Location: "/login",
			},
			status: 307,
		});
	}

	const events = (
		await kv.getMany<Event[]>(user.events.map((e) => ["event", e]))
	).sort((a, b) => {
		if (a.value == null || b.value == null) return 0;

		if (ascending.value) {
			return (
				new Date(
					a.value.showTimes.sort(
						(a, b) =>
							new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
					)[0].startDate,
				).valueOf() -
				new Date(
					b.value.showTimes.sort(
						(a, b) =>
							new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
					)[0].startDate,
				).valueOf()
			);
		} else {
			return b.value.name.localeCompare(a.value.name);
		}
	});

	const filteredEvents = events.filter(
		(e) =>
			e.value != null &&
			(e.value.name.toLowerCase().includes(query.value.toLowerCase()) ||
				e.value.description
					?.toLowerCase()
					.includes(query.value.toLowerCase()) ||
				e.value.venue?.toLowerCase().includes(query.value.toLowerCase())),
	);

	if (events.filter((event) => event.value != null).length == 0) {
		return (
			<div class="my-auto py-10 flex flex-col gap-8 items-center font-bold max-w-md mx-auto text-center">
				No events found! Create your first event or ask an organizer to invite
				you to one.
				<a href="/events/organizing/create">
					<CTA btnType="cta">Create Event</CTA>
				</a>
			</div>
		);
	}

	if (filteredEvents.filter((event) => event.value != null).length == 0) {
		return (
			<div class="my-auto py-10 flex flex-col gap-8 items-center font-bold max-w-md mx-auto text-center">
				No events found! Modify or remove your search query.
				<a href="?">
					<CTA btnType="cta">Reset query</CTA>
				</a>
			</div>
		);
	}

	const Event = ({ e, id }: { e: Event; id: string }) => {
		const datFmt = new Intl.DateTimeFormat("en-US", {
			year: "2-digit",
			month: "2-digit",
			day: "2-digit",
		});

		const priceFmt = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		});

		const role: Roles = e.members.find((m) => m.email == user.email)!.role;

		const buttons: { label: string; icon: ComponentChildren; href: string }[] =
			[
				{
					label: "Public Page",
					icon: <World class="size-6" />,
					href: `/events/${id}`,
				},
			];

		if (role <= 2) {
			buttons.push({
				label: "Scan Tickets",
				icon: <Scan class="size-6" />,
				href: `/events/${id}/scanning`,
			});
		}

		return (
			<div className="rounded-md border border-gray-300">
				<div className="relative h-48">
					{e.banner.path ? (
						(() => {
							const url = imageKit!.url({
								path: e.banner.path,
								transformation: [
									{
										width: "400",
										quality: "85",
									},
								],
							});
							return (
								<img
									src={url}
									alt=""
									class={`w-full h-48 rounded-t-md ${
										e.banner.fill ? "object-fill" : "object-cover"
									}`}
								/>
							);
						})()
					) : (
						<>
							<img
								src="/placeholder-small.jpg"
								alt=""
								class="h-48 w-full object-cover rounded-t-md"
							/>
							<div className="absolute inset-0 flex justify-center">
								<p className="text-sm mt-1 font-bold text-white/75 mb-6 z-10">
									Placeholder Banner
								</p>
							</div>
						</>
					)}

					<div className="absolute top-1.5 right-1.5 flex justify-end gap-2">
						<div className="rounded-md flex items-center gap-2 text-white font-medium text-sm backdrop-blur-sm bg-black/20 px-2 py-0.5">
							{/* Probably should be done a different way */}
							{
								e.showTimes
									.map(({ maxTickets }) => maxTickets)
									.sort((a, b) => a - b)[0]
							}
						</div>
						{e.price !== 0 && (
							<div className="rounded-md flex items-center gap-2 text-white font-medium text-sm backdrop-blur-sm bg-black/20 px-2 py-0.5">
								{priceFmt.format(e.price)}
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col grow px-4 py-3 h-60">
					<div className="flex overflow-x-auto scrollbar-fancy snap-x gap-2">
						{e.showTimes.map((time) => (
							<div className="rounded-md bg-gray-100 border text-xs font-medium px-1 snap-start">
								{datFmt.format(new Date(time.startDate))}
							</div>
						))}
					</div>
					<h3 className="font-bold text-xl bg-white line-clamp-1">{e.name}</h3>
					{e.venue && (
						<h4 class="-mt-0.5 mb-0.5 text-sm font-semibold truncate">
							{e.venue}
						</h4>
					)}
					{e.description && (
						<div class="text-sm relative grow">
							<p className="line-clamp-6">{e.description}</p>
							<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,1)_100%)]" />
						</div>
					)}
					<div className=" mt-auto flex">
						<div className="flex gap-2">
							{buttons.map((btn) => (
								<Button {...btn} />
							))}
						</div>
						{role <= 2 ? (
							<a href={`/events/${id}/editing`} class="ml-auto">
								<CTA
									btnType="cta"
									btnSize="sm"
									className="!w-10 [@media(min-width:320px)]:!w-40 "
								>
									<Edit class="size-6 [@media(min-width:320px)]:hidden mx-auto" />{" "}
									<p class="hidden [@media(min-width:320px)]:block">
										Edit Event
									</p>
								</CTA>
							</a>
						) : (
							<a href={`/events/${id}/scanning`} class="ml-auto">
								<CTA btnType="cta" btnSize="sm">
									Open Scanner
								</CTA>
							</a>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<HomeFilters query={query} url={req.url} ascending={ascending} />
			<div className="grid md:grid-cols-2 gap-8">
				{filteredEvents.map((event) => {
					if (!event || !event.value) return null;

					return <Event e={event.value} id={event.key[1] as string} />;
				})}
			</div>
			<div className="mt-36 mx-auto flex flex-col items-center">
				<p className="text-center font-bold mb-8">
					Create another event or ask an organizer to invite you to one.
				</p>
				<a href="/events/organizing/create">
					<CTA btnType="cta" btnSize="sm">
						Create Event
					</CTA>
				</a>
			</div>
		</>
	);
}
