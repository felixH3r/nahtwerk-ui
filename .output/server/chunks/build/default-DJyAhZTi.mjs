import { defineComponent, provide, shallowReactive, h, ref, inject, watch, Suspense, nextTick, Fragment, Transition, useSSRContext, mergeProps, withCtx, createVNode, unref, createTextVNode, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { K as defu } from '../nitro/nitro.mjs';
import { P as PageRouteSymbol, e as useNuxtApp, L as LayoutMetaSymbol, g as generateRouteKey$1, h as appPageTransition, j as appKeepalive, _ as _wrapIf, w as wrapInKeepAlive, t as toArray$1, a as useProductStore } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-wdF35zEx.mjs';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { f as formatPrice } from './utils-BT5Q-2h-.mjs';
import 'lru-cache';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import 'ipx';
import 'unhead';
import '@unhead/shared';
import '@unhead/addons';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: undefined
    },
    keepalive: {
      type: [Boolean, Object],
      default: undefined
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a, _b, _c, _d;
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!((_b = (_a = props.transition) != null ? _a : routeProps.route.meta.pageTransition) != null ? _b : appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = (_d = (_c = props.keepalive) != null ? _c : routeProps.route.meta.keepalive) != null ? _d : appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || undefined,
                    vnode: slots.default ? h(Fragment, undefined, slots.default(routeProps)) : routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || undefined,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray$1(prop.onAfterLeave) : undefined
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? undefined : _a.default) === (Component == null ? undefined : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const _sfc_main$6 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800" }, _attrs))}><div class="mx-auto max-w-screen-xl text-center">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img class="block w-auto h-24" src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt=""${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            class: "block w-auto h-24",
            src: "https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png",
            alt: ""
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<ul class="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "mr-4 hover:underline md:mr-6"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\xDCber mich`);
      } else {
        return [
          createTextVNode("\xDCber mich")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/impressum",
    class: "mr-4 hover:underline md:mr-6"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Impressum`);
      } else {
        return [
          createTextVNode("Impressum")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/datenschutz",
    class: "mr-4 hover:underline md:mr-6"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Datenschutz`);
      } else {
        return [
          createTextVNode("Datenschutz")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "https://www.instagram.com/nahtwerk_/",
    target: "_blank",
    class: "mr-4 hover:underline md:mr-6"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Instagram `);
      } else {
        return [
          createTextVNode(" Instagram ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">\xA9 2024 `);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Nahtwerk.`);
      } else {
        return [
          createTextVNode("Nahtwerk.")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` Alle Rechte vorbehalten.</span></div></footer>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/footer/Footer.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : undefined;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HeaderMenu",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center space-x-8" }, _attrs))}><div class="shrink-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="block w-auto h-16 dark:hidden" src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt=""${_scopeId}><img class="hidden w-auto h-8 dark:block" src="https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png" alt=""${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "block w-auto h-16 dark:hidden",
                src: "https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png",
                alt: ""
              }),
              createVNode("img", {
                class: "hidden w-auto h-8 dark:block",
                src: "https://nahtwerk-uploads.s3.amazonaws.com/Nahtwerk_logo.png",
                alt: ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><ul class="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        title: "",
        class: ["flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500", {
          "font-medium text-gray-900": unref(useRoute)().fullPath === "/"
          /* HOME */
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Home `);
          } else {
            return [
              createTextVNode(" Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="shrink-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        title: "",
        class: ["flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500", {
          "font-medium text-gray-900": unref(useRoute)().fullPath === "/shop"
          /* SHOP */
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Shop `);
          } else {
            return [
              createTextVNode(" Shop ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="shrink-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about-me",
        title: "",
        class: ["flex text-sm font-light text-gray-500 hover:text-primary-700 dark:text-white dark:hover:text-primary-500", {
          "font-medium text-gray-900": unref(useRoute)().fullPath === "/about-me"
          /* ABOUT_ME */
        }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \xDCber mich `);
          } else {
            return [
              createTextVNode(" \xDCber mich ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/HeaderMenu.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : undefined;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CartDropDownItem",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2" }, _attrs))}><div><a href="#" class="truncate text-sm font-semibold leading-none text-gray-900 dark:text-white hover:underline">${ssrInterpolate(((_a = _ctx.lineItem) == null ? undefined : _a.title) ? _ctx.lineItem.title : "Unbekannt")}</a><p class="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400">\u20AC ${ssrInterpolate(((_b = _ctx.lineItem) == null ? undefined : _b.total) ? ("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(_ctx.lineItem.total) : "0,00")}</p><p class="mt-0.5 truncate text-sm font-normal text-gray-500 dark:text-gray-400"> Gr\xF6\xDFe: ${ssrInterpolate(_ctx.lineItem.variant.title)}</p></div><div class="flex items-center justify-end gap-6"><p class="text-sm font-normal leading-none text-gray-500 dark:text-gray-400">Menge: ${ssrInterpolate((_c = _ctx.lineItem) == null ? undefined : _c.quantity)}</p><button data-tooltip-target="tooltipRemoveItem1a" type="button" class="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600"><span class="sr-only"> Entfernen </span><svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7.7-3.7a1 1 0 0 0-1.4 1.4l2.3 2.3-2.3 2.3a1 1 0 1 0 1.4 1.4l2.3-2.3 2.3 2.3a1 1 0 0 0 1.4-1.4L13.4 12l2.3-2.3a1 1 0 0 0-1.4-1.4L12 10.6 9.7 8.3Z" clip-rule="evenodd"></path></svg></button><div id="tooltipRemoveItem1a" role="tooltip" class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"> Produkt entfernen <div class="tooltip-arrow" data-popper-arrow></div></div></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/CartDropDownItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : undefined;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CartButton",
  __ssrInlineRender: true,
  setup(__props) {
    const noItems = ref(false);
    const store = useProductStore();
    const getLineItems = computed(() => {
      if (store.storeCart) {
        if (store.storeCart.items.length === 0) {
          noItems.value = true;
          return [];
        }
        noItems.value = false;
        return store.storeCart.items;
      }
      return [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><button id="myCartDropdownButton1" data-dropdown-toggle="myCartDropdown1" type="button" class="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"><span class="sr-only"> Warenkorb </span><svg class="w-5 h-5 lg:me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"></path></svg><span class="hidden font-light sm:flex">Warenkorb</span><svg class="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9-7 7-7-7"></path></svg></button><div id="myCartDropdown1" class="hidden z-10 mx-auto max-w-sm space-y-4 overflow-hidden rounded-lg bg-white p-4 antialiased shadow-lg dark:bg-gray-800">`);
      if (unref(noItems)) {
        _push(`<span class="text-sm font-medium leading-none text-gray-900 dark:text-white"> Dein Warenkorb ist leer. </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(getLineItems), (lineItem, index) => {
        _push(ssrRenderComponent(_sfc_main$4, {
          key: index,
          lineItem
        }, null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/warenkorb",
        title: "",
        class: "mb-2 me-2 inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
        role: "button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Zum Warenkorb `);
          } else {
            return [
              createTextVNode(" Zum Warenkorb ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/CartButton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "ecommerce-navbar-menu-1",
    class: "bg-white absolute w-1/2 top-12 right-5 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4 z-10"
  }, _attrs))}><ul class="text-gray-900 dark:text-white text-sm font-medium dark:text-white space-y-3"><li><a href="#" class="hover:text-primary-700 dark:hover:text-primary-500">Home</a></li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/shop",
    class: "hover:text-primary-700 dark:hover:text-primary-500"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Shop`);
      } else {
        return [
          createTextVNode("Shop")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/about-me",
    class: "hover:text-primary-700 dark:hover:text-primary-500"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\xDCber mich`);
      } else {
        return [
          createTextVNode("\xDCber mich")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/HeaderMobileMenu.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const HeaderMobileMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MainHeader",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-gray-800 antialiased" }, _attrs))}><div class="max-w-screen-xl px-4 mx-auto 2xl:px-0 pt-1"><div class="flex items-center justify-between z-10">`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`<div class="flex items-center lg:space-x-2">`);
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(`<button type="button" data-collapse-toggle="ecommerce-navbar-menu-1" aria-controls="ecommerce-navbar-menu-1" aria-expanded="false" class="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white"><span class="sr-only"> Open Menu </span><svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"></path></svg></button></div></div></div>`);
      _push(ssrRenderComponent(HeaderMobileMenu, null, null, _parent));
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/MainHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      const _component_Footer = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DJyAhZTi.mjs.map
