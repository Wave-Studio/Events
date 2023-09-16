/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{routes,islands,components}/**/*.tsx"],
  theme: {
    extend: {
			colors: {
				theme: {
					normal: "#DC6843"
				}
			}
		},
  },
  plugins: [],
}