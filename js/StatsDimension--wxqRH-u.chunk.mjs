const appName = "shortlinks";
const appVersion = "1.2.2";
import { an as translate } from "./vendor-CflEb2sm.chunk.mjs";
import { W as defineComponent, j as openBlock, p as createElementBlock, u as unref, R as normalizeClass, F as Fragment, E as renderList, v as normalizeStyle, D as createBaseVNode, I as toDisplayString, H as createTextVNode, L as createCommentVNode, d as computed, P as createVNode } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import { h as NcIconSvgWrapper } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
const _hoisted_1$2 = ["aria-label"];
const _hoisted_2$2 = {
  key: 0,
  viewBox: "0 0 640 360",
  preserveAspectRatio: "none"
};
const _hoisted_3$1 = ["x", "y", "width", "height"];
const _hoisted_4$1 = ["y1", "y2"];
const _hoisted_5$1 = ["d"];
const _hoisted_6$1 = ["d"];
const _hoisted_7 = ["d"];
const _hoisted_8 = ["cx", "cy"];
const _hoisted_9 = ["cx", "cy"];
const _hoisted_10 = {
  x: "4",
  y: "36"
};
const _hoisted_11 = {
  x: "32",
  y: "354"
};
const _hoisted_12 = {
  x: "608",
  y: "354",
  "text-anchor": "end"
};
const _hoisted_13 = { key: 1 };
const _hoisted_14 = {
  key: 2,
  class: "line-chart__legend"
};
const width = 640;
const height = 360;
const padding = 32;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MiniLineChart",
  props: {
    rows: { default: () => [] },
    color: { default: "var(--color-primary-element)" },
    label: { default: "" },
    compact: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const maximum = computed(() => Math.max(1, ...props.rows.flatMap((row) => [row.clicks, row.uniqueVisitors])));
    const points = computed(() => props.rows.map((row, index) => ({
      ...row,
      x: props.rows.length <= 1 ? width / 2 : padding + index * ((width - padding * 2) / (props.rows.length - 1)),
      y: height - padding - row.clicks / maximum.value * (height - padding * 2)
    })));
    const path = computed(() => points.value.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" "));
    const area = computed(() => points.value.length ? `${path.value} L ${points.value.at(-1)?.x} ${height - padding} L ${points.value[0]?.x} ${height - padding} Z` : "");
    const uniquePoints = computed(() => props.rows.map((row, index) => ({
      ...row,
      x: props.rows.length <= 1 ? width / 2 : padding + index * ((width - padding * 2) / (props.rows.length - 1)),
      y: height - padding - row.uniqueVisitors / maximum.value * (height - padding * 2)
    })));
    const uniquePath = computed(() => uniquePoints.value.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" "));
    const barWidth = computed(() => Math.max(3, Math.min(24, (width - padding * 2) / Math.max(1, props.rows.length) * 0.68)));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["line-chart", { "line-chart--compact": __props.compact }]),
        role: "img",
        "aria-label": __props.label || unref(translate)("shortlinks", "Clicks over time")
      }, [
        __props.rows.length ? (openBlock(), createElementBlock("svg", _hoisted_2$2, [
          __props.compact ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(points.value, (point) => {
            return openBlock(), createElementBlock("rect", {
              key: point.day,
              x: point.x - barWidth.value / 2,
              y: point.y,
              width: barWidth.value,
              height: Math.max(2, height - padding - point.y),
              style: normalizeStyle({ color: __props.color })
            }, [
              createBaseVNode("title", null, toDisplayString(point.day) + ": " + toDisplayString(point.clicks) + " " + toDisplayString(unref(translate)("shortlinks", "clicks")), 1)
            ], 12, _hoisted_3$1);
          }), 128)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            (openBlock(), createElementBlock(Fragment, null, renderList(5, (step) => {
              return createBaseVNode("line", {
                key: step,
                x1: "32",
                x2: "608",
                y1: 32 + (step - 1) * 74,
                y2: 32 + (step - 1) * 74,
                class: "line-chart__grid"
              }, null, 8, _hoisted_4$1);
            }), 64)),
            createBaseVNode("path", {
              d: area.value,
              class: "line-chart__area",
              style: normalizeStyle({ color: __props.color })
            }, null, 12, _hoisted_5$1),
            createBaseVNode("path", {
              d: path.value,
              class: "line-chart__line",
              style: normalizeStyle({ color: __props.color })
            }, null, 12, _hoisted_6$1),
            createBaseVNode("path", {
              d: uniquePath.value,
              class: "line-chart__line line-chart__line--unique"
            }, null, 8, _hoisted_7),
            (openBlock(true), createElementBlock(Fragment, null, renderList(points.value, (point) => {
              return openBlock(), createElementBlock("circle", {
                key: `clicks-${point.day}`,
                cx: point.x,
                cy: point.y,
                r: "5",
                style: normalizeStyle({ color: __props.color })
              }, [
                createBaseVNode("title", null, toDisplayString(point.day) + ": " + toDisplayString(point.clicks) + " " + toDisplayString(unref(translate)("shortlinks", "clicks")) + ", " + toDisplayString(point.uniqueVisitors) + " " + toDisplayString(unref(translate)("shortlinks", "unique visitors")), 1)
              ], 12, _hoisted_8);
            }), 128)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(uniquePoints.value, (point) => {
              return openBlock(), createElementBlock("circle", {
                key: `visitors-${point.day}`,
                cx: point.x,
                cy: point.y,
                r: "4",
                class: "line-chart__unique-point"
              }, [
                createBaseVNode("title", null, toDisplayString(point.day) + ": " + toDisplayString(point.uniqueVisitors) + " " + toDisplayString(unref(translate)("shortlinks", "unique visitors")), 1)
              ], 8, _hoisted_9);
            }), 128)),
            createBaseVNode("text", _hoisted_10, toDisplayString(maximum.value), 1),
            _cache[0] || (_cache[0] = createBaseVNode("text", {
              x: "16",
              y: "332"
            }, "0", -1)),
            createBaseVNode("text", _hoisted_11, toDisplayString(points.value[0]?.day), 1),
            createBaseVNode("text", _hoisted_12, toDisplayString(points.value.at(-1)?.day), 1)
          ], 64))
        ])) : (openBlock(), createElementBlock("p", _hoisted_13, toDisplayString(unref(translate)("shortlinks", "No statistics are available for this period.")), 1)),
        __props.rows.length && !__props.compact ? (openBlock(), createElementBlock("div", _hoisted_14, [
          createBaseVNode("span", null, [
            createBaseVNode("i", {
              style: normalizeStyle({ background: __props.color })
            }, null, 4),
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Clicks")), 1)
          ]),
          createBaseVNode("span", null, [
            _cache[1] || (_cache[1] = createBaseVNode("i", null, null, -1)),
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Unique visitors")), 1)
          ])
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$2);
    };
  }
});
const MiniLineChart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4f26c308"]]);
const _hoisted_1$1 = { class: "pie-chart-wrap" };
const _hoisted_2$1 = ["aria-label"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MiniPieChart",
  props: {
    rows: {}
  },
  setup(__props) {
    const props = __props;
    const colors = ["var(--color-primary-element)", "var(--color-success)", "var(--color-warning)", "var(--color-error)", "var(--color-primary-element-hover)", "var(--color-text-maxcontrast)"];
    const grouped = computed(() => {
      const sorted = [...props.rows].filter((row) => row.clicks > 0).sort((a, b) => b.clicks - a.clicks);
      const top = sorted.slice(0, 5);
      const other = sorted.slice(5).reduce((sum, row) => sum + row.clicks, 0);
      return other > 0 ? [...top, { value: translate("shortlinks", "Other"), clicks: other }] : top;
    });
    const total = computed(() => grouped.value.reduce((sum, row) => sum + row.clicks, 0));
    const gradient = computed(() => {
      if (total.value === 0) return "var(--color-background-dark)";
      let current = 0;
      const segments = grouped.value.map((row, index) => {
        const start = current;
        current += row.clicks / total.value * 100;
        return `${colors[index % colors.length]} ${start}% ${current}%`;
      });
      return `conic-gradient(${segments.join(", ")})`;
    });
    const label = computed(() => grouped.value.map((row) => `${row.value}: ${row.clicks}`).join(", "));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", {
          class: "pie-chart",
          role: "img",
          "aria-label": label.value,
          style: normalizeStyle({ background: gradient.value })
        }, [
          createBaseVNode("span", null, toDisplayString(total.value), 1)
        ], 12, _hoisted_2$1),
        createBaseVNode("ul", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(grouped.value, (row, index) => {
            return openBlock(), createElementBlock("li", {
              key: row.value
            }, [
              createBaseVNode("i", {
                style: normalizeStyle({ background: colors[index % colors.length] })
              }, null, 4),
              createBaseVNode("span", null, toDisplayString(row.value), 1),
              createBaseVNode("strong", null, toDisplayString(row.clicks), 1)
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const MiniPieChart = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-84bc951f"]]);
const _hoisted_1 = { class: "stats-dimension" };
const _hoisted_2 = {
  key: 0,
  class: "stats-dimension__content"
};
const _hoisted_3 = { class: "stats-dimension__table" };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = {
  key: 1,
  class: "stats-dimension__empty"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatsDimension",
  props: {
    title: {},
    icon: {},
    rows: {},
    showUnique: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createBaseVNode("h3", null, [
          createVNode(unref(NcIconSvgWrapper), {
            path: __props.icon,
            size: 22,
            "aria-hidden": "true"
          }, null, 8, ["path"]),
          createTextVNode(toDisplayString(__props.title), 1)
        ]),
        __props.rows.length ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createVNode(MiniPieChart, { rows: __props.rows }, null, 8, ["rows"]),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("table", null, [
              createBaseVNode("thead", null, [
                createBaseVNode("tr", null, [
                  createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Value")), 1),
                  createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Clicks")), 1),
                  __props.showUnique ? (openBlock(), createElementBlock("th", _hoisted_4, toDisplayString(unref(translate)("shortlinks", "Unique visitors")), 1)) : createCommentVNode("", true)
                ])
              ]),
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.rows, (row) => {
                  return openBlock(), createElementBlock("tr", {
                    key: row.value
                  }, [
                    createBaseVNode("td", null, toDisplayString(row.value), 1),
                    createBaseVNode("td", null, toDisplayString(row.clicks), 1),
                    __props.showUnique ? (openBlock(), createElementBlock("td", _hoisted_5, toDisplayString(row.uniqueVisitors ?? 0), 1)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ])
            ])
          ])
        ])) : (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(unref(translate)("shortlinks", "No data for this period.")), 1))
      ]);
    };
  }
});
const StatsDimension = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4f279d3d"]]);
export {
  MiniLineChart as M,
  StatsDimension as S
};
