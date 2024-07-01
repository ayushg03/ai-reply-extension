/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      width: {
        'modal-width': '35vw',
        'icon': '32px'
      },
      height: {
        '500': '500px',
        'icon': '32px'
      },
      padding: {
        '26': '26px'
      },
      boxShadow: {
        'custom-inset': '0px 0px 0px 1px #C1C7D0 inset',
      },
    },
  },
  mode: "jit",
  content: ["./**/*.{ts,tsx}"],
  plugins: []
}