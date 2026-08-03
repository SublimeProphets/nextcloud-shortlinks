const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, x as ref, j as openBlock, k as createBlock, u as unref, Q as withCtx, D as createBaseVNode, K as withModifiers, P as createVNode, I as toDisplayString, p as createElementBlock, F as Fragment, E as renderList, H as createTextVNode, N as withDirectives, ah as vModelSelect, d as computed } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate } from "./vendor-CflEb2sm.chunk.mjs";
import { a as NcDialog, _ as _sfc_main$1, g as NcButton, h as NcIconSvgWrapper } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { f as folderIconOptions } from "./shortlinks-main.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
import "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
const _hoisted_1 = { class: "icon-picker" };
const _hoisted_2 = { class: "select-field" };
const _hoisted_3 = { value: null };
const _hoisted_4 = ["value"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FolderForm",
  props: {
    folders: {},
    folder: { default: void 0 },
    prefillParentId: { default: null }
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const name = ref(props.folder?.name ?? "");
    const parentId = ref(props.folder?.parentId ?? props.prefillParentId);
    const icon = ref(props.folder?.icon ?? "folder");
    const descendants = computed(() => {
      if (!props.folder) return /* @__PURE__ */ new Set();
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
    const availableParents = computed(() => props.folders.filter((folder) => !descendants.value.has(folder.id)));
    function submit() {
      if (!name.value.trim()) return;
      emit("save", { name: name.value.trim(), parentId: parentId.value, icon: icon.value });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: __props.folder ? unref(translate)("shortlinks", "Edit folder") : unref(translate)("shortlinks", "New folder"),
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
          }),
          createVNode(unref(NcButton), {
            type: "submit",
            form: "folder-form",
            variant: "primary",
            disabled: !name.value.trim()
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.folder ? unref(translate)("shortlinks", "Save changes") : unref(translate)("shortlinks", "Create folder")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        default: withCtx(() => [
          createBaseVNode("form", {
            id: "folder-form",
            class: "folder-form",
            onSubmit: withModifiers(submit, ["prevent"])
          }, [
            createVNode(unref(_sfc_main$1), {
              modelValue: name.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
              required: "",
              label: unref(translate)("shortlinks", "Folder name")
            }, null, 8, ["modelValue", "label"]),
            createBaseVNode("fieldset", _hoisted_1, [
              createBaseVNode("legend", null, toDisplayString(unref(translate)("shortlinks", "Folder icon")), 1),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(folderIconOptions), (option) => {
                return openBlock(), createBlock(unref(NcButton), {
                  key: option.id,
                  type: "button",
                  pressed: icon.value === option.id,
                  "aria-label": unref(translate)("shortlinks", option.label),
                  onClick: ($event) => icon.value = option.id
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), {
                      path: option.path
                    }, null, 8, ["path"])
                  ]),
                  default: withCtx(() => [
                    createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", option.label)), 1)
                  ]),
                  _: 2
                }, 1032, ["pressed", "aria-label", "onClick"]);
              }), 128))
            ]),
            createBaseVNode("label", _hoisted_2, [
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Parent folder")), 1),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => parentId.value = $event)
              }, [
                createBaseVNode("option", _hoisted_3, toDisplayString(unref(translate)("shortlinks", "No folder")), 1),
                (openBlock(true), createElementBlock(Fragment, null, renderList(availableParents.value, (parent) => {
                  return openBlock(), createElementBlock("option", {
                    key: parent.id,
                    value: parent.id
                  }, toDisplayString(parent.name), 9, _hoisted_4);
                }), 128))
              ], 512), [
                [vModelSelect, parentId.value]
              ])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const FolderForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2e3c73ce"]]);
export {
  FolderForm as default
};
