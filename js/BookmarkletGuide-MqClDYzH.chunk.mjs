const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, o as onMounted, j as openBlock, p as createElementBlock, R as normalizeClass, P as createVNode, u as unref, D as createBaseVNode, I as toDisplayString, L as createCommentVNode, k as createBlock, F as Fragment, K as withModifiers, x as ref } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { bd as mdiBookmarkPlusOutline, an as translate } from "./vendor-CflEb2sm.chunk.mjs";
import { h as NcIconSvgWrapper, q as NcLoadingIcon } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api } from "./shortlinks-main.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
const _hoisted_1 = {
  key: 0,
  class: "bookmarklet-guide__intro"
};
const _hoisted_2 = {
  key: 2,
  class: "error",
  role: "alert"
};
const _hoisted_3 = { class: "bookmarklet-guide__steps" };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = { class: "bookmarklet-guide__drag-area" };
const _hoisted_6 = ["href"];
const _hoisted_7 = {
  key: 0,
  class: "bookmarklet-guide__mobile"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BookmarkletGuide",
  props: {
    compact: { type: Boolean, default: false },
    showHeading: { type: Boolean, default: true }
  },
  setup(__props) {
    const code = ref("");
    const mobileAlternative = ref("");
    const loading = ref(true);
    const error = ref("");
    let bookmarkletRequest = null;
    onMounted(async () => {
      try {
        bookmarkletRequest ??= api.bookmarklet();
        const result = await bookmarkletRequest;
        code.value = result.code;
        mobileAlternative.value = result.mobileAlternative;
      } catch (caught) {
        error.value = caught instanceof Error ? caught.message : String(caught);
        bookmarkletRequest = null;
      } finally {
        loading.value = false;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["bookmarklet-guide", { "bookmarklet-guide--compact": __props.compact }])
      }, [
        __props.showHeading ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(unref(NcIconSvgWrapper), {
            path: unref(mdiBookmarkPlusOutline),
            size: __props.compact ? 28 : 36,
            "aria-hidden": "true"
          }, null, 8, ["path", "size"]),
          createBaseVNode("div", null, [
            createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Create links from any website")), 1),
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "The bookmarklet turns the page you are viewing into a new short link without interrupting your flow.")), 1)
          ])
        ])) : createCommentVNode("", true),
        loading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
          key: 1,
          name: unref(translate)("shortlinks", "Loading bookmarklet"),
          size: 32
        }, null, 8, ["name"])) : error.value ? (openBlock(), createElementBlock("p", _hoisted_2, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
          createBaseVNode("ol", _hoisted_3, [
            createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Show your browser bookmarks bar.")), 1),
            createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Drag the button below to the bookmarks bar.")), 1),
            !__props.compact ? (openBlock(), createElementBlock("li", _hoisted_4, toDisplayString(unref(translate)("shortlinks", "Open any website and select the new bookmark.")), 1)) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("a", {
              href: code.value,
              class: "bookmarklet-guide__button button-vue button-vue--size-normal button-vue--vue-primary button-vue--primary",
              draggable: "true",
              onClick: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["prevent"]))
            }, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiBookmarkPlusOutline),
                size: 20,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Add to Shortlinks")), 1)
            ], 8, _hoisted_6),
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Drag this button")), 1)
          ]),
          mobileAlternative.value && !__props.compact ? (openBlock(), createElementBlock("p", _hoisted_7, toDisplayString(mobileAlternative.value), 1)) : createCommentVNode("", true)
        ], 64))
      ], 2);
    };
  }
});
const BookmarkletGuide = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a119e4e5"]]);
export {
  BookmarkletGuide as B
};
