const Navbar = () => {

  const loggedIn = true

  return (
    <div class="flex mt-1 md:mt-2 mb-2 sticky top-0 bg-white h-14 z-30">
      <div className={`fixed left-0 right-0 top-0 flex justify-center items-center h-14`}>
        <a href="/"><Logo /></a>
      </div>
    </div>
  );
};

const Logo =
  () => (<svg
    width="56"
    height="58"
    viewBox="0 0 56 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="transition h-12 group cursor-pointer"
  >
    <path
      d="M20.7451 12.0789C20.7451 16.2647 26.6826 25.3421 28.2451 28.5C30.1201 25.3421 35.7451 16.2647 35.7451 12.0789C35.7451 7.89321 32.3873 4.5 28.2451 4.5C24.103 4.5 20.7451 7.89321 20.7451 12.0789Z"
      fill="black"
      class="transition group-hover:translate-y-0.5"
    />
    <path
      d="M5.30868 36.7099C8.93363 34.617 19.7637 35.2203 23.2797 34.9946C21.4824 38.1973 16.4336 47.6074 12.8087 49.7003C9.18372 51.7931 4.56619 50.5818 2.49512 46.9946C0.42405 43.4074 1.68372 38.8028 5.30868 36.7099Z"
      fill="black"
      class="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
    <path
      d="M50.4657 36.7099C46.8408 34.617 36.0108 35.2203 32.4947 34.9946C34.292 38.1973 39.3408 47.6074 42.9657 49.7003C46.5907 51.7931 51.2082 50.5818 53.2793 46.9946C55.3504 43.4074 54.0907 38.8028 50.4657 36.7099Z"
      fill="black"
      class="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5"
    />
  </svg>);

//export const Logo = asset("/logo.svg");

export default Navbar;
