const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, x as ref, w as watch, o as onMounted, U as resolveComponent, j as openBlock, k as createBlock, Y as createSlots, Q as withCtx, P as createVNode, u as unref, H as createTextVNode, I as toDisplayString, D as createBaseVNode, R as normalizeClass, v as normalizeStyle, p as createElementBlock, F as Fragment, E as renderList, N as withDirectives, V as vModelText, L as createCommentVNode, G as mergeProps, l as resolveDynamicComponent, d as computed } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate, aE as mdiTrendingUp, bS as mdiTrendingDown, bT as mdiNewBox, bz as mdiRobotOutline, al as mdiAccountGroupOutline, bA as mdiLaptop, bw as mdiWeb, bB as mdiMapMarkerOutline, b9 as mdiEarth, bC as mdiChartDonut } from "./vendor-CflEb2sm.chunk.mjs";
import { a as showError } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { g as NcButton, q as NcLoadingIcon, a as NcDialog } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api } from "./shortlinks-main.mjs";
import { M as MiniLineChart, S as StatsDimension } from "./StatsDimension--wxqRH-u.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1 = ["aria-label"];
const _hoisted_2 = {
  key: 0,
  class: "custom-range"
};
const _hoisted_3 = {
  key: 1,
  class: "link-count"
};
const _hoisted_4 = { key: 0 };
const _hoisted_5 = { class: "stats-summary" };
const _hoisted_6 = { class: "trend-section" };
const _hoisted_7 = { class: "stats-sections" };
const _hoisted_8 = { class: "winner-grid" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatsOverview",
  props: {
    mode: { default: "dialog" },
    contextTitle: { default: "" },
    contextColor: { default: null },
    filters: { default: () => ({}) },
    initialPeriod: { default: "30d" },
    initialFrom: { default: "" },
    initialTo: { default: "" }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const data = ref(null);
    const loading = ref(false);
    const period = ref(props.initialPeriod);
    const customFrom = ref(props.initialFrom || new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const customTo = ref(props.initialTo || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    const periods = [
      { id: "7d", label: "Last 7 days" },
      { id: "30d", label: "Last 30 days" },
      { id: "90d", label: "Last 3 months" },
      { id: "thisYear", label: "This year" },
      { id: "lastYear", label: "Last year" },
      { id: "all", label: "Since the beginning" },
      { id: "custom", label: "Custom" }
    ];
    const dimensionConfig = {
      referrer: { label: "Referrers", icon: mdiWeb },
      country: { label: "Countries", icon: mdiEarth },
      region: { label: "Regions", icon: mdiMapMarkerOutline },
      browser: { label: "Browsers", icon: mdiWeb },
      os: { label: "Operating systems", icon: mdiLaptop },
      device: { label: "Devices", icon: mdiLaptop },
      authentication: { label: "Authentication", icon: mdiAccountGroupOutline },
      bot: { label: "Bots", icon: mdiRobotOutline }
    };
    const heroStyle = computed(() => ({ "--stats-accent": props.contextColor || "var(--color-primary-element)" }));
    const inactiveCount = computed(() => data.value ? Math.max(0, data.value.totalLinks - data.value.activeLinks) : 0);
    const topRows = computed(() => data.value?.topLinks.map((link) => ({ value: link.title || link.slug, clicks: link.clicks })) ?? []);
    const leastRows = computed(() => data.value?.leastUsedLinks.map((link) => ({ value: link.title || link.slug, clicks: link.clicks })) ?? []);
    const newestRows = computed(() => data.value?.newestLinks.map((link) => ({ value: link.title || link.slug, clicks: link.clicks })) ?? []);
    watch(() => props.filters, load, { deep: true });
    onMounted(load);
    function range() {
      const now = /* @__PURE__ */ new Date();
      const to = Math.floor(now.getTime() / 1e3);
      if (period.value === "7d") return { from: to - 7 * 86400, to };
      if (period.value === "30d") return { from: to - 30 * 86400, to };
      if (period.value === "90d") return { from: to - 90 * 86400, to };
      if (period.value === "thisYear") return { from: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1e3), to };
      if (period.value === "lastYear") return { from: Math.floor(new Date(now.getFullYear() - 1, 0, 1).getTime() / 1e3), to: Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1e3) - 1 };
      if (period.value === "all") return { from: 0, to };
      const fromValue = Math.floor((/* @__PURE__ */ new Date(`${customFrom.value}T00:00:00`)).getTime() / 1e3);
      const toValue = Math.floor((/* @__PURE__ */ new Date(`${customTo.value}T23:59:59`)).getTime() / 1e3);
      return { from: Number.isFinite(fromValue) ? fromValue : to - 30 * 86400, to: Number.isFinite(toValue) ? Math.min(to, toValue) : to };
    }
    async function load() {
      loading.value = true;
      try {
        data.value = await api.statsOverview({ ...props.filters, ...range() });
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    }
    function selectPeriod(value) {
      period.value = value;
      if (value !== "custom") load();
    }
    return (_ctx, _cache) => {
      const _component_NcIconSvgWrapper = resolveComponent("NcIconSvgWrapper");
      return openBlock(), createBlock(resolveDynamicComponent(__props.mode === "dialog" ? unref(NcDialog) : "section"), mergeProps(__props.mode === "dialog" ? { name: unref(translate)("shortlinks", "Statistics overview"), size: "large" } : { "aria-label": unref(translate)("shortlinks", "Statistics overview") }, {
        onClosing: _cache[3] || (_cache[3] = ($event) => emit("close"))
      }), createSlots({
        default: withCtx(() => [
          createBaseVNode("div", {
            class: normalizeClass(["stats-overview", { "stats-overview--page": __props.mode === "page" }])
          }, [
            createBaseVNode("header", {
              class: "stats-hero",
              style: normalizeStyle(heroStyle.value)
            }, [
              createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Statistics for")), 1),
              createBaseVNode("h2", null, toDisplayString(__props.contextTitle || unref(translate)("shortlinks", "All links")), 1),
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
                    pressed: period.value === item.id,
                    onClick: ($event) => selectPeriod(item.id)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", item.label)), 1)
                    ]),
                    _: 2
                  }, 1032, ["pressed", "onClick"]);
                }), 64))
              ], 8, _hoisted_1),
              period.value === "custom" ? (openBlock(), createElementBlock("div", _hoisted_2, [
                createBaseVNode("label", null, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Start date")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => customFrom.value = $event),
                    type: "date"
                  }, null, 512), [
                    [vModelText, customFrom.value]
                  ])
                ]),
                createBaseVNode("label", null, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "End date")), 1),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => customTo.value = $event),
                    type: "date"
                  }, null, 512), [
                    [vModelText, customTo.value]
                  ])
                ]),
                createVNode(unref(NcButton), {
                  variant: "primary",
                  onClick: load
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Apply")), 1)
                  ]),
                  _: 1
                })
              ])) : createCommentVNode("", true),
              data.value ? (openBlock(), createElementBlock("p", _hoisted_3, [
                createBaseVNode("strong", null, toDisplayString(data.value.totalLinks), 1),
                createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "links total")), 1),
                inactiveCount.value ? (openBlock(), createElementBlock("span", _hoisted_4, " · " + toDisplayString(unref(translate)("shortlinks", "{count} inactive", { count: inactiveCount.value })), 1)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ], 4),
            loading.value && !data.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
              key: 0,
              name: unref(translate)("shortlinks", "Loading statistics")
            }, null, 8, ["name"])) : createCommentVNode("", true),
            data.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createBaseVNode("dl", _hoisted_5, [
                createBaseVNode("div", null, [
                  createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Lifetime clicks")), 1),
                  createBaseVNode("dd", null, toDisplayString(data.value.totalClicks), 1)
                ]),
                createBaseVNode("div", null, [
                  createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Clicks in period")), 1),
                  createBaseVNode("dd", null, toDisplayString(data.value.periodClicks), 1)
                ]),
                createBaseVNode("div", null, [
                  createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Unique visitors")), 1),
                  createBaseVNode("dd", null, toDisplayString(data.value.uniqueVisitors), 1)
                ]),
                createBaseVNode("div", null, [
                  createBaseVNode("dt", null, toDisplayString(unref(translate)("shortlinks", "Clicks today")), 1),
                  createBaseVNode("dd", null, toDisplayString(data.value.clicksToday), 1)
                ])
              ]),
              createBaseVNode("section", _hoisted_6, [
                createBaseVNode("h3", null, [
                  createVNode(_component_NcIconSvgWrapper, {
                    path: unref(mdiTrendingUp),
                    size: 22,
                    "aria-hidden": "true"
                  }, null, 8, ["path"]),
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Clicks over time")), 1)
                ]),
                createVNode(MiniLineChart, {
                  rows: data.value.timeSeries ?? [],
                  color: __props.contextColor || void 0
                }, null, 8, ["rows", "color"])
              ]),
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("div", _hoisted_8, [
                  createVNode(StatsDimension, {
                    title: unref(translate)("shortlinks", "Top performers"),
                    icon: unref(mdiTrendingUp),
                    rows: topRows.value
                  }, null, 8, ["title", "icon", "rows"]),
                  createVNode(StatsDimension, {
                    title: unref(translate)("shortlinks", "Links needing attention"),
                    icon: unref(mdiTrendingDown),
                    rows: leastRows.value
                  }, null, 8, ["title", "icon", "rows"]),
                  createVNode(StatsDimension, {
                    title: unref(translate)("shortlinks", "Newest links"),
                    icon: unref(mdiNewBox),
                    rows: newestRows.value
                  }, null, 8, ["title", "icon", "rows"])
                ]),
                (openBlock(true), createElementBlock(Fragment, null, renderList(data.value.dimensions, (rows, dimension) => {
                  return openBlock(), createBlock(StatsDimension, {
                    key: dimension,
                    title: unref(translate)("shortlinks", dimensionConfig[dimension]?.label || dimension),
                    icon: dimensionConfig[dimension]?.icon || unref(mdiChartDonut),
                    rows
                  }, null, 8, ["title", "icon", "rows"]);
                }), 128))
              ])
            ], 64)) : createCommentVNode("", true)
          ], 2)
        ]),
        _: 2
      }, [
        __props.mode === "dialog" ? {
          name: "actions",
          fn: withCtx(() => [
            createVNode(unref(NcButton), {
              onClick: _cache[2] || (_cache[2] = ($event) => emit("close"))
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Close")), 1)
              ]),
              _: 1
            })
          ]),
          key: "0"
        } : void 0
      ]), 1040);
    };
  }
});
const StatsOverview = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f451948"]]);
export {
  StatsOverview as default
};
