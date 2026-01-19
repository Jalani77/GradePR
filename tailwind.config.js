export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        muted: "#545454",
        border: "#EEEEEE",
        uberBlue: "#276EF1",
        uberGreen: "#05A357",
        alertRed: "#E11900",
      },
      borderRadius: {
        base: "4px",
      },
      fontFamily: {
        sans: ["Inter", "System UI", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
