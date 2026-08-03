const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=[window.OC.filePath('shortlinks', '', 'js/AppSettingsDialog-BEUKmDCr.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/vue-runtime-R8I1oHZP.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/browser-polyfills-BQT2yEH3.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/vendor-CflEb2sm.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/vendor-CkfLxyAm.chunk.css'),window.OC.filePath('shortlinks', '', 'js/nextcloud-dialogs-BcEXh8qH.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/nextcloud-ui-Dwfo27ZN.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/nextcloud-ui-CUvsTal9.chunk.css'),window.OC.filePath('shortlinks', '', 'js/_plugin-vue_export-helper-DgQhhzWV.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/BookmarkletGuide-MqClDYzH.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/BookmarkletGuide-B9--IlUK.chunk.css'),window.OC.filePath('shortlinks', '', 'js/FolderForm-CmAZh5yn.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/FolderForm-CLyChPiV.chunk.css'),window.OC.filePath('shortlinks', '', 'js/TagForm-D9YhRSyq.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/TagForm-DztsobAn.chunk.css'),window.OC.filePath('shortlinks', '', 'css/AppSettingsDialog-BHHGOUV1.chunk.css'),window.OC.filePath('shortlinks', '', 'js/DashboardView-gWBwac9n.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/LinkPreviewEditor-DpcJ7el6.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/LinkPreviewEditor-CArzt-3k.chunk.css'),window.OC.filePath('shortlinks', '', 'css/DashboardView-bv-7etN6.chunk.css'),window.OC.filePath('shortlinks', '', 'js/FolderDeleteDialog-4ZctuTHY.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/FolderDeleteDialog-BuKj-0gy.chunk.css'),window.OC.filePath('shortlinks', '', 'js/FolderDestinationDialog-RExuPLay.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/FolderDestinationDialog-CrRMEEqJ.chunk.css'),window.OC.filePath('shortlinks', '', 'js/LinkDetail-Dc2KZAPa.chunk.mjs'),window.OC.filePath('shortlinks', '', 'js/StatsDimension--wxqRH-u.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/StatsDimension-BNlobWmv.chunk.css'),window.OC.filePath('shortlinks', '', 'css/LinkDetail-DswcSAp9.chunk.css'),window.OC.filePath('shortlinks', '', 'js/LinkForm-m7KoGYN8.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/LinkForm-D89maFw2.chunk.css'),window.OC.filePath('shortlinks', '', 'js/PageEditor-C-GWBiue.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/PageEditor-BuDWUCLp.chunk.css'),window.OC.filePath('shortlinks', '', 'js/PageList-9xFUA5ID.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/PageList-BWY0KWrQ.chunk.css'),window.OC.filePath('shortlinks', '', 'js/StatsOverview-igMVr00-.chunk.mjs'),window.OC.filePath('shortlinks', '', 'css/StatsOverview-dZqsc-Gy.chunk.css')])))=>i.map(i=>d[i]);
const appName = "shortlinks";
const appVersion = "1.2.2";
import { W as defineComponent, j as openBlock, k as createBlock, u as unref, Q as withCtx, P as createVNode, x as ref, o as onMounted, h as onBeforeUnmount, w as watch, p as createElementBlock, D as createBaseVNode, F as Fragment, E as renderList, L as createCommentVNode, I as toDisplayString, N as withDirectives, ah as vModelSelect, H as createTextVNode, K as withModifiers, G as mergeProps, d as computed, v as normalizeStyle, R as normalizeClass, Y as createSlots, U as resolveComponent, V as vModelText, r as reactive, ag as defineAsyncComponent, a1 as createApp } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { a as showError, s as showSuccess, _ as __vitePreload } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
import { Y as generateUrl, F as cancelableClient, G as generateOcsUrl, an as translate, ao as mdiLinkPlus, ap as mdiFileDocumentPlusOutline, aq as mdiFolderPlusOutline, ar as mdiTagPlusOutline, E as subscribe, A as unsubscribe, as as mdiMenuOpen, at as mdiMenu, au as mdiMagnify, av as mdiFileDelimitedOutline, aw as mdiCodeJson, ax as mdiFileImportOutline, ay as mdiExportVariant, az as mdiChartBoxOutline, aA as mdiTagMultipleOutline, aB as mdiViewDashboardOutline, aC as mdiLinkVariant, aD as mdiStarOutline, aE as mdiTrendingUp, aF as mdiHistory, aG as mdiCursorDefaultClickOutline, aH as mdiCalendarRemoveOutline, aI as mdiLinkOff, aJ as mdiTrashCanOutline, v as emit, ac as mdiStar, aK as mdiFolderMoveOutline, aL as mdiQrcode, aM as mdiRestore, aN as mdiDeleteOutline, aO as mdiDotsHorizontal, aP as mdiFolderOutline, aQ as mdiBriefcaseOutline, aR as mdiHomeOutline, aS as mdiRocketLaunchOutline, aT as mdiArchiveOutline, aU as mdiFolderStarOutline, aV as mdiArrowUp, aW as mdiArrowDown, aX as mdiPencilOutline, aY as mdiContentCopy, aZ as mdiMerge, ah as mdiTagOutline, a_ as mdiLockOutline, a$ as mdiCalendarClockOutline, b0 as mdiCalendarEndOutline, b1 as mdiInformationOutline, b2 as mdiViewListOutline, b3 as mdiViewGridOutline, b4 as mdiSwapVertical, b5 as mdiContentDuplicate, b6 as mdiFileDocumentMultipleOutline, b7 as mdiCogOutline, b8 as mdiFileDocumentOutline, b9 as mdiEarth, ba as mdiShieldLockOutline, bb as mdiCalendarRange, n as loadState } from "./vendor-CflEb2sm.chunk.mjs";
import { b as NcActions, n as NcActionButton, h as NcIconSvgWrapper, g as NcButton, d as NcBreadcrumb, e as NcBreadcrumbs, _ as _sfc_main$d, o as NcPopover, f as NcCheckboxRadioSwitch, p as NcListItem, a as NcDialog, q as NcLoadingIcon, N as NcEmptyContent, r as NcActionLink, t as NcAppNavigationItem, u as NcActionSeparator, v as NcAppNavigation, w as NcAppNavigationCaption, x as NcAppContent, y as NcAppSidebar, z as NcContent } from "./nextcloud-ui-Dwfo27ZN.chunk.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-DgQhhzWV.chunk.mjs";
import "./browser-polyfills-BQT2yEH3.chunk.mjs";
async function request(method, path, data, params) {
  try {
    const response = await cancelableClient.request({ method, url: generateOcsUrl(`/apps/shortlinks/api/v1${path}`), data, params, headers: { "OCS-APIRequest": "true", Accept: "application/json" } });
    if (response.status === 204) return {};
    const envelope = response.data.ocs.data;
    if (envelope.error || envelope.data === null) throw new Error(envelope.error?.message ?? "Empty API response");
    return envelope.data;
  } catch (error) {
    const responseData = error.response?.data;
    const message = responseData?.ocs?.data?.error?.message;
    throw new Error(message ?? (error instanceof Error ? error.message : String(error)));
  }
}
const api = {
  listLinks: (params) => request("GET", "/links", void 0, params),
  createLink: (draft) => request("POST", "/links", draft),
  updateLink: (id, changes) => request("PATCH", `/links/${id}`, changes),
  deleteLink: (id, permanent = false) => request("DELETE", `/links/${id}`, void 0, { permanent }),
  restoreLink: (id) => request("POST", `/links/${id}/restore`),
  cloneLink: (id) => request("POST", `/links/${id}/clone`),
  bulk: (ids, changes) => request("POST", "/links/bulk", { ids, changes }),
  aliasAvailable: (slug) => request("GET", `/aliases/${encodeURIComponent(slug)}`),
  suggestAlias: (context = {}) => request("POST", "/aliases/suggest", context),
  getUserSettings: () => request("GET", "/user-settings"),
  updateUserSettings: (settings) => request("PUT", "/user-settings", settings),
  listFolders: () => request("GET", "/folders"),
  createFolder: (name, parentId = null, icon = "folder") => request("POST", "/folders", { name, parentId, icon }),
  updateFolder: (id, data) => request("PATCH", `/folders/${id}`, data),
  copyFolder: (id, parentId) => request("POST", `/folders/${id}/copy`, { parentId }),
  reorderFolders: (parentId, ids) => request("PUT", "/folders/order", { parentId, ids }),
  deleteFolder: (id, deleteLinks = false) => request("DELETE", `/folders/${id}`, void 0, { deleteLinks }),
  listTags: () => request("GET", "/tags"),
  createTag: (name, color = null) => request("POST", "/tags", { name, color }),
  updateTag: (id, name, color = null) => request("PATCH", `/tags/${id}`, { name, color }),
  mergeTag: (id, targetId) => request("POST", `/tags/${id}/merge`, { targetId }),
  deleteTag: (id) => request("DELETE", `/tags/${id}`),
  statsOverview: (params = {}) => request("GET", "/stats", void 0, params),
  stats: (id, params = {}) => request("GET", `/links/${id}/stats`, void 0, params),
  exportStats: (id, format, params = {}) => request("GET", `/links/${id}/stats/export`, void 0, { format, ...params }),
  clicks: (id, params = {}) => request("GET", `/links/${id}/clicks`, void 0, params),
  exportClicks: (id, format, params = {}) => request("GET", `/links/${id}/clicks/export`, void 0, { format, ...params }),
  activity: (id) => request("GET", `/links/${id}/activity`),
  shares: (id) => request("GET", `/links/${id}/shares`),
  createShare: (id, data) => request("POST", `/links/${id}/shares`, data),
  deleteShare: (id, shareId) => request("DELETE", `/links/${id}/shares/${shareId}`),
  exportLinks: (format, filters = {}) => request("GET", "/export/links", void 0, { format, ...filters }),
  exportBackup: () => request("GET", "/export/backup"),
  importLinks: (format, content, dryRun, conflict) => request("POST", "/import/links", { format, content, dryRun, conflict }),
  submitSuggestion: (data) => request("POST", "/suggestions", data),
  bookmarklet: () => request("GET", "/tools/bookmarklet"),
  fetchTitle: (targetUrl) => request("POST", "/tools/title", { targetUrl }),
  fetchMetadata: (targetUrl) => request("POST", "/tools/metadata", { targetUrl }),
  searchPrincipals: (search) => request("GET", "/principals", void 0, { search, limit: 20 }),
  qrUrl: (id, format = "svg") => generateUrl("/apps/shortlinks/qr/{id}", { id }) + `?format=${format}`,
  bulkQrUrl: (ids) => generateUrl("/apps/shortlinks/qr/bulk") + `?${new URLSearchParams(ids.map((id) => ["ids[]", String(id)])).toString()}`,
  thumbnailUrl: (id) => generateUrl("/apps/shortlinks/thumbnail/{id}", { id }),
  previewThumbnailUrl: (targetUrl, imageUrl) => generateUrl("/apps/shortlinks/thumbnail/preview") + `?${new URLSearchParams({ url: targetUrl, ...imageUrl ? { imageUrl } : {} }).toString()}`,
  listPages: (filter = "all", page = 1, perPage = 100) => request("GET", "/pages", void 0, { filter, page, perPage }),
  searchPageContacts: (search) => request("GET", "/pages/contacts", void 0, { search }),
  createPage: (draft) => request("POST", "/pages", draft),
  updatePage: (id, draft) => request("PATCH", `/pages/${id}`, draft),
  deletePage: (id, permanent = false) => request("DELETE", `/pages/${id}`, void 0, { permanent }),
  restorePage: (id) => request("POST", `/pages/${id}/restore`)
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "CreateMenu",
  emits: ["folder", "link", "page", "tag"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const open = ref(false);
    const menuKey = ref(0);
    function select(type) {
      open.value = false;
      if (type === "folder") emit2("folder");
      else if (type === "link") emit2("link");
      else if (type === "page") emit2("page");
      else emit2("tag");
      setTimeout(() => {
        open.value = false;
        menuKey.value++;
      }, 0);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcActions), {
        key: menuKey.value,
        open: open.value,
        "onUpdate:open": _cache[4] || (_cache[4] = ($event) => open.value = $event),
        class: "create-menu",
        "force-menu": "",
        primary: "",
        "default-icon": "icon-add",
        "menu-name": unref(translate)("shortlinks", "+ New"),
        "aria-label": unref(translate)("shortlinks", "Create new")
      }, {
        default: withCtx(() => [
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "New short link"),
            onClick: _cache[0] || (_cache[0] = ($event) => select("link"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiLinkPlus) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "New page"),
            onClick: _cache[1] || (_cache[1] = ($event) => select("page"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileDocumentPlusOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "New folder"),
            onClick: _cache[2] || (_cache[2] = ($event) => select("folder"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderPlusOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "New tag"),
            onClick: _cache[3] || (_cache[3] = ($event) => select("tag"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagPlusOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"])
        ]),
        _: 1
      }, 8, ["open", "menu-name", "aria-label"]);
    };
  }
});
const CreateMenu = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-5df8f29d"]]);
const _hoisted_1$9 = ["aria-label"];
const _hoisted_2$8 = { class: "content-toolbar__left" };
const _hoisted_3$4 = {
  key: 0,
  class: "content-toolbar__actions"
};
const _hoisted_4$2 = { class: "popover-grid" };
const _hoisted_5$2 = { value: "any" };
const _hoisted_6$2 = { value: "day" };
const _hoisted_7$2 = { value: "week" };
const _hoisted_8$2 = { value: "month" };
const _hoisted_9$2 = { value: "year" };
const _hoisted_10$2 = { value: "all" };
const _hoisted_11$2 = { value: "active" };
const _hoisted_12$2 = { value: "inactive" };
const _hoisted_13$2 = { class: "popover-actions" };
const _hoisted_14$2 = { key: 0 };
const _hoisted_15$2 = {
  key: 0,
  class: "tag-filter-list"
};
const _hoisted_16$1 = { class: "tag-filter-label" };
const _hoisted_17$1 = { class: "tag-filter-count" };
const _hoisted_18$1 = {
  key: 1,
  class: "empty-popover"
};
const _hoisted_19$1 = {
  key: 2,
  class: "tag-mode"
};
const _hoisted_20$1 = { class: "popover-actions" };
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "ContentToolbar",
  props: {
    folders: {},
    tags: {},
    system: {},
    folderId: {},
    tagIds: {},
    tagMode: {},
    search: {},
    createdFrom: {},
    active: { type: [Boolean, null] },
    listMode: { type: Boolean }
  },
  emits: ["createFolder", "createLink", "createPage", "createTag", "filter", "openTag", "setTags", "search", "overview", "refresh"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit$1 = __emit;
    const systemItems = [
      { id: "dashboard", label: "Dashboard", icon: mdiViewDashboardOutline },
      { id: "statistics", label: "Statistics", icon: mdiChartBoxOutline },
      { id: "all", label: "All links", icon: mdiLinkVariant },
      { id: "favorites", label: "Favorites", icon: mdiStarOutline },
      { id: "trending", label: "Trending links", icon: mdiTrendingUp },
      { id: "recent", label: "Recently created", icon: mdiHistory },
      { id: "used", label: "Recently used", icon: mdiCursorDefaultClickOutline },
      { id: "expired", label: "Expired", icon: mdiCalendarRemoveOutline },
      { id: "inactive", label: "Inactive", icon: mdiLinkOff },
      { id: "trash", label: "Trash", icon: mdiTrashCanOutline }
    ];
    const searchOpen = ref(false);
    const tagOpen = ref(false);
    const searchQuery = ref(props.search);
    const agePeriod = ref(periodForTimestamp(props.createdFrom));
    const activeFilter = ref(props.active === true ? "active" : props.active === false ? "inactive" : "all");
    const localTagIds = ref([...props.tagIds]);
    const localTagMode = ref(props.tagMode);
    const importInput = ref(null);
    const navigationOpen = ref(true);
    function onNavigationToggled(event) {
      if (typeof event === "object" && event !== null && "open" in event) {
        navigationOpen.value = Boolean(event.open);
      }
    }
    onMounted(() => {
      const navigation = document.querySelector(".app-navigation");
      navigationOpen.value = !navigation?.classList.contains("app-navigation--closed");
      subscribe("navigation-toggled", onNavigationToggled);
    });
    onBeforeUnmount(() => unsubscribe("navigation-toggled", onNavigationToggled));
    watch(() => props.search, (value) => {
      searchQuery.value = value;
    });
    watch(() => props.createdFrom, (value) => {
      agePeriod.value = periodForTimestamp(value);
    });
    watch(() => props.active, (value) => {
      activeFilter.value = value === true ? "active" : value === false ? "inactive" : "all";
    });
    watch(() => props.tagIds, (value) => {
      localTagIds.value = [...value];
    });
    watch(() => props.tagMode, (value) => {
      localTagMode.value = value;
    });
    const activeSystem = computed(() => systemItems.find((item) => item.id === props.system) ?? { id: "all", label: "All links", icon: mdiLinkVariant });
    const selectedTags = computed(() => props.tags.filter((tag) => props.tagIds.includes(tag.id)));
    const folderPath = computed(() => {
      const path = [];
      let current = props.folders.find((folder) => folder.id === props.folderId);
      const seen = /* @__PURE__ */ new Set();
      while (current && !seen.has(current.id)) {
        path.unshift(current);
        seen.add(current.id);
        current = current.parentId === null ? void 0 : props.folders.find((folder) => folder.id === current?.parentId);
      }
      return path;
    });
    const hasSearchFilters = computed(() => Boolean(props.search || props.createdFrom !== null || props.active !== null));
    const hasTagFilters = computed(() => props.tagIds.length > 0);
    function siblings(folder) {
      return props.folders.filter((item) => item.parentId === folder.parentId).sort((left, right) => left.position - right.position || left.name.localeCompare(right.name));
    }
    function periodForTimestamp(timestamp) {
      if (timestamp === null) return "any";
      const ageDays = (Date.now() / 1e3 - timestamp) / 86400;
      if (ageDays <= 1.5) return "day";
      if (ageDays <= 8) return "week";
      if (ageDays <= 32) return "month";
      return "year";
    }
    function applySearch() {
      const days = { any: null, day: 1, week: 7, month: 30, year: 365 };
      const selectedDays = days[agePeriod.value];
      emit$1("search", {
        search: searchQuery.value.trim(),
        createdFrom: selectedDays === null ? null : Math.floor(Date.now() / 1e3) - selectedDays * 86400,
        active: activeFilter.value === "all" ? null : activeFilter.value === "active"
      });
      searchOpen.value = false;
    }
    function clearSearch() {
      searchQuery.value = "";
      agePeriod.value = "any";
      activeFilter.value = "all";
      emit$1("search", { search: "", createdFrom: null, active: null });
      searchOpen.value = false;
    }
    function toggleLocalTag(id) {
      localTagIds.value = localTagIds.value.includes(id) ? localTagIds.value.filter((value) => value !== id) : [...localTagIds.value, id];
    }
    function applyTags() {
      emit$1("setTags", { ids: localTagIds.value, mode: localTagMode.value });
      tagOpen.value = false;
    }
    function clearTags() {
      localTagIds.value = [];
      emit$1("setTags", { ids: [], mode: localTagMode.value });
      tagOpen.value = false;
    }
    function toggleNavigation() {
      const open = !navigationOpen.value;
      navigationOpen.value = open;
      emit("toggle-navigation", { open });
    }
    async function exportLinks(format) {
      try {
        const result = await api.exportLinks(format, {
          system: props.system,
          folderId: props.folderId ?? void 0,
          tagIds: props.tagIds,
          tagMode: props.tagMode,
          search: props.search,
          createdFrom: props.createdFrom ?? void 0,
          active: props.active ?? void 0
        });
        const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = result.filename;
        anchor.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function importFile(event) {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error(translate("shortlinks", "Import files are limited to 5 MiB"));
        const format = file.name.toLowerCase().endsWith(".json") ? "json" : "csv";
        const content = await file.text();
        const preview = await api.importLinks(format, content, true, "skip");
        if (!window.confirm(translate("shortlinks", "The dry run found {count} valid rows. Continue with import?", { count: preview.created ?? 0 }))) return;
        const result = await api.importLinks(format, content, false, "skip");
        showSuccess(translate("shortlinks", "Imported {count} links", { count: result.created ?? 0 }));
        emit$1("refresh");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        input.value = "";
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", {
        class: "content-toolbar",
        "aria-label": unref(translate)("shortlinks", "List actions")
      }, [
        createBaseVNode("div", _hoisted_2$8, [
          createVNode(unref(NcButton), {
            class: "content-toolbar__navigation-toggle",
            variant: "tertiary",
            "aria-label": unref(translate)("shortlinks", navigationOpen.value ? "Close navigation" : "Open navigation"),
            title: unref(translate)("shortlinks", navigationOpen.value ? "Close navigation" : "Open navigation"),
            "aria-expanded": navigationOpen.value,
            "aria-controls": "app-navigation-vue",
            onClick: toggleNavigation
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), {
                path: navigationOpen.value ? unref(mdiMenuOpen) : unref(mdiMenu)
              }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["aria-label", "title", "aria-expanded"]),
          createVNode(CreateMenu, {
            onLink: _cache[0] || (_cache[0] = ($event) => emit$1("createLink")),
            onPage: _cache[1] || (_cache[1] = ($event) => emit$1("createPage")),
            onFolder: _cache[2] || (_cache[2] = ($event) => emit$1("createFolder")),
            onTag: _cache[3] || (_cache[3] = ($event) => emit$1("createTag"))
          }),
          createVNode(unref(NcBreadcrumbs), {
            "root-icon": "icon-link",
            "aria-label": unref(translate)("shortlinks", "Current view")
          }, {
            default: withCtx(() => [
              createVNode(unref(NcBreadcrumb), {
                name: unref(translate)("shortlinks", __props.folderId !== null || __props.tagIds.length ? "All links" : activeSystem.value.label),
                "force-menu": ""
              }, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(Fragment, null, renderList(systemItems, (item) => {
                    return createVNode(unref(NcActionButton), {
                      key: item.id,
                      name: unref(translate)("shortlinks", item.label),
                      "aria-current": __props.folderId === null && __props.tagIds.length === 0 && __props.system === item.id ? "page" : void 0,
                      onClick: ($event) => emit$1("filter", { system: item.id, folderId: null })
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), {
                          path: item.icon
                        }, null, 8, ["path"])
                      ]),
                      _: 2
                    }, 1032, ["name", "aria-current", "onClick"]);
                  }), 64))
                ]),
                _: 1
              }, 8, ["name"]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(folderPath.value, (folder) => {
                return openBlock(), createBlock(unref(NcBreadcrumb), {
                  key: folder.id,
                  name: folder.name,
                  "force-menu": ""
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(siblings(folder), (sibling) => {
                      return openBlock(), createBlock(unref(NcActionButton), {
                        key: sibling.id,
                        name: sibling.name,
                        "aria-current": sibling.id === folder.id ? "page" : void 0,
                        onClick: ($event) => emit$1("filter", { system: "all", folderId: sibling.id })
                      }, null, 8, ["name", "aria-current", "onClick"]);
                    }), 128))
                  ]),
                  _: 2
                }, 1032, ["name"]);
              }), 128)),
              __props.tagIds.length ? (openBlock(), createBlock(unref(NcBreadcrumb), {
                key: 0,
                name: unref(translate)("shortlinks", "Tags"),
                "force-menu": ""
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
                    return openBlock(), createBlock(unref(NcActionButton), {
                      key: tag.id,
                      name: tag.name,
                      onClick: ($event) => emit$1("openTag", tag.id)
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagMultipleOutline) }, null, 8, ["path"])
                      ]),
                      _: 1
                    }, 8, ["name", "onClick"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["name"])) : createCommentVNode("", true),
              __props.tagIds.length ? (openBlock(), createBlock(unref(NcBreadcrumb), {
                key: 1,
                name: selectedTags.value.map((tag) => tag.name).join(", ") || unref(translate)("shortlinks", "Tags"),
                "force-menu": ""
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
                    return openBlock(), createBlock(unref(NcActionButton), {
                      key: tag.id,
                      name: tag.name,
                      "aria-current": __props.tagIds.includes(tag.id) ? "page" : void 0,
                      onClick: ($event) => emit$1("openTag", tag.id)
                    }, null, 8, ["name", "aria-current", "onClick"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["name"])) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ]),
        __props.listMode ? (openBlock(), createElementBlock("div", _hoisted_3$4, [
          createVNode(unref(NcPopover), {
            shown: searchOpen.value,
            "onUpdate:shown": _cache[7] || (_cache[7] = ($event) => searchOpen.value = $event),
            placement: "bottom-end",
            "popup-role": "dialog"
          }, {
            trigger: withCtx(({ attrs }) => [
              createVNode(unref(NcButton), mergeProps(attrs, {
                variant: "tertiary",
                pressed: hasSearchFilters.value
              }), {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiMagnify) }, null, 8, ["path"])
                ]),
                default: withCtx(() => [
                  createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Search")), 1)
                ]),
                _: 1
              }, 16, ["pressed"])
            ]),
            default: withCtx(() => [
              createBaseVNode("form", {
                class: "toolbar-popover search-popover",
                onSubmit: withModifiers(applySearch, ["prevent"])
              }, [
                createBaseVNode("div", null, [
                  createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Search short links")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Search titles, aliases, and destination URLs, then narrow the result.")), 1)
                ]),
                createVNode(unref(_sfc_main$d), {
                  modelValue: searchQuery.value,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => searchQuery.value = $event),
                  type: "search",
                  label: unref(translate)("shortlinks", "Search")
                }, null, 8, ["modelValue", "label"]),
                createBaseVNode("div", _hoisted_4$2, [
                  createBaseVNode("label", null, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Created")), 1),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => agePeriod.value = $event)
                    }, [
                      createBaseVNode("option", _hoisted_5$2, toDisplayString(unref(translate)("shortlinks", "Any time")), 1),
                      createBaseVNode("option", _hoisted_6$2, toDisplayString(unref(translate)("shortlinks", "Last 24 hours")), 1),
                      createBaseVNode("option", _hoisted_7$2, toDisplayString(unref(translate)("shortlinks", "Last 7 days")), 1),
                      createBaseVNode("option", _hoisted_8$2, toDisplayString(unref(translate)("shortlinks", "Last 30 days")), 1),
                      createBaseVNode("option", _hoisted_9$2, toDisplayString(unref(translate)("shortlinks", "Last year")), 1)
                    ], 512), [
                      [vModelSelect, agePeriod.value]
                    ])
                  ]),
                  createBaseVNode("label", null, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Status")), 1),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => activeFilter.value = $event)
                    }, [
                      createBaseVNode("option", _hoisted_10$2, toDisplayString(unref(translate)("shortlinks", "Any status")), 1),
                      createBaseVNode("option", _hoisted_11$2, toDisplayString(unref(translate)("shortlinks", "Active")), 1),
                      createBaseVNode("option", _hoisted_12$2, toDisplayString(unref(translate)("shortlinks", "Inactive")), 1)
                    ], 512), [
                      [vModelSelect, activeFilter.value]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_13$2, [
                  createVNode(unref(NcButton), {
                    type: "button",
                    onClick: clearSearch
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Reset")), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NcButton), {
                    type: "submit",
                    variant: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Apply search")), 1)
                    ]),
                    _: 1
                  })
                ])
              ], 32)
            ]),
            _: 1
          }, 8, ["shown"]),
          createVNode(unref(NcActions), {
            "force-menu": "",
            "force-name": "",
            "menu-name": unref(translate)("shortlinks", "Export"),
            "aria-label": unref(translate)("shortlinks", "Export and import"),
            variant: "tertiary"
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiExportVariant) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createVNode(unref(NcActionButton), {
                name: unref(translate)("shortlinks", "Export CSV"),
                onClick: _cache[8] || (_cache[8] = ($event) => exportLinks("csv"))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileDelimitedOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["name"]),
              createVNode(unref(NcActionButton), {
                name: unref(translate)("shortlinks", "Export JSON"),
                onClick: _cache[9] || (_cache[9] = ($event) => exportLinks("json"))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiCodeJson) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["name"]),
              createVNode(unref(NcActionButton), {
                name: unref(translate)("shortlinks", "Import CSV or JSON"),
                onClick: _cache[10] || (_cache[10] = ($event) => importInput.value?.click())
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileImportOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["name"])
            ]),
            _: 1
          }, 8, ["menu-name", "aria-label"]),
          createBaseVNode("input", {
            ref_key: "importInput",
            ref: importInput,
            class: "import-input",
            type: "file",
            accept: ".csv,.json,text/csv,application/json",
            onChange: importFile
          }, null, 544),
          createVNode(unref(NcButton), {
            variant: "tertiary",
            onClick: _cache[11] || (_cache[11] = ($event) => emit$1("overview"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiChartBoxOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Statistics")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcPopover), {
            shown: tagOpen.value,
            "onUpdate:shown": _cache[14] || (_cache[14] = ($event) => tagOpen.value = $event),
            placement: "bottom-end",
            "popup-role": "dialog"
          }, {
            trigger: withCtx(({ attrs }) => [
              createVNode(unref(NcButton), mergeProps(attrs, {
                variant: "tertiary",
                pressed: hasTagFilters.value
              }), {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagMultipleOutline) }, null, 8, ["path"])
                ]),
                default: withCtx(() => [
                  createTextVNode(" " + toDisplayString(unref(translate)("shortlinks", "Tags")), 1),
                  __props.tagIds.length ? (openBlock(), createElementBlock("span", _hoisted_14$2, " (" + toDisplayString(__props.tagIds.length) + ")", 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }, 16, ["pressed"])
            ]),
            default: withCtx(() => [
              createBaseVNode("form", {
                class: "toolbar-popover tag-popover",
                onSubmit: withModifiers(applyTags, ["prevent"])
              }, [
                createBaseVNode("div", null, [
                  createBaseVNode("h2", null, toDisplayString(unref(translate)("shortlinks", "Filter by tags")), 1),
                  createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Combine one or more tags to narrow this view.")), 1)
                ]),
                __props.tags.length ? (openBlock(), createElementBlock("div", _hoisted_15$2, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
                    return openBlock(), createBlock(unref(NcCheckboxRadioSwitch), {
                      key: tag.id,
                      type: "checkbox",
                      "model-value": localTagIds.value.includes(tag.id),
                      "onUpdate:modelValue": ($event) => toggleLocalTag(tag.id)
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("span", _hoisted_16$1, [
                          tag.color ? (openBlock(), createElementBlock("span", {
                            key: 0,
                            class: "tag-filter-dot",
                            style: normalizeStyle({ backgroundColor: tag.color }),
                            "aria-hidden": "true"
                          }, null, 4)) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(tag.name) + " ", 1),
                          createBaseVNode("span", _hoisted_17$1, toDisplayString(tag.count), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["model-value", "onUpdate:modelValue"]);
                  }), 128))
                ])) : (openBlock(), createElementBlock("p", _hoisted_18$1, toDisplayString(unref(translate)("shortlinks", "No tags yet")), 1)),
                __props.tags.length ? (openBlock(), createElementBlock("fieldset", _hoisted_19$1, [
                  createBaseVNode("legend", null, toDisplayString(unref(translate)("shortlinks", "Tag matching")), 1),
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: localTagMode.value,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => localTagMode.value = $event),
                    type: "radio",
                    value: "and",
                    name: "tag-mode"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "All selected tags")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  createVNode(unref(NcCheckboxRadioSwitch), {
                    modelValue: localTagMode.value,
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => localTagMode.value = $event),
                    type: "radio",
                    value: "or",
                    name: "tag-mode"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Any selected tag")), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ])) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_20$1, [
                  createVNode(unref(NcButton), {
                    type: "button",
                    onClick: clearTags
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Reset")), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NcButton), {
                    type: "submit",
                    variant: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(translate)("shortlinks", "Apply filters")), 1)
                    ]),
                    _: 1
                  })
                ])
              ], 32)
            ]),
            _: 1
          }, 8, ["shown"])
        ])) : createCommentVNode("", true)
      ], 8, _hoisted_1$9);
    };
  }
});
const ContentToolbar = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-36b75d1d"]]);
const _hoisted_1$8 = ["aria-label"];
const _hoisted_2$7 = ["aria-label"];
const _hoisted_3$3 = { class: "bulk-actions-bar__primary" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "BulkActionsBar",
  props: {
    count: {},
    system: {}
  },
  emits: ["clear", "favorite", "tags", "destination", "qr", "export", "delete", "restore"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "bulk-actions-bar",
        role: "toolbar",
        "aria-label": unref(translate)("shortlinks", "Bulk actions")
      }, [
        createBaseVNode("input", {
          type: "checkbox",
          checked: "",
          indeterminate: true,
          "aria-label": unref(translate)("shortlinks", "Clear selection"),
          onChange: _cache[0] || (_cache[0] = ($event) => emit2("clear"))
        }, null, 40, _hoisted_2$7),
        createBaseVNode("strong", null, toDisplayString(unref(translate)("shortlinks", "{count} selected", { count: __props.count })), 1),
        createBaseVNode("div", _hoisted_3$3, [
          createVNode(unref(NcButton), {
            variant: "tertiary",
            onClick: _cache[1] || (_cache[1] = ($event) => emit2("favorite"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiStar) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Set as favorite")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "tertiary",
            onClick: _cache[2] || (_cache[2] = ($event) => emit2("tags"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagMultipleOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Manage tags")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "tertiary",
            onClick: _cache[3] || (_cache[3] = ($event) => emit2("destination"))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderMoveOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Move or copy")), 1)
            ]),
            _: 1
          })
        ]),
        createVNode(unref(NcActions), {
          "force-menu": "",
          "force-name": "",
          "menu-name": unref(translate)("shortlinks", "Actions"),
          "aria-label": unref(translate)("shortlinks", "More bulk actions")
        }, {
          icon: withCtx(() => [
            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDotsHorizontal) }, null, 8, ["path"])
          ]),
          default: withCtx(() => [
            createVNode(unref(NcActionButton), {
              name: unref(translate)("shortlinks", "Download QR codes"),
              onClick: _cache[4] || (_cache[4] = ($event) => emit2("qr"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiQrcode) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"]),
            createVNode(unref(NcActionButton), {
              name: unref(translate)("shortlinks", "Export CSV"),
              onClick: _cache[5] || (_cache[5] = ($event) => emit2("export", "csv"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiExportVariant) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"]),
            createVNode(unref(NcActionButton), {
              name: unref(translate)("shortlinks", "Export JSON"),
              onClick: _cache[6] || (_cache[6] = ($event) => emit2("export", "json"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiExportVariant) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"]),
            __props.system === "trash" ? (openBlock(), createBlock(unref(NcActionButton), {
              key: 0,
              name: unref(translate)("shortlinks", "Restore"),
              onClick: _cache[7] || (_cache[7] = ($event) => emit2("restore"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiRestore) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"])) : (openBlock(), createBlock(unref(NcActionButton), {
              key: 1,
              name: unref(translate)("shortlinks", "Delete"),
              onClick: _cache[8] || (_cache[8] = ($event) => emit2("delete"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"]))
          ]),
          _: 1
        }, 8, ["menu-name", "aria-label"])
      ], 8, _hoisted_1$8);
    };
  }
});
const BulkActionsBar = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-4d7d3613"]]);
const folderIconOptions = [
  { id: "folder", label: "Folder", path: mdiFolderOutline },
  { id: "work", label: "Work", path: mdiBriefcaseOutline },
  { id: "personal", label: "Personal", path: mdiHomeOutline },
  { id: "projects", label: "Projects", path: mdiRocketLaunchOutline },
  { id: "archive", label: "Archive", path: mdiArchiveOutline },
  { id: "star", label: "Starred", path: mdiFolderStarOutline }
];
function folderIconPath(icon) {
  return folderIconOptions.find((option) => option.id === icon)?.path ?? mdiFolderOutline;
}
const _hoisted_1$7 = ["aria-label"];
const _hoisted_2$6 = ["draggable", "onDragstart", "onDragover", "onDrop"];
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "FolderTreeList",
  props: {
    folders: {},
    mode: { default: "manage" },
    selectedId: { default: null },
    allowRoot: { type: Boolean, default: false },
    rootLabel: { default: "" }
  },
  emits: ["select", "edit", "delete", "changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const dragged = ref(null);
    const dropTarget = ref(null);
    let nestTimer;
    const ordered = computed(() => {
      const result = [];
      const visited = /* @__PURE__ */ new Set();
      function append(parentId, depth) {
        props.folders.filter((folder) => folder.parentId === parentId).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).forEach((folder) => {
          if (visited.has(folder.id)) return;
          visited.add(folder.id);
          result.push({ folder, depth });
          append(folder.id, depth + 1);
        });
      }
      append(null, 0);
      return result;
    });
    onBeforeUnmount(clearNestTimer);
    function siblings(folder) {
      return props.folders.filter((item) => item.parentId === folder.parentId).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
    }
    function linkCountLabel(count) {
      return count === 1 ? translate("shortlinks", "{count} link", { count }) : translate("shortlinks", "{count} links", { count });
    }
    function activate(folder) {
      props.mode === "select" ? emit2("select", folder.id) : emit2("edit", folder);
    }
    async function move(folder, offset) {
      const current = siblings(folder);
      const index = current.findIndex((item) => item.id === folder.id);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= current.length) return;
      const ids = current.map((item) => item.id);
      const [moved] = ids.splice(index, 1);
      if (moved === void 0) return;
      ids.splice(target, 0, moved);
      await persistOrder(folder.parentId, ids);
    }
    function dragStart(folder, event) {
      if (props.mode !== "manage") return;
      dragged.value = folder;
      event.dataTransfer?.setData("text/plain", String(folder.id));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    }
    function dragOver(folder, event) {
      const source = dragged.value;
      if (props.mode !== "manage" || !source || source.id === folder.id || isDescendant(folder.id, source.id)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0.5;
      if (ratio < 0.28) {
        clearNestTimer();
        dropTarget.value = { id: folder.id, intent: "before" };
      } else if (ratio > 0.72) {
        clearNestTimer();
        dropTarget.value = { id: folder.id, intent: "after" };
      } else if (dropTarget.value?.id !== folder.id || dropTarget.value.intent !== "inside") {
        if (dropTarget.value?.id !== folder.id) {
          dropTarget.value = { id: folder.id, intent: "after" };
          clearNestTimer();
          nestTimer = setTimeout(() => {
            dropTarget.value = { id: folder.id, intent: "inside" };
          }, 550);
        }
      }
    }
    async function drop(folder, event) {
      event.preventDefault();
      clearNestTimer();
      const source = dragged.value;
      const target = dropTarget.value;
      dragged.value = null;
      dropTarget.value = null;
      if (!source || !target || target.id !== folder.id || source.id === folder.id || isDescendant(folder.id, source.id)) return;
      try {
        if (target.intent === "inside") {
          await api.updateFolder(source.id, { parentId: folder.id });
          const ids = props.folders.filter((item) => item.parentId === folder.id && item.id !== source.id).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).map((item) => item.id);
          ids.push(source.id);
          await api.reorderFolders(folder.id, ids);
        } else {
          const parentId = folder.parentId;
          if (source.parentId !== parentId) await api.updateFolder(source.id, { parentId });
          const ids = props.folders.filter((item) => item.parentId === parentId && item.id !== source.id).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).map((item) => item.id);
          const targetIndex = Math.max(0, ids.indexOf(folder.id));
          ids.splice(targetIndex + (target.intent === "after" ? 1 : 0), 0, source.id);
          await api.reorderFolders(parentId, ids);
        }
        emit2("changed");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function dragEnd() {
      clearNestTimer();
      dragged.value = null;
      dropTarget.value = null;
    }
    function clearNestTimer() {
      if (nestTimer) clearTimeout(nestTimer);
      nestTimer = void 0;
    }
    function isDescendant(candidateId, ancestorId) {
      let current = props.folders.find((folder) => folder.id === candidateId);
      const seen = /* @__PURE__ */ new Set();
      while (current?.parentId !== null && current?.parentId !== void 0 && !seen.has(current.id)) {
        if (current.parentId === ancestorId) return true;
        seen.add(current.id);
        current = props.folders.find((folder) => folder.id === current?.parentId);
      }
      return false;
    }
    function ghostBefore(folder) {
      return dropTarget.value?.id === folder.id && dropTarget.value.intent === "before";
    }
    function ghostAfter(folder) {
      return dropTarget.value?.id === folder.id && dropTarget.value.intent !== "before";
    }
    function ghostDepth(entry) {
      return dropTarget.value?.intent === "inside" ? entry.depth + 1 : entry.depth;
    }
    async function persistOrder(parentId, ids) {
      try {
        await api.reorderFolders(parentId, ids);
        emit2("changed");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ul", {
        class: "folder-tree-list",
        "aria-label": unref(translate)("shortlinks", "Folders")
      }, [
        __props.allowRoot ? (openBlock(), createElementBlock("li", {
          key: 0,
          class: normalizeClass(["folder-tree-list__item folder-tree-list__root", { "is-selected": __props.selectedId === null }])
        }, [
          createVNode(unref(NcListItem), {
            name: __props.rootLabel || unref(translate)("shortlinks", "No folder"),
            onClick: _cache[0] || (_cache[0] = ($event) => emit2("select", null))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"])
        ], 2)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(ordered.value, (entry) => {
          return openBlock(), createElementBlock(Fragment, {
            key: entry.folder.id
          }, [
            ghostBefore(entry.folder) ? (openBlock(), createElementBlock("li", {
              key: 0,
              class: "folder-tree-list__ghost",
              style: normalizeStyle({ "--folder-depth": ghostDepth(entry) })
            }, [
              _cache[1] || (_cache[1] = createBaseVNode("span", null, null, -1)),
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Move here")), 1)
            ], 4)) : createCommentVNode("", true),
            createBaseVNode("li", {
              class: normalizeClass(["folder-tree-list__item", { "is-selected": __props.selectedId === entry.folder.id, "is-dragging": dragged.value?.id === entry.folder.id }]),
              style: normalizeStyle({ "--folder-depth": entry.depth }),
              draggable: __props.mode === "manage",
              onDragstart: ($event) => dragStart(entry.folder, $event),
              onDragover: ($event) => dragOver(entry.folder, $event),
              onDrop: ($event) => drop(entry.folder, $event),
              onDragend: dragEnd
            }, [
              createVNode(unref(NcListItem), {
                name: entry.folder.name,
                details: linkCountLabel(entry.folder.count),
                "actions-aria-label": unref(translate)("shortlinks", "Folder actions for {name}", { name: entry.folder.name }),
                onClick: ($event) => activate(entry.folder)
              }, createSlots({
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), {
                    path: unref(folderIconPath)(entry.folder.icon)
                  }, null, 8, ["path"])
                ]),
                _: 2
              }, [
                __props.mode === "manage" ? {
                  name: "actions",
                  fn: withCtx(() => [
                    createVNode(unref(NcActionButton), {
                      name: unref(translate)("shortlinks", "Move up"),
                      disabled: siblings(entry.folder)[0]?.id === entry.folder.id,
                      onClick: ($event) => move(entry.folder, -1)
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), { path: unref(mdiArrowUp) }, null, 8, ["path"])
                      ]),
                      _: 1
                    }, 8, ["name", "disabled", "onClick"]),
                    createVNode(unref(NcActionButton), {
                      name: unref(translate)("shortlinks", "Move down"),
                      disabled: siblings(entry.folder).at(-1)?.id === entry.folder.id,
                      onClick: ($event) => move(entry.folder, 1)
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), { path: unref(mdiArrowDown) }, null, 8, ["path"])
                      ]),
                      _: 1
                    }, 8, ["name", "disabled", "onClick"]),
                    createVNode(unref(NcActionButton), {
                      name: unref(translate)("shortlinks", "Edit"),
                      onClick: ($event) => emit2("edit", entry.folder)
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPencilOutline) }, null, 8, ["path"])
                      ]),
                      _: 1
                    }, 8, ["name", "onClick"]),
                    createVNode(unref(NcActionButton), {
                      name: unref(translate)("shortlinks", "Delete"),
                      onClick: ($event) => emit2("delete", entry.folder)
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                      ]),
                      _: 1
                    }, 8, ["name", "onClick"])
                  ]),
                  key: "0"
                } : void 0
              ]), 1032, ["name", "details", "actions-aria-label", "onClick"])
            ], 46, _hoisted_2$6),
            ghostAfter(entry.folder) ? (openBlock(), createElementBlock("li", {
              key: 1,
              class: "folder-tree-list__ghost",
              style: normalizeStyle({ "--folder-depth": ghostDepth(entry) })
            }, [
              _cache[2] || (_cache[2] = createBaseVNode("span", null, null, -1)),
              createBaseVNode("span", null, toDisplayString(dropTarget.value?.intent === "inside" ? unref(translate)("shortlinks", "Move into folder") : unref(translate)("shortlinks", "Move here")), 1)
            ], 4)) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 8, _hoisted_1$7);
    };
  }
});
const FolderTreeList = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-f4ad727a"]]);
const _hoisted_1$6 = { class: "bulk-destination" };
const _hoisted_2$5 = { class: "folder-picker" };
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BulkDestinationDialog",
  props: {
    folders: {},
    count: {}
  },
  emits: ["close", "apply"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const folderId = ref(null);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: unref(translate)("shortlinks", "Move or copy {count} links", { count: __props.count }),
        size: "normal",
        onClosing: _cache[4] || (_cache[4] = ($event) => emit2("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[1] || (_cache[1] = ($event) => emit2("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "primary",
            onClick: _cache[2] || (_cache[2] = ($event) => emit2("apply", { mode: "move", folderId: folderId.value }))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderMoveOutline) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Move")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "primary",
            onClick: _cache[3] || (_cache[3] = ($event) => emit2("apply", { mode: "copy", folderId: folderId.value }))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
            ]),
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Copy")), 1)
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$6, [
            createBaseVNode("p", null, toDisplayString(unref(translate)("shortlinks", "Choose a destination, then move the selected links or create independent copies.")), 1),
            createBaseVNode("div", _hoisted_2$5, [
              createVNode(FolderTreeList, {
                folders: __props.folders,
                mode: "select",
                "allow-root": "",
                "selected-id": folderId.value,
                "root-label": unref(translate)("shortlinks", "No folder"),
                onSelect: _cache[0] || (_cache[0] = ($event) => folderId.value = $event)
              }, null, 8, ["folders", "selected-id", "root-label"])
            ])
          ])
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const BulkDestinationDialog = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-8939af24"]]);
const _hoisted_1$5 = ["aria-label"];
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "TagList",
  props: {
    tags: {},
    mode: { default: "manage" },
    selectedIds: { default: () => [] }
  },
  emits: ["toggle", "edit", "merge", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    function linkCountLabel(count) {
      return count === 1 ? translate("shortlinks", "{count} link", { count }) : translate("shortlinks", "{count} links", { count });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ul", {
        class: "tag-list",
        "aria-label": unref(translate)("shortlinks", "Tags")
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
          return openBlock(), createElementBlock("li", {
            key: tag.id,
            class: normalizeClass({ "is-selected": __props.selectedIds.includes(tag.id) })
          }, [
            createVNode(unref(NcListItem), {
              name: tag.name,
              details: linkCountLabel(tag.count),
              "actions-aria-label": unref(translate)("shortlinks", "Tag actions for {name}", { name: tag.name }),
              onClick: ($event) => __props.mode === "select" ? emit2("toggle", tag) : emit2("edit", tag)
            }, createSlots({
              icon: withCtx(() => [
                createBaseVNode("span", {
                  class: "tag-list__icon",
                  style: normalizeStyle({ color: tag.color || "var(--color-primary-element)" })
                }, [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagOutline) }, null, 8, ["path"])
                ], 4)
              ]),
              _: 2
            }, [
              __props.mode === "manage" ? {
                name: "actions",
                fn: withCtx(() => [
                  createVNode(unref(NcActionButton), {
                    name: unref(translate)("shortlinks", "Edit"),
                    onClick: ($event) => emit2("edit", tag)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiPencilOutline) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["name", "onClick"]),
                  props.tags.length > 1 ? (openBlock(), createBlock(unref(NcActionButton), {
                    key: 0,
                    name: unref(translate)("shortlinks", "Merge"),
                    onClick: ($event) => emit2("merge", tag)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiMerge) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["name", "onClick"])) : createCommentVNode("", true),
                  createVNode(unref(NcActionButton), {
                    name: unref(translate)("shortlinks", "Delete"),
                    onClick: ($event) => emit2("delete", tag)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["name", "onClick"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["name", "details", "actions-aria-label", "onClick"])
          ], 2);
        }), 128))
      ], 8, _hoisted_1$5);
    };
  }
});
const TagList = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-000a82a7"]]);
const _hoisted_1$4 = { class: "bulk-tags" };
const _hoisted_2$4 = { class: "operation" };
const _hoisted_3$2 = { class: "tag-picker" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "BulkTagDialog",
  props: {
    tags: {},
    count: {}
  },
  emits: ["close", "apply"],
  setup(__props, { emit: __emit }) {
    const emit2 = __emit;
    const operation = ref("add");
    const selectedIds = ref([]);
    function toggle(tag) {
      selectedIds.value = selectedIds.value.includes(tag.id) ? selectedIds.value.filter((id) => id !== tag.id) : [...selectedIds.value, tag.id];
    }
    function apply() {
      emit2("apply", operation.value === "add" ? { addTagIds: selectedIds.value } : { removeTagIds: selectedIds.value });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcDialog), {
        name: unref(translate)("shortlinks", "Manage tags for {count} links", { count: __props.count }),
        size: "normal",
        onClosing: _cache[3] || (_cache[3] = ($event) => emit2("close"))
      }, {
        actions: withCtx(() => [
          createVNode(unref(NcButton), {
            onClick: _cache[2] || (_cache[2] = ($event) => emit2("close"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Cancel")), 1)
            ]),
            _: 1
          }),
          createVNode(unref(NcButton), {
            variant: "primary",
            disabled: selectedIds.value.length === 0,
            onClick: apply
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(operation.value === "add" ? unref(translate)("shortlinks", "Add") : unref(translate)("shortlinks", "Remove")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$4, [
            createBaseVNode("div", _hoisted_2$4, [
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: operation.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => operation.value = $event),
                type: "radio",
                value: "add",
                name: "tag-operation"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Add tags")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"]),
              createVNode(unref(NcCheckboxRadioSwitch), {
                modelValue: operation.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => operation.value = $event),
                type: "radio",
                value: "remove",
                name: "tag-operation"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(translate)("shortlinks", "Remove tags")), 1)
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            createBaseVNode("div", _hoisted_3$2, [
              createVNode(TagList, {
                tags: __props.tags,
                mode: "select",
                "selected-ids": selectedIds.value,
                onToggle: toggle
              }, null, 8, ["tags", "selected-ids"])
            ])
          ])
        ]),
        _: 1
      }, 8, ["name"]);
    };
  }
});
const BulkTagDialog = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-da79e6c3"]]);
const _hoisted_1$3 = ["src", "alt"];
const _hoisted_2$3 = ["aria-label"];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "LinkThumbnail",
  props: {
    src: { default: "" },
    alt: { default: "" },
    size: { default: "normal" }
  },
  setup(__props) {
    const props = __props;
    const failed = ref(!props.src);
    watch(() => props.src, (value) => {
      failed.value = !value;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["link-thumbnail", `link-thumbnail--${__props.size}`])
      }, [
        __props.src && !failed.value ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: __props.src,
          alt: __props.alt,
          loading: "lazy",
          onError: _cache[0] || (_cache[0] = ($event) => failed.value = true)
        }, null, 40, _hoisted_1$3)) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: "link-thumbnail__fallback",
          "aria-label": unref(translate)("shortlinks", "Shortlinks icon"),
          role: "img"
        }, [
          createVNode(unref(NcIconSvgWrapper), {
            path: unref(mdiLinkVariant),
            size: __props.size === "large" ? 44 : __props.size === "small" ? 22 : 32,
            "aria-hidden": "true"
          }, null, 8, ["path", "size"])
        ], 8, _hoisted_2$3))
      ], 2);
    };
  }
});
const LinkThumbnail = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-15eb9e88"]]);
const _hoisted_1$2 = ["checked", "disabled", "aria-label"];
const _hoisted_2$2 = {
  key: 2,
  class: "compact-link-card__media",
  "aria-hidden": "true"
};
const _hoisted_3$1 = ["src"];
const _hoisted_4$1 = ["src"];
const _hoisted_5$1 = ["aria-label"];
const _hoisted_6$1 = { class: "compact-link-card__identity" };
const _hoisted_7$1 = ["title"];
const _hoisted_8$1 = { class: "compact-link-card__lower" };
const _hoisted_9$1 = { class: "compact-link-card__meta" };
const _hoisted_10$1 = { key: 0 };
const _hoisted_11$1 = { key: 1 };
const _hoisted_12$1 = { key: 2 };
const _hoisted_13$1 = { key: 3 };
const _hoisted_14$1 = { class: "created-label" };
const _hoisted_15$1 = ["aria-label"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CompactLinkCard",
  props: {
    link: {},
    folder: { default: void 0 },
    selectable: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    showThumbnail: { type: Boolean, default: true }
  },
  emits: ["open", "toggle"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const createdRelative = computed(() => relativeTime(props.link.createdAt));
    const shortUrlLabel = computed(() => `.../${props.link.slug}`);
    const startsRelative = computed(() => props.link.startsAt === null ? "" : relativeTime(props.link.startsAt));
    const expiresRelative = computed(() => props.link.expiresAt === null ? "" : relativeTime(props.link.expiresAt));
    function relativeTime(timestamp) {
      const seconds = timestamp - Math.floor(Date.now() / 1e3);
      const absolute = Math.abs(seconds);
      const formatter = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
      if (absolute < 60) return formatter.format(seconds, "second");
      if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
      if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
      if (absolute < 30 * 86400) return formatter.format(Math.round(seconds / 86400), "day");
      if (absolute < 365 * 86400) return formatter.format(Math.round(seconds / (30 * 86400)), "month");
      return formatter.format(Math.round(seconds / (365 * 86400)), "year");
    }
    async function copyLink() {
      try {
        await navigator.clipboard.writeText(props.link.shortUrl);
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    async function copyQr() {
      try {
        const response = await fetch(api.qrUrl(props.link.id, "svg"), { credentials: "same-origin", headers: { Accept: "image/svg+xml" } });
        if (!response.ok) throw new Error(translate("shortlinks", "Could not load QR code"));
        const svg = await response.text();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/svg+xml": blob })]);
          } catch {
            await navigator.clipboard.writeText(svg);
          }
        } else await navigator.clipboard.writeText(svg);
        showSuccess(translate("shortlinks", "QR code copied as SVG"));
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", {
        class: normalizeClass(["compact-link-card", { "is-selected": __props.selected, "is-selectable": __props.selectable, "has-media": Boolean(__props.link.mediaUrl) }]),
        style: normalizeStyle({ "--link-accent": __props.link.color || "var(--color-primary-element)" })
      }, [
        __props.selectable ? (openBlock(), createElementBlock("input", {
          key: 0,
          type: "checkbox",
          class: "compact-link-card__checkbox",
          checked: __props.selected,
          disabled: !__props.link.canEdit,
          "aria-label": unref(translate)("shortlinks", "Select {title}", { title: __props.link.title || __props.link.slug }),
          onClick: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["stop"])),
          onChange: _cache[1] || (_cache[1] = ($event) => emit2("toggle", __props.link.id))
        }, null, 40, _hoisted_1$2)) : createCommentVNode("", true),
        __props.link.favorite ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
          key: 1,
          class: "compact-link-card__favorite",
          path: unref(mdiStar),
          size: 20,
          "aria-label": unref(translate)("shortlinks", "Favorite")
        }, null, 8, ["path", "aria-label"])) : createCommentVNode("", true),
        __props.link.mediaUrl ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
          __props.link.mediaMime?.startsWith("video/") ? (openBlock(), createElementBlock("video", {
            key: 0,
            src: __props.link.mediaUrl,
            muted: "",
            loop: "",
            autoplay: "",
            playsinline: "",
            preload: "metadata"
          }, null, 8, _hoisted_3$1)) : (openBlock(), createElementBlock("img", {
            key: 1,
            src: __props.link.mediaUrl,
            alt: ""
          }, null, 8, _hoisted_4$1))
        ])) : createCommentVNode("", true),
        createBaseVNode("button", {
          type: "button",
          class: "compact-link-card__main",
          "aria-label": unref(translate)("shortlinks", "Open details for {title}", { title: __props.link.title || __props.link.slug }),
          onClick: _cache[2] || (_cache[2] = ($event) => emit2("open", __props.link))
        }, [
          __props.showThumbnail ? (openBlock(), createBlock(LinkThumbnail, {
            key: 0,
            size: "normal",
            src: __props.link.thumbnailMediaUrl || (__props.link.thumbnailUrl ? unref(api).thumbnailUrl(__props.link.id) : ""),
            alt: unref(translate)("shortlinks", "Share thumbnail for {title}", { title: __props.link.title || __props.link.slug })
          }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
          createBaseVNode("span", _hoisted_6$1, [
            createBaseVNode("strong", null, toDisplayString(__props.link.title || __props.link.slug), 1),
            createBaseVNode("span", {
              class: "compact-link-card__url",
              title: __props.link.shortUrl
            }, toDisplayString(shortUrlLabel.value), 9, _hoisted_7$1)
          ])
        ], 8, _hoisted_5$1),
        createBaseVNode("div", _hoisted_8$1, [
          createBaseVNode("div", _hoisted_9$1, [
            createBaseVNode("span", null, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiCursorDefaultClickOutline),
                size: 16,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(__props.link.clickCount) + " " + toDisplayString(unref(translate)("shortlinks", "visits")), 1)
            ]),
            __props.folder ? (openBlock(), createElementBlock("span", _hoisted_10$1, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(folderIconPath)(__props.folder.icon),
                size: 16,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(__props.folder.name), 1)
            ])) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.link.tags, (tag) => {
              return openBlock(), createElementBlock("span", {
                key: tag.id,
                class: "tag-chip"
              }, [
                createBaseVNode("i", {
                  style: normalizeStyle({ backgroundColor: tag.color || "var(--color-primary-element)" })
                }, null, 4),
                createTextVNode(toDisplayString(tag.name), 1)
              ]);
            }), 128)),
            __props.link.passwordProtected ? (openBlock(), createElementBlock("span", _hoisted_11$1, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiLockOutline),
                size: 16,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Password")), 1)
            ])) : createCommentVNode("", true),
            __props.link.startsAt ? (openBlock(), createElementBlock("span", _hoisted_12$1, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiCalendarClockOutline),
                size: 16,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Available {time}", { time: startsRelative.value })), 1)
            ])) : createCommentVNode("", true),
            __props.link.expiresAt ? (openBlock(), createElementBlock("span", _hoisted_13$1, [
              createVNode(unref(NcIconSvgWrapper), {
                path: unref(mdiCalendarEndOutline),
                size: 16,
                "aria-hidden": "true"
              }, null, 8, ["path"]),
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Expires {time}", { time: expiresRelative.value })), 1)
            ])) : createCommentVNode("", true),
            createBaseVNode("span", _hoisted_14$1, toDisplayString(unref(translate)("shortlinks", "Created {time}", { time: createdRelative.value })), 1)
          ]),
          createBaseVNode("div", {
            class: "compact-link-card__actions",
            role: "toolbar",
            "aria-label": unref(translate)("shortlinks", "Actions for {title}", { title: __props.link.title || __props.link.slug })
          }, [
            createVNode(unref(NcButton), {
              size: "small",
              variant: "primary",
              onClick: _cache[3] || (_cache[3] = ($event) => emit2("open", __props.link))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiInformationOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Details")), 1)
              ]),
              _: 1
            }),
            createVNode(unref(NcButton), {
              size: "small",
              variant: "secondary",
              "aria-label": unref(translate)("shortlinks", "Copy link"),
              title: unref(translate)("shortlinks", "Copy link"),
              onClick: copyLink
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["aria-label", "title"]),
            createVNode(unref(NcButton), {
              size: "small",
              variant: "secondary",
              "aria-label": unref(translate)("shortlinks", "Copy QR code as SVG"),
              title: unref(translate)("shortlinks", "Copy QR code as SVG"),
              onClick: copyQr
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiQrcode) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["aria-label", "title"])
          ], 8, _hoisted_15$1)
        ])
      ], 6);
    };
  }
});
const CompactLinkCard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-0de25bff"]]);
const _hoisted_1$1 = ["aria-label"];
const _hoisted_2$1 = {
  key: 0,
  class: "grid-sort-controls"
};
const _hoisted_3 = ["checked", "indeterminate", "aria-label"];
const _hoisted_4 = {
  key: 1,
  class: "list-view-controls__spacer"
};
const _hoisted_5 = ["aria-label"];
const _hoisted_6 = {
  key: 1,
  class: "error",
  role: "alert"
};
const _hoisted_7 = {
  key: 3,
  class: "table-scroll"
};
const _hoisted_8 = { key: 0 };
const _hoisted_9 = ["checked", "indeterminate", "aria-label"];
const _hoisted_10 = ["aria-sort"];
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = ["aria-sort"];
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["aria-sort"];
const _hoisted_15 = ["aria-label"];
const _hoisted_16 = ["aria-sort"];
const _hoisted_17 = ["aria-label"];
const _hoisted_18 = ["checked", "disabled", "aria-label", "onChange"];
const _hoisted_19 = ["onClick"];
const _hoisted_20 = ["onClick"];
const _hoisted_21 = ["href"];
const _hoisted_22 = { class: "row-actions" };
const _hoisted_23 = {
  key: 4,
  class: "link-card-grid"
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LinkList",
  props: {
    links: {},
    folders: {},
    tags: {},
    loading: { type: Boolean },
    error: {},
    selected: {},
    hasMore: { type: Boolean },
    system: {},
    sort: {},
    direction: {},
    useThumbnails: { type: Boolean, default: true }
  },
  emits: ["create", "open", "toggle", "selectAll", "refresh", "bulk", "more", "options"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const storedMode = window.localStorage?.getItem("shortlinks-view-mode");
    const viewMode = ref(storedMode === "grid" ? "grid" : "table");
    const showDestination = ref(false);
    const showTags = ref(false);
    const editableIds = computed(() => props.links.filter((link) => link.canEdit).map((link) => link.id));
    const allSelected = computed(() => editableIds.value.length > 0 && editableIds.value.every((id) => props.selected.has(id)));
    const someSelected = computed(() => props.selected.size > 0 && !allSelected.value);
    const selectedIds = computed(() => [...props.selected]);
    async function copy(text) {
      try {
        await navigator.clipboard.writeText(text);
        showSuccess(translate("shortlinks", "Copied"));
      } catch {
        showError(translate("shortlinks", "Could not copy"));
      }
    }
    async function remove(link) {
      try {
        await api.deleteLink(link.id);
        emit2("refresh");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function restore(link) {
      try {
        await api.restoreLink(link.id);
        emit2("refresh");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function removePermanently(link) {
      if (!window.confirm(translate("shortlinks", "Permanently delete this link?"))) return;
      try {
        await api.deleteLink(link.id, true);
        emit2("refresh");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function clone(link) {
      try {
        await api.cloneLink(link.id);
        showSuccess(translate("shortlinks", "Link duplicated"));
        emit2("refresh");
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function setViewMode(mode) {
      viewMode.value = mode;
      window.localStorage?.setItem("shortlinks-view-mode", mode);
    }
    function toggleAll() {
      emit2("selectAll", allSelected.value || someSelected.value ? [] : editableIds.value);
    }
    function clearSelection() {
      emit2("selectAll", []);
    }
    function setSort(field) {
      if (props.sort === field) {
        emit2("options", { direction: props.direction === "ASC" ? "DESC" : "ASC" });
        return;
      }
      const descendingByDefault = ["click_count", "created_at", "updated_at", "last_clicked_at"].includes(field);
      emit2("options", { sort: field, direction: descendingByDefault ? "DESC" : "ASC" });
    }
    function sortIcon(field) {
      if (props.sort !== field) return mdiSwapVertical;
      return props.direction === "ASC" ? mdiArrowUp : mdiArrowDown;
    }
    function ariaSort(field) {
      if (props.sort !== field) return "none";
      return props.direction === "ASC" ? "ascending" : "descending";
    }
    function formatTimestamp(timestamp) {
      if (timestamp === null) return "—";
      return new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(new Date(timestamp * 1e3));
    }
    function visibleDateField() {
      if (props.sort === "created_at" || props.sort === "last_clicked_at") return props.sort;
      return "updated_at";
    }
    function visibleDateLabel() {
      if (visibleDateField() === "created_at") return translate("shortlinks", "Created");
      if (visibleDateField() === "last_clicked_at") return translate("shortlinks", "Last used");
      return translate("shortlinks", "Updated");
    }
    function visibleTimestamp(link) {
      if (visibleDateField() === "created_at") return link.createdAt;
      if (visibleDateField() === "last_clicked_at") return link.lastClickedAt;
      return link.updatedAt;
    }
    function folderFor(link) {
      return props.folders.find((folder) => folder.id === link.folderId);
    }
    function applyBulk(changes) {
      emit2("bulk", changes);
      showDestination.value = false;
      showTags.value = false;
    }
    function applyDestination(value) {
      applyBulk(value.mode === "copy" ? { action: "copy", folderId: value.folderId } : { folderId: value.folderId });
    }
    function downloadQrCodes() {
      const anchor = document.createElement("a");
      anchor.href = api.bulkQrUrl(selectedIds.value);
      anchor.download = "shortlinks-qr-codes.zip";
      anchor.click();
    }
    async function exportSelection(format) {
      try {
        const result = await api.exportLinks(format, { linkIds: selectedIds.value });
        const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = result.filename;
        anchor.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: "links-view",
        "aria-label": unref(translate)("shortlinks", "Short links")
      }, [
        createBaseVNode("div", {
          class: normalizeClass(["list-view-controls", { "has-selection": __props.selected.size }])
        }, [
          __props.selected.size ? (openBlock(), createBlock(BulkActionsBar, {
            key: 0,
            count: __props.selected.size,
            system: __props.system,
            onClear: clearSelection,
            onFavorite: _cache[0] || (_cache[0] = ($event) => applyBulk({ favorite: true })),
            onTags: _cache[1] || (_cache[1] = ($event) => showTags.value = true),
            onDestination: _cache[2] || (_cache[2] = ($event) => showDestination.value = true),
            onQr: downloadQrCodes,
            onExport: exportSelection,
            onDelete: _cache[3] || (_cache[3] = ($event) => applyBulk({ action: "trash" })),
            onRestore: _cache[4] || (_cache[4] = ($event) => applyBulk({ action: "restore" }))
          }, null, 8, ["count", "system"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            viewMode.value === "grid" ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
              createBaseVNode("input", {
                type: "checkbox",
                checked: allSelected.value,
                indeterminate: someSelected.value,
                "aria-label": unref(translate)("shortlinks", "Select all"),
                onChange: toggleAll
              }, null, 40, _hoisted_3),
              createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Sort by")), 1),
              (openBlock(), createElementBlock(Fragment, null, renderList([{ id: "title", label: "Title" }, { id: "slug", label: "Alias" }, { id: "click_count", label: "Clicks" }, { id: "updated_at", label: "Updated" }], (option) => {
                return createVNode(unref(NcButton), {
                  key: option.id,
                  variant: "tertiary",
                  pressed: __props.sort === option.id,
                  onClick: ($event) => setSort(option.id)
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(NcIconSvgWrapper), {
                      path: sortIcon(option.id)
                    }, null, 8, ["path"])
                  ]),
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(translate)("shortlinks", option.label)), 1)
                  ]),
                  _: 2
                }, 1032, ["pressed", "onClick"]);
              }), 64))
            ])) : (openBlock(), createElementBlock("span", _hoisted_4)),
            createBaseVNode("div", {
              class: "view-mode-switch",
              role: "group",
              "aria-label": unref(translate)("shortlinks", "View")
            }, [
              createVNode(unref(NcButton), {
                variant: "tertiary",
                pressed: viewMode.value === "table",
                "aria-label": unref(translate)("shortlinks", "Table view"),
                title: unref(translate)("shortlinks", "Table view"),
                onClick: _cache[5] || (_cache[5] = ($event) => setViewMode("table"))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewListOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["pressed", "aria-label", "title"]),
              createVNode(unref(NcButton), {
                variant: "tertiary",
                pressed: viewMode.value === "grid",
                "aria-label": unref(translate)("shortlinks", "Card view"),
                title: unref(translate)("shortlinks", "Card view"),
                onClick: _cache[6] || (_cache[6] = ($event) => setViewMode("grid"))
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewGridOutline) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["pressed", "aria-label", "title"])
            ], 8, _hoisted_5)
          ], 64))
        ], 2),
        __props.loading ? (openBlock(), createBlock(unref(NcLoadingIcon), {
          key: 0,
          size: 48,
          name: unref(translate)("shortlinks", "Loading links")
        }, null, 8, ["name"])) : __props.error ? (openBlock(), createElementBlock("p", _hoisted_6, [
          createTextVNode(toDisplayString(__props.error) + " ", 1),
          createVNode(unref(NcButton), {
            onClick: _cache[7] || (_cache[7] = ($event) => emit2("refresh"))
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(unref(translate)("shortlinks", "Retry")), 1)
            ]),
            _: 1
          })
        ])) : __props.links.length === 0 ? (openBlock(), createBlock(unref(NcEmptyContent), {
          key: 2,
          name: unref(translate)("shortlinks", "No short links yet"),
          description: unref(translate)("shortlinks", "Create your first short link to get started.")
        }, {
          action: withCtx(() => [
            createVNode(unref(NcButton), {
              variant: "primary",
              onClick: _cache[8] || (_cache[8] = ($event) => emit2("create"))
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(translate)("shortlinks", "Create short link")), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["name", "description"])) : viewMode.value === "table" ? (openBlock(), createElementBlock("div", _hoisted_7, [
          createBaseVNode("table", null, [
            _cache[18] || (_cache[18] = createBaseVNode("colgroup", null, [
              createBaseVNode("col", { class: "select-column" }),
              createBaseVNode("col", { class: "title-column" }),
              createBaseVNode("col"),
              createBaseVNode("col", { class: "target-column" }),
              createBaseVNode("col"),
              createBaseVNode("col"),
              createBaseVNode("col"),
              createBaseVNode("col"),
              createBaseVNode("col")
            ], -1)),
            __props.selected.size === 0 ? (openBlock(), createElementBlock("thead", _hoisted_8, [
              createBaseVNode("tr", null, [
                createBaseVNode("th", null, [
                  createBaseVNode("input", {
                    type: "checkbox",
                    checked: allSelected.value,
                    indeterminate: someSelected.value,
                    "aria-label": unref(translate)("shortlinks", "Select all"),
                    onChange: toggleAll
                  }, null, 40, _hoisted_9)
                ]),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("title")
                }, [
                  createBaseVNode("button", {
                    class: "table-sort-button",
                    "aria-label": `${unref(translate)("shortlinks", "Sort by")} ${unref(translate)("shortlinks", "Title")}`,
                    onClick: _cache[9] || (_cache[9] = ($event) => setSort("title"))
                  }, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Title")), 1),
                    createVNode(unref(NcIconSvgWrapper), {
                      path: sortIcon("title"),
                      size: 18,
                      "aria-hidden": "true"
                    }, null, 8, ["path"])
                  ], 8, _hoisted_11)
                ], 8, _hoisted_10),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("slug")
                }, [
                  createBaseVNode("button", {
                    class: "table-sort-button",
                    "aria-label": `${unref(translate)("shortlinks", "Sort by")} ${unref(translate)("shortlinks", "Alias")}`,
                    onClick: _cache[10] || (_cache[10] = ($event) => setSort("slug"))
                  }, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Short link")), 1),
                    createVNode(unref(NcIconSvgWrapper), {
                      path: sortIcon("slug"),
                      size: 18,
                      "aria-hidden": "true"
                    }, null, 8, ["path"])
                  ], 8, _hoisted_13)
                ], 8, _hoisted_12),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Target")), 1),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Tags")), 1),
                createBaseVNode("th", {
                  "aria-sort": ariaSort("click_count")
                }, [
                  createBaseVNode("button", {
                    class: "table-sort-button",
                    "aria-label": `${unref(translate)("shortlinks", "Sort by")} ${unref(translate)("shortlinks", "Clicks")}`,
                    onClick: _cache[11] || (_cache[11] = ($event) => setSort("click_count"))
                  }, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Clicks")), 1),
                    createVNode(unref(NcIconSvgWrapper), {
                      path: sortIcon("click_count"),
                      size: 18,
                      "aria-hidden": "true"
                    }, null, 8, ["path"])
                  ], 8, _hoisted_15)
                ], 8, _hoisted_14),
                createBaseVNode("th", {
                  "aria-sort": ariaSort(visibleDateField())
                }, [
                  createBaseVNode("button", {
                    class: "table-sort-button",
                    "aria-label": `${unref(translate)("shortlinks", "Sort by")} ${visibleDateLabel()}`,
                    onClick: _cache[12] || (_cache[12] = ($event) => setSort(visibleDateField()))
                  }, [
                    createBaseVNode("span", null, toDisplayString(visibleDateLabel()), 1),
                    createVNode(unref(NcIconSvgWrapper), {
                      path: sortIcon(visibleDateField()),
                      size: 18,
                      "aria-hidden": "true"
                    }, null, 8, ["path"])
                  ], 8, _hoisted_17)
                ], 8, _hoisted_16),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Status")), 1),
                createBaseVNode("th", null, toDisplayString(unref(translate)("shortlinks", "Actions")), 1)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("tbody", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.links, (link) => {
                return openBlock(), createElementBlock("tr", {
                  key: link.id,
                  class: normalizeClass({ "is-selected": __props.selected.has(link.id) })
                }, [
                  createBaseVNode("td", null, [
                    createBaseVNode("input", {
                      type: "checkbox",
                      checked: __props.selected.has(link.id),
                      disabled: !link.canEdit,
                      "aria-label": unref(translate)("shortlinks", "Select {title}", { title: link.title || link.slug }),
                      onChange: ($event) => emit2("toggle", link.id)
                    }, null, 40, _hoisted_18)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("button", {
                      class: "table-link-identity",
                      onClick: ($event) => emit2("open", link)
                    }, [
                      __props.useThumbnails ? (openBlock(), createBlock(LinkThumbnail, {
                        key: 0,
                        size: "small",
                        src: link.thumbnailMediaUrl || (link.thumbnailUrl ? unref(api).thumbnailUrl(link.id) : ""),
                        alt: ""
                      }, null, 8, ["src"])) : createCommentVNode("", true),
                      createBaseVNode("span", null, [
                        createBaseVNode("strong", null, toDisplayString(link.title || link.slug), 1),
                        createBaseVNode("small", null, toDisplayString(`.../${link.slug}`), 1)
                      ]),
                      link.favorite ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
                        key: 1,
                        path: unref(mdiStar),
                        size: 17,
                        "aria-hidden": "true"
                      }, null, 8, ["path"])) : createCommentVNode("", true)
                    ], 8, _hoisted_19)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("button", {
                      class: "copy-value",
                      onClick: ($event) => copy(link.shortUrl)
                    }, toDisplayString(link.slug), 9, _hoisted_20)
                  ]),
                  createBaseVNode("td", null, [
                    createBaseVNode("a", {
                      href: link.targetUrl,
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, toDisplayString(link.targetUrl), 9, _hoisted_21)
                  ]),
                  createBaseVNode("td", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(link.tags, (tag) => {
                      return openBlock(), createElementBlock("span", {
                        key: tag.id,
                        class: "tag-chip"
                      }, [
                        tag.color ? (openBlock(), createElementBlock("span", {
                          key: 0,
                          class: "tag-dot",
                          style: normalizeStyle({ backgroundColor: tag.color }),
                          "aria-hidden": "true"
                        }, null, 4)) : createCommentVNode("", true),
                        createTextVNode(toDisplayString(tag.name), 1)
                      ]);
                    }), 128))
                  ]),
                  createBaseVNode("td", null, toDisplayString(link.clickCount), 1),
                  createBaseVNode("td", null, toDisplayString(formatTimestamp(visibleTimestamp(link))), 1),
                  createBaseVNode("td", null, toDisplayString(link.active ? unref(translate)("shortlinks", "Active") : unref(translate)("shortlinks", "Inactive")), 1),
                  createBaseVNode("td", _hoisted_22, [
                    createVNode(unref(NcActions), {
                      "force-menu": "",
                      "aria-label": unref(translate)("shortlinks", "Actions for {title}", { title: link.title || link.slug })
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NcActionLink), {
                          name: "QR",
                          href: unref(api).qrUrl(link.id),
                          target: "_blank"
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiQrcode) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["href"]),
                        createVNode(unref(NcActionButton), {
                          name: unref(translate)("shortlinks", "Copy link"),
                          onClick: ($event) => copy(link.shortUrl)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["name", "onClick"]),
                        !link.deletedAt ? (openBlock(), createBlock(unref(NcActionButton), {
                          key: 0,
                          name: unref(translate)("shortlinks", "Duplicate"),
                          onClick: ($event) => clone(link)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentDuplicate) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["name", "onClick"])) : createCommentVNode("", true),
                        link.deletedAt && link.canEdit ? (openBlock(), createBlock(unref(NcActionButton), {
                          key: 1,
                          name: unref(translate)("shortlinks", "Restore"),
                          onClick: ($event) => restore(link)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiRestore) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["name", "onClick"])) : createCommentVNode("", true),
                        link.deletedAt && link.canEdit ? (openBlock(), createBlock(unref(NcActionButton), {
                          key: 2,
                          name: unref(translate)("shortlinks", "Delete permanently"),
                          onClick: ($event) => removePermanently(link)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["name", "onClick"])) : link.canEdit ? (openBlock(), createBlock(unref(NcActionButton), {
                          key: 3,
                          name: unref(translate)("shortlinks", "Delete"),
                          onClick: ($event) => remove(link)
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["name", "onClick"])) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["aria-label"])
                  ])
                ], 2);
              }), 128))
            ])
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_23, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.links, (link) => {
            return openBlock(), createBlock(CompactLinkCard, {
              key: link.id,
              link,
              folder: folderFor(link),
              selectable: "",
              selected: __props.selected.has(link.id),
              "show-thumbnail": __props.useThumbnails,
              onOpen: _cache[13] || (_cache[13] = ($event) => emit2("open", $event)),
              onToggle: _cache[14] || (_cache[14] = ($event) => emit2("toggle", $event))
            }, null, 8, ["link", "folder", "selected", "show-thumbnail"]);
          }), 128))
        ])),
        __props.hasMore ? (openBlock(), createBlock(unref(NcButton), {
          key: 5,
          class: "load-more",
          disabled: __props.loading,
          onClick: _cache[15] || (_cache[15] = ($event) => emit2("more"))
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(unref(translate)("shortlinks", "Load more")), 1)
          ]),
          _: 1
        }, 8, ["disabled"])) : createCommentVNode("", true),
        showDestination.value ? (openBlock(), createBlock(BulkDestinationDialog, {
          key: 6,
          folders: __props.folders,
          count: __props.selected.size,
          onClose: _cache[16] || (_cache[16] = ($event) => showDestination.value = false),
          onApply: applyDestination
        }, null, 8, ["folders", "count"])) : createCommentVNode("", true),
        showTags.value ? (openBlock(), createBlock(BulkTagDialog, {
          key: 7,
          tags: __props.tags,
          count: __props.selected.size,
          onClose: _cache[17] || (_cache[17] = ($event) => showTags.value = false),
          onApply: applyBulk
        }, null, 8, ["tags", "count"])) : createCommentVNode("", true)
      ], 8, _hoisted_1$1);
    };
  }
});
const LinkList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3f8b4d91"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...{ name: "FolderNavigationItem" },
  __name: "FolderNavigationItem",
  props: {
    folder: {},
    folders: {},
    activeFolderId: {},
    expandedIds: {}
  },
  emits: ["select", "toggle", "createLink", "createFolder", "createPage", "move", "copy", "export", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const children = computed(() => props.folders.filter((folder) => folder.parentId === props.folder.id).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)));
    const expanded = computed(() => props.expandedIds.has(props.folder.id));
    return (_ctx, _cache) => {
      const _component_FolderNavigationItem = resolveComponent("FolderNavigationItem", true);
      return openBlock(), createBlock(unref(NcAppNavigationItem), {
        name: __props.folder.name,
        "counter-number": __props.folder.count,
        active: __props.activeFolderId === __props.folder.id,
        "allow-collapse": children.value.length > 0,
        open: expanded.value,
        "force-menu": true,
        "actions-aria-label": unref(translate)("shortlinks", "Folder actions for {name}", { name: __props.folder.name }),
        "onUpdate:open": _cache[16] || (_cache[16] = ($event) => emit2("toggle", { id: __props.folder.id, open: $event })),
        onClick: _cache[17] || (_cache[17] = ($event) => emit2("select", __props.folder))
      }, {
        icon: withCtx(() => [
          createVNode(unref(NcIconSvgWrapper), {
            path: unref(folderIconPath)(__props.folder.icon)
          }, null, 8, ["path"])
        ]),
        actions: withCtx(() => [
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Create link in folder"),
            onClick: _cache[0] || (_cache[0] = ($event) => emit2("createLink", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiLinkPlus) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "New subfolder"),
            onClick: _cache[1] || (_cache[1] = ($event) => emit2("createFolder", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderPlusOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Create page from folder"),
            onClick: _cache[2] || (_cache[2] = ($event) => emit2("createPage", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileDocumentPlusOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionSeparator)),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Move"),
            onClick: _cache[3] || (_cache[3] = ($event) => emit2("move", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFolderMoveOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Copy"),
            onClick: _cache[4] || (_cache[4] = ($event) => emit2("copy", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiContentCopy) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Export"),
            onClick: _cache[5] || (_cache[5] = ($event) => emit2("export", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiExportVariant) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"]),
          createVNode(unref(NcActionButton), {
            name: unref(translate)("shortlinks", "Delete"),
            onClick: _cache[6] || (_cache[6] = ($event) => emit2("delete", __props.folder))
          }, {
            icon: withCtx(() => [
              createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDeleteOutline) }, null, 8, ["path"])
            ]),
            _: 1
          }, 8, ["name"])
        ]),
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(children.value, (child) => {
            return openBlock(), createBlock(_component_FolderNavigationItem, {
              key: child.id,
              folder: child,
              folders: __props.folders,
              "active-folder-id": __props.activeFolderId,
              "expanded-ids": __props.expandedIds,
              onSelect: _cache[7] || (_cache[7] = ($event) => emit2("select", $event)),
              onToggle: _cache[8] || (_cache[8] = ($event) => emit2("toggle", $event)),
              onCreateLink: _cache[9] || (_cache[9] = ($event) => emit2("createLink", $event)),
              onCreateFolder: _cache[10] || (_cache[10] = ($event) => emit2("createFolder", $event)),
              onCreatePage: _cache[11] || (_cache[11] = ($event) => emit2("createPage", $event)),
              onMove: _cache[12] || (_cache[12] = ($event) => emit2("move", $event)),
              onCopy: _cache[13] || (_cache[13] = ($event) => emit2("copy", $event)),
              onExport: _cache[14] || (_cache[14] = ($event) => emit2("export", $event)),
              onDelete: _cache[15] || (_cache[15] = ($event) => emit2("delete", $event))
            }, null, 8, ["folder", "folders", "active-folder-id", "expanded-ids"]);
          }), 128))
        ]),
        _: 1
      }, 8, ["name", "counter-number", "active", "allow-collapse", "open", "actions-aria-label"]);
    };
  }
});
const _hoisted_1 = { class: "navigation-section navigation-section--main" };
const _hoisted_2 = { class: "navigation-section navigation-section--footer" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Navigation",
  props: {
    folders: {},
    tags: {},
    activeSystem: {},
    activeFolderId: {},
    activeTagIds: {}
  },
  emits: ["filter", "tag", "settings", "createLink", "createFolder", "createPage", "moveFolder", "copyFolder", "exportFolder", "deleteFolder", "statistics"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const systemItems = [
      { id: "all", label: "All links", icon: mdiLinkVariant },
      { id: "favorites", label: "Favorites", icon: mdiStarOutline },
      { id: "trending", label: "Trending links", icon: mdiTrendingUp },
      { id: "recent", label: "Recently created", icon: mdiHistory },
      { id: "used", label: "Recently used", icon: mdiCursorDefaultClickOutline },
      { id: "expired", label: "Expired", icon: mdiCalendarRemoveOutline },
      { id: "inactive", label: "Inactive", icon: mdiLinkOff }
    ];
    const pageItems = [
      { id: "pages-all", label: "All pages", icon: mdiFileDocumentOutline },
      { id: "pages-public", label: "Public pages", icon: mdiEarth },
      { id: "pages-protected", label: "Protected pages", icon: mdiShieldLockOutline },
      { id: "pages-inactive", label: "Inactive pages", icon: mdiLinkOff }
    ];
    const expandedIds = ref(/* @__PURE__ */ new Set());
    const shortlinksOpen = ref(false);
    const pagesOpen = ref(props.activeSystem.startsWith("pages-"));
    const statisticsOpen = ref(props.activeSystem === "statistics");
    const activeStatisticsPeriod = ref("30d");
    const customFrom = ref(new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const customTo = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    const statisticsPeriods = [
      { id: "7d", label: "Last 7 days" },
      { id: "30d", label: "Last 30 days" },
      { id: "90d", label: "Last 3 months" },
      { id: "thisYear", label: "This year" },
      { id: "lastYear", label: "Last year" },
      { id: "all", label: "Since the beginning" },
      { id: "custom", label: "Custom" }
    ];
    const rootFolders = computed(() => props.folders.filter((folder) => folder.parentId === null).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)));
    watch([() => props.folders, () => props.activeFolderId], () => {
      const next = new Set(expandedIds.value);
      if (next.size === 0) rootFolders.value.forEach((folder) => next.add(folder.id));
      let current = props.activeFolderId;
      while (current !== null) {
        const folder = props.folders.find((item) => item.id === current);
        if (!folder) break;
        if (folder.parentId !== null) next.add(folder.parentId);
        current = folder.parentId;
      }
      expandedIds.value = next;
    }, { immediate: true, deep: true });
    function toggleFolder(value) {
      const next = new Set(expandedIds.value);
      value.open ? next.add(value.id) : next.delete(value.id);
      expandedIds.value = next;
    }
    function openStatistics(period) {
      activeStatisticsPeriod.value = period;
      if (period !== "custom") emit2("statistics", { period });
    }
    function applyCustomStatistics() {
      emit2("statistics", { period: "custom", from: customFrom.value, to: customTo.value });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcAppNavigation), {
        "aria-label": unref(translate)("shortlinks", "Shortlinks navigation")
      }, {
        footer: withCtx(() => [
          createBaseVNode("ul", _hoisted_2, [
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Trash"),
              active: __props.activeSystem === "trash" && __props.activeFolderId === null,
              onClick: _cache[18] || (_cache[18] = ($event) => emit2("filter", { system: "trash", folderId: null }))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTrashCanOutline) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name", "active"]),
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Settings"),
              onClick: _cache[19] || (_cache[19] = ($event) => emit2("settings"))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiCogOutline) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name"])
          ])
        ]),
        default: withCtx(() => [
          createBaseVNode("ul", _hoisted_1, [
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Dashboard"),
              active: __props.activeSystem === "dashboard" && __props.activeFolderId === null,
              onClick: _cache[0] || (_cache[0] = ($event) => emit2("filter", { system: "dashboard", folderId: null }))
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiViewDashboardOutline) }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["name", "active"]),
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Short links"),
              active: systemItems.some((item) => item.id === __props.activeSystem) && __props.activeFolderId === null,
              "allow-collapse": "",
              open: shortlinksOpen.value,
              onClick: _cache[1] || (_cache[1] = ($event) => emit2("filter", { system: "all", folderId: null })),
              "onUpdate:open": _cache[2] || (_cache[2] = ($event) => shortlinksOpen.value = $event)
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiLinkVariant) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(systemItems, (item) => {
                  return createVNode(unref(NcAppNavigationItem), {
                    key: item.id,
                    name: unref(translate)("shortlinks", item.label),
                    active: __props.activeSystem === item.id && __props.activeFolderId === null,
                    onClick: ($event) => emit2("filter", { system: item.id, folderId: null })
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: item.icon
                      }, null, 8, ["path"])
                    ]),
                    _: 2
                  }, 1032, ["name", "active", "onClick"]);
                }), 64))
              ]),
              _: 1
            }, 8, ["name", "active", "open"]),
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Pages"),
              active: __props.activeSystem.startsWith("pages-"),
              "allow-collapse": "",
              open: pagesOpen.value,
              onClick: _cache[3] || (_cache[3] = ($event) => emit2("filter", { system: "pages-all", folderId: null })),
              "onUpdate:open": _cache[4] || (_cache[4] = ($event) => pagesOpen.value = $event)
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileDocumentMultipleOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(pageItems, (item) => {
                  return createVNode(unref(NcAppNavigationItem), {
                    key: item.id,
                    name: unref(translate)("shortlinks", item.label),
                    active: __props.activeSystem === item.id,
                    onClick: ($event) => emit2("filter", { system: item.id, folderId: null })
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: item.icon
                      }, null, 8, ["path"])
                    ]),
                    _: 2
                  }, 1032, ["name", "active", "onClick"]);
                }), 64))
              ]),
              _: 1
            }, 8, ["name", "active", "open"]),
            createVNode(unref(NcAppNavigationItem), {
              name: unref(translate)("shortlinks", "Statistics"),
              active: __props.activeSystem === "statistics",
              "allow-collapse": "",
              open: statisticsOpen.value,
              onClick: _cache[8] || (_cache[8] = ($event) => openStatistics(activeStatisticsPeriod.value)),
              "onUpdate:open": _cache[9] || (_cache[9] = ($event) => statisticsOpen.value = $event)
            }, {
              icon: withCtx(() => [
                createVNode(unref(NcIconSvgWrapper), { path: unref(mdiChartBoxOutline) }, null, 8, ["path"])
              ]),
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(statisticsPeriods, (period) => {
                  return createVNode(unref(NcAppNavigationItem), {
                    key: period.id,
                    name: unref(translate)("shortlinks", period.label),
                    active: __props.activeSystem === "statistics" && activeStatisticsPeriod.value === period.id,
                    onClick: ($event) => openStatistics(period.id)
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), {
                        path: period.id === "custom" ? unref(mdiCalendarRange) : unref(mdiChartBoxOutline)
                      }, null, 8, ["path"])
                    ]),
                    _: 2
                  }, 1032, ["name", "active", "onClick"]);
                }), 64)),
                activeStatisticsPeriod.value === "custom" ? (openBlock(), createElementBlock("li", {
                  key: 0,
                  class: "statistics-custom",
                  onClick: _cache[7] || (_cache[7] = withModifiers(() => {
                  }, ["stop"]))
                }, [
                  createBaseVNode("label", null, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "Start date")), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => customFrom.value = $event),
                      type: "date"
                    }, null, 512), [
                      [vModelText, customFrom.value]
                    ])
                  ]),
                  createBaseVNode("label", null, [
                    createBaseVNode("span", null, toDisplayString(unref(translate)("shortlinks", "End date")), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => customTo.value = $event),
                      type: "date"
                    }, null, 512), [
                      [vModelText, customTo.value]
                    ])
                  ]),
                  createBaseVNode("button", {
                    type: "button",
                    onClick: applyCustomStatistics
                  }, toDisplayString(unref(translate)("shortlinks", "Apply")), 1)
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["name", "active", "open"]),
            createVNode(unref(NcAppNavigationCaption), {
              name: unref(translate)("shortlinks", "Folders")
            }, null, 8, ["name"]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(rootFolders.value, (folder) => {
              return openBlock(), createBlock(_sfc_main$2, {
                key: folder.id,
                folder,
                folders: __props.folders,
                "active-folder-id": __props.activeFolderId,
                "expanded-ids": expandedIds.value,
                onSelect: _cache[10] || (_cache[10] = ($event) => emit2("filter", { system: "all", folderId: $event.id })),
                onToggle: toggleFolder,
                onCreateLink: _cache[11] || (_cache[11] = ($event) => emit2("createLink", $event.id)),
                onCreateFolder: _cache[12] || (_cache[12] = ($event) => emit2("createFolder", $event.id)),
                onCreatePage: _cache[13] || (_cache[13] = ($event) => emit2("createPage", { folderId: $event.id })),
                onMove: _cache[14] || (_cache[14] = ($event) => emit2("moveFolder", $event)),
                onCopy: _cache[15] || (_cache[15] = ($event) => emit2("copyFolder", $event)),
                onExport: _cache[16] || (_cache[16] = ($event) => emit2("exportFolder", $event)),
                onDelete: _cache[17] || (_cache[17] = ($event) => emit2("deleteFolder", $event))
              }, null, 8, ["folder", "folders", "active-folder-id", "expanded-ids"]);
            }), 128)),
            createVNode(unref(NcAppNavigationCaption), {
              name: unref(translate)("shortlinks", "Tags")
            }, null, 8, ["name"]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.tags, (tag) => {
              return openBlock(), createBlock(unref(NcAppNavigationItem), {
                key: tag.id,
                name: tag.name,
                "counter-number": tag.count,
                active: __props.activeTagIds.includes(tag.id),
                "force-menu": true,
                onClick: ($event) => emit2("tag", tag.id)
              }, {
                icon: withCtx(() => [
                  createBaseVNode("span", {
                    class: "tag-navigation-icon",
                    style: normalizeStyle({ color: tag.color || void 0 })
                  }, [
                    createVNode(unref(NcIconSvgWrapper), { path: unref(mdiTagOutline) }, null, 8, ["path"])
                  ], 4)
                ]),
                actions: withCtx(() => [
                  createVNode(unref(NcActionButton), {
                    name: unref(translate)("shortlinks", "Create page from tag"),
                    onClick: ($event) => emit2("createPage", { tagId: tag.id })
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(NcIconSvgWrapper), { path: unref(mdiFileDocumentPlusOutline) }, null, 8, ["path"])
                    ]),
                    _: 1
                  }, 8, ["name", "onClick"])
                ]),
                _: 2
              }, 1032, ["name", "counter-number", "active", "onClick"]);
            }), 128))
          ])
        ]),
        _: 1
      }, 8, ["aria-label"]);
    };
  }
});
const Navigation = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d1db27b1"]]);
const state = reactive({
  links: [],
  folders: [],
  tags: [],
  loading: false,
  error: "",
  page: 1,
  hasMore: false,
  search: "",
  createdFrom: null,
  active: null,
  system: "dashboard",
  folderId: null,
  tagIds: [],
  tagMode: "and",
  sort: "updated_at",
  direction: "DESC",
  selected: /* @__PURE__ */ new Set()
});
function listParams(page) {
  return {
    page,
    perPage: 50,
    search: state.search,
    createdFrom: state.createdFrom ?? void 0,
    active: state.active ?? void 0,
    system: state.system === "dashboard" ? "all" : state.system,
    folderId: state.folderId ?? void 0,
    tagIds: state.tagIds,
    tagMode: state.tagMode,
    sort: state.sort,
    direction: state.direction
  };
}
async function refresh() {
  state.loading = true;
  state.error = "";
  state.page = 1;
  try {
    const [links, folders, tags] = await Promise.all([api.listLinks(listParams(state.page)), api.listFolders(), api.listTags()]);
    state.links = links.items;
    state.hasMore = links.pagination.hasMore === 1;
    state.folders = folders;
    state.tags = tags;
    state.selected.clear();
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.loading = false;
  }
}
async function loadMore() {
  if (state.loading || !state.hasMore) return;
  state.loading = true;
  try {
    const next = state.page + 1;
    const result = await api.listLinks(listParams(next));
    state.links.push(...result.items);
    state.page = next;
    state.hasMore = result.pagination.hasMore === 1;
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.loading = false;
  }
}
function useShortlinks() {
  return {
    state,
    selectedCount: computed(() => state.selected.size),
    refresh,
    loadMore,
    async create(draft) {
      const created = await api.createLink(draft);
      await refresh();
      return created;
    },
    async update(link, changes) {
      await api.updateLink(link.id, { ...changes, version: link.version });
      await refresh();
    },
    async remove(link) {
      await api.deleteLink(link.id);
      await refresh();
    },
    async restore(link) {
      await api.restoreLink(link.id);
      await refresh();
    },
    async bulk(changes) {
      await api.bulk([...state.selected], changes);
      await refresh();
    },
    async setFilter(system, folderId = null) {
      state.system = system;
      state.folderId = folderId;
      state.tagIds = [];
      if (system === "recent") {
        state.sort = "created_at";
        state.direction = "DESC";
      } else if (system === "used") {
        state.sort = "last_clicked_at";
        state.direction = "DESC";
      }
      state.page = 1;
      await refresh();
    },
    async openTag(id) {
      state.system = "all";
      state.folderId = null;
      state.tagIds = [id];
      state.page = 1;
      await refresh();
    },
    async setTagFilter(ids, mode = state.tagMode) {
      state.tagIds = [...new Set(ids)];
      state.tagMode = mode;
      state.page = 1;
      await refresh();
    },
    async setSearchFilters(filters) {
      Object.assign(state, filters);
      state.page = 1;
      await refresh();
    },
    async setListOptions(options) {
      Object.assign(state, options);
      state.page = 1;
      await refresh();
    },
    toggleSelected(id) {
      state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id);
    },
    setSelected(ids) {
      state.selected.clear();
      ids.forEach((id) => state.selected.add(id));
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const store = useShortlinks();
    const AppSettingsDialog = defineAsyncComponent(() => __vitePreload(() => import("./AppSettingsDialog-BEUKmDCr.chunk.mjs"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0, import.meta.url));
    const DashboardView = defineAsyncComponent(() => __vitePreload(() => import("./DashboardView-gWBwac9n.chunk.mjs"), true ? __vite__mapDeps([16,3,2,1,4,6,5,7,9,8,10,17,18,19]) : void 0, import.meta.url));
    const FolderDeleteDialog = defineAsyncComponent(() => __vitePreload(() => import("./FolderDeleteDialog-4ZctuTHY.chunk.mjs"), true ? __vite__mapDeps([20,3,2,1,4,6,5,7,8,21]) : void 0, import.meta.url));
    const FolderDestinationDialog = defineAsyncComponent(() => __vitePreload(() => import("./FolderDestinationDialog-RExuPLay.chunk.mjs"), true ? __vite__mapDeps([22,1,2,3,4,6,5,7,8,23]) : void 0, import.meta.url));
    const FolderForm = defineAsyncComponent(() => __vitePreload(() => import("./FolderForm-CmAZh5yn.chunk.mjs"), true ? __vite__mapDeps([11,1,2,3,4,6,5,7,8,12]) : void 0, import.meta.url));
    const LinkDetail = defineAsyncComponent(() => __vitePreload(() => import("./LinkDetail-Dc2KZAPa.chunk.mjs"), true ? __vite__mapDeps([24,1,2,3,4,5,6,7,25,8,26,27]) : void 0, import.meta.url));
    const LinkForm = defineAsyncComponent(() => __vitePreload(() => import("./LinkForm-m7KoGYN8.chunk.mjs"), true ? __vite__mapDeps([28,1,2,3,4,5,6,7,17,8,18,29]) : void 0, import.meta.url));
    const PageEditor = defineAsyncComponent(() => __vitePreload(() => import("./PageEditor-C-GWBiue.chunk.mjs"), true ? __vite__mapDeps([30,1,2,3,4,5,6,7,8,31]) : void 0, import.meta.url));
    const PageList = defineAsyncComponent(() => __vitePreload(() => import("./PageList-9xFUA5ID.chunk.mjs"), true ? __vite__mapDeps([32,3,2,1,4,5,6,7,8,33]) : void 0, import.meta.url));
    const StatsOverview = defineAsyncComponent(() => __vitePreload(() => import("./StatsOverview-igMVr00-.chunk.mjs"), true ? __vite__mapDeps([34,1,2,3,4,5,6,7,25,8,26,35]) : void 0, import.meta.url));
    const TagForm = defineAsyncComponent(() => __vitePreload(() => import("./TagForm-D9YhRSyq.chunk.mjs"), true ? __vite__mapDeps([13,1,2,3,4,6,5,7,8,14]) : void 0, import.meta.url));
    const capabilities = loadState("shortlinks", "capabilities");
    const settings = reactive(loadState("shortlinks", "settings"));
    const showCreate = ref(false);
    const showFolderCreate = ref(false);
    const showTagCreate = ref(false);
    const showSettings = ref(false);
    const showStats = ref(false);
    const statsPagePeriod = ref("30d");
    const statsPageFrom = ref("");
    const statsPageTo = ref("");
    const statsDialogContext = ref({ title: "", color: null, filters: {} });
    const createFolderParentId = ref(null);
    const createLinkFolderId = ref(null);
    const createLinkTagIds = ref([]);
    const destinationFolder = ref(null);
    const destinationMode = ref("move");
    const deletingFolder = ref(null);
    const selectedLink = ref(null);
    const editLink = ref(null);
    const pages = ref([]);
    const pagesLoading = ref(false);
    const editingPage = ref(null);
    const createPageFolderId = ref(null);
    const createPageTagIds = ref([]);
    const prefill = new URLSearchParams(location.search);
    const isDashboard = computed(() => store.state.system === "dashboard" && store.state.folderId === null && store.state.tagIds.length === 0);
    const isStatistics = computed(() => store.state.system === "statistics");
    const isPages = computed(() => store.state.system.startsWith("pages-"));
    const isTrash = computed(() => store.state.system === "trash");
    onMounted(async () => {
      await store.refresh();
      if (isPages.value || isTrash.value) await loadPages();
      if (prefill.get("url")) showCreate.value = true;
    });
    async function loadPages() {
      pagesLoading.value = true;
      try {
        const filter = isTrash.value ? "trash" : store.state.system.replace(/^pages-/, "");
        pages.value = (await api.listPages(filter, 1, 100)).items;
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      } finally {
        pagesLoading.value = false;
      }
    }
    async function selectNavigationView(value) {
      if (value.system.startsWith("pages-")) {
        store.state.system = value.system;
        store.state.folderId = null;
        store.state.tagIds = [];
        store.state.selected.clear();
        editingPage.value = null;
        await loadPages();
        return;
      }
      await store.setFilter(value.system, value.folderId);
      if (value.system === "trash") await loadPages();
    }
    function openPageCreate(value) {
      createPageFolderId.value = value?.folderId ?? (store.state.folderId ?? null);
      createPageTagIds.value = value?.tagId ? [value.tagId] : [...store.state.tagIds];
      editingPage.value = "new";
    }
    async function savePage(draft) {
      try {
        if (editingPage.value && editingPage.value !== "new") await api.updatePage(editingPage.value.id, draft);
        else await api.createPage(draft);
        showSuccess(translate("shortlinks", editingPage.value === "new" ? "Page created" : "Page saved"));
        editingPage.value = null;
        createPageFolderId.value = null;
        createPageTagIds.value = [];
        if (!isPages.value) store.state.system = "pages-all";
        await loadPages();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function deletePage(page, permanent) {
      if (permanent && !window.confirm(translate("shortlinks", "Permanently delete “{title}”? This cannot be undone.", { title: page.title }))) return;
      try {
        await api.deletePage(page.id, permanent);
        showSuccess(translate("shortlinks", permanent ? "Page permanently deleted" : "Page moved to trash"));
        await loadPages();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function restorePage(page) {
      try {
        await api.restorePage(page.id);
        showSuccess(translate("shortlinks", "Page restored"));
        await loadPages();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function createFolder(value) {
      try {
        await api.createFolder(value.name, value.parentId, value.icon);
        showFolderCreate.value = false;
        createFolderParentId.value = null;
        await store.refresh();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function openFolderCreate(parentId = null) {
      createFolderParentId.value = parentId;
      showFolderCreate.value = true;
    }
    function openLinkCreate(folderId, tagIds) {
      createLinkFolderId.value = folderId === void 0 ? store.state.folderId : folderId;
      createLinkTagIds.value = [...store.state.tagIds];
      showCreate.value = true;
    }
    function openFolderDestination(folder, mode) {
      destinationFolder.value = folder;
      destinationMode.value = mode;
    }
    async function saveFolderDestination(parentId) {
      if (!destinationFolder.value) return;
      try {
        if (destinationMode.value === "move") {
          await api.updateFolder(destinationFolder.value.id, { parentId });
          showSuccess(translate("shortlinks", "Folder moved"));
        } else {
          await api.copyFolder(destinationFolder.value.id, parentId);
          showSuccess(translate("shortlinks", "Folder copied"));
        }
        destinationFolder.value = null;
        await store.refresh();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function exportFolder(folder) {
      try {
        const folderIds = [folder.id];
        for (let index = 0; index < folderIds.length; index++) {
          store.state.folders.filter((item) => item.parentId === folderIds[index]).forEach((item) => folderIds.push(item.id));
        }
        const result = await api.exportLinks("json", { system: "all", folderIds });
        const url = URL.createObjectURL(new Blob([result.content], { type: result.mimeType }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${folder.name}-${result.filename}`;
        anchor.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function deleteFolder(deleteLinks) {
      if (!deletingFolder.value) return;
      try {
        await api.deleteFolder(deletingFolder.value.id, deleteLinks);
        deletingFolder.value = null;
        showSuccess(translate("shortlinks", "Folder deleted"));
        await store.refresh();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    async function createTag(value) {
      try {
        await api.createTag(value.name, value.color);
        showTagCreate.value = false;
        await store.refresh();
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    }
    function currentStatsContext() {
      const folder = store.state.folders.find((item) => item.id === store.state.folderId);
      const activeTags = store.state.tags.filter((tag) => store.state.tagIds.includes(tag.id));
      const systemLabels = { all: "All links", favorites: "Favorites", trending: "Trending links", recent: "Recently created", used: "Recently used", expired: "Expired", inactive: "Inactive", trash: "Trash" };
      return {
        title: folder?.name || (activeTags.length ? activeTags.map((tag) => tag.name).join(", ") : translate("shortlinks", systemLabels[store.state.system] || "All links")),
        color: activeTags.length === 1 ? activeTags[0]?.color ?? null : null,
        filters: { system: store.state.system, folderId: store.state.folderId ?? void 0, tagIds: [...store.state.tagIds], tagMode: store.state.tagMode, active: store.state.active ?? void 0 }
      };
    }
    function openViewStats() {
      statsDialogContext.value = currentStatsContext();
      showStats.value = true;
    }
    function openStatisticsPage(value) {
      statsPagePeriod.value = value.period;
      statsPageFrom.value = value.from ?? "";
      statsPageTo.value = value.to ?? "";
      store.state.system = "statistics";
      store.state.folderId = null;
      store.state.tagIds = [];
      store.state.selected.clear();
    }
    function applyUserSettings(value) {
      settings.shortUrlTemplate = value.shortUrlTemplate;
      settings.titleFetch = value.metadataCollectionEnabled && value.metadataAutocomplete;
      settings.useThumbnails = value.useThumbnails;
      settings.showQuickStart = value.showQuickStart;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcContent), { "app-name": "shortlinks" }, {
        default: withCtx(() => [
          createVNode(Navigation, {
            folders: unref(store).state.folders,
            tags: unref(store).state.tags,
            "active-system": unref(store).state.system,
            "active-folder-id": unref(store).state.folderId,
            "active-tag-ids": unref(store).state.tagIds,
            onFilter: _cache[0] || (_cache[0] = ($event) => selectNavigationView($event)),
            onTag: _cache[1] || (_cache[1] = ($event) => unref(store).openTag($event)),
            onCreateLink: _cache[2] || (_cache[2] = ($event) => openLinkCreate($event)),
            onCreateFolder: _cache[3] || (_cache[3] = ($event) => openFolderCreate($event)),
            onCreatePage: _cache[4] || (_cache[4] = ($event) => openPageCreate($event)),
            onMoveFolder: _cache[5] || (_cache[5] = ($event) => openFolderDestination($event, "move")),
            onCopyFolder: _cache[6] || (_cache[6] = ($event) => openFolderDestination($event, "copy")),
            onExportFolder: _cache[7] || (_cache[7] = ($event) => exportFolder($event)),
            onDeleteFolder: _cache[8] || (_cache[8] = ($event) => deletingFolder.value = $event),
            onStatistics: openStatisticsPage,
            onSettings: _cache[9] || (_cache[9] = ($event) => showSettings.value = true)
          }, null, 8, ["folders", "tags", "active-system", "active-folder-id", "active-tag-ids"]),
          createVNode(unref(NcAppContent), null, {
            default: withCtx(() => [
              !editingPage.value && !isPages.value ? (openBlock(), createBlock(ContentToolbar, {
                key: 0,
                folders: unref(store).state.folders,
                tags: unref(store).state.tags,
                system: unref(store).state.system,
                "folder-id": unref(store).state.folderId,
                "tag-ids": unref(store).state.tagIds,
                "tag-mode": unref(store).state.tagMode,
                search: unref(store).state.search,
                "created-from": unref(store).state.createdFrom,
                active: unref(store).state.active,
                "list-mode": !isDashboard.value && !isStatistics.value,
                onCreateLink: _cache[10] || (_cache[10] = ($event) => openLinkCreate()),
                onCreateFolder: _cache[11] || (_cache[11] = ($event) => openFolderCreate(unref(store).state.folderId)),
                onCreatePage: _cache[12] || (_cache[12] = ($event) => openPageCreate()),
                onCreateTag: _cache[13] || (_cache[13] = ($event) => showTagCreate.value = true),
                onFilter: _cache[14] || (_cache[14] = ($event) => unref(store).setFilter($event.system, $event.folderId)),
                onOpenTag: _cache[15] || (_cache[15] = ($event) => unref(store).openTag($event)),
                onSetTags: _cache[16] || (_cache[16] = ($event) => unref(store).setTagFilter($event.ids, $event.mode)),
                onSearch: _cache[17] || (_cache[17] = ($event) => unref(store).setSearchFilters($event)),
                onOverview: openViewStats,
                onRefresh: _cache[18] || (_cache[18] = ($event) => unref(store).refresh())
              }, null, 8, ["folders", "tags", "system", "folder-id", "tag-ids", "tag-mode", "search", "created-from", "active", "list-mode"])) : createCommentVNode("", true),
              editingPage.value ? (openBlock(), createBlock(unref(PageEditor), {
                key: 1,
                page: editingPage.value === "new" ? void 0 : editingPage.value,
                folders: unref(store).state.folders,
                tags: unref(store).state.tags,
                "prefill-folder-id": createPageFolderId.value,
                "prefill-tag-ids": createPageTagIds.value,
                onClose: _cache[19] || (_cache[19] = ($event) => {
                  editingPage.value = null;
                  createPageFolderId.value = null;
                  createPageTagIds.value = [];
                }),
                onSave: savePage
              }, null, 8, ["page", "folders", "tags", "prefill-folder-id", "prefill-tag-ids"])) : isStatistics.value ? (openBlock(), createBlock(unref(StatsOverview), {
                key: `${statsPagePeriod.value}-${statsPageFrom.value}-${statsPageTo.value}`,
                mode: "page",
                "context-title": unref(translate)("shortlinks", "All links"),
                filters: { system: "all" },
                "initial-period": statsPagePeriod.value,
                "initial-from": statsPageFrom.value,
                "initial-to": statsPageTo.value
              }, null, 8, ["context-title", "initial-period", "initial-from", "initial-to"])) : isDashboard.value ? (openBlock(), createBlock(unref(DashboardView), {
                key: 3,
                folders: unref(store).state.folders,
                tags: unref(store).state.tags,
                "redirect-statuses": unref(capabilities).redirectStatuses,
                "allowed-schemes": settings.allowedSchemes,
                "short-url-template": settings.shortUrlTemplate,
                "allow-title-fetch": settings.titleFetch,
                "use-thumbnails": settings.useThumbnails,
                "show-quick-start": settings.showQuickStart,
                create: unref(store).create,
                onOpen: _cache[20] || (_cache[20] = ($event) => selectedLink.value = $event),
                onChanged: _cache[21] || (_cache[21] = ($event) => unref(store).refresh()),
                onSettingsSaved: applyUserSettings
              }, null, 8, ["folders", "tags", "redirect-statuses", "allowed-schemes", "short-url-template", "allow-title-fetch", "use-thumbnails", "show-quick-start", "create"])) : isPages.value ? (openBlock(), createBlock(unref(PageList), {
                key: 4,
                pages: pages.value,
                loading: pagesLoading.value,
                onCreate: _cache[22] || (_cache[22] = ($event) => openPageCreate()),
                onEdit: _cache[23] || (_cache[23] = ($event) => editingPage.value = $event),
                onDelete: deletePage,
                onRestore: restorePage
              }, null, 8, ["pages", "loading"])) : (openBlock(), createElementBlock(Fragment, { key: 5 }, [
                isTrash.value ? (openBlock(), createBlock(unref(PageList), {
                  key: 0,
                  pages: pages.value,
                  loading: pagesLoading.value,
                  trash: "",
                  onCreate: _cache[24] || (_cache[24] = ($event) => openPageCreate()),
                  onEdit: _cache[25] || (_cache[25] = ($event) => editingPage.value = $event),
                  onDelete: deletePage,
                  onRestore: restorePage
                }, null, 8, ["pages", "loading"])) : createCommentVNode("", true),
                createVNode(LinkList, {
                  links: unref(store).state.links,
                  folders: unref(store).state.folders,
                  tags: unref(store).state.tags,
                  loading: unref(store).state.loading,
                  error: unref(store).state.error,
                  selected: unref(store).state.selected,
                  "has-more": unref(store).state.hasMore,
                  system: unref(store).state.system,
                  sort: unref(store).state.sort,
                  direction: unref(store).state.direction,
                  "use-thumbnails": settings.useThumbnails,
                  onCreate: _cache[26] || (_cache[26] = ($event) => showCreate.value = true),
                  onOpen: _cache[27] || (_cache[27] = ($event) => selectedLink.value = $event),
                  onOptions: _cache[28] || (_cache[28] = ($event) => unref(store).setListOptions($event)),
                  onToggle: _cache[29] || (_cache[29] = ($event) => unref(store).toggleSelected($event)),
                  onSelectAll: _cache[30] || (_cache[30] = ($event) => unref(store).setSelected($event)),
                  onRefresh: _cache[31] || (_cache[31] = ($event) => unref(store).refresh()),
                  onBulk: _cache[32] || (_cache[32] = ($event) => unref(store).bulk($event)),
                  onMore: _cache[33] || (_cache[33] = ($event) => unref(store).loadMore())
                }, null, 8, ["links", "folders", "tags", "loading", "error", "selected", "has-more", "system", "sort", "direction", "use-thumbnails"])
              ], 64))
            ]),
            _: 1
          }),
          selectedLink.value ? (openBlock(), createBlock(unref(NcAppSidebar), {
            key: 0,
            name: selectedLink.value.title || selectedLink.value.slug,
            background: selectedLink.value.mediaMime?.startsWith("video/") ? "" : selectedLink.value.mediaUrl || selectedLink.value.thumbnailMediaUrl || "",
            starred: selectedLink.value.favorite,
            onClose: _cache[36] || (_cache[36] = ($event) => selectedLink.value = null)
          }, {
            default: withCtx(() => [
              createVNode(unref(LinkDetail), {
                link: selectedLink.value,
                folders: unref(store).state.folders,
                onEdit: _cache[34] || (_cache[34] = ($event) => editLink.value = $event),
                onChanged: _cache[35] || (_cache[35] = ($event) => {
                  unref(store).refresh();
                  selectedLink.value = null;
                })
              }, null, 8, ["link", "folders"])
            ]),
            _: 1
          }, 8, ["name", "background", "starred"])) : createCommentVNode("", true),
          showCreate.value ? (openBlock(), createBlock(unref(LinkForm), {
            key: 1,
            folders: unref(store).state.folders,
            tags: unref(store).state.tags,
            "redirect-statuses": unref(capabilities).redirectStatuses,
            "allowed-schemes": settings.allowedSchemes,
            "short-url-template": settings.shortUrlTemplate,
            "allow-title-fetch": settings.titleFetch,
            "prefill-url": unref(prefill).get("url") || "",
            "prefill-title": unref(prefill).get("title") || "",
            "prefill-folder-id": createLinkFolderId.value,
            "prefill-tag-ids": createLinkTagIds.value,
            onClose: _cache[37] || (_cache[37] = ($event) => {
              showCreate.value = false;
              createLinkFolderId.value = null;
              createLinkTagIds.value = [];
            }),
            onSave: _cache[38] || (_cache[38] = ($event) => {
              unref(store).create($event).then(() => {
                showCreate.value = false;
                createLinkFolderId.value = null;
                createLinkTagIds.value = [];
              });
            })
          }, null, 8, ["folders", "tags", "redirect-statuses", "allowed-schemes", "short-url-template", "allow-title-fetch", "prefill-url", "prefill-title", "prefill-folder-id", "prefill-tag-ids"])) : createCommentVNode("", true),
          editLink.value ? (openBlock(), createBlock(unref(LinkForm), {
            key: 2,
            folders: unref(store).state.folders,
            tags: unref(store).state.tags,
            "redirect-statuses": unref(capabilities).redirectStatuses,
            "allowed-schemes": settings.allowedSchemes,
            "short-url-template": settings.shortUrlTemplate,
            "allow-title-fetch": settings.titleFetch,
            link: editLink.value,
            onClose: _cache[39] || (_cache[39] = ($event) => editLink.value = null),
            onSave: _cache[40] || (_cache[40] = ($event) => {
              unref(store).update(editLink.value, $event).then(() => {
                editLink.value = null;
                selectedLink.value = null;
              });
            })
          }, null, 8, ["folders", "tags", "redirect-statuses", "allowed-schemes", "short-url-template", "allow-title-fetch", "link"])) : createCommentVNode("", true),
          showFolderCreate.value ? (openBlock(), createBlock(unref(FolderForm), {
            key: 3,
            folders: unref(store).state.folders,
            "prefill-parent-id": createFolderParentId.value,
            onClose: _cache[41] || (_cache[41] = ($event) => {
              showFolderCreate.value = false;
              createFolderParentId.value = null;
            }),
            onSave: createFolder
          }, null, 8, ["folders", "prefill-parent-id"])) : createCommentVNode("", true),
          showTagCreate.value ? (openBlock(), createBlock(unref(TagForm), {
            key: 4,
            onClose: _cache[42] || (_cache[42] = ($event) => showTagCreate.value = false),
            onSave: createTag
          })) : createCommentVNode("", true),
          createVNode(unref(AppSettingsDialog), {
            open: showSettings.value,
            "onUpdate:open": _cache[43] || (_cache[43] = ($event) => showSettings.value = $event),
            folders: unref(store).state.folders,
            tags: unref(store).state.tags,
            onSettingsSaved: applyUserSettings,
            onChanged: _cache[44] || (_cache[44] = ($event) => unref(store).refresh())
          }, null, 8, ["open", "folders", "tags"]),
          destinationFolder.value ? (openBlock(), createBlock(unref(FolderDestinationDialog), {
            key: 5,
            folder: destinationFolder.value,
            folders: unref(store).state.folders,
            mode: destinationMode.value,
            onClose: _cache[45] || (_cache[45] = ($event) => destinationFolder.value = null),
            onSave: saveFolderDestination
          }, null, 8, ["folder", "folders", "mode"])) : createCommentVNode("", true),
          deletingFolder.value ? (openBlock(), createBlock(unref(FolderDeleteDialog), {
            key: 6,
            folder: deletingFolder.value,
            folders: unref(store).state.folders,
            onClose: _cache[46] || (_cache[46] = ($event) => deletingFolder.value = null),
            onDelete: deleteFolder
          }, null, 8, ["folder", "folders"])) : createCommentVNode("", true),
          showStats.value ? (openBlock(), createBlock(unref(StatsOverview), {
            key: 7,
            "context-title": statsDialogContext.value.title,
            "context-color": statsDialogContext.value.color,
            filters: statsDialogContext.value.filters,
            onClose: _cache[47] || (_cache[47] = ($event) => showStats.value = false)
          }, null, 8, ["context-title", "context-color", "filters"])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
});
createApp(_sfc_main).mount("#shortlinks-app");
export {
  CompactLinkCard as C,
  FolderTreeList as F,
  LinkThumbnail as L,
  TagList as T,
  api as a,
  folderIconPath as b,
  folderIconOptions as f
};
