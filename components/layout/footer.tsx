const Footer = ({ includeWave = true }: { includeWave?: boolean }) => {
	const links: { name: string; link: string; diffSite?: boolean }[] = [
		// imo looks bad with 4 links, we'll put the faq on the homepage
		{
			name: "Faq",
			link: "/faq",
		},
		{
			name: "Privacy",
			link: "/privacy-policy",
		},
		{
			name: "Terms",
			link: "/terms-of-service",
		},
		// {
		//   name: "GitHub",
		//   link: "https://github.com/Wave-Studio/Events",
		//   diffSite: true,
		// },
	];

	return (
		<div class="flex flex-col items-center text-sm print:hidden">
			{includeWave && (
				<p class="flex font-bold">
					a{" "}
					<a
						href="https://wavestudios.one/"
						target="_blank"
						class="mx-1 bg-gradient-to-b from-[#234c70] to-[#0a3860] text-transparent bg-clip-text hover:brightness-200 transition duration-300"
					>
						Wave Studios
					</a>{" "}
					project
				</p>
			)}
			<div className="flex my-4 underline gap-8 font-medium">
				{links.map((link) => (
					<a
						href={link.link}
						target={link.diffSite ? "_blank" : "_self"}
						referrerpolicy={link.diffSite ? "no-referrer" : undefined}
					>
						{link.name}
					</a>
				))}
			</div>
		</div>
	);
};

export default Footer;
