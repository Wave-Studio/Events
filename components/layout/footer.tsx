const Footer = () => {
  return (
    <div class="flex flex-col items-center text-sm">
      <p class="flex font-bold">
        a{" "}
        <span class="mx-1 bg-gradient-to-b from-[#234c70] to-[#0a3860] text-transparent bg-clip-text">
          Wave Studios
        </span>{" "}
        project
      </p>
      <div className="flex my-2 underline gap-8 font-medium">
        <a>faq</a>
				<a>privacy</a>
				<a>terms</a>
      </div>
    </div>
  );
};

export default Footer;
