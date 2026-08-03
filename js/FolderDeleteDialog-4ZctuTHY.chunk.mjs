const appName = "shortlinks";
const appVersion = "1.2.2";
import { an as translate, bm as mdiFolderRemoveOutline, aN as mdiDeleteOutline } from "./vendor-CflEb2sm.chunk.mjs";
import { C as NcFormBoxButton, h as NcIconSvgWrapper, g as NcButton, a as NcDialog } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { W as defineComponent, j as openBlock, k as createBlock, Q as withCtx, D as createBaseVNode, I as toDisplayString, u as unref, P as createVNode, H as createTextVNode, d as computed } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
import "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
const _hoisted_1 = { class: "delete-choices" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FolderDeleteDialog",
  props: {
    folder: {},
    folders: {}
  },
  emits: ["close", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const linkCount = computed(() => {
      const ids = /* @__PURE__ */ new Set([props.folder.id]);
      for (let changed = true; changed; ) {
        changed = false;
        for (const folder of props.folders) {
          if (folder.parentId !== null && ids.has(folder.parentId) && !ids.has(folder.id)) {
            ids.add(folder.id);
            changed = true;
          }
        }
      }
      return props.folders.filter((folder) => ids.has(folder.id)).reduce((sum, folder) => sum + folder.count, 0);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: unref(translate)("shortlinks", "Delete folder “{name}”", { name: __props.folder.name }),
        size: "normal",
        onClosing: _cache[3] || (_cache[3] = ($event) => emit("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[2] || (_cache[2] = ($event) => emit("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Choose what should happen to the short links in this folder and its subfolders.")), 1),
            createVNode(unref(NcFormBoxButton), {
              label: unref(translate)("shortlinks", "Delete folder, keep links"),
              description: unref(translate)("shortlinks", "The links are moved to Unfiled and remain available."),
              onClick: _cache[0] || (_cache[0] = ($event) => emit("delete", false))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderRemoveOutline) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["label", "description"]),
            createVNode(unref(NcFormBoxButton), {
              label: unref(translate)("shortlinks", "Delete folder and links"),
              "inverted-accent": "",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("delete", true))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
              ]),
              description: withCtx(() => [
                createBaseVNode("span", null, [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Moves")) + " ", 1),
                  createBaseVNode("strong", null, toDisplayString(linkCount.value), 1),
                  createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "short links to trash.")), 1)
                ])
              ]),
              _: 1
            }, 8, ["label"])
          ])
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const FolderDeleteDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8a02d053"]]);
export {
  FolderDeleteDialog as default
};
