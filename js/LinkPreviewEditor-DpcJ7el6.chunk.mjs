const appName = "shortlinks";
const appVersion = "1.2.2";
import { an as translate, bE as mdiImageEditOutline, bF as mdiImagePlusOutline, bq as mdiClose, bG as mdiMovieOpenOutline, bH as mdiPaletteOutline } from "./vendor-CflEb2sm.chunk.mjs";
import { a as api, L as LinkThumbnail } from "./shortlinks-main.mjs";
import { w as watch, h as onBeforeUnmount, x as ref, d as computed, W as defineComponent, j as openBlock, p as createElementBlock, u as unref, D as createBaseVNode, I as toDisplayString, P as createVNode, H as createTextVNode, Q as withCtx, L as createCommentVNode, k as createBlock, B as normalizeProps, C as guardReactiveProps, v as normalizeStyle, R as normalizeClass } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { g as getFilePickerBuilder, F as FilePickerClosed } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { h as NcIconSvgWrapper, g as NcButton, D as NcColorPicker, _ as _sfc_main$2, q as NcLoadingIcon } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
function aliasSyntaxError(alias) {
  if (!alias) return translate("shortlinks", "Enter an alias.");
  if (alias.length > 128) return translate("shortlinks", "The alias cannot be longer than 128 characters.");
  if (/\s/.test(alias)) return translate("shortlinks", "Spaces are not allowed in an alias.");
  if (!/^[A-Za-z0-9]/.test(alias)) return translate("shortlinks", "The alias must start with a letter or number.");
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(alias)) return translate("shortlinks", "Use only letters, numbers, hyphens, and underscores.");
  return "";
}
function useAliasValidation(alias, currentAlias = "") {
  const state = ref("idle");
  const serverMessage = ref("");
  let timer;
  let requestId = 0;
  let suggestionId = 0;
  async function check(value = alias.value) {
    const syntaxError = aliasSyntaxError(value);
    if (syntaxError) {
      state.value = value ? "invalid" : "idle";
      serverMessage.value = "";
      return;
    }
    if (value === currentAlias) {
      state.value = "available";
      serverMessage.value = translate("shortlinks", "This is the current alias");
      return;
    }
    const activeRequest = ++requestId;
    state.value = "checking";
    serverMessage.value = "";
    try {
      const result = await api.aliasAvailable(value);
      if (activeRequest !== requestId) return;
      state.value = result.available ? "available" : "unavailable";
      serverMessage.value = result.available ? translate("shortlinks", "Alias is available") : translate("shortlinks", "Alias is already used");
    } catch (error) {
      if (activeRequest !== requestId) return;
      state.value = "invalid";
      serverMessage.value = error instanceof Error && error.message.includes("reserved") ? translate("shortlinks", "This alias is reserved.") : translate("shortlinks", "The alias could not be checked.");
    }
  }
  watch(alias, (value) => {
    if (timer) clearTimeout(timer);
    const syntaxError = aliasSyntaxError(value);
    if (syntaxError) {
      state.value = value ? "invalid" : "idle";
      serverMessage.value = "";
      return;
    }
    state.value = "checking";
    timer = setTimeout(() => check(value), 350);
  }, { immediate: true });
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });
  const message = computed(() => aliasSyntaxError(alias.value) || serverMessage.value);
  const valid = computed(() => !aliasSyntaxError(alias.value) && state.value === "available");
  async function suggest(context = {}) {
    const requestedFor = alias.value;
    const activeSuggestion = ++suggestionId;
    state.value = "checking";
    try {
      const suggestion = await api.suggestAlias(context);
      if (activeSuggestion !== suggestionId || alias.value !== requestedFor) return;
      alias.value = suggestion.slug;
      await check(alias.value);
    } catch {
      if (activeSuggestion !== suggestionId || alias.value !== requestedFor) return;
      state.value = "invalid";
      serverMessage.value = translate("shortlinks", "An alias could not be generated. Try again.");
    }
  }
  return { check, message, state, suggest, valid };
}
function useLinkMetadataPreview(url, title, valid, enabled) {
  const loading = ref(false);
  const hasThumbnail = ref(false);
  const imageUrl = ref(null);
  const loaded = ref(false);
  const titleEdited = ref(Boolean(title.value));
  let timer;
  let requestId = 0;
  watch([url, valid, enabled], () => {
    if (timer) clearTimeout(timer);
    hasThumbnail.value = false;
    imageUrl.value = null;
    loaded.value = false;
    if (!valid.value || !enabled.value) {
      loading.value = false;
      return;
    }
    timer = setTimeout(load, 550);
  }, { immediate: true });
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });
  async function load() {
    const activeRequest = ++requestId;
    const targetUrl = url.value;
    loading.value = true;
    try {
      const metadata = await api.fetchMetadata(targetUrl);
      if (activeRequest !== requestId || targetUrl !== url.value) return;
      hasThumbnail.value = metadata.hasThumbnail;
      imageUrl.value = metadata.imageUrl;
      loaded.value = true;
      if (!titleEdited.value && metadata.title) title.value = metadata.title;
    } catch {
      if (activeRequest === requestId) {
        hasThumbnail.value = false;
        imageUrl.value = null;
      }
    } finally {
      if (activeRequest === requestId) loading.value = false;
    }
  }
  return {
    hasThumbnail,
    imageUrl,
    loaded,
    loading,
    markTitleEdited: () => {
      titleEdited.value = true;
    },
    resetTitleEditing: () => {
      titleEdited.value = false;
    },
    thumbnailSrc: computed(() => hasThumbnail.value && valid.value ? api.previewThumbnailUrl(url.value, imageUrl.value) : "")
  };
}
const _hoisted_1$1 = ["aria-label"];
const _hoisted_2$1 = { class: "appearance-field" };
const _hoisted_3 = { class: "field-heading" };
const _hoisted_4 = ["aria-label"];
const _hoisted_5 = {
  key: 0,
  class: "selected-file"
};
const _hoisted_6 = { class: "appearance-field" };
const _hoisted_7 = { class: "field-heading" };
const _hoisted_8 = {
  key: 0,
  class: "media-preview"
};
const _hoisted_9 = ["src"];
const _hoisted_10 = ["src"];
const _hoisted_11 = { class: "field-actions" };
const _hoisted_12 = {
  key: 1,
  class: "path-label"
};
const _hoisted_13 = { class: "appearance-field" };
const _hoisted_14 = { class: "field-heading" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LinkAppearanceFields",
  props: {
    thumbnailPath: { default: null },
    mediaPath: { default: null },
    color: { default: null },
    thumbnailSrc: { default: "" },
    mediaSrc: { default: "" },
    mediaMime: { default: null }
  },
  emits: ["update:thumbnailPath", "update:mediaPath", "update:color"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const palette = computed(() => [
      themeHex("--color-primary-element", "#0082c9"),
      themeHex("--color-success", "#2d7d46"),
      themeHex("--color-warning", "#e6a100"),
      themeHex("--color-error", "#d52b1e"),
      "#5b5fc7",
      "#8c42ab",
      "#008a9a",
      "#c45f00"
    ]);
    const selectedColor = computed({ get: () => props.color ?? void 0, set: (value) => emit("update:color", value ?? null) });
    function themeHex(variable, fallback) {
      if (typeof window === "undefined") return fallback;
      const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
      return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
    }
    async function pick(kind) {
      try {
        const picker = getFilePickerBuilder(kind === "thumbnail" ? translate("shortlinks", "Choose a custom thumbnail") : translate("shortlinks", "Choose decorative media")).setMultiSelect(false).setMimeTypeFilter(kind === "thumbnail" ? ["image/*"] : ["image/*", "video/*"]).allowDirectories(false).build();
        const nodes = await picker.pickNodes();
        const path = nodes[0]?.path;
        if (!path) return;
        if (kind === "thumbnail") emit("update:thumbnailPath", path);
        else emit("update:mediaPath", path);
      } catch (error) {
        if (!(error instanceof FilePickerClosed)) throw error;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: "appearance-fields",
        "aria-label": unref(translate)("shortlinks", "Appearance and media")
      }, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Share thumbnail")), 1),
            createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "Used in link previews and compact lists.")), 1)
          ]),
          createBaseVNode("button", {
            type: "button",
            class: "thumbnail-picker",
            "aria-label": unref(translate)("shortlinks", "Change thumbnail"),
            onClick: _cache[0] || (_cache[0] = ($event) => pick("thumbnail"))
          }, [
            createVNode(LinkThumbnail, {
              size: "large",
              src: __props.thumbnailSrc,
              alt: ""
            }, null, 8, ["src"]),
            createBaseVNode("span", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiImageEditOutline),
                size: 20
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Change thumbnail")), 1)
            ])
          ], 8, _hoisted_4),
          __props.thumbnailPath ? (openBlock(), createElementBlock("div", _hoisted_5, [
            createVNode(unref(NcIconSvgWrapper), {
              path: unref(mdiImagePlusOutline),
              size: 18
            }, null, 8, ["path"]),
            createBaseVNode("span", null, toDisplayString(__props.thumbnailPath), 1),
            createVNode(unref(NcButton), {
              variant: "tertiary",
              "aria-label": unref(translate)("shortlinks", "Remove custom thumbnail"),
              onClick: _cache[1] || (_cache[1] = ($event) => emit("update:thumbnailPath", null))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiClose) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["aria-label"])
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Decorative media")), 1),
            createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "Images or videos decorate Pages, the sidebar, and cards. A 16:9 format works best.")), 1)
          ]),
          __props.mediaSrc ? (openBlock(), createElementBlock("div", _hoisted_8, [
            __props.mediaMime?.startsWith("video/") ? (openBlock(), createElementBlock("video", {
              key: 0,
              src: __props.mediaSrc,
              muted: "",
              controls: "",
              preload: "metadata"
            }, null, 8, _hoisted_9)) : (openBlock(), createElementBlock("img", {
              key: 1,
              src: __props.mediaSrc,
              alt: ""
            }, null, 8, _hoisted_10))
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_11, [
            createVNode(unref(NcButton), {
              onClick: _cache[2] || (_cache[2] = ($event) => pick("media"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiMovieOpenOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.mediaPath ? unref(translate)("shortlinks", "Change media") : unref(translate)("shortlinks", "Choose media")), 1)
              ]),
              _: 1
            }),
            __props.mediaPath ? (openBlock(), createBlock(unref(NcButton), {
              key: 0,
              variant: "tertiary",
              onClick: _cache[3] || (_cache[3] = ($event) => emit("update:mediaPath", null))
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Remove")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ]),
          __props.mediaPath ? (openBlock(), createElementBlock("small", _hoisted_12, toDisplayString(__props.mediaPath), 1)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_13, [
          createBaseVNode("div", _hoisted_14, [
            createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Link color")), 1),
            createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "Theme colors come first. Cards automatically soften the color for readable contrast.")), 1)
          ]),
          createVNode(unref(NcColorPicker), {
            modelValue: selectedColor.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => selectedColor.value = $event),
            palette: palette.value,
            "advanced-fields": "",
            clearable: ""
          }, {
            default: withCtx(({ attrs }) => [
              createVNode(unref(NcButton), normalizeProps(guardReactiveProps(attrs)), {
                icon: withCtx(() => [
                  createBaseVNode("span", {
                    class: "color-swatch",
                    style: normalizeStyle({ backgroundColor: __props.color || "var(--color-primary-element)" })
                  }, [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPaletteOutline) }, null, 8, ["path"])
                  ], 4)
                ]),
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.color ? __props.color : unref(translate)("shortlinks", "Choose color")), 1)
                ]),
                _: 1
              }, 16)
            ]),
            _: 1
          }, 8, ["modelValue", "palette"])
        ])
      ], 8, _hoisted_1$1);
    };
  }
});
const LinkAppearanceFields = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2f978f95"]]);
const _hoisted_1 = { class: "link-preview-editor__fields" };
const _hoisted_2 = {
  key: 1,
  class: "link-preview-editor__loading",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LinkPreviewEditor",
  props: {
    url: {},
    title: {},
    valid: { type: Boolean },
    thumbnailSrc: { default: "" },
    loading: { type: Boolean, default: false },
    urlError: { default: "" },
    urlHint: { default: "" }
  },
  emits: ["update:url", "update:title", "titleEdited"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function updateTitle(value) {
      emit("update:title", String(value));
      emit("titleEdited");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["link-preview-editor", { "link-preview-editor--expanded": __props.valid }])
      }, [
        __props.valid ? (openBlock(), createBlock(LinkThumbnail, {
          key: 0,
          size: "large",
          src: __props.thumbnailSrc,
          alt: __props.title ? unref(translate)("shortlinks", "Share thumbnail for {title}", { title: __props.title }) : unref(translate)("shortlinks", "Share thumbnail")
        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_1, [
          createVNode(unref(_sfc_main$2), {
            "model-value": __props.url,
            type: "url",
            required: "",
            label: unref(translate)("shortlinks", "Destination URL"),
            "helper-text": __props.url ? __props.urlError : __props.urlHint,
            error: Boolean(__props.url && __props.urlError),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:url", String($event)))
          }, null, 8, ["model-value", "label", "helper-text", "error"]),
          __props.valid ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            "model-value": __props.title,
            label: unref(translate)("shortlinks", "Title"),
            "helper-text": __props.loading ? unref(translate)("shortlinks", "Loading page preview…") : unref(translate)("shortlinks", "Found automatically and editable."),
            "onUpdate:modelValue": updateTitle
          }, null, 8, ["model-value", "label", "helper-text"])) : createCommentVNode("", true),
          __props.loading ? (openBlock(), createElementBlock("span", _hoisted_2, [
            createVNode(unref(NcLoadingIcon), { size: 18 }),
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Loading page preview…")), 1)
          ])) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
});
const LinkPreviewEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f2d0131"]]);
export {
  LinkPreviewEditor as L,
  useLinkMetadataPreview as a,
  LinkAppearanceFields as b,
  useAliasValidation as u
};
