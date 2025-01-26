import { version, inject, ref, watchEffect, watch, getCurrentInstance, h as h$1, toRaw, isRef, isReactive, toRef, defineAsyncComponent, defineComponent, computed, unref, Suspense, nextTick, mergeProps, Transition, provide, useSSRContext, hasInjectionContext, createApp, effectScope, shallowReactive, reactive, getCurrentScope, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, shallowRef, isReadonly, onScopeDispose, isShallow, markRaw, toRefs, toValue } from 'vue';
import { $ as $fetch, E as baseURL, F as hasProtocol, G as isScriptProtocol, I as joinURL, J as withQuery, c as createError$1, K as defu$1, L as sanitizeStatusCode, M as getContext, N as createHooks, O as withoutTrailingSlash, P as titleCase, Q as toRouteMatcher, R as createRouter$1, S as camelCase, z as parseURL, T as withoutBase, U as stringifyQuery, V as withLeadingSlash, W as withBase, w as withTrailingSlash, X as hasTrailingSlash, y as hash } from '../nitro/nitro.mjs';
import { getActiveHead, CapoPlugin } from 'unhead';
import { defineHeadPlugin as defineHeadPlugin$1, composableNames, unpackMeta } from '@unhead/shared';
import { useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { InferSeoMetaPlugin } from '@unhead/addons';
import { parse, stringify } from 'devalue';
import Qs from 'axios';
import * as h from 'retry-axios';
import c from 'qs';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import crypto from 'crypto';
import 'lru-cache';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import 'ipx';

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink", "prefetch": true, "prefetchOn": { "visibility": true } };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: undefined,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.15.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? undefined : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? undefined : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? undefined : _a.islandContext) && ((_b = plugin2.env) == null ? undefined : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? undefined : _c.islandContext) && ((_d = plugin2.env) == null ? undefined : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i2 = 0; i2 < promiseDepth; i2++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? undefined : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? undefined : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? undefined : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? undefined : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? undefined : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : undefined);
        return to;
      }
      return redirect(!inMiddleware ? undefined : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? undefined : options.replace) {
      (undefined).replace(toPath);
    } else {
      (undefined).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? undefined : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version[0] === "3";
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2) {
  if (ref2 instanceof Promise || ref2 instanceof Date || ref2 instanceof RegExp)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k2 in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k2)) {
        continue;
      }
      if (k2 === "titleTemplate" || k2[0] === "o" && k2[1] === "n") {
        resolved[k2] = unref(root[k2]);
        continue;
      }
      resolved[k2] = resolveUnrefHeadInput(root[k2]);
    }
    return resolved;
  }
  return root;
}
defineHeadPlugin$1({
  hooks: {
    "entries:resolve": (ctx) => {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
function useSeoMeta(input, options) {
  const { title, titleTemplate, ...meta } = input;
  return useHead({
    title,
    titleTemplate,
    // @ts-expect-error runtime type
    _flatMeta: meta
  }, {
    ...options,
    transform(t) {
      const meta2 = unpackMeta({ ...t._flatMeta });
      delete t._flatMeta;
      return {
        // @ts-expect-error runtime type
        ...t,
        meta: meta2
      };
    }
  });
}
function useServerHead(input, options = {}) {
  const head = options.head || injectHead();
  delete options.head;
  if (head)
    return head.push(input, { ...options, mode: "server" });
}
[CapoPlugin({ track: true })];
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => useNuxtApp().vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== undefined) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === undefined) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = undefined;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = undefined;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : undefined;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
const interpolatePath = (route, match) => {
  return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? undefined : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m2) => {
    var _a;
    return ((_a = m2.components) == null ? undefined : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? undefined : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu$1({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function handleHotUpdate(_router, _generateRoutes) {
}
const _routes = [
  {
    name: "about-me",
    path: "/about-me",
    component: () => import('./about-me-Dhy5SLeA.mjs')
  },
  {
    name: "danke",
    path: "/danke",
    component: () => import('./danke-CqDhWTfT.mjs')
  },
  {
    name: "datenschutz",
    path: "/datenschutz",
    component: () => import('./datenschutz-DnAAGybR.mjs')
  },
  {
    name: "impressum",
    path: "/impressum",
    component: () => import('./impressum-DIo2Pk-G.mjs')
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-BbPh86kK.mjs')
  },
  {
    name: "products-productTitle",
    path: "/products/:productTitle()",
    component: () => import('./_productTitle_-Gq95wN0Y.mjs')
  },
  {
    name: "shop",
    path: "/shop",
    component: () => import('./shop-DOsHuUzE.mjs')
  },
  {
    name: "warenkorb",
    path: "/warenkorb",
    component: () => import('./warenkorb-on_XpI3_.mjs')
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h$1(component, props, slots) : (_a = slots.default) == null ? undefined : _a.call(slots);
  } };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? undefined : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? undefined : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? undefined : _a.components) == null ? undefined : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? undefined : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || undefined;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? undefined : _a.validate)) {
    return;
  }
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  const unsub = router.beforeResolve((final) => {
    unsub();
    if (final === to) {
      const unsub2 = router.afterEach(async () => {
        unsub2();
        await nuxtApp.runWithContext(() => showError(error));
      });
      return false;
    }
  });
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? undefined : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes2 = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (undefined).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (undefined).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes: routes2
    });
    handleHotUpdate(router, routerOptions.routes ? routerOptions.routes : (routes22) => routes22);
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? undefined : _a2.components) == null ? undefined : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? undefined : _c2.components) == null ? undefined : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? undefined : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? undefined : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? undefined : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? undefined : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? undefined : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : undefined;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== undefined && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === undefined && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? undefined : _a.event;
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const _0_siteConfig_jtc2qNDx4l = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a;
    const state = useState("site-config");
    {
      const context = (_a = useRequestEvent()) == null ? undefined : _a.context;
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = context == null ? undefined : context.siteConfig.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    let stack = {};
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
{
  reducers.push(["Island", (data) => data && (data == null ? undefined : data.__nuxt_island)]);
}
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
/*!
 * pinia v2.2.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject$1(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (true)) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (true)) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  {
    store = toRaw(store);
    const refs = {};
    for (const key in store) {
      const value = store[key];
      if (isRef(value) || isReactive(value)) {
        refs[key] = // ---
        toRef(store, key);
      }
    }
    return refs;
  }
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = pinia.state.value;
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
function useSiteConfig(options) {
  let stack;
  stack = useRequestEvent().context.siteConfig.get(defu$1({ resolveRefs: true }, options));
  return stack || {};
}
const siteConfig_JRId4KOeUL = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  const siteConfig = useSiteConfig();
  const input = {
    meta: [],
    templateParams: {
      site: siteConfig,
      // support legacy
      siteUrl: siteConfig.url,
      siteName: siteConfig.name
    }
  };
  if (siteConfig.separator)
    input.templateParams.separator = siteConfig.separator;
  if (siteConfig.titleSeparator)
    input.templateParams.titleSeparator = siteConfig.titleSeparator;
  if (siteConfig.description) {
    input.templateParams.siteDescription = siteConfig.description;
    input.meta.push(
      {
        name: "description",
        content: "%site.description"
      }
    );
  }
  head.push(input, { tagPriority: 150 });
});
const inferSeoMetaPlugin_JSh5nGhzCz = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  head.use(InferSeoMetaPlugin());
});
const titles_eoILE7jqvj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:fallback-titles",
  env: {
    islands: false
  },
  setup() {
    const route = useRoute();
    const title = computed(() => {
      var _a, _b;
      if (typeof ((_a = route.meta) == null ? undefined : _a.title) === "string")
        return (_b = route.meta) == null ? undefined : _b.title;
      const path = withoutTrailingSlash(route.path || "/");
      const lastSegment = path.split("/").pop();
      return lastSegment ? titleCase(lastSegment) : null;
    });
    const minimalPriority = {
      // give nuxt.config values higher priority
      tagPriority: 101
    };
    useHead({ title: () => title.value }, minimalPriority);
  }
});
function useSchemaOrgConfig() {
  const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
  return defu$1(runtimeConfig["nuxt-schema-org"], {
    scriptAttributes: {}
  });
}
function useSchemaOrg(input) {
  var _a;
  const config = useSchemaOrgConfig();
  const script = {
    type: "application/ld+json",
    key: "schema-org-graph",
    nodes: input,
    tagPriority: "high",
    ...config.scriptAttributes
  };
  {
    const event = useRequestEvent();
    if (typeof (event == null ? undefined : event.context.robots) !== "undefined" && !((_a = event.context.robots) == null ? undefined : _a.indexable)) {
      return;
    }
    return useServerHead({
      script: [script]
    });
  }
}
function defineSchemaOrgResolver(schema) {
  return schema;
}
function idReference(node) {
  return {
    "@id": typeof node !== "string" ? node["@id"] : node
  };
}
function resolvableDateToDate(val) {
  try {
    const date = val instanceof Date ? val : new Date(Date.parse(val));
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  } catch (e) {
  }
  return typeof val === "string" ? val : val.toString();
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function resolvableDateToIso(val) {
  if (!val)
    return val;
  try {
    if (val instanceof Date)
      return val.toISOString();
    else if (isValidW3CDate(val))
      return val;
    else
      return new Date(Date.parse(val)).toISOString();
  } catch (e) {
  }
  return typeof val === "string" ? val : val.toString();
}
const IdentityId = "#identity";
function setIfEmpty(node, field, value) {
  if (!(node == null ? undefined : node[field]) && value)
    node[field] = value;
}
function asArray(input) {
  return Array.isArray(input) ? input : [input];
}
function dedupeMerge(node, field, value) {
  const data = new Set(asArray(node[field]));
  data.add(value);
  node[field] = [...data].filter(Boolean);
}
function prefixId(url, id) {
  if (hasProtocol(id))
    return id;
  if (!id.includes("#"))
    id = `#${id}`;
  return withBase(id, url);
}
function trimLength(val, length) {
  if (!val)
    return val;
  if (val.length > length) {
    const trimmedString = val.substring(0, length);
    return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  }
  return val;
}
function resolveDefaultType(node, defaultType) {
  const val = node["@type"];
  if (val === defaultType)
    return;
  const types = /* @__PURE__ */ new Set([
    ...asArray(defaultType),
    ...asArray(val)
  ]);
  node["@type"] = types.size === 1 ? val : [...types.values()];
}
function resolveWithBase(base, urlOrPath) {
  if (!urlOrPath || hasProtocol(urlOrPath) || urlOrPath[0] !== "/" && urlOrPath[0] !== "#")
    return urlOrPath;
  return withBase(urlOrPath, base);
}
function resolveAsGraphKey(key) {
  if (!key)
    return key;
  return key.substring(key.lastIndexOf("#"));
}
function stripEmptyProperties(obj) {
  for (const k2 in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k2)) {
      continue;
    }
    if (obj[k2] && typeof obj[k2] === "object") {
      if (obj[k2].__v_isReadonly || obj[k2].__v_isRef)
        return;
      stripEmptyProperties(obj[k2]);
      return;
    }
    if (obj[k2] === "" || obj[k2] === null || obj[k2] === undefined)
      delete obj[k2];
  }
  return obj;
}
const quantitativeValueResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number") {
      return {
        value: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "QuantitativeValue"
  }
});
const monetaryAmountResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MonetaryAmount"
  },
  resolve(node, ctx) {
    if (typeof node.value !== "number")
      node.value = resolveRelation(node.value, ctx, quantitativeValueResolver);
    return node;
  }
});
const merchantReturnPolicyResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MerchantReturnPolicy"
  },
  resolve(node, ctx) {
    if (node.returnPolicyCategory)
      node.returnPolicyCategory = withBase(node.returnPolicyCategory, "https://schema.org/");
    if (node.returnFees)
      node.returnFees = withBase(node.returnFees, "https://schema.org/");
    if (node.returnMethod)
      node.returnMethod = withBase(node.returnMethod, "https://schema.org/");
    node.returnShippingFeesAmount = resolveRelation(node.returnShippingFeesAmount, ctx, monetaryAmountResolver);
    return node;
  }
});
const definedRegionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "DefinedRegion"
  }
});
const shippingDeliveryTimeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ShippingDeliveryTime"
  },
  resolve(node, ctx) {
    node.handlingTime = resolveRelation(node.handlingTime, ctx, quantitativeValueResolver);
    node.transitTime = resolveRelation(node.transitTime, ctx, quantitativeValueResolver);
    return node;
  }
});
const offerShippingDetailsResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "OfferShippingDetails"
  },
  resolve(node, ctx) {
    node.deliveryTime = resolveRelation(node.deliveryTime, ctx, shippingDeliveryTimeResolver);
    node.shippingDestination = resolveRelation(node.shippingDestination, ctx, definedRegionResolver);
    node.shippingRate = resolveRelation(node.shippingRate, ctx, monetaryAmountResolver);
    return node;
  }
});
const offerResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number" || typeof node === "string") {
      return {
        price: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Offer",
    "availability": "InStock"
  },
  resolve(node, ctx) {
    setIfEmpty(node, "priceCurrency", ctx.meta.currency);
    setIfEmpty(node, "priceValidUntil", new Date(Date.UTC((/* @__PURE__ */ new Date()).getFullYear() + 1, 12, -1, 0, 0, 0)));
    if (node.url)
      resolveWithBase(ctx.meta.host, node.url);
    if (node.availability)
      node.availability = withBase(node.availability, "https://schema.org/");
    if (node.itemCondition)
      node.itemCondition = withBase(node.itemCondition, "https://schema.org/");
    if (node.priceValidUntil)
      node.priceValidUntil = resolvableDateToIso(node.priceValidUntil);
    node.hasMerchantReturnPolicy = resolveRelation(node.hasMerchantReturnPolicy, ctx, merchantReturnPolicyResolver);
    node.shippingDetails = resolveRelation(node.shippingDetails, ctx, offerShippingDetailsResolver);
    return node;
  }
});
const aggregateOfferResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "AggregateOffer"
  },
  inheritMeta: [
    { meta: "currency", key: "priceCurrency" }
  ],
  resolve(node, ctx) {
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    if (node.offers)
      setIfEmpty(node, "offerCount", asArray(node.offers).length);
    return node;
  }
});
const aggregateRatingResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "AggregateRating"
  }
});
const listItemResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      node = {
        name: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "ListItem"
  },
  resolve(node, ctx) {
    if (typeof node.item === "string")
      node.item = resolveWithBase(ctx.meta.host, node.item);
    else if (typeof node.item === "object")
      node.item = resolveRelation(node.item, ctx);
    return node;
  }
});
const PrimaryBreadcrumbId = "#breadcrumb";
const breadcrumbResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "BreadcrumbList"
  },
  idPrefix: ["url", PrimaryBreadcrumbId],
  resolve(breadcrumb, ctx) {
    if (breadcrumb.itemListElement) {
      let index = 1;
      breadcrumb.itemListElement = resolveRelation(breadcrumb.itemListElement, ctx, listItemResolver, {
        array: true,
        afterResolve(node) {
          setIfEmpty(node, "position", index++);
        }
      });
    }
    return breadcrumb;
  },
  resolveRootNode(node, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage)
      setIfEmpty(webPage, "breadcrumb", idReference(node));
  }
});
const imageResolver = defineSchemaOrgResolver({
  alias: "image",
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  defaults: {
    "@type": "ImageObject"
  },
  inheritMeta: [
    // @todo possibly only do if there's a caption
    "inLanguage"
  ],
  idPrefix: "host",
  resolve(image, { meta }) {
    image.url = resolveWithBase(meta.host, image.url);
    setIfEmpty(image, "contentUrl", image.url);
    if (image.height && !image.width)
      delete image.height;
    if (image.width && !image.height)
      delete image.width;
    return image;
  }
});
const addressResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "PostalAddress"
  }
});
const searchActionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint"
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      "valueRequired": true,
      "valueName": "search_term_string"
    }
  },
  resolve(node, ctx) {
    if (typeof node.target === "string") {
      node.target = {
        "@type": "EntryPoint",
        "urlTemplate": resolveWithBase(ctx.meta.host, node.target)
      };
    }
    return node;
  }
});
const PrimaryWebSiteId = "#website";
const webSiteResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "WebSite"
  },
  inheritMeta: [
    "inLanguage",
    { meta: "host", key: "url" }
  ],
  idPrefix: ["host", PrimaryWebSiteId],
  resolve(node, ctx) {
    node.potentialAction = resolveRelation(node.potentialAction, ctx, searchActionResolver, {
      array: true
    });
    node.publisher = resolveRelation(node.publisher, ctx);
    return node;
  },
  resolveRootNode(node, { find }) {
    if (resolveAsGraphKey(node["@id"]) === PrimaryWebSiteId) {
      const identity = find(IdentityId);
      if (identity)
        setIfEmpty(node, "publisher", idReference(identity));
      const webPage = find(PrimaryWebPageId);
      if (webPage)
        setIfEmpty(webPage, "isPartOf", idReference(node));
    }
    return node;
  }
});
const organizationResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Organization"
  },
  idPrefix: ["host", IdentityId],
  inheritMeta: [
    { meta: "host", key: "url" }
  ],
  resolve(node, ctx) {
    resolveDefaultType(node, "Organization");
    node.address = resolveRelation(node.address, ctx, addressResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    const isIdentity = resolveAsGraphKey(node["@id"]) === IdentityId;
    const webPage = ctx.find(PrimaryWebPageId);
    if (node.logo && isIdentity) {
      if (!ctx.find("#organization")) {
        const logoNode = resolveRelation(node.logo, ctx, imageResolver, {
          root: true,
          afterResolve(logo) {
            logo["@id"] = prefixId(ctx.meta.host, "#logo");
            setIfEmpty(logo, "caption", node.name);
          }
        });
        if (webPage && logoNode)
          setIfEmpty(webPage, "primaryImageOfPage", idReference(logoNode));
        ctx.nodes.push({
          // we want to make a simple node that has the essentials, this will allow parent nodes to inject
          // as well without inserting invalid data (i.e LocalBusiness operatingHours)
          "@type": "Organization",
          "name": node.name,
          "url": node.url,
          "sameAs": node.sameAs,
          // 'image': idReference(logoNode),
          "address": node.address,
          // needs to be a URL
          "logo": resolveRelation(node.logo, ctx, imageResolver, { root: false }).url,
          "_priority": -1,
          "@id": prefixId(ctx.meta.host, "#organization")
          // avoid the id so nothing can link to it
        });
      }
      delete node.logo;
    }
    if (isIdentity && webPage)
      setIfEmpty(webPage, "about", idReference(node));
    const webSite = ctx.find(PrimaryWebSiteId);
    if (webSite)
      setIfEmpty(webSite, "publisher", idReference(node));
  }
});
const readActionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ReadAction"
  },
  resolve(node, ctx) {
    if (!node.target.includes(ctx.meta.url))
      node.target.unshift(ctx.meta.url);
    return node;
  }
});
const PrimaryWebPageId = "#webpage";
const webPageResolver = defineSchemaOrgResolver({
  defaults({ meta }) {
    const endPath = withoutTrailingSlash(meta.url.substring(meta.url.lastIndexOf("/") + 1));
    let type = "WebPage";
    switch (endPath) {
      case "about":
      case "about-us":
        type = "AboutPage";
        break;
      case "search":
        type = "SearchResultsPage";
        break;
      case "checkout":
        type = "CheckoutPage";
        break;
      case "contact":
      case "get-in-touch":
      case "contact-us":
        type = "ContactPage";
        break;
      case "faq":
        type = "FAQPage";
        break;
    }
    const defaults = {
      "@type": type
    };
    return defaults;
  },
  idPrefix: ["url", PrimaryWebPageId],
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "datePublished",
    "dateModified",
    "url"
  ],
  resolve(node, ctx) {
    node.dateModified = resolvableDateToIso(node.dateModified);
    node.datePublished = resolvableDateToIso(node.datePublished);
    resolveDefaultType(node, "WebPage");
    node.about = resolveRelation(node.about, ctx, organizationResolver);
    node.breadcrumb = resolveRelation(node.breadcrumb, ctx, breadcrumbResolver);
    node.author = resolveRelation(node.author, ctx, personResolver);
    node.primaryImageOfPage = resolveRelation(node.primaryImageOfPage, ctx, imageResolver);
    node.potentialAction = resolveRelation(node.potentialAction, ctx, readActionResolver);
    if (node["@type"] === "WebPage" && ctx.meta.url) {
      setIfEmpty(node, "potentialAction", [
        {
          "@type": "ReadAction",
          "target": [ctx.meta.url]
        }
      ]);
    }
    return node;
  },
  resolveRootNode(webPage, { find, meta }) {
    const identity = find(IdentityId);
    const webSite = find(PrimaryWebSiteId);
    const logo = find("#logo");
    if (identity && meta.url === meta.host)
      setIfEmpty(webPage, "about", idReference(identity));
    if (logo)
      setIfEmpty(webPage, "primaryImageOfPage", idReference(logo));
    if (webSite)
      setIfEmpty(webPage, "isPartOf", idReference(webSite));
    const breadcrumb = find(PrimaryBreadcrumbId);
    if (breadcrumb)
      setIfEmpty(webPage, "breadcrumb", idReference(breadcrumb));
    return webPage;
  }
});
const personResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        name: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Person"
  },
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    if (node.url)
      node.url = resolveWithBase(ctx.meta.host, node.url);
    return node;
  },
  resolveRootNode(node, { find, meta }) {
    if (resolveAsGraphKey(node["@id"]) === IdentityId) {
      setIfEmpty(node, "url", meta.host);
      const webPage = find(PrimaryWebPageId);
      if (webPage)
        setIfEmpty(webPage, "about", idReference(node));
      const webSite = find(PrimaryWebSiteId);
      if (webSite)
        setIfEmpty(webSite, "publisher", idReference(node));
    }
    const article = find(PrimaryArticleId);
    if (article)
      setIfEmpty(article, "author", idReference(node));
  }
});
const PrimaryArticleId = "#article";
const articleResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Article"
  },
  inheritMeta: [
    "inLanguage",
    "description",
    "image",
    "dateModified",
    "datePublished",
    { meta: "title", key: "headline" }
  ],
  idPrefix: ["url", PrimaryArticleId],
  resolve(node, ctx) {
    node.author = resolveRelation(node.author, ctx, personResolver, {
      root: true
    });
    node.publisher = resolveRelation(node.publisher, ctx);
    node.dateModified = resolvableDateToIso(node.dateModified);
    node.datePublished = resolvableDateToIso(node.datePublished);
    resolveDefaultType(node, "Article");
    node.headline = trimLength(node.headline, 110);
    return node;
  },
  resolveRootNode(node, { find, meta }) {
    var _a;
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (node.image && !node.thumbnailUrl) {
      const firstImage = asArray(node.image)[0];
      if (typeof firstImage === "string")
        setIfEmpty(node, "thumbnailUrl", resolveWithBase(meta.host, firstImage));
      else if (firstImage == null ? undefined : firstImage["@id"])
        setIfEmpty(node, "thumbnailUrl", (_a = find(firstImage["@id"])) == null ? undefined : _a.url);
    }
    if (identity) {
      setIfEmpty(node, "publisher", idReference(identity));
      setIfEmpty(node, "author", idReference(identity));
    }
    if (webPage) {
      setIfEmpty(node, "isPartOf", idReference(webPage));
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
      setIfEmpty(webPage, "potentialAction", [
        {
          "@type": "ReadAction",
          "target": [meta.url]
        }
      ]);
      setIfEmpty(webPage, "dateModified", node.dateModified);
      setIfEmpty(webPage, "datePublished", node.datePublished);
    }
    return node;
  }
});
const bookEditionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Book"
  },
  inheritMeta: [
    "inLanguage"
  ],
  resolve(node, ctx) {
    if (node.bookFormat)
      node.bookFormat = withBase(node.bookFormat, "https://schema.org/");
    if (node.datePublished)
      node.datePublished = resolvableDateToDate(node.datePublished);
    node.author = resolveRelation(node.author, ctx);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "provider", idReference(identity));
    return node;
  }
});
const PrimaryBookId = "#book";
const bookResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Book"
  },
  inheritMeta: [
    "description",
    "url",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryBookId],
  resolve(node, ctx) {
    node.workExample = resolveRelation(node.workExample, ctx, bookEditionResolver);
    node.author = resolveRelation(node.author, ctx);
    if (node.url)
      withBase(node.url, ctx.meta.host);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "author", idReference(identity));
    return node;
  }
});
const commentResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Comment"
  },
  idPrefix: "url",
  resolve(node, ctx) {
    node.author = resolveRelation(node.author, ctx, personResolver, {
      root: true
    });
    return node;
  },
  resolveRootNode(node, { find }) {
    const article = find(PrimaryArticleId);
    if (article)
      setIfEmpty(node, "about", idReference(article));
  }
});
const courseResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Course"
  },
  resolve(node, ctx) {
    node.provider = resolveRelation(node.provider, ctx, organizationResolver, {
      root: true
    });
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "provider", idReference(identity));
    return node;
  }
});
const placeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Place"
  },
  resolve(node, ctx) {
    if (typeof node.address !== "string")
      node.address = resolveRelation(node.address, ctx, addressResolver);
    return node;
  }
});
const virtualLocationResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        url: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "VirtualLocation"
  }
});
const PrimaryEventId = "#event";
const eventResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Event"
  },
  inheritMeta: [
    "inLanguage",
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryEventId],
  resolve(node, ctx) {
    var _a;
    if (node.location) {
      const isVirtual = node.location === "string" || ((_a = node.location) == null ? undefined : _a.url) !== "undefined";
      node.location = resolveRelation(node.location, ctx, isVirtual ? virtualLocationResolver : placeResolver);
    }
    node.performer = resolveRelation(node.performer, ctx, personResolver, {
      root: true
    });
    node.organizer = resolveRelation(node.organizer, ctx, organizationResolver, {
      root: true
    });
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    if (node.eventAttendanceMode)
      node.eventAttendanceMode = withBase(node.eventAttendanceMode, "https://schema.org/");
    if (node.eventStatus)
      node.eventStatus = withBase(node.eventStatus, "https://schema.org/");
    const isOnline = node.eventStatus === "https://schema.org/EventMovedOnline";
    const dates = ["startDate", "previousStartDate", "endDate"];
    dates.forEach((date) => {
      if (!isOnline) {
        if (node[date] instanceof Date && node[date].getHours() === 0 && node[date].getMinutes() === 0)
          node[date] = resolvableDateToDate(node[date]);
      } else {
        node[date] = resolvableDateToIso(node[date]);
      }
    });
    setIfEmpty(node, "endDate", node.startDate);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "organizer", idReference(identity));
  }
});
const openingHoursResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "OpeningHoursSpecification",
    "opens": "00:00",
    "closes": "23:59"
  }
});
const localBusinessResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": ["Organization", "LocalBusiness"]
  },
  inheritMeta: [
    { key: "url", meta: "host" },
    { key: "currenciesAccepted", meta: "currency" }
  ],
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    resolveDefaultType(node, ["Organization", "LocalBusiness"]);
    node.address = resolveRelation(node.address, ctx, addressResolver);
    node.openingHoursSpecification = resolveRelation(node.openingHoursSpecification, ctx, openingHoursResolver);
    node = resolveNode({ ...node }, ctx, organizationResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    organizationResolver.resolveRootNode(node, ctx);
    return node;
  }
});
const ratingResolver = defineSchemaOrgResolver({
  cast(node) {
    if (node === "number") {
      return {
        ratingValue: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Rating",
    "bestRating": 5,
    "worstRating": 1
  }
});
const foodEstablishmentResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": ["Organization", "LocalBusiness", "FoodEstablishment"]
  },
  inheritMeta: [
    { key: "url", meta: "host" },
    { key: "currenciesAccepted", meta: "currency" }
  ],
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    resolveDefaultType(node, ["Organization", "LocalBusiness", "FoodEstablishment"]);
    node.starRating = resolveRelation(node.starRating, ctx, ratingResolver);
    node = resolveNode(node, ctx, localBusinessResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    localBusinessResolver.resolveRootNode(node, ctx);
    return node;
  }
});
const howToStepDirectionResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "HowToDirection"
  }
});
const howToStepResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "HowToStep"
  },
  resolve(step, ctx) {
    if (step.url)
      step.url = resolveWithBase(ctx.meta.url, step.url);
    if (step.image) {
      step.image = resolveRelation(step.image, ctx, imageResolver, {
        root: true
      });
    }
    if (step.itemListElement)
      step.itemListElement = resolveRelation(step.itemListElement, ctx, howToStepDirectionResolver);
    return step;
  }
});
const HowToId = "#howto";
const howToResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "HowTo"
  },
  inheritMeta: [
    "description",
    "image",
    "inLanguage",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", HowToId],
  resolve(node, ctx) {
    node.step = resolveRelation(node.step, ctx, howToStepResolver);
    return node;
  },
  resolveRootNode(node, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage)
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
  }
});
const itemListResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ItemList"
  },
  resolve(node, ctx) {
    if (node.itemListElement) {
      let index = 1;
      node.itemListElement = resolveRelation(node.itemListElement, ctx, listItemResolver, {
        array: true,
        afterResolve(node2) {
          setIfEmpty(node2, "position", index++);
        }
      });
    }
    return node;
  }
});
const jobPostingResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "JobPosting"
  },
  idPrefix: ["url", "#job-posting"],
  resolve(node, ctx) {
    node.datePosted = resolvableDateToIso(node.datePosted);
    node.hiringOrganization = resolveRelation(node.hiringOrganization, ctx, organizationResolver);
    node.jobLocation = resolveRelation(node.jobLocation, ctx, placeResolver);
    node.baseSalary = resolveRelation(node.baseSalary, ctx, monetaryAmountResolver);
    node.validThrough = resolvableDateToIso(node.validThrough);
    return node;
  },
  resolveRootNode(jobPosting, { find }) {
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(jobPosting, "hiringOrganization", idReference(identity));
    if (webPage)
      setIfEmpty(jobPosting, "mainEntityOfPage", idReference(webPage));
    return jobPosting;
  }
});
const reviewResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Review"
  },
  inheritMeta: [
    "inLanguage"
  ],
  resolve(review, ctx) {
    review.reviewRating = resolveRelation(review.reviewRating, ctx, ratingResolver);
    review.author = resolveRelation(review.author, ctx, personResolver);
    return review;
  }
});
const videoResolver = defineSchemaOrgResolver({
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  alias: "video",
  defaults: {
    "@type": "VideoObject"
  },
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "image",
    "inLanguage",
    { meta: "datePublished", key: "uploadDate" }
  ],
  idPrefix: "host",
  resolve(video, ctx) {
    if (video.uploadDate)
      video.uploadDate = resolvableDateToIso(video.uploadDate);
    video.url = resolveWithBase(ctx.meta.host, video.url);
    if (video.caption && !video.description)
      video.description = video.caption;
    if (!video.description)
      video.description = "No description";
    if (video.thumbnailUrl && (typeof video.thumbnailUrl === "string" || Array.isArray(video.thumbnailUrl))) {
      const images = asArray(video.thumbnailUrl).map((image) => resolveWithBase(ctx.meta.host, image));
      video.thumbnailUrl = images.length > 1 ? images : images[0];
    }
    if (video.thumbnail)
      video.thumbnail = resolveRelation(video.thumbnailUrl, ctx, imageResolver);
    return video;
  },
  resolveRootNode(video, { find }) {
    var _a;
    if (video.image && !video.thumbnail) {
      const firstImage = asArray(video.image)[0];
      setIfEmpty(video, "thumbnail", (_a = find(firstImage["@id"])) == null ? undefined : _a.url);
    }
  }
});
const movieResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Movie"
  },
  resolve(node, ctx) {
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    node.director = resolveRelation(node.director, ctx, personResolver);
    node.actor = resolveRelation(node.actor, ctx, personResolver);
    node.trailer = resolveRelation(node.trailer, ctx, videoResolver);
    if (node.dateCreated)
      node.dateCreated = resolvableDateToDate(node.dateCreated);
    return node;
  }
});
const ProductId = "#product";
const productResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Product"
  },
  inheritMeta: [
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", ProductId],
  resolve(node, ctx) {
    setIfEmpty(node, "sku", hash(node.name));
    node.aggregateOffer = resolveRelation(node.aggregateOffer, ctx, aggregateOfferResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  },
  resolveRootNode(product, { find }) {
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(product, "brand", idReference(identity));
    if (webPage)
      setIfEmpty(product, "mainEntityOfPage", idReference(webPage));
    return product;
  }
});
const answerResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Answer"
  }
});
const questionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Question"
  },
  inheritMeta: [
    "inLanguage"
  ],
  idPrefix: "url",
  resolve(question, ctx) {
    if (question.question) {
      question.name = question.question;
      delete question.question;
    }
    if (question.answer) {
      question.acceptedAnswer = question.answer;
      delete question.answer;
    }
    question.acceptedAnswer = resolveRelation(question.acceptedAnswer, ctx, answerResolver);
    return question;
  },
  resolveRootNode(question, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage && asArray(webPage["@type"]).includes("FAQPage"))
      dedupeMerge(webPage, "mainEntity", idReference(question));
  }
});
const RecipeId = "#recipe";
const recipeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Recipe"
  },
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "image",
    "datePublished"
  ],
  idPrefix: ["url", RecipeId],
  resolve(node, ctx) {
    node.recipeInstructions = resolveRelation(node.recipeInstructions, ctx, howToStepResolver);
    return node;
  },
  resolveRootNode(node, { find }) {
    const article = find(PrimaryArticleId);
    const webPage = find(PrimaryWebPageId);
    if (article)
      setIfEmpty(node, "mainEntityOfPage", idReference(article));
    else if (webPage)
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
    if (article == null ? undefined : article.author)
      setIfEmpty(node, "author", article.author);
    return node;
  }
});
const softwareAppResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "SoftwareApplication"
  },
  resolve(node, ctx) {
    resolveDefaultType(node, "SoftwareApplication");
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  }
});
function defineHeadPlugin(plugin2) {
  return plugin2;
}
function hashCode(s) {
  let h2 = 9;
  for (let i2 = 0; i2 < s.length; )
    h2 = Math.imul(h2 ^ s.charCodeAt(i2++), 9 ** 9);
  return ((h2 ^ h2 >>> 9) + 65536).toString(16).substring(1, 8).toLowerCase();
}
const sepSub = "%separator";
function sub(p, token, isJson = false) {
  var _a;
  let val;
  if (token === "s" || token === "pageTitle") {
    val = p.pageTitle;
  } else if (token.includes(".")) {
    const dotIndex = token.indexOf(".");
    val = (_a = p[token.substring(0, dotIndex)]) == null ? undefined : _a[token.substring(dotIndex + 1)];
  } else {
    val = p[token];
  }
  if (val !== undefined) {
    return isJson ? (val || "").replace(/"/g, '\\"') : val || "";
  }
  return undefined;
}
const sepSubRe = new RegExp(`${sepSub}(?:\\s*${sepSub})*`, "g");
function processTemplateParams(s, p, sep, isJson = false) {
  if (typeof s !== "string" || !s.includes("%"))
    return s;
  let decoded = s;
  try {
    decoded = decodeURI(s);
  } catch {
  }
  const tokens = decoded.match(/%\w+(?:\.\w+)?/g);
  if (!tokens) {
    return s;
  }
  const hasSepSub = s.includes(sepSub);
  s = s.replace(/%\w+(?:\.\w+)?/g, (token) => {
    if (token === sepSub || !tokens.includes(token)) {
      return token;
    }
    const re2 = sub(p, token.slice(1), isJson);
    return re2 !== undefined ? re2 : token;
  }).trim();
  if (hasSepSub) {
    if (s.endsWith(sepSub))
      s = s.slice(0, -sepSub.length);
    if (s.startsWith(sepSub))
      s = s.slice(sepSub.length);
    s = s.replace(sepSubRe, sep).trim();
  }
  return s;
}
function loadResolver(resolver2) {
  switch (resolver2) {
    case "address":
      return addressResolver;
    case "aggregateOffer":
      return aggregateOfferResolver;
    case "aggregateRating":
      return aggregateRatingResolver;
    case "article":
      return articleResolver;
    case "breadcrumb":
      return breadcrumbResolver;
    case "comment":
      return commentResolver;
    case "event":
      return eventResolver;
    case "foodEstablishment":
      return foodEstablishmentResolver;
    case "virtualLocation":
      return virtualLocationResolver;
    case "place":
      return placeResolver;
    case "howTo":
      return howToResolver;
    case "howToStep":
      return howToStepResolver;
    case "image":
      return imageResolver;
    case "localBusiness":
      return localBusinessResolver;
    case "offer":
      return offerResolver;
    case "openingHours":
      return openingHoursResolver;
    case "organization":
      return organizationResolver;
    case "person":
      return personResolver;
    case "product":
      return productResolver;
    case "question":
      return questionResolver;
    case "recipe":
      return recipeResolver;
    case "review":
      return reviewResolver;
    case "video":
      return videoResolver;
    case "webPage":
      return webPageResolver;
    case "webSite":
      return webSiteResolver;
    case "book":
      return bookResolver;
    case "course":
      return courseResolver;
    case "itemList":
      return itemListResolver;
    case "jobPosting":
      return jobPostingResolver;
    case "listItem":
      return listItemResolver;
    case "movie":
      return movieResolver;
    case "searchAction":
      return searchActionResolver;
    case "readAction":
      return readActionResolver;
    case "softwareApp":
      return softwareAppResolver;
    case "bookEdition":
      return bookEditionResolver;
  }
  return null;
}
const resolver = {
  __proto__: null,
  loadResolver
};
function resolveMeta(meta) {
  if (!meta.host && meta.canonicalHost)
    meta.host = meta.canonicalHost;
  if (!meta.tagPosition && meta.position)
    meta.tagPosition = meta.position;
  if (!meta.currency && meta.defaultCurrency)
    meta.currency = meta.defaultCurrency;
  if (!meta.inLanguage && meta.defaultLanguage)
    meta.inLanguage = meta.defaultLanguage;
  if (!meta.path)
    meta.path = "/";
  if (!meta.host && false)
    meta.host = (undefined).location.host;
  if (!meta.url && meta.canonicalUrl)
    meta.url = meta.canonicalUrl;
  if (meta.path !== "/") {
    if (meta.trailingSlash && !hasTrailingSlash(meta.path))
      meta.path = withTrailingSlash(meta.path);
    else if (!meta.trailingSlash && hasTrailingSlash(meta.path))
      meta.path = withoutTrailingSlash(meta.path);
  }
  meta.url = joinURL(meta.host || "", meta.path);
  return {
    ...meta,
    host: meta.host,
    url: meta.url,
    currency: meta.currency,
    image: meta.image,
    inLanguage: meta.inLanguage,
    title: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified
  };
}
function resolveNode(node, ctx, resolver2) {
  var _a;
  if (resolver2 == null ? undefined : resolver2.cast)
    node = resolver2.cast(node, ctx);
  if (resolver2 == null ? undefined : resolver2.defaults) {
    let defaults = resolver2.defaults || {};
    if (typeof defaults === "function")
      defaults = defaults(ctx);
    node = {
      ...defaults,
      ...node
    };
  }
  (_a = resolver2.inheritMeta) == null ? undefined : _a.forEach((entry2) => {
    if (typeof entry2 === "string")
      setIfEmpty(node, entry2, ctx.meta[entry2]);
    else
      setIfEmpty(node, entry2.key, ctx.meta[entry2.meta]);
  });
  if (resolver2 == null ? undefined : resolver2.resolve)
    node = resolver2.resolve(node, ctx);
  for (const k2 in node) {
    const v2 = node[k2];
    if (typeof v2 === "object" && (v2 == null ? undefined : v2._resolver))
      node[k2] = resolveRelation(v2, ctx, v2._resolver);
  }
  stripEmptyProperties(node);
  return node;
}
function resolveNodeId(node, ctx, resolver2, resolveAsRoot = false) {
  var _a, _b, _c, _d;
  if (node["@id"] && node["@id"].startsWith("http"))
    return node;
  const prefix = resolver2 ? (Array.isArray(resolver2.idPrefix) ? resolver2.idPrefix[0] : resolver2.idPrefix) || "url" : "url";
  const rootId = node["@id"] || (resolver2 ? Array.isArray(resolver2.idPrefix) ? (_a = resolver2.idPrefix) == null ? undefined : _a[1] : undefined : "");
  if (!node["@id"] && resolveAsRoot && rootId) {
    node["@id"] = prefixId(ctx.meta[prefix], rootId);
    return node;
  }
  if (((_b = node["@id"]) == null ? undefined : _b.startsWith("#/schema/")) || ((_c = node["@id"]) == null ? undefined : _c.startsWith("/"))) {
    node["@id"] = prefixId(ctx.meta[prefix], node["@id"]);
    return node;
  }
  let alias = resolver2 == null ? undefined : resolver2.alias;
  if (!alias) {
    const type = ((_d = asArray(node["@type"])) == null ? undefined : _d[0]) || "";
    alias = type.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  const hashNodeData = {};
  for (const key in node) {
    if (key[0] === "_") {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(node, key)) {
      continue;
    }
    hashNodeData[key] = node[key];
  }
  node["@id"] = prefixId(ctx.meta[prefix], `#/schema/${alias}/${node["@id"] || hashCode(JSON.stringify(hashNodeData))}`);
  return node;
}
function resolveRelation(input, ctx, fallbackResolver, options = {}) {
  if (!input)
    return input;
  const ids = asArray(input).map((a) => {
    var _a;
    const keys = Object.keys(a).length;
    if (keys === 1 && a["@id"] || keys === 2 && a["@id"] && a["@type"]) {
      return resolveNodeId({
        // we drop @type
        "@id": ((_a = ctx.find(a["@id"])) == null ? undefined : _a["@id"]) || a["@id"]
      }, ctx);
    }
    let resolver2 = fallbackResolver;
    if (a._resolver) {
      resolver2 = a._resolver;
      if (typeof resolver2 === "string")
        resolver2 = loadResolver(resolver2);
      delete a._resolver;
    }
    if (!resolver2)
      return a;
    let node = resolveNode(a, ctx, resolver2);
    if (options.afterResolve)
      options.afterResolve(node);
    if (options.generateId || options.root)
      node = resolveNodeId(node, ctx, resolver2, false);
    if (options.root) {
      if (resolver2.resolveRootNode)
        resolver2.resolveRootNode(node, ctx);
      ctx.push(node);
      return idReference(node["@id"]);
    }
    return node;
  });
  if (!options.array && ids.length === 1)
    return ids[0];
  return ids;
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === undefined) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c2) => _defu(p, c2, "", merger), {})
  );
}
const defu = createDefu();
function groupBy(array, predicate) {
  return array.reduce((acc, value, index, array2) => {
    const key = predicate(value, index, array2);
    if (!acc[key])
      acc[key] = [];
    acc[key].push(value);
    return acc;
  }, {});
}
function uniqueBy(array, predicate) {
  return Object.values(groupBy(array, predicate)).map((a) => a[a.length - 1]);
}
const merge = createDefu((object, key, value) => {
  if (Array.isArray(object[key])) {
    if (Array.isArray(value)) {
      const map = {};
      for (const item of [...object[key], ...value])
        map[hash(item)] = item;
      object[key] = Object.values(map);
      if (key === "itemListElement") {
        object[key] = [...uniqueBy(object[key], (item) => item.position)];
      }
      return true;
    }
    object[key] = merge(object[key], Array.isArray(value) ? value : [value]);
    return true;
  }
});
function dedupeNodes(nodes) {
  const dedupedNodes = {};
  for (const key of nodes.keys()) {
    const n = nodes[key];
    const nodeKey = resolveAsGraphKey(n["@id"] || hash(n));
    if (dedupedNodes[nodeKey] && n._dedupeStrategy !== "replace")
      dedupedNodes[nodeKey] = merge(nodes[key], dedupedNodes[nodeKey]);
    else
      dedupedNodes[nodeKey] = nodes[key];
  }
  return Object.values(dedupedNodes);
}
function normaliseNodes(nodes) {
  const sortedNodeKeys = nodes.keys();
  const dedupedNodes = {};
  for (const key of sortedNodeKeys) {
    const n = nodes[key];
    const nodeKey = resolveAsGraphKey(n["@id"] || hash(n));
    const groupedKeys = groupBy(Object.keys(n), (key2) => {
      const val = n[key2];
      if (key2[0] === "_")
        return "ignored";
      if (Array.isArray(val) || typeof val === "object")
        return "relations";
      return "primitives";
    });
    const keys = [
      ...(groupedKeys.primitives || []).sort(),
      ...(groupedKeys.relations || []).sort()
    ];
    let newNode = {};
    for (const key2 of keys)
      newNode[key2] = n[key2];
    if (dedupedNodes[nodeKey])
      newNode = merge(newNode, dedupedNodes[nodeKey]);
    dedupedNodes[nodeKey] = newNode;
  }
  return Object.values(dedupedNodes);
}
const baseRelationNodes = [
  "translationOfWork",
  "workTranslation"
];
function createSchemaOrgGraph() {
  const ctx = {
    find(id) {
      let resolver2 = (s) => s;
      if (id[0] === "#") {
        resolver2 = resolveAsGraphKey;
      } else if (id[0] === "/") {
        resolver2 = (s) => s.replace(/(https?:)?\/\//, "").split("/")[0];
      }
      const key = resolver2(id);
      return ctx.nodes.filter((n) => !!n["@id"]).find((n) => resolver2(n["@id"]) === key);
    },
    push(input) {
      asArray(input).forEach((node) => {
        const registeredNode = node;
        ctx.nodes.push(registeredNode);
      });
    },
    resolveGraph(meta) {
      ctx.meta = resolveMeta({ ...meta });
      ctx.nodes.forEach((node, key) => {
        const resolver2 = node._resolver;
        if (resolver2) {
          node = resolveNode(node, ctx, resolver2);
          node = resolveNodeId(node, ctx, resolver2, true);
        }
        ctx.nodes[key] = node;
      });
      ctx.nodes = dedupeNodes(ctx.nodes);
      ctx.nodes.forEach((node) => {
        var _a;
        if (node.image && typeof node.image === "string") {
          node.image = resolveRelation(node.image, ctx, imageResolver, {
            root: true
          });
        }
        baseRelationNodes.forEach((k2) => {
          node[k2] = resolveRelation(node[k2], ctx);
        });
        if ((_a = node._resolver) == null ? undefined : _a.resolveRootNode)
          node._resolver.resolveRootNode(node, ctx);
        delete node._resolver;
      });
      return normaliseNodes(ctx.nodes);
    },
    nodes: [],
    meta: {}
  };
  return ctx;
}
function SchemaOrgUnheadPlugin(config, meta, options) {
  config = resolveMeta({ ...config });
  let graph;
  let resolvedMeta = {};
  return defineHeadPlugin((head) => ({
    key: "schema-org",
    hooks: {
      "entries:resolve": () => {
        graph = createSchemaOrgGraph();
      },
      "tag:normalise": async ({ tag }) => {
        if (tag.tag === "script" && tag.props.type === "application/ld+json" && tag.props.nodes) {
          const { loadResolver: loadResolver2 } = await Promise.resolve().then(function() {
            return resolver;
          });
          const nodes = await tag.props.nodes;
          for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
            if (typeof node !== "object" || Object.keys(node).length === 0) {
              continue;
            }
            const newNode = {
              ...node,
              _dedupeStrategy: tag.tagDuplicateStrategy,
              _resolver: loadResolver2(await node._resolver)
            };
            graph.push(newNode);
          }
          tag.tagPosition = tag.tagPosition || config.tagPosition === "head" ? "head" : "bodyClose";
        }
        if (tag.tag === "htmlAttrs" && tag.props.lang) {
          resolvedMeta.inLanguage = tag.props.lang;
        } else if (tag.tag === "title") {
          resolvedMeta.title = tag.textContent;
        } else if (tag.tag === "meta" && tag.props.name === "description") {
          resolvedMeta.description = tag.props.content;
        } else if (tag.tag === "link" && tag.props.rel === "canonical") {
          resolvedMeta.url = tag.props.href;
          if (resolvedMeta.url && !resolvedMeta.host) {
            try {
              resolvedMeta.host = new URL(resolvedMeta.url).origin;
            } catch {
            }
          }
        } else if (tag.tag === "meta" && tag.props.property === "og:image") {
          resolvedMeta.image = tag.props.content;
        } else if (tag.tag === "templateParams" && tag.props.schemaOrg) {
          resolvedMeta = {
            ...resolvedMeta,
            // @ts-expect-error untyped
            ...tag.props.schemaOrg
          };
          delete tag.props.schemaOrg;
        }
      },
      "tags:resolve": async (ctx) => {
        for (const k2 in ctx.tags) {
          const tag = ctx.tags[k2];
          if (tag.tag === "script" && tag.props.type === "application/ld+json" && tag.props.nodes) {
            delete tag.props.nodes;
            const resolvedGraph = graph.resolveGraph({ ...await (meta == null ? undefined : meta()) || {}, ...config, ...resolvedMeta });
            if (!resolvedGraph.length) {
              tag.props = {};
              return;
            }
            (options == null ? undefined : options.minify) || "production" === "production";
            tag.innerHTML = JSON.stringify({
              "@context": "https://schema.org",
              "@graph": resolvedGraph
            }, (_2, value) => {
              if (typeof value !== "object")
                return processTemplateParams(value, head._templateParams, head._separator);
              return value;
            }, 0 );
            return;
          }
        }
      },
      "tags:afterResolve": (ctx) => {
        let firstNodeKey;
        for (const k2 in ctx.tags) {
          const tag = ctx.tags[k2];
          if (tag.props.type === "application/ld+json" && tag.props.nodes || tag.key === "schema-org-graph") {
            delete tag.props.nodes;
            if (typeof firstNodeKey === "undefined") {
              firstNodeKey = k2;
              continue;
            }
            ctx.tags[firstNodeKey].props = defu(ctx.tags[firstNodeKey].props, tag.props);
            delete ctx.tags[firstNodeKey].props.nodes;
            ctx.tags[k2] = false;
          }
        }
        ctx.tags = ctx.tags.filter(Boolean);
      }
    }
  }));
}
function provideResolver(input, resolver2) {
  if (!input)
    input = {};
  input._resolver = resolver2;
  return input;
}
function defineWebPage(input) {
  return provideResolver(input, "webPage");
}
function defineWebSite(input) {
  return provideResolver(input, "webSite");
}
function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
function isPathFile(path) {
  var _a;
  const lastSegment = path.split("/").pop();
  return !!((_a = (lastSegment || path).match(/\.[0-9a-z]+$/i)) == null ? undefined : _a[0]);
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}
function useNitroOrigin(e) {
  {
    e = e || useRequestEvent();
    return e.context.siteConfigNitroOrigin;
  }
}
function createSitePathResolver(options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const nuxtBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return (path) => {
    return computed(() => resolveSitePath(unref(path), {
      absolute: unref(options.absolute),
      withBase: unref(options.withBase),
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    }));
  };
}
function withSiteUrl(path, options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const base = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return computed(() => {
    return resolveSitePath(unref(path), {
      absolute: true,
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base,
      withBase: unref(options.withBase)
    });
  });
}
function initPlugin(nuxtApp) {
  const head = injectHead();
  const config = useSchemaOrgConfig();
  const route = useRoute();
  const siteConfig = useSiteConfig();
  const resolvePath = createSitePathResolver({
    absolute: false,
    withBase: true
  });
  const resolveUrl = createSitePathResolver({
    canonical: true,
    absolute: true,
    withBase: true
  });
  const schemaOrg = computed(() => {
    var _a;
    return {
      ...((_a = route.meta) == null ? undefined : _a.schemaOrg) || {},
      ...siteConfig,
      url: resolveUrl(route.path),
      host: withoutTrailingSlash(siteConfig.url),
      inLanguage: siteConfig.currentLocale || siteConfig.defaultLocale,
      path: resolvePath(route.path)
    };
  });
  head.push({ templateParams: { schemaOrg } });
  head.use(
    SchemaOrgUnheadPlugin({}, async () => {
      const meta = {};
      await nuxtApp.hooks.callHook("schema-org:meta", meta);
      return meta;
    }, {
      minify: config.minify,
      trailingSlash: siteConfig.trailingSlash
    })
  );
}
function maybeAddIdentitySchemaOrg() {
  const config = useSchemaOrgConfig();
  const siteConfig = useSiteConfig();
  if (config.identity || siteConfig.identity) {
    const identity = config.identity || siteConfig.identity;
    let identityPayload = {
      name: siteConfig.name,
      url: siteConfig.url
    };
    let identityType;
    if (typeof identity !== "string") {
      identityPayload = defu$1(identity, identityPayload);
      identityType = identity.type;
      delete identityPayload.type;
    } else {
      identityType = identity;
    }
    if (siteConfig.twitter) {
      const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter.slice(1) : siteConfig.twitter;
      identityPayload.sameAs = [
        `https://twitter.com/${id}`
      ];
    }
    identityPayload._resolver = identityPayload._resolver || camelCase(identityType);
    useSchemaOrg([identityPayload]);
  }
}
const defaults_ejC916ejE3 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:defaults",
  dependsOn: [
    "nuxt-schema-org:init"
  ],
  setup() {
    const siteConfig = useSiteConfig();
    useSchemaOrg([
      defineWebSite({
        name: (siteConfig == null ? undefined : siteConfig.name) || "",
        inLanguage: (siteConfig == null ? undefined : siteConfig.currentLocale) || "",
        description: (siteConfig == null ? undefined : siteConfig.description) || ""
      }),
      defineWebPage()
    ]);
    maybeAddIdentitySchemaOrg();
  }
});
const init_8zxuXEdLTw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:init",
  setup(nuxtApp) {
    initPlugin(nuxtApp);
  }
});
const componentNames = [{ "hash": "i0Vxmj8bqg", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "tBHg51xiAt", "pascalName": "Frame", "kebabName": "frame", "category": "community", "credits": "@arashsheyda <https://github.com/arashsheyda>" }, { "hash": "Sqc3OTP2KQ", "pascalName": "Nuxt", "kebabName": "nuxt", "category": "community", "credits": "NuxtLabs <https://nuxtlabs.com/>" }, { "hash": "ZZYBOVCtCQ", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "category": "community", "credits": "Nuxt SEO <https://nuxtseo.com/>" }, { "hash": "q432NYEB0T", "pascalName": "Pergel", "kebabName": "pergel", "category": "community", "credits": "Pergel <https://nuxtlabs.com/>" }, { "hash": "6bQOH7FKu2", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "wt558K6QyQ", "pascalName": "UnJs", "kebabName": "un-js", "category": "community", "credits": "UnJS <https://unjs.io/>" }, { "hash": "6RdQZcuwZZ", "pascalName": "Wave", "kebabName": "wave", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "gaB1TrbtTl", "pascalName": "WithEmoji", "kebabName": "with-emoji", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }];
function isInternalRoute(path) {
  return path.startsWith("/_") || path.startsWith("@");
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu$1(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k2]) => !filterIsOgImageOption(k2) && !ignoreKeys.includes(k2))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g2) => g2[1].toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k2]) => filterIsOgImageOption(k2) || ignoreKeys.includes(k2))
    ),
    props
  };
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function getExtension(path) {
  path = withoutQuery(path);
  const lastSegment = path.split("/").pop() || path;
  return lastSegment.split(".").pop() || lastSegment;
}
function generateMeta(url, resolvedOptions) {
  let urlExtension = getExtension(url) || resolvedOptions.extension;
  if (urlExtension === "jpg")
    urlExtension = "jpeg";
  const meta = [
    { property: "og:image", content: url },
    { property: "og:image:type", content: `image/${urlExtension}` },
    { name: "twitter:card", content: "summary_large_image" },
    // we don't need this but avoids issue when using useSeoMeta({ twitterImage })
    { name: "twitter:image", content: url },
    { name: "twitter:image:src", content: url }
  ];
  if (resolvedOptions.width) {
    meta.push({ property: "og:image:width", content: resolvedOptions.width });
    meta.push({ name: "twitter:image:width", content: resolvedOptions.width });
  }
  if (resolvedOptions.height) {
    meta.push({ property: "og:image:height", content: resolvedOptions.height });
    meta.push({ name: "twitter:image:height", content: resolvedOptions.height });
  }
  if (resolvedOptions.alt) {
    meta.push({ property: "og:image:alt", content: resolvedOptions.alt });
    meta.push({ name: "twitter:image:alt", content: resolvedOptions.alt });
  }
  return meta;
}
function getOgImagePath(pagePath, _options) {
  const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
  const options = defu$1(_options, useOgImageRuntimeConfig().defaults);
  return joinURL("/", baseURL2, `__og-image__/${"image"}`, pagePath, `og.${options.extension}`);
}
function useOgImageRuntimeConfig() {
  return (/* @__PURE__ */ useRuntimeConfig())["nuxt-og-image"];
}
function createOgImageMeta(src, input, resolvedOptions, ssrContext) {
  const _input = separateProps(defu$1(input, ssrContext._ogImagePayload));
  let url = src || input.url || resolvedOptions.url;
  if (!url)
    return;
  if (input._query && Object.keys(input._query).length && url)
    url = withQuery(url, { _query: input._query });
  const meta = generateMeta(url, resolvedOptions);
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        const payload = resolveUnrefHeadInput(_input);
        if (typeof payload.props.title === "undefined")
          payload.props.title = "%s";
        delete payload.url;
        if (payload._query && Object.keys(payload._query).length === 0) {
          delete payload._query;
        }
        return stringify(payload);
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useServerHead({
    script,
    meta
  }, {
    tagPriority: 35
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
function normaliseOptions(_options) {
  var _a;
  const options = { ...unref(_options) };
  if (!options)
    return options;
  if (options.component && componentNames) {
    const originalName = options.component;
    for (const component of componentNames) {
      if (component.pascalName.endsWith(originalName) || component.kebabName.endsWith(originalName)) {
        options.component = component.pascalName;
        break;
      }
    }
  } else if (!options.component) {
    options.component = (_a = componentNames[0]) == null ? undefined : _a.pascalName;
  }
  return options;
}
function ogImageCanonicalUrls(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e.path).pathname;
    if (isInternalRoute(path))
      return;
    ssrContext == null ? undefined : ssrContext.head.use({
      key: "nuxt-og-image:overrides-and-canonical-urls",
      hooks: {
        "tags:resolve": async (ctx2) => {
          const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
          let overrides;
          for (const tag of ctx2.tags) {
            if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
              if (hasPrimaryPayload) {
                overrides = separateProps(parse(tag.innerHTML || "{}"));
                delete ctx2.tags[ctx2.tags.indexOf(tag)];
              } else {
                tag.props.id = "nuxt-og-image-options";
                tag.innerHTML = stringify(separateProps(parse(tag.innerHTML || "{}")));
                tag._d = "script:id:nuxt-og-image-options";
              }
              break;
            }
          }
          ctx2.tags = ctx2.tags.filter(Boolean);
          for (const tag of ctx2.tags) {
            if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name))) {
              if (!tag.props.content.startsWith("https")) {
                await nuxtApp.runWithContext(() => {
                  tag.props.content = toValue(withSiteUrl(tag.props.content, {
                    withBase: true
                  }));
                });
              }
            } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
              tag.innerHTML = stringify(defu$1(overrides, parse(tag.innerHTML)));
            }
          }
        }
      }
    });
  });
}
function routeRuleOgImage(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    var _a, _b, _c, _d, _e2, _f;
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e.path).pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (_b = (_a = ssrContext == null ? undefined : ssrContext.runtimeConfig) == null ? undefined : _a.nitro) == null ? undefined : _b.routeRules })
    );
    let routeRules = defu$1({}, ..._routeRulesMatcher.matchAll(
      withoutBase(path.split("?")[0], (_c = ssrContext == null ? undefined : ssrContext.runtimeConfig) == null ? undefined : _c.app.baseURL)
    ).reverse()).ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances == null ? undefined : ogImageInstances.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = undefined;
      nuxtApp.ssrContext._ogImageInstances = undefined;
      return;
    }
    const { defaults } = useOgImageRuntimeConfig();
    routeRules = normaliseOptions(defu$1((_f = (_e2 = (_d = nuxtApp.ssrContext) == null ? undefined : _d.event.context._nitro) == null ? undefined : _e2.routeRules) == null ? undefined : _f.ogImage, routeRules, {
      component: defaults.component
    }));
    const resolvedOptions = normaliseOptions(defu$1(routeRules, defaults));
    const src = getOgImagePath(ssrContext.url, resolvedOptions);
    createOgImageMeta(src, routeRules, resolvedOptions, nuxtApp.ssrContext);
  });
}
const og_image_canonical_urls_server_QnQwHpoQ3t = /* @__PURE__ */ defineNuxtPlugin({
  setup: ogImageCanonicalUrls
});
const route_rule_og_image_server_svhvDKOpur = /* @__PURE__ */ defineNuxtPlugin({
  setup: routeRuleOgImage
});
const robot_meta_server_8htXH4OkuR = /* @__PURE__ */ defineNuxtPlugin({
  setup() {
    var _a;
    const event = useRequestEvent();
    const ctx = (_a = event == null ? undefined : event.context) == null ? undefined : _a.robots;
    if (!ctx)
      return;
    const config = /* @__PURE__ */ useRuntimeConfig();
    useServerHead({
      meta: [
        {
          "name": "robots",
          "content": () => ctx.rule || "",
          "data-hint": () => {
            var _a2, _b;
            return ((_a2 = config["nuxt-robots"]) == null ? undefined : _a2.debug) ? (_b = ctx.debug) == null ? undefined : _b.source : undefined;
          }
        }
      ]
    });
  }
});
var m = class extends Error {
  constructor() {
    super();
  }
  static factory(e) {
    switch (e) {
      case 0:
        return new A();
      case 2:
        return new q();
      case 1:
        return new y();
      case 3:
        return new S();
      case 4:
        return new T();
    }
  }
};
var A = class extends m {
}, y = class extends m {
}, q = class extends m {
}, S = class extends m {
}, T = class extends m {
};
var C = class {
  constructor() {
    this.publishableApiKey = null;
  }
  registerPublishableApiKey(e) {
    this.publishableApiKey = e;
  }
  getPublishableApiKey() {
    return this.publishableApiKey;
  }
}, P = new C();
var O = class {
  constructor() {
    this.adminJwt = null;
    this.storeJwt = null;
  }
  registerJwt(e, s) {
    if (s === "admin") this.adminJwt = e;
    else if (s === "store") this.storeJwt = e;
    else throw new Error(`'domain' must be wither 'admin' or 'store' received ${s}`);
  }
  getJwt(e) {
    if (e === "admin") return this.adminJwt;
    if (e === "store") return this.storeJwt;
    throw new Error(`'domain' must be wither 'admin' or 'store' received ${e}`);
  }
}, u = new O();
var Ys = { "/admin/auth": "POST", "/admin/users/password-token": "POST", "/admin/users/reset-password": "POST", "/admin/invites/accept": "POST" }, es = { maxRetries: 0, baseUrl: "http://localhost:9000" }, $ = class {
  constructor(e) {
    this.axiosClient = this.createClient({ ...es, ...e }), this.config = { ...es, ...e };
  }
  shouldRetryCondition(e, s, t) {
    return s >= t ? false : !e.response || e.response.status === 409 || e.response.status > 500 && e.response.status <= 599;
  }
  normalizeHeaders(e) {
    return e && typeof e == "object" ? Object.keys(e).reduce((s, t) => (s[this.normalizeHeader(t)] = e[t], s), {}) : e;
  }
  normalizeHeader(e) {
    return e.split("-").map((s) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()).join("-");
  }
  requiresAuthentication(e, s) {
    return e.startsWith("/admin") && Ys[e] !== s;
  }
  setHeaders(e, s, t, r = {}) {
    let n = { Accept: "application/json", "Content-Type": "application/json" };
    this.config.apiKey && this.requiresAuthentication(t, s) && (n = { ...n, "x-medusa-access-token": this.config.apiKey });
    let a = t.includes("admin") ? "admin" : "store";
    u.getJwt(a) && (n = { ...n, Authorization: `Bearer ${u.getJwt(a)}` });
    let d = this.config.publishableApiKey || P.getPublishableApiKey();
    return d && (n["x-publishable-api-key"] = d), this.config.maxRetries > 0 && s === "POST" && (n["Idempotency-Key"] = v4()), Object.assign({}, n, this.normalizeHeaders(e), r);
  }
  createClient(e) {
    let s = Qs.create({ baseURL: e.baseUrl, adapter: e.axiosAdapter });
    return h.attach(s), s.defaults.raxConfig = { instance: s, retry: e.maxRetries, backoffType: "exponential", shouldRetry: (t) => {
      let r = h.getConfig(t);
      return r ? this.shouldRetryCondition(t, r.currentRetryAttempt ?? 1, r.retry ?? 3) : false;
    } }, s;
  }
  async request(e, s, t = {}, r = {}, n = {}) {
    n = { ...this.config.customHeaders, ...n };
    let a = { method: e, withCredentials: true, url: s, json: true, headers: this.setHeaders(r, e, s, n) };
    ["POST", "DELETE"].includes(e) && (a.data = t);
    let { data: d, ...Ws } = await this.axiosClient(a);
    return { ...d, response: Ws };
  }
}, ss = $;
var i = class {
  constructor(e) {
    this.client = e;
  }
};
var E = class extends i {
  addAddress(e, s = {}) {
    let t = "/store/customers/me/addresses";
    return this.client.request("POST", t, e, {}, s);
  }
  deleteAddress(e, s = {}) {
    let t = `/store/customers/me/addresses/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  updateAddress(e, s, t = {}) {
    let r = `/store/customers/me/addresses/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
}, L = E;
var x = class extends i {
  authenticate(e, s = {}) {
    let t = "/store/auth";
    return this.client.request("POST", t, e, {}, s);
  }
  deleteSession(e = {}) {
    let s = "/store/auth";
    return this.client.request("DELETE", s, {}, {}, e);
  }
  getSession(e = {}) {
    let s = "/store/auth";
    return this.client.request("GET", s, undefined, {}, e);
  }
  exists(e, s = {}) {
    let t = `/store/auth/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  getToken(e, s = {}) {
    let t = "/store/auth/token";
    return this.client.request("POST", t, e, {}, s).then((r) => (u.registerJwt(r.access_token, "store"), r));
  }
}, G = x;
var D = class extends i {
  create(e, s, t = {}) {
    let r = `/store/carts/${e}/line-items`;
    return this.client.request("POST", r, s, {}, t);
  }
  update(e, s, t, r = {}) {
    let n = `/store/carts/${e}/line-items/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  delete(e, s, t = {}) {
    let r = `/store/carts/${e}/line-items/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
}, b = D;
var v = class extends i {
  constructor() {
    super(...arguments);
    this.lineItems = new b(this.client);
  }
  addShippingMethod(s, t, r = {}) {
    let n = `/store/carts/${s}/shipping-methods`;
    return this.client.request("POST", n, t, {}, r);
  }
  complete(s, t = {}) {
    let r = `/store/carts/${s}/complete`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  create(s, t = {}) {
    let r = "/store/carts";
    return this.client.request("POST", r, s, {}, t);
  }
  createPaymentSessions(s, t = {}) {
    let r = `/store/carts/${s}/payment-sessions`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  deleteDiscount(s, t, r = {}) {
    let n = `/store/carts/${s}/discounts/${t}`;
    return this.client.request("DELETE", n, undefined, {}, r);
  }
  deletePaymentSession(s, t, r = {}) {
    let n = `/store/carts/${s}/payment-sessions/${t}`;
    return this.client.request("DELETE", n, undefined, {}, r);
  }
  refreshPaymentSession(s, t, r = {}) {
    let n = `/store/carts/${s}/payment-sessions/${t}/refresh`;
    return this.client.request("POST", n, undefined, {}, r);
  }
  retrieve(s, t = {}) {
    let r = `/store/carts/${s}`;
    return this.client.request("GET", r, undefined, {}, t);
  }
  setPaymentSession(s, t, r = {}) {
    let n = `/store/carts/${s}/payment-session`;
    return this.client.request("POST", n, t, {}, r);
  }
  update(s, t, r = {}) {
    let n = `/store/carts/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  updatePaymentSession(s, t, r, n = {}) {
    let a = `/store/carts/${s}/payment-sessions/${t}`;
    return this.client.request("POST", a, r, {}, n);
  }
}, w = v;
var I = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/collections/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/store/collections";
    return e && (t = `/store/collections?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, B = I;
var k = class extends i {
  list(e = {}) {
    let s = "/store/customers/me/payment-methods";
    return this.client.request("GET", s, undefined, {}, e);
  }
}, l = k;
var U = class extends i {
  constructor() {
    super(...arguments);
    this.paymentMethods = new l(this.client);
    this.addresses = new L(this.client);
  }
  create(s, t = {}) {
    let r = "/store/customers";
    return this.client.request("POST", r, s, {}, t);
  }
  retrieve(s = {}) {
    let t = "/store/customers/me";
    return this.client.request("GET", t, undefined, {}, s);
  }
  update(s, t = {}) {
    let r = "/store/customers/me";
    return this.client.request("POST", r, s, {}, t);
  }
  listOrders(s, t = {}) {
    let r = "/store/customers/me/orders";
    if (s) {
      let n = c.stringify(s);
      n && (r += `?${n}`);
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  resetPassword(s, t = {}) {
    let r = "/store/customers/password-reset";
    return this.client.request("POST", r, s, {}, t);
  }
  generatePasswordToken(s, t = {}) {
    let r = "/store/customers/password-token";
    return this.client.request("POST", r, s, {}, t);
  }
}, K = U;
var N = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/gift-cards/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
}, V = N;
var F = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/order-edits/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  decline(e, s, t = {}) {
    let r = `/store/order-edits/${e}/decline`;
    return this.client.request("POST", r, s, {}, t);
  }
  complete(e, s = {}) {
    let t = `/store/order-edits/${e}/complete`;
    return this.client.request("POST", t, undefined, {}, s);
  }
}, J = F;
var M = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/orders/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  retrieveByCartId(e, s = {}) {
    let t = `/store/orders/cart/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  lookupOrder(e, s = {}) {
    let t = "/store/orders?";
    return t = `/store/orders?${c.stringify(e)}`, this.client.request("GET", t, e, {}, s);
  }
  requestCustomerOrders(e, s = {}) {
    let t = "/store/orders/batch/customer/token";
    return this.client.request("POST", t, e, {}, s);
  }
  confirmRequest(e, s = {}) {
    let t = "/store/orders/customer/confirm";
    return this.client.request("POST", t, e, {}, s);
  }
}, z = M;
var H = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/store/payment-collections/${e}`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  authorizePaymentSession(e, s, t = {}) {
    let r = `/store/payment-collections/${e}/sessions/${s}/authorize`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  authorizePaymentSessionsBatch(e, s, t = {}) {
    let r = `/store/payment-collections/${e}/sessions/batch/authorize`;
    return this.client.request("POST", r, s, {}, t);
  }
  managePaymentSessionsBatch(e, s, t = {}) {
    let r = `/store/payment-collections/${e}/sessions/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  managePaymentSession(e, s, t = {}) {
    let r = `/store/payment-collections/${e}/sessions`;
    return this.client.request("POST", r, s, {}, t);
  }
  refreshPaymentSession(e, s, t = {}) {
    let r = `/store/payment-collections/${e}/sessions/${s}`;
    return this.client.request("POST", r, undefined, {}, t);
  }
}, j = H;
var _ = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/store/product-categories/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `${r}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  list(e, s = {}) {
    let t = "/store/product-categories";
    if (e) {
      let r = c.stringify(e);
      t = `${t}?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, W = _;
var Q = class extends i {
  list(e, s = {}) {
    let t = "/store/product-tags";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, X = Q;
var Y = class extends i {
  list(e, s = {}) {
    let t = "/store/product-types";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, Z = Y;
var ee = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/variants/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/store/variants";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, se = ee;
var te = class extends i {
  constructor() {
    super(...arguments);
    this.variants = new se(this.client);
  }
  retrieve(s, t = {}) {
    let r = `/store/products/${s}`;
    return this.client.request("GET", r, undefined, {}, t);
  }
  search(s, t = {}) {
    let r = "/store/products/search";
    return this.client.request("POST", r, s, {}, t);
  }
  list(s, t = {}) {
    let r = "/store/products";
    return s && (r = `/store/products?${c.stringify(s)}`), this.client.request("GET", r, undefined, {}, t);
  }
}, re = te;
var ne = class extends i {
  list(e = {}) {
    let s = "/store/regions";
    return this.client.request("GET", s, undefined, {}, e);
  }
  retrieve(e, s = {}) {
    let t = `/store/regions/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
}, ie = ne;
var oe = class extends i {
  retrieve(e, s = {}) {
    let t = `/store/return-reasons/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e = {}) {
    let s = "/store/return-reasons";
    return this.client.request("GET", s, undefined, {}, e);
  }
}, ae = oe;
var de = class extends i {
  create(e, s = {}) {
    let t = "/store/returns";
    return this.client.request("POST", t, e, {}, s);
  }
}, me = de;
var ce = class extends i {
  listCartOptions(e, s = {}) {
    let t = `/store/shipping-options/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/store/shipping-options";
    return e && (t = `/store/shipping-options?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, ue = ce;
var pe = class extends i {
  create(e, s = {}) {
    let t = "/store/swaps";
    return this.client.request("POST", t, e, {}, s);
  }
  retrieveByCartId(e, s = {}) {
    let t = `/store/swaps/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
}, Re = pe;
var le = class extends i {
  getSession(e = {}) {
    let s = "/admin/auth";
    return this.client.request("GET", s, undefined, {}, e);
  }
  deleteSession(e = {}) {
    let s = "/admin/auth";
    return this.client.request("DELETE", s, undefined, {}, e);
  }
  createSession(e, s = {}) {
    let t = "/admin/auth";
    return this.client.request("POST", t, e, {}, s);
  }
  getToken(e, s = {}) {
    let t = "/admin/auth/token";
    return this.client.request("POST", t, e, {}, s).then((r) => (u.registerJwt(r.access_token, "admin"), r));
  }
}, rs = le;
function ns(o) {
  let e = (s) => {
    let t = {};
    return Object.keys(s).reduce((r, n) => (s[n] === null ? r[n] = "null" : typeof s[n] == "object" ? r[n] = e(s[n]) : r[n] = s[n], r), t), t;
  };
  return e(o);
}
function g(o) {
  let e = o;
  return e.startsWith("/") || (e = `/${e}`), e.startsWith("/admin") || (e = `/admin${e}`), e;
}
var Pe = class extends i {
  create(e, s = {}) {
    let t = "/admin/batch-jobs";
    return this.client.request("POST", t, e, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/batch-jobs";
    return e && (t = `/admin/batch-jobs?${c.stringify(ns(e))}`), this.client.request("GET", t, undefined, {}, s);
  }
  cancel(e, s = {}) {
    let t = `/admin/batch-jobs/${e}/cancel`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  confirm(e, s = {}) {
    let t = `/admin/batch-jobs/${e}/confirm`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/batch-jobs/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
}, is = Pe;
var he = class extends i {
  create(e, s = {}) {
    let t = "/admin/collections";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/collections/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/collections/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/collections/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/collections";
    return e && (t = `/admin/collections?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  addProducts(e, s, t = {}) {
    let r = `/admin/collections/${e}/products/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  removeProducts(e, s, t = {}) {
    let r = `/admin/collections/${e}/products/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
}, os = he;
var ge = class extends i {
  list(e, s = {}) {
    let t = "/admin/currencies";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/currencies/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
}, as = ge;
var fe = class extends i {
  get(e, s, t, r) {
    let n = g(e);
    if (s) {
      let a = c.stringify(s);
      n += `?${a}`;
    }
    return this.client.request("GET", n, undefined, t, r);
  }
  post(e, s, t, r) {
    let n = g(e);
    return this.client.request("POST", n, s, t, r);
  }
  delete(e, s, t) {
    let r = g(e);
    return this.client.request("DELETE", r, undefined, s, t);
  }
}, ds = fe;
var ye = class extends i {
  create(e, s = {}) {
    let t = "/admin/customer-groups";
    return this.client.request("POST", t, e, {}, s);
  }
  retrieve(e, s, t = {}) {
    let r = `/admin/customer-groups/${e}`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  update(e, s, t = {}) {
    let r = `/admin/customer-groups/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/customer-groups/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/customer-groups";
    return e && (t = `/admin/customer-groups?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  addCustomers(e, s, t = {}) {
    let r = `/admin/customer-groups/${e}/customers/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  removeCustomers(e, s, t = {}) {
    let r = `/admin/customer-groups/${e}/customers/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
  listCustomers(e, s, t = {}) {
    let r = `/admin/customer-groups/${e}/customers`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
}, ms = ye;
var qe = class extends i {
  create(e, s = {}) {
    let t = "/admin/customers";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/customers/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  retrieve(e, s = {}) {
    let t = `/admin/customers/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/customers";
    return e && (t = `/admin/customers?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, cs = qe;
var Se = class extends i {
  addRegion(e, s, t = {}) {
    let r = `/admin/discounts/${e}/regions/${s}`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  create(e, s = {}) {
    let t = "/admin/discounts";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/discounts/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  createDynamicCode(e, s, t = {}) {
    let r = `/admin/discounts/${e}/dynamic-codes`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/discounts/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  deleteDynamicCode(e, s, t = {}) {
    let r = `/admin/discounts/${e}/dynamic-codes/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  retrieve(e, s, t = {}) {
    let r = `/admin/discounts/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `${r}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  retrieveByCode(e, s = {}) {
    let t = `/admin/discounts/code/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/discounts";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  removeRegion(e, s, t = {}) {
    let r = `/admin/discounts/${e}/regions/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  createCondition(e, s, t = {}, r = {}) {
    let n = `/admin/discounts/${e}/conditions`;
    if (t) {
      let a = c.stringify(t);
      n += `?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  updateCondition(e, s, t, r = {}, n = {}) {
    let a = `/admin/discounts/${e}/conditions/${s}`;
    if (r) {
      let d = c.stringify(r);
      a += `?${d}`;
    }
    return this.client.request("POST", a, t, {}, n);
  }
  deleteCondition(e, s, t = {}) {
    let r = `/admin/discounts/${e}/conditions/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  getCondition(e, s, t, r = {}) {
    let n = `/admin/discounts/${e}/conditions/${s}`;
    if (t) {
      let a = c.stringify(t);
      n += `?${a}`;
    }
    return this.client.request("GET", n, undefined, {}, r);
  }
  addConditionResourceBatch(e, s, t, r, n = {}) {
    let a = `/admin/discounts/${e}/conditions/${s}/batch`;
    if (r) {
      let d = c.stringify(r);
      a += `?${d}`;
    }
    return this.client.request("POST", a, t, {}, n);
  }
  deleteConditionResourceBatch(e, s, t, r = {}) {
    let n = `/admin/discounts/${e}/conditions/${s}/batch`;
    return this.client.request("DELETE", n, t, {}, r);
  }
}, us = Se;
var Te = class extends i {
  create(e, s = {}) {
    let t = "/admin/draft-orders";
    return this.client.request("POST", t, e, {}, s);
  }
  addLineItem(e, s, t = {}) {
    let r = `/admin/draft-orders/${e}/line-items`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/draft-orders/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  removeLineItem(e, s, t = {}) {
    let r = `/admin/draft-orders/${e}/line-items/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  retrieve(e, s = {}) {
    let t = `/admin/draft-orders/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/draft-orders";
    return e && (t = `/admin/draft-orders?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  markPaid(e, s = {}) {
    let t = `/admin/draft-orders/${e}/pay`;
    return this.client.request("POST", t, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/draft-orders/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  updateLineItem(e, s, t, r = {}) {
    let n = `/admin/draft-orders/${e}/line-items/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
}, ps = Te;
var Ce = class extends i {
  create(e, s = {}) {
    let t = "/admin/gift-cards";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/gift-cards/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/gift-cards/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/gift-cards/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/gift-cards/";
    return e && (t = `/admin/gift-cards?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, Rs = Ce;
var Oe = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/inventory-items/${e}`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  update(e, s, t, r = {}) {
    let n = `/admin/inventory-items/${e}`;
    if (t) {
      let a = c.stringify(t);
      n += `?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  delete(e, s = {}) {
    let t = `/admin/inventory-items/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  create(e, s, t = {}) {
    let r = "/admin/inventory-items";
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("POST", r, e, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/inventory-items";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  updateLocationLevel(e, s, t, r, n = {}) {
    let a = `/admin/inventory-items/${e}/location-levels/${s}`;
    if (r) {
      let d = c.stringify(r);
      a += `?${d}`;
    }
    return this.client.request("POST", a, t, {}, n);
  }
  createLocationLevel(e, s, t, r = {}) {
    let n = `/admin/inventory-items/${e}/location-levels`;
    if (t) {
      let a = c.stringify(t);
      n += `?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  deleteLocationLevel(e, s, t = {}) {
    let r = `/admin/inventory-items/${e}/location-levels/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  listLocationLevels(e, s, t = {}) {
    let r = `/admin/inventory-items/${e}/location-levels`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
}, ls = Oe;
var $e = class extends i {
  accept(e, s = {}) {
    let t = "/admin/invites/accept";
    return this.client.request("POST", t, e, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/invites";
    return this.client.request("POST", t, e, {}, s);
  }
  delete(e, s = {}) {
    let t = `/admin/invites/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  list(e = {}) {
    let s = "/admin/invites";
    return this.client.request("GET", s, undefined, {}, e);
  }
  resend(e, s = {}) {
    let t = `/admin/invites/${e}/resend`;
    return this.client.request("POST", t, undefined, {}, s);
  }
}, Ps = $e;
var Ee = class extends i {
  create(e, s = {}) {
    let t = "/admin/notes";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/notes/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/notes/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/notes/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/notes/";
    return e && (t = `/admin/notes?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, hs = Ee;
var Le = class extends i {
  list(e, s = {}) {
    let t = "/admin/notifications";
    return e && (t = `/admin/notifications?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  resend(e, s, t = {}) {
    let r = `/admin/notifications/${e}/resend`;
    return this.client.request("POST", r, s, {}, t);
  }
}, gs = Le;
var xe = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/order-edits/${e}`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/order-edits";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/order-edits";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/order-edits/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/order-edits/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  addLineItem(e, s, t = {}) {
    let r = `/admin/order-edits/${e}/items`;
    return this.client.request("POST", r, s, {}, t);
  }
  deleteItemChange(e, s, t = {}) {
    let r = `/admin/order-edits/${e}/changes/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  requestConfirmation(e, s = {}) {
    let t = `/admin/order-edits/${e}/request`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  cancel(e, s = {}) {
    let t = `/admin/order-edits/${e}/cancel`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  confirm(e, s = {}) {
    let t = `/admin/order-edits/${e}/confirm`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  updateLineItem(e, s, t, r = {}) {
    let n = `/admin/order-edits/${e}/items/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  removeLineItem(e, s, t = {}) {
    let r = `/admin/order-edits/${e}/items/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
}, As = xe;
var Ge = class extends i {
  update(e, s, t = {}) {
    let r = `/admin/orders/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  retrieve(e, s, t = {}) {
    let r = `/admin/orders/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/orders/${e}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/orders";
    return e && (t = `/admin/orders?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  complete(e, s = {}) {
    let t = `/admin/orders/${e}/complete`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  capturePayment(e, s = {}) {
    let t = `/admin/orders/${e}/capture`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  refundPayment(e, s, t = {}) {
    let r = `/admin/orders/${e}/refund`;
    return this.client.request("POST", r, s, {}, t);
  }
  createFulfillment(e, s, t = {}) {
    let r = `/admin/orders/${e}/fulfillment`;
    return this.client.request("POST", r, s, {}, t);
  }
  cancelFulfillment(e, s, t = {}) {
    let r = `/admin/orders/${e}/fulfillments/${s}/cancel`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  cancelSwapFulfillment(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/swaps/${s}/fulfillments/${t}/cancel`;
    return this.client.request("POST", n, undefined, {}, r);
  }
  cancelClaimFulfillment(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/claims/${s}/fulfillments/${t}/cancel`;
    return this.client.request("POST", n, undefined, {}, r);
  }
  createShipment(e, s, t = {}) {
    let r = `/admin/orders/${e}/shipment`;
    return this.client.request("POST", r, s, {}, t);
  }
  requestReturn(e, s, t = {}) {
    let r = `/admin/orders/${e}/return`;
    return this.client.request("POST", r, s, {}, t);
  }
  cancel(e, s = {}) {
    let t = `/admin/orders/${e}/cancel`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  addShippingMethod(e, s, t = {}) {
    let r = `/admin/orders/${e}/shipping-methods`;
    return this.client.request("POST", r, s, {}, t);
  }
  archive(e, s = {}) {
    let t = `/admin/orders/${e}/archive`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  createSwap(e, s, t = {}) {
    let r = `/admin/orders/${e}/swaps`;
    return this.client.request("POST", r, s, {}, t);
  }
  cancelSwap(e, s, t = {}) {
    let r = `/admin/orders/${e}/swaps/${s}/cancel`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  fulfillSwap(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/swaps/${s}/fulfillments`;
    return this.client.request("POST", n, t, {}, r);
  }
  createSwapShipment(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/swaps/${s}/shipments`;
    return this.client.request("POST", n, t, {}, r);
  }
  processSwapPayment(e, s, t = {}) {
    let r = `/admin/orders/${e}/swaps/${s}/process-payment`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  createClaim(e, s, t = {}) {
    let r = `/admin/orders/${e}/claims`;
    return this.client.request("POST", r, s, {}, t);
  }
  cancelClaim(e, s, t = {}) {
    let r = `/admin/orders/${e}/claims/${s}/cancel`;
    return this.client.request("POST", r, undefined, {}, t);
  }
  updateClaim(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/claims/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  fulfillClaim(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/claims/${s}/fulfillments`;
    return this.client.request("POST", n, t, {}, r);
  }
  createClaimShipment(e, s, t, r = {}) {
    let n = `/admin/orders/${e}/claims/${s}/shipments`;
    return this.client.request("POST", n, t, {}, r);
  }
}, qs = Ge;
var De = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/payment-collections/${e}`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  update(e, s, t = {}) {
    let r = `/admin/payment-collections/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/payment-collections/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  markAsAuthorized(e, s = {}) {
    let t = `/admin/payment-collections/${e}/authorize`;
    return this.client.request("POST", t, undefined, {}, s);
  }
}, Ss = De;
var be = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/payments/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/payments/${e}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  capturePayment(e, s = {}) {
    let t = `/admin/payments/${e}/capture`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  refundPayment(e, s, t = {}) {
    let r = `/admin/payments/${e}/refund`;
    return this.client.request("POST", r, s, {}, t);
  }
}, Ts = be;
var ve = class extends i {
  create(e, s = {}) {
    let t = "/admin/price-lists";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/price-lists/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/price-lists/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/price-lists/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/price-lists/";
    return e && (t = `/admin/price-lists?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  listProducts(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/products`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/price-lists/${e}/products?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  addPrices(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/prices/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  deletePrices(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/prices/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
  deleteProductPrices(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/products/${s}/prices`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  deleteVariantPrices(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/variants/${s}/prices`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  deleteProductsPrices(e, s, t = {}) {
    let r = `/admin/price-lists/${e}/products/prices/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
}, Os = ve;
var we = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/product-categories/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `${r}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  create(e, s = {}) {
    let t = "/admin/product-categories";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/product-categories/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/product-categories";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  delete(e, s = {}) {
    let t = `/admin/product-categories/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  removeProducts(e, s, t = {}) {
    let r = `/admin/product-categories/${e}/products/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
  addProducts(e, s, t = {}) {
    let r = `/admin/product-categories/${e}/products/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
}, Es = we;
var Ie = class extends i {
  list(e) {
    let s = "/admin/product-tags";
    return e && (s = `/admin/product-tags?${c.stringify(e)}`), this.client.request("GET", s);
  }
}, Ls = Ie;
var Be = class extends i {
  list(e, s = {}) {
    let t = "/admin/product-types";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, xs = Be;
var ke = class extends i {
  create(e, s = {}) {
    let t = "/admin/products/";
    return this.client.request("POST", t, e, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/products/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/products/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/products/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/products";
    return e && (t = `/admin/products?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  listTypes(e = {}) {
    let s = "/admin/products/types";
    return this.client.request("GET", s, undefined, {}, e);
  }
  listTags(e = {}) {
    let s = "/admin/products/tag-usage";
    return this.client.request("GET", s, undefined, {}, e);
  }
  setMetadata(e, s, t = {}) {
    let r = `/admin/products/${e}/metadata`;
    return this.client.request("POST", r, s, {}, t);
  }
  createVariant(e, s, t = {}) {
    let r = `/admin/products/${e}/variants`;
    return this.client.request("POST", r, s, {}, t);
  }
  updateVariant(e, s, t, r = {}) {
    let n = `/admin/products/${e}/variants/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  deleteVariant(e, s, t = {}) {
    let r = `/admin/products/${e}/variants/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  listVariants(e, s, t = {}) {
    let r = `/admin/products/${e}/variants`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/products/${e}/variants?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  addOption(e, s, t = {}) {
    let r = `/admin/products/${e}/options`;
    return this.client.request("POST", r, s, {}, t);
  }
  updateOption(e, s, t, r = {}) {
    let n = `/admin/products/${e}/options/${s}`;
    return this.client.request("POST", n, t, {}, r);
  }
  deleteOption(e, s, t = {}) {
    let r = `/admin/products/${e}/options/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
}, Ds = ke;
var Ue = class extends i {
  retrieve(e, s = {}) {
    let t = `/admin/publishable-api-keys/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/publishable-api-keys";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/publishable-api-keys";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/publishable-api-keys/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/publishable-api-keys/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  revoke(e, s = {}) {
    let t = `/admin/publishable-api-keys/${e}/revoke`;
    return this.client.request("POST", t, {}, {}, s);
  }
  addSalesChannelsBatch(e, s, t = {}) {
    let r = `/admin/publishable-api-keys/${e}/sales-channels/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  deleteSalesChannelsBatch(e, s, t = {}) {
    let r = `/admin/publishable-api-keys/${e}/sales-channels/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
  listSalesChannels(e, s, t = {}) {
    let r = `/admin/publishable-api-keys/${e}/sales-channels`;
    if (s) {
      let n = c.stringify(s);
      r += `?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
}, vs = Ue;
var Ke = class extends i {
  create(e, s = {}) {
    let t = "/admin/regions";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/regions/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/regions/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/regions/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/regions";
    return e && (t = `/admin/regions?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  addCountry(e, s, t = {}) {
    let r = `/admin/regions/${e}/countries`;
    return this.client.request("POST", r, s, {}, t);
  }
  deleteCountry(e, s, t = {}) {
    let r = `/admin/regions/${e}/countries/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  addFulfillmentProvider(e, s, t = {}) {
    let r = `/admin/regions/${e}/fulfillment-providers`;
    return this.client.request("POST", r, s, {}, t);
  }
  deleteFulfillmentProvider(e, s, t = {}) {
    let r = `/admin/regions/${e}/fulfillment-providers/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
  retrieveFulfillmentOptions(e, s = {}) {
    let t = `/admin/regions/${e}/fulfillment-options`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  addPaymentProvider(e, s, t = {}) {
    let r = `/admin/regions/${e}/payment-providers`;
    return this.client.request("POST", r, s, {}, t);
  }
  deletePaymentProvider(e, s, t = {}) {
    let r = `/admin/regions/${e}/payment-providers/${s}`;
    return this.client.request("DELETE", r, undefined, {}, t);
  }
}, ws = Ke;
var Ne = class extends i {
  retrieve(e, s = {}) {
    let t = `/admin/reservations/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/reservations";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/reservations";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/reservations/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/reservations/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
}, Is = Ne;
var Ve = class extends i {
  create(e, s = {}) {
    let t = "/admin/return-reasons";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/return-reasons/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/return-reasons/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/return-reasons/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e = {}) {
    let s = "/admin/return-reasons";
    return this.client.request("GET", s, undefined, {}, e);
  }
}, Bs = Ve;
var Fe = class extends i {
  cancel(e, s = {}) {
    let t = `/admin/returns/${e}/cancel`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  receive(e, s, t = {}) {
    let r = `/admin/returns/${e}/receive`;
    return this.client.request("POST", r, s, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/returns/";
    return e && (t = `/admin/returns?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, ks = Fe;
var Je = class extends i {
  retrieve(e, s = {}) {
    let t = `/admin/sales-channels/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/sales-channels";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/sales-channels/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/sales-channels";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
  delete(e, s = {}) {
    let t = `/admin/sales-channels/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  removeProducts(e, s, t = {}) {
    let r = `/admin/sales-channels/${e}/products/batch`;
    return this.client.request("DELETE", r, s, {}, t);
  }
  addProducts(e, s, t = {}) {
    let r = `/admin/sales-channels/${e}/products/batch`;
    return this.client.request("POST", r, s, {}, t);
  }
  addLocation(e, s, t = {}) {
    let r = `/admin/sales-channels/${e}/stock-locations`;
    return this.client.request("POST", r, s, {}, t);
  }
  removeLocation(e, s, t = {}) {
    let r = `/admin/sales-channels/${e}/stock-locations`;
    return this.client.request("DELETE", r, s, {}, t);
  }
}, Us = Je;
var Me = class extends i {
  create(e, s = {}) {
    let t = "/admin/shipping-options";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/shipping-options/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/shipping-options/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/shipping-options/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/shipping-options";
    return e && (t = `/admin/shipping-options?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, Ks = Me;
var ze = class extends i {
  create(e, s = {}) {
    let t = "/admin/shipping-profiles/";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/shipping-profiles/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/shipping-profiles/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/shipping-profiles/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e = {}) {
    let s = "/admin/shipping-profiles/";
    return this.client.request("GET", s, undefined, {}, e);
  }
}, Ns = ze;
var He = class extends i {
  create(e, s = {}) {
    let t = "/admin/stock-locations";
    return this.client.request("POST", t, e, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/stock-locations/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/stock-locations/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/stock-locations/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/stock-locations";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, Vs = He;
var je = class extends i {
  update(e, s = {}) {
    let t = "/admin/store/";
    return this.client.request("POST", t, e, {}, s);
  }
  addCurrency(e, s = {}) {
    let t = `/admin/store/${e}`;
    return this.client.request("POST", t, undefined, {}, s);
  }
  deleteCurrency(e, s = {}) {
    let t = `/admin/store/currencies/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  retrieve(e = {}) {
    let s = "/admin/store/";
    return this.client.request("GET", s, undefined, {}, e);
  }
  listPaymentProviders(e = {}) {
    let s = "/admin/store/payment-providers";
    return this.client.request("GET", s, undefined, {}, e);
  }
  listTaxProviders(e = {}) {
    let s = "/admin/store/tax-providers";
    return this.client.request("GET", s, undefined, {}, e);
  }
}, Fs = je;
var _e = class extends i {
  retrieve(e, s = {}) {
    let t = `/admin/swaps/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/swaps/";
    return e && (t = `/admin/swaps?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, Js = _e;
var We = class extends i {
  retrieve(e, s, t = {}) {
    let r = `/admin/tax-rates/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/tax-rates/${e}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
  }
  list(e, s = {}) {
    let t = "/admin/tax-rates";
    return e && (t = `/admin/tax-rates?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s, t = {}) {
    let r = "/admin/tax-rates";
    return s && (r = `/admin/tax-rates?${c.stringify(s)}`), this.client.request("POST", r, e, {}, t);
  }
  update(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  addProducts(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/products/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/products/batch?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  addProductTypes(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/product-types/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/product-types/batch?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  addShippingOptions(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/shipping-options/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/shipping-options/batch?${a}`;
    }
    return this.client.request("POST", n, s, {}, r);
  }
  removeProducts(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/products/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/products/batch?${a}`;
    }
    return this.client.request("DELETE", n, s, {}, r);
  }
  removeProductTypes(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/product-types/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/product-types/batch?${a}`;
    }
    return this.client.request("DELETE", n, s, {}, r);
  }
  removeShippingOptions(e, s, t, r = {}) {
    let n = `/admin/tax-rates/${e}/shipping-options/batch`;
    if (t) {
      let a = c.stringify(t);
      n = `/admin/tax-rates/${e}/shipping-options/batch?${a}`;
    }
    return this.client.request("DELETE", n, s, {}, r);
  }
  delete(e, s = {}) {
    let t = `/admin/tax-rates/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
}, Ms = We;
var Qe = class extends i {
  constructor() {
    super(...arguments);
    this.headers = { "Content-Type": "multipart/form-data" };
  }
  create(s) {
    let t = "/admin/uploads", r = this._createPayload(s);
    return this.client.request("POST", t, r, {}, this.headers);
  }
  createProtected(s) {
    let t = "/admin/uploads/protected", r = this._createPayload(s);
    return this.client.request("POST", t, r, {}, this.headers);
  }
  delete(s, t = {}) {
    let r = "/admin/uploads";
    return this.client.request("DELETE", r, s, {}, t);
  }
  getPresignedDownloadUrl(s, t = {}) {
    let r = "/admin/uploads/download-url";
    return this.client.request("POST", r, s, {}, t);
  }
  _createPayload(s) {
    let t = new FormData();
    return Array.isArray(s) ? s.forEach((r) => t.append("files", r)) : t.append("files", s), t;
  }
}, zs = Qe;
var Xe = class extends i {
  sendResetPasswordToken(e, s = {}) {
    let t = "/admin/users/password-token";
    return this.client.request("POST", t, e, {}, s);
  }
  resetPassword(e, s = {}) {
    let t = "admin/users/reset-password";
    return this.client.request("POST", t, e, {}, s);
  }
  retrieve(e, s = {}) {
    let t = `/admin/users/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  create(e, s = {}) {
    let t = "/admin/users";
    return this.client.request("POST", t, e, {}, s);
  }
  update(e, s, t = {}) {
    let r = `/admin/users/${e}`;
    return this.client.request("POST", r, s, {}, t);
  }
  delete(e, s = {}) {
    let t = `/admin/users/${e}`;
    return this.client.request("DELETE", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/users";
    if (e) {
      let r = c.stringify(e);
      t += `?${r}`;
    }
    return this.client.request("GET", t, undefined, {}, s);
  }
}, Hs = Xe;
var Ye = class extends i {
  list(e, s = {}) {
    let t = "/admin/variants";
    return e && (t = `/admin/variants?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
  retrieve(e, s, t = {}) {
    let r = `/admin/variants/${e}`;
    return s && (r = `/admin/variants?${c.stringify(s)}`), this.client.request("GET", r, undefined, {}, t);
  }
  getInventory(e, s = {}) {
    let t = `/admin/variants/${e}/inventory`;
    return this.client.request("GET", t, undefined, {}, s);
  }
}, _s = Ye;
var f = class extends i {
  constructor() {
    super(...arguments);
    this.auth = new rs(this.client);
    this.batchJobs = new is(this.client);
    this.customers = new cs(this.client);
    this.customerGroups = new ms(this.client);
    this.discounts = new us(this.client);
    this.currencies = new as(this.client);
    this.collections = new os(this.client);
    this.draftOrders = new ps(this.client);
    this.giftCards = new Rs(this.client);
    this.invites = new Ps(this.client);
    this.inventoryItems = new ls(this.client);
    this.notes = new hs(this.client);
    this.priceLists = new Os(this.client);
    this.products = new Ds(this.client);
    this.productTags = new Ls(this.client);
    this.productTypes = new xs(this.client);
    this.users = new Hs(this.client);
    this.returns = new ks(this.client);
    this.orders = new qs(this.client);
    this.orderEdits = new As(this.client);
    this.publishableApiKeys = new vs(this.client);
    this.returnReasons = new Bs(this.client);
    this.variants = new _s(this.client);
    this.salesChannels = new Us(this.client);
    this.swaps = new Js(this.client);
    this.shippingProfiles = new Ns(this.client);
    this.stockLocations = new Vs(this.client);
    this.store = new Fs(this.client);
    this.shippingOptions = new Ks(this.client);
    this.regions = new ws(this.client);
    this.reservations = new Is(this.client);
    this.notifications = new gs(this.client);
    this.taxRates = new Ms(this.client);
    this.uploads = new zs(this.client);
    this.paymentCollections = new Ss(this.client);
    this.payments = new Ts(this.client);
    this.productCategories = new Es(this.client);
    this.custom = new ds(this.client);
  }
};
var Ze = class {
  constructor(e) {
    this.client = new ss(e), this.admin = new f(this.client), this.auth = new G(this.client), this.carts = new w(this.client), this.customers = new K(this.client), this.errors = new m(), this.orders = new z(this.client), this.orderEdits = new J(this.client), this.products = new re(this.client), this.productTypes = new Z(this.client), this.regions = new ie(this.client), this.returnReasons = new ae(this.client), this.returns = new me(this.client), this.shippingOptions = new ue(this.client), this.swaps = new Re(this.client), this.collections = new B(this.client), this.giftCards = new V(this.client), this.paymentMethods = new l(this.client), this.paymentCollections = new j(this.client), this.productTags = new X(this.client), this.productCategories = new W(this.client);
  }
  setPublishableKey(e) {
    P.registerPublishableApiKey(e);
  }
}, ua = Ze;
const plugin_iGFVkagQDO = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const { medusa: config } = (/* @__PURE__ */ useRuntimeConfig()).public;
  const medusaClient = new ua(config);
  nuxtApp.provide("medusa", medusaClient);
});
const prerender_server_LXx1wM9sKF = /* @__PURE__ */ defineNuxtPlugin(async () => {
  {
    return;
  }
});
const _1_absoluteImageUrls_server_zDt3Q5SdZ4 = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  setup() {
    const head = injectHead();
    if (!head)
      return;
    const resolver2 = createSitePathResolver({
      withBase: true,
      absolute: true,
      canonical: true
    });
    head.use({
      hooks: {
        "tags:resolve": async ({ tags }) => {
          for (const tag of tags) {
            if (tag.tag !== "meta")
              continue;
            if (tag.props.property !== "og:image:url" && tag.props.property !== "og:image" && tag.props.name !== "twitter:image")
              continue;
            if (typeof tag.props.content !== "string" || !tag.props.content.trim() || tag.props.content.startsWith("http") || tag.props.content.startsWith("//"))
              continue;
            tag.props.content = unref(resolver2(tag.props.content));
          }
        }
      }
    });
  }
});
const _0_routeRules_server_3qJ8nyBJBb = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  async setup() {
    const head = injectHead();
    if (!head)
      return;
    const event = useRequestEvent();
    if (event.context._nitro.routeRules.head)
      head.push(event.context._nitro.routeRules.head, { mode: "server", tagPriority: -9 });
    if (event.context._nitro.routeRules.seoMeta) {
      const meta = unpackMeta({ ...event.context._nitro.routeRules.seoMeta, tagPriority: -9 });
      head.push({
        meta
      }, { mode: "server" });
    }
  }
});
function applyDefaults(i18n) {
  const { canonicalQueryWhitelist } = (/* @__PURE__ */ useRuntimeConfig()).public["seo-utils"];
  const siteConfig = useSiteConfig();
  const route = useRoute();
  const resolveUrl = createSitePathResolver({ withBase: true, absolute: true });
  const canonicalUrl = computed(() => {
    const { query } = route;
    const url = resolveUrl(route.path || "/").value || route.path;
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([key]) => canonicalQueryWhitelist.includes(key))
    );
    return Object.keys(filteredQuery).length ? `${url}?${stringifyQuery(filteredQuery)}` : url;
  });
  const minimalPriority = {
    // give nuxt.config values higher priority
    tagPriority: 101
  };
  useHead({
    htmlAttrs: { lang: i18n.locale },
    templateParams: { site: siteConfig, siteName: siteConfig.name || "" },
    titleTemplate: "%s %separator %siteName",
    link: [{ rel: "canonical", href: () => canonicalUrl.value }]
  }, minimalPriority);
  const seoMeta = {
    ogType: "website",
    ogUrl: () => canonicalUrl.value,
    ogLocale: () => i18n.locale.value,
    ogSiteName: siteConfig.name
  };
  if (siteConfig.description)
    seoMeta.description = siteConfig.description;
  if (siteConfig.twitter) {
    const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter : `@${siteConfig.twitter}`;
    seoMeta.twitterCreator = id;
    seoMeta.twitterSite = id;
  }
  useSeoMeta(seoMeta, minimalPriority);
}
const defaults_M8ptihKv0z = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:defaults",
  order: 999,
  env: {
    islands: false
  },
  setup() {
    const siteConfig = useSiteConfig();
    const locale = ref(siteConfig.currentLocale || siteConfig.defaultLocale);
    applyDefaults({
      locale
    });
  }
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin$1,
  _0_siteConfig_jtc2qNDx4l,
  revive_payload_server_eJ33V7gbc6,
  plugin,
  components_plugin_KR1HBZs4kY,
  siteConfig_JRId4KOeUL,
  inferSeoMetaPlugin_JSh5nGhzCz,
  titles_eoILE7jqvj,
  defaults_ejC916ejE3,
  init_8zxuXEdLTw,
  og_image_canonical_urls_server_QnQwHpoQ3t,
  route_rule_og_image_server_svhvDKOpur,
  robot_meta_server_8htXH4OkuR,
  plugin_iGFVkagQDO,
  prerender_server_LXx1wM9sKF,
  _1_absoluteImageUrls_server_zDt3Q5SdZ4,
  _0_routeRules_server_3qJ8nyBJBb,
  defaults_M8ptihKv0z
];
const layouts = {
  default: defineAsyncComponent(() => import('./default-DJyAhZTi.mjs').then((m2) => m2.default || m2))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h$1(layouts[props.name], props.layoutProps, context.slots);
  }
});
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h$1(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h$1(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || undefined,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? undefined : _b.call(_a);
      }
      return h$1(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const useFormStore = defineStore("form", () => {
  const formData = reactive({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    postalCode: ""
  });
  const gdpr = ref(false);
  const submitted = ref(false);
  const $reset = () => {
    submitted.value = false;
    gdpr.value = false;
    formData.firstName = "";
    formData.lastName = "";
    formData.email = "";
    formData.street = "";
    formData.city = "";
    formData.postalCode = "";
  };
  const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(formData.email);
  });
  const isFieldInvalid = computed(() => {
    return {
      firstName: formData.firstName.trim() === "" && submitted.value,
      lastName: formData.lastName.trim() === "" && submitted.value,
      email: formData.email.trim() === "" && submitted.value,
      street: formData.street.trim() === "" && submitted.value,
      city: formData.city.trim() === "" && submitted.value,
      postalCode: formData.postalCode.trim() === "" && submitted.value
    };
  });
  const isFormEmpty = computed(() => {
    return !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim();
  });
  const isFormValid = computed(() => {
    return !isFormEmpty.value && isValidEmail.value;
  });
  const updateFormField = (field, value) => {
    formData[field] = value;
  };
  const submitForm = () => {
    submitted.value = true;
    if (!isFormValid.value) {
      alert("Bitte alle Felder ausfüllen und auf gültige Email-Adresse prüfen!");
      return;
    }
    if (!gdpr.value) {
      alert("Bitte Datenschutzerklärung akzeptieren!");
      return;
    }
  };
  return {
    formData,
    gdpr,
    submitted,
    isFieldInvalid,
    isFormEmpty,
    isFormValid,
    updateFormField,
    submitForm,
    isValidEmail,
    $reset
  };
});
const useMedusaClient = () => {
  const nuxtApp = useNuxtApp();
  const { medusa: config } = (/* @__PURE__ */ useRuntimeConfig()).public;
  if (config.global)
    return nuxtApp.$medusa;
  if (!nuxtApp._medusaClient) {
    nuxtApp._medusaClient = new ua(config);
  }
  return nuxtApp._medusaClient;
};
const useProductStore = defineStore("products", () => {
  const products = ref(null);
  const storeCart = ref(null);
  const $resetCart = () => {
    storeCart.value = null;
  };
  const fetchProducts = async () => {
    if (!storeCart || !storeCart.value) {
      await createCart();
    }
    if (storeCart && storeCart.value) {
      try {
        const productsList = await useMedusaClient().products.list({
          cart_id: storeCart.value.id,
          region_id: storeCart.value.region_id,
          currency_code: "eur"
        });
        products.value = productsList.products;
      } catch (error) {
        console.log(error);
      }
    }
  };
  const createCart = async () => {
    const client = useMedusaClient();
    const cart_id = localStorage.getItem("cart_id");
    if (cart_id) {
      try {
        const { cart } = await client.carts.retrieve(cart_id);
        storeCart.value = cart;
      } catch (error) {
        localStorage.removeItem("cart_id");
        createCart();
      }
    } else {
      const { regions } = await client.regions.list();
      const { cart } = await client.carts.create({ region_id: regions[0].id });
      localStorage.setItem("cart_id", cart.id);
    }
  };
  const addToCart = async (variant_id, metadata) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      try {
        const { cart, response } = await client.carts.lineItems.create(storeCart.value.id, {
          variant_id,
          quantity: 1,
          metadata
        });
        storeCart.value = cart;
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };
  const removeFromCart = async (line_id) => {
    const client = useMedusaClient();
    if (storeCart.value) {
      const { cart } = await client.carts.lineItems.delete(storeCart.value.id, line_id);
      storeCart.value = cart;
    }
  };
  const completeCart = async () => {
    const client = useMedusaClient();
    const formStore = useFormStore();
    if (!storeCart.value) {
      return;
    }
    if (formStore.isFormValid) {
      const { cart } = await client.carts.update(storeCart.value.id, {
        email: formStore.formData.email,
        shipping_address: {
          first_name: formStore.formData.firstName,
          last_name: formStore.formData.lastName,
          address_1: formStore.formData.street,
          address_2: "",
          city: formStore.formData.city,
          postal_code: formStore.formData.postalCode,
          country_code: "at",
          phone: ""
        }
      });
      storeCart.value = cart;
    }
    const { shipping_options } = await client.shippingOptions.listCartOptions(storeCart.value.id);
    console.log(shipping_options, "shipping options");
    if (shipping_options[0] && shipping_options[0].id) {
      const { cart } = await client.carts.addShippingMethod(storeCart.value.id, { option_id: shipping_options[0].id });
      storeCart.value = cart;
    }
    const { cart: updatedCart } = await client.carts.createPaymentSessions(storeCart.value.id);
    storeCart.value = updatedCart;
    console.log(storeCart.value.payment_sessions, "payment sessions");
    if (storeCart.value.payment_sessions[0] && storeCart.value.payment_sessions[0].id) {
      const { cart } = await client.carts.setPaymentSession(storeCart.value.id, { provider_id: "manual" });
      storeCart.value = cart;
    }
    const { type, data } = await client.carts.complete(storeCart.value.id);
    console.log(type, data);
  };
  return { products, fetchProducts, storeCart, createCart, addToCart, removeFromCart, completeCart, $resetCart };
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i2) => `<span class="stack${i2.internal ? " internal" : ""}">${i2.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = undefined;
    const _Error404 = defineAsyncComponent(() => import('./error-404-D8l5TN2G.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-DNX443da.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-0g8RoiUV.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? undefined : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { LayoutMetaSymbol as L, PageRouteSymbol as P, _wrapIf as _, useProductStore as a, useFormStore as b, createError as c, useRequestEvent as d, entry$1 as default, useNuxtApp as e, useRuntimeConfig as f, generateRouteKey$1 as g, appPageTransition as h, injectHead as i, appKeepalive as j, useRouter as k, navigateTo as l, useOgImageRuntimeConfig as m, nuxtLinkDefaults as n, useSiteConfig as o, resolveRouteObject as r, storeToRefs as s, toArray$1 as t, useHead as u, wrapInKeepAlive as w };
//# sourceMappingURL=server.mjs.map
