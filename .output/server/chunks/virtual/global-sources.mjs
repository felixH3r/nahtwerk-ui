const sources = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/about-me"
            },
            {
                "loc": "/danke"
            },
            {
                "loc": "/datenschutz"
            },
            {
                "loc": "/impressum"
            },
            {
                "loc": "/"
            },
            {
                "loc": "/shop"
            },
            {
                "loc": "/warenkorb"
            }
        ],
        "sourceType": "app"
    },
    {
        "context": {
            "name": "nuxt:prerender",
            "description": "Generated at build time when prerendering.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:prerender'] }`."
            ]
        },
        "urls": [
            "/",
            {
                "loc": "/"
            },
            {
                "loc": "/about-me"
            },
            {
                "loc": "/shop"
            },
            {
                "loc": "/impressum"
            },
            {
                "loc": "/datenschutz"
            },
            {
                "loc": "/danke"
            },
            {
                "loc": "/warenkorb"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
