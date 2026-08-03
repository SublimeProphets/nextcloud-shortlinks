const appName = "shortlinks";
const appVersion = "1.2.2";
import { an as translate, bh as mdiPlus, b2 as mdiViewListOutline, b3 as mdiViewGridOutline, aM as mdiRestore, aN as mdiDeleteOutline, aY as mdiContentCopy, bs as mdiOpenInNew, aX as mdiPencilOutline, b9 as mdiEarth, bR as mdiShieldAccountOutline, a_ as mdiLockOutline } from "./vendor-CflEb2sm.chunk.mjs";
import { s as showSuccess, a as showError } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { h as NcIconSvgWrapper, g as NcButton, q as NcLoadingIcon, N as NcEmptyContent } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { W as defineComponent, j as openBlock, p as createElementBlock, D as createBaseVNode, I as toDisplayString, u as unref, k as createBlock, Q as withCtx, H as createTextVNode, P as createVNode, L as createCommentVNode, Y as createSlots, F as Fragment, E as renderList, v as normalizeStyle, x as ref } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1 = {
  class: "page-list",
  "aria-labelledby": "pages-heading"
};
const _hoisted_2 = { id: "pages-heading" };
const _hoisted_3 = ["aria-label"];
const _hoisted_4 = {
  key: 2,
  class: "page-table-wrap"
};
const _hoisted_5 = { class: "page-table" };
const _hoisted_6 = { class: "visually-hidden" };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "access-label" };
const _hoisted_9 = { class: "row-actions" };
const _hoisted_10 = {
  key: 3,
  class: "page-grid"
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = { class: "page-card__mark" };
const _hoisted_13 = { class: "page-card__actions" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageList",
  props: {
    pages: {},
    loading: { type: Boolean },
    trash: { type: Boolean }
  },
  emits: ["create", "edit", "delete", "restore"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const view = ref("table");
    function accessIcon(page) {
      if (page.accessMode === "public") return mdiEarth;
      if (page.accessMode === "restricted") return mdiShieldAccountOutline;
      return mdiLockOutline;
    }
    function accessLabel(page) {
      return translate("shortlinks", { private: "Private", public: "Public", password: "Password protected", restricted: "Selected users and groups" }[page.accessMode]);
    }
    async function copy(page) {
      try {
        await navigator.clipboard.writeText(page.publicUrl);
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createBaseVNode("header", null, [
          createBaseVNode("div", null, [
            createBaseVNode("h1", _hoisted_2, toDisplayString(__props.trash ? unref(translate)("shortlinks", "Deleted pages") : unref(translate)("shortlinks", "Pages")), 1),
            createBaseVNode("p", null, toDisplayString(__props.trash ? unref(translate)("shortlinks", "Restore pages or delete them permanently.") : unref(translate)("shortlinks", "Share curated collections of short links with a single address.")), 1)
          ]),
          createBaseVNode("div", null, [
            !__props.trash ? (openBlock(), createBlock(unref(NcButton), {
              key: 0,
              variant: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("create"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "New page")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createBaseVNode("div", {
              class: "view-switch",
              role: "group",
              "aria-label": unref(translate)("shortlinks", "View")
            }, [
              createVNode(unref(NcButton), {
                variant: "tertiary",
                pressed: view.value === "table",
                "aria-label": unref(translate)("shortlinks", "Table view"),
                onClick: _cache[1] || (_cache[1] = ($event) => view.value = "table")
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewListOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["pressed", "aria-label"]),
              createVNode(unref(NcButton), {
                variant: "tertiary",
                pressed: view.value === "grid",
                "aria-label": unref(translate)("shortlinks", "Grid view"),
                onClick: _cache[2] || (_cache[2] = ($event) => view.value = "grid")
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewGridOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["pressed", "aria-label"])
            ], 8, _hoisted_3)
          ])
        ]),
        __props.loading ? (openBlock(), createBlock(unref(NcLoadingIcon), {
          key: 0,
          name: unref(translate)("shortlinks", "Loading pages")
        }, null, 8, ["name"])) : !__props.pages.length ? (openBlock(), createBlock(unref(NcEmptyContent), {
          key: 1,
          name: __props.trash ? unref(translate)("shortlinks", "No deleted pages") : unref(translate)("shortlinks", "Create your first page"),
          description: __props.trash ? unref(translate)("shortlinks", "Deleted pages will appear here.") : unref(translate)("shortlinks", "Combine folders, tags, and hand-picked links in a shareable page.")
        }, createSlots({
          icon: withCtx(() => [
            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewGridOutline) }, null, 8, ["path"])
          ]),
          _: 2
        }, [
          !__props.trash ? {
            name: "action",
            fn: withCtx(() => [
              createVNode(unref(NcButton), {
                variant: "primary",
                onClick: _cache[3] || (_cache[3] = ($event) => emit("create"))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
                ]),
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "New page")), 1)
                ]),
                _: 1
              })
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["name", "description"])) : view.value === "table" ? (openBlock(), createElementBlock("div", _hoisted_4, [
          createBaseVNode("table", _hoisted_5, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Page")), 1),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Access")), 1),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Sources")), 1),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Updated")), 1),
                createBaseVNode("th", null, [
                  createBaseVNode("span", _hoisted_6, toDisplayString(unref(translate)("shortlinks", "Actions")), 1)
                ])
              ])
            ]),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.pages, (page) => {
                return openBlock(), createElementBlock("tr", {
                  key: page.id
                }, [
                  createBaseVNode("td", null, [
                    createBaseVNode("button", {
                      type: "button",
                      class: "page-identity",
                      onClick: ($event) => __props.trash ? void 0 : emit("edit", page)
                    }, [
                      createBaseVNode("span", {
                        class: "page-identity__mark",
                        style: normalizeStyle({ background: page.theme.primary || "var(--color-primary-element)" })
                      }, toDisplayString(page.title.slice(0, 1).toUpperCase()), 5),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(page.title), 1),
                        createBaseVNode("code", null, "…/p/" + toDisplayString(page.slug), 1)
                      ])
                    ], 8, _hoisted_7)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("span", _hoisted_8, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: accessIcon(page),
                        size: 18
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(accessLabel(page)), 1)
                    ])
                  ]),
                  createBaseVNode("td", null, toDisplayString(unref(translate)("shortlinks", "{folders} folders, {tags} tags, {links} links", { folders: page.folderIds.length, tags: page.tagIds.length, links: page.linkIds.length })), 1),
                  createBaseVNode("td", null, toDisplayString(new Date(page.updatedAt * 1e3).toLocaleDateString()), 1),
                  createBaseVNode("td", null, [
                    createBaseVNode("div", _hoisted_9, [
                      __props.trash ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createVNode(unref(NcButton), {
                          "aria-label": unref(translate)("shortlinks", "Restore"),
                          onClick: ($event) => emit("restore", page)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiRestore) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label", "onClick"]),
                        createVNode(unref(NcButton), {
                          "aria-label": unref(translate)("shortlinks", "Delete permanently"),
                          onClick: ($event) => emit("delete", page, true)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label", "onClick"])
                      ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createVNode(unref(NcButton), {
                          "aria-label": unref(translate)("shortlinks", "Copy page address"),
                          onClick: ($event) => copy(page)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label", "onClick"]),
                        createVNode(unref(NcButton), {
                          href: page.publicUrl,
                          target: "_blank",
                          "aria-label": unref(translate)("shortlinks", "Open page")
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiOpenInNew) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["href", "aria-label"]),
                        createVNode(unref(NcButton), {
                          "aria-label": unref(translate)("shortlinks", "Edit"),
                          onClick: ($event) => emit("edit", page)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPencilOutline) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label", "onClick"]),
                        createVNode(unref(NcButton), {
                          "aria-label": unref(translate)("shortlinks", "Move to trash"),
                          onClick: ($event) => emit("delete", page, false)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label", "onClick"])
                      ], 64))
                    ])
                  ])
                ]);
              }), 128))
            ])
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_10, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.pages, (page) => {
            return openBlock(), createElementBlock("article", {
              key: page.id,
              style: normalizeStyle({ "--page-accent": page.theme.primary || "var(--color-primary-element)", "--page-bg": page.theme.background || "var(--color-main-background)" })
            }, [
              createBaseVNode("button", {
                type: "button",
                class: "page-card__main",
                onClick: ($event) => __props.trash ? void 0 : emit("edit", page)
              }, [
                createBaseVNode("span", _hoisted_12, toDisplayString(page.title.slice(0, 1).toUpperCase()), 1),
                createBaseVNode("strong", null, toDisplayString(page.title), 1),
                createBaseVNode("span", null, toDisplayString(page.lead || unref(translate)("shortlinks", "A curated collection of short links.")), 1),
                createBaseVNode("code", null, "…/p/" + toDisplayString(page.slug), 1),
                createBaseVNode("small", null, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: accessIcon(page),
                    size: 16
                  }, null, 8, ["path"]),
                  createTextVNode(toDisplayString(accessLabel(page)) + " · " + toDisplayString(new Date(page.updatedAt * 1e3).toLocaleDateString()), 1)
                ])
              ], 8, _hoisted_11),
              createBaseVNode("div", _hoisted_13, [
                __props.trash ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createVNode(unref(NcButton), {
                    onClick: ($event) => emit("restore", page)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiRestore) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Restore")), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(unref(NcButton), {
                    onClick: ($event) => emit("delete", page, true)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createVNode(unref(NcButton), {
                    onClick: ($event) => copy(page)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(unref(NcButton), {
                    href: page.publicUrl,
                    target: "_blank"
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiOpenInNew) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(NcButton), {
                    variant: "primary",
                    onClick: ($event) => emit("edit", page)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPencilOutline) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Edit")), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64))
              ])
            ], 4);
          }), 128))
        ]))
      ]);
    };
  }
});
const PageList = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c413c113"]]);
export {
  PageList as default
};
