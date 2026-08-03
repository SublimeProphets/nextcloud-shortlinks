const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, x as ref, w as watch, o as onMounted, j as openBlock, p as createElementBlock, D as createBaseVNode, L as createCommentVNode, P as createVNode, u as unref, H as createTextVNode, I as toDisplayString, F as Fragment, E as renderList, R as normalizeClass, k as createBlock, Q as withCtx, v as normalizeStyle, N as withDirectives, V as vModelText, ah as vModelSelect, K as withModifiers, r as reactive, d as computed } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { a_ as mdiLockOutline, bw as mdiWeb, an as translate, aY as mdiContentCopy, aG as mdiCursorDefaultClickOutline, aX as mdiPencilOutline, bx as mdiPower, aC as mdiLinkVariant, bs as mdiOpenInNew, bn as mdiDownload, by as mdiAccountOutline, al as mdiAccountGroupOutline, bh as mdiPlus, bv as mdiChartLine, aP as mdiFolderOutline, bz as mdiRobotOutline, bA as mdiLaptop, bB as mdiMapMarkerOutline, b9 as mdiEarth, bC as mdiChartDonut, aN as mdiDeleteOutline, aF as mdiHistory } from "./vendor-CflEb2sm.chunk.mjs";
import { a as showError, s as showSuccess } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { h as NcIconSvgWrapper, q as NcLoadingIcon, g as NcButton, _ as _sfc_main$1, a as NcDialog } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api, b as folderIconPath } from "./shortlinks-main.mjs";
import { M as MiniLineChart, S as StatsDimension } from "./StatsDimension--wxqRH-u.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1 = {
  key: 0,
  class: "link-detail__media"
};
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "link-detail__summary" };
const _hoisted_4 = { class: "summary-line" };
const _hoisted_5 = {
  key: 0,
  class: "favorite",
  "aria-label": "Favorite"
};
const _hoisted_6 = { class: "access-pill" };
const _hoisted_7 = { class: "short-url-pill" };
const _hoisted_8 = ["href"];
const _hoisted_9 = ["aria-label"];
const _hoisted_10 = ["aria-label"];
const _hoisted_11 = ["aria-selected", "onClick"];
const _hoisted_12 = {
  key: 2,
  class: "detail-panel"
};
const _hoisted_13 = { class: "detail-actions" };
const _hoisted_14 = { class: "detail-section" };
const _hoisted_15 = { class: "destination-card" };
const _hoisted_16 = ["href"];
const _hoisted_17 = {
  key: 0,
  class: "qr-card"
};
const _hoisted_18 = ["src", "alt"];
const _hoisted_19 = { class: "qr-actions" };
const _hoisted_20 = {
  key: 0,
  class: "detail-section"
};
const _hoisted_21 = { class: "description" };
const _hoisted_22 = { class: "detail-section" };
const _hoisted_23 = { class: "property-grid" };
const _hoisted_24 = { class: "status-badge" };
const _hoisted_25 = {
  key: 0,
  class: "share-chips"
};
const _hoisted_26 = ["aria-label", "onClick"];
const _hoisted_27 = { class: "detail-section" };
const _hoisted_28 = { class: "mini-kpis" };
const _hoisted_29 = { class: "winner-grid" };
const _hoisted_30 = { class: "detail-section" };
const _hoisted_31 = { class: "organization-chips" };
const _hoisted_32 = { key: 0 };
const _hoisted_33 = { key: 1 };
const _hoisted_34 = {
  key: 3,
  class: "detail-panel"
};
const _hoisted_35 = { class: "panel-heading" };
const _hoisted_36 = { class: "export-actions" };
const _hoisted_37 = ["aria-label"];
const _hoisted_38 = {
  key: 0,
  class: "custom-range"
};
const _hoisted_39 = { class: "select-field" };
const _hoisted_40 = { value: "hour" };
const _hoisted_41 = { value: "day" };
const _hoisted_42 = { value: "week" };
const _hoisted_43 = { value: "month" };
const _hoisted_44 = { class: "stats-range-title" };
const _hoisted_45 = { class: "stats-kpis" };
const _hoisted_46 = { class: "winner-grid winner-grid--stats" };
const _hoisted_47 = { class: "dimensions" };
const _hoisted_48 = {
  key: 4,
  class: "detail-panel"
};
const _hoisted_49 = { class: "panel-heading" };
const _hoisted_50 = { class: "export-actions" };
const _hoisted_51 = { class: "click-filters" };
const _hoisted_52 = ["value"];
const _hoisted_53 = { value: "all" };
const _hoisted_54 = { value: "human" };
const _hoisted_55 = { value: "bot" };
const _hoisted_56 = {
  key: 0,
  class: "click-cards"
};
const _hoisted_57 = { class: "click-card__icon" };
const _hoisted_58 = { class: "click-card__content" };
const _hoisted_59 = { class: "click-card__badges" };
const _hoisted_60 = ["datetime", "title"];
const _hoisted_61 = {
  key: 1,
  class: "empty-message"
};
const _hoisted_62 = {
  key: 5,
  class: "detail-panel"
};
const _hoisted_63 = { class: "panel-heading" };
const _hoisted_64 = {
  key: 0,
  class: "activity-list"
};
const _hoisted_65 = ["datetime"];
const _hoisted_66 = {
  key: 1,
  class: "empty-message"
};
const _hoisted_67 = { value: "user" };
const _hoisted_68 = { value: "group" };
const _hoisted_69 = {
  key: 0,
  class: "principal-results"
};
const _hoisted_70 = ["onClick"];
const _hoisted_71 = { value: "management" };
const _hoisted_72 = { value: "access" };
const _hoisted_73 = { key: 1 };
const _hoisted_74 = { value: "view" };
const _hoisted_75 = { value: "edit" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LinkDetail",
  props: {
    link: {},
    folders: { default: () => [] }
  },
  emits: ["changed", "edit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tab = ref("details");
    const loading = ref(false);
    const stats = ref(null);
    const miniStats = ref(null);
    const activity = ref([]);
    const shares = ref([]);
    const clicks = ref([]);
    const clickPage = ref(1);
    const clickHasMore = ref(false);
    const clickBot = ref("all");
    const clickPeriod = ref("30d");
    const statsPeriod = ref("30d");
    const customFrom = ref(new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const customTo = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    const granularity = ref("day");
    const expandedDimensions = reactive({});
    const showShareDialog = ref(false);
    const principalResults = ref([]);
    const searchingPrincipals = ref(false);
    const sharePrincipal = ref("");
    const shareType = ref("user");
    const sharePurpose = ref("management");
    const sharePermission = ref("view");
    const periods = [
      { id: "7d", label: "Last 7 days" },
      { id: "30d", label: "Last 30 days" },
      { id: "90d", label: "Last 3 months" },
      { id: "thisYear", label: "This year" },
      { id: "lastYear", label: "Last year" },
      { id: "all", label: "Since the beginning" },
      { id: "custom", label: "Custom" }
    ];
    const dimensionIcons = { referrer: mdiWeb, country: mdiEarth, region: mdiMapMarkerOutline, browser: mdiWeb, os: mdiLaptop, device: mdiLaptop, authentication: mdiAccountGroupOutline, bot: mdiRobotOutline };
    const folder = computed(() => props.folders.find((item) => item.id === props.link.folderId));
    const appearanceStyle = computed(() => ({ "--link-accent": props.link.color || "var(--color-primary-element)" }));
    const accessLabel = computed(() => ({ public: "Public/unlisted", authenticated: "Signed-in users", users: "Selected users", groups: "Selected groups", password: "Password protected", disabled: "Disabled" })[props.link.accessMode] ?? props.link.accessMode);
    const relativeCreated = computed(() => relativeTime(props.link.createdAt));
    const relativeUpdated = computed(() => relativeTime(props.link.updatedAt));
    const showUpdated = computed(() => props.link.updatedAt !== props.link.createdAt);
    const qrUrl = computed(() => typeof api.qrUrl === "function" ? api.qrUrl(props.link.id, "svg") : "");
    const miniWinners = computed(() => winners(miniStats.value));
    const statsWinners = computed(() => winners(stats.value));
    const statsRangeLabel = computed(() => {
      const value = range(statsPeriod.value);
      const formatter = new Intl.DateTimeFormat(void 0, { dateStyle: "medium" });
      return `${formatter.format(value.from * 1e3)} – ${formatter.format(value.to * 1e3)}`;
    });
    watch(() => props.link.id, async () => {
      tab.value = "details";
      await loadDetails();
    });
    onMounted(loadDetails);
    async function loadDetails() {
      loading.value = true;
      try {
        const [shareRows, overview] = await Promise.all([
          props.link.canShare ? api.shares(props.link.id) : Promise.resolve([]),
          api.stats(props.link.id, { ...range("30d"), granularity: "day", compare: true })
        ]);
        shares.value = shareRows;
        miniStats.value = overview;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    }
    async function load(next) {
      tab.value = next;
      loading.value = true;
      try {
        if (next === "stats") await loadStats();
        if (next === "clicks") await loadClicks(true);
        if (next === "activity") activity.value = (await api.activity(props.link.id)).items;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    }
    async function loadStats() {
      stats.value = await api.stats(props.link.id, { ...range(statsPeriod.value), granularity: granularity.value, compare: true });
    }
    async function loadClicks(reset = false) {
      const page = reset ? 1 : clickPage.value + 1;
      const result = await api.clicks(props.link.id, { ...range(clickPeriod.value), page, perPage: 100, bot: clickBot.value === "all" ? void 0 : clickBot.value === "bot" });
      clicks.value = reset ? result.items : [...clicks.value, ...result.items];
      clickPage.value = result.pagination.page;
      clickHasMore.value = result.pagination.hasMore === 1;
    }
    function range(period) {
      const now = /* @__PURE__ */ new Date();
      const to = Math.floor(now.getTime() / 1e3);
      if (period === "7d") return { from: to - 7 * 86400, to };
      if (period === "30d") return { from: to - 30 * 86400, to };
      if (period === "90d") return { from: to - 90 * 86400, to };
      if (period === "thisYear") return { from: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1e3), to };
      if (period === "lastYear") return { from: Math.floor(new Date(now.getFullYear() - 1, 0, 1).getTime() / 1e3), to: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1e3) - 1 };
      if (period === "all") return { from: 0, to };
      const from = Math.floor((/* @__PURE__ */ new Date(`${customFrom.value}T00:00:00`)).getTime() / 1e3);
      const customEnd = Math.floor((/* @__PURE__ */ new Date(`${customTo.value}T23:59:59`)).getTime() / 1e3);
      return { from: Number.isFinite(from) ? from : to - 30 * 86400, to: Number.isFinite(customEnd) ? Math.min(to, customEnd) : to };
    }
    async function toggle() {
      try {
        await api.updateLink(props.link.id, { active: !props.link.active, version: props.link.version });
        emit("changed");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function copyShortUrl() {
      try {
        await navigator.clipboard.writeText(props.link.shortUrl);
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    async function copyQr() {
      try {
        const response = await fetch(qrUrl.value, { credentials: "same-origin", headers: { Accept: "image/svg+xml" } });
        if (!response.ok) throw new Error(translate("shortlinks", "Could not copy"));
        const svg = await response.text();
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
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    async function addShare() {
      if (!sharePrincipal.value.trim()) return;
      try {
        await api.createShare(props.link.id, { type: shareType.value, principalId: sharePrincipal.value.trim(), purpose: sharePurpose.value, permission: sharePurpose.value === "access" ? "view" : sharePermission.value });
        sharePrincipal.value = "";
        principalResults.value = [];
        showShareDialog.value = false;
        shares.value = await api.shares(props.link.id);
        showSuccess(translate("shortlinks", "Permission added"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function removeShare(shareId) {
      try {
        await api.deleteShare(props.link.id, shareId);
        shares.value = await api.shares(props.link.id);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function searchPrincipals() {
      const query = sharePrincipal.value.trim();
      if (query.length < 2) return;
      searchingPrincipals.value = true;
      try {
        principalResults.value = await api.searchPrincipals(query);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        searchingPrincipals.value = false;
      }
    }
    function selectPrincipal(principal) {
      shareType.value = principal.type;
      sharePrincipal.value = principal.id;
      principalResults.value = [];
    }
    function shareLabel(value) {
      return translate("shortlinks", { user: "User", group: "Group", management: "Management", access: "Redirect access", view: "View", edit: "Edit" }[value] ?? value);
    }
    function dimensionLabel(value) {
      return translate("shortlinks", { referrer: "Referrers", country: "Countries", region: "Regions", browser: "Browsers", os: "Operating systems", device: "Devices", authentication: "Authentication", bot: "Bots" }[value] ?? value);
    }
    function eventLabel(value) {
      return translate("shortlinks", { created: "Link created", updated: "Link updated", deleted: "Moved to trash", restored: "Restored", share_created: "Permission added", share_deleted: "Permission removed" }[value] ?? value.replaceAll("_", " "));
    }
    function eventIcon(value) {
      if (value.includes("share")) return mdiAccountGroupOutline;
      if (value.includes("delete")) return mdiDeleteOutline;
      if (value.includes("create")) return mdiPlus;
      if (value.includes("update")) return mdiPencilOutline;
      return mdiHistory;
    }
    function relativeTime(timestamp) {
      const seconds = timestamp - Math.floor(Date.now() / 1e3);
      const absolute = Math.abs(seconds);
      const formatter = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
      if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
      if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
      if (absolute < 30 * 86400) return formatter.format(Math.round(seconds / 86400), "day");
      if (absolute < 365 * 86400) return formatter.format(Math.round(seconds / (30 * 86400)), "month");
      return formatter.format(Math.round(seconds / (365 * 86400)), "year");
    }
    function exactDate(timestamp) {
      return new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(timestamp * 1e3);
    }
    function validFromLabel(timestamp) {
      if (timestamp === null) return translate("shortlinks", "Currently active");
      return `${timestamp <= Date.now() / 1e3 ? translate("shortlinks", "Active since {time}", { time: relativeTime(timestamp) }) : translate("shortlinks", "Available {time}", { time: relativeTime(timestamp) })} · ${exactDate(timestamp)}`;
    }
    function expiresAtLabel(timestamp) {
      return timestamp === null ? translate("shortlinks", "No expiration") : `${translate("shortlinks", "Expires {time}", { time: relativeTime(timestamp) })} · ${exactDate(timestamp)}`;
    }
    function winners(source) {
      return [winner(source, "device", "Top device"), winner(source, "os", "Top operating system"), winner(source, "browser", "Top browser"), winner(source, "bot", "Bot traffic", "bot")];
    }
    function winner(source, dimension, label, preferredValue) {
      const rows = source?.dimensions[dimension] ?? [];
      const row = preferredValue ? rows.find((item) => item.value === preferredValue) : rows[0];
      const total = rows.reduce((sum, item) => sum + item.clicks, 0);
      return { label, value: row?.value ?? "—", percentage: row && total ? Math.round(row.clicks / total * 100) : 0 };
    }
    function download(result) {
      const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    async function exportStats(format) {
      try {
        download(await api.exportStats(props.link.id, format, { ...range(statsPeriod.value), granularity: granularity.value }));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function exportClicks(format) {
      try {
        download(await api.exportClicks(props.link.id, format, { ...range(clickPeriod.value), bot: clickBot.value === "all" ? void 0 : clickBot.value === "bot" }));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "link-detail",
        style: normalizeStyle(appearanceStyle.value)
      }, [
        __props.link.mediaUrl && __props.link.mediaMime?.startsWith("video/") ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createBaseVNode("video", {
            src: __props.link.mediaUrl,
            muted: "",
            loop: "",
            autoplay: "",
            playsinline: "",
            controls: "",
            preload: "metadata"
          }, null, 8, _hoisted_2)
        ])) : createCommentVNode("", true),
        createBaseVNode("header", _hoisted_3, [
          createBaseVNode("div", _hoisted_4, [
            __props.link.favorite ? (openBlock(), createElementBlock("span", _hoisted_5, "★")) : createCommentVNode("", true),
            createBaseVNode("span", _hoisted_6, [
              createVNode(unref(NcIconSvgWrapper), {
                path: __props.link.passwordProtected ? unref(mdiLockOutline) : unref(mdiWeb),
                size: 16
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", accessLabel.value)), 1)
            ]),
            createBaseVNode("span", _hoisted_7, [
              createBaseVNode("a", {
                href: __props.link.shortUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }, "…/" + toDisplayString(__props.link.slug), 9, _hoisted_8),
              createBaseVNode("button", {
                type: "button",
                "aria-label": unref(translate)("shortlinks", "Copy link"),
                onClick: copyShortUrl
              }, [
                createVNode(unref(NcIconSvgWrapper), {
                  path: unref(mdiContentCopy),
                  size: 16
                }, null, 8, ["path"])
              ], 8, _hoisted_9)
            ]),
            createBaseVNode("span", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiCursorDefaultClickOutline),
                size: 16
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(__props.link.clickCount), 1)
            ])
          ]),
          createBaseVNode("small", null, [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Created {time}", { time: relativeCreated.value })), 1),
            showUpdated.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(" · " + toDisplayString(unref(translate)("shortlinks", "Updated {time}", { time: relativeUpdated.value })), 1)
            ], 64)) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("nav", {
          class: "detail-tabs",
          "aria-label": unref(translate)("shortlinks", "Link detail tabs"),
          role: "tablist"
        }, [
          (openBlock(), createElementBlock(Fragment, null, renderList(["details", "stats", "clicks", "activity"], (item) => {
            return createBaseVNode("button", {
              key: item,
              role: "tab",
              "aria-selected": tab.value === item,
              class: normalizeClass({ active: tab.value === item }),
              onClick: ($event) => load(item)
            }, toDisplayString(unref(translate)("shortlinks", item === "stats" ? "Statistics" : item === "clicks" ? "Click log" : item === "activity" ? "Activity" : "Details")), 11, _hoisted_11);
          }), 64))
        ], 8, _hoisted_10),
        loading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
          key: 1,
          class: "detail-loading",
          name: unref(translate)("shortlinks", "Loading")
        }, null, 8, ["name"])) : createCommentVNode("", true),
        tab.value === "details" ? (openBlock(), createElementBlock("section", _hoisted_12, [
          createBaseVNode("div", _hoisted_13, [
            __props.link.canEdit ? (openBlock(), createBlock(unref(NcButton), {
              key: 0,
              variant: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("edit", __props.link))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPencilOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Edit")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            __props.link.canEdit ? (openBlock(), createBlock(unref(NcButton), {
              key: 1,
              onClick: toggle
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPower) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.link.active ? unref(translate)("shortlinks", "Deactivate") : unref(translate)("shortlinks", "Activate")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ]),
          createBaseVNode("section", _hoisted_14, [
            createBaseVNode("h3", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiLinkVariant),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Destination and alias")), 1)
            ]),
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("a", {
                href: __props.link.targetUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }, [
                createBaseVNode("span", null, toDisplayString(__props.link.targetUrl), 1),
                createVNode(unref(NcIconSvgWrapper), {
                  path: unref(mdiOpenInNew),
                  size: 18
                }, null, 8, ["path"])
              ], 8, _hoisted_16),
              createBaseVNode("div", null, [
                createBaseVNode("code", null, toDisplayString(__props.link.shortUrl), 1),
                createVNode(unref(NcButton), {
                  variant: "tertiary",
                  "aria-label": unref(translate)("shortlinks", "Copy link"),
                  onClick: copyShortUrl
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                  ]),
                  _: 1
                }, 8, ["aria-label"])
              ])
            ]),
            qrUrl.value ? (openBlock(), createElementBlock("div", _hoisted_17, [
              createBaseVNode("img", {
                src: qrUrl.value,
                alt: unref(translate)("shortlinks", "QR code for {title}", { title: __props.link.title || __props.link.slug })
              }, null, 8, _hoisted_18),
              createBaseVNode("div", null, [
                createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "QR code")), 1),
                createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", "Scan to open the short link.")), 1),
                createBaseVNode("div", _hoisted_19, [
                  createVNode(unref(NcButton), {
                    size: "small",
                    onClick: copyQr
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Copy")), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NcButton), {
                    size: "small",
                    href: qrUrl.value,
                    download: `${__props.link.slug}-qr.svg`
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDownload) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Download")), 1)
                    ]),
                    _: 1
                  }, 8, ["href", "download"])
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          __props.link.description ? (openBlock(), createElementBlock("section", _hoisted_20, [
            createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Description")), 1),
            createBaseVNode("p", _hoisted_21, toDisplayString(__props.link.description), 1)
          ])) : createCommentVNode("", true),
          createBaseVNode("section", _hoisted_22, [
            createBaseVNode("h3", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiLockOutline),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Access and sharing")), 1)
            ]),
            createBaseVNode("dl", _hoisted_23, [
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Access")), 1),
                createBaseVNode("dd", null, toDisplayString(unref(translate)("shortlinks", accessLabel.value)), 1)
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Redirect")), 1),
                createBaseVNode("dd", null, [
                  createBaseVNode("span", _hoisted_24, toDisplayString(__props.link.redirectStatus), 1)
                ])
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Valid from")), 1),
                createBaseVNode("dd", null, toDisplayString(validFromLabel(__props.link.startsAt)), 1)
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Expires at")), 1),
                createBaseVNode("dd", null, toDisplayString(expiresAtLabel(__props.link.expiresAt)), 1)
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Visit limit")), 1),
                createBaseVNode("dd", null, toDisplayString(__props.link.clickLimit ?? unref(translate)("shortlinks", "No limit")), 1)
              ])
            ]),
            shares.value.length ? (openBlock(), createElementBlock("div", _hoisted_25, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(shares.value, (share) => {
                return openBlock(), createElementBlock("span", {
                  key: share.id,
                  class: "share-chip"
                }, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: share.type === "user" ? unref(mdiAccountOutline) : unref(mdiAccountGroupOutline),
                    size: 18
                  }, null, 8, ["path"]),
                  createBaseVNode("span", null, [
                    createBaseVNode("strong", null, toDisplayString(share.principalId), 1),
                    createBaseVNode("small", null, toDisplayString(shareLabel(share.purpose)) + " · " + toDisplayString(shareLabel(share.permission)), 1)
                  ]),
                  createBaseVNode("button", {
                    type: "button",
                    "aria-label": unref(translate)("shortlinks", "Remove"),
                    onClick: ($event) => removeShare(share.id)
                  }, "×", 8, _hoisted_26)
                ]);
              }), 128))
            ])) : createCommentVNode("", true),
            __props.link.canShare ? (openBlock(), createBlock(unref(NcButton), {
              key: 1,
              variant: "tertiary",
              onClick: _cache[1] || (_cache[1] = ($event) => showShareDialog.value = true)
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add person or group")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ]),
          createBaseVNode("section", _hoisted_27, [
            createBaseVNode("h3", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiChartLine),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Last 30 days")), 1)
            ]),
            createVNode(MiniLineChart, {
              compact: "",
              rows: miniStats.value?.timeSeries ?? [],
              color: __props.link.color || void 0
            }, null, 8, ["rows", "color"]),
            createBaseVNode("dl", _hoisted_28, [
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Total clicks")), 1),
                createBaseVNode("dd", null, toDisplayString(__props.link.clickCount), 1)
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Unique visitors")), 1),
                createBaseVNode("dd", null, toDisplayString(miniStats.value?.uniqueVisitors ?? 0), 1)
              ]),
              createBaseVNode("div", null, [
                createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Clicks today")), 1),
                createBaseVNode("dd", null, toDisplayString(miniStats.value?.clicksToday ?? 0), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_29, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(miniWinners.value, (item) => {
                return openBlock(), createElementBlock("div", {
                  key: item.label
                }, [
                  createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", item.label)), 1),
                  createBaseVNode("strong", null, [
                    createTextVNode(toDisplayString(item.value) + " ", 1),
                    createBaseVNode("span", null, toDisplayString(item.percentage) + "%", 1)
                  ])
                ]);
              }), 128))
            ])
          ]),
          createBaseVNode("section", _hoisted_30, [
            createBaseVNode("h3", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiFolderOutline),
                size: 22
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Organization")), 1)
            ]),
            createBaseVNode("div", _hoisted_31, [
              folder.value ? (openBlock(), createElementBlock("span", _hoisted_32, [
                createVNode(unref(NcIconSvgWrapper), {
                  path: unref(folderIconPath)(folder.value.icon),
                  size: 18
                }, null, 8, ["path"]),
                createTextVNode(toDisplayString(folder.value.name), 1)
              ])) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.link.tags, (tag) => {
                return openBlock(), createElementBlock("span", {
                  key: tag.id
                }, [
                  createBaseVNode("i", {
                    style: normalizeStyle({ backgroundColor: tag.color || "var(--color-primary-element)" })
                  }, null, 4),
                  createTextVNode(toDisplayString(tag.name), 1)
                ]);
              }), 128)),
              !folder.value && !__props.link.tags.length ? (openBlock(), createElementBlock("span", _hoisted_33, toDisplayString(unref(translate)("shortlinks", "Not organized yet")), 1)) : createCommentVNode("", true)
            ])
          ])
        ])) : tab.value === "stats" ? (openBlock(), createElementBlock("section", _hoisted_34, [
          createBaseVNode("div", _hoisted_35, [
            createBaseVNode("div", null, [
              createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Statistics")), 1),
              createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Understand reach, trends, and visitor context.")), 1)
            ]),
            createBaseVNode("div", _hoisted_36, [
              createVNode(unref(NcButton), {
                size: "small",
                onClick: _cache[2] || (_cache[2] = ($event) => exportStats("csv"))
              }, {
                default: withCtx(() => [..._cache[21] || (_cache[21] = [
                  createTextVNode(" CSV ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(NcButton), {
                size: "small",
                onClick: _cache[3] || (_cache[3] = ($event) => exportStats("json"))
              }, {
                default: withCtx(() => [..._cache[22] || (_cache[22] = [
                  createTextVNode(" JSON ", -1)
                ])]),
                _: 1
              })
            ])
          ]),
          createBaseVNode("div", {
            class: "period-buttons",
            role: "group",
            "aria-label": unref(translate)("shortlinks", "Period")
          }, [
            (openBlock(), createElementBlock(Fragment, null, renderList(periods, (item) => {
              return createVNode(unref(NcButton), {
                key: item.id,
                size: "small",
                variant: "tertiary",
                pressed: statsPeriod.value === item.id,
                onClick: ($event) => {
                  statsPeriod.value = item.id;
                  if (item.id !== "custom") loadStats();
                }
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", item.label)), 1)
                ]),
                _: 2
              }, 1032, ["pressed", "onClick"]);
            }), 64))
          ], 8, _hoisted_37),
          statsPeriod.value === "custom" ? (openBlock(), createElementBlock("div", _hoisted_38, [
            createBaseVNode("label", null, [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Start date")), 1),
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => customFrom.value = $event),
                type: "date"
              }, null, 512), [
                [vModelText, customFrom.value]
              ])
            ]),
            createBaseVNode("label", null, [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "End date")), 1),
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => customTo.value = $event),
                type: "date"
              }, null, 512), [
                [vModelText, customTo.value]
              ])
            ]),
            createVNode(unref(NcButton), {
              variant: "primary",
              onClick: loadStats
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Apply")), 1)
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true),
          createBaseVNode("label", _hoisted_39, [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Granularity")), 1),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => granularity.value = $event),
              onChange: loadStats
            }, [
              createBaseVNode("option", _hoisted_40, toDisplayString(unref(translate)("shortlinks", "Hourly")), 1),
              createBaseVNode("option", _hoisted_41, toDisplayString(unref(translate)("shortlinks", "Daily")), 1),
              createBaseVNode("option", _hoisted_42, toDisplayString(unref(translate)("shortlinks", "Weekly")), 1),
              createBaseVNode("option", _hoisted_43, toDisplayString(unref(translate)("shortlinks", "Monthly")), 1)
            ], 544), [
              [vModelSelect, granularity.value]
            ])
          ]),
          createBaseVNode("h3", _hoisted_44, toDisplayString(statsRangeLabel.value), 1),
          createBaseVNode("dl", _hoisted_45, [
            createBaseVNode("div", null, [
              createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Lifetime clicks")), 1),
              createBaseVNode("dd", null, toDisplayString(stats.value?.lifetimeClicks ?? __props.link.clickCount), 1)
            ]),
            createBaseVNode("div", null, [
              createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Clicks in period")), 1),
              createBaseVNode("dd", null, toDisplayString(stats.value?.totalClicks ?? 0), 1)
            ]),
            createBaseVNode("div", null, [
              createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Unique visitors")), 1),
              createBaseVNode("dd", null, toDisplayString(stats.value?.uniqueVisitors ?? 0), 1)
            ]),
            createBaseVNode("div", null, [
              createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Clicks today")), 1),
              createBaseVNode("dd", null, toDisplayString(stats.value?.clicksToday ?? 0), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_46, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(statsWinners.value, (item) => {
              return openBlock(), createElementBlock("div", {
                key: item.label
              }, [
                createBaseVNode("small", null, toDisplayString(unref(translate)("shortlinks", item.label)), 1),
                createBaseVNode("strong", null, [
                  createTextVNode(toDisplayString(item.value) + " ", 1),
                  createBaseVNode("span", null, toDisplayString(item.percentage) + "%", 1)
                ])
              ]);
            }), 128))
          ]),
          createVNode(MiniLineChart, {
            rows: stats.value?.timeSeries ?? [],
            color: __props.link.color || void 0
          }, null, 8, ["rows", "color"]),
          createBaseVNode("div", _hoisted_47, [
            createVNode(StatsDimension, {
              title: unref(translate)("shortlinks", "Most clicked links"),
              icon: unref(mdiCursorDefaultClickOutline),
              rows: stats.value ? [{ value: __props.link.title || __props.link.slug, clicks: stats.value.totalClicks, uniqueVisitors: stats.value.uniqueVisitors }] : [],
              "show-unique": ""
            }, null, 8, ["title", "icon", "rows"]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(stats.value?.dimensions ?? {}, (rows, dimension) => {
              return openBlock(), createElementBlock("section", { key: dimension }, [
                createVNode(StatsDimension, {
                  title: dimensionLabel(dimension),
                  icon: dimensionIcons[dimension] || unref(mdiChartDonut),
                  rows: expandedDimensions[dimension] ? rows : rows.slice(0, 5),
                  "show-unique": ""
                }, null, 8, ["title", "icon", "rows"]),
                rows.length > 5 ? (openBlock(), createBlock(unref(NcButton), {
                  key: 0,
                  variant: "tertiary",
                  onClick: ($event) => expandedDimensions[dimension] = !expandedDimensions[dimension]
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(expandedDimensions[dimension] ? unref(translate)("shortlinks", "Show less") : unref(translate)("shortlinks", "Show all {count}", { count: rows.length })), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"])) : createCommentVNode("", true)
              ]);
            }), 128))
          ])
        ])) : tab.value === "clicks" ? (openBlock(), createElementBlock("section", _hoisted_48, [
          createBaseVNode("div", _hoisted_49, [
            createBaseVNode("div", null, [
              createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Click log")), 1),
              createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Individual visits retained according to the privacy settings.")), 1)
            ]),
            createBaseVNode("div", _hoisted_50, [
              createVNode(unref(NcButton), {
                size: "small",
                onClick: _cache[7] || (_cache[7] = ($event) => exportClicks("csv"))
              }, {
                default: withCtx(() => [..._cache[23] || (_cache[23] = [
                  createTextVNode(" CSV ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(NcButton), {
                size: "small",
                onClick: _cache[8] || (_cache[8] = ($event) => exportClicks("json"))
              }, {
                default: withCtx(() => [..._cache[24] || (_cache[24] = [
                  createTextVNode(" JSON ", -1)
                ])]),
                _: 1
              })
            ])
          ]),
          createBaseVNode("div", _hoisted_51, [
            createBaseVNode("label", null, [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Period")), 1),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => clickPeriod.value = $event),
                onChange: _cache[10] || (_cache[10] = ($event) => loadClicks(true))
              }, [
                (openBlock(), createElementBlock(Fragment, null, renderList(periods, (item) => {
                  return createBaseVNode("option", {
                    key: item.id,
                    value: item.id
                  }, toDisplayString(unref(translate)("shortlinks", item.label)), 9, _hoisted_52);
                }), 64))
              ], 544), [
                [vModelSelect, clickPeriod.value]
              ])
            ]),
            createBaseVNode("label", null, [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Visitor type")), 1),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => clickBot.value = $event),
                onChange: _cache[12] || (_cache[12] = ($event) => loadClicks(true))
              }, [
                createBaseVNode("option", _hoisted_53, toDisplayString(unref(translate)("shortlinks", "All visitors")), 1),
                createBaseVNode("option", _hoisted_54, toDisplayString(unref(translate)("shortlinks", "Humans only")), 1),
                createBaseVNode("option", _hoisted_55, toDisplayString(unref(translate)("shortlinks", "Bots only")), 1)
              ], 544), [
                [vModelSelect, clickBot.value]
              ])
            ])
          ]),
          clicks.value.length ? (openBlock(), createElementBlock("div", _hoisted_56, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(clicks.value, (entry) => {
              return openBlock(), createElementBlock("article", {
                key: entry.id
              }, [
                createBaseVNode("div", _hoisted_57, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: entry.isBot ? unref(mdiRobotOutline) : unref(mdiCursorDefaultClickOutline)
                  }, null, 8, ["path"])
                ]),
                createBaseVNode("div", _hoisted_58, [
                  createBaseVNode("strong", null, toDisplayString(entry.referrerDomain || unref(translate)("shortlinks", "Direct visit")), 1),
                  createBaseVNode("div", _hoisted_59, [
                    createBaseVNode("span", null, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiWeb),
                        size: 15
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(entry.browser || unref(translate)("shortlinks", "Unknown")), 1)
                    ]),
                    createBaseVNode("span", null, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiLaptop),
                        size: 15
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(entry.os || unref(translate)("shortlinks", "Unknown")), 1)
                    ]),
                    createBaseVNode("span", null, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiCursorDefaultClickOutline),
                        size: 15
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString(entry.deviceType || unref(translate)("shortlinks", "Unknown")), 1)
                    ]),
                    createBaseVNode("span", null, [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: unref(mdiMapMarkerOutline),
                        size: 15
                      }, null, 8, ["path"]),
                      createTextVNode(toDisplayString([entry.country, entry.region].filter(Boolean).join(", ") || unref(translate)("shortlinks", "Unknown region")), 1)
                    ])
                  ])
                ]),
                createBaseVNode("time", {
                  datetime: new Date(entry.clickedAt * 1e3).toISOString(),
                  title: new Date(entry.clickedAt * 1e3).toLocaleString()
                }, toDisplayString(relativeTime(entry.clickedAt)), 9, _hoisted_60)
              ]);
            }), 128))
          ])) : (openBlock(), createElementBlock("p", _hoisted_61, toDisplayString(unref(translate)("shortlinks", "No detailed click events are available for this period.")), 1)),
          clickHasMore.value ? (openBlock(), createBlock(unref(NcButton), {
            key: 2,
            onClick: _cache[13] || (_cache[13] = ($event) => loadClicks())
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Load more")), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ])) : (openBlock(), createElementBlock("section", _hoisted_62, [
          createBaseVNode("div", _hoisted_63, [
            createBaseVNode("div", null, [
              createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Activity")), 1),
              createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "A timeline of changes to this short link.")), 1)
            ])
          ]),
          activity.value.length ? (openBlock(), createElementBlock("ol", _hoisted_64, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(activity.value, (entry) => {
              return openBlock(), createElementBlock("li", {
                key: String(entry.id)
              }, [
                createBaseVNode("span", null, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: eventIcon(entry.eventType),
                    size: 20
                  }, null, 8, ["path"])
                ]),
                createBaseVNode("div", null, [
                  createBaseVNode("strong", null, toDisplayString(eventLabel(entry.eventType)), 1),
                  createBaseVNode("time", {
                    datetime: new Date(entry.createdAt * 1e3).toISOString()
                  }, toDisplayString(new Date(entry.createdAt * 1e3).toLocaleString()), 9, _hoisted_65)
                ])
              ]);
            }), 128))
          ])) : (openBlock(), createElementBlock("p", _hoisted_66, toDisplayString(unref(translate)("shortlinks", "No activity has been recorded yet.")), 1))
        ])),
        showShareDialog.value ? (openBlock(), createBlock(unref(NcDialog), {
          key: 6,
          name: unref(translate)("shortlinks", "Add person or group"),
          onClosing: _cache[20] || (_cache[20] = ($event) => showShareDialog.value = false)
        }, {
          actions: withCtx(() => [
            createVNode(unref(NcButton), {
              onClick: _cache[19] || (_cache[19] = ($event) => showShareDialog.value = false)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
              ]),
              _: 1
            }),
            createVNode(unref(NcButton), {
              type: "submit",
              form: "shortlinks-share-form",
              variant: "primary",
              disabled: !sharePrincipal.value.trim()
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add permission")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          default: withCtx(() => [
            createBaseVNode("form", {
              id: "shortlinks-share-form",
              class: "share-form",
              onSubmit: withModifiers(addShare, ["prevent"])
            }, [
              createBaseVNode("label", null, [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Recipient type")), 1),
                withDirectives(createBaseVNode("select", {
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => shareType.value = $event)
                }, [
                  createBaseVNode("option", _hoisted_67, toDisplayString(unref(translate)("shortlinks", "User")), 1),
                  createBaseVNode("option", _hoisted_68, toDisplayString(unref(translate)("shortlinks", "Group")), 1)
                ], 512), [
                  [vModelSelect, shareType.value]
                ])
              ]),
              createVNode(unref(_sfc_main$1), {
                modelValue: sharePrincipal.value,
                "onUpdate:modelValue": [
                  _cache[15] || (_cache[15] = ($event) => sharePrincipal.value = $event),
                  _cache[16] || (_cache[16] = ($event) => principalResults.value = [])
                ],
                label: unref(translate)("shortlinks", "User or group"),
                autocomplete: "off"
              }, null, 8, ["modelValue", "label"]),
              createVNode(unref(NcButton), {
                type: "button",
                disabled: searchingPrincipals.value || sharePrincipal.value.trim().length < 2,
                onClick: searchPrincipals
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Search recipients")), 1)
                ]),
                _: 1
              }, 8, ["disabled"]),
              principalResults.value.length ? (openBlock(), createElementBlock("ul", _hoisted_69, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(principalResults.value, (principal) => {
                  return openBlock(), createElementBlock("li", {
                    key: `${principal.type}:${principal.id}`
                  }, [
                    createBaseVNode("button", {
                      type: "button",
                      onClick: ($event) => selectPrincipal(principal)
                    }, [
                      createTextVNode(toDisplayString(principal.label) + " ", 1),
                      createBaseVNode("small", null, toDisplayString(principal.id), 1)
                    ], 8, _hoisted_70)
                  ]);
                }), 128))
              ])) : createCommentVNode("", true),
              createBaseVNode("label", null, [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Purpose")), 1),
                withDirectives(createBaseVNode("select", {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => sharePurpose.value = $event)
                }, [
                  createBaseVNode("option", _hoisted_71, toDisplayString(unref(translate)("shortlinks", "Management")), 1),
                  createBaseVNode("option", _hoisted_72, toDisplayString(unref(translate)("shortlinks", "Redirect access")), 1)
                ], 512), [
                  [vModelSelect, sharePurpose.value]
                ])
              ]),
              sharePurpose.value === "management" ? (openBlock(), createElementBlock("label", _hoisted_73, [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Permission")), 1),
                withDirectives(createBaseVNode("select", {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => sharePermission.value = $event)
                }, [
                  createBaseVNode("option", _hoisted_74, toDisplayString(unref(translate)("shortlinks", "View")), 1),
                  createBaseVNode("option", _hoisted_75, toDisplayString(unref(translate)("shortlinks", "Edit")), 1)
                ], 512), [
                  [vModelSelect, sharePermission.value]
                ])
              ])) : createCommentVNode("", true)
            ], 32)
          ]),
          _: 1
        }, 8, ["name"])) : createCommentVNode("", true)
      ], 4);
    };
  }
});
const LinkDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6878aee"]]);
export {
  LinkDetail as default
};
