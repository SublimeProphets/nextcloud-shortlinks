const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, r as reactive, x as ref, o as onMounted, w as watch, h as onBeforeUnmount, j as openBlock, k as createBlock, Q as withCtx, D as createBaseVNode, K as withModifiers, P as createVNode, u as unref, I as toDisplayString, G as mergeProps, H as createTextVNode, p as createElementBlock, N as withDirectives, F as Fragment, E as renderList, ah as vModelSelect, L as createCommentVNode, V as vModelText, d as computed, _ as toRef } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { aC as mdiLinkVariant, an as translate, b1 as mdiInformationOutline, bD as mdiRefresh } from "./vendor-CflEb2sm.chunk.mjs";
import { a as showError } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { h as NcIconSvgWrapper, _ as _sfc_main$1, o as NcPopover, g as NcButton, m as NcTextArea, f as NcCheckboxRadioSwitch, a as NcDialog } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { F as FolderTreeList, T as TagList, a as api } from "./shortlinks-main.mjs";
import { u as useAliasValidation, a as useLinkMetadataPreview, L as LinkPreviewEditor, b as LinkAppearanceFields } from "./LinkPreviewEditor-DpcJ7el6.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1 = {
  class: "form-section form-section--primary",
  "aria-labelledby": "destination-heading"
};
const _hoisted_2 = { class: "section-heading" };
const _hoisted_3 = { id: "destination-heading" };
const _hoisted_4 = { class: "alias-field-row" };
const _hoisted_5 = { class: "component-field" };
const _hoisted_6 = { for: "shortlinks-alias" };
const _hoisted_7 = { class: "alias-actions" };
const _hoisted_8 = { class: "alias-popover" };
const _hoisted_9 = {
  class: "short-url-preview",
  "aria-live": "polite"
};
const _hoisted_10 = {
  class: "form-section",
  "aria-labelledby": "appearance-heading"
};
const _hoisted_11 = { class: "section-heading section-heading--plain" };
const _hoisted_12 = { id: "appearance-heading" };
const _hoisted_13 = {
  class: "form-section",
  "aria-labelledby": "organization-heading"
};
const _hoisted_14 = { class: "section-heading section-heading--plain" };
const _hoisted_15 = { id: "organization-heading" };
const _hoisted_16 = { class: "organization-grid" };
const _hoisted_17 = { class: "organization-list" };
const _hoisted_18 = { class: "organization-list" };
const _hoisted_19 = {
  key: 1,
  class: "empty-list"
};
const _hoisted_20 = {
  key: 0,
  class: "inline-create"
};
const _hoisted_21 = {
  class: "form-section",
  "aria-labelledby": "access-heading"
};
const _hoisted_22 = { class: "section-heading section-heading--plain" };
const _hoisted_23 = { id: "access-heading" };
const _hoisted_24 = { class: "form-grid" };
const _hoisted_25 = { class: "select-field" };
const _hoisted_26 = ["value"];
const _hoisted_27 = { class: "select-field" };
const _hoisted_28 = ["value"];
const _hoisted_29 = {
  key: 0,
  class: "warning"
};
const _hoisted_30 = { class: "form-grid" };
const _hoisted_31 = { class: "native-field" };
const _hoisted_32 = { class: "native-field" };
const _hoisted_33 = { class: "click-limit" };
const _hoisted_34 = {
  key: 0,
  class: "native-field"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LinkForm",
  props: {
    folders: {},
    tags: {},
    redirectStatuses: { default: () => [301, 302, 307, 308] },
    allowedSchemes: { default: () => ["http", "https"] },
    shortUrlTemplate: { default: null },
    prefillUrl: { default: "" },
    prefillTitle: { default: "" },
    prefillAlias: { default: "" },
    prefillFolderId: { default: null },
    prefillTagIds: { default: () => [] },
    link: { default: void 0 },
    allowTitleFetch: { type: Boolean, default: false }
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const draft = reactive({
      targetUrl: props.link?.targetUrl ?? props.prefillUrl,
      title: props.link?.title ?? props.prefillTitle,
      slug: props.link?.slug ?? props.prefillAlias,
      description: props.link?.description ?? "",
      folderId: props.link?.folderId ?? props.prefillFolderId,
      tagIds: props.link?.tags.map((tag) => tag.id) ?? [...props.prefillTagIds],
      active: props.link?.active ?? true,
      favorite: props.link?.favorite ?? false,
      accessMode: props.link?.accessMode ?? "public",
      password: "",
      redirectStatus: props.link?.redirectStatus ?? 302,
      startsAt: props.link?.startsAt ?? null,
      expiresAt: props.link?.expiresAt ?? null,
      clickLimit: props.link?.clickLimit ?? null,
      thumbnailPath: props.link?.thumbnailPath ?? null,
      mediaPath: props.link?.mediaPath ?? null,
      color: props.link?.color ?? null
    });
    const slug = computed({ get: () => draft.slug, set: (value) => {
      draft.slug = value;
    } });
    const alias = useAliasValidation(slug, props.link?.slug);
    const aliasEdited = ref(Boolean(props.link || props.prefillAlias));
    let aliasTimer;
    const newTagName = ref("");
    const addingTag = ref(false);
    const availableTags = ref([...props.tags]);
    const limitClicks = ref(props.link?.clickLimit !== null && props.link?.clickLimit !== void 0);
    const accessModes = [
      { value: "public", label: "Public/unlisted" },
      { value: "authenticated", label: "Signed-in users" },
      { value: "users", label: "Selected users" },
      { value: "groups", label: "Selected groups" },
      { value: "password", label: "Password protected" },
      { value: "disabled", label: "Disabled" }
    ];
    const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: (value) => {
      draft.startsAt = toTimestamp(value);
    } });
    const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: (value) => {
      draft.expiresAt = toTimestamp(value);
    } });
    const targetError = computed(() => {
      if (!draft.targetUrl.trim()) return translate("shortlinks", "Enter a destination URL.");
      try {
        const parsed = new URL(draft.targetUrl);
        const scheme = parsed.protocol.replace(/:$/, "").toLowerCase();
        return props.allowedSchemes.map((value) => value.toLowerCase()).includes(scheme) ? "" : translate("shortlinks", "This URL scheme is not allowed. Allowed: {schemes}", { schemes: props.allowedSchemes.join(", ") });
      } catch {
        return translate("shortlinks", "Enter a complete URL including its scheme.");
      }
    });
    const targetValid = computed(() => !targetError.value);
    const metadata = useLinkMetadataPreview(toRef(draft, "targetUrl"), toRef(draft, "title"), targetValid, computed(() => props.allowTitleFetch));
    const appearanceThumbnail = computed(() => draft.thumbnailPath && draft.thumbnailPath === props.link?.thumbnailPath ? props.link.thumbnailMediaUrl ?? "" : metadata.thumbnailSrc.value);
    const appearanceMedia = computed(() => draft.mediaPath && draft.mediaPath === props.link?.mediaPath ? props.link.mediaUrl ?? "" : "");
    const shortUrlParts = computed(() => {
      const template = props.shortUrlTemplate || `${location.origin}/apps/shortlinks/r/{alias}`;
      const [before, ...after] = template.split("{alias}");
      return { before, after: after.join("{alias}") };
    });
    const canSave = computed(() => !targetError.value && alias.valid.value && (draft.accessMode !== "password" || Boolean(draft.password) || Boolean(props.link?.passwordProtected)) && (!limitClicks.value || Number(draft.clickLimit) > 0));
    onMounted(() => {
      if (!draft.slug) alias.suggest({ title: draft.title, targetUrl: draft.targetUrl });
    });
    watch(() => [draft.title, draft.targetUrl], () => {
      if (props.link || aliasEdited.value || !targetValid.value) return;
      if (aliasTimer) clearTimeout(aliasTimer);
      aliasTimer = setTimeout(() => alias.suggest({ title: draft.title, targetUrl: draft.targetUrl }), 450);
    });
    onBeforeUnmount(() => {
      if (aliasTimer) clearTimeout(aliasTimer);
    });
    function setAlias(value) {
      aliasEdited.value = true;
      draft.slug = String(value);
    }
    function regenerateAlias() {
      aliasEdited.value = false;
      alias.suggest({ title: draft.title, targetUrl: draft.targetUrl });
    }
    function toggleTag(id) {
      const values = draft.tagIds ?? [];
      draft.tagIds = values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
    }
    async function createTag() {
      const name = newTagName.value.trim();
      if (!name) return;
      try {
        const tag = await api.createTag(name);
        availableTags.value.push(tag);
        draft.tagIds = [...draft.tagIds, tag.id];
        newTagName.value = "";
        addingTag.value = false;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function toLocal(timestamp) {
      if (timestamp === null) return "";
      const date = new Date(timestamp * 1e3);
      return new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    }
    function toTimestamp(value) {
      if (!value) return null;
      const milliseconds = new Date(value).getTime();
      return Number.isFinite(milliseconds) ? Math.floor(milliseconds / 1e3) : null;
    }
    function submit() {
      if (!canSave.value) return;
      const payload = {
        ...draft,
        targetUrl: draft.targetUrl.trim(),
        slug: draft.slug.trim(),
        tagIds: [...draft.tagIds],
        clickLimit: limitClicks.value ? Number(draft.clickLimit) : null,
        thumbnailUrl: metadata.loaded.value ? metadata.imageUrl.value : void 0
      };
      if (props.link && !payload.password) delete payload.password;
      emit("save", payload);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: __props.link ? unref(translate)("shortlinks", "Edit short link") : unref(translate)("shortlinks", "New short link"),
        size: "large",
        onClosing: _cache[19] || (_cache[19] = ($event) => emit("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[18] || (_cache[18] = ($event) => emit("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            type: "submit",
            form: "shortlink-form",
            variant: "primary",
            disabled: !canSave.value
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.link ? unref(translate)("shortlinks", "Save changes") : unref(translate)("shortlinks", "Create")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        default: withCtx(() => [
          createBaseVNode("form", {
            id: "shortlink-form",
            class: "link-form",
            onSubmit: withModifiers(submit, ["prevent"])
          }, [
            createBaseVNode("section", _hoisted_1, [
              createBaseVNode("div", _hoisted_2, [
                createVNode(unref(NcIconSvgWrapper), {
                  path: unref(mdiLinkVariant),
                  size: 28,
                  "aria-hidden": "true"
                }, null, 8, ["path"]),
                createBaseVNode("div", null, [
                  createBaseVNode("h2", _hoisted_3, toDisplayString(unref(translate)("shortlinks", "Destination and short URL")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Where should the short link lead, and how should it be named?")), 1)
                ])
              ]),
              createVNode(LinkPreviewEditor, {
                url: draft.targetUrl,
                title: draft.title,
                valid: targetValid.value,
                loading: unref(metadata).loading.value,
                "thumbnail-src": unref(metadata).thumbnailSrc.value,
                "url-error": targetError.value,
                "url-hint": unref(translate)("shortlinks", "Paste the full address you want to shorten."),
                "onUpdate:url": _cache[0] || (_cache[0] = ($event) => draft.targetUrl = $event),
                "onUpdate:title": _cache[1] || (_cache[1] = ($event) => draft.title = $event),
                onTitleEdited: unref(metadata).markTitleEdited
              }, null, 8, ["url", "title", "valid", "loading", "thumbnail-src", "url-error", "url-hint", "onTitleEdited"]),
              createBaseVNode("div", _hoisted_4, [
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("label", _hoisted_6, toDisplayString(unref(translate)("shortlinks", "Alias")), 1),
                  createVNode(unref(_sfc_main$1), {
                    id: "shortlinks-alias",
                    "model-value": draft.slug,
                    required: "",
                    "helper-text": unref(alias).message.value,
                    error: unref(alias).state.value === "invalid" || unref(alias).state.value === "unavailable",
                    success: unref(alias).state.value === "available",
                    "onUpdate:modelValue": setAlias
                  }, null, 8, ["model-value", "helper-text", "error", "success"])
                ]),
                createBaseVNode("div", _hoisted_7, [
                  createVNode(unref(NcPopover), null, {
                    trigger: withCtx(({ attrs }) => [
                      createVNode(unref(NcButton), mergeProps(attrs, {
                        variant: "tertiary-no-background",
                        "aria-label": unref(translate)("shortlinks", "Alias rules")
                      }), {
                        icon: withCtx(() => [
                          createVNode(unref(NcIconSvgWrapper), { path: unref(mdiInformationOutline) }, null, 8, ["path"])
                        ]),
                        _: 1
                      }, 16, ["aria-label"])
                    ]),
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_8, [
                        createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Alias rules")), 1),
                        createBaseVNode("ul", null, [
                          createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Start with a letter or number.")), 1),
                          createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Use letters, numbers, hyphens, and underscores only.")), 1),
                          createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Maximum length: 128 characters.")), 1),
                          createBaseVNode("li", null, toDisplayString(unref(translate)("shortlinks", "Every alias must be unique.")), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NcButton), {
                    variant: "tertiary-no-background",
                    "aria-label": unref(translate)("shortlinks", "Generate another alias"),
                    onClick: regenerateAlias
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiRefresh) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["aria-label"])
                ])
              ]),
              createBaseVNode("p", _hoisted_9, [
                createBaseVNode("span", null, toDisplayString(shortUrlParts.value.before), 1),
                createBaseVNode("strong", null, toDisplayString(draft.slug || "…"), 1),
                createBaseVNode("span", null, toDisplayString(shortUrlParts.value.after), 1)
              ])
            ]),
            _cache[20] || (_cache[20] = createBaseVNode("hr", null, null, -1)),
            createBaseVNode("section", _hoisted_10, [
              createBaseVNode("div", _hoisted_11, [
                createBaseVNode("div", null, [
                  createBaseVNode("h2", _hoisted_12, toDisplayString(unref(translate)("shortlinks", "Appearance and media")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Choose how this link appears in previews, cards, Pages, and the sidebar.")), 1)
                ])
              ]),
              createVNode(LinkAppearanceFields, {
                "thumbnail-path": draft.thumbnailPath,
                "onUpdate:thumbnailPath": _cache[2] || (_cache[2] = ($event) => draft.thumbnailPath = $event),
                "media-path": draft.mediaPath,
                "onUpdate:mediaPath": _cache[3] || (_cache[3] = ($event) => draft.mediaPath = $event),
                color: draft.color,
                "onUpdate:color": _cache[4] || (_cache[4] = ($event) => draft.color = $event),
                "thumbnail-src": appearanceThumbnail.value,
                "media-src": appearanceMedia.value,
                "media-mime": __props.link?.mediaMime
              }, null, 8, ["thumbnail-path", "media-path", "color", "thumbnail-src", "media-src", "media-mime"])
            ]),
            _cache[21] || (_cache[21] = createBaseVNode("hr", null, null, -1)),
            createBaseVNode("section", _hoisted_13, [
              createBaseVNode("div", _hoisted_14, [
                createBaseVNode("div", null, [
                  createBaseVNode("h2", _hoisted_15, toDisplayString(unref(translate)("shortlinks", "Details and organization")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Add context and keep your short links easy to find.")), 1)
                ])
              ]),
              createVNode(unref(NcTextArea), {
                modelValue: draft.description,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => draft.description = $event),
                label: unref(translate)("shortlinks", "Description (optional)")
              }, null, 8, ["modelValue", "label"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: draft.favorite,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => draft.favorite = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Favorite")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("section", null, [
                  createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Folder")), 1),
                  createBaseVNode("div", _hoisted_17, [
                    createVNode(FolderTreeList, {
                      folders: __props.folders,
                      mode: "select",
                      "allow-root": "",
                      "selected-id": draft.folderId,
                      onSelect: _cache[7] || (_cache[7] = ($event) => draft.folderId = $event)
                    }, null, 8, ["folders", "selected-id"])
                  ])
                ]),
                createBaseVNode("section", null, [
                  createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Tags")), 1),
                  createBaseVNode("div", _hoisted_18, [
                    availableTags.value.length ? (openBlock(), createBlock(TagList, {
                      key: 0,
                      tags: availableTags.value,
                      mode: "select",
                      "selected-ids": draft.tagIds,
                      onToggle: _cache[8] || (_cache[8] = ($event) => toggleTag($event.id))
                    }, null, 8, ["tags", "selected-ids"])) : (openBlock(), createElementBlock("p", _hoisted_19, toDisplayString(unref(translate)("shortlinks", "No tags yet")), 1))
                  ]),
                  addingTag.value ? (openBlock(), createElementBlock("div", _hoisted_20, [
                    createVNode(unref(_sfc_main$1), {
                      modelValue: newTagName.value,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => newTagName.value = $event),
                      label: unref(translate)("shortlinks", "Tag name")
                    }, null, 8, ["modelValue", "label"]),
                    createVNode(unref(NcButton), {
                      type: "button",
                      variant: "primary",
                      disabled: !newTagName.value.trim(),
                      onClick: createTag
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add")), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])) : (openBlock(), createBlock(unref(NcButton), {
                    key: 1,
                    type: "button",
                    variant: "tertiary",
                    onClick: _cache[10] || (_cache[10] = ($event) => addingTag.value = true)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "New tag")), 1)
                    ]),
                    _: 1
                  }))
                ])
              ])
            ]),
            _cache[22] || (_cache[22] = createBaseVNode("hr", null, null, -1)),
            createBaseVNode("section", _hoisted_21, [
              createBaseVNode("div", _hoisted_22, [
                createBaseVNode("div", null, [
                  createBaseVNode("h2", _hoisted_23, toDisplayString(unref(translate)("shortlinks", "Access settings")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Control who can use the link and for how long.")), 1)
                ])
              ]),
              createBaseVNode("div", _hoisted_24, [
                createBaseVNode("label", _hoisted_25, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Redirect type")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => draft.redirectStatus = $event)
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.redirectStatuses, (status) => {
                      return openBlock(), createElementBlock("option", {
                        key: status,
                        value: status
                      }, toDisplayString(status), 9, _hoisted_26);
                    }), 128))
                  ], 512), [
                    [vModelSelect, draft.redirectStatus]
                  ])
                ]),
                createBaseVNode("label", _hoisted_27, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Access")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => draft.accessMode = $event)
                  }, [
                    (openBlock(), createElementBlock(Fragment, null, renderList(accessModes, (mode) => {
                      return createBaseVNode("option", {
                        key: mode.value,
                        value: mode.value
                      }, toDisplayString(unref(translate)("shortlinks", mode.label)), 9, _hoisted_28);
                    }), 64))
                  ], 512), [
                    [vModelSelect, draft.accessMode]
                  ])
                ])
              ]),
              draft.redirectStatus === 301 || draft.redirectStatus === 308 ? (openBlock(), createElementBlock("p", _hoisted_29, toDisplayString(unref(translate)("shortlinks", "Permanent redirects can be cached, making statistics incomplete.")), 1)) : createCommentVNode("", true),
              draft.accessMode === "password" ? (openBlock(), createBlock(unref(_sfc_main$1), {
                key: 1,
                modelValue: draft.password,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => draft.password = $event),
                type: "password",
                autocomplete: "new-password",
                required: !__props.link?.passwordProtected,
                label: unref(translate)("shortlinks", "Password")
              }, null, 8, ["modelValue", "required", "label"])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_30, [
                createBaseVNode("label", _hoisted_31, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Valid from")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => startsAtLocal.value = $event),
                    type: "datetime-local"
                  }, null, 512), [
                    [vModelText, startsAtLocal.value]
                  ])
                ]),
                createBaseVNode("label", _hoisted_32, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Expires at")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => expiresAtLocal.value = $event),
                    type: "datetime-local"
                  }, null, 512), [
                    [vModelText, expiresAtLocal.value]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_33, [
                createVNode(unref(NcCheckboxRadioSwitch), {
                  modelValue: limitClicks.value,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => limitClicks.value = $event),
                  type: "checkbox"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Limit number of visits")), 1)
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                limitClicks.value ? (openBlock(), createElementBlock("label", _hoisted_34, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Maximum visits")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => draft.clickLimit = $event),
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, 512), [
                    [
                      vModelText,
                      draft.clickLimit,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])) : createCommentVNode("", true)
              ])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const LinkForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7da293aa"]]);
export {
  LinkForm as default
};
