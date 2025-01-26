import { Y as decodeHtml, Z as logger, n as useNitroOrigin, _ as toBase64Image, X as withBase, a0 as createConsola, s as fetchIsland, a1 as htmlDecodeQuotes, q as useOgImageRuntimeConfig, L as defu, v as theme, a2 as sendError, t as normaliseFontInput, a3 as fontCache } from '../nitro/nitro.mjs';
import { a as applyEmojis, l as loadFont } from './eventHandlers.mjs';
import { html } from 'satori-html';
import sizeOf from 'image-size';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'vue';
import 'consola/core';
import 'node:url';
import 'ipx';
import '@unhead/ssr';
import 'unhead';

const cssInlineInstance = { instance: undefined };
const sharpInstance = { instance: undefined };
const resvgInstance = { instance: undefined };
const satoriInstance = { instance: undefined };
async function useResvg() {
  resvgInstance.instance = resvgInstance.instance || await import('./node.mjs').then((m) => m.default);
  await resvgInstance.instance.initWasmPromise;
  return resvgInstance.instance.Resvg;
}
async function useSatori() {
  satoriInstance.instance = satoriInstance.instance || await import('./node2.mjs').then((m) => m.default);
  await satoriInstance.instance.initWasmPromise;
  return satoriInstance.instance.satori;
}
async function useSharp() {
  sharpInstance.instance = sharpInstance.instance || await import('../nitro/nitro.mjs').then(function (n) { return n.a8; }).then((m) => m.default);
  return sharpInstance.instance;
}
async function useCssInline() {
  cssInlineInstance.instance = cssInlineInstance.instance || await import('../nitro/nitro.mjs').then(function (n) { return n.a8; }).then((m) => m.default);
  await cssInlineInstance.instance.initWasmPromise;
  return cssInlineInstance.instance.cssInline;
}

function walkSatoriTree(e, node, plugins) {
  const promises = [];
  if (!node.props?.children || !Array.isArray(node.props.children))
    return promises;
  if (node.props.children.length === 0) {
    delete node.props.children;
    return promises;
  }
  for (const child of node.props.children || []) {
    if (child) {
      for (const plugin of plugins.flat()) {
        if (plugin.filter(child))
          promises.push(plugin.transform(child, e));
      }
      promises.push(
        ...walkSatoriTree(e, child, plugins)
      );
    }
  }
  return promises;
}
function defineSatoriTransformer(transformer) {
  return transformer;
}

const classes = defineSatoriTransformer([
  {
    filter: (node) => !!node.props?.class && !node.props?.tw,
    transform(node) {
      node.props.tw = node.props.class;
      node.props.tw = node.props.tw.replace(/icon|inline-style/g, "");
    }
  },
  {
    filter: (node) => !!node.props?.style?.display,
    transform(node) {
      if (["inline-block", "inline"].includes(node.props.style.display))
        delete node.props.style.display;
    }
  }
]);

function isEmojiFilter(node) {
  return node.type === "svg" && typeof node.props?.["data-emoji"] !== "undefined";
}
const emojis = defineSatoriTransformer([
  // need to make sure parent div has flex for the emoji to render inline
  {
    filter: (node) => ["div", "p"].includes(node.type) && Array.isArray(node.props?.children) && node.props.children.some(isEmojiFilter),
    transform: (node) => {
      node.props.style = node.props.style || {};
      node.props.style.display = "flex";
      node.props.style.alignItems = "center";
      node.props.children = node.props.children.map((child) => {
        if (typeof child === "string") {
          return {
            type: "div",
            props: {
              children: child
            }
          };
        }
        if (child.props.class?.includes("emoji"))
          delete child.props.class;
        return child;
      });
    }
  }
]);

const encoding = defineSatoriTransformer([
  // clean up
  {
    filter: (node) => node.props?.["data-v-inspector"],
    transform: (node) => {
      delete node.props["data-v-inspector"];
    }
  },
  {
    filter: (node) => typeof node.props?.children === "string",
    transform: (node) => {
      node.props.children = decodeHtml(node.props.children);
    }
  }
]);

const BLOCK_ELEMENTS = [
  "div",
  "p",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "hr",
  "table",
  "dl"
];
const INLINE_ELEMENTS = [
  "span",
  "a",
  "b",
  "i",
  "u",
  "em",
  "strong",
  "code",
  "abbr",
  "del",
  "ins",
  "mark",
  "sub",
  "sup",
  "small",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5"
];
const flex = defineSatoriTransformer({
  filter: (node) => [...INLINE_ELEMENTS, "div"].includes(node.type) && (Array.isArray(node.props?.children) && node.props?.children.length >= 1) && !node.props?.class?.includes("hidden"),
  transform: (node) => {
    node.props.style = node.props.style || {};
    if (node.props.style?.display && node.props.style?.display !== "flex") {
      return;
    }
    if (node.type === "div") {
      node.props.style.display = "flex";
      if (!node.props?.class?.includes("flex-") && node.props.children.some((child) => BLOCK_ELEMENTS.includes(child.type))) {
        node.props.style.flexDirection = "column";
        return;
      }
    }
    let flexWrap = node.props?.class?.includes("flex-wrap");
    if (!node.props?.class?.includes("flex-")) {
      node.props.style.flexWrap = "wrap";
      flexWrap = true;
    }
    if (flexWrap && !node.props?.class?.includes("gap")) {
      node.props.style.gap = "0.2em";
    }
  }
});

const imageSrc = defineSatoriTransformer([
  // fix <img src="">
  {
    filter: (node) => node.type === "img" && node.props?.src,
    transform: async (node, { e, publicStoragePath, runtimeConfig }) => {
      const src = node.props.src;
      const isRelative = src.startsWith("/");
      let dimensions;
      let imageBuffer;
      if (src.endsWith(".webp")) {
        logger.warn("Using WebP images with Satori is not supported. Please consider switching image format or use the chromium renderer.", src);
      }
      if (isRelative) {
        if (!imageBuffer) {
          imageBuffer = await e.$fetch(src, { responseType: "arrayBuffer" }).catch(() => {
          });
          if (!imageBuffer && true) {
            imageBuffer = await e.$fetch(src, {
              baseURL: useNitroOrigin(e),
              responseType: "arrayBuffer"
            }).catch(() => {
            });
          }
        }
        if (imageBuffer)
          node.props.src = toBase64Image(imageBuffer);
      } else if (!src.startsWith("data:")) {
        imageBuffer = await $fetch(src, {
          responseType: "arrayBuffer"
        }).catch(() => {
        });
      }
      if (imageBuffer && (!node.props.width || !node.props.height)) {
        try {
          const imageSize = sizeOf(imageBuffer);
          dimensions = { width: imageSize.width, height: imageSize.height };
        } catch {
        }
        if (dimensions?.width && dimensions?.height) {
          const naturalAspectRatio = dimensions.width / dimensions.height;
          if (node.props.width && !node.props.height) {
            node.props.height = Math.round(node.props.width / naturalAspectRatio);
          } else if (node.props.height && !node.props.width) {
            node.props.width = Math.round(node.props.height * naturalAspectRatio);
          } else if (!node.props.width && !node.props.height) {
            node.props.width = dimensions.width;
            node.props.height = dimensions.height;
          }
        }
      }
      if (typeof node.props.src === "string" && node.props.src.startsWith("/")) {
        if (imageBuffer) {
          node.props.src = toBase64Image(imageBuffer);
        } else {
          node.props.src = `${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()}`;
        }
      }
    }
  },
  // fix style="background-image: url('')"
  {
    filter: (node) => node.props?.style?.backgroundImage?.includes("url("),
    transform: async (node, { e, publicStoragePath, runtimeConfig }) => {
      const backgroundImage = node.props.style.backgroundImage;
      const src = backgroundImage.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
      const isRelative = src?.startsWith("/");
      if (isRelative) {
        {
          node.props.style.backgroundImage = `url(${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()})`;
        }
      }
    }
  }
]);

const unocss = defineSatoriTransformer({
  filter: (node) => !!node.props?.class,
  transform: async (node, ctx) => {
    const classes = node.props.class || "";
    const styles = node.props.style || {};
    const replacedClasses = /* @__PURE__ */ new Set();
    for (const token of classes.split(" ").filter((c) => c.trim())) {
      const parsedToken = await ctx.unocss.parseToken(token);
      if (parsedToken) {
        const inlineStyles = parsedToken[0][2].split(";").filter((s) => !!s?.trim());
        const vars = {
          "--color-gray-50": "249 250 251",
          "--color-gray-100": "243 244 246",
          "--color-gray-200": "229 231 235",
          "--color-gray-300": "209 213 219",
          "--color-gray-400": "156 163 175",
          "--color-gray-500": "107 114 128",
          "--color-gray-600": "75 85 99",
          "--color-gray-700": "55 65 81",
          "--color-gray-800": "31 41 55",
          "--color-gray-900": "17 24 39",
          "--color-gray-950": "3 7 18"
        };
        inlineStyles.filter((s) => s.startsWith("--")).forEach((s) => {
          const [key, value] = s.split(":");
          vars[key] = value;
        });
        inlineStyles.filter((s) => !s.startsWith("--")).forEach((s) => {
          const [key, value] = s.split(":");
          const camelCasedKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          if (!styles[camelCasedKey])
            styles[camelCasedKey] = value.replace(/var\((.*?)\)/g, (_, k) => vars[k.trim()]);
          if (styles[camelCasedKey] && styles[camelCasedKey].includes("/")) {
            const [rgb, opacity] = styles[camelCasedKey].split("/");
            if (opacity.trim() === "1)")
              styles[camelCasedKey] = rgb.replace(/(\d+) (\d+) (\d+).*/, (_, r, g, b) => `${r}, ${g}, ${b})`);
            else
              styles[camelCasedKey] = `${rgb.replace("rgb", "rgba").replaceAll(" ", ", ")}${opacity.trim()}`;
          }
        });
        replacedClasses.add(token);
      }
    }
    node.props.class = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.tw = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.style = styles;
  }
});

async function applyInlineCss(ctx, island) {
  let html = island.html;
  let css = island.head.style.map((s) => s.innerHTML).filter(Boolean).join("\n");
  const componentInlineStyles = island.head.link.filter((l) => l.href.startsWith("/_nuxt/components") && l.href.replaceAll("/", "").includes(ctx.options.component));
  if (!componentInlineStyles.length) {
    return false;
  }
  if (!css.trim().length)
    return false;
  const cssInline = await useCssInline();
  if (!cssInline || cssInline?.__unenv__) {
    if (componentInlineStyles.length) {
      const logger = createConsola().withTag("Nuxt OG Image");
      logger.warn("To have inline styles applied you need to install either the `@css-inline/css-inline` or `@css-inline/css-inline-wasm` package.");
    }
    return false;
  }
  html = cssInline.inline(island.html, {
    loadRemoteStylesheets: false,
    extraCss: css
  });
  const classes = css.match(/\.([\w-]+)/g)?.map((c) => c.replace(".", ""));
  if (classes)
    html = html.replace(new RegExp(`class="(${classes.join("|")})"`, "g"), "");
  island.html = html;
  return true;
}

async function createVNodes(ctx) {
  let html$1 = ctx.options.html;
  if (!html$1) {
    const island = await fetchIsland(ctx.e, ctx.options.component, typeof ctx.options.props !== "undefined" ? ctx.options.props : ctx.options);
    island.html = htmlDecodeQuotes(island.html);
    await applyInlineCss(ctx, island);
    await applyEmojis(ctx, island);
    html$1 = island.html;
    if (html$1?.includes("<body>")) {
      html$1 = html$1.match(/<body>([\s\S]*)<\/body>/)?.[1] || "";
    }
  }
  const template = `<div style="position: relative; display: flex; margin: 0 auto; width: ${ctx.options.width}px; height: ${ctx.options.height}px; overflow: hidden;">${html$1}</div>`;
  const satoriTree = html(template);
  walkSatoriTree(ctx, satoriTree, [
    emojis,
    classes,
    flex,
    encoding
  ]);
  await Promise.all(walkSatoriTree(ctx, satoriTree, [
    unocss,
    imageSrc
  ]));
  return satoriTree;
}

const fontPromises = {};
async function resolveFonts(event) {
  const { fonts } = useOgImageRuntimeConfig();
  const normalisedFonts = normaliseFontInput([...event.options.fonts || [], ...fonts]);
  const localFontPromises = [];
  const preloadedFonts = [];
  {
    for (const font of normalisedFonts) {
      if (await fontCache.hasItem(font.cacheKey)) {
        font.data = await fontCache.getItemRaw(font.cacheKey);
        preloadedFonts.push(font);
      } else {
        if (!fontPromises[font.cacheKey]) {
          fontPromises[font.cacheKey] = loadFont(event, font).then(async (_font) => {
            if (_font?.data)
              await fontCache?.setItemRaw(_font.cacheKey, _font.data);
            return _font;
          });
        }
        localFontPromises.push(fontPromises[font.cacheKey]);
      }
    }
  }
  const awaitedFonts = await Promise.all(localFontPromises);
  return [...preloadedFonts, ...awaitedFonts].map((_f) => {
    return { name: _f.name, data: _f.data, style: _f.style, weight: Number(_f.weight) };
  });
}
async function createSvg(event) {
  const { options } = event;
  const { satoriOptions: _satoriOptions } = useOgImageRuntimeConfig();
  const [satori, vnodes, fonts] = await Promise.all([
    useSatori(),
    createVNodes(event),
    resolveFonts(event)
  ]);
  await event._nitro.hooks.callHook("nuxt-og-image:satori:vnodes", vnodes, event);
  const satoriOptions = defu(options.satori, _satoriOptions, {
    fonts,
    tailwindConfig: { theme },
    embedFont: true,
    width: options.width,
    height: options.height
  });
  return satori(vnodes, satoriOptions).catch((err) => {
    return sendError(event.e, err, false);
  });
}
async function createPng(event) {
  const { resvgOptions } = useOgImageRuntimeConfig();
  const svg = await createSvg(event);
  const Resvg = await useResvg();
  const resvg = new Resvg(svg, defu(
    event.options.resvg,
    resvgOptions
  ));
  const pngData = resvg.render();
  return pngData.asPng();
}
async function createJpeg(event) {
  const { sharpOptions } = useOgImageRuntimeConfig();
  const png = await createPng(event);
  const sharp = await useSharp();
  return sharp(png, defu(event.options.sharp, sharpOptions)).jpeg().toBuffer();
}
const SatoriRenderer = {
  name: "satori",
  supportedFormats: ["png", "jpeg", "jpg", "json"],
  async createImage(e) {
    switch (e.extension) {
      case "png":
        return createPng(e);
      case "jpeg":
      case "jpg":
        return createJpeg(e);
    }
  },
  async debug(e) {
    const [vnodes, svg] = await Promise.all([
      createVNodes(e),
      createSvg(e)
    ]);
    return {
      vnodes,
      svg
    };
  }
};

export { createSvg, SatoriRenderer as default };
//# sourceMappingURL=renderer.mjs.map
