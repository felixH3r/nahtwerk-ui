import { version, ref, watchEffect, watch, getCurrentInstance, h as h$1, defineComponent, provide, createElementBlock, toRaw, computed, isRef, isReactive, toRef, inject, unref, Suspense, nextTick, mergeProps, Transition, useSSRContext, hasInjectionContext, createApp, effectScope, shallowReactive, reactive, getCurrentScope, defineAsyncComponent, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, onScopeDispose, shallowRef, isReadonly, toRefs, markRaw, isShallow, toValue } from 'vue';
import { $ as $fetch, F as baseURL, G as hasProtocol, I as isScriptProtocol, J as joinURL, K as withQuery, c as createError$1, L as defu, M as sanitizeStatusCode, N as getContext, O as createHooks, P as withoutTrailingSlash, Q as titleCase, R as toRouteMatcher, S as createRouter$1, T as camelCase, A as parseURL, U as withoutBase, V as stringifyQuery, W as withLeadingSlash, X as withBase, w as withTrailingSlash } from '../nitro/nitro.mjs';
import { CapoPlugin, getActiveHead } from 'unhead';
import { defineHeadPlugin, composableNames, unpackMeta } from '@unhead/shared';
import { useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { InferSeoMetaPlugin } from '@unhead/addons';
import { defineWebSite, defineWebPage, SchemaOrgUnheadPlugin } from '@unhead/schema-org/vue';
import { parse, stringify } from 'devalue';
import Xs from 'axios';
import * as h from 'retry-axios';
import c from 'qs';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import crypto from 'crypto';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
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
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(appName = appId) {
  return getContext(appName, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _name: appId,
    _scope: effectScope(),
    provide: undefined,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.12.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
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
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
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
  const nuxtAppCtx = getNuxtAppCtx(nuxt._name);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(appName) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? undefined : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(appName).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(appName) {
  const nuxtAppInstance = tryUseNuxtApp(appName);
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
        const encodedLoc = location2.replace(/"/g, "%22");
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
defineHeadPlugin({
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
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
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
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
const _routes = [
  {
    name: "about-me",
    path: "/about-me",
    component: () => import('./about-me-CeJoAII_.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "danke",
    path: "/danke",
    component: () => import('./danke-CpXfzm0w.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "datenschutz",
    path: "/datenschutz",
    component: () => import('./datenschutz-DnAAGybR.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "impressum",
    path: "/impressum",
    component: () => import('./impressum-DIo2Pk-G.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-B5kuIUa3.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "products-productTitle",
    path: "/products/:productTitle()",
    component: () => import('./_productTitle_-CV-9K7RL.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "shop",
    path: "/shop",
    component: () => import('./shop-Bq4BfbbR.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "warenkorb",
    path: "/warenkorb",
    component: () => import('./warenkorb-CG7unFzY.mjs').then((m2) => m2.default || m2)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h$1(component, props, slots) : (_a = slots.default) == null ? undefined : _a.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? undefined : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
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
      return Number.parseFloat(getComputedStyle(elem).scrollMarginTop);
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
  useNuxtApp();
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
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
    var _a, _b, _c, _d;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? undefined : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes2 = ((_b = routerOptions.routes) == null ? undefined : _b.call(routerOptions, _routes)) ?? _routes;
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
      var _a2, _b2, _c2, _d2;
      if (((_b2 = (_a2 = to.matched[0]) == null ? undefined : _a2.components) == null ? undefined : _b2.default) === ((_d2 = (_c2 = from.matched[0]) == null ? undefined : _c2.components) == null ? undefined : _d2.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_c = nuxtApp.ssrContext) == null ? undefined : _c.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? undefined : failure.type) === 4) {
          return;
        }
        if (to.matched.length === 0) {
          await nuxtApp.runWithContext(() => showError(createError$1({
            statusCode: 404,
            fatal: false,
            statusMessage: `Page not found: ${to.fullPath}`,
            data: {
              path: to.fullPath
            }
          })));
        } else if (to.redirectedFrom && to.fullPath !== initialURL) {
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
    if ((_d = nuxtApp.ssrContext) == null ? undefined : _d.islandContext) {
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
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
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
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_2, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? undefined : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
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
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
{
  reducers.Island = (data) => data && (data == null ? undefined : data.__nuxt_island);
}
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
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
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
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
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
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
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
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
    const rawStore = toRaw(store);
    const refs = {};
    for (const key in rawStore) {
      const value = rawStore[key];
      if (value.effect) {
        refs[key] = // ...
        computed({
          get: () => store[key],
          set(value2) {
            store[key] = value2;
          }
        });
      } else if (isRef(value) || isReactive(value)) {
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
  var _a;
  let stack;
  stack = (_a = useRequestEvent()) == null ? undefined : _a.context.siteConfig.get(defu({ resolveRefs: true }, options));
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
    const err = useError();
    const title = computed(() => {
      var _a, _b, _c;
      if ([404, 500].includes((_a = err.value) == null ? undefined : _a.statusCode)) {
        return `${err.value.statusCode} - ${err.value.message}`;
      }
      if (typeof ((_b = route.meta) == null ? undefined : _b.title) === "string")
        return (_c = route.meta) == null ? undefined : _c.title;
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
  return defu(runtimeConfig["nuxt-schema-org"], {
    scriptAttributes: {}
  });
}
function useSchemaOrg(input) {
  const config = useSchemaOrgConfig();
  const script = {
    type: "application/ld+json",
    key: "schema-org-graph",
    nodes: input,
    tagPriority: "high",
    ...config.scriptAttributes
  };
  {
    return useServerHead({
      script: [script]
    });
  }
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
  var _a;
  {
    e = e || useRequestEvent();
    return ((_a = e == null ? undefined : e.context) == null ? undefined : _a.siteConfigNitroOrigin) || "";
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
      identityPayload = defu(identity, identityPayload);
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
const componentNames = [{ "hash": "i0Vxmj8bqg", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "tBHg51xiAt", "pascalName": "Frame", "kebabName": "frame", "category": "community", "credits": "@arashsheyda <https://github.com/arashsheyda>" }, { "hash": "Sqc3OTP2KQ", "pascalName": "Nuxt", "kebabName": "nuxt", "category": "community", "credits": "NuxtLabs <https://nuxtlabs.com/>" }, { "hash": "Zi7JFRq3ez", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "category": "community", "credits": "Nuxt SEO <https://nuxtseo.com/>" }, { "hash": "q432NYEB0T", "pascalName": "Pergel", "kebabName": "pergel", "category": "community", "credits": "Pergel <https://nuxtlabs.com/>" }, { "hash": "6bQOH7FKu2", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "wt558K6QyQ", "pascalName": "UnJs", "kebabName": "un-js", "category": "community", "credits": "UnJS <https://unjs.io/>" }, { "hash": "6RdQZcuwZZ", "pascalName": "Wave", "kebabName": "wave", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "gaB1TrbtTl", "pascalName": "WithEmoji", "kebabName": "with-emoji", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }];
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
  const _props = defu(options.props, Object.fromEntries(
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
  const options = defu(_options, useOgImageRuntimeConfig().defaults);
  const path = joinURL("/", baseURL2, `__og-image__/${"image"}`, pagePath, `og.${options.extension}`);
  if (Object.keys(options._query || {}).length) {
    return withQuery(path, options._query);
  }
  return path;
}
function useOgImageRuntimeConfig() {
  const c2 = /* @__PURE__ */ useRuntimeConfig();
  return {
    ...c2["nuxt-og-image"],
    app: {
      baseURL: c2.app.baseURL
    }
  };
}
function createOgImageMeta(src, input, resolvedOptions, ssrContext) {
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
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
          var _a;
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
              if (!tag.props.content) {
                tag.props = {};
                continue;
              }
              if (!((_a = tag.props.content) == null ? undefined : _a.startsWith("https"))) {
                await nuxtApp.runWithContext(() => {
                  tag.props.content = toValue(withSiteUrl(tag.props.content, {
                    withBase: true
                  }));
                });
              }
            } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
              tag.innerHTML = stringify(defu(overrides, parse(tag.innerHTML)));
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
    let routeRules = defu({}, ..._routeRulesMatcher.matchAll(
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
    routeRules = normaliseOptions(defu((_f = (_e2 = (_d = nuxtApp.ssrContext) == null ? undefined : _d.event.context._nitro) == null ? undefined : _e2.routeRules) == null ? undefined : _f.ogImage, routeRules, {
      component: defaults.component
    }));
    const resolvedOptions = normaliseOptions(defu(routeRules, defaults));
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
  }
  getJwt(e) {
  }
}, u = new O();
var Zs = { "/admin/auth": "POST", "/admin/users/password-token": "POST", "/admin/users/reset-password": "POST", "/admin/invites/accept": "POST" }, es = { maxRetries: 0, baseUrl: "http://localhost:9000" }, $ = class {
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
    return e.startsWith("/admin") && Zs[e] !== s;
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
    let s = Xs.create({ baseURL: e.baseUrl, adapter: e.axiosAdapter });
    return h.attach(s), s.defaults.raxConfig = { instance: s, retry: e.maxRetries, backoffType: "exponential", shouldRetry: (t) => {
      let r = h.getConfig(t);
      return r ? this.shouldRetryCondition(t, r.currentRetryAttempt ?? 1, r.retry ?? 3) : false;
    } }, s;
  }
  async request(e, s, t = {}, r = {}, n = {}) {
    n = { ...this.config.customHeaders, ...n };
    let a = { method: e, withCredentials: true, url: s, json: true, headers: this.setHeaders(r, e, s, n) };
    ["POST", "DELETE"].includes(e) && (a.data = t);
    let { data: d, ...Qs } = await this.axiosClient(a);
    return { ...d, response: Qs };
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
  retrieve(e, s, t = {}) {
    let r = `/admin/regions/${e}`;
    if (s) {
      let n = c.stringify(s);
      r = `/admin/regions/${e}?${n}`;
    }
    return this.client.request("GET", r, undefined, {}, t);
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
}, Is = Ke;
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
}, Bs = Ne;
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
}, ks = Ve;
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
}, Us = Fe;
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
}, Ks = Je;
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
}, Ns = Me;
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
}, Vs = ze;
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
}, Fs = He;
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
}, Js = je;
var _e = class extends i {
  retrieve(e, s = {}) {
    let t = `/admin/swaps/${e}`;
    return this.client.request("GET", t, undefined, {}, s);
  }
  list(e, s = {}) {
    let t = "/admin/swaps/";
    return e && (t = `/admin/swaps?${c.stringify(e)}`), this.client.request("GET", t, undefined, {}, s);
  }
}, Ms = _e;
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
}, zs = We;
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
}, Hs = Qe;
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
}, js = Xe;
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
}, Ws = Ye;
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
    this.users = new js(this.client);
    this.returns = new Us(this.client);
    this.orders = new qs(this.client);
    this.orderEdits = new As(this.client);
    this.publishableApiKeys = new vs(this.client);
    this.returnReasons = new ks(this.client);
    this.variants = new Ws(this.client);
    this.salesChannels = new Ks(this.client);
    this.swaps = new Ms(this.client);
    this.shippingProfiles = new Vs(this.client);
    this.stockLocations = new Fs(this.client);
    this.store = new Js(this.client);
    this.shippingOptions = new Ns(this.client);
    this.regions = new Is(this.client);
    this.reservations = new Bs(this.client);
    this.notifications = new gs(this.client);
    this.taxRates = new zs(this.client);
    this.uploads = new Hs(this.client);
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
    const resolver = createSitePathResolver({
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
            tag.props.content = unref(resolver(tag.props.content));
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
      const meta = unpackMeta({ ...event.context._nitro.routeRules.seoMeta });
      head.push({
        meta
      }, { mode: "server", tagPriority: -9 });
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
  default: () => import('./default-Cr6RVSfe.mjs').then((m2) => m2.default || m2)
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h$1(LayoutComponent, props.layoutProps, context.slots);
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
    const _Error404 = defineAsyncComponent(() => import('./error-404-4VuIdfNj.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-BVUBRLud.mjs').then((r) => r.default || r));
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
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-BrOKRfEn.mjs').then((r) => r.default || r));
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

export { LayoutMetaSymbol as L, PageRouteSymbol as P, _wrapIf as _, useRequestEvent as a, useNuxtApp as b, createError as c, useRuntimeConfig as d, entry$1 as default, appPageTransition as e, appKeepalive as f, generateRouteKey$1 as g, useRouter as h, navigateTo as i, defineStore as j, ua as k, useOgImageRuntimeConfig as l, useSiteConfig as m, nuxtLinkDefaults as n, resolveRouteObject as r, storeToRefs as s, toArray$1 as t, useHead as u, wrapInKeepAlive as w };
//# sourceMappingURL=server.mjs.map
