const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, x as ref, j as openBlock, k as createBlock, Q as withCtx, D as createBaseVNode, I as toDisplayString, u as unref, N as withDirectives, p as createElementBlock, F as Fragment, E as renderList, ah as vModelSelect, P as createVNode, H as createTextVNode, d as computed } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate } from "./vendor-CflEb2sm.chunk.mjs";
import { g as NcButton, a as NcDialog } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
import "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
const _hoisted_1 = { class: "destination-dialog" };
const _hoisted_2 = { class: "select-field" };
const _hoisted_3 = { value: null };
const _hoisted_4 = ["value"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FolderDestinationDialog",
  props: {
    folder: {},
    folders: {},
    mode: {}
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const parentId = ref(props.mode === "move" ? props.folder.parentId : null);
    const excludedIds = computed(() => {
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
      return ids;
    });
    const choices = computed(() => props.folders.filter((folder) => !excludedIds.value.has(folder.id)));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: __props.mode === "move" ? unref(translate)("shortlinks", "Move folder") : unref(translate)("shortlinks", "Copy folder"),
        size: "normal",
        onClosing: _cache[3] || (_cache[3] = ($event) => emit("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[1] || (_cache[1] = ($event) => emit("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "primary",
            disabled: __props.mode === "move" && parentId.value === __props.folder.parentId,
            onClick: _cache[2] || (_cache[2] = ($event) => emit("save", parentId.value))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.mode === "move" ? unref(translate)("shortlinks", "Move") : unref(translate)("shortlinks", "Copy")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("p", null, toDisplayString(__props.mode === "move" ? unref(translate)("shortlinks", "Choose the new parent for “{name}”.", { name: __props.folder.name }) : unref(translate)("shortlinks", "Choose where the copy of “{name}” should be created. Subfolders and links are copied too.", { name: __props.folder.name })), 1),
            createBaseVNode("label", _hoisted_2, [
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Destination")), 1),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => parentId.value = $event)
              }, [
                createBaseVNode("option", _hoisted_3, toDisplayString(unref(translate)("shortlinks", "Top level")), 1),
                (openBlock(true), createElementBlock(Fragment, null, renderList(choices.value, (choice) => {
                  return openBlock(), createElementBlock("option", {
                    key: choice.id,
                    value: choice.id
                  }, toDisplayString(choice.name), 9, _hoisted_4);
                }), 128))
              ], 512), [
                [vModelSelect, parentId.value]
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const FolderDestinationDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7a6bb126"]]);
export {
  FolderDestinationDialog as default
};
