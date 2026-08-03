const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, r as reactive, w as watch, j as openBlock, p as createElementBlock, P as createVNode, Q as withCtx, D as createBaseVNode, u as unref, H as createTextVNode, I as toDisplayString, L as createCommentVNode, N as withDirectives, ah as vModelSelect, k as createBlock, F as Fragment, E as renderList, J as withKeys, R as normalizeClass, x as ref, d as computed, a1 as createApp } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { n as loadState, an as translate, F as cancelableClient, Y as generateUrl } from "./vendor-CflEb2sm.chunk.mjs";
import { s as showSuccess, a as showError } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { f as NcCheckboxRadioSwitch, _ as _sfc_main$1, k as NcSettingsSection, l as NcNoteCard, g as NcButton, m as NcTextArea } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1 = { class: "shortlinks-admin-settings" };
const _hoisted_2 = { class: "settings-controls" };
const _hoisted_3 = { class: "settings-controls" };
const _hoisted_4 = {
  key: 0,
  class: "settings-grid"
};
const _hoisted_5 = { class: "settings-controls" };
const _hoisted_6 = { class: "settings-grid settings-grid--three" };
const _hoisted_7 = { class: "settings-select" };
const _hoisted_8 = { value: "random" };
const _hoisted_9 = { value: "base36" };
const _hoisted_10 = { value: "base62" };
const _hoisted_11 = { value: "readable" };
const _hoisted_12 = {
  key: 0,
  class: "settings-grid"
};
const _hoisted_13 = { class: "settings-select" };
const _hoisted_14 = { value: "random" };
const _hoisted_15 = { value: "numbered" };
const _hoisted_16 = { class: "settings-subsection" };
const _hoisted_17 = { class: "settings-hint" };
const _hoisted_18 = { class: "settings-select" };
const _hoisted_19 = { value: "simple" };
const _hoisted_20 = { value: "template" };
const _hoisted_21 = { value: "regex" };
const _hoisted_22 = {
  key: 2,
  class: "settings-grid"
};
const _hoisted_23 = { class: "settings-options" };
const _hoisted_24 = { class: "settings-options__list" };
const _hoisted_25 = { class: "settings-add-row" };
const _hoisted_26 = { class: "settings-controls" };
const _hoisted_27 = { class: "settings-options" };
const _hoisted_28 = { class: "settings-options__list" };
const _hoisted_29 = { class: "settings-add-row" };
const _hoisted_30 = { class: "settings-grid" };
const _hoisted_31 = { class: "settings-hint" };
const _hoisted_32 = { class: "thumbnail-overview" };
const _hoisted_33 = {
  class: "thumbnail-overview__stats",
  "aria-live": "polite"
};
const _hoisted_34 = {
  key: 0,
  class: "settings-hint"
};
const _hoisted_35 = {
  key: 1,
  class: "settings-hint"
};
const _hoisted_36 = { class: "thumbnail-overview__actions" };
const _hoisted_37 = { class: "settings-controls" };
const _hoisted_38 = { class: "settings-hint" };
const _hoisted_39 = { class: "settings-grid" };
const _hoisted_40 = { class: "settings-select" };
const _hoisted_41 = { value: "counts" };
const _hoisted_42 = { value: "detailed" };
const _hoisted_43 = { class: "settings-select" };
const _hoisted_44 = { value: "none" };
const _hoisted_45 = { value: "domain" };
const _hoisted_46 = { value: "path" };
const _hoisted_47 = { value: "full" };
const _hoisted_48 = { class: "settings-controls" };
const _hoisted_49 = { class: "settings-grid" };
const _hoisted_50 = { class: "settings-controls" };
const _hoisted_51 = { class: "system-jobs" };
const _hoisted_52 = { class: "maintenance-actions" };
const _hoisted_53 = { class: "save-actions" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminApp",
  setup(__props) {
    const defaultRedirectStatuses = [301, 302, 307, 308];
    const defaultSchemes = ["http", "https"];
    const unsafeSchemes = ["about", "blob", "data", "file", "javascript", "vbscript"];
    const settings = reactive(loadState("shortlinks", "admin-settings"));
    const lists = reactive({
      creation_groups: settings.creation_groups.join(", "),
      public_creation_groups: settings.public_creation_groups.join(", "),
      reserved_aliases: settings.reserved_aliases.join(", "),
      domain_allowlist: settings.domain_allowlist.join("\n"),
      domain_blocklist: settings.domain_blocklist.join("\n")
    });
    const geo = loadState("shortlinks", "geo-status");
    const systemStatus = loadState("shortlinks", "system-status");
    const thumbnailStatus = reactive(loadState("shortlinks", "thumbnail-status"));
    const saving = ref(false);
    const maintenanceDays = ref(30);
    const runningMaintenance = ref("");
    const refreshingThumbnails = ref(false);
    const thumbnailProgress = ref({ processed: 0, failed: 0 });
    const newRedirectStatus = ref("");
    const newScheme = ref("");
    const customSchemeWarning = translate("shortlinks", "Custom schemes open in the visitor browser. Domain rules apply only to URLs that contain a host.");
    const displayedRedirectStatuses = computed(() => [.../* @__PURE__ */ new Set([...defaultRedirectStatuses, ...settings.redirect_statuses])].sort((a, b) => a - b));
    const displayedSchemes = computed(() => [.../* @__PURE__ */ new Set([...defaultSchemes, ...settings.allowed_schemes])].sort((a, b) => a.localeCompare(b)));
    const canonicalUrlExample = `${window.location.origin}/apps/shortlinks/r/summer-campaign`;
    const publicUrlPreview = computed(() => {
      try {
        if (settings.link_url_mode === "simple") return settings.base_url.trim() ? `${settings.base_url.trim().replace(/\/$/, "")}/summer-campaign` : canonicalUrlExample;
        if (settings.link_url_mode === "template") return settings.link_url_template.replaceAll("{alias}", "summer-campaign").replaceAll("{user}", "alice");
        const result = canonicalUrlExample.replace(new RegExp(settings.link_url_pattern, "u"), settings.link_url_replacement);
        return result === canonicalUrlExample ? translate("shortlinks", "The regular expression does not match the current Shortlinks URL.") : result;
      } catch {
        return translate("shortlinks", "The regular expression is invalid.");
      }
    });
    watch(() => settings.link_url_mode, (mode) => {
      if (mode === "template" && !settings.link_url_template) {
        settings.link_url_template = `${settings.base_url.trim().replace(/\/$/, "") || `${window.location.origin}/apps/shortlinks/r`}/{alias}`;
      }
      if (mode === "regex" && !settings.link_url_pattern) {
        const prefix = `${window.location.origin}/apps/shortlinks/r/`;
        settings.link_url_pattern = `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(.+)$`;
        settings.link_url_replacement = `${settings.base_url.trim().replace(/\/$/, "") || "https://go.example"}/$1`;
      }
    });
    async function save() {
      saving.value = true;
      try {
        const split = (value) => value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
        await cancelableClient.put(generateUrl("/apps/shortlinks/settings/admin"), {
          ...settings,
          creation_groups: split(lists.creation_groups),
          public_creation_groups: split(lists.public_creation_groups),
          reserved_aliases: split(lists.reserved_aliases),
          domain_allowlist: split(lists.domain_allowlist),
          domain_blocklist: split(lists.domain_blocklist),
          allowed_schemes: [...settings.allowed_schemes].sort(),
          redirect_statuses: [...settings.redirect_statuses].sort((a, b) => a - b)
        });
        showSuccess(translate("shortlinks", "Settings saved"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        saving.value = false;
      }
    }
    function toggleRedirectStatus(status) {
      if (settings.redirect_statuses.includes(status)) {
        if (settings.redirect_statuses.length === 1) {
          showError(translate("shortlinks", "At least one redirect status code must remain enabled."));
          return;
        }
        settings.redirect_statuses = settings.redirect_statuses.filter((value) => value !== status);
      } else {
        settings.redirect_statuses = [...settings.redirect_statuses, status];
      }
    }
    function addRedirectStatus() {
      const raw = newRedirectStatus.value.trim();
      const status = Number(raw);
      if (!/^\d{3}$/.test(raw) || !Number.isInteger(status) || status < 300 || status > 399) {
        showError(translate("shortlinks", "Enter a status code between 300 and 399."));
        return;
      }
      if (!settings.redirect_statuses.includes(status)) {
        settings.redirect_statuses = [...settings.redirect_statuses, status];
      }
      newRedirectStatus.value = "";
    }
    function toggleScheme(scheme) {
      if (settings.allowed_schemes.includes(scheme)) {
        if (settings.allowed_schemes.length === 1) {
          showError(translate("shortlinks", "At least one URL scheme must remain enabled."));
          return;
        }
        settings.allowed_schemes = settings.allowed_schemes.filter((value) => value !== scheme);
      } else {
        settings.allowed_schemes = [...settings.allowed_schemes, scheme];
      }
    }
    function addScheme() {
      const scheme = newScheme.value.trim().toLowerCase();
      if (!/^[a-z][a-z0-9+.-]{0,63}$/.test(scheme) || unsafeSchemes.includes(scheme)) {
        showError(translate("shortlinks", "Enter a safe URL scheme without a colon, for example mailto or webcal."));
        return;
      }
      if (!settings.allowed_schemes.includes(scheme)) {
        settings.allowed_schemes = [...settings.allowed_schemes, scheme];
      }
      newScheme.value = "";
    }
    async function runMaintenance(action) {
      runningMaintenance.value = action;
      try {
        await cancelableClient.post(generateUrl("/apps/shortlinks/settings/admin/maintenance/{action}", { action }), void 0, { params: action === "rebuild" ? { days: maintenanceDays.value } : void 0 });
        showSuccess(translate("shortlinks", "Maintenance completed"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        runningMaintenance.value = "";
      }
    }
    async function refreshThumbnails(onlyMissing) {
      refreshingThumbnails.value = true;
      thumbnailProgress.value = { processed: 0, failed: 0 };
      let afterId = 0;
      try {
        let hasMore = false;
        do {
          const response = await cancelableClient.post(generateUrl("/apps/shortlinks/settings/admin/thumbnails/refresh"), {
            afterId,
            limit: 5,
            onlyMissing
          });
          const result = response.data.data;
          Object.assign(thumbnailStatus, result.stats);
          thumbnailProgress.value.processed += result.processed;
          thumbnailProgress.value.failed += result.failed;
          afterId = result.nextAfterId;
          hasMore = result.hasMore;
        } while (hasMore);
        showSuccess(translate("shortlinks", "Thumbnail refresh completed"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        refreshingThumbnails.value = false;
      }
    }
    function formatLastRefresh(timestamp) {
      if (timestamp === null) return translate("shortlinks", "Never");
      return new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp * 1e3));
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "General"),
          description: unref(translate)("shortlinks", "Control whether Shortlinks is available and set global permissions and limits.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_2, [
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.enabled,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => settings.enabled = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Enable Shortlinks")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.admin_manage_all,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => settings.admin_manage_all = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Administrators can manage all links")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(_sfc_main$1), {
                modelValue: settings.max_links_per_user,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => settings.max_links_per_user = $event),
                type: "number",
                min: "1",
                max: "1000000",
                label: unref(translate)("shortlinks", "Maximum links per user")
              }, null, 8, ["modelValue", "label"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.allow_import_suggestions,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => settings.allow_import_suggestions = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow users to request support for new import formats")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(_sfc_main$1), {
                modelValue: settings.suggestion_recipient,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => settings.suggestion_recipient = $event),
                type: "email",
                label: unref(translate)("shortlinks", "Recipient for suggestions and compatibility requests")
              }, null, 8, ["modelValue", "label"])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "Creation and access"),
          description: unref(translate)("shortlinks", "Choose who can create links, including optional access through the public endpoint.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_3, [
              createVNode(unref(_sfc_main$1), {
                modelValue: lists.creation_groups,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => lists.creation_groups = $event),
                label: unref(translate)("shortlinks", "Groups allowed to create (comma-separated, empty means all)")
              }, null, 8, ["modelValue", "label"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.public_creation,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => settings.public_creation = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow public creation")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              settings.public_creation ? (openBlock(), createElementBlock("div", _hoisted_4, [
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.public_owner_uid,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => settings.public_owner_uid = $event),
                  label: unref(translate)("shortlinks", "Owner UID for publicly created links")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: lists.public_creation_groups,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => lists.public_creation_groups = $event),
                  label: unref(translate)("shortlinks", "Groups allowed on the public endpoint (empty also allows guests)")
                }, null, 8, ["modelValue", "label"])
              ])) : createCommentVNode("", true)
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "Aliases and short-link URLs"),
          description: unref(translate)("shortlinks", "Configure generated aliases, the URL users share, and personal overrides.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("div", _hoisted_6, [
                createBaseVNode("label", _hoisted_7, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Alias mode")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => settings.alias_mode = $event)
                  }, [
                    createBaseVNode("option", _hoisted_8, toDisplayString(unref(translate)("shortlinks", "Random Base62")), 1),
                    createBaseVNode("option", _hoisted_9, toDisplayString(unref(translate)("shortlinks", "Sequential Base36")), 1),
                    createBaseVNode("option", _hoisted_10, toDisplayString(unref(translate)("shortlinks", "Sequential Base62")), 1),
                    createBaseVNode("option", _hoisted_11, toDisplayString(unref(translate)("shortlinks", "Readable from title or destination")), 1)
                  ], 512), [
                    [vModelSelect, settings.alias_mode]
                  ])
                ]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.alias_length,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => settings.alias_length = $event),
                  type: "number",
                  min: "1",
                  max: "64",
                  label: unref(translate)("shortlinks", "Default alias length")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.alias_min_length,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => settings.alias_min_length = $event),
                  type: "number",
                  min: "1",
                  max: "64",
                  label: unref(translate)("shortlinks", "Minimum sequential alias length")
                }, null, 8, ["modelValue", "label"])
              ]),
              settings.alias_mode === "readable" ? (openBlock(), createElementBlock("div", _hoisted_12, [
                createBaseVNode("label", _hoisted_13, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "If the alias is already used")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => settings.alias_collision_mode = $event)
                  }, [
                    createBaseVNode("option", _hoisted_14, toDisplayString(unref(translate)("shortlinks", "Add a short random suffix")), 1),
                    createBaseVNode("option", _hoisted_15, toDisplayString(unref(translate)("shortlinks", "Add an ascending number")), 1)
                  ], 512), [
                    [vModelSelect, settings.alias_collision_mode]
                  ])
                ]),
                settings.alias_collision_mode === "random" ? (openBlock(), createBlock(unref(_sfc_main$1), {
                  key: 0,
                  modelValue: settings.alias_suffix_length,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => settings.alias_suffix_length = $event),
                  type: "number",
                  min: "1",
                  max: "12",
                  label: unref(translate)("shortlinks", "Initial random suffix length")
                }, null, 8, ["modelValue", "label"])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.allow_user_alias_settings,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => settings.allow_user_alias_settings = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow users to choose their alias strategy")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(_sfc_main$1), {
                modelValue: lists.reserved_aliases,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => lists.reserved_aliases = $event),
                label: unref(translate)("shortlinks", "Additional reserved aliases (comma-separated)")
              }, null, 8, ["modelValue", "label"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.allow_duplicate_targets,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => settings.allow_duplicate_targets = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow the same target URL more than once per owner")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              _cache[46] || (_cache[46] = createBaseVNode("hr", null, null, -1)),
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Shared short-link URL")), 1),
                createBaseVNode("p", _hoisted_17, toDisplayString(unref(translate)("shortlinks", "Use a simple domain, a placeholder template, or transform the canonical Nextcloud URL with a regular expression.")), 1),
                createBaseVNode("label", _hoisted_18, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "URL format")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => settings.link_url_mode = $event)
                  }, [
                    createBaseVNode("option", _hoisted_19, toDisplayString(unref(translate)("shortlinks", "Domain and append alias")), 1),
                    createBaseVNode("option", _hoisted_20, toDisplayString(unref(translate)("shortlinks", "Template with placeholders")), 1),
                    createBaseVNode("option", _hoisted_21, toDisplayString(unref(translate)("shortlinks", "Regular expression replacement")), 1)
                  ], 512), [
                    [vModelSelect, settings.link_url_mode]
                  ])
                ]),
                settings.link_url_mode === "simple" ? (openBlock(), createBlock(unref(_sfc_main$1), {
                  key: 0,
                  modelValue: settings.base_url,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => settings.base_url = $event),
                  type: "url",
                  label: unref(translate)("shortlinks", "Short-link domain or base URL"),
                  "helper-text": unref(translate)("shortlinks", "The alias is appended automatically. Leave empty to use Nextcloud.")
                }, null, 8, ["modelValue", "label", "helper-text"])) : settings.link_url_mode === "template" ? (openBlock(), createBlock(unref(_sfc_main$1), {
                  key: 1,
                  modelValue: settings.link_url_template,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => settings.link_url_template = $event),
                  label: unref(translate)("shortlinks", "URL template"),
                  "helper-text": unref(translate)("shortlinks", "Use {alias}; {user} is optional. Example: https://go.example/{user}/{alias}")
                }, null, 8, ["modelValue", "label", "helper-text"])) : (openBlock(), createElementBlock("div", _hoisted_22, [
                  createVNode(unref(_sfc_main$1), {
                    modelValue: settings.link_url_pattern,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => settings.link_url_pattern = $event),
                    label: unref(translate)("shortlinks", "Regular expression"),
                    "helper-text": unref(translate)("shortlinks", "Enter the pattern without delimiters.")
                  }, null, 8, ["modelValue", "label", "helper-text"]),
                  createVNode(unref(_sfc_main$1), {
                    modelValue: settings.link_url_replacement,
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => settings.link_url_replacement = $event),
                    label: unref(translate)("shortlinks", "Replacement"),
                    "helper-text": unref(translate)("shortlinks", "Use $1, $2, and so on for captured groups.")
                  }, null, 8, ["modelValue", "label", "helper-text"])
                ])),
                createVNode(unref(NcNoteCard), {
                  type: "info",
                  heading: unref(translate)("shortlinks", "Preview"),
                  text: publicUrlPreview.value
                }, null, 8, ["heading", "text"]),
                createVNode(unref(NcCheckboxRadioSwitch), {
                  modelValue: settings.allow_user_url_settings,
                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => settings.allow_user_url_settings = $event),
                  type: "switch"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow users to override the shared short-link URL")), 1)
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                createVNode(unref(NcNoteCard), {
                  type: "warning",
                  text: unref(translate)("shortlinks", "Custom domains must route requests to this Nextcloud Shortlinks endpoint. This setting changes displayed and copied URLs; it does not configure DNS or a reverse proxy.")
                }, null, 8, ["text"])
              ]),
              _cache[47] || (_cache[47] = createBaseVNode("hr", null, null, -1)),
              createBaseVNode("fieldset", _hoisted_23, [
                createBaseVNode("legend", null, toDisplayString(unref(translate)("shortlinks", "Allowed redirect status codes")), 1),
                createBaseVNode("div", _hoisted_24, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(displayedRedirectStatuses.value, (status) => {
                    return openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                      key: status,
                      type: "checkbox",
                      "model-value": settings.redirect_statuses.includes(status),
                      "onUpdate:modelValue": ($event) => toggleRedirectStatus(status)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(status), 1)
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onUpdate:modelValue"]);
                  }), 128))
                ]),
                createBaseVNode("div", _hoisted_25, [
                  createVNode(unref(_sfc_main$1), {
                    modelValue: newRedirectStatus.value,
                    "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => newRedirectStatus.value = $event),
                    type: "number",
                    min: "300",
                    max: "399",
                    label: unref(translate)("shortlinks", "Custom redirect status code"),
                    onKeyup: withKeys(addRedirectStatus, ["enter"])
                  }, null, 8, ["modelValue", "label"]),
                  createVNode(unref(NcButton), {
                    type: "button",
                    disabled: !newRedirectStatus.value.trim(),
                    onClick: addRedirectStatus
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add")), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                createVNode(unref(NcNoteCard), {
                  type: "info",
                  text: unref(translate)("shortlinks", "Codes from 300 to 399 are accepted. Non-standard codes may not be followed consistently by clients.")
                }, null, 8, ["text"])
              ])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "Target URL policy"),
          description: unref(translate)("shortlinks", "Restrict which destination URLs can be stored and fetched.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_26, [
              createBaseVNode("fieldset", _hoisted_27, [
                createBaseVNode("legend", null, toDisplayString(unref(translate)("shortlinks", "Allowed URL schemes")), 1),
                createBaseVNode("div", _hoisted_28, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(displayedSchemes.value, (scheme) => {
                    return openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                      key: scheme,
                      type: "checkbox",
                      "model-value": settings.allowed_schemes.includes(scheme),
                      "onUpdate:modelValue": ($event) => toggleScheme(scheme)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(scheme), 1)
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onUpdate:modelValue"]);
                  }), 128))
                ]),
                createBaseVNode("div", _hoisted_29, [
                  createVNode(unref(_sfc_main$1), {
                    modelValue: newScheme.value,
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => newScheme.value = $event),
                    label: unref(translate)("shortlinks", "Custom URL scheme"),
                    "helper-text": unref(translate)("shortlinks", "Enter the name without a colon."),
                    onKeyup: withKeys(addScheme, ["enter"])
                  }, null, 8, ["modelValue", "label", "helper-text"]),
                  createVNode(unref(NcButton), {
                    type: "button",
                    disabled: !newScheme.value.trim(),
                    onClick: addScheme
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add")), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                createVNode(unref(NcNoteCard), {
                  type: "warning",
                  text: unref(customSchemeWarning)
                }, null, 8, ["text"])
              ]),
              createBaseVNode("div", _hoisted_30, [
                createVNode(unref(NcTextArea), {
                  modelValue: lists.domain_allowlist,
                  "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => lists.domain_allowlist = $event),
                  rows: "5",
                  resize: "vertical",
                  label: unref(translate)("shortlinks", "Domain allowlist (one rule per line)"),
                  "helper-text": unref(translate)("shortlinks", "Leave empty to allow every domain not listed below.")
                }, null, 8, ["modelValue", "label", "helper-text"]),
                createVNode(unref(NcTextArea), {
                  modelValue: lists.domain_blocklist,
                  "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => lists.domain_blocklist = $event),
                  rows: "5",
                  resize: "vertical",
                  label: unref(translate)("shortlinks", "Domain blocklist (one rule per line)"),
                  "helper-text": unref(translate)("shortlinks", "Blocked domains always take precedence over the allowlist.")
                }, null, 8, ["modelValue", "label", "helper-text"])
              ]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.title_fetch,
                "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => settings.title_fetch = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Allow protected server-side title fetching")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createBaseVNode("p", _hoisted_31, toDisplayString(unref(translate)("shortlinks", "Server-side title fetching remains limited to public HTTP and HTTPS targets.")), 1),
              createBaseVNode("div", _hoisted_32, [
                createBaseVNode("div", _hoisted_33, [
                  createBaseVNode("div", null, [
                    createBaseVNode("strong", null, toDisplayString(thumbnailStatus.found), 1),
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "of {total} links have a thumbnail", { total: thumbnailStatus.total })), 1)
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("strong", null, toDisplayString(thumbnailStatus.refreshed), 1),
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "links checked")), 1)
                  ]),
                  createBaseVNode("div", null, [
                    createBaseVNode("strong", null, toDisplayString(formatLastRefresh(thumbnailStatus.lastRefresh)), 1),
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Last refresh")), 1)
                  ])
                ]),
                refreshingThumbnails.value ? (openBlock(), createElementBlock("p", _hoisted_34, toDisplayString(unref(translate)("shortlinks", "{count} links checked in this refresh", { count: thumbnailProgress.value.processed })), 1)) : thumbnailProgress.value.failed ? (openBlock(), createElementBlock("p", _hoisted_35, toDisplayString(unref(translate)("shortlinks", "{count} pages could not be checked and kept their previous thumbnail.", { count: thumbnailProgress.value.failed })), 1)) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_36, [
                  createVNode(unref(NcButton), {
                    disabled: refreshingThumbnails.value || !settings.title_fetch || !settings.metadata_collection,
                    onClick: _cache[28] || (_cache[28] = ($event) => refreshThumbnails(true))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Refresh missing thumbnails")), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(unref(NcButton), {
                    disabled: refreshingThumbnails.value || !settings.title_fetch || !settings.metadata_collection,
                    onClick: _cache[29] || (_cache[29] = ($event) => refreshThumbnails(false))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Refresh all thumbnails")), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "Statistics and privacy"),
          description: unref(translate)("shortlinks", "Choose which usage data is collected and how identifying details are reduced.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_37, [
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.stats_enabled,
                "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => settings.stats_enabled = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Collect statistics")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.metadata_collection,
                "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => settings.metadata_collection = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Collect destination metadata such as sharing images and titles")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createBaseVNode("p", _hoisted_38, toDisplayString(unref(translate)("shortlinks", "Turning this off disables metadata autocomplete for every user and stops thumbnail refreshes.")), 1),
              createBaseVNode("div", _hoisted_39, [
                createBaseVNode("label", _hoisted_40, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Privacy mode")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => settings.privacy_mode = $event)
                  }, [
                    createBaseVNode("option", _hoisted_41, toDisplayString(unref(translate)("shortlinks", "Counts only")), 1),
                    createBaseVNode("option", _hoisted_42, toDisplayString(unref(translate)("shortlinks", "Privacy-reduced details")), 1)
                  ], 512), [
                    [vModelSelect, settings.privacy_mode]
                  ])
                ]),
                createBaseVNode("label", _hoisted_43, [
                  createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Referrer storage")), 1),
                  withDirectives(createBaseVNode("select", {
                    "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => settings.referrer_mode = $event)
                  }, [
                    createBaseVNode("option", _hoisted_44, toDisplayString(unref(translate)("shortlinks", "None")), 1),
                    createBaseVNode("option", _hoisted_45, toDisplayString(unref(translate)("shortlinks", "Domain only")), 1),
                    createBaseVNode("option", _hoisted_46, toDisplayString(unref(translate)("shortlinks", "Domain and path")), 1),
                    createBaseVNode("option", _hoisted_47, toDisplayString(unref(translate)("shortlinks", "Redacted query parameters")), 1)
                  ], 512), [
                    [vModelSelect, settings.referrer_mode]
                  ])
                ])
              ]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.respect_dnt,
                "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => settings.respect_dnt = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Respect DNT and Global Privacy Control")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.log_authenticated_users,
                "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => settings.log_authenticated_users = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Store signed-in user IDs in click events")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: settings.record_bots,
                "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => settings.record_bots = $event),
                type: "switch"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Store detailed events for detected bots")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(_sfc_main$1), {
                modelValue: settings.geoip_path,
                "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => settings.geoip_path = $event),
                label: unref(translate)("shortlinks", "GeoIP MMDB path"),
                "helper-text": unref(translate)("shortlinks", "Optional local database used for country and region statistics.")
              }, null, 8, ["modelValue", "label", "helper-text"]),
              createVNode(unref(NcNoteCard), {
                type: unref(geo).readable ? "success" : "info",
                heading: unref(translate)("shortlinks", "GeoIP status"),
                text: unref(geo).readable ? unref(translate)("shortlinks", "Ready") : unref(translate)("shortlinks", "Not configured or unreadable")
              }, null, 8, ["type", "heading", "text"])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "Retention"),
          description: unref(translate)("shortlinks", "Define how long operational and analytics data remains available.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_48, [
              createBaseVNode("div", _hoisted_49, [
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.click_retention_days,
                  "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => settings.click_retention_days = $event),
                  type: "number",
                  min: "0",
                  max: "36500",
                  label: unref(translate)("shortlinks", "Detailed event retention (days)")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.aggregate_retention_days,
                  "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => settings.aggregate_retention_days = $event),
                  type: "number",
                  min: "0",
                  max: "36500",
                  label: unref(translate)("shortlinks", "Aggregate retention (days)")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.audit_retention_days,
                  "onUpdate:modelValue": _cache[40] || (_cache[40] = ($event) => settings.audit_retention_days = $event),
                  type: "number",
                  min: "0",
                  max: "36500",
                  label: unref(translate)("shortlinks", "Audit retention (days)")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: settings.trash_retention_days,
                  "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => settings.trash_retention_days = $event),
                  type: "number",
                  min: "0",
                  max: "36500",
                  label: unref(translate)("shortlinks", "Trash retention (days)")
                }, null, 8, ["modelValue", "label"])
              ]),
              createVNode(unref(NcNoteCard), {
                type: "info",
                text: unref(translate)("shortlinks", "Deleted user data is retained under its former UID and can be recovered with the owner-transfer OCC command.")
              }, null, 8, ["text"])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"]),
        createVNode(unref(NcSettingsSection), {
          name: unref(translate)("shortlinks", "System and maintenance"),
          description: unref(translate)("shortlinks", "Review background jobs and run bounded maintenance tasks.")
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_50, [
              createVNode(unref(NcNoteCard), {
                type: unref(systemStatus).phpSupported ? "success" : "error",
                heading: unref(translate)("shortlinks", "System status"),
                text: `PHP ${unref(systemStatus).phpVersion} — ${unref(systemStatus).phpSupported ? unref(translate)("shortlinks", "Supported") : unref(translate)("shortlinks", "Unsupported version")}`
              }, null, 8, ["type", "heading", "text"]),
              createBaseVNode("ul", _hoisted_51, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(systemStatus).jobs, (count, job) => {
                  return openBlock(), createElementBlock("li", { key: job }, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", job)), 1),
                    createBaseVNode("strong", {
                      class: normalizeClass({ "system-jobs__missing": !count })
                    }, toDisplayString(count ? unref(translate)("shortlinks", "Registered") : unref(translate)("shortlinks", "Missing")), 3)
                  ]);
                }), 128))
              ]),
              createBaseVNode("div", _hoisted_52, [
                createVNode(unref(NcButton), {
                  disabled: Boolean(runningMaintenance.value),
                  onClick: _cache[42] || (_cache[42] = ($event) => runMaintenance("aggregate"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Aggregate now")), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                createVNode(unref(NcButton), {
                  disabled: Boolean(runningMaintenance.value),
                  onClick: _cache[43] || (_cache[43] = ($event) => runMaintenance("cleanup"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Run cleanup")), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                createVNode(unref(_sfc_main$1), {
                  modelValue: maintenanceDays.value,
                  "onUpdate:modelValue": _cache[44] || (_cache[44] = ($event) => maintenanceDays.value = $event),
                  type: "number",
                  min: "1",
                  max: "365",
                  label: unref(translate)("shortlinks", "Rebuild days")
                }, null, 8, ["modelValue", "label"]),
                createVNode(unref(NcButton), {
                  disabled: Boolean(runningMaintenance.value),
                  onClick: _cache[45] || (_cache[45] = ($event) => runMaintenance("rebuild"))
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Rebuild statistics")), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              createBaseVNode("div", _hoisted_53, [
                createVNode(unref(NcButton), {
                  variant: "primary",
                  disabled: saving.value,
                  onClick: save
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Save")), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ])
          ]),
          _: 1
        }, 8, ["name", "description"])
      ]);
    };
  }
});
const AdminApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d509270b"]]);
createApp(AdminApp).mount("#shortlinks-admin");
