/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the app folder
        "./components/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the components folder]
        "./screens/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(20, 20, 30)", // Primary
                secondary: "rgb(255, 155, 0)", // Secondary
                black: {
                    DEFAULT: "rgb(0, 0, 0)", // black
                    1: "rgb(30, 30, 45)", // black1
                    2: "rgb(40, 40, 55)", // black2
                    3: "rgb(45, 45, 60)", // black3
                },
                grey: {
                    DEFAULT: "rgb(205, 205, 225)", // grey
                    1: "rgb(160, 160, 175)", // grey1
                    2: "rgb(106, 105, 115)", // grey2
                    3: "rgb(60, 60, 65)", // grey3
                    4: "rgb(48, 48, 50)", // grey4
                },
                white: {
                    DEFAULT: "rgb(255, 255, 255)", // white
                    1: "rgb(235, 235, 255)", // white1
                },
                green: "rgb(0, 160, 80)", // Green
                red: "rgb(255, 75, 75)", // Red
                blue: {
                    DEFAULT: "rgb(0, 205, 255)", // Blue
                    1: "rgb(0, 100, 125)", // Blue1
                },
                yellow: "rgb(255, 215, 0)", // Yellow
                orange: "rgb(225, 105, 10)", // Orange
                pink: "rgb(250, 95, 255)", // Pink
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"], // Poppins font
            },
        },
    },
    plugins: [],
};
