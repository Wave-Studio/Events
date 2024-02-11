import { defineLayout } from "$fresh/server.ts";

export default defineLayout((req, ctx) => {
  return ( 
	<div class="flex justify-center w-full">
		<div class="grid w-64">
			s
		</div>
		<div class="flex flex-col max-w-screen-md w-full">
		 <ctx.Component />
		</div>
	</div>)
	;
});
