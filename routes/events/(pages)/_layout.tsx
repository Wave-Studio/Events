import { defineLayout } from "$fresh/server.ts";

export default defineLayout((req, ctx) => {
  const url = new URL(req.url);
  const tabName = url.pathname.split("/")[2];
  const isCreation = url.pathname.split("/")[3] == "create";
  //const data = await loadData();

  return (
    <>
      <h1 class="text-center text-4xl font-bold">
        {isCreation ? "Event Creation" : "Events"}
      </h1>

      <div className="px-4 max-w-screen-md w-full mx-auto mb-20 flex flex-col grow">
        <ctx.Component />
      </div>
    </>
  );
});
