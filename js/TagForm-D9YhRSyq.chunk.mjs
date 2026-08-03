const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, x as ref, j as openBlock, k as createBlock, u as unref, Q as withCtx, D as createBaseVNode, K as withModifiers, P as createVNode, H as createTextVNode, I as toDisplayString, p as createElementBlock, N as withDirectives, V as vModelText, L as createCommentVNode } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate } from "./vendor-CflEb2sm.chunk.mjs";
import { a as NcDialog, _ as _sfc_main$1, f as NcCheckboxRadioSwitch, g as NcButton } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
import "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
const _hoisted_1 = {
  key: 0,
  class: "color-field"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TagForm",
  props: {
    tag: { default: void 0 }
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const name = ref(props.tag?.name ?? "");
    const useColor = ref(Boolean(props.tag?.color));
    const color = ref(props.tag?.color ?? "#0082c9");
    function submit() {
      if (!name.value.trim()) return;
      emit("save", { name: name.value.trim(), color: useColor.value ? color.value : null });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: __props.tag ? unref(translate)("shortlinks", "Edit tag") : unref(translate)("shortlinks", "New tag"),
        size: "normal",
        onClosing: _cache[4] || (_cache[4] = ($event) => emit("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[3] || (_cache[3] = ($event) => emit("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            type: "submit",
            form: "tag-form",
            variant: "primary",
            disabled: !name.value.trim()
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.tag ? unref(translate)("shortlinks", "Save changes") : unref(translate)("shortlinks", "Create tag")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        default: withCtx(() => [
          createBaseVNode("form", {
            id: "tag-form",
            class: "tag-form",
            onSubmit: withModifiers(submit, ["prevent"])
          }, [
            createVNode(unref(_sfc_main$1), {
              modelValue: name.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
              required: "",
              label: unref(translate)("shortlinks", "Tag name")
            }, null, 8, ["modelValue", "label"]),
            createVNode(unref(NcCheckboxRadioSwitch), {
              modelValue: useColor.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => useColor.value = $event),
              type: "switch"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Use a custom color")), 1)
              ]),
              _: 1
            }, 8, ["modelValue"]),
            useColor.value ? (openBlock(), createElementBlock("label", _hoisted_1, [
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Tag color")), 1),
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => color.value = $event),
                type: "color"
              }, null, 512), [
                [vModelText, color.value]
              ])
            ])) : createCommentVNode("", true)
          ], 32)
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const TagForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2f97ee17"]]);
export {
  TagForm as default
};
