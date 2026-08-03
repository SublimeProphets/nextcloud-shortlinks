const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, w as watch, o as onMounted, h as onBeforeUnmount, j as openBlock, k as createBlock, u as unref, p as createElementBlock, K as withModifiers, D as createBaseVNode, I as toDisplayString, N as withDirectives, ah as vModelSelect, L as createCommentVNode, P as createVNode, Q as withCtx, H as createTextVNode, x as ref, r as reactive, d as computed, F as Fragment, E as renderList } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { an as translate, bc as mdiFileUploadOutline, b7 as mdiCogOutline, bd as mdiBookmarkPlusOutline, be as mdiIdentifier, bf as mdiShareVariantOutline, bg as mdiImport, ay as mdiExportVariant, bh as mdiPlus, bi as mdiFolderMultipleOutline, aA as mdiTagMultipleOutline, aC as mdiLinkVariant, bj as mdiBugOutline, bk as mdiSourceBranch, b1 as mdiInformationOutline, bl as mdiMessageTextOutline, bm as mdiFolderRemoveOutline, aN as mdiDeleteOutline } from "./vendor-CflEb2sm.chunk.mjs";
import { a as showError, s as showSuccess } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { q as NcLoadingIcon, _ as _sfc_main$5, l as NcNoteCard, g as NcButton, h as NcIconSvgWrapper, f as NcCheckboxRadioSwitch, m as NcTextArea, A as NcAppSettingsSection, N as NcEmptyContent, B as NcAppSettingsDialog, a as NcDialog, C as NcFormBoxButton } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { a as api, F as FolderTreeList, T as TagList } from "./shortlinks-main.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import { B as BookmarkletGuide } from "./BookmarkletGuide-MqClDYzH.chunk.mjs";
import FolderForm from "./FolderForm-CmAZh5yn.chunk.mjs";
import TagForm from "./TagForm-D9YhRSyq.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
const _hoisted_1$3 = {
  key: 0,
  class: "preference-group"
};
const _hoisted_2$3 = { class: "select-field" };
const _hoisted_3$2 = ["disabled"];
const _hoisted_4$2 = { value: "inherit" };
const _hoisted_5$2 = { value: "shortest" };
const _hoisted_6$2 = { value: "readable" };
const _hoisted_7$2 = { value: "random" };
const _hoisted_8$2 = {
  key: 0,
  class: "preference-grid"
};
const _hoisted_9$1 = { class: "select-field" };
const _hoisted_10$1 = ["disabled"];
const _hoisted_11$1 = { value: "random" };
const _hoisted_12$1 = { value: "numbered" };
const _hoisted_13$1 = { class: "example-card" };
const _hoisted_14 = {
  class: "autosave-status",
  "aria-live": "polite"
};
const _hoisted_15 = {
  key: 1,
  class: "preference-group"
};
const _hoisted_16 = { class: "select-field" };
const _hoisted_17 = ["disabled"];
const _hoisted_18 = { value: "inherit" };
const _hoisted_19 = { value: "simple" };
const _hoisted_20 = { value: "template" };
const _hoisted_21 = { value: "regex" };
const _hoisted_22 = {
  key: 2,
  class: "preference-grid"
};
const _hoisted_23 = { class: "example-card" };
const _hoisted_24 = {
  key: 5,
  class: "forwarding-example"
};
const _hoisted_25 = {
  key: 6,
  class: "forwarding-example"
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AliasUrlSettings",
  props: {
    section: { default: "alias" }
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loading = ref(true);
    const saving = ref(false);
    const aliasSaved = ref(false);
    let saveTimer;
    const settings = reactive({
      aliasStrategy: "inherit",
      collisionStrategy: "random",
      suffixLength: 2,
      urlMode: "inherit",
      baseUrl: "",
      urlTemplate: "",
      urlPattern: "",
      urlReplacement: "",
      allowAliasSettings: true,
      allowUrlSettings: true,
      globalAliasMode: "random",
      globalUrlMode: "simple",
      previewAlias: "summer-campaign",
      previewUrl: "",
      shortUrlTemplate: "",
      useThumbnails: true,
      metadataAutocomplete: true,
      showQuickStart: true,
      metadataCollectionEnabled: true,
      allowImportSuggestions: true,
      email: ""
    });
    const aliasExample = computed(() => {
      if (settings.aliasStrategy === "shortest") return "1a";
      if (settings.aliasStrategy === "readable") return settings.collisionStrategy === "numbered" ? "summer-campaign-2" : `summer-campaign-${"x".repeat(settings.suffixLength)}`;
      if (settings.aliasStrategy === "random") return "aB3x9Qz";
      return settings.previewAlias;
    });
    const forwardingPath = `${window.location.origin}/apps/shortlinks/r/`;
    const htaccessSnippet = computed(() => `RewriteEngine On
RewriteRule ^(.+?)/?$ ${forwardingPath}$1 [R=302,L,NE]`);
    const phpSnippet = computed(() => `<?php
$alias = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
header('Location: ${forwardingPath}' . rawurlencode($alias), true, 302);
exit;`);
    async function copySnippet(value) {
      await navigator.clipboard.writeText(value);
      showSuccess(translate("shortlinks", "Forwarding example copied"));
    }
    const canonicalExample = computed(() => `${window.location.origin}/apps/shortlinks/r/${aliasExample.value}`);
    const urlPreview = computed(() => {
      const canonical = canonicalExample.value;
      try {
        if (settings.urlMode === "inherit") return settings.shortUrlTemplate.replace("{alias}", aliasExample.value) || settings.previewUrl;
        if (settings.urlMode === "simple") return settings.baseUrl.trim() ? `${settings.baseUrl.trim().replace(/\/$/, "")}/${aliasExample.value}` : canonical;
        if (settings.urlMode === "template") return settings.urlTemplate.replaceAll("{alias}", aliasExample.value).replaceAll("{user}", "alice");
        const result = canonical.replace(new RegExp(settings.urlPattern, "u"), settings.urlReplacement);
        return result === canonical ? translate("shortlinks", "The regular expression does not match the current Shortlinks URL.") : result;
      } catch {
        return translate("shortlinks", "The regular expression is invalid.");
      }
    });
    watch(() => settings.urlMode, (mode) => {
      if (mode === "template" && !settings.urlTemplate) settings.urlTemplate = `${settings.baseUrl.trim().replace(/\/$/, "") || `${window.location.origin}/apps/shortlinks/r`}/{alias}`;
      if (mode === "regex" && !settings.urlPattern) {
        const prefix = `${window.location.origin}/apps/shortlinks/r/`;
        settings.urlPattern = `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(.+)$`;
        settings.urlReplacement = `${settings.baseUrl.trim().replace(/\/$/, "") || "https://go.example"}/$1`;
      }
    });
    watch(() => [settings.aliasStrategy, settings.collisionStrategy, settings.suffixLength], () => {
      if (loading.value || props.section !== "alias") return;
      aliasSaved.value = false;
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => save(true), 500);
    });
    onMounted(load);
    onBeforeUnmount(() => {
      if (saveTimer) clearTimeout(saveTimer);
    });
    async function load() {
      loading.value = true;
      try {
        Object.assign(settings, await api.getUserSettings());
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
      }
    }
    async function save(silent = false) {
      if (saving.value) return;
      saving.value = true;
      try {
        const updated = await api.updateUserSettings({
          aliasStrategy: settings.aliasStrategy,
          collisionStrategy: settings.collisionStrategy,
          suffixLength: Number(settings.suffixLength),
          urlMode: settings.urlMode,
          baseUrl: settings.baseUrl,
          urlTemplate: settings.urlTemplate,
          urlPattern: settings.urlPattern,
          urlReplacement: settings.urlReplacement
        });
        Object.assign(settings, updated);
        emit("saved", updated);
        if (silent) aliasSaved.value = true;
        else showSuccess(translate("shortlinks", "Personal link settings saved"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _cache) => {
      return loading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
        key: 0,
        name: unref(translate)("shortlinks", "Loading personal link settings")
      }, null, 8, ["name"])) : (openBlock(), createElementBlock("form", {
        key: 1,
        class: "alias-url-settings",
        onSubmit: _cache[10] || (_cache[10] = withModifiers(($event) => save(false), ["prevent"]))
      }, [
        __props.section === "alias" ? (openBlock(), createElementBlock("section", _hoisted_1$3, [
          createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Choose how the editable alias field is prefilled when you create a link.")), 1),
          createBaseVNode("label", _hoisted_2$3, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Alias strategy")), 1),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => settings.aliasStrategy = $event),
              disabled: !settings.allowAliasSettings
            }, [
              createBaseVNode("option", _hoisted_4$2, toDisplayString(unref(translate)("shortlinks", "Use administrator default")), 1),
              createBaseVNode("option", _hoisted_5$2, toDisplayString(unref(translate)("shortlinks", "As short as possible")), 1),
              createBaseVNode("option", _hoisted_6$2, toDisplayString(unref(translate)("shortlinks", "Guess from title or destination")), 1),
              createBaseVNode("option", _hoisted_7$2, toDisplayString(unref(translate)("shortlinks", "Generate a random alias")), 1)
            ], 8, _hoisted_3$2), [
              [vModelSelect, settings.aliasStrategy]
            ])
          ]),
          settings.aliasStrategy === "readable" ? (openBlock(), createElementBlock("div", _hoisted_8$2, [
            createBaseVNode("label", _hoisted_9$1, [
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "If the guessed alias is already used")), 1),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => settings.collisionStrategy = $event),
                disabled: !settings.allowAliasSettings
              }, [
                createBaseVNode("option", _hoisted_11$1, toDisplayString(unref(translate)("shortlinks", "Add the shortest random suffix")), 1),
                createBaseVNode("option", _hoisted_12$1, toDisplayString(unref(translate)("shortlinks", "Try -2, -3, and so on")), 1)
              ], 8, _hoisted_10$1), [
                [vModelSelect, settings.collisionStrategy]
              ])
            ]),
            settings.collisionStrategy === "random" ? (openBlock(), createBlock(unref(_sfc_main$5), {
              key: 0,
              modelValue: settings.suffixLength,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => settings.suffixLength = $event),
              type: "number",
              min: "1",
              max: "12",
              disabled: !settings.allowAliasSettings,
              label: unref(translate)("shortlinks", "Starting suffix length")
            }, null, 8, ["modelValue", "disabled", "label"])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          !settings.allowAliasSettings ? (openBlock(), createBlock(unref(NcNoteCard), {
            key: 1,
            type: "info",
            text: unref(translate)("shortlinks", "Your administrator manages alias generation globally.")
          }, null, 8, ["text"])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_13$1, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Example alias")), 1),
            createBaseVNode("strong", null, toDisplayString(aliasExample.value), 1)
          ]),
          createBaseVNode("p", _hoisted_14, toDisplayString(saving.value ? unref(translate)("shortlinks", "Saving…") : aliasSaved.value ? unref(translate)("shortlinks", "Saved automatically") : unref(translate)("shortlinks", "Changes are saved automatically")), 1)
        ])) : (openBlock(), createElementBlock("section", _hoisted_15, [
          createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Keep the global URL, append the alias to your own domain, or define an expert transformation.")), 1),
          createBaseVNode("label", _hoisted_16, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "URL format")), 1),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => settings.urlMode = $event),
              disabled: !settings.allowUrlSettings
            }, [
              createBaseVNode("option", _hoisted_18, toDisplayString(unref(translate)("shortlinks", "Use administrator default")), 1),
              createBaseVNode("option", _hoisted_19, toDisplayString(unref(translate)("shortlinks", "Domain and append alias")), 1),
              createBaseVNode("option", _hoisted_20, toDisplayString(unref(translate)("shortlinks", "Template with placeholders")), 1),
              createBaseVNode("option", _hoisted_21, toDisplayString(unref(translate)("shortlinks", "Regular expression replacement")), 1)
            ], 8, _hoisted_17), [
              [vModelSelect, settings.urlMode]
            ])
          ]),
          settings.urlMode === "simple" ? (openBlock(), createBlock(unref(_sfc_main$5), {
            key: 0,
            modelValue: settings.baseUrl,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => settings.baseUrl = $event),
            type: "url",
            label: unref(translate)("shortlinks", "Short-link domain or base URL"),
            "helper-text": unref(translate)("shortlinks", "Example: https://go.example — the alias is appended automatically.")
          }, null, 8, ["modelValue", "label", "helper-text"])) : settings.urlMode === "template" ? (openBlock(), createBlock(unref(_sfc_main$5), {
            key: 1,
            modelValue: settings.urlTemplate,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => settings.urlTemplate = $event),
            label: unref(translate)("shortlinks", "URL template"),
            "helper-text": unref(translate)("shortlinks", "Use {alias}; {user} is optional.")
          }, null, 8, ["modelValue", "label", "helper-text"])) : settings.urlMode === "regex" ? (openBlock(), createElementBlock("div", _hoisted_22, [
            createVNode(unref(_sfc_main$5), {
              modelValue: settings.urlPattern,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => settings.urlPattern = $event),
              label: unref(translate)("shortlinks", "Regular expression"),
              "helper-text": unref(translate)("shortlinks", "Without delimiters; it is applied to the canonical URL.")
            }, null, 8, ["modelValue", "label", "helper-text"]),
            createVNode(unref(_sfc_main$5), {
              modelValue: settings.urlReplacement,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => settings.urlReplacement = $event),
              label: unref(translate)("shortlinks", "Replacement"),
              "helper-text": unref(translate)("shortlinks", "Captured groups can be inserted with $1, $2, and so on.")
            }, null, 8, ["modelValue", "label", "helper-text"])
          ])) : createCommentVNode("", true),
          !settings.allowUrlSettings ? (openBlock(), createBlock(unref(NcNoteCard), {
            key: 3,
            type: "info",
            text: unref(translate)("shortlinks", "Your administrator manages the shared short-link URL globally.")
          }, null, 8, ["text"])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_23, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Preview")), 1),
            createBaseVNode("strong", null, toDisplayString(urlPreview.value || canonicalExample.value), 1)
          ]),
          settings.urlMode !== "inherit" ? (openBlock(), createBlock(unref(NcNoteCard), {
            key: 4,
            type: "info",
            text: unref(translate)("shortlinks", "Your custom domain must forward the alias to this Nextcloud Shortlinks endpoint. These drop-in examples perform a simple redirect and keep your links working without another application.")
          }, null, 8, ["text"])) : createCommentVNode("", true),
          settings.urlMode !== "inherit" ? (openBlock(), createElementBlock("details", _hoisted_24, [
            createBaseVNode("summary", null, toDisplayString(unref(translate)("shortlinks", "Apache .htaccess example")), 1),
            createBaseVNode("pre", null, [
              createBaseVNode("code", null, toDisplayString(htaccessSnippet.value), 1)
            ]),
            createVNode(unref(NcButton), {
              variant: "tertiary",
              onClick: _cache[8] || (_cache[8] = ($event) => copySnippet(htaccessSnippet.value))
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Copy .htaccess")), 1)
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true),
          settings.urlMode !== "inherit" ? (openBlock(), createElementBlock("details", _hoisted_25, [
            createBaseVNode("summary", null, toDisplayString(unref(translate)("shortlinks", "PHP index.php example")), 1),
            createBaseVNode("pre", null, [
              createBaseVNode("code", null, toDisplayString(phpSnippet.value), 1)
            ]),
            createVNode(unref(NcButton), {
              variant: "tertiary",
              onClick: _cache[9] || (_cache[9] = ($event) => copySnippet(phpSnippet.value))
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Copy index.php")), 1)
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true),
          createVNode(unref(NcButton), {
            type: "submit",
            variant: "primary",
            disabled: saving.value
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(saving.value ? unref(translate)("shortlinks", "Saving…") : unref(translate)("shortlinks", "Save")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]))
      ], 32));
    };
  }
});
const AliasUrlSettings = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-782064e1"]]);
const _hoisted_1$2 = { class: "transfer-settings" };
const _hoisted_2$2 = { class: "select-field" };
const _hoisted_3$1 = { value: "auto" };
const _hoisted_4$1 = { value: "shortlinks-backup" };
const _hoisted_5$1 = { value: "json" };
const _hoisted_6$1 = { value: "csv" };
const _hoisted_7$1 = { value: "yourls-csv" };
const _hoisted_8$1 = { value: "yourls-xml" };
const _hoisted_9 = { class: "select-field" };
const _hoisted_10 = { value: "skip" };
const _hoisted_11 = { value: "new-alias" };
const _hoisted_12 = {
  key: 0,
  class: "import-preview",
  role: "status"
};
const _hoisted_13 = { key: 0 };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DataTransferSettings",
  props: {
    mode: {},
    allowImportSuggestions: { type: Boolean, default: true }
  },
  emits: ["requestCompatibility"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const fileInput = ref();
    const content = ref("");
    const filename = ref("");
    const format = ref("auto");
    const conflict = ref("skip");
    const busy = ref(false);
    const preview = ref(null);
    function download(result) {
      const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    async function exportData() {
      busy.value = true;
      try {
        download(await api.exportBackup());
        showSuccess(translate("shortlinks", "Complete backup exported"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        busy.value = false;
      }
    }
    async function selectFile(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showError(translate("shortlinks", "Imports are limited to 5 MiB."));
        return;
      }
      filename.value = file.name;
      content.value = await file.text();
      preview.value = null;
      await runImport(true);
    }
    async function runImport(dryRun) {
      if (!content.value) return;
      busy.value = true;
      try {
        const result = await api.importLinks(format.value, content.value, dryRun, conflict.value);
        preview.value = result;
        if (!dryRun) showSuccess(translate("shortlinks", "{count} links imported", { count: result.created }));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        busy.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        __props.mode === "export" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createVNode(unref(NcNoteCard), {
            type: "info",
            text: unref(translate)("shortlinks", "This backup includes all links, personal configuration, folders, and tags. Folder- and tag-based exports are also available from their contextual menus.")
          }, null, 8, ["text"]),
          createVNode(unref(NcButton), {
            variant: "primary",
            disabled: busy.value,
            onClick: exportData
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(busy.value ? unref(translate)("shortlinks", "Preparing export…") : unref(translate)("shortlinks", "Export complete backup")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createVNode(unref(NcNoteCard), { type: "info" }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Import a complete Shortlinks backup, a link-only JSON/CSV export, or a CSV/XML export from")) + " ", 1),
              _cache[5] || (_cache[5] = createBaseVNode("a", {
                href: "https://github.com/GautamGupta/YOURLS-Import-Export",
                target: "_blank",
                rel: "noopener noreferrer"
              }, "GautamGupta/YOURLS-Import-Export", -1)),
              _cache[6] || (_cache[6] = createTextVNode(". ", -1))
            ]),
            _: 1
          }),
          createBaseVNode("label", _hoisted_2$2, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Import type")), 1),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => format.value = $event)
            }, [
              createBaseVNode("option", _hoisted_3$1, toDisplayString(unref(translate)("shortlinks", "Detect automatically")), 1),
              createBaseVNode("option", _hoisted_4$1, toDisplayString(unref(translate)("shortlinks", "Complete Shortlinks backup")), 1),
              createBaseVNode("option", _hoisted_5$1, toDisplayString(unref(translate)("shortlinks", "Shortlinks JSON")), 1),
              createBaseVNode("option", _hoisted_6$1, toDisplayString(unref(translate)("shortlinks", "Shortlinks CSV")), 1),
              createBaseVNode("option", _hoisted_7$1, toDisplayString(unref(translate)("shortlinks", "YOURLS Import/Export CSV")), 1),
              createBaseVNode("option", _hoisted_8$1, toDisplayString(unref(translate)("shortlinks", "YOURLS Import/Export XML")), 1)
            ], 512), [
              [vModelSelect, format.value]
            ])
          ]),
          createBaseVNode("label", _hoisted_9, [
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "If an alias already exists")), 1),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => conflict.value = $event)
            }, [
              createBaseVNode("option", _hoisted_10, toDisplayString(unref(translate)("shortlinks", "Skip link")), 1),
              createBaseVNode("option", _hoisted_11, toDisplayString(unref(translate)("shortlinks", "Generate a new alias")), 1)
            ], 512), [
              [vModelSelect, conflict.value]
            ])
          ]),
          createBaseVNode("input", {
            ref_key: "fileInput",
            ref: fileInput,
            class: "visually-hidden",
            type: "file",
            accept: ".json,.csv,.xml,application/json,text/csv,text/xml,application/xml",
            onChange: selectFile
          }, null, 544),
          createVNode(unref(NcButton), {
            disabled: busy.value,
            onClick: _cache[2] || (_cache[2] = ($event) => fileInput.value?.click())
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileUploadOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(filename.value || unref(translate)("shortlinks", "Choose import file")), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          preview.value ? (openBlock(), createElementBlock("div", _hoisted_12, [
            createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "{count} links detected", { count: preview.value.total })), 1),
            createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Detected format: {format}", { format: preview.value.format })), 1),
            preview.value.errors.length ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(unref(translate)("shortlinks", "{count} rows need attention", { count: preview.value.errors.length })), 1)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          preview.value ? (openBlock(), createBlock(unref(NcButton), {
            key: 1,
            variant: "primary",
            disabled: busy.value || preview.value.created === 0,
            onClick: _cache[3] || (_cache[3] = ($event) => runImport(false))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(busy.value ? unref(translate)("shortlinks", "Importing…") : unref(translate)("shortlinks", "Import data")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])) : createCommentVNode("", true),
          __props.allowImportSuggestions ? (openBlock(), createBlock(unref(NcButton), {
            key: 2,
            variant: "tertiary",
            onClick: _cache[4] || (_cache[4] = ($event) => emit("requestCompatibility"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Request support for another import format")), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ], 64))
      ]);
    };
  }
});
const DataTransferSettings = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f65e37f0"]]);
const _hoisted_1$1 = {
  key: 1,
  class: "general-settings"
};
const _hoisted_2$1 = {
  class: "save-state",
  "aria-live": "polite"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "GeneralUserSettings",
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const loading = ref(true);
    const saving = ref(false);
    const initialized = ref(false);
    const settings = reactive({ useThumbnails: true, metadataAutocomplete: true, showQuickStart: true, metadataCollectionEnabled: true });
    let timer;
    onMounted(async () => {
      try {
        Object.assign(settings, await api.getUserSettings());
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        loading.value = false;
        initialized.value = true;
      }
    });
    watch(() => [settings.useThumbnails, settings.metadataAutocomplete, settings.showQuickStart], () => {
      if (!initialized.value) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(save, 300);
    });
    async function save() {
      saving.value = true;
      try {
        const updated = await api.updateUserSettings({
          useThumbnails: settings.useThumbnails,
          metadataAutocomplete: settings.metadataAutocomplete,
          showQuickStart: settings.showQuickStart
        });
        Object.assign(settings, updated);
        emit("saved", updated);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _cache) => {
      return loading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
        key: 0,
        name: unref(translate)("shortlinks", "Loading general settings")
      }, null, 8, ["name"])) : (openBlock(), createElementBlock("div", _hoisted_1$1, [
        createVNode(unref(NcCheckboxRadioSwitch), {
          modelValue: settings.useThumbnails,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => settings.useThumbnails = $event),
          type: "switch"
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Use thumbnails")), 1)
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(unref(NcCheckboxRadioSwitch), {
          modelValue: settings.metadataAutocomplete,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => settings.metadataAutocomplete = $event),
          type: "switch",
          disabled: !settings.metadataCollectionEnabled
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Automatically scan destinations for a title and sharing image")), 1)
          ]),
          _: 1
        }, 8, ["modelValue", "disabled"]),
        !settings.metadataCollectionEnabled ? (openBlock(), createBlock(unref(NcNoteCard), {
          key: 0,
          type: "info",
          text: unref(translate)("shortlinks", "Your administrator has disabled destination metadata collection for this server.")
        }, null, 8, ["text"])) : createCommentVNode("", true),
        createVNode(unref(NcCheckboxRadioSwitch), {
          modelValue: settings.showQuickStart,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => settings.showQuickStart = $event),
          type: "switch"
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Show Quick Start Guide on Dashboard")), 1)
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createBaseVNode("p", _hoisted_2$1, toDisplayString(saving.value ? unref(translate)("shortlinks", "Saving…") : unref(translate)("shortlinks", "Changes are saved automatically")), 1)
      ]));
    };
  }
});
const GeneralUserSettings = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5f446395"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SuggestionForm",
  props: {
    kind: { default: "general" },
    email: { default: "" }
  },
  emits: ["sent"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const sending = ref(false);
    const form = reactive({ email: props.email, anonymous: false, name: "", details: "" });
    watch(() => props.email, (value) => {
      if (!form.email) form.email = value;
    });
    async function submit() {
      sending.value = true;
      try {
        await api.submitSuggestion({ kind: props.kind, ...form, email: form.anonymous ? "" : form.email });
        form.name = "";
        form.details = "";
        showSuccess(translate("shortlinks", "Thank you — your message was sent."));
        emit("sent");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        sending.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("form", {
        class: "suggestion-form",
        onSubmit: withModifiers(submit, ["prevent"])
      }, [
        createVNode(unref(_sfc_main$5), {
          modelValue: form.email,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.email = $event),
          type: "email",
          disabled: form.anonymous,
          label: unref(translate)("shortlinks", "Email address"),
          "helper-text": form.anonymous ? unref(translate)("shortlinks", "Your account and email address will not be included.") : unref(translate)("shortlinks", "Used only to reply to this request.")
        }, null, 8, ["modelValue", "disabled", "label", "helper-text"]),
        createVNode(unref(NcCheckboxRadioSwitch), {
          modelValue: form.anonymous,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.anonymous = $event),
          type: "checkbox"
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Submit anonymously")), 1)
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createVNode(unref(_sfc_main$5), {
          modelValue: form.name,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.name = $event),
          label: __props.kind === "import-compatibility" ? unref(translate)("shortlinks", "Name of the service or import format") : unref(translate)("shortlinks", "Subject")
        }, null, 8, ["modelValue", "label"]),
        createVNode(unref(NcTextArea), {
          modelValue: form.details,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.details = $event),
          rows: "6",
          resize: "vertical",
          label: unref(translate)("shortlinks", "Further information, details, or wishes")
        }, null, 8, ["modelValue", "label"]),
        createVNode(unref(NcButton), {
          type: "submit",
          variant: "primary",
          disabled: sending.value || !form.name.trim() || !form.details.trim() || !form.anonymous && !form.email.trim()
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(sending.value ? unref(translate)("shortlinks", "Sending…") : unref(translate)("shortlinks", "Send request")), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 32);
    };
  }
});
const SuggestionForm = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-fc0b4686"]]);
const _hoisted_1 = { class: "settings-section-content" };
const _hoisted_2 = { class: "settings-section-content" };
const _hoisted_3 = { class: "about-section" };
const _hoisted_4 = { class: "about-actions" };
const _hoisted_5 = { class: "delete-choices" };
const _hoisted_6 = { class: "merge-form" };
const _hoisted_7 = { class: "select-field" };
const _hoisted_8 = ["value"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppSettingsDialog",
  props: {
    open: { type: Boolean },
    folders: {},
    tags: {}
  },
  emits: ["update:open", "changed", "settingsSaved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editingFolder = ref(null);
    const creatingFolder = ref(false);
    const deletingFolder = ref(null);
    const editingTag = ref(null);
    const creatingTag = ref(false);
    const mergingTag = ref(null);
    const mergeTargetId = ref(null);
    const userEmail = ref("");
    const allowImportSuggestions = ref(true);
    const suggestionKind = ref(null);
    watch(() => props.open, async (value) => {
      if (!value) return;
      try {
        const settings = await api.getUserSettings();
        userEmail.value = settings.email;
        allowImportSuggestions.value = settings.allowImportSuggestions;
      } catch {
      }
    }, { immediate: true });
    const deleteLinkCount = computed(() => {
      if (!deletingFolder.value) return 0;
      const ids = /* @__PURE__ */ new Set([deletingFolder.value.id]);
      for (let changed = true; changed; ) {
        changed = false;
        for (const folder of props.folders) {
          if (folder.parentId !== null && ids.has(folder.parentId) && !ids.has(folder.id)) {
            ids.add(folder.id);
            changed = true;
          }
        }
      }
      return props.folders.filter((folder) => ids.has(folder.id)).reduce((sum, folder) => sum + folder.count, 0);
    });
    async function saveFolder(value) {
      try {
        if (editingFolder.value) {
          await api.updateFolder(editingFolder.value.id, value);
          editingFolder.value = null;
        } else {
          await api.createFolder(value.name, value.parentId, value.icon);
          creatingFolder.value = false;
        }
        emit("changed");
        showSuccess(translate("shortlinks", "Folder saved"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function deleteSelectedFolder(deleteLinks) {
      if (!deletingFolder.value) return;
      try {
        await api.deleteFolder(deletingFolder.value.id, deleteLinks);
        deletingFolder.value = null;
        emit("changed");
        showSuccess(translate("shortlinks", "Folder deleted"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function saveTag(value) {
      try {
        if (editingTag.value) {
          await api.updateTag(editingTag.value.id, value.name, value.color);
          editingTag.value = null;
        } else {
          await api.createTag(value.name, value.color);
          creatingTag.value = false;
        }
        emit("changed");
        showSuccess(translate("shortlinks", "Tag saved"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function deleteTag(tag) {
      if (!window.confirm(translate("shortlinks", "Delete the tag “{name}”?", { name: tag.name }))) return;
      try {
        await api.deleteTag(tag.id);
        emit("changed");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function mergeTag() {
      if (!mergingTag.value || mergeTargetId.value === null) return;
      try {
        await api.mergeTag(mergingTag.value.id, mergeTargetId.value);
        mergingTag.value = null;
        mergeTargetId.value = null;
        emit("changed");
        showSuccess(translate("shortlinks", "Tags merged"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(unref(NcAppSettingsDialog), {
          open: __props.open,
          name: unref(translate)("shortlinks", "Shortlinks settings"),
          "show-navigation": "",
          "onUpdate:open": _cache[13] || (_cache[13] = ($event) => emit("update:open", $event))
        }, {
          default: withCtx(() => [
            createVNode(unref(NcAppSettingsSection), {
              id: "general",
              name: unref(translate)("shortlinks", "General"),
              description: unref(translate)("shortlinks", "Control previews, automatic metadata completion, and dashboard onboarding."),
              order: 5
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiCogOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(GeneralUserSettings, {
                  onSaved: _cache[0] || (_cache[0] = ($event) => emit("settingsSaved", $event))
                })
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "bookmarklet",
              name: unref(translate)("shortlinks", "Bookmarklet"),
              description: unref(translate)("shortlinks", "Create short links directly from your browser toolbar."),
              order: 10
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiBookmarkPlusOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(BookmarkletGuide, { "show-heading": false })
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "aliases",
              name: unref(translate)("shortlinks", "Automatic aliases"),
              description: unref(translate)("shortlinks", "Choose how aliases are generated and how collisions are resolved."),
              order: 15
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiIdentifier) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(AliasUrlSettings, {
                  section: "alias",
                  onSaved: _cache[1] || (_cache[1] = ($event) => emit("settingsSaved", $event))
                })
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "sharing-url",
              name: unref(translate)("shortlinks", "URL used for sharing"),
              description: unref(translate)("shortlinks", "Choose the address that is displayed, copied, and shared."),
              order: 16
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiShareVariantOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(AliasUrlSettings, {
                  section: "url",
                  onSaved: _cache[2] || (_cache[2] = ($event) => emit("settingsSaved", $event))
                })
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "import",
              name: unref(translate)("shortlinks", "Import"),
              description: unref(translate)("shortlinks", "Bring complete backups or links from Shortlinks and compatible services into your account."),
              order: 35
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiImport) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(DataTransferSettings, {
                  mode: "import",
                  "allow-import-suggestions": allowImportSuggestions.value,
                  onRequestCompatibility: _cache[3] || (_cache[3] = ($event) => suggestionKind.value = "import-compatibility")
                }, null, 8, ["allow-import-suggestions"])
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "export",
              name: unref(translate)("shortlinks", "Export"),
              description: unref(translate)("shortlinks", "Download a portable backup of your configuration and all links."),
              order: 36
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiExportVariant) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(DataTransferSettings, { mode: "export" })
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "folders",
              name: unref(translate)("shortlinks", "Folders"),
              description: unref(translate)("shortlinks", "Organize links in nested folders and choose their order."),
              order: 20
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderMultipleOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_1, [
                  __props.folders.length === 0 ? (openBlock(), createBlock(unref(NcEmptyContent), {
                    key: 0,
                    name: unref(translate)("shortlinks", "No folders yet"),
                    description: unref(translate)("shortlinks", "Create a folder to group related short links.")
                  }, null, 8, ["name", "description"])) : (openBlock(), createBlock(FolderTreeList, {
                    key: 1,
                    folders: __props.folders,
                    mode: "manage",
                    onEdit: _cache[4] || (_cache[4] = ($event) => editingFolder.value = $event),
                    onDelete: _cache[5] || (_cache[5] = ($event) => deletingFolder.value = $event),
                    onChanged: _cache[6] || (_cache[6] = ($event) => emit("changed"))
                  }, null, 8, ["folders"])),
                  createVNode(unref(NcButton), {
                    variant: "tertiary",
                    class: "add-button",
                    onClick: _cache[7] || (_cache[7] = ($event) => creatingFolder.value = true)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "New folder")), 1)
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "tags",
              name: unref(translate)("shortlinks", "Tags"),
              description: unref(translate)("shortlinks", "Maintain reusable labels for filtering and grouping links."),
              order: 30
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagMultipleOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_2, [
                  __props.tags.length === 0 ? (openBlock(), createBlock(unref(NcEmptyContent), {
                    key: 0,
                    name: unref(translate)("shortlinks", "No tags yet"),
                    description: unref(translate)("shortlinks", "Create a tag to make links easier to find.")
                  }, null, 8, ["name", "description"])) : (openBlock(), createBlock(TagList, {
                    key: 1,
                    tags: __props.tags,
                    mode: "manage",
                    onEdit: _cache[8] || (_cache[8] = ($event) => editingTag.value = $event),
                    onMerge: _cache[9] || (_cache[9] = ($event) => mergingTag.value = $event),
                    onDelete: deleteTag
                  }, null, 8, ["tags"])),
                  createVNode(unref(NcButton), {
                    variant: "tertiary",
                    class: "add-button",
                    onClick: _cache[10] || (_cache[10] = ($event) => creatingTag.value = true)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPlus) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "New tag")), 1)
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "about",
              name: unref(translate)("shortlinks", "About"),
              description: unref(translate)("shortlinks", "Information about organizing links in Shortlinks."),
              order: 40
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiInformationOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_3, [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: unref(mdiLinkVariant),
                    size: 48
                  }, null, 8, ["path"]),
                  createBaseVNode("div", null, [
                    createBaseVNode("h3", null, toDisplayString(unref(translate)("shortlinks", "Shortlinks")), 1),
                    createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Create memorable redirects, organize them, and understand how they are used.")), 1)
                  ])
                ]),
                createBaseVNode("div", _hoisted_4, [
                  createVNode(unref(NcButton), {
                    onClick: _cache[11] || (_cache[11] = ($event) => suggestionKind.value = "bug")
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiBugOutline) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Report bug")), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NcButton), {
                    onClick: _cache[12] || (_cache[12] = ($event) => suggestionKind.value = "development")
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiSourceBranch) }, null, 8, ["path"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Help with development")), 1)
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }, 8, ["name", "description"]),
            createVNode(unref(NcAppSettingsSection), {
              id: "suggestions",
              name: unref(translate)("shortlinks", "Suggestions"),
              description: unref(translate)("shortlinks", "Share an idea, workflow need, or general request with the Shortlinks maintainers."),
              order: 50
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiMessageTextOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createVNode(SuggestionForm, {
                  kind: "general",
                  email: userEmail.value
                }, null, 8, ["email"])
              ]),
              _: 1
            }, 8, ["name", "description"])
          ]),
          _: 1
        }, 8, ["open", "name"]),
        suggestionKind.value ? (openBlock(), createBlock(unref(NcDialog), {
          key: 0,
          name: suggestionKind.value === "import-compatibility" ? unref(translate)("shortlinks", "Request import compatibility") : suggestionKind.value === "bug" ? unref(translate)("shortlinks", "Report a bug") : unref(translate)("shortlinks", "Help with development"),
          size: "normal",
          onClosing: _cache[15] || (_cache[15] = ($event) => suggestionKind.value = null)
        }, {
          default: withCtx(() => [
            createVNode(SuggestionForm, {
              kind: suggestionKind.value,
              email: userEmail.value,
              onSent: _cache[14] || (_cache[14] = ($event) => suggestionKind.value = null)
            }, null, 8, ["kind", "email"])
          ]),
          _: 1
        }, 8, ["name"])) : createCommentVNode("", true),
        creatingFolder.value ? (openBlock(), createBlock(FolderForm, {
          key: 1,
          folders: __props.folders,
          onClose: _cache[16] || (_cache[16] = ($event) => creatingFolder.value = false),
          onSave: saveFolder
        }, null, 8, ["folders"])) : createCommentVNode("", true),
        editingFolder.value ? (openBlock(), createBlock(FolderForm, {
          key: 2,
          folders: __props.folders,
          folder: editingFolder.value,
          onClose: _cache[17] || (_cache[17] = ($event) => editingFolder.value = null),
          onSave: saveFolder
        }, null, 8, ["folders", "folder"])) : createCommentVNode("", true),
        creatingTag.value ? (openBlock(), createBlock(TagForm, {
          key: 3,
          onClose: _cache[18] || (_cache[18] = ($event) => creatingTag.value = false),
          onSave: saveTag
        })) : createCommentVNode("", true),
        editingTag.value ? (openBlock(), createBlock(TagForm, {
          key: 4,
          tag: editingTag.value,
          onClose: _cache[19] || (_cache[19] = ($event) => editingTag.value = null),
          onSave: saveTag
        }, null, 8, ["tag"])) : createCommentVNode("", true),
        deletingFolder.value ? (openBlock(), createBlock(unref(NcDialog), {
          key: 5,
          name: unref(translate)("shortlinks", "Delete folder “{name}”", { name: deletingFolder.value.name }),
          size: "normal",
          onClosing: _cache[23] || (_cache[23] = ($event) => deletingFolder.value = null)
        }, {
          actions: withCtx(() => [
            createVNode(unref(NcButton), {
              onClick: _cache[22] || (_cache[22] = ($event) => deletingFolder.value = null)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
              ]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Choose what should happen to the short links in this folder and its subfolders.")), 1),
              createVNode(unref(NcFormBoxButton), {
                label: unref(translate)("shortlinks", "Delete folder, keep links"),
                description: unref(translate)("shortlinks", "The links are moved to Unfiled and remain available."),
                onClick: _cache[20] || (_cache[20] = ($event) => deleteSelectedFolder(false))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderRemoveOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["label", "description"]),
              createVNode(unref(NcFormBoxButton), {
                label: unref(translate)("shortlinks", "Delete folder and links"),
                "inverted-accent": "",
                onClick: _cache[21] || (_cache[21] = ($event) => deleteSelectedFolder(true))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                ]),
                description: withCtx(() => [
                  createBaseVNode("span", null, [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", "Moves")) + " ", 1),
                    createBaseVNode("strong", null, toDisplayString(deleteLinkCount.value), 1),
                    createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "short links to trash.")), 1)
                  ])
                ]),
                _: 1
              }, 8, ["label"])
            ])
          ]),
          _: 1
        }, 8, ["name"])) : createCommentVNode("", true),
        mergingTag.value ? (openBlock(), createBlock(unref(NcDialog), {
          key: 6,
          name: unref(translate)("shortlinks", "Merge tag “{name}”", { name: mergingTag.value.name }),
          size: "normal",
          onClosing: _cache[26] || (_cache[26] = ($event) => mergingTag.value = null)
        }, {
          actions: withCtx(() => [
            createVNode(unref(NcButton), {
              onClick: _cache[25] || (_cache[25] = ($event) => mergingTag.value = null)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
              ]),
              _: 1
            }),
            createVNode(unref(NcButton), {
              variant: "primary",
              disabled: mergeTargetId.value === null,
              onClick: mergeTag
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Merge")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "All links receive the target tag, then the original tag is deleted.")), 1),
              createBaseVNode("label", _hoisted_7, [
                createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Merge into")), 1),
                withDirectives(createBaseVNode("select", {
                  "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => mergeTargetId.value = $event)
                }, [
                  _cache[27] || (_cache[27] = createBaseVNode("option", { value: null }, "—", -1)),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags.filter((item) => item.id !== mergingTag.value?.id), (tag) => {
                    return openBlock(), createElementBlock("option", {
                      key: tag.id,
                      value: tag.id
                    }, toDisplayString(tag.name), 9, _hoisted_8);
                  }), 128))
                ], 512), [
                  [vModelSelect, mergeTargetId.value]
                ])
              ])
            ])
          ]),
          _: 1
        }, 8, ["name"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
const AppSettingsDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f899127a"]]);
export {
  AppSettingsDialog as default
};
