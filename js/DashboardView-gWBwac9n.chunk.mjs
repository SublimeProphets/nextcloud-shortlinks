const appName = "shortlinks";
const appVersion = "1.2.2";
import { an as translate, aY as mdiContentCopy, bh as mdiPlus, bn as mdiDownload, aX as mdiPencilOutline, bo as mdiShapeOutline, ba as mdiShieldLockOutline, bp as mdiDotsHorizontalCircleOutline, bq as mdiClose, be as mdiIdentifier, br as mdiCheck, bf as mdiShareVariantOutline, bs as mdiOpenInNew, aP as mdiFolderOutline, ah as mdiTagOutline, bt as mdiChevronLeft, bu as mdiChevronRight, aF as mdiHistory, aD as mdiStarOutline, bv as mdiChartLine } from "./vendor-CflEb2sm.chunk.mjs";
import { g as NcButton, h as NcIconSvgWrapper, _ as _sfc_main$3, f as NcCheckboxRadioSwitch, m as NcTextArea, q as NcLoadingIcon, N as NcEmptyContent } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api, C as CompactLinkCard } from "./shortlinks-main.mjs";
import { B as BookmarkletGuide } from "./BookmarkletGuide-MqClDYzH.chunk.mjs";
import { W as defineComponent, o as onMounted, w as watch, h as onBeforeUnmount, j as openBlock, p as createElementBlock, D as createBaseVNode, I as toDisplayString, u as unref, P as createVNode, Q as withCtx, F as Fragment, E as renderList, L as createCommentVNode, H as createTextVNode, R as normalizeClass, N as withDirectives, ah as vModelSelect, k as createBlock, V as vModelText, K as withModifiers, r as reactive, x as ref, d as computed, _ as toRef, v as normalizeStyle } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { s as showSuccess, a as showError } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { u as useAliasValidation, a as useLinkMetadataPreview, L as LinkPreviewEditor, b as LinkAppearanceFields } from "./LinkPreviewEditor-DpcJ7el6.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1$2 = {
  class: "quick-create",
  "aria-labelledby": "quick-create-heading"
};
const _hoisted_2$2 = {
  key: 0,
  class: "quick-create__success"
};
const _hoisted_3$2 = { class: "quick-create__result" };
const _hoisted_4$2 = { class: "quick-create__eyebrow" };
const _hoisted_5$2 = { id: "quick-create-heading" };
const _hoisted_6$2 = { class: "created-link-row" };
const _hoisted_7$1 = ["href"];
const _hoisted_8$1 = {
  key: 0,
  class: "created-link-settings"
};
const _hoisted_9$1 = { key: 0 };
const _hoisted_10$1 = { key: 1 };
const _hoisted_11$1 = ["aria-label"];
const _hoisted_12$1 = ["src", "alt"];
const _hoisted_13$1 = { class: "quick-create__intro" };
const _hoisted_14 = { id: "quick-create-heading" };
const _hoisted_15 = { class: "quick-create__url-row" };
const _hoisted_16 = { class: "quick-create__lower" };
const _hoisted_17 = { class: "preview-label" };
const _hoisted_18 = {
  key: 0,
  class: "preview-editor"
};
const _hoisted_19 = ["aria-label"];
const _hoisted_20 = ["aria-label"];
const _hoisted_21 = {
  key: 0,
  class: "quick-create__panel"
};
const _hoisted_22 = {
  key: 0,
  class: "settings-grid"
};
const _hoisted_23 = { class: "select-field" };
const _hoisted_24 = { value: null };
const _hoisted_25 = ["value"];
const _hoisted_26 = {
  key: 0,
  class: "tag-picker"
};
const _hoisted_27 = {
  key: 1,
  class: "settings-grid"
};
const _hoisted_28 = { class: "select-field" };
const _hoisted_29 = ["value"];
const _hoisted_30 = { class: "select-field" };
const _hoisted_31 = ["value"];
const _hoisted_32 = { key: 0 };
const _hoisted_33 = {
  key: 2,
  class: "settings-grid settings-grid--more"
};
const _hoisted_34 = { class: "native-field" };
const _hoisted_35 = { class: "native-field" };
const _hoisted_36 = { class: "limit-field" };
const _hoisted_37 = {
  key: 0,
  class: "native-field"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuickLinkCreator",
  props: {
    folders: {},
    tags: {},
    redirectStatuses: { default: () => [301, 302, 307, 308] },
    allowedSchemes: { default: () => ["http", "https"] },
    shortUrlTemplate: { default: null },
    allowTitleFetch: { type: Boolean, default: false },
    create: {}
  },
  setup(__props) {
    const props = __props;
    const draft = reactive({
      targetUrl: "",
      slug: "",
      title: "",
      description: "",
      folderId: null,
      tagIds: [],
      favorite: false,
      active: true,
      accessMode: "public",
      password: "",
      redirectStatus: 302,
      startsAt: null,
      expiresAt: null,
      clickLimit: null,
      thumbnailPath: null,
      mediaPath: null,
      color: null
    });
    const slug = computed({ get: () => draft.slug, set: (value) => {
      draft.slug = value;
    } });
    const alias = useAliasValidation(slug);
    const aliasEdited = ref(false);
    let aliasTimer;
    const editingAlias = ref(false);
    const activeSettings = ref(null);
    const saving = ref(false);
    const limitClicks = ref(false);
    const createdLink = ref(null);
    const accessModes = [
      { value: "public", label: "Public/unlisted" },
      { value: "authenticated", label: "Signed-in users" },
      { value: "password", label: "Password protected" },
      { value: "disabled", label: "Disabled" }
    ];
    const redirectStatusHints = {
      301: "Permanent redirect. Browsers and search engines may cache it.",
      302: "Temporary redirect. The destination may change.",
      307: "Temporary redirect that preserves the request method.",
      308: "Permanent redirect that preserves the request method."
    };
    const activeRedirectHint = computed(() => redirectStatusHints[draft.redirectStatus] ?? "");
    const accessModeLabels = Object.fromEntries(accessModes.map((mode) => [mode.value, mode.label]));
    const shortUrlParts = computed(() => {
      const template = props.shortUrlTemplate || `${location.origin}/apps/shortlinks/r/{alias}`;
      const [before, ...after] = template.split("{alias}");
      return { before, after: after.join("{alias}") };
    });
    const urlValid = computed(() => {
      try {
        const parsed = new URL(draft.targetUrl);
        return props.allowedSchemes.map((value) => value.toLowerCase()).includes(parsed.protocol.replace(/:$/, "").toLowerCase());
      } catch {
        return false;
      }
    });
    const targetError = computed(() => {
      if (!draft.targetUrl.trim()) return "";
      try {
        const parsed = new URL(draft.targetUrl);
        return props.allowedSchemes.map((value) => value.toLowerCase()).includes(parsed.protocol.replace(/:$/, "").toLowerCase()) ? "" : translate("shortlinks", "This URL scheme is not allowed. Allowed: {schemes}", { schemes: props.allowedSchemes.join(", ") });
      } catch {
        return translate("shortlinks", "Enter a complete URL including its scheme.");
      }
    });
    const metadata = useLinkMetadataPreview(toRef(draft, "targetUrl"), toRef(draft, "title"), urlValid, computed(() => props.allowTitleFetch));
    const canCreate = computed(() => urlValid.value && alias.valid.value && !saving.value && (draft.accessMode !== "password" || Boolean(draft.password)) && (!limitClicks.value || Number(draft.clickLimit) > 0));
    const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: (value) => {
      draft.startsAt = toTimestamp(value);
    } });
    const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: (value) => {
      draft.expiresAt = toTimestamp(value);
    } });
    const organizationDetails = computed(() => {
      const link = createdLink.value;
      if (!link) return [];
      const folder = props.folders.find((item) => item.id === link.folderId);
      return [
        folder ? { label: translate("shortlinks", "Folder"), value: folder.name } : null,
        link.tags.length ? { label: translate("shortlinks", "Tags"), value: link.tags.map((tag) => tag.name).join(", ") } : null,
        link.favorite ? { label: translate("shortlinks", "Favorite"), value: translate("shortlinks", "Yes") } : null,
        link.description ? { label: translate("shortlinks", "Description"), value: link.description } : null
      ].filter((detail) => detail !== null);
    });
    const accessDetails = computed(() => {
      const link = createdLink.value;
      if (!link) return [];
      return [
        link.accessMode !== "public" ? { label: translate("shortlinks", "Access"), value: translate("shortlinks", accessModeLabels[link.accessMode]) } : null,
        link.redirectStatus !== 302 ? { label: translate("shortlinks", "Redirect type"), value: String(link.redirectStatus) } : null,
        link.startsAt !== null ? { label: translate("shortlinks", "Valid from"), value: formatTimestamp(link.startsAt) } : null,
        link.expiresAt !== null ? { label: translate("shortlinks", "Expires at"), value: formatTimestamp(link.expiresAt) } : null,
        link.clickLimit !== null ? { label: translate("shortlinks", "Maximum visits"), value: String(link.clickLimit) } : null,
        !link.active ? { label: translate("shortlinks", "Status"), value: translate("shortlinks", "Disabled") } : null
      ].filter((detail) => detail !== null);
    });
    onMounted(() => alias.suggest({ title: draft.title, targetUrl: draft.targetUrl }));
    watch(() => [draft.title, draft.targetUrl], () => {
      if (aliasEdited.value || !urlValid.value) return;
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
    function toggleSettings(group) {
      activeSettings.value = activeSettings.value === group ? null : group;
    }
    function toggleTag(id) {
      draft.tagIds = draft.tagIds.includes(id) ? draft.tagIds.filter((value) => value !== id) : [...draft.tagIds, id];
    }
    async function submit() {
      if (!canCreate.value) return;
      saving.value = true;
      try {
        createdLink.value = await props.create({
          ...draft,
          targetUrl: draft.targetUrl.trim(),
          slug: draft.slug.trim(),
          tagIds: [...draft.tagIds],
          clickLimit: limitClicks.value ? Number(draft.clickLimit) : null,
          thumbnailUrl: metadata.loaded.value ? metadata.imageUrl.value : void 0
        });
        showSuccess(translate("shortlinks", "Short link created"));
        resetDraft();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        saving.value = false;
      }
    }
    function resetDraft() {
      Object.assign(draft, {
        targetUrl: "",
        slug: "",
        title: "",
        description: "",
        folderId: null,
        tagIds: [],
        favorite: false,
        active: true,
        accessMode: "public",
        password: "",
        redirectStatus: 302,
        startsAt: null,
        expiresAt: null,
        clickLimit: null,
        thumbnailPath: null,
        mediaPath: null,
        color: null
      });
      editingAlias.value = false;
      aliasEdited.value = false;
      activeSettings.value = null;
      limitClicks.value = false;
      metadata.resetTitleEditing();
    }
    async function createAnother() {
      createdLink.value = null;
      await alias.suggest({ title: draft.title, targetUrl: draft.targetUrl });
    }
    async function copyShortUrl() {
      if (!createdLink.value) return;
      try {
        await navigator.clipboard.writeText(createdLink.value.shortUrl);
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    async function loadQrSvg() {
      if (!createdLink.value) throw new Error(translate("shortlinks", "Could not load QR code"));
      const response = await fetch(api.qrUrl(createdLink.value.id, "svg"), {
        credentials: "same-origin",
        headers: { Accept: "image/svg+xml" }
      });
      if (!response.ok) throw new Error(translate("shortlinks", "Could not load QR code"));
      return response.text();
    }
    async function copyQrAsSvg() {
      try {
        const svg = await loadQrSvg();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/svg+xml": blob })]);
          } catch {
            await navigator.clipboard.writeText(svg);
          }
        } else {
          await navigator.clipboard.writeText(svg);
        }
        showSuccess(translate("shortlinks", "QR code copied as SVG"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function formatTimestamp(timestamp) {
      return new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(timestamp * 1e3);
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$2, [
        createdLink.value ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
          createBaseVNode("div", _hoisted_3$2, [
            createBaseVNode("p", _hoisted_4$2, toDisplayString(unref(translate)("shortlinks", "Short link created")), 1),
            createBaseVNode("h2", _hoisted_5$2, toDisplayString(createdLink.value.title || createdLink.value.slug), 1),
            createBaseVNode("div", _hoisted_6$2, [
              createBaseVNode("a", {
                href: createdLink.value.shortUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }, toDisplayString(createdLink.value.shortUrl), 9, _hoisted_7$1),
              createVNode(unref(NcButton), {
                "aria-label": unref(translate)("shortlinks", "Copy link"),
                title: unref(translate)("shortlinks", "Copy link"),
                onClick: copyShortUrl
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["aria-label", "title"])
            ]),
            organizationDetails.value.length || accessDetails.value.length ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
              organizationDetails.value.length ? (openBlock(), createElementBlock("section", _hoisted_9$1, [
                createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Organization")), 1),
                createBaseVNode("dl", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(organizationDetails.value, (detail) => {
                    return openBlock(), createElementBlock("div", {
                      key: detail.label
                    }, [
                      createBaseVNode("dt", null, toDisplayString(detail.label), 1),
                      createBaseVNode("dd", null, toDisplayString(detail.value), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true),
              accessDetails.value.length ? (openBlock(), createElementBlock("section", _hoisted_10$1, [
                createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Access settings")), 1),
                createBaseVNode("dl", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(accessDetails.value, (detail) => {
                    return openBlock(), createElementBlock("div", {
                      key: detail.label
                    }, [
                      createBaseVNode("dt", null, toDisplayString(detail.label), 1),
                      createBaseVNode("dd", null, toDisplayString(detail.value), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true)
            ])) : createCommentVNode("", true),
            createVNode(unref(NcButton), {
              variant: "secondary",
              onClick: createAnother
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Create another short link")), 1)
              ]),
              _: 1
            })
          ]),
          createBaseVNode("aside", {
            class: "quick-create__qr",
            "aria-label": unref(translate)("shortlinks", "QR code")
          }, [
            createBaseVNode("img", {
              src: unref(api).qrUrl(createdLink.value.id, "svg"),
              alt: unref(translate)("shortlinks", "QR code for {title}", { title: createdLink.value.title || createdLink.value.slug })
            }, null, 8, _hoisted_12$1),
            createVNode(unref(NcButton), { onClick: copyQrAsSvg }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Copy QR code as SVG")), 1)
              ]),
              _: 1
            }),
            createVNode(unref(NcButton), {
              href: unref(api).qrUrl(createdLink.value.id, "svg"),
              download: `${createdLink.value.slug}-qr.svg`
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDownload) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Download QR code")), 1)
              ]),
              _: 1
            }, 8, ["href", "download"])
          ], 8, _hoisted_11$1)
        ])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createBaseVNode("div", _hoisted_13$1, [
            createBaseVNode("h2", _hoisted_14, toDisplayString(unref(translate)("shortlinks", "Create a short link")), 1),
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Paste a long URL and share a clean, memorable link in seconds.")), 1)
          ]),
          createBaseVNode("form", {
            onSubmit: withModifiers(submit, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_15, [
              createVNode(LinkPreviewEditor, {
                url: draft.targetUrl,
                title: draft.title,
                valid: urlValid.value,
                loading: unref(metadata).loading.value,
                "thumbnail-src": unref(metadata).thumbnailSrc.value,
                "url-error": targetError.value,
                "url-hint": unref(translate)("shortlinks", "Paste the full address you want to shorten."),
                "onUpdate:url": _cache[0] || (_cache[0] = ($event) => draft.targetUrl = $event),
                "onUpdate:title": _cache[1] || (_cache[1] = ($event) => draft.title = $event),
                onTitleEdited: unref(metadata).markTitleEdited
              }, null, 8, ["url", "title", "valid", "loading", "thumbnail-src", "url-error", "url-hint", "onTitleEdited"]),
              createVNode(unref(NcButton), {
                type: "submit",
                variant: "primary",
                disabled: !canCreate.value
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(saving.value ? unref(translate)("shortlinks", "Creating…") : unref(translate)("shortlinks", "Create")), 1)
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_16, [
              createBaseVNode("div", {
                class: normalizeClass(["quick-create__preview", { "quick-create__preview--editing": editingAlias.value }])
              }, [
                createBaseVNode("span", _hoisted_17, toDisplayString(unref(translate)("shortlinks", "Your short link")), 1),
                editingAlias.value ? (openBlock(), createElementBlock("div", _hoisted_18, [
                  createBaseVNode("span", null, toDisplayString(shortUrlParts.value.before), 1),
                  createVNode(unref(_sfc_main$3), {
                    "model-value": draft.slug,
                    label: unref(translate)("shortlinks", "Alias"),
                    error: unref(alias).state.value === "invalid" || unref(alias).state.value === "unavailable",
                    success: unref(alias).state.value === "available",
                    "onUpdate:modelValue": setAlias
                  }, null, 8, ["model-value", "label", "error", "success"]),
                  createBaseVNode("span", null, toDisplayString(shortUrlParts.value.after), 1)
                ])) : (openBlock(), createElementBlock("button", {
                  key: 1,
                  type: "button",
                  class: "preview-value",
                  "aria-label": unref(translate)("shortlinks", "Edit alias"),
                  onClick: _cache[2] || (_cache[2] = ($event) => editingAlias.value = true)
                }, [
                  createBaseVNode("span", null, toDisplayString(shortUrlParts.value.before), 1),
                  createBaseVNode("mark", null, toDisplayString(draft.slug || "…"), 1),
                  createBaseVNode("span", null, toDisplayString(shortUrlParts.value.after), 1),
                  createVNode(unref(NcIconSvgWrapper), {
                    class: "preview-pencil",
                    path: unref(mdiPencilOutline),
                    size: 18
                  }, null, 8, ["path"])
                ], 8, _hoisted_19)),
                editingAlias.value ? (openBlock(), createElementBlock("p", {
                  key: 2,
                  class: normalizeClass(["alias-feedback", `alias-feedback--${unref(alias).state.value}`]),
                  "aria-live": "polite"
                }, toDisplayString(unref(alias).message.value), 3)) : createCommentVNode("", true)
              ], 2),
              createBaseVNode("div", {
                class: "quick-create__settings",
                role: "toolbar",
                "aria-label": unref(translate)("shortlinks", "Creation settings")
              }, [
                createVNode(unref(NcButton), {
                  pressed: activeSettings.value === "organization",
                  variant: "tertiary",
                  onClick: _cache[3] || (_cache[3] = ($event) => toggleSettings("organization"))
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiShapeOutline) }, null, 8, ["path"])
                  ]),
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Organization")), 1)
                  ]),
                  _: 1
                }, 8, ["pressed"]),
                createVNode(unref(NcButton), {
                  pressed: activeSettings.value === "access",
                  variant: "tertiary",
                  onClick: _cache[4] || (_cache[4] = ($event) => toggleSettings("access"))
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiShieldLockOutline) }, null, 8, ["path"])
                  ]),
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Access")), 1)
                  ]),
                  _: 1
                }, 8, ["pressed"]),
                createVNode(unref(NcButton), {
                  pressed: activeSettings.value === "more",
                  variant: "tertiary",
                  onClick: _cache[5] || (_cache[5] = ($event) => toggleSettings("more"))
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDotsHorizontalCircleOutline) }, null, 8, ["path"])
                  ]),
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "More")), 1)
                  ]),
                  _: 1
                }, 8, ["pressed"])
              ], 8, _hoisted_20)
            ]),
            activeSettings.value ? (openBlock(), createElementBlock("div", _hoisted_21, [
              activeSettings.value === "organization" ? (openBlock(), createElementBlock("div", _hoisted_22, [
                createBaseVNode("label", _hoisted_23, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Folder")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => draft.folderId = $event)
                  }, [
                    createBaseVNode("option", _hoisted_24, toDisplayString(unref(translate)("shortlinks", "No folder")), 1),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.folders, (folder) => {
                      return openBlock(), createElementBlock("option", {
                        key: folder.id,
                        value: folder.id
                      }, toDisplayString(folder.name), 9, _hoisted_25);
                    }), 128))
                  ], 512), [
                    [vModelSelect, draft.folderId]
                  ])
                ]),
                __props.tags.length ? (openBlock(), createElementBlock("fieldset", _hoisted_26, [
                  createBaseVNode("legend", null, toDisplayString(unref(translate)("shortlinks", "Tags")), 1),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
                    return openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                      key: tag.id,
                      type: "checkbox",
                      "model-value": draft.tagIds.includes(tag.id),
                      "onUpdate:modelValue": ($event) => toggleTag(tag.id)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(tag.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onUpdate:modelValue"]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ])) : activeSettings.value === "access" ? (openBlock(), createElementBlock("div", _hoisted_27, [
                createBaseVNode("label", _hoisted_28, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Access")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => draft.accessMode = $event)
                  }, [
                    (openBlock(), createElementBlock(Fragment, null, renderList(accessModes, (mode) => {
                      return createBaseVNode("option", {
                        key: mode.value,
                        value: mode.value
                      }, toDisplayString(unref(translate)("shortlinks", mode.label)), 9, _hoisted_29);
                    }), 64))
                  ], 512), [
                    [vModelSelect, draft.accessMode]
                  ])
                ]),
                createBaseVNode("label", _hoisted_30, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Redirect type")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => draft.redirectStatus = $event)
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.redirectStatuses, (status) => {
                      return openBlock(), createElementBlock("option", {
                        key: status,
                        value: status
                      }, toDisplayString(status) + toDisplayString(redirectStatusHints[status] ? ` — ${unref(translate)("shortlinks", redirectStatusHints[status])}` : ""), 9, _hoisted_31);
                    }), 128))
                  ], 512), [
                    [vModelSelect, draft.redirectStatus]
                  ]),
                  activeRedirectHint.value ? (openBlock(), createElementBlock("small", _hoisted_32, toDisplayString(unref(translate)("shortlinks", activeRedirectHint.value)), 1)) : createCommentVNode("", true)
                ]),
                draft.accessMode === "password" ? (openBlock(), createBlock(unref(_sfc_main$3), {
                  key: 0,
                  modelValue: draft.password,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => draft.password = $event),
                  type: "password",
                  label: unref(translate)("shortlinks", "Password")
                }, null, 8, ["modelValue", "label"])) : createCommentVNode("", true)
              ])) : (openBlock(), createElementBlock("div", _hoisted_33, [
                createVNode(LinkAppearanceFields, {
                  "thumbnail-path": draft.thumbnailPath,
                  "onUpdate:thumbnailPath": _cache[10] || (_cache[10] = ($event) => draft.thumbnailPath = $event),
                  "media-path": draft.mediaPath,
                  "onUpdate:mediaPath": _cache[11] || (_cache[11] = ($event) => draft.mediaPath = $event),
                  color: draft.color,
                  "onUpdate:color": _cache[12] || (_cache[12] = ($event) => draft.color = $event),
                  class: "quick-create__appearance",
                  "thumbnail-src": unref(metadata).thumbnailSrc.value
                }, null, 8, ["thumbnail-path", "media-path", "color", "thumbnail-src"]),
                createVNode(unref(NcTextArea), {
                  modelValue: draft.description,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => draft.description = $event),
                  label: unref(translate)("shortlinks", "Description (optional)")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(NcCheckboxRadioSwitch), {
                  modelValue: draft.favorite,
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => draft.favorite = $event),
                  type: "switch"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Favorite")), 1)
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                createBaseVNode("label", _hoisted_34, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Valid from")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => startsAtLocal.value = $event),
                    type: "datetime-local"
                  }, null, 512), [
                    [vModelText, startsAtLocal.value]
                  ])
                ]),
                createBaseVNode("label", _hoisted_35, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Expires at")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => expiresAtLocal.value = $event),
                    type: "datetime-local"
                  }, null, 512), [
                    [vModelText, expiresAtLocal.value]
                  ])
                ]),
                createBaseVNode("div", _hoisted_36, [
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: limitClicks.value,
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => limitClicks.value = $event),
                    type: "checkbox"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Limit number of visits")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  limitClicks.value ? (openBlock(), createElementBlock("label", _hoisted_37, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Maximum visits")), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => draft.clickLimit = $event),
                      type: "number",
                      min: "1"
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
              ]))
            ])) : createCommentVNode("", true)
          ], 32)
        ], 64))
      ]);
    };
  }
});
const QuickLinkCreator = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3bfd0707"]]);
const _hoisted_1$1 = {
  class: "quick-start",
  "aria-labelledby": "quick-start-title"
};
const _hoisted_2$1 = { class: "quick-start__header" };
const _hoisted_3$1 = { id: "quick-start-title" };
const _hoisted_4$1 = ["aria-label"];
const _hoisted_5$1 = {
  key: 0,
  class: "option-grid"
};
const _hoisted_6$1 = ["onClick"];
const _hoisted_7 = {
  key: 1,
  class: "option-grid"
};
const _hoisted_8 = {
  key: 2,
  class: "option-grid"
};
const _hoisted_9 = ["onClick"];
const _hoisted_10 = {
  key: 3,
  class: "option-grid"
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = {
  key: 5,
  class: "quick-start__done"
};
const _hoisted_13 = { class: "quick-start__actions" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuickStartGuide",
  props: {
    folders: {},
    tags: {},
    shortUrlTemplate: {}
  },
  emits: ["changed", "saved", "hidden"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const step = ref(0);
    const busy = ref(false);
    const aliasChoice = ref("shortest");
    const urlChoice = ref("nextcloud");
    const customUrl = ref("");
    const selectedFolder = ref(null);
    const newFolder = ref("");
    const selectedExamples = ref(["Important"]);
    const newTag = ref("");
    const steps = ["Automatic aliases", "URL to share", "Folders", "Tags", "Bookmarklet", "Done"];
    const currentStep = computed(() => steps[step.value] ?? "Quick Start");
    const nextcloudExample = computed(() => props.shortUrlTemplate?.replace("{alias}", "summer") || `${window.location.origin}/apps/shortlinks/r/summer`);
    const aliasOptions = [
      { id: "shortest", title: "As short as possible", description: "Compact aliases that are quick to type and scan." },
      { id: "readable", title: "Based on destination", description: "Guess a memorable alias from the page title or URL." },
      { id: "random", title: "Random and anonymous", description: "Use an unrelated random alias that reveals no destination context." }
    ];
    const tagExamples = [
      { name: "Important", description: "Things that should stay easy to find.", color: "#e9322d" },
      { name: "Campaign", description: "Shareable links for campaigns and launches.", color: "#8c42ab" },
      { name: "Team", description: "Frequently used links for collaboration.", color: "#0082c9" }
    ];
    const nextDisabled = computed(() => step.value === 1 && urlChoice.value === "custom" && !/^https?:\/\//i.test(customUrl.value.trim()));
    onMounted(async () => {
      selectedFolder.value = props.folders[0]?.id ?? null;
      try {
        const settings = await api.getUserSettings();
        if (settings.aliasStrategy === "readable" || settings.aliasStrategy === "random" || settings.aliasStrategy === "shortest") aliasChoice.value = settings.aliasStrategy;
        urlChoice.value = settings.urlMode === "inherit" ? "nextcloud" : "custom";
        customUrl.value = settings.baseUrl;
      } catch {
      }
    });
    async function hide() {
      busy.value = true;
      try {
        const updated = await api.updateUserSettings({ showQuickStart: false });
        emit("saved", updated);
        emit("hidden");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        busy.value = false;
      }
    }
    async function next() {
      busy.value = true;
      try {
        if (step.value === 0) {
          emit("saved", await api.updateUserSettings({ aliasStrategy: aliasChoice.value }));
        } else if (step.value === 1) {
          emit("saved", await api.updateUserSettings(urlChoice.value === "nextcloud" ? { urlMode: "inherit" } : { urlMode: "simple", baseUrl: customUrl.value.trim() }));
        } else if (step.value === 2 && newFolder.value.trim()) {
          const created = await api.createFolder(newFolder.value.trim());
          selectedFolder.value = created.id;
          newFolder.value = "";
          emit("changed");
        } else if (step.value === 3) {
          const names = [...selectedExamples.value, ...newTag.value.trim() ? [newTag.value.trim()] : []];
          for (const name of names) {
            if (!props.tags.some((tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
              const example = tagExamples.find((tag) => tag.name === name);
              await api.createTag(name, example?.color ?? null);
            }
          }
          newTag.value = "";
          emit("changed");
        }
        if (step.value < steps.length - 1) step.value++;
        else {
          showSuccess(translate("shortlinks", "Quick Start completed"));
          await hide();
        }
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        busy.value = false;
      }
    }
    function toggleExample(name) {
      selectedExamples.value = selectedExamples.value.includes(name) ? selectedExamples.value.filter((item) => item !== name) : [...selectedExamples.value, name];
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createBaseVNode("header", _hoisted_2$1, [
          createBaseVNode("div", null, [
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Quick Start")), 1),
            createBaseVNode("h2", _hoisted_3$1, toDisplayString(unref(translate)("shortlinks", currentStep.value)), 1)
          ]),
          createVNode(unref(NcButton), {
            variant: "tertiary",
            "aria-label": unref(translate)("shortlinks", "Hide Quick Start Guide"),
            onClick: hide
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiClose) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ]),
        createBaseVNode("ol", {
          class: "quick-start__progress",
          "aria-label": unref(translate)("shortlinks", "Quick Start progress")
        }, [
          (openBlock(), createElementBlock(Fragment, null, renderList(steps, (label, index) => {
            return createBaseVNode("li", {
              key: label,
              class: normalizeClass({ active: index === step.value, complete: index < step.value })
            }, [
              createBaseVNode("span", null, toDisplayString(index < step.value ? "✓" : index + 1), 1),
              createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", label)), 1)
            ], 2);
          }), 64))
        ], 8, _hoisted_4$1),
        step.value === 0 ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
          (openBlock(), createElementBlock(Fragment, null, renderList(aliasOptions, (option) => {
            return createBaseVNode("button", {
              key: option.id,
              type: "button",
              class: normalizeClass(["choice-card", { selected: aliasChoice.value === option.id }]),
              onClick: ($event) => aliasChoice.value = option.id
            }, [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiIdentifier) }, null, 8, ["path"]),
              createBaseVNode("span", null, [
                createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", option.title)), 1),
                createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", option.description)), 1)
              ]),
              aliasChoice.value === option.id ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
                key: 0,
                path: unref(mdiCheck)
              }, null, 8, ["path"])) : createCommentVNode("", true)
            ], 10, _hoisted_6$1);
          }), 64))
        ])) : step.value === 1 ? (openBlock(), createElementBlock("div", _hoisted_7, [
          createBaseVNode("button", {
            type: "button",
            class: normalizeClass(["choice-card", { selected: urlChoice.value === "nextcloud" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => urlChoice.value = "nextcloud")
          }, [
            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiShareVariantOutline) }, null, 8, ["path"]),
            createBaseVNode("span", null, [
              createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Use Nextcloud")), 1),
              createBaseVNode("small", null, toDisplayString(nextcloudExample.value), 1)
            ]),
            urlChoice.value === "nextcloud" ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
              key: 0,
              path: unref(mdiCheck)
            }, null, 8, ["path"])) : createCommentVNode("", true)
          ], 2),
          createBaseVNode("button", {
            type: "button",
            class: normalizeClass(["choice-card", { selected: urlChoice.value === "custom" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => urlChoice.value = "custom")
          }, [
            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiOpenInNew) }, null, 8, ["path"]),
            createBaseVNode("span", null, [
              createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "Use a custom domain or URL")), 1),
              createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "Display and copy links from your own short domain.")), 1)
            ]),
            urlChoice.value === "custom" ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
              key: 0,
              path: unref(mdiCheck)
            }, null, 8, ["path"])) : createCommentVNode("", true)
          ], 2),
          urlChoice.value === "custom" ? (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 0,
            modelValue: customUrl.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => customUrl.value = $event),
            type: "url",
            label: unref(translate)("shortlinks", "Custom base URL"),
            "helper-text": unref(translate)("shortlinks", "Example: https://go.example")
          }, null, 8, ["modelValue", "label", "helper-text"])) : createCommentVNode("", true)
        ])) : step.value === 2 ? (openBlock(), createElementBlock("div", _hoisted_8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.folders, (folder) => {
            return openBlock(), createElementBlock("button", {
              key: folder.id,
              type: "button",
              class: normalizeClass(["choice-card choice-card--compact", { selected: selectedFolder.value === folder.id }]),
              onClick: ($event) => selectedFolder.value = folder.id
            }, [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderOutline) }, null, 8, ["path"]),
              createBaseVNode("span", null, [
                createBaseVNode("strong", null, toDisplayString(folder.name), 1),
                createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "{count} links", { count: folder.count })), 1)
              ]),
              selectedFolder.value === folder.id ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
                key: 0,
                path: unref(mdiCheck)
              }, null, 8, ["path"])) : createCommentVNode("", true)
            ], 10, _hoisted_9);
          }), 128)),
          createVNode(unref(_sfc_main$3), {
            modelValue: newFolder.value,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => newFolder.value = $event),
            label: unref(translate)("shortlinks", "Create another folder"),
            "helper-text": unref(translate)("shortlinks", "It will be added when you continue.")
          }, null, 8, ["modelValue", "label", "helper-text"])
        ])) : step.value === 3 ? (openBlock(), createElementBlock("div", _hoisted_10, [
          (openBlock(), createElementBlock(Fragment, null, renderList(tagExamples, (tag) => {
            return createBaseVNode("button", {
              key: tag.name,
              type: "button",
              class: normalizeClass(["choice-card", { selected: selectedExamples.value.includes(tag.name) }]),
              onClick: ($event) => toggleExample(tag.name)
            }, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiTagOutline),
                style: normalizeStyle({ color: tag.color })
              }, null, 8, ["path", "style"]),
              createBaseVNode("span", null, [
                createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", tag.name)), 1),
                createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", tag.description)), 1)
              ]),
              selectedExamples.value.includes(tag.name) ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
                key: 0,
                path: unref(mdiCheck)
              }, null, 8, ["path"])) : createCommentVNode("", true)
            ], 10, _hoisted_11);
          }), 64)),
          createVNode(unref(_sfc_main$3), {
            modelValue: newTag.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newTag.value = $event),
            label: unref(translate)("shortlinks", "Create a custom tag")
          }, null, 8, ["modelValue", "label"])
        ])) : step.value === 4 ? (openBlock(), createBlock(BookmarkletGuide, {
          key: 4,
          "show-heading": false
        })) : (openBlock(), createElementBlock("div", _hoisted_12, [
          createVNode(unref(NcIconSvgWrapper), {
            path: unref(mdiCheck),
            size: 48
          }, null, 8, ["path"]),
          createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "You are ready to create better links")), 1),
          createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Your choices are saved. You can change them at any time in Shortlinks settings.")), 1)
        ])),
        createBaseVNode("footer", _hoisted_13, [
          step.value > 0 ? (openBlock(), createBlock(unref(NcButton), {
            key: 0,
            disabled: busy.value,
            onClick: _cache[5] || (_cache[5] = ($event) => step.value--)
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiChevronLeft) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Back")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])) : createCommentVNode("", true),
          _cache[7] || (_cache[7] = createBaseVNode("span", null, null, -1)),
          step.value < steps.length - 1 ? (openBlock(), createBlock(unref(NcButton), {
            key: 1,
            variant: "tertiary",
            disabled: busy.value,
            onClick: _cache[6] || (_cache[6] = ($event) => step.value++)
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Skip this step")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])) : createCommentVNode("", true),
          createVNode(unref(NcButton), {
            variant: "primary",
            disabled: busy.value || nextDisabled.value,
            onClick: next
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), {
                path: step.value === steps.length - 1 ? unref(mdiCheck) : unref(mdiChevronRight)
              }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(step.value === steps.length - 1 ? unref(translate)("shortlinks", "Finish and hide guide") : unref(translate)("shortlinks", "Continue")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]);
    };
  }
});
const QuickStartGuide = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b57cae8d"]]);
const _hoisted_1 = {
  class: "dashboard-view",
  "aria-labelledby": "dashboard-heading"
};
const _hoisted_2 = {
  id: "dashboard-heading",
  class: "visually-hidden"
};
const _hoisted_3 = {
  key: 2,
  class: "dashboard-state error",
  role: "alert"
};
const _hoisted_4 = {
  key: 3,
  class: "dashboard-columns"
};
const _hoisted_5 = {
  key: 0,
  class: "dashboard-column__cards"
};
const _hoisted_6 = {
  class: "dashboard-bookmarklet",
  "aria-label": "Bookmarklet"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardView",
  props: {
    folders: {},
    tags: {},
    redirectStatuses: { default: () => [301, 302, 307, 308] },
    allowedSchemes: { default: () => ["http", "https"] },
    shortUrlTemplate: { default: null },
    allowTitleFetch: { type: Boolean, default: false },
    useThumbnails: { type: Boolean, default: true },
    showQuickStart: { type: Boolean, default: true },
    create: {}
  },
  emits: ["open", "changed", "settingsSaved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const newest = ref([]);
    const favorites = ref([]);
    const top = ref([]);
    const loading = ref(true);
    const error = ref("");
    onMounted(loadDashboard);
    async function loadDashboard() {
      loading.value = true;
      error.value = "";
      try {
        const [recentResult, favoriteResult, topResult] = await Promise.all([
          api.listLinks({ system: "recent", sort: "created_at", direction: "DESC", page: 1, perPage: 5 }),
          api.listLinks({ system: "favorites", sort: "updated_at", direction: "DESC", page: 1, perPage: 5 }),
          api.listLinks({ system: "top", page: 1, perPage: 5 })
        ]);
        newest.value = recentResult.items;
        favorites.value = favoriteResult.items;
        top.value = topResult.items;
      } catch (caught) {
        error.value = caught instanceof Error ? caught.message : String(caught);
      } finally {
        loading.value = false;
      }
    }
    async function createAndRefresh(draft) {
      const created = await props.create(draft);
      await loadDashboard();
      return created;
    }
    const columns = [
      { key: "newest", title: "Newest links", description: "Recently created", icon: mdiHistory, links: newest },
      { key: "favorites", title: "Favorites", description: "Links you marked as important", icon: mdiStarOutline, links: favorites },
      { key: "top", title: "Top links", description: "Most visits in the last 30 days", icon: mdiChartLine, links: top }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        createBaseVNode("h1", _hoisted_2, toDisplayString(unref(translate)("shortlinks", "Dashboard")), 1),
        __props.showQuickStart ? (openBlock(), createBlock(QuickStartGuide, {
          key: 0,
          folders: __props.folders,
          tags: __props.tags,
          "short-url-template": __props.shortUrlTemplate,
          onChanged: _cache[0] || (_cache[0] = ($event) => emit("changed")),
          onSaved: _cache[1] || (_cache[1] = ($event) => emit("settingsSaved", $event))
        }, null, 8, ["folders", "tags", "short-url-template"])) : createCommentVNode("", true),
        createVNode(QuickLinkCreator, {
          folders: __props.folders,
          tags: __props.tags,
          "redirect-statuses": __props.redirectStatuses,
          "allowed-schemes": __props.allowedSchemes,
          "short-url-template": __props.shortUrlTemplate,
          "allow-title-fetch": __props.allowTitleFetch,
          create: createAndRefresh
        }, null, 8, ["folders", "tags", "redirect-statuses", "allowed-schemes", "short-url-template", "allow-title-fetch"]),
        loading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
          key: 1,
          class: "dashboard-state",
          name: unref(translate)("shortlinks", "Loading dashboard"),
          size: 36
        }, null, 8, ["name"])) : error.value ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_4, [
          (openBlock(), createElementBlock(Fragment, null, renderList(columns, (column) => {
            return createBaseVNode("section", {
              key: column.key,
              class: "dashboard-column"
            }, [
              createBaseVNode("header", null, [
                createVNode(unref(NcIconSvgWrapper), {
                  path: column.icon,
                  size: 24,
                  "aria-hidden": "true"
                }, null, 8, ["path"]),
                createBaseVNode("div", null, [
                  createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", column.title)), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", column.description)), 1)
                ])
              ]),
              column.links.value.length ? (openBlock(), createElementBlock("div", _hoisted_5, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(column.links.value, (link) => {
                  return openBlock(), createBlock(CompactLinkCard, {
                    key: link.id,
                    link,
                    folder: __props.folders.find((folder) => folder.id === link.folderId),
                    "show-thumbnail": __props.useThumbnails,
                    onOpen: _cache[2] || (_cache[2] = ($event) => emit("open", $event))
                  }, null, 8, ["link", "folder", "show-thumbnail"]);
                }), 128))
              ])) : (openBlock(), createBlock(unref(NcEmptyContent), {
                key: 1,
                name: unref(translate)("shortlinks", "No links to show"),
                description: unref(translate)("shortlinks", "This section fills up as you use Shortlinks.")
              }, null, 8, ["name", "description"]))
            ]);
          }), 64))
        ])),
        createBaseVNode("section", _hoisted_6, [
          createVNode(BookmarkletGuide, { compact: "" })
        ])
      ]);
    };
  }
});
const DashboardView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6e3e4418"]]);
export {
  DashboardView as default
};
