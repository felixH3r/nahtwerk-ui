import { _ as __nuxt_component_0 } from './nuxt-link-Dgb6-tnq.mjs';
import { _ as _sfc_main$4 } from './NuxtImg-BiNuoM8V.mjs';
import { useSSRContext, defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock } from 'vue';
import { f as formatPrice } from './utils-BT5Q-2h-.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { u as useProductStore, a as useFormStore } from './product-store-D4ZXvwX8.mjs';
import { Resend } from 'resend';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import 'ipx';
import './server.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CartItem",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6" }, _attrs))}><div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/products/${_ctx.lineItem.handle}`,
        class: "w-20 shrink-0 md:order-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              class: "h-20 w-20 rounded dark:hidden",
              src: _ctx.lineItem.thumbnail
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                class: "h-20 w-20 rounded dark:hidden",
                src: _ctx.lineItem.thumbnail
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<label for="counter-input" class="sr-only">Choose quantity:</label><div class="flex items-center justify-between md:order-3 md:justify-end"><div class="flex items-center"><span>Menge: ${ssrInterpolate(_ctx.lineItem.quantity)}</span></div><div class="text-end md:order-4 md:w-32"><p class="text-base font-bold text-gray-900 dark:text-white">\u20AC ${ssrInterpolate(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(_ctx.lineItem.total))}</p></div></div><div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md"><div class="flex flex-col">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/products/${_ctx.lineItem.variant.product.handle}`,
        class: "text-base font-medium text-gray-900 hover:underline dark:text-white underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.lineItem.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.lineItem.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Gr\xF6\xDFe: ${ssrInterpolate(_ctx.lineItem.variant.title)}</span><span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Innenstoff: ${ssrInterpolate(_ctx.lineItem.metadata.innerFabric.fabricName)}</span><span class="text-sm font-light text-gray-900 hover:underline dark:text-white">Au\xDFenstoff: ${ssrInterpolate(_ctx.lineItem.metadata.outerFabric.fabricName)}</span></div><div class="flex items-center gap-4"><button type="button" class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"><svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"></path></svg> Entfernen </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AdressForm",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useFormStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "mx-auto" }, _attrs))}><div class="mb-5"><label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vorname:</label><input type="text" id="firstName" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.firstName }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.firstName)} placeholder="Vorname" required></div><div class="mb-5"><label for="secondName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nachname:</label><input type="text" id="secondName" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.lastName }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.lastName)} placeholder="Nachname" required></div><div class="mb-5"><label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label><input type="email" id="email" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.email || !unref(store).isValidEmail && unref(store).submitted }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.email)} placeholder="name@email.com" required></div><div class="mb-5"><label for="street" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stra\xDFe mit Hausnummer:</label><input type="text" id="street" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.street }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.street)} placeholder="Stra\xDFe mit Hausnummer" required></div><div class="mb-5"><label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stadt:</label><input type="text" id="city" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.city }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.city)} placeholder="Stadt" required></div><div class="mb-5"><label for="postalCode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Postleitzahl:</label><input type="text" id="postalCode" class="${ssrRenderClass([{ "border-red-500": unref(store).isFieldInvalid.postalCode }, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"])}"${ssrRenderAttr("value", unref(store).formData.postalCode)} placeholder="Postleitzahl" required></div><div class="flex items-start mb-5"><div class="flex items-center h-5"><input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"${ssrIncludeBooleanAttr(Array.isArray(unref(store).gdpr) ? ssrLooseContain(unref(store).gdpr, "") : unref(store).gdpr) ? " checked" : ""} required></div><label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ich akzeptiere die Datenschutzerkl\xE4rung</label></div></form>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/AdressForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CartSummary",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useProductStore();
    const getCart = computed(() => {
      console.log(store.storeCart);
      if (store.storeCart) {
        return store.storeCart;
      }
      return {};
    });
    useFormStore();
    new Resend("re_QP1WqNkG_Prg2E7Y5v2rmZF3Z9jjm4dyU");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full" }, _attrs))}><div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"><p class="text-xl font-semibold text-gray-900 dark:text-white">Adresse:</p>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`<div class="space-y-4 mb-5"><dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700"><dt class="text-base font-bold text-gray-900 dark:text-white">Summe:</dt><dd class="text-base font-bold text-gray-900 dark:text-white">\u20AC ${ssrInterpolate(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(unref(getCart).total))}</dd></dl></div><span class="text-sm font-medium text-gray-500 dark:text-gray-400">Bitte beachten Sie, dass dies noch keine verbindliche Bestellung ist. Ich werde Ihre Anfrage umgehend pr\xFCfen und mich in K\xFCrze bei Ihnen melden, um alle Details zu besprechen.</span><button class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"> Jetzt Anfrage senden! </button><div class="flex items-center justify-center gap-2"><span class="text-sm font-normal text-gray-500 dark:text-gray-400"> oder </span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        title: "",
        class: "inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Weiter Einkaufen <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Weiter Einkaufen "),
              (openBlock(), createBlock("svg", {
                class: "h-5 w-5",
                "aria-hidden": "true",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  stroke: "currentColor",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M19 12H5m14 0-4 4m4-4-4-4"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartSummary.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "warenkorb",
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
      const _component_CartItem = _sfc_main$3;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-white py-8 antialiased dark:bg-gray-900 md:py-16" }, _attrs))}><div class="mx-auto max-w-screen-xl px-4 2xl:px-0"><h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Warenkorb</h2><div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8"><div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl"><div class="space-y-6"><!--[-->`);
      ssrRenderList(unref(getLineItems), (lineItem, index) => {
        _push(ssrRenderComponent(_component_CartItem, {
          key: index,
          lineItem
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/warenkorb.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=warenkorb-CG7unFzY.mjs.map
