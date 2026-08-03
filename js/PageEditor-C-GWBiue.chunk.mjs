const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, j as openBlock, p as createElementBlock, v as normalizeStyle, D as createBaseVNode, I as toDisplayString, u as unref, L as createCommentVNode, F as Fragment, E as renderList, R as normalizeClass, k as createBlock, Q as withCtx, P as createVNode, H as createTextVNode, l as resolveDynamicComponent, d as computed, r as reactive, x as ref, w as watch, o as onMounted, N as withDirectives, V as vModelText, J as withKeys, K as withModifiers, ah as vModelSelect, G as mergeProps } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate, aG as mdiCursorDefaultClickOutline, aP as mdiFolderOutline, ah as mdiTagOutline, a_ as mdiLockOutline, bI as mdiFileOutline, by as mdiAccountOutline, bJ as mdiEmailOutline, bK as mdiPhoneOutline, bL as mdiArrowLeft, bM as mdiContentSaveOutline, bN as mdiFormatListBulleted, bH as mdiPaletteOutline, br as mdiCheck, bo as mdiShapeOutline, bO as mdiFileMultipleOutline, bP as mdiFilePlusOutline, bq as mdiClose, au as mdiMagnify, bQ as mdiEyeOutline } from "./vendor-CflEb2sm.chunk.mjs";
import { a as showError, g as getFilePickerBuilder, F as FilePickerClosed } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { h as NcIconSvgWrapper, g as NcButton, _ as _sfc_main$2, m as NcTextArea, f as NcCheckboxRadioSwitch, D as NcColorPicker } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api, b as folderIconPath } from "./shortlinks-main.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1$1 = {
  key: 0,
  class: "page-preview__header"
};
const _hoisted_2$1 = {
  class: "page-preview__mark",
  "aria-hidden": "true"
};
const _hoisted_3$1 = { key: 0 };
const _hoisted_4$1 = { class: "page-preview__groups" };
const _hoisted_5$1 = { key: 0 };
const _hoisted_6$1 = {
  key: 0,
  class: "page-link__media"
};
const _hoisted_7$1 = ["src"];
const _hoisted_8$1 = ["src"];
const _hoisted_9$1 = ["src"];
const _hoisted_10$1 = { class: "page-link__content" };
const _hoisted_11$1 = { key: 0 };
const _hoisted_12$1 = { key: 1 };
const _hoisted_13$1 = { key: 2 };
const _hoisted_14$1 = { key: 3 };
const _hoisted_15$1 = { class: "page-link__meta" };
const _hoisted_16$1 = { key: 0 };
const _hoisted_17$1 = { key: 1 };
const _hoisted_18$1 = { key: 2 };
const _hoisted_19$1 = { key: 3 };
const _hoisted_20$1 = {
  key: 0,
  class: "page-preview__content-section"
};
const _hoisted_21$1 = { class: "page-preview__content-grid" };
const _hoisted_22$1 = { class: "page-content-card__icon" };
const _hoisted_23$1 = {
  key: 1,
  class: "page-preview__content-section"
};
const _hoisted_24$1 = { class: "page-preview__content-grid" };
const _hoisted_25$1 = { class: "page-content-card__icon" };
const _hoisted_26$1 = { key: 0 };
const _hoisted_27$1 = { key: 1 };
const _hoisted_28$1 = { key: 2 };
const _hoisted_29$1 = {
  key: 2,
  class: "page-preview__empty"
};
const _hoisted_30$1 = { key: 1 };
const _hoisted_31$1 = { key: 0 };
const _hoisted_32$1 = { key: 1 };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PagePreview",
  props: {
    draft: {},
    links: {},
    folders: {},
    interactive: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const selectedLinks = computed(() => props.links.filter((link) => props.draft.linkIds.includes(link.id) || link.folderId !== null && props.draft.folderIds.includes(link.folderId) || link.tags.some((tag) => props.draft.tagIds.includes(tag.id))));
    const previewStyle = computed(() => ({
      "--page-background": props.draft.theme.background || "var(--color-main-background)",
      "--page-text": props.draft.theme.text || "var(--color-main-text)",
      "--page-primary": props.draft.theme.primary || "var(--color-primary-element)",
      "--page-surface": props.draft.theme.surface || "var(--color-background-hover)"
    }));
    const groupedLinks = computed(() => {
      if (props.draft.grouping === "none") return [{ key: "", title: "", links: selectedLinks.value }];
      const groups = /* @__PURE__ */ new Map();
      selectedLinks.value.forEach((link) => {
        const keys = props.draft.grouping === "folder" ? [props.folders.find((folder) => folder.id === link.folderId)?.name || translate("shortlinks", "Without folder")] : link.tags.length ? link.tags.map((tag) => tag.name) : [translate("shortlinks", "Without tag")];
        keys.forEach((key) => groups.set(key, [...groups.get(key) ?? [], link]));
      });
      return [...groups.entries()].map(([title, links]) => ({ key: title, title, links }));
    });
    function field(name) {
      return props.draft.visibleFields.includes(name);
    }
    function targetDomain(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
    function fileName(path) {
      return path.split("/").filter(Boolean).at(-1) || path;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", {
        class: "page-preview",
        style: normalizeStyle(previewStyle.value)
      }, [
        __props.draft.header.title !== false ? (openBlock(), createElementBlock("header", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, toDisplayString((__props.draft.title || "S").slice(0, 1).toUpperCase()), 1),
          createBaseVNode("h1", null, toDisplayString(__props.draft.title || unref(translate)("shortlinks", "Untitled page")), 1),
          __props.draft.header.lead !== false && __props.draft.lead ? (openBlock(), createElementBlock("p", _hoisted_3$1, toDisplayString(__props.draft.lead), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_4$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(groupedLinks.value, (group) => {
            return openBlock(), createElementBlock("section", {
              key: group.key
            }, [
              group.title ? (openBlock(), createElementBlock("h2", _hoisted_5$1, toDisplayString(group.title), 1)) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: normalizeClass(["page-preview__links", `layout--${__props.draft.layout}`])
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(group.links, (link) => {
                  return openBlock(), createBlock(resolveDynamicComponent(__props.interactive ? "a" : "div"), {
                    key: link.id,
                    class: "page-link",
                    href: __props.interactive ? link.shortUrl : void 0,
                    style: normalizeStyle({ "--item-accent": link.color || "var(--page-primary)" })
                  }, {
                    default: withCtx(() => [
                      field("media") && link.mediaUrl ? (openBlock(), createElementBlock("div", _hoisted_6$1, [
                        link.mediaMime?.startsWith("video/") ? (openBlock(), createElementBlock("video", {
                          key: 0,
                          src: link.mediaUrl,
                          muted: "",
                          playsinline: "",
                          preload: "metadata"
                        }, null, 8, _hoisted_7$1)) : (openBlock(), createElementBlock("img", {
                          key: 1,
                          src: link.mediaUrl,
                          alt: ""
                        }, null, 8, _hoisted_8$1))
                      ])) : createCommentVNode("", true),
                      field("thumbnail") && link.thumbnailMediaUrl ? (openBlock(), createElementBlock("img", {
                        key: 1,
                        class: "page-link__thumbnail",
                        src: link.thumbnailMediaUrl,
                        alt: ""
                      }, null, 8, _hoisted_9$1)) : createCommentVNode("", true),
                      createBaseVNode("div", _hoisted_10$1, [
                        field("title") ? (openBlock(), createElementBlock("strong", _hoisted_11$1, toDisplayString(link.title || link.slug), 1)) : createCommentVNode("", true),
                        field("description") && link.description ? (openBlock(), createElementBlock("span", _hoisted_12$1, toDisplayString(link.description), 1)) : createCommentVNode("", true),
                        field("domain") ? (openBlock(), createElementBlock("small", _hoisted_13$1, toDisplayString(targetDomain(link.targetUrl)), 1)) : createCommentVNode("", true),
                        field("shortUrl") ? (openBlock(), createElementBlock("code", _hoisted_14$1, "…/" + toDisplayString(link.slug), 1)) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_15$1, [
                          field("clicks") ? (openBlock(), createElementBlock("span", _hoisted_16$1, [
                            createVNode(unref(NcIconSvgWrapper), {
                              path: unref(mdiCursorDefaultClickOutline),
                              size: 15
                            }, null, 8, ["path"]),
                            createTextVNode(toDisplayString(link.clickCount), 1)
                          ])) : createCommentVNode("", true),
                          field("folder") && link.folderId ? (openBlock(), createElementBlock("span", _hoisted_17$1, [
                            createVNode(unref(NcIconSvgWrapper), {
                              path: unref(mdiFolderOutline),
                              size: 15
                            }, null, 8, ["path"]),
                            createTextVNode(toDisplayString(__props.folders.find((folder) => folder.id === link.folderId)?.name), 1)
                          ])) : createCommentVNode("", true),
                          field("tags") && link.tags.length ? (openBlock(), createElementBlock("span", _hoisted_18$1, [
                            createVNode(unref(NcIconSvgWrapper), {
                              path: unref(mdiTagOutline),
                              size: 15
                            }, null, 8, ["path"]),
                            createTextVNode(toDisplayString(link.tags.map((tag) => tag.name).join(", ")), 1)
                          ])) : createCommentVNode("", true),
                          link.passwordProtected ? (openBlock(), createElementBlock("span", _hoisted_19$1, [
                            createVNode(unref(NcIconSvgWrapper), {
                              path: unref(mdiLockOutline),
                              size: 15
                            }, null, 8, ["path"])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["href", "style"]);
                }), 128))
              ], 2)
            ]);
          }), 128)),
          __props.draft.filePaths.length ? (openBlock(), createElementBlock("section", _hoisted_20$1, [
            createBaseVNode("h2", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiFileOutline),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Files")), 1)
            ]),
            createBaseVNode("div", _hoisted_21$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.draft.filePaths, (path) => {
                return openBlock(), createElementBlock("div", {
                  key: path,
                  class: "page-content-card"
                }, [
                  createBaseVNode("span", _hoisted_22$1, [
                    createVNode(unref(NcIconSvgWrapper), {
                      path: unref(mdiFileOutline),
                      size: 28
                    }, null, 8, ["path"])
                  ]),
                  createBaseVNode("span", null, [
                    createBaseVNode("strong", null, toDisplayString(fileName(path)), 1),
                    createBaseVNode("small", null, toDisplayString(path), 1)
                  ])
                ]);
              }), 128))
            ])
          ])) : createCommentVNode("", true),
          __props.draft.contacts.length ? (openBlock(), createElementBlock("section", _hoisted_23$1, [
            createBaseVNode("h2", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiAccountOutline),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Contacts")), 1)
            ]),
            createBaseVNode("div", _hoisted_24$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.draft.contacts, (contact) => {
                return openBlock(), createElementBlock("div", {
                  key: contact.key,
                  class: "page-content-card page-content-card--contact"
                }, [
                  createBaseVNode("span", _hoisted_25$1, [
                    createVNode(unref(NcIconSvgWrapper), {
                      path: unref(mdiAccountOutline),
                      size: 28
                    }, null, 8, ["path"])
                  ]),
                  createBaseVNode("span", null, [
                    createBaseVNode("strong", null, toDisplayString(contact.name), 1),
                    contact.organization ? (openBlock(), createElementBlock("small", _hoisted_26$1, toDisplayString(contact.organization), 1)) : createCommentVNode("", true),
                    contact.emails[0] ? (openBlock(), createElementBlock("small", _hoisted_27$1, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiEmailOutline),
                        size: 14
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(contact.emails[0]), 1)
                    ])) : createCommentVNode("", true),
                    contact.phones[0] ? (openBlock(), createElementBlock("small", _hoisted_28$1, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiPhoneOutline),
                        size: 14
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(contact.phones[0]), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ]);
              }), 128))
            ])
          ])) : createCommentVNode("", true),
          !selectedLinks.value.length && !__props.draft.filePaths.length && !__props.draft.contacts.length ? (openBlock(), createElementBlock("p", _hoisted_29$1, toDisplayString(unref(translate)("shortlinks", "Select links, files, or contacts to fill this page.")), 1)) : createCommentVNode("", true)
        ]),
        __props.draft.footer.enabled !== false ? (openBlock(), createElementBlock("footer", _hoisted_30$1, [
          __props.draft.footer.brand !== false ? (openBlock(), createElementBlock("span", _hoisted_31$1, toDisplayString(unref(translate)("shortlinks", "Shared with Shortlinks")), 1)) : createCommentVNode("", true),
          __props.draft.footer.updated !== false ? (openBlock(), createElementBlock("span", _hoisted_32$1, toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ], 4);
    };
  }
});
const PagePreview = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f51cb0cd"]]);
const _hoisted_1 = {
  class: "page-editor",
  "aria-labelledby": "page-editor-title"
};
const _hoisted_2 = { class: "page-editor__toolbar" };
const _hoisted_3 = { id: "page-editor-title" };
const _hoisted_4 = { class: "page-editor__workspace" };
const _hoisted_5 = { class: "page-editor__controls" };
const _hoisted_6 = {
  class: "editor-tabs",
  role: "tablist"
};
const _hoisted_7 = ["aria-selected", "onClick"];
const _hoisted_8 = {
  key: 0,
  class: "editor-panel"
};
const _hoisted_9 = { class: "choice-grid" };
const _hoisted_10 = ["onClick"];
const _hoisted_11 = { class: "date-grid" };
const _hoisted_12 = {
  key: 1,
  class: "editor-panel"
};
const _hoisted_13 = { class: "source-list" };
const _hoisted_14 = ["checked", "onChange"];
const _hoisted_15 = { key: 0 };
const _hoisted_16 = { class: "source-list" };
const _hoisted_17 = ["checked", "onChange"];
const _hoisted_18 = { key: 0 };
const _hoisted_19 = { class: "source-list source-list--links" };
const _hoisted_20 = ["checked", "onChange"];
const _hoisted_21 = { key: 0 };
const _hoisted_22 = { class: "section-heading" };
const _hoisted_23 = {
  key: 0,
  class: "selected-content-list"
};
const _hoisted_24 = {
  key: 1,
  class: "content-empty"
};
const _hoisted_25 = { class: "privacy-note" };
const _hoisted_26 = { class: "contact-search" };
const _hoisted_27 = {
  key: 0,
  class: "content-empty"
};
const _hoisted_28 = {
  key: 1,
  class: "content-empty"
};
const _hoisted_29 = {
  key: 2,
  class: "source-list source-list--contacts"
};
const _hoisted_30 = ["checked", "onChange"];
const _hoisted_31 = {
  key: 3,
  class: "selected-content-list"
};
const _hoisted_32 = {
  key: 2,
  class: "editor-panel"
};
const _hoisted_33 = { class: "choice-grid layout-choices" };
const _hoisted_34 = ["onClick"];
const _hoisted_35 = { class: "select-field" };
const _hoisted_36 = { value: "none" };
const _hoisted_37 = { value: "folder" };
const _hoisted_38 = { value: "tag" };
const _hoisted_39 = { class: "field-toggles" };
const _hoisted_40 = { class: "color-fields" };
const _hoisted_41 = { class: "field-toggles" };
const _hoisted_42 = { class: "page-editor__preview" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageEditor",
  props: {
    page: { default: void 0 },
    folders: {},
    tags: {},
    prefillFolderId: { default: null },
    prefillTagIds: { default: () => [] }
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const defaultFields = ["title", "thumbnail", "media", "domain"];
    const draft = reactive({
      slug: props.page?.slug ?? "",
      title: props.page?.title ?? "",
      lead: props.page?.lead ?? "",
      accessMode: props.page?.accessMode ?? "private",
      password: "",
      startsAt: props.page?.startsAt ?? null,
      expiresAt: props.page?.expiresAt ?? null,
      folderIds: props.page?.folderIds ?? (props.prefillFolderId ? [props.prefillFolderId] : []),
      tagIds: props.page?.tagIds ?? [...props.prefillTagIds],
      linkIds: props.page?.linkIds ?? [],
      filePaths: props.page?.filePaths ? [...props.page.filePaths] : [],
      contacts: props.page?.contacts ? props.page.contacts.map((contact) => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })) : [],
      userIds: props.page?.userIds ?? [],
      groupIds: props.page?.groupIds ?? [],
      layout: props.page?.layout ?? "cards",
      grouping: props.page?.grouping ?? "none",
      visibleFields: props.page?.visibleFields?.length ? [...props.page.visibleFields] : [...defaultFields],
      theme: { background: "#ffffff", text: "#222222", primary: "#0082c9", surface: "#f4f4f5", ...props.page?.theme ?? {} },
      header: { title: true, lead: true, owner: true, ...props.page?.header ?? {} },
      footer: { enabled: true, brand: true, updated: true, ...props.page?.footer ?? {} },
      active: props.page?.active ?? true,
      version: props.page?.version
    });
    const tab = ref("general");
    const links = ref([]);
    const loadingLinks = ref(false);
    const contactQuery = ref("");
    const contactResults = ref([]);
    const contactSearchLoading = ref(false);
    const contactSearchComplete = ref(false);
    const contactsEnabled = ref(null);
    const aliasEdited = ref(Boolean(props.page));
    const palette = ["#0082c9", "#00679e", "#2d7d46", "#e6a100", "#d52b1e", "#5b5fc7", "#8c42ab", "#008a9a"];
    const accessModes = [
      { id: "private", label: "Private", description: "Only you can open this page." },
      { id: "public", label: "Public", description: "Anyone with the address can open it." },
      { id: "password", label: "Password protected", description: "Visitors enter a shared password." },
      { id: "restricted", label: "Selected users and groups", description: "Only selected Nextcloud accounts can open it." }
    ];
    const layouts = [
      { id: "cards", label: "Cards", description: "Rich cards in a responsive grid." },
      { id: "spaced", label: "Spaced list", description: "Comfortable single-column rows." },
      { id: "compact", label: "Compact list", description: "More links in less space." },
      { id: "tiles", label: "Tiles", description: "Visual square-like tiles." }
    ];
    const fieldOptions = [
      { id: "title", label: "Title" },
      { id: "description", label: "Description" },
      { id: "thumbnail", label: "Thumbnail" },
      { id: "media", label: "Decorative media" },
      { id: "domain", label: "Destination domain" },
      { id: "shortUrl", label: "Short URL" },
      { id: "clicks", label: "Click count" },
      { id: "folder", label: "Folder" },
      { id: "tags", label: "Tags" }
    ];
    const startsAtLocal = computed({ get: () => toLocal(draft.startsAt), set: (value) => {
      draft.startsAt = toTimestamp(value);
    } });
    const expiresAtLocal = computed({ get: () => toLocal(draft.expiresAt), set: (value) => {
      draft.expiresAt = toTimestamp(value);
    } });
    const usersText = computed({ get: () => draft.userIds.join(", "), set: (value) => {
      draft.userIds = splitList(value);
    } });
    const groupsText = computed({ get: () => draft.groupIds.join(", "), set: (value) => {
      draft.groupIds = splitList(value);
    } });
    const canSave = computed(() => draft.title.trim().length > 0 && (draft.accessMode !== "password" || draft.password.length >= 8 || Boolean(props.page?.passwordProtected)) && (draft.accessMode !== "restricted" || draft.userIds.length + draft.groupIds.length > 0));
    watch(() => draft.title, (value) => {
      if (!aliasEdited.value) draft.slug = slugify(value);
    });
    onMounted(loadLinks);
    async function loadLinks() {
      loadingLinks.value = true;
      try {
        links.value = (await api.listLinks({ system: "all", page: 1, perPage: 200 })).items;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loadingLinks.value = false;
      }
    }
    function toggleId(key, id) {
      draft[key] = draft[key].includes(id) ? draft[key].filter((value) => value !== id) : [...draft[key], id];
    }
    function toggleField(id) {
      draft.visibleFields = draft.visibleFields.includes(id) ? draft.visibleFields.filter((value) => value !== id) : [...draft.visibleFields, id];
    }
    function splitList(value) {
      return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
    }
    function slugify(value) {
      return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    }
    function setSlug(value) {
      aliasEdited.value = true;
      draft.slug = String(value).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    }
    function toLocal(timestamp) {
      if (timestamp === null) return "";
      const date = new Date(timestamp * 1e3);
      return new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    }
    function toTimestamp(value) {
      if (!value) return null;
      const time = new Date(value).getTime();
      return Number.isFinite(time) ? Math.floor(time / 1e3) : null;
    }
    function fileName(path) {
      return path.split("/").filter(Boolean).at(-1) || path;
    }
    async function pickFiles() {
      try {
        const picker = getFilePickerBuilder(translate("shortlinks", "Choose files for this page")).setMultiSelect(true).allowDirectories(false).addButton({
          label: translate("shortlinks", "Add selected files"),
          variant: "primary",
          callback: () => {
          }
        }).build();
        const paths = await picker.pick();
        draft.filePaths = [.../* @__PURE__ */ new Set([...draft.filePaths, ...paths])];
      } catch (error) {
        if (!(error instanceof FilePickerClosed)) throw error;
      }
    }
    function removeFile(path) {
      draft.filePaths = draft.filePaths.filter((value) => value !== path);
    }
    function contactSelected(contact) {
      return draft.contacts.some((value) => value.key === contact.key);
    }
    function toggleContact(contact) {
      draft.contacts = contactSelected(contact) ? draft.contacts.filter((value) => value.key !== contact.key) : [...draft.contacts, { ...contact, emails: [...contact.emails], phones: [...contact.phones] }];
    }
    async function searchContacts() {
      if (contactQuery.value.trim().length < 2) return;
      contactSearchLoading.value = true;
      contactSearchComplete.value = false;
      try {
        const result = await api.searchPageContacts(contactQuery.value.trim());
        contactsEnabled.value = result.enabled;
        contactResults.value = result.items;
        contactSearchComplete.value = true;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        contactSearchLoading.value = false;
      }
    }
    function submit() {
      if (!canSave.value) return;
      emit("save", { ...draft, folderIds: [...draft.folderIds], tagIds: [...draft.tagIds], linkIds: [...draft.linkIds], filePaths: [...draft.filePaths], contacts: draft.contacts.map((contact) => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })), userIds: [...draft.userIds], groupIds: [...draft.groupIds], visibleFields: [...draft.visibleFields], theme: { ...draft.theme }, header: { ...draft.header }, footer: { ...draft.footer } });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createBaseVNode("header", _hoisted_2, [
          createVNode(unref(NcButton), {
            variant: "tertiary",
            "aria-label": unref(translate)("shortlinks", "Back"),
            onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiArrowLeft) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["aria-label"]),
          createBaseVNode("div", null, [
            createBaseVNode("h1", _hoisted_3, toDisplayString(__props.page ? unref(translate)("shortlinks", "Edit page") : unref(translate)("shortlinks", "New page")), 1),
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Build a focused, shareable collection of short links.")), 1)
          ]),
          createVNode(unref(NcButton), {
            variant: "primary",
            disabled: !canSave.value,
            onClick: submit
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentSaveOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Save page")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("nav", _hoisted_6, [
              (openBlock(true), createElementBlock(Fragment, null, renderList([{ id: "general", label: "General", icon: unref(mdiLockOutline) }, { id: "content", label: "Content", icon: unref(mdiFormatListBulleted) }, { id: "design", label: "Design", icon: unref(mdiPaletteOutline) }], (item) => {
                return openBlock(), createElementBlock("button", {
                  key: item.id,
                  role: "tab",
                  "aria-selected": tab.value === item.id,
                  class: normalizeClass({ active: tab.value === item.id }),
                  onClick: ($event) => tab.value = item.id
                }, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: item.icon,
                    size: 18
                  }, null, 8, ["path"]),
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", item.label)), 1)
                ], 10, _hoisted_7);
              }), 128))
            ]),
            tab.value === "general" ? (openBlock(), createElementBlock("div", _hoisted_8, [
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Identity")), 1),
                createVNode(unref(_sfc_main$2), {
                  modelValue: draft.title,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => draft.title = $event),
                  label: unref(translate)("shortlinks", "Page title"),
                  required: ""
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(NcTextArea), {
                  modelValue: draft.lead,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => draft.lead = $event),
                  label: unref(translate)("shortlinks", "Lead text (optional)")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$2), {
                  "model-value": draft.slug,
                  label: unref(translate)("shortlinks", "Page address"),
                  "helper-text": `…/p/${draft.slug || "page"}`,
                  "onUpdate:modelValue": setSlug
                }, null, 8, ["model-value", "label", "helper-text"])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Visibility and access")), 1),
                createBaseVNode("div", _hoisted_9, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(accessModes, (mode) => {
                    return createBaseVNode("button", {
                      key: mode.id,
                      type: "button",
                      class: normalizeClass({ selected: draft.accessMode === mode.id }),
                      onClick: ($event) => draft.accessMode = mode.id
                    }, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: draft.accessMode === mode.id ? unref(mdiCheck) : unref(mdiLockOutline)
                      }, null, 8, ["path"]),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", mode.label)), 1),
                        createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", mode.description)), 1)
                      ])
                    ], 10, _hoisted_10);
                  }), 64))
                ]),
                draft.accessMode === "password" ? (openBlock(), createBlock(unref(_sfc_main$2), {
                  key: 0,
                  modelValue: draft.password,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => draft.password = $event),
                  type: "password",
                  label: unref(translate)("shortlinks", __props.page?.passwordProtected ? "New password (optional)" : "Password"),
                  "helper-text": unref(translate)("shortlinks", "Use at least 8 characters.")
                }, null, 8, ["modelValue", "label", "helper-text"])) : createCommentVNode("", true),
                draft.accessMode === "restricted" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createVNode(unref(_sfc_main$2), {
                    modelValue: usersText.value,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => usersText.value = $event),
                    label: unref(translate)("shortlinks", "Users"),
                    "helper-text": unref(translate)("shortlinks", "Separate account names with commas.")
                  }, null, 8, ["modelValue", "label", "helper-text"]),
                  createVNode(unref(_sfc_main$2), {
                    modelValue: groupsText.value,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => groupsText.value = $event),
                    label: unref(translate)("shortlinks", "Groups"),
                    "helper-text": unref(translate)("shortlinks", "Separate group names with commas.")
                  }, null, 8, ["modelValue", "label", "helper-text"])
                ], 64)) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("label", null, [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Available from")), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => startsAtLocal.value = $event),
                      type: "datetime-local"
                    }, null, 512), [
                      [vModelText, startsAtLocal.value]
                    ])
                  ]),
                  createBaseVNode("label", null, [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Expires at")), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => expiresAtLocal.value = $event),
                      type: "datetime-local"
                    }, null, 512), [
                      [vModelText, expiresAtLocal.value]
                    ])
                  ])
                ]),
                createVNode(unref(NcCheckboxRadioSwitch), {
                  modelValue: draft.active,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => draft.active = $event),
                  type: "switch"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Page is active")), 1)
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ])) : tab.value === "content" ? (openBlock(), createElementBlock("div", _hoisted_12, [
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Automatic sources")), 1),
                createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "New matching short links appear on the page automatically.")), 1),
                createBaseVNode("h3", null, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: unref(mdiShapeOutline),
                    size: 20
                  }, null, 8, ["path"]),
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Folders")), 1)
                ]),
                createBaseVNode("div", _hoisted_13, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.folders, (folder) => {
                    return openBlock(), createElementBlock("label", {
                      key: folder.id
                    }, [
                      createBaseVNode("input", {
                        type: "checkbox",
                        checked: draft.folderIds.includes(folder.id),
                        onChange: ($event) => toggleId("folderIds", folder.id)
                      }, null, 40, _hoisted_14),
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(folderIconPath)(folder.icon),
                        size: 20
                      }, null, 8, ["path"]),
                      createBaseVNode("span", null, toDisplayString(folder.name), 1),
                      createBaseVNode("small", null, toDisplayString(folder.count), 1)
                    ]);
                  }), 128)),
                  !__props.folders.length ? (openBlock(), createElementBlock("p", _hoisted_15, toDisplayString(unref(translate)("shortlinks", "No folders yet")), 1)) : createCommentVNode("", true)
                ]),
                createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Tags")), 1),
                createBaseVNode("div", _hoisted_16, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
                    return openBlock(), createElementBlock("label", {
                      key: tag.id
                    }, [
                      createBaseVNode("input", {
                        type: "checkbox",
                        checked: draft.tagIds.includes(tag.id),
                        onChange: ($event) => toggleId("tagIds", tag.id)
                      }, null, 40, _hoisted_17),
                      createBaseVNode("i", {
                        style: normalizeStyle({ backgroundColor: tag.color || "var(--color-primary-element)" })
                      }, null, 4),
                      createBaseVNode("span", null, toDisplayString(tag.name), 1),
                      createBaseVNode("small", null, toDisplayString(tag.count), 1)
                    ]);
                  }), 128)),
                  !__props.tags.length ? (openBlock(), createElementBlock("p", _hoisted_18, toDisplayString(unref(translate)("shortlinks", "No tags yet")), 1)) : createCommentVNode("", true)
                ])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Individual links")), 1),
                createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Pin individual links in addition to automatic sources.")), 1),
                createBaseVNode("div", _hoisted_19, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(links.value, (link) => {
                    return openBlock(), createElementBlock("label", {
                      key: link.id
                    }, [
                      createBaseVNode("input", {
                        type: "checkbox",
                        checked: draft.linkIds.includes(link.id),
                        onChange: ($event) => toggleId("linkIds", link.id)
                      }, null, 40, _hoisted_20),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(link.title || link.slug), 1),
                        createBaseVNode("small", null, "…/" + toDisplayString(link.slug), 1)
                      ])
                    ]);
                  }), 128)),
                  loadingLinks.value ? (openBlock(), createElementBlock("p", _hoisted_21, toDisplayString(unref(translate)("shortlinks", "Loading links…")), 1)) : createCommentVNode("", true)
                ])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("div", _hoisted_22, [
                  createBaseVNode("div", null, [
                    createBaseVNode("h2", null, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiFileMultipleOutline),
                        size: 22
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Files")), 1)
                    ]),
                    createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Add files from your Nextcloud Files. Visitors can open or download the selected files from the Page.")), 1)
                  ]),
                  createVNode(unref(NcButton), { onClick: pickFiles }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFilePlusOutline) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Select files")), 1)
                    ]),
                    _: 1
                  })
                ]),
                draft.filePaths.length ? (openBlock(), createElementBlock("div", _hoisted_23, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(draft.filePaths, (path) => {
                    return openBlock(), createElementBlock("div", {
                      key: path,
                      class: "selected-content-item"
                    }, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiFileMultipleOutline),
                        size: 21
                      }, null, 8, ["path"]),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(fileName(path)), 1),
                        createBaseVNode("small", null, toDisplayString(path), 1)
                      ]),
                      createVNode(unref(NcButton), {
                        variant: "tertiary",
                        "aria-label": unref(translate)("shortlinks", "Remove file"),
                        onClick: ($event) => removeFile(path)
                      }, {
                        icon: withCtx(() => [
                          createVNode(unref(NcIconSvgWrapper), { path: unref(mdiClose) }, null, 8, ["path"])
                        ]),
                        _: 1
                      }, 8, ["aria-label", "onClick"])
                    ]);
                  }), 128))
                ])) : (openBlock(), createElementBlock("p", _hoisted_24, toDisplayString(unref(translate)("shortlinks", "No files selected")), 1))
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: unref(mdiAccountOutline),
                    size: 22
                  }, null, 8, ["path"]),
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Contacts")), 1)
                ]),
                createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Find contacts in your Nextcloud address books and add their selected contact details to this Page.")), 1),
                createBaseVNode("p", _hoisted_25, toDisplayString(unref(translate)("shortlinks", "Only add contacts whose details may be shared with everyone who can access this Page.")), 1),
                createBaseVNode("div", _hoisted_26, [
                  createVNode(unref(_sfc_main$2), {
                    modelValue: contactQuery.value,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => contactQuery.value = $event),
                    label: unref(translate)("shortlinks", "Search contacts"),
                    "helper-text": unref(translate)("shortlinks", "Enter at least two characters."),
                    onKeydown: withKeys(withModifiers(searchContacts, ["prevent"]), ["enter"])
                  }, null, 8, ["modelValue", "label", "helper-text", "onKeydown"]),
                  createVNode(unref(NcButton), {
                    disabled: contactQuery.value.trim().length < 2 || contactSearchLoading.value,
                    onClick: searchContacts
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiMagnify) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(contactSearchLoading.value ? unref(translate)("shortlinks", "Searching…") : unref(translate)("shortlinks", "Search")), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                contactsEnabled.value === false ? (openBlock(), createElementBlock("p", _hoisted_27, toDisplayString(unref(translate)("shortlinks", "No Nextcloud address book is currently available.")), 1)) : contactSearchComplete.value && !contactResults.value.length ? (openBlock(), createElementBlock("p", _hoisted_28, toDisplayString(unref(translate)("shortlinks", "No matching contacts found.")), 1)) : createCommentVNode("", true),
                contactResults.value.length ? (openBlock(), createElementBlock("div", _hoisted_29, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(contactResults.value, (contact) => {
                    return openBlock(), createElementBlock("label", {
                      key: contact.key
                    }, [
                      createBaseVNode("input", {
                        type: "checkbox",
                        checked: contactSelected(contact),
                        onChange: ($event) => toggleContact(contact)
                      }, null, 40, _hoisted_30),
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiAccountOutline),
                        size: 22
                      }, null, 8, ["path"]),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(contact.name), 1),
                        createBaseVNode("small", null, toDisplayString(contact.organization || contact.emails[0] || contact.phones[0] || unref(translate)("shortlinks", "No additional details")), 1)
                      ])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true),
                draft.contacts.length ? (openBlock(), createElementBlock("div", _hoisted_31, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(draft.contacts, (contact) => {
                    return openBlock(), createElementBlock("div", {
                      key: contact.key,
                      class: "selected-content-item"
                    }, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiAccountOutline),
                        size: 22
                      }, null, 8, ["path"]),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(contact.name), 1),
                        createBaseVNode("small", null, toDisplayString([...contact.emails, ...contact.phones].join(" · ") || contact.organization), 1)
                      ]),
                      createVNode(unref(NcButton), {
                        variant: "tertiary",
                        "aria-label": unref(translate)("shortlinks", "Remove contact"),
                        onClick: ($event) => toggleContact(contact)
                      }, {
                        icon: withCtx(() => [
                          createVNode(unref(NcIconSvgWrapper), { path: unref(mdiClose) }, null, 8, ["path"])
                        ]),
                        _: 1
                      }, 8, ["aria-label", "onClick"])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_32, [
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Layout")), 1),
                createBaseVNode("div", _hoisted_33, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(layouts, (layout) => {
                    return createBaseVNode("button", {
                      key: layout.id,
                      type: "button",
                      class: normalizeClass({ selected: draft.layout === layout.id }),
                      onClick: ($event) => draft.layout = layout.id
                    }, [
                      createBaseVNode("span", {
                        class: normalizeClass(["layout-glyph", `layout-glyph--${layout.id}`])
                      }, [
                        (openBlock(), createElementBlock(Fragment, null, renderList(4, (n) => {
                          return createBaseVNode("i", { key: n });
                        }), 64))
                      ], 2),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", layout.label)), 1),
                        createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", layout.description)), 1)
                      ])
                    ], 10, _hoisted_34);
                  }), 64))
                ]),
                createBaseVNode("label", _hoisted_35, [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Group links by")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => draft.grouping = $event)
                  }, [
                    createBaseVNode("option", _hoisted_36, toDisplayString(unref(translate)("shortlinks", "No grouping")), 1),
                    createBaseVNode("option", _hoisted_37, toDisplayString(unref(translate)("shortlinks", "Folder")), 1),
                    createBaseVNode("option", _hoisted_38, toDisplayString(unref(translate)("shortlinks", "Tag")), 1)
                  ], 512), [
                    [vModelSelect, draft.grouping]
                  ])
                ])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Visible information")), 1),
                createBaseVNode("div", _hoisted_39, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(fieldOptions, (field) => {
                    return createVNode(unref(NcCheckboxRadioSwitch), {
                      key: field.id,
                      "model-value": draft.visibleFields.includes(field.id),
                      type: "switch",
                      "onUpdate:modelValue": ($event) => toggleField(field.id)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(translate)("shortlinks", field.label)), 1)
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onUpdate:modelValue"]);
                  }), 64))
                ])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Colors")), 1),
                createBaseVNode("div", _hoisted_40, [
                  (openBlock(), createElementBlock(Fragment, null, renderList([{ key: "primary", label: "Primary color" }, { key: "background", label: "Background" }, { key: "surface", label: "Card background" }, { key: "text", label: "Text color" }], (item) => {
                    return createBaseVNode("label", {
                      key: item.key
                    }, [
                      createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", item.label)), 1),
                      createVNode(unref(NcColorPicker), {
                        modelValue: draft.theme[item.key],
                        "onUpdate:modelValue": ($event) => draft.theme[item.key] = $event,
                        palette,
                        "advanced-fields": ""
                      }, {
                        default: withCtx(({ attrs }) => [
                          createVNode(unref(NcButton), mergeProps({ ref_for: true }, attrs), {
                            icon: withCtx(() => [
                              createBaseVNode("i", {
                                class: "color-dot",
                                style: normalizeStyle({ backgroundColor: draft.theme[item.key] })
                              }, null, 4)
                            ]),
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(draft.theme[item.key]), 1)
                            ]),
                            _: 2
                          }, 1040)
                        ]),
                        _: 2
                      }, 1032, ["modelValue", "onUpdate:modelValue"])
                    ]);
                  }), 64))
                ])
              ]),
              createBaseVNode("section", null, [
                createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Header and footer")), 1),
                createBaseVNode("div", _hoisted_41, [
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: draft.header.title,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => draft.header.title = $event),
                    type: "switch"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show page title")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: draft.header.lead,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => draft.header.lead = $event),
                    type: "switch"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show lead text")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: draft.footer.enabled,
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => draft.footer.enabled = $event),
                    type: "switch"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show footer")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  draft.footer.enabled ? (openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                    key: 0,
                    modelValue: draft.footer.brand,
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => draft.footer.brand = $event),
                    type: "switch"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show Shortlinks attribution")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"])) : createCommentVNode("", true),
                  draft.footer.enabled ? (openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                    key: 1,
                    modelValue: draft.footer.updated,
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => draft.footer.updated = $event),
                    type: "switch"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show updated date")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"])) : createCommentVNode("", true)
                ])
              ])
            ]))
          ]),
          createBaseVNode("aside", _hoisted_42, [
            createBaseVNode("h2", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiEyeOutline),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Live preview")), 1)
            ]),
            createVNode(PagePreview, {
              draft,
              links: links.value,
              folders: __props.folders
            }, null, 8, ["draft", "links", "folders"])
          ])
        ])
      ]);
    };
  }
});
const PageEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-46d7dda1"]]);
export {
  PageEditor as default
};
