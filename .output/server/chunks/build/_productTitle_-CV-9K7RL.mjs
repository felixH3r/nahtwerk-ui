import { useSSRContext, defineComponent, ref, computed, mergeProps, unref, withCtx, openBlock, createBlock, Fragment, renderList } from 'vue';
import { u as useProductStore } from './product-store-D4ZXvwX8.mjs';
import { s as storeToRefs } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _sfc_main$7 } from './NuxtImg-BiNuoM8V.mjs';
import { f as formatPrice } from './utils-BT5Q-2h-.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'unhead';
import '@unhead/shared';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import 'axios';
import 'retry-axios';
import 'qs';
import 'crypto';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "VariantsThumbnail",
  __ssrInlineRender: true,
  props: {
    variant: {},
    isSelected: {},
    index: {},
    onSelect: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [{ "border-2 border-gray-600": _ctx.isSelected }, "flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"]
      }, _attrs))}><h3>${ssrInterpolate(_ctx.variant.title)}</h3></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/VariantsThumbnail.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : undefined;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "FabricThumbnail",
  __ssrInlineRender: true,
  props: {
    index: {},
    fabric: {},
    isSelected: {},
    onSelect: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: [{ "border-2 border-gray-600": _ctx.isSelected }, "flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-full aspect-square object-cover"],
        onClick: ($event) => _ctx.onSelect(_ctx.index, _ctx.fabric),
        src: _ctx.fabric.fileUrl
      }, null, _parent));
      _push(`<span class="text-ellipsis overflow-hidden whitespace-nowrap w-full block">${ssrInterpolate(_ctx.fabric.fabricName)}</span></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/FabricThumbnail.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : undefined;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MediaThumbnail",
  __ssrInlineRender: true,
  props: {
    index: {},
    imageUrl: {},
    isSelected: {},
    onSelect: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$7;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps({
        class: [{ "border-2 border-gray-600": _ctx.isSelected }, "flex items-center justify-center cursor-pointer bg-gray-200 rounded-lg w-20 h-20 object-cover"],
        onClick: ($event) => _ctx.onSelect(_ctx.index, _ctx.imageUrl),
        src: _ctx.imageUrl
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/MediaThumbnail.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : undefined;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Slider",
  __ssrInlineRender: true,
  props: {
    heightClass: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex w-full overflow-scroll md:h-56" }, _attrs))}><div class="flex gap-2 pr-64">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="w-20 flex-shrink-0"></div></div><div class="${ssrRenderClass([_ctx.heightClass, "w-32 bg-gradient-to-r from-transparent via-white via-70% white to-white absolute right-0"])}"></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/utils/Slider.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ProductImage",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const selectedImage = ref(null);
    const selectedImageIndex = ref(null);
    const getImagesWithThumbnail = computed(() => {
      if (props.product && props.product.images && props.product.thumbnail) {
        return [props.product.thumbnail, ...props.product.images.map((image) => image.url)];
      }
      return [];
    });
    const getSelectedImage = computed(() => {
      if (props.product && props.product.thumbnail && selectedImageIndex.value === 0) {
        return props.product.thumbnail;
      }
      if (selectedImage.value) {
        return selectedImage.value;
      }
      return "";
    });
    const selectImage = (index, imageUrl) => {
      selectedImageIndex.value = index;
      selectedImage.value = imageUrl;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "shrink-0 max-w-md lg:max-w-lg mx-auto relative" }, _attrs))}><div class="z-[-1] relative">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: "w-full max-h-[500px] rounded-lg mb-3 object-cover z-[-1]",
        src: unref(getSelectedImage)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$3, { "height-class": "h-32" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(getImagesWithThumbnail), (imageUrl, index) => {
              _push2(ssrRenderComponent(_sfc_main$4, {
                key: index,
                index,
                imageUrl,
                isSelected: unref(selectedImageIndex) === index,
                onSelect: selectImage
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(getImagesWithThumbnail), (imageUrl, index) => {
                return openBlock(), createBlock(_sfc_main$4, {
                  key: index,
                  index,
                  imageUrl,
                  isSelected: unref(selectedImageIndex) === index,
                  onSelect: selectImage
                }, null, 8, ["index", "imageUrl", "isSelected"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductImage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-4 gap-3 sm:grid-cols-5 md:gap-4" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/FabricGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const FabricGrid = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[productTitle]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const product = ref(null);
    const store = useProductStore();
    const { products } = storeToRefs(store);
    const selectedVariant = ref(null);
    const selectedVariantIndex = ref(null);
    const selectedInnerFabric = ref(null);
    const selectedInnerFabricIndex = ref(null);
    const selectedOuterFabric = ref(null);
    const selectedOuterFabricIndex = ref(null);
    computed(() => {
      const productHandle = route.params.productTitle;
      if (products.value) {
        const foundProduct = products.value.find(
          (pro) => pro.handle === productHandle
        );
        if (foundProduct) {
          return foundProduct;
        }
      }
      return null;
    });
    const getSelectedPrice = computed(() => {
      if (!selectedVariant || !selectedVariant.value || !selectedVariant.value.calculated_price) {
        return "0,00";
      }
      return formatPrice(selectedVariant.value.calculated_price);
    });
    const selectInnerFabric = (index, fabric) => {
      selectedInnerFabricIndex.value = index;
      selectedInnerFabric.value = fabric;
    };
    const selectOuterFabric = (index, fabric) => {
      selectedOuterFabricIndex.value = index;
      selectedOuterFabric.value = fabric;
    };
    const selectVariant = (index, variant) => {
      selectedVariantIndex.value = index;
      selectedVariant.value = variant;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-8 md:py-16 dark:bg-gray-900 antialiased" }, _attrs))}><div class="max-w-screen-xl px-4 mx-auto 2xl:px-0"><div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16"><div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        product: unref(product),
        class: "sticky top-24"
      }, null, _parent));
      _push(`</div><div class="mt-6 sm:mt-8 lg:mt-0"><h1 class="text-4xl font-semibold text-gray-900dark:text-white">${ssrInterpolate((_a = unref(product)) == null ? undefined : _a.title)}</h1><div class="mt-4 mb-8 sm:items-center sm:gap-4 sm:flex"><p class="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white"> \u20AC ${ssrInterpolate(unref(getSelectedPrice))}</p></div>`);
      if (((_c = (_b = unref(product)) == null ? undefined : _b.metadata) == null ? undefined : _c.innerFabrics.length) > 0) {
        _push(`<div class="mb-8"><h2 class="mb-4 text-xl font-bold">${ssrInterpolate(((_d = unref(product)) == null ? undefined : _d.metadata.outerFabrics.length) > 0 ? "Innenstoff:" : "Stoff:")}</h2>`);
        _push(ssrRenderComponent(FabricGrid, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c2, _d2;
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList((_b2 = (_a2 = unref(product)) == null ? undefined : _a2.metadata) == null ? undefined : _b2.innerFabrics, (fabric, index) => {
                _push2(ssrRenderComponent(_sfc_main$5, {
                  key: index,
                  index,
                  fabric,
                  isSelected: unref(selectedInnerFabricIndex) === index,
                  onSelect: selectInnerFabric
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList((_d2 = (_c2 = unref(product)) == null ? undefined : _c2.metadata) == null ? undefined : _d2.innerFabrics, (fabric, index) => {
                  return openBlock(), createBlock(_sfc_main$5, {
                    key: index,
                    index,
                    fabric,
                    isSelected: unref(selectedInnerFabricIndex) === index,
                    onSelect: selectInnerFabric
                  }, null, 8, ["index", "fabric", "isSelected"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (((_f = (_e = unref(product)) == null ? undefined : _e.metadata) == null ? undefined : _f.outerFabrics.length) > 0) {
        _push(`<div class="mb-8"><h2 class="mb-4 text-xl font-bold">Au\xDFenstoff:</h2>`);
        _push(ssrRenderComponent(FabricGrid, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c2, _d2;
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList((_b2 = (_a2 = unref(product)) == null ? undefined : _a2.metadata) == null ? undefined : _b2.outerFabrics, (fabric, index) => {
                _push2(ssrRenderComponent(_sfc_main$5, {
                  key: index,
                  index,
                  fabric,
                  isSelected: unref(selectedOuterFabricIndex) === index,
                  onSelect: selectOuterFabric
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList((_d2 = (_c2 = unref(product)) == null ? undefined : _c2.metadata) == null ? undefined : _d2.outerFabrics, (fabric, index) => {
                  return openBlock(), createBlock(_sfc_main$5, {
                    key: index,
                    index,
                    fabric,
                    isSelected: unref(selectedOuterFabricIndex) === index,
                    onSelect: selectOuterFabric
                  }, null, 8, ["index", "fabric", "isSelected"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-8"><h2 class="mb-4 text-xl font-bold">Gr\xF6\xDFe:</h2>`);
      _push(ssrRenderComponent(FabricGrid, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList((_a2 = unref(product)) == null ? undefined : _a2.variants, (variant, index) => {
              _push2(ssrRenderComponent(_sfc_main$6, {
                key: index,
                index,
                variant,
                isSelected: unref(selectedVariantIndex) === index,
                onSelect: selectVariant
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList((_b2 = unref(product)) == null ? undefined : _b2.variants, (variant, index) => {
                return openBlock(), createBlock(_sfc_main$6, {
                  key: index,
                  index,
                  variant,
                  isSelected: unref(selectedVariantIndex) === index,
                  onSelect: selectVariant
                }, null, 8, ["index", "variant", "isSelected"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="mb-6 text-gray-500 dark:text-gray-400">${ssrInterpolate((_g = unref(product)) == null ? undefined : _g.description)}</p><div class="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8"><a href="#" title="" class="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center" role="button"><svg class="w-5 h-5 -ms-2 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"></path></svg> In den Warenkorb </a></div><hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800"></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[productTitle].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=_productTitle_-CV-9K7RL.mjs.map
