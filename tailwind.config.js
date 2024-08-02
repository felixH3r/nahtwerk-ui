module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./node_modules/flowbite/**/*.js",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    "50": "#fafaf9",
                    "100": "#f5f5f4",
                    "200": "#e7e5e4",
                    "300": "#d6d3d1",
                    "400": "#a8a29e",
                    "500": "#78716c",
                    "600": "#57534e",
                    "700": "#44403c",
                    "800": "#292524",
                    "900": "#1c1917",
                    "950": "#0c0a09"
                }
            }
        },
        fontFamily: {
            'body': [
                'Nunito Sans',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans': [
                'Nunito Sans',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        }
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
