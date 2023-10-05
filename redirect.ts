Deno.serve((req) => {
	const url = new URL(req.url);

	url.hostname = "events.deno.dev";
	
	return new Response(undefined, {
		headers: {
			Location: url.toString(),
		},
		status: 301,
	});
});
