import { useSSRContext, defineComponent, ref, computed, mergeProps, withCtx, unref, openBlock, createBlock, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-wdF35zEx.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-CKtKb6nK.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useProductStore, s as storeToRefs } from './server.mjs';
import '../nitro/nitro.mjs';
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
import 'vue-router';
import '@unhead/addons';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "175",
    height: "175",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "grey",
    xmlns: "http://www.w3.org/2000/svg"
  }, _attrs))}><path d="M18.2222 4H5.77778C4.79594 4 4 4.79594 4 5.77778V18.2222C4 19.2041 4.79594 20 5.77778 20H18.2222C19.2041 20 20 19.2041 20 18.2222V5.77778C20 4.79594 19.2041 4 18.2222 4Z" stroke="lightgrey" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 11C10.3284 11 11 10.3284 11 9.5C11 8.67157 10.3284 8 9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11Z" stroke="lightgrey" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 15.0909L15.625 11L6 20" stroke="lightgrey" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/ImgPlaceholderSVG.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const ImgPlaceholderSVG = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const showPlaceholderImg = ref(false);
    const props = __props;
    const getThumbnail = computed(() => {
      if (props.product && props.product.thumbnail) {
        return props.product.thumbnail;
      }
      showPlaceholderImg.value = true;
    });
    const getTitle = computed(() => {
      if (props.product && props.product.title) {
        return props.product.title;
      }
      return "No title";
    });
    const getSubtitle = computed(() => {
      if (props.product && props.product.subtitle) {
        return props.product.subtitle;
      }
      return "No subtitle";
    });
    const getProductRoute = () => {
      return `/products/${props.product.handle}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800" }, _attrs))}><div class="flex items-center justify-center h-56 w-full">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: getProductRoute(),
        class: "flex justify-center items-center w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(showPlaceholderImg)) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                class: "mx-auto h-56 w-full object-cover object-center rounded-lg dark:hidden",
                src: getThumbnail.value,
                alt: ""
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(ImgPlaceholderSVG, null, null, _parent2, _scopeId));
            }
          } else {
            return [
              !unref(showPlaceholderImg) ? (openBlock(), createBlock(_component_NuxtImg, {
                key: 0,
                class: "mx-auto h-56 w-full object-cover object-center rounded-lg dark:hidden",
                src: getThumbnail.value,
                alt: ""
              }, null, 8, ["src"])) : (openBlock(), createBlock(ImgPlaceholderSVG, { key: 1 }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="pt-6"><div class="mb-4 flex items-center justify-between gap-4"><span class="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Mit Liebe gemacht </span><div class="flex items-center justify-end gap-1"><svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="grey" viewBox="0 0 24 24"><path stroke="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"></path></svg></div></div><div class="flex flex-col mb-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: getProductRoute(),
        class: "text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(getTitle.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(getTitle.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span>${ssrInterpolate(getSubtitle.value)}</span></div><div class="flex gap-1 items-center"><svg class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path></svg><p class="text-sm font-medium text-gray-500 dark:text-gray-400">Handgefertigt</p></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/ProductCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProductGrid",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useProductStore();
    const { products } = storeToRefs(store);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-primary-100 py-8 antialiased min-h-screen dark:bg-gray-900 md:py-12" }, _attrs))}><div class="mx-auto max-w-screen-xl px-4 2xl:px-0"><div class="mb-4 items-end justify-between space-y-4 sm:flex-col sm:space-y-0 md:mb-8"><h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Produkte</h2><div class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(products), (product) => {
        _push(ssrRenderComponent(_sfc_main$2, { product }, null, _parent));
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/ProductGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "shop",
  __ssrInlineRender: true,
  setup(__props) {
    useProductStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=shop-DOsHuUzE.mjs.map
