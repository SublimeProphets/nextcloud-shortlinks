const appName = "shortlinks";
const appVersion = "1.2.2";
import { a1 as createApp, m as inject, W as defineComponent, a2 as routerKey, j as openBlock, k as createBlock, Q as withCtx, D as createBaseVNode, q as renderSlot, H as createTextVNode, I as toDisplayString, G as mergeProps, u as unref, l as resolveDynamicComponent, d as computed, a3 as useCssVars, p as createElementBlock, R as normalizeClass, L as createCommentVNode, x as ref, w as watch, t as toValue, X as onUnmounted, a4 as pushScopeId, a5 as popScopeId, U as resolveComponent, P as createVNode, a6 as withScopeId, F as Fragment, v as normalizeStyle, J as withKeys, B as normalizeProps, C as guardReactiveProps, n as nextTick, a7 as Comment, a8 as Text, y as h$1, a9 as watchEffect, aa as readonly, ab as useModel, ac as useTemplateRef, f as useSlots, o as onMounted, N as withDirectives, T as Transition, K as withModifiers, O as vShow, Z as Teleport, ad as mergeModels, _ as toRef, b as getCurrentInstance, M as toHandlers, E as renderList, Y as createSlots, e as useAttrs, h as onBeforeUnmount, A as resolveDirective, z as provide, ae as onBeforeMount, af as cloneVNode, S as warn, V as vModelText, ag as defineAsyncComponent, r as reactive } from "./vue-runtime-R8I1oHZP.chunk.mjs";
import { g as getGettextBuilder, a as getLanguage, p as purify, D, o as offset, b as autoPlacement, s as shift, f as flip, c as arrow, d as size, B as B$1, e as getLoggerBuilder, i as isRTL, h as formatRelativeTime, j as getCanonicalLocale, k as onKeyStroke, u as useIntervalFn, l as useSwipe, m as useElementSize, n as loadState, q as getBuilder, r as getCapabilities, y as y$1, t as b, v as emit, O as Options, w as tokenize, x as escapeHTML, z as vOnClickOutside, A as unsubscribe, C as debounce, E as subscribe, F as cancelableClient, G as generateOcsUrl, S as Select, H as autoUpdate, I as computePosition, J as offset$1, K as flip$1, L as shift$1, M as limitShift, N as script, P as getFirstDay, Q as getDayNamesMin, R as qn, T as getDayNames } from "./vendor-CflEb2sm.chunk.mjs";
import { _ as __vitePreload } from "./nextcloud-dialogs-BcEXh8qH.chunk.mjs";
function spawnDialog(dialog, props = {}, options = {}) {
  let { container } = options;
  if ("container" in props && typeof props.container === "string") {
    container ??= props.container;
  }
  const resolvedContainer = typeof container === "string" && document.querySelector(container) || document.body;
  const element = resolvedContainer.appendChild(document.createElement("div"));
  return new Promise((resolve, reject) => {
    const app = createApp(dialog, {
      ...props,
      // If dialog has no `container` prop passing a falsy value does nothing
      // Otherwise it is expected that `null` disables teleport and mounts dialog in place like NcDialog/NcModal
      container: null,
      onClose(...rest) {
        const payload = rest.length > 1 ? rest : rest[0];
        app.unmount();
        element.remove();
        resolve(payload);
      },
      "onVue:unmounted": () => {
        app.unmount();
        element.remove();
        reject(new Error("Dialog was unmounted without close event"));
      }
    });
    app.mount(element);
  });
}
window._nc_vue_element_id = window._nc_vue_element_id ?? 0;
function createElementId() {
  return `nc-vue-${window._nc_vue_element_id++}`;
}
/*!
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const gettext = getGettextBuilder().detectLanguage().build();
const n$1 = (...args) => gettext.ngettext(...args);
const t = (...args) => gettext.gettext(...args);
function register(...chunks) {
  for (const chunk of chunks) {
    if (chunk.registered) {
      continue;
    }
    for (const { l: language, t: translations } of chunk) {
      if (language !== getLanguage() || !translations) {
        continue;
      }
      const decompressed = Object.fromEntries(Object.entries(translations).map(([id, value]) => [
        id,
        {
          msgid: id,
          msgid_plural: value.p,
          msgstr: value.v
        }
      ]));
      gettext.addTranslations({
        translations: {
          "": decompressed
        }
      });
    }
    chunk.registered = true;
  }
}
const t1 = [{ "l": "ar", "t": { "A color with a HEX value {hex}": { "v": ["لون بالقيمة الست عشرية {hex}"] }, "Back": { "v": ["عودة"] }, "Choose": { "v": ["إختَر"] }, "Color picker": { "v": ["لاقط الألوان"] }, "More options": { "v": ["خيارات أخرى ..."] } } }, { "l": "ast", "t": { "A color with a HEX value {hex}": { "v": ["Un color con un valor HEX {hex}"] }, "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Escoyer"] }, "Color picker": { "v": ["Selector de colores"] }, "More options": { "v": ["Más opciones"] } } }, { "l": "br", "t": { "Choose": { "v": ["Dibab"] } } }, { "l": "ca", "t": { "Choose": { "v": ["Tria"] } } }, { "l": "cs", "t": { "A color with a HEX value {hex}": { "v": ["Barva vyjádřená HEX hodnotou {hex}"] }, "Back": { "v": ["Zpět"] }, "Choose": { "v": ["Zvolit"] }, "Color picker": { "v": ["Výběr barev"] }, "More options": { "v": ["Další volby"] }, "No color": { "v": ["Žádná barva"] } } }, { "l": "cs-CZ", "t": { "A color with a HEX value {hex}": { "v": ["Barva vyjádřená HEX hodnotou {hex}"] }, "Back": { "v": ["Zpět"] }, "Choose": { "v": ["Zvolit"] }, "Color picker": { "v": ["Výběr barev"] }, "More options": { "v": ["Další volby"] } } }, { "l": "da", "t": { "A color with a HEX value {hex}": { "v": ["En farve med en HEX-værdi {hex}"] }, "Back": { "v": ["Tilbage"] }, "Choose": { "v": ["Vælg"] }, "Color picker": { "v": ["Farvevælger"] }, "More options": { "v": ["Flere muligheder"] }, "No color": { "v": ["Ingen farve"] } } }, { "l": "de", "t": { "A color with a HEX value {hex}": { "v": ["Eine Farbe mit einem HEX-Wert {hex}"] }, "Back": { "v": ["Zurück"] }, "Choose": { "v": ["Auswählen"] }, "Color picker": { "v": ["Farbauswahl"] }, "More options": { "v": ["Weitere Optionen"] }, "No color": { "v": ["Keine Farbe"] } } }, { "l": "de-DE", "t": { "A color with a HEX value {hex}": { "v": ["Eine Farbe mit einem HEX-Wert {hex}"] }, "Back": { "v": ["Zurück"] }, "Choose": { "v": ["Auswählen"] }, "Color picker": { "v": ["Farbauswahl"] }, "More options": { "v": ["Mehr Optionen"] }, "No color": { "v": ["Keine Farbe"] } } }, { "l": "el", "t": { "A color with a HEX value {hex}": { "v": ["Ένα χρώμα με τιμή HEX {hex}"] }, "Back": { "v": ["Επιστροφή"] }, "Choose": { "v": ["Επιλογή"] }, "Color picker": { "v": ["Επιλογέας χρώματος"] }, "More options": { "v": ["Περισσότερες επιλογές"] }, "No color": { "v": ["Χωρίς χρώμα"] } } }, { "l": "en-GB", "t": { "A color with a HEX value {hex}": { "v": ["A colour with a HEX value {hex}"] }, "Back": { "v": ["Back"] }, "Choose": { "v": ["Choose"] }, "Color picker": { "v": ["Colour picker"] }, "More options": { "v": ["More options"] }, "No color": { "v": ["No colour"] } } }, { "l": "eo", "t": { "Choose": { "v": ["Elektu"] } } }, { "l": "es", "t": { "A color with a HEX value {hex}": { "v": ["Un color con un valor HEX {hex}"] }, "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Escoger"] }, "Color picker": { "v": ["Selector de color"] }, "More options": { "v": ["Más opciones"] } } }, { "l": "es-AR", "t": { "A color with a HEX value {hex}": { "v": ["Un color con valor HEX {hex}"] }, "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Elegir"] }, "Color picker": { "v": ["Selector de color"] }, "More options": { "v": ["Más opciones"] } } }, { "l": "es-EC", "t": { "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Elegir"] }, "More options": { "v": ["Más opciones"] } } }, { "l": "es-MX", "t": { "A color with a HEX value {hex}": { "v": ["Un color con valor HEX {hex}"] }, "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Elegir"] }, "Color picker": { "v": ["Selector de color"] }, "More options": { "v": ["Más opciones"] } } }, { "l": "et-EE", "t": { "A color with a HEX value {hex}": { "v": ["Värv kuueteistkümnendarvuna {hex}"] }, "Back": { "v": ["Tagasi"] }, "Choose": { "v": ["Tee valik"] }, "Color picker": { "v": ["Värvivalija"] }, "More options": { "v": ["Rohkem valikuid"] }, "No color": { "v": ["Värv puudub"] } } }, { "l": "eu", "t": { "Back": { "v": ["Atzera"] }, "Choose": { "v": ["Aukeratu"] }, "More options": { "v": ["Aukera gehiago"] } } }, { "l": "fa", "t": { "A color with a HEX value {hex}": { "v": ["رنگی با مقدار مبنای هشت {hex}"] }, "Back": { "v": ["بازگشت"] }, "Choose": { "v": ["انتخاب کنید"] }, "Color picker": { "v": ["انتخاب‌گر رنگ"] }, "More options": { "v": ["گزینه‌های بیشتر"] } } }, { "l": "fi", "t": { "A color with a HEX value {hex}": { "v": ["Väri heksa-arvolla {hex}"] }, "Back": { "v": ["Takaisin"] }, "Choose": { "v": ["Valitse"] }, "Color picker": { "v": ["Värivalitsin"] }, "More options": { "v": ["Lisää vaihtoehtoja"] } } }, { "l": "fr", "t": { "A color with a HEX value {hex}": { "v": ["Une couleur de valeur HEX {hex}"] }, "Back": { "v": ["Retour"] }, "Choose": { "v": ["Choisir"] }, "Color picker": { "v": ["Sélecteur de couleurs"] }, "More options": { "v": ["Plus d'options"] }, "No color": { "v": ["Sans couleur"] } } }, { "l": "ga", "t": { "A color with a HEX value {hex}": { "v": ["Dath le luach HEX {hex}"] }, "Back": { "v": ["Ar ais"] }, "Choose": { "v": ["Roghnaigh"] }, "Color picker": { "v": ["Roghnóir dathanna"] }, "More options": { "v": ["Tuilleadh roghanna"] }, "No color": { "v": ["Gan dath"] } } }, { "l": "gl", "t": { "A color with a HEX value {hex}": { "v": ["Unha cor cun valor HEX {hex}"] }, "Back": { "v": ["Atrás"] }, "Choose": { "v": ["Escoller"] }, "Color picker": { "v": ["Selector de cores"] }, "More options": { "v": ["Máis opcións"] }, "No color": { "v": ["Sen cor"] } } }, { "l": "he", "t": { "Back": { "v": ["חזרה"] }, "Choose": { "v": ["בחירה"] }, "More options": { "v": ["אפשרויות נוספות"] } } }, { "l": "hr", "t": { "A color with a HEX value {hex}": { "v": ["Boja s HEX vrijednošću {hex}"] }, "Back": { "v": ["Natrag"] }, "Choose": { "v": ["Odaberi"] }, "Color picker": { "v": ["Odabir boje"] }, "More options": { "v": ["Više mogućnosti"] }, "No color": { "v": ["Bez boje"] } } }, { "l": "hu", "t": { "A color with a HEX value {hex}": { "v": ["Szín ezzel a HEX értékkel: {hex}"] }, "Back": { "v": ["Vissza"] }, "Choose": { "v": ["Válassszon"] }, "Color picker": { "v": ["Színválasztó"] }, "More options": { "v": ["További lehetőségek"] }, "No color": { "v": ["Nincs szín"] } } }, { "l": "id", "t": { "A color with a HEX value {hex}": { "v": ["Warna dengan nilai HEX {hex}"] }, "Back": { "v": ["Kembali"] }, "Choose": { "v": ["Pilih"] }, "Color picker": { "v": ["Pemilih warna"] }, "More options": { "v": ["Opsi lainnya"] }, "No color": { "v": ["Tanpa warna"] } } }, { "l": "is", "t": { "A color with a HEX value {hex}": { "v": ["Litur með HEX-gildi {hex}"] }, "Back": { "v": ["Til baka"] }, "Choose": { "v": ["Velja"] }, "Color picker": { "v": ["Litaplokkari"] }, "More options": { "v": ["Fleiri valkostir"] } } }, { "l": "it", "t": { "A color with a HEX value {hex}": { "v": ["Un colore con un valore HEX {hex}"] }, "Back": { "v": ["Indietro"] }, "Choose": { "v": ["Scegli"] }, "More options": { "v": ["Altre opzioni"] } } }, { "l": "ja", "t": { "A color with a HEX value {hex}": { "v": [" HEX値 {hex} を持つ色"] }, "Back": { "v": ["戻る"] }, "Choose": { "v": ["選択"] }, "Color picker": { "v": ["カラーピッカー"] }, "More options": { "v": ["他のオプション"] }, "No color": { "v": ["色なし"] } } }, { "l": "ja-JP", "t": { "A color with a HEX value {hex}": { "v": [" HEX値 {hex} を持つ色"] }, "Back": { "v": ["戻る"] }, "Choose": { "v": ["選択"] }, "Color picker": { "v": ["カラーピッカー"] }, "More options": { "v": ["他のオプション"] } } }, { "l": "ko", "t": { "A color with a HEX value {hex}": { "v": ["HEX 값이 {hex}인 색상"] }, "Back": { "v": ["뒤로"] }, "Choose": { "v": ["선택"] }, "Color picker": { "v": ["색상 선택기"] }, "More options": { "v": ["옵션 더 보기"] }, "No color": { "v": ["색 없음"] } } }, { "l": "lo", "t": { "A color with a HEX value {hex}": { "v": ["ສີທີ່ມີຄ່າ HEX {hex}"] }, "Back": { "v": ["ກັບຄືນ"] }, "Choose": { "v": ["ເລືອກ"] }, "Color picker": { "v": ["ໂຕເລືອກສີ"] }, "More options": { "v": ["ຕົວເລືອກເພີ່ມເຕີມ"] }, "No color": { "v": ["ບໍ່ມີສີ"] } } }, { "l": "lt-LT", "t": { "A color with a HEX value {hex}": { "v": ["Spalva, kurios HEX reikšmė yra {hex}"] }, "Back": { "v": ["Atgal"] }, "Choose": { "v": ["Pasirinkti"] }, "Color picker": { "v": ["Spalvos parinkiklis"] }, "More options": { "v": ["Daugiau parinkčių"] }, "No color": { "v": ["Be spalvos"] } } }, { "l": "lv", "t": { "Choose": { "v": ["Izvēlēties"] } } }, { "l": "mk", "t": { "A color with a HEX value {hex}": { "v": ["Боја со HEX вредност {hex}"] }, "Back": { "v": ["Назад"] }, "Choose": { "v": ["Избери"] }, "Color picker": { "v": ["Избор на боја"] }, "More options": { "v": ["Повеќе опции"] }, "No color": { "v": ["Без боја"] } } }, { "l": "mn", "t": { "A color with a HEX value {hex}": { "v": ["{hex} HEX утгатай өнгө"] }, "Back": { "v": ["Буцах"] }, "Choose": { "v": ["Сонгох"] }, "Color picker": { "v": ["Өнгө сонгогч"] }, "More options": { "v": ["Нэмэлт сонголтууд"] }, "No color": { "v": ["Өнгөгүй"] } } }, { "l": "my", "t": { "Choose": { "v": ["ရွေးချယ်ရန်"] } } }, { "l": "nb", "t": { "A color with a HEX value {hex}": { "v": ["En farge med en HEX-verdi {hex}"] }, "Back": { "v": ["Tilbake"] }, "Choose": { "v": ["Velg"] }, "Color picker": { "v": ["Fargevelger"] }, "More options": { "v": ["Flere alternativer"] } } }, { "l": "nl", "t": { "A color with a HEX value {hex}": { "v": ["Een kleur met een HEX-waarde {hex}"] }, "Back": { "v": ["Terug"] }, "Choose": { "v": ["Kiezen"] }, "Color picker": { "v": ["Kleurkiezer"] }, "More options": { "v": ["Meer opties"] }, "No color": { "v": ["Geen kleur"] } } }, { "l": "oc", "t": { "Choose": { "v": ["Causir"] } } }, { "l": "pl", "t": { "A color with a HEX value {hex}": { "v": ["Kolor o wartości HEX {hex}"] }, "Back": { "v": ["Wstecz"] }, "Choose": { "v": ["Wybierz"] }, "Color picker": { "v": ["Wybierz kolor"] }, "More options": { "v": ["Więcej opcji"] } } }, { "l": "pt-BR", "t": { "A color with a HEX value {hex}": { "v": ["Uma cor com valor HEX {hex}"] }, "Back": { "v": ["Voltar"] }, "Choose": { "v": ["Escolher"] }, "Color picker": { "v": ["Seletor de cores"] }, "More options": { "v": ["Mais opções"] }, "No color": { "v": ["Sem cor"] } } }, { "l": "pt-PT", "t": { "A color with a HEX value {hex}": { "v": ["Uma cor com o valor HEX  {hex}"] }, "Back": { "v": ["Anterior"] }, "Choose": { "v": ["Escolher"] }, "Color picker": { "v": ["seletor de cores"] }, "More options": { "v": ["Mais opções"] } } }, { "l": "ro", "t": { "A color with a HEX value {hex}": { "v": ["O culoare în HEX value {hex}"] }, "Back": { "v": ["Înapoi"] }, "Choose": { "v": ["Alegeți"] }, "More options": { "v": ["Mai multe opțiuni"] } } }, { "l": "ru", "t": { "A color with a HEX value {hex}": { "v": ["Цвет в HEX {hex}"] }, "Back": { "v": ["Назад"] }, "Choose": { "v": ["Выберите"] }, "Color picker": { "v": ["Выбор цвета"] }, "More options": { "v": ["Больше опций"] }, "No color": { "v": ["Без цвета"] } } }, { "l": "sk", "t": { "A color with a HEX value {hex}": { "v": ["Farba s hodnotou HEX {hex}"] }, "Back": { "v": ["Späť"] }, "Choose": { "v": ["Vybrať"] }, "Color picker": { "v": ["Výber farby"] }, "More options": { "v": ["Viac možností"] } } }, { "l": "sl", "t": { "Choose": { "v": ["Izbor"] } } }, { "l": "sr", "t": { "A color with a HEX value {hex}": { "v": ["Боја са HEX вредности {hex}"] }, "Back": { "v": ["Назад"] }, "Choose": { "v": ["Изаберите"] }, "Color picker": { "v": ["Бирач боје"] }, "More options": { "v": ["Још опција"] }, "No color": { "v": ["Без боје"] } } }, { "l": "sv", "t": { "A color with a HEX value {hex}": { "v": ["En färg med ett HEX-värde {hex}"] }, "Back": { "v": ["Tillbaka"] }, "Choose": { "v": ["Välj"] }, "Color picker": { "v": ["Färgväljare"] }, "More options": { "v": ["Fler alternativ"] }, "No color": { "v": ["Ingen färg"] } } }, { "l": "tr", "t": { "A color with a HEX value {hex}": { "v": ["{hex} onaltılık değeri ile bir renk "] }, "Back": { "v": ["Geri"] }, "Choose": { "v": ["Seçin"] }, "Color picker": { "v": ["Renk seçici"] }, "More options": { "v": ["Diğer seçenekler"] }, "No color": { "v": ["Renk yok"] } } }, { "l": "uk", "t": { "A color with a HEX value {hex}": { "v": ["Колір у форматі HEX {hex}"] }, "Back": { "v": ["Назад"] }, "Choose": { "v": ["Виберіть"] }, "Color picker": { "v": ["Вибір кольору"] }, "More options": { "v": ["Більше об'єктів"] } } }, { "l": "uz", "t": { "A color with a HEX value {hex}": { "v": ["HEX qiymatiga ega rang {hex}"] }, "Back": { "v": ["Orqaga"] }, "Choose": { "v": ["Tanlang"] }, "Color picker": { "v": ["Rang tanlagich"] }, "More options": { "v": ["Boshqa variantlar"] }, "No color": { "v": ["Rangsiz"] } } }, { "l": "zh-CN", "t": { "A color with a HEX value {hex}": { "v": ["以16进制 {hex} 表示的颜色为"] }, "Back": { "v": ["返回"] }, "Choose": { "v": ["选择"] }, "Color picker": { "v": ["颜色拾取器"] }, "More options": { "v": ["更多选项"] } } }, { "l": "zh-HK", "t": { "A color with a HEX value {hex}": { "v": ["具有 HEX 值 {hex}的顏色 "] }, "Back": { "v": ["返回"] }, "Choose": { "v": ["選擇"] }, "Color picker": { "v": ["顏色選擇器"] }, "More options": { "v": ["更多選項"] }, "No color": { "v": ["無顏色"] } } }, { "l": "zh-TW", "t": { "A color with a HEX value {hex}": { "v": ["HEX 值為 {hex} 的顏色"] }, "Back": { "v": ["返回"] }, "Choose": { "v": ["選擇"] }, "Color picker": { "v": ["色彩挑選器"] }, "More options": { "v": ["更多選項"] }, "No color": { "v": ["沒有顏色"] } } }];
const t2 = [{ "l": "ar", "t": { "a few seconds ago": { "v": ["منذ عدة ثوانٍ"] }, "sec. ago": { "v": ["ثانية مضت"] }, "seconds ago": { "v": ["ثوانٍ مضت"] } } }, { "l": "ast", "t": { "a few seconds ago": { "v": ["hai unos segundos"] }, "sec. ago": { "v": ["hai segs"] }, "seconds ago": { "v": ["hai segundos"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "a few seconds ago": { "v": ["před několika sekundami"] }, "sec. ago": { "v": ["sek. před"] }, "seconds ago": { "v": ["sekund předtím"] } } }, { "l": "cs-CZ", "t": { "a few seconds ago": { "v": ["před několika sekundami"] }, "sec. ago": { "v": ["sek. před"] }, "seconds ago": { "v": ["sekund předtím"] } } }, { "l": "da", "t": { "a few seconds ago": { "v": ["et par sekunder siden"] }, "sec. ago": { "v": ["sek. siden"] }, "seconds ago": { "v": ["sekunder siden"] } } }, { "l": "de", "t": { "a few seconds ago": { "v": ["vor ein paar Sekunden"] }, "sec. ago": { "v": ["Sek. zuvor"] }, "seconds ago": { "v": ["Sekunden zuvor"] } } }, { "l": "de-DE", "t": { "a few seconds ago": { "v": ["vor ein paar Sekunden"] }, "sec. ago": { "v": ["Sek. zuvor"] }, "seconds ago": { "v": ["Sekunden zuvor"] } } }, { "l": "el", "t": { "a few seconds ago": { "v": ["πριν λίγα δευτερόλεπτα"] }, "sec. ago": { "v": ["δευτ. πριν"] }, "seconds ago": { "v": ["δευτερόλεπτα πριν"] } } }, { "l": "en-GB", "t": { "a few seconds ago": { "v": ["a few seconds ago"] }, "sec. ago": { "v": ["sec. ago"] }, "seconds ago": { "v": ["seconds ago"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "a few seconds ago": { "v": ["hace unos pocos segundos"] }, "sec. ago": { "v": ["hace segundos"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "es-AR", "t": { "a few seconds ago": { "v": ["hace unos segundos"] }, "sec. ago": { "v": ["seg. atrás"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "es-EC", "t": { "a few seconds ago": { "v": ["hace unos segundos"] }, "sec. ago": { "v": ["hace segundos"] }, "seconds ago": { "v": ["Segundos atrás"] } } }, { "l": "es-MX", "t": { "a few seconds ago": { "v": ["hace unos segundos"] }, "sec. ago": { "v": ["seg. atrás"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "et-EE", "t": { "a few seconds ago": { "v": ["mõni sekund tagasi"] }, "sec. ago": { "v": ["sek. tagasi"] }, "seconds ago": { "v": ["sekundit tagasi"] } } }, { "l": "eu", "t": { "a few seconds ago": { "v": ["duela segundo batzuk"] }, "sec. ago": { "v": ["duela seg."] }, "seconds ago": { "v": ["duela segundo"] } } }, { "l": "fa", "t": { "a few seconds ago": { "v": ["چند ثانیه پیش"] }, "sec. ago": { "v": ["چند ثانیه پیش"] }, "seconds ago": { "v": ["چند ثانیه پیش"] } } }, { "l": "fi", "t": { "a few seconds ago": { "v": ["muutamia sekunteja sitten"] }, "sec. ago": { "v": ["sek. sitten"] }, "seconds ago": { "v": ["sekunteja sitten"] } } }, { "l": "fr", "t": { "a few seconds ago": { "v": ["il y a quelques instants"] }, "sec. ago": { "v": ["il y a qq. sec."] }, "seconds ago": { "v": ["il y a quelques secondes"] } } }, { "l": "ga", "t": { "a few seconds ago": { "v": ["cúpla soicind ó shin"] }, "sec. ago": { "v": ["soic. ó shin"] }, "seconds ago": { "v": ["soicind ó shin"] } } }, { "l": "gl", "t": { "a few seconds ago": { "v": ["hai uns segundos"] }, "sec. ago": { "v": ["segs. atrás"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "he", "t": { "a few seconds ago": { "v": ["לפני מספר שניות"] }, "sec. ago": { "v": ["לפני מספר שניות"] }, "seconds ago": { "v": ["לפני מס׳ שניות"] } } }, { "l": "hr", "t": { "a few seconds ago": { "v": ["prije nekoliko sekundi"] }, "sec. ago": { "v": ["prije nek. sek."] }, "seconds ago": { "v": ["prije nek. sek."] } } }, { "l": "hu", "t": { "a few seconds ago": { "v": ["néhány másodperce"] }, "sec. ago": { "v": ["másodperce"] }, "seconds ago": { "v": ["másodperce"] } } }, { "l": "id", "t": { "a few seconds ago": { "v": ["beberapa detik yang lalu"] }, "sec. ago": { "v": ["dtk. yang lalu"] }, "seconds ago": { "v": ["beberapa detik lalu"] } } }, { "l": "is", "t": { "a few seconds ago": { "v": ["fyrir örfáum sekúndum síðan"] }, "sec. ago": { "v": ["sek. síðan"] }, "seconds ago": { "v": ["sekúndum síðan"] } } }, { "l": "it", "t": { "a few seconds ago": { "v": ["pochi secondi fa"] }, "sec. ago": { "v": ["sec. fa"] }, "seconds ago": { "v": ["secondi fa"] } } }, { "l": "ja", "t": { "a few seconds ago": { "v": ["数秒前"] }, "sec. ago": { "v": ["秒前"] }, "seconds ago": { "v": ["数秒前"] } } }, { "l": "ja-JP", "t": { "a few seconds ago": { "v": ["数秒前"] }, "sec. ago": { "v": ["秒前"] }, "seconds ago": { "v": ["数秒前"] } } }, { "l": "ko", "t": { "a few seconds ago": { "v": ["방금 전"] }, "sec. ago": { "v": ["몇 초 전"] }, "seconds ago": { "v": ["초 전"] } } }, { "l": "lo", "t": { "a few seconds ago": { "v": ["ສອງສາມວິນາທີກ່ອນ"] }, "sec. ago": { "v": ["ວິ. ກ່ອນ"] }, "seconds ago": { "v": ["ວິນາທີກ່ອນ"] } } }, { "l": "lt-LT", "t": { "a few seconds ago": { "v": ["prieš keletą sekundžių"] }, "sec. ago": { "v": ["prieš sek."] }, "seconds ago": { "v": ["prieš sekundes"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "a few seconds ago": { "v": ["пред неколку секунди"] }, "sec. ago": { "v": ["секунда"] }, "seconds ago": { "v": ["секунди"] } } }, { "l": "mn", "t": { "a few seconds ago": { "v": ["хэдхэн секундын өмнө"] }, "sec. ago": { "v": ["сек. өмнө"] }, "seconds ago": { "v": ["секундын өмнө"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "a few seconds ago": { "v": ["noen få sekunder siden"] }, "sec. ago": { "v": ["sek. siden"] }, "seconds ago": { "v": ["sekunder siden"] } } }, { "l": "nl", "t": { "a few seconds ago": { "v": ["enkele seconden geleden"] }, "sec. ago": { "v": ["sec. geleden"] }, "seconds ago": { "v": ["seconden geleden"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "a few seconds ago": { "v": ["kilka sekund temu"] }, "sec. ago": { "v": ["sek. temu"] }, "seconds ago": { "v": ["sekund temu"] } } }, { "l": "pt-BR", "t": { "a few seconds ago": { "v": ["há alguns segundos"] }, "sec. ago": { "v": ["seg. atrás"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "pt-PT", "t": { "a few seconds ago": { "v": ["há alguns segundos"] }, "sec. ago": { "v": ["seg. atrás"] }, "seconds ago": { "v": ["segundos atrás"] } } }, { "l": "ro", "t": { "a few seconds ago": { "v": ["acum câteva secunde"] }, "sec. ago": { "v": ["sec. în urmă"] }, "seconds ago": { "v": ["secunde în urmă"] } } }, { "l": "ru", "t": { "a few seconds ago": { "v": ["несколько секунд назад"] }, "sec. ago": { "v": ["сек. назад"] }, "seconds ago": { "v": ["секунд назад"] } } }, { "l": "sk", "t": { "a few seconds ago": { "v": ["pred chvíľou"] }, "sec. ago": { "v": ["pred pár sekundami"] }, "seconds ago": { "v": ["pred sekundami"] } } }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "a few seconds ago": { "v": ["пре неколико секунди"] }, "sec. ago": { "v": ["сек. раније"] }, "seconds ago": { "v": ["секунди раније"] } } }, { "l": "sv", "t": { "a few seconds ago": { "v": ["några sekunder sedan"] }, "sec. ago": { "v": ["sek. sedan"] }, "seconds ago": { "v": ["sekunder sedan"] } } }, { "l": "tr", "t": { "a few seconds ago": { "v": ["birkaç saniye önce"] }, "sec. ago": { "v": ["sn. önce"] }, "seconds ago": { "v": ["saniye önce"] } } }, { "l": "uk", "t": { "a few seconds ago": { "v": ["декілька секунд тому"] }, "sec. ago": { "v": ["с тому"] }, "seconds ago": { "v": ["с тому"] } } }, { "l": "uz", "t": { "a few seconds ago": { "v": ["bir necha soniya oldin"] }, "sec. ago": { "v": ["sek. oldin"] }, "seconds ago": { "v": ["soniyalar oldin"] } } }, { "l": "zh-CN", "t": { "a few seconds ago": { "v": ["几秒前"] }, "sec. ago": { "v": ["几秒前"] }, "seconds ago": { "v": ["几秒前"] } } }, { "l": "zh-HK", "t": { "a few seconds ago": { "v": ["幾秒前"] }, "sec. ago": { "v": ["秒前"] }, "seconds ago": { "v": ["秒前"] } } }, { "l": "zh-TW", "t": { "a few seconds ago": { "v": ["幾秒前"] }, "sec. ago": { "v": ["秒前"] }, "seconds ago": { "v": ["秒前"] } } }];
const t3 = [{ "l": "ar", "t": { "Acapulco": { "v": ["بازلائي مطفي"] }, "Blue Violet": { "v": ["بنفسجي مشعشع"] }, "Boston Blue": { "v": ["سماوي مطفي"] }, "Deluge": { "v": ["بنفسجي مطفي"] }, "Feldspar": { "v": ["وردي صخري"] }, "Gold": { "v": ["ذهبي"] }, "Mariner": { "v": ["أزرق بحري"] }, "Nextcloud blue": { "v": ["أزرق نكست كلاود"] }, "Olivine": { "v": ["زيتي"] }, "Purple": { "v": ["بنفسجي"] }, "Rosy brown": { "v": ["بُنِّي زهري"] }, "Whiskey": { "v": ["نبيذي"] } } }, { "l": "ast", "t": { "Acapulco": { "v": ["Acapulcu"] }, "Blue Violet": { "v": ["Viola azulao"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Oru"] }, "Mariner": { "v": ["Marineru"] }, "Nextcloud blue": { "v": ["Nextcloud azul"] }, "Olivine": { "v": ["Olivina"] }, "Purple": { "v": ["Moráu"] }, "Rosy brown": { "v": ["Marrón arrosao"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Acapulco": { "v": ["Akapulko"] }, "Black": { "v": ["Černá"] }, "Blue Violet": { "v": ["Modrofialová"] }, "Boston Blue": { "v": ["Bostonská modrá"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Živicová"] }, "Gold": { "v": ["Zlatá"] }, "Mariner": { "v": ["Námořnická"] }, "Nextcloud blue": { "v": ["Nextcloud modrá"] }, "Olivine": { "v": ["Olivínová"] }, "Purple": { "v": ["Fialová"] }, "Rosy brown": { "v": ["Růžovohnědá"] }, "Whiskey": { "v": ["Whisky"] }, "White": { "v": ["Bílá"] } } }, { "l": "cs-CZ", "t": { "Acapulco": { "v": ["Akapulko"] }, "Blue Violet": { "v": ["Modrofialová"] }, "Boston Blue": { "v": ["Bostonská modrá"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Živicová"] }, "Gold": { "v": ["Zlatá"] }, "Mariner": { "v": ["Námořnická"] }, "Nextcloud blue": { "v": ["Nextcloud modrá"] }, "Olivine": { "v": ["Olivínová"] }, "Purple": { "v": ["Fialová"] }, "Rosy brown": { "v": ["Růžovohnědá"] }, "Whiskey": { "v": ["Whisky"] } } }, { "l": "da", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Sort"] }, "Blue Violet": { "v": ["Blue Violet"] }, "Boston Blue": { "v": ["Boston Blue"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Guld"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Nextcloud blue"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Lilla"] }, "Rosy brown": { "v": ["Rosy brown"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Hvid"] } } }, { "l": "de", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Schwarz"] }, "Blue Violet": { "v": ["Blau Violett"] }, "Boston Blue": { "v": ["Boston-Blau"] }, "Deluge": { "v": ["Sintflut"] }, "Feldspar": { "v": ["Feldspat"] }, "Gold": { "v": ["Gold"] }, "Mariner": { "v": ["Seemann"] }, "Nextcloud blue": { "v": ["Nextcloud Blau"] }, "Olivine": { "v": ["Olivin"] }, "Purple": { "v": ["Lila"] }, "Rosy brown": { "v": ["Rosiges Braun"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Weiß"] } } }, { "l": "de-DE", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Schwarz"] }, "Blue Violet": { "v": ["Blau Violett"] }, "Boston Blue": { "v": ["Boston-Blau"] }, "Deluge": { "v": ["Sintflut"] }, "Feldspar": { "v": ["Feldspat"] }, "Gold": { "v": ["Gold"] }, "Mariner": { "v": ["Seemann"] }, "Nextcloud blue": { "v": ["Nextcloud Blau"] }, "Olivine": { "v": ["Olivin"] }, "Purple": { "v": ["Lila"] }, "Rosy brown": { "v": ["Rosiges Braun"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Weiß"] } } }, { "l": "el", "t": { "Acapulco": { "v": ["Ακαπούλκο"] }, "Black": { "v": ["Μαύρο"] }, "Blue Violet": { "v": ["Μπλε Βιολέτ"] }, "Boston Blue": { "v": ["Μπλε Βοστώνης"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Χρυσό"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Μπλε Nextcloud"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Μωβ"] }, "Rosy brown": { "v": ["Ροζ καφέ"] }, "Whiskey": { "v": ["Ουίσκι"] }, "White": { "v": ["Λευκό"] } } }, { "l": "en-GB", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Black"] }, "Blue Violet": { "v": ["Blue Violet"] }, "Boston Blue": { "v": ["Boston Blue"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Gold"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Nextcloud blue"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Purple"] }, "Rosy brown": { "v": ["Rosy brown"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["White"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Violeta Azul"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Diluvio"] }, "Feldspar": { "v": ["Feldespato"] }, "Gold": { "v": ["Oro"] }, "Mariner": { "v": ["Marinero"] }, "Nextcloud blue": { "v": ["Azul Nextcloud"] }, "Olivine": { "v": ["Olivino"] }, "Purple": { "v": ["Púrpura"] }, "Rosy brown": { "v": ["Marrón rosáceo"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "es-AR", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Violeta Azul"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Diluvio"] }, "Feldspar": { "v": ["Feldespato"] }, "Gold": { "v": ["Oro"] }, "Mariner": { "v": ["Marinero"] }, "Nextcloud blue": { "v": ["Azul Nextcloud"] }, "Olivine": { "v": ["Olivino"] }, "Purple": { "v": ["Púrpura"] }, "Rosy brown": { "v": ["Marrón rosáceo"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Violeta Azul"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Diluvio"] }, "Feldspar": { "v": ["Feldespato"] }, "Gold": { "v": ["Oro"] }, "Mariner": { "v": ["Marinero"] }, "Nextcloud blue": { "v": ["Azul Nextcloud"] }, "Olivine": { "v": ["Olivino"] }, "Purple": { "v": ["Púrpura"] }, "Rosy brown": { "v": ["Marrón rosáceo"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "et-EE", "t": { "Acapulco": { "v": ["Acapulco meresinine"] }, "Black": { "v": ["Must"] }, "Blue Violet": { "v": ["Sinakasvioletne"] }, "Boston Blue": { "v": ["Bostoni rohekassinine"] }, "Deluge": { "v": ["Tulvavee lilla"] }, "Feldspar": { "v": ["Põlevkivipruun"] }, "Gold": { "v": ["Kuldne"] }, "Mariner": { "v": ["Meresinine"] }, "Nextcloud blue": { "v": ["Nextcloudi sinine"] }, "Olivine": { "v": ["Oliiviroheline"] }, "Purple": { "v": ["Purpurpunane"] }, "Rosy brown": { "v": ["Roosikarva pruun"] }, "Whiskey": { "v": ["Viskikarva kollakaspruun"] }, "White": { "v": ["Valge"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": { "Acapulco": { "v": ["آکاپولکو"] }, "Blue Violet": { "v": ["بنفش آبی"] }, "Boston Blue": { "v": ["آبی بوستونی"] }, "Deluge": { "v": ["سیل"] }, "Feldspar": { "v": ["فلدسپات"] }, "Gold": { "v": ["طلا"] }, "Mariner": { "v": ["مارینر"] }, "Nextcloud blue": { "v": ["نکس کلود آبی"] }, "Olivine": { "v": ["الیوین"] }, "Purple": { "v": ["بنفش"] }, "Rosy brown": { "v": ["قهوه‌ای رز"] }, "Whiskey": { "v": ["ویسکی"] } } }, { "l": "fi", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Sinivioletti"] }, "Boston Blue": { "v": ["Bostoninsininen"] }, "Deluge": { "v": ["Tulva"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Kulta"] }, "Mariner": { "v": ["Merenkulkija"] }, "Nextcloud blue": { "v": ["Nextcloudin sininen"] }, "Olivine": { "v": ["Oliviini"] }, "Purple": { "v": ["Purppura"] }, "Rosy brown": { "v": ["Ruusunruskea"] }, "Whiskey": { "v": ["Viski"] } } }, { "l": "fr", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Noir"] }, "Blue Violet": { "v": ["Bleu violet"] }, "Boston Blue": { "v": ["Bleu de Boston"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Doré"] }, "Mariner": { "v": ["Marin"] }, "Nextcloud blue": { "v": ["Bleu Nextcloud"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Violet"] }, "Rosy brown": { "v": ["Brun rosé"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Blanc"] } } }, { "l": "ga", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Dubh"] }, "Blue Violet": { "v": ["Gorm Violet"] }, "Boston Blue": { "v": ["Bostún Gorm"] }, "Deluge": { "v": ["Díle"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Óir"] }, "Mariner": { "v": ["Mairnéalach"] }, "Nextcloud blue": { "v": ["Nextcloud gorm"] }, "Olivine": { "v": ["Olaivín"] }, "Purple": { "v": ["Corcra"] }, "Rosy brown": { "v": ["Rosach donn"] }, "Whiskey": { "v": ["Fuisce"] }, "White": { "v": ["Bán"] } } }, { "l": "gl", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Negro"] }, "Blue Violet": { "v": ["Azul violeta"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Dioivo"] }, "Feldspar": { "v": ["Feldespato"] }, "Gold": { "v": ["Ouro"] }, "Mariner": { "v": ["Marino"] }, "Nextcloud blue": { "v": ["Azul Nextcloud"] }, "Olivine": { "v": ["Olivina"] }, "Purple": { "v": ["Púrpura"] }, "Rosy brown": { "v": ["Pardo rosado"] }, "Whiskey": { "v": ["Whisky"] }, "White": { "v": ["Branco"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Crna"] }, "Blue Violet": { "v": ["Plavoljubičasta"] }, "Boston Blue": { "v": ["Bostonsko plava"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Zlatna"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Nextcloud plava"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Ljubičasta"] }, "Rosy brown": { "v": ["Ružičastosmeđa"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Bijela"] } } }, { "l": "hu", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Fekete"] }, "Blue Violet": { "v": ["Kék ibolya"] }, "Boston Blue": { "v": ["Boston kék"] }, "Deluge": { "v": ["Özönvíz"] }, "Feldspar": { "v": ["Földpát"] }, "Gold": { "v": ["Arany"] }, "Mariner": { "v": ["Tengerész"] }, "Nextcloud blue": { "v": ["Nextcloud kék"] }, "Olivine": { "v": ["Olivin"] }, "Purple": { "v": ["Lila"] }, "Rosy brown": { "v": ["Rózsás barna"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Fehér"] } } }, { "l": "id", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Hitam"] }, "Blue Violet": { "v": ["Ungu kebiruan"] }, "Boston Blue": { "v": ["Biru Boston"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Emas"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Biru Nextcloud"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Ungu"] }, "Rosy brown": { "v": ["Cokelat kemerahan"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Putih"] } } }, { "l": "is", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Bláklukka"] }, "Boston Blue": { "v": ["Bostonblátt"] }, "Deluge": { "v": ["Fjólublátt"] }, "Feldspar": { "v": ["Feldspat"] }, "Gold": { "v": ["Gull"] }, "Mariner": { "v": ["Sjóarablátt"] }, "Nextcloud blue": { "v": ["Nextcloud blátt"] }, "Olivine": { "v": ["Ólivín"] }, "Purple": { "v": ["Purpurablátt"] }, "Rosy brown": { "v": ["Rósabrúnt"] }, "Whiskey": { "v": ["Viský"] } } }, { "l": "it", "t": { "Gold": { "v": ["Oro"] }, "Nextcloud blue": { "v": ["Nextcloud blue"] }, "Purple": { "v": ["Viola"] } } }, { "l": "ja", "t": { "Acapulco": { "v": ["アカプルコ"] }, "Black": { "v": ["黒"] }, "Blue Violet": { "v": ["ブルーバイオレット"] }, "Boston Blue": { "v": ["ボストンブルー"] }, "Deluge": { "v": ["豪雨"] }, "Feldspar": { "v": ["長石"] }, "Gold": { "v": ["黄金"] }, "Mariner": { "v": ["船乗り"] }, "Nextcloud blue": { "v": ["ネクストクラウド・ブルー"] }, "Olivine": { "v": ["カンラン石"] }, "Purple": { "v": ["紫色"] }, "Rosy brown": { "v": ["バラ色"] }, "Whiskey": { "v": ["ウイスキー"] }, "White": { "v": ["白"] } } }, { "l": "ja-JP", "t": { "Acapulco": { "v": ["アカプルコ"] }, "Blue Violet": { "v": ["ブルーバイオレット"] }, "Boston Blue": { "v": ["ボストンブルー"] }, "Deluge": { "v": ["豪雨"] }, "Feldspar": { "v": ["長石"] }, "Gold": { "v": ["黄金"] }, "Mariner": { "v": ["船乗り"] }, "Nextcloud blue": { "v": ["ネクストクラウド・ブルー"] }, "Olivine": { "v": ["カンラン石"] }, "Purple": { "v": ["紫色"] }, "Rosy brown": { "v": ["バラ色"] }, "Whiskey": { "v": ["ウイスキー"] } } }, { "l": "ko", "t": { "Acapulco": { "v": ["아카풀코"] }, "Black": { "v": ["검정"] }, "Blue Violet": { "v": ["푸른 보라"] }, "Boston Blue": { "v": ["보스턴 블루"] }, "Deluge": { "v": ["폭우"] }, "Feldspar": { "v": ["장석"] }, "Gold": { "v": ["금"] }, "Mariner": { "v": ["뱃사람"] }, "Nextcloud blue": { "v": ["Nextcloud 파랑"] }, "Olivine": { "v": ["감람석"] }, "Purple": { "v": ["보라"] }, "Rosy brown": { "v": ["로지 브라운"] }, "Whiskey": { "v": ["위스키"] }, "White": { "v": ["하양"] } } }, { "l": "lo", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["ສີດຳ"] }, "Blue Violet": { "v": ["Blue Violet"] }, "Boston Blue": { "v": ["Boston Blue"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["ສີຄຳ"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["ສີຟ້າ Nextcloud"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["ສີມ່ວງ"] }, "Rosy brown": { "v": ["Rosy brown"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["ສີຂາວ"] } } }, { "l": "lt-LT", "t": { "Acapulco": { "v": ['"Acapulco"'] }, "Black": { "v": ["Juoda"] }, "Blue Violet": { "v": ["Mėlyna-violetinė"] }, "Boston Blue": { "v": ['"Boston Blue"'] }, "Deluge": { "v": ['"Deluge"'] }, "Feldspar": { "v": ['"Feldspar"'] }, "Gold": { "v": ["Auksas"] }, "Mariner": { "v": ['"Mariner"'] }, "Nextcloud blue": { "v": ['"Nextcloud" mėlyna'] }, "Olivine": { "v": ['"Olivine"'] }, "Purple": { "v": ["Violetinė"] }, "Rosy brown": { "v": ["Rožiniai rudas"] }, "Whiskey": { "v": ['"Whiskey"'] }, "White": { "v": ["Balta"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Acapulco": { "v": ["Акапулко"] }, "Black": { "v": ["Црно"] }, "Blue Violet": { "v": ["Сино Виолетова"] }, "Boston Blue": { "v": ["Бостон Сина"] }, "Deluge": { "v": ["Делуџ"] }, "Feldspar": { "v": ["Фелдспар"] }, "Gold": { "v": ["Златна"] }, "Mariner": { "v": ["Маринер"] }, "Nextcloud blue": { "v": ["Nextcloud сина"] }, "Olivine": { "v": ["Оливин"] }, "Purple": { "v": ["Виолетова"] }, "Rosy brown": { "v": ["Розево-кафеава"] }, "Whiskey": { "v": ["Виски"] }, "White": { "v": ["Бела"] } } }, { "l": "mn", "t": { "Acapulco": { "v": ["Акапулько"] }, "Black": { "v": ["Хар"] }, "Blue Violet": { "v": ["Цэнхэр ягаан"] }, "Boston Blue": { "v": ["Бостон цэнхэр"] }, "Deluge": { "v": ["Делюж"] }, "Feldspar": { "v": ["Фельдспар"] }, "Gold": { "v": ["Алтан"] }, "Mariner": { "v": ["Маринер"] }, "Nextcloud blue": { "v": ["Nextcloud цэнхэр"] }, "Olivine": { "v": ["Оливин"] }, "Purple": { "v": ["Нил ягаан"] }, "Rosy brown": { "v": ["Ягаан бор"] }, "Whiskey": { "v": ["Виски"] }, "White": { "v": ["Цагаан"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Blå fiolett"] }, "Boston Blue": { "v": ["Boston blå"] }, "Deluge": { "v": ["Syndflod"] }, "Feldspar": { "v": ["Feltspat"] }, "Gold": { "v": ["Gull"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Nextcloud-blå"] }, "Olivine": { "v": ["Olivin"] }, "Purple": { "v": ["Lilla"] }, "Rosy brown": { "v": ["Rosenrød brun"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "nl", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Zwart"] }, "Blue Violet": { "v": ["Blauw Paars"] }, "Boston Blue": { "v": ["Boston Blauw"] }, "Deluge": { "v": ["Overlopen"] }, "Feldspar": { "v": ["Veldspaat"] }, "Gold": { "v": ["Goud"] }, "Mariner": { "v": ["Marineblauw"] }, "Nextcloud blue": { "v": ["Nextcloud blauw"] }, "Olivine": { "v": ["Olivijn"] }, "Purple": { "v": ["Paars"] }, "Rosy brown": { "v": ["Rozig bruin"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Wit"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Niebieski fiolet"] }, "Boston Blue": { "v": ["Błękit Bostonu"] }, "Deluge": { "v": ["Potop"] }, "Feldspar": { "v": ["Skaleń"] }, "Gold": { "v": ["Złote"] }, "Mariner": { "v": ["Marynarz"] }, "Nextcloud blue": { "v": ["Niebieskie Nextcloud"] }, "Olivine": { "v": ["Oliwin"] }, "Purple": { "v": ["Fioletowy"] }, "Rosy brown": { "v": ["Różowy brąz"] }, "Whiskey": { "v": ["Whisky"] } } }, { "l": "pt-BR", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Preto"] }, "Blue Violet": { "v": ["Violeta Azul"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspato"] }, "Gold": { "v": ["Ouro"] }, "Mariner": { "v": ["Marinheiro"] }, "Nextcloud blue": { "v": ["Azul Nextcloud"] }, "Olivine": { "v": ["Olivina"] }, "Purple": { "v": ["Roxo"] }, "Rosy brown": { "v": ["Castanho rosado"] }, "Whiskey": { "v": ["Uísque"] }, "White": { "v": ["Branco"] } } }, { "l": "pt-PT", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Azul violeta"] }, "Boston Blue": { "v": ["Azul Boston"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Ouro"] }, "Mariner": { "v": ["Mariner"] }, "Nextcloud blue": { "v": ["Nextcloud azul"] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Púrpura"] }, "Rosy brown": { "v": ["Castanho rosado"] }, "Whiskey": { "v": ["Whiskey"] } } }, { "l": "ro", "t": { "Gold": { "v": ["Aur"] }, "Nextcloud blue": { "v": ["Nextcloud albastru"] }, "Purple": { "v": ["Purpuriu"] } } }, { "l": "ru", "t": { "Acapulco": { "v": ["Акапулько"] }, "Black": { "v": ["Черный"] }, "Blue Violet": { "v": ["Синий фиолет"] }, "Boston Blue": { "v": ["Синий Бостон"] }, "Deluge": { "v": ["Перламутрово-фиолетовый"] }, "Feldspar": { "v": ["Античная латунь"] }, "Gold": { "v": ["Золотой"] }, "Mariner": { "v": ["Морской"] }, "Nextcloud blue": { "v": ["Nextcloud голубой"] }, "Olivine": { "v": [" Оливковый"] }, "Purple": { "v": ["Фиолетовый"] }, "Rosy brown": { "v": ["Розово-коричневый"] }, "Whiskey": { "v": ["Виски"] }, "White": { "v": ["Белый"] } } }, { "l": "sk", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["Modro fialová"] }, "Boston Blue": { "v": ["Bostonská modrá"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["Živec"] }, "Gold": { "v": ["Zlatá"] }, "Mariner": { "v": ["Námorník"] }, "Nextcloud blue": { "v": ["Nextcloud modrá"] }, "Olivine": { "v": ["Olivová"] }, "Purple": { "v": ["Fialová"] }, "Rosy brown": { "v": ["Ružovo hnedá"] }, "Whiskey": { "v": ["Whisky"] } } }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Acapulco": { "v": ["Акапулко"] }, "Black": { "v": ["Црно"] }, "Blue Violet": { "v": ["Плаво љубичаста"] }, "Boston Blue": { "v": ["Бостон плава"] }, "Deluge": { "v": ["Поплава"] }, "Feldspar": { "v": ["Фелдспар"] }, "Gold": { "v": ["Злато"] }, "Mariner": { "v": ["Морнар"] }, "Nextcloud blue": { "v": ["Nextcloud плава"] }, "Olivine": { "v": ["Маслинаста"] }, "Purple": { "v": ["Пурпурна"] }, "Rosy brown": { "v": ["Роси браон"] }, "Whiskey": { "v": ["Виски"] }, "White": { "v": ["Бело"] } } }, { "l": "sv", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["Svart"] }, "Blue Violet": { "v": ["Blåviolett"] }, "Boston Blue": { "v": ["Bostonblå"] }, "Deluge": { "v": ["Skyfallsblå"] }, "Feldspar": { "v": ["Fältspat"] }, "Gold": { "v": ["Guld"] }, "Mariner": { "v": ["Marinblå"] }, "Nextcloud blue": { "v": ["Nextcloud-blå"] }, "Olivine": { "v": ["Olivin"] }, "Purple": { "v": ["Lila"] }, "Rosy brown": { "v": ["Rosabrun"] }, "Whiskey": { "v": ["Whisky"] }, "White": { "v": ["Vit"] } } }, { "l": "tr", "t": { "Acapulco": { "v": ["Akapulko"] }, "Black": { "v": ["Siyah"] }, "Blue Violet": { "v": ["Mavi mor"] }, "Boston Blue": { "v": ["Boston mavisi"] }, "Deluge": { "v": ["Sel"] }, "Feldspar": { "v": ["Feldispat"] }, "Gold": { "v": ["Altın"] }, "Mariner": { "v": ["Denizci"] }, "Nextcloud blue": { "v": ["Nextcloud mavi"] }, "Olivine": { "v": ["Zeytinlik"] }, "Purple": { "v": ["Mor"] }, "Rosy brown": { "v": ["Kırmızımsı kahverengi"] }, "Whiskey": { "v": ["Viski"] }, "White": { "v": ["Beyaz"] } } }, { "l": "uk", "t": { "Acapulco": { "v": ["Акапулько"] }, "Blue Violet": { "v": ["Блакитна фіалка"] }, "Boston Blue": { "v": ["Бостонський синій"] }, "Deluge": { "v": ["Злива"] }, "Feldspar": { "v": ["Польові шпати"] }, "Gold": { "v": ["Золотий"] }, "Mariner": { "v": ["Морський"] }, "Nextcloud blue": { "v": ["Блакитний Nextcloud"] }, "Olivine": { "v": ["Олива"] }, "Purple": { "v": ["Фіолетовий"] }, "Rosy brown": { "v": ["Темно-рожевий"] }, "Whiskey": { "v": ["Кола"] } } }, { "l": "uz", "t": { "Acapulco": { "v": ["Akapulko"] }, "Black": { "v": ["Qora"] }, "Blue Violet": { "v": ["Moviy binafsha"] }, "Boston Blue": { "v": ["Boston ko'k"] }, "Deluge": { "v": ["To'fon"] }, "Feldspar": { "v": ["Feldspar"] }, "Gold": { "v": ["Oltin"] }, "Mariner": { "v": ["Dengizchi"] }, "Nextcloud blue": { "v": ["Ko'k Nextcloud "] }, "Olivine": { "v": ["Olivine"] }, "Purple": { "v": ["Binafsha"] }, "Rosy brown": { "v": ["Qizil jigarrang"] }, "Whiskey": { "v": ["Whiskey"] }, "White": { "v": ["Oq"] } } }, { "l": "zh-CN", "t": { "Acapulco": { "v": ["Acapulco"] }, "Blue Violet": { "v": ["瓦罗兰特蓝"] }, "Boston Blue": { "v": ["波士顿蓝"] }, "Deluge": { "v": ["洪水色"] }, "Feldspar": { "v": ["长石"] }, "Gold": { "v": ["金色"] }, "Mariner": { "v": ["水手"] }, "Nextcloud blue": { "v": ["Nextcloud 蓝"] }, "Olivine": { "v": ["橄榄石色"] }, "Purple": { "v": ["紫色"] }, "Rosy brown": { "v": ["玫瑰棕色"] }, "Whiskey": { "v": ["威士忌"] } } }, { "l": "zh-HK", "t": { "Acapulco": { "v": ["阿卡普爾科"] }, "Black": { "v": ["黑色"] }, "Blue Violet": { "v": ["藍紫色"] }, "Boston Blue": { "v": ["波士頓藍"] }, "Deluge": { "v": ["大洪水"] }, "Feldspar": { "v": ["長石"] }, "Gold": { "v": ["Gold"] }, "Mariner": { "v": ["海軍藍"] }, "Nextcloud blue": { "v": ["Nextcloud 藍色"] }, "Olivine": { "v": ["橄欖石色"] }, "Purple": { "v": ["紫色"] }, "Rosy brown": { "v": ["玫瑰棕色"] }, "Whiskey": { "v": ["威士忌"] }, "White": { "v": ["白色"] } } }, { "l": "zh-TW", "t": { "Acapulco": { "v": ["Acapulco"] }, "Black": { "v": ["黑色"] }, "Blue Violet": { "v": ["藍紫色"] }, "Boston Blue": { "v": ["波士頓藍"] }, "Deluge": { "v": ["Deluge"] }, "Feldspar": { "v": ["長石"] }, "Gold": { "v": ["金色"] }, "Mariner": { "v": ["海軍藍"] }, "Nextcloud blue": { "v": ["Nextcloud 藍色"] }, "Olivine": { "v": ["橄欖石色"] }, "Purple": { "v": ["紫色"] }, "Rosy brown": { "v": ["玫瑰棕色"] }, "Whiskey": { "v": ["威士忌"] }, "White": { "v": ["白色"] } } }];
const t4 = [{ "l": "ar", "t": { "Actions": { "v": ["إجراءات"] } } }, { "l": "ast", "t": { "Actions": { "v": ["Aiciones"] } } }, { "l": "br", "t": { "Actions": { "v": ["Oberioù"] } } }, { "l": "ca", "t": { "Actions": { "v": ["Accions"] } } }, { "l": "cs", "t": { "Actions": { "v": ["Akce"] } } }, { "l": "cs-CZ", "t": { "Actions": { "v": ["Akce"] } } }, { "l": "da", "t": { "Actions": { "v": ["Handlinger"] } } }, { "l": "de", "t": { "Actions": { "v": ["Aktionen"] } } }, { "l": "de-DE", "t": { "Actions": { "v": ["Aktionen"] } } }, { "l": "el", "t": { "Actions": { "v": ["Ενέργειες"] } } }, { "l": "en-GB", "t": { "Actions": { "v": ["Actions"] } } }, { "l": "eo", "t": { "Actions": { "v": ["Agoj"] } } }, { "l": "es", "t": { "Actions": { "v": ["Acciones"] } } }, { "l": "es-AR", "t": { "Actions": { "v": ["Acciones"] } } }, { "l": "es-EC", "t": { "Actions": { "v": ["Acciones"] } } }, { "l": "es-MX", "t": { "Actions": { "v": ["Acciones"] } } }, { "l": "et-EE", "t": { "Actions": { "v": ["Tegevus"] } } }, { "l": "eu", "t": { "Actions": { "v": ["Ekintzak"] } } }, { "l": "fa", "t": { "Actions": { "v": ["کنش‌ها"] } } }, { "l": "fi", "t": { "Actions": { "v": ["Toiminnot"] } } }, { "l": "fr", "t": { "Actions": { "v": ["Actions"] } } }, { "l": "ga", "t": { "Actions": { "v": ["Gníomhartha"] } } }, { "l": "gl", "t": { "Actions": { "v": ["Accións"] } } }, { "l": "he", "t": { "Actions": { "v": ["פעולות"] } } }, { "l": "hr", "t": { "Actions": { "v": ["Radnje"] } } }, { "l": "hu", "t": { "Actions": { "v": ["Műveletek"] } } }, { "l": "id", "t": { "Actions": { "v": ["Tindakan"] } } }, { "l": "is", "t": { "Actions": { "v": ["Aðgerðir"] } } }, { "l": "it", "t": { "Actions": { "v": ["Azioni"] } } }, { "l": "ja", "t": { "Actions": { "v": ["操作"] } } }, { "l": "ja-JP", "t": { "Actions": { "v": ["操作"] } } }, { "l": "ko", "t": { "Actions": { "v": ["동작"] } } }, { "l": "lo", "t": { "Actions": { "v": ["ການກະທຳ"] } } }, { "l": "lt-LT", "t": { "Actions": { "v": ["Veiksmai"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Actions": { "v": ["Акции"] } } }, { "l": "mn", "t": { "Actions": { "v": ["Үйлдлүүд"] } } }, { "l": "my", "t": { "Actions": { "v": ["လုပ်ဆောင်ချက်များ"] } } }, { "l": "nb", "t": { "Actions": { "v": ["Handlinger"] } } }, { "l": "nl", "t": { "Actions": { "v": ["Acties"] } } }, { "l": "oc", "t": { "Actions": { "v": ["Accions"] } } }, { "l": "pl", "t": { "Actions": { "v": ["Działania"] } } }, { "l": "pt-BR", "t": { "Actions": { "v": ["Ações"] } } }, { "l": "pt-PT", "t": { "Actions": { "v": ["Ações"] } } }, { "l": "ro", "t": { "Actions": { "v": ["Acțiuni"] } } }, { "l": "ru", "t": { "Actions": { "v": ["Действия "] } } }, { "l": "sk", "t": { "Actions": { "v": ["Akcie"] } } }, { "l": "sl", "t": { "Actions": { "v": ["Dejanja"] } } }, { "l": "sr", "t": { "Actions": { "v": ["Радње"] } } }, { "l": "sv", "t": { "Actions": { "v": ["Åtgärder"] } } }, { "l": "tr", "t": { "Actions": { "v": ["İşlemler"] } } }, { "l": "uk", "t": { "Actions": { "v": ["Дії"] } } }, { "l": "uz", "t": { "Actions": { "v": ["Harakatlar"] } } }, { "l": "zh-CN", "t": { "Actions": { "v": ["行为"] } } }, { "l": "zh-HK", "t": { "Actions": { "v": ["動作"] } } }, { "l": "zh-TW", "t": { "Actions": { "v": ["動作"] } } }];
const t13 = [{ "l": "ar", "t": { "Calendar icon": { "v": ["أيقونة التقويم"] }, "Cancel": { "v": ["إلغاء"] }, "Clear value": { "v": ["مَحو القيمة"] }, "Close time Picker": { "v": ["إغلاق لاقط الوقت"] }, "Datepicker input": { "v": ["مُدخَلات لاقط التاريخ"] }, "Datepicker menu": { "v": ["قائمة لاقط التاريخ"] }, "Decrement hours": { "v": ["إنقاص الساعات"] }, "Decrement minutes": { "v": ["إنقاص الدقائق"] }, "Decrement seconds": { "v": ["إنقاص الثواني"] }, "Increment hours": { "v": ["زيادة الساعات"] }, "Increment minutes": { "v": ["زيادة الدقائق"] }, "Increment seconds": { "v": ["زيادة الثواني"] }, "Month picker": { "v": ["لاقط الشهر"] }, "Month picker overlay": { "v": ["تراكب لاقط الشهر"] }, "Next month": { "v": ["الشهر القادم"] }, "Next year": { "v": ["السنة القادمة"] }, "Now": { "v": ["الآن"] }, "Open hours overlay": { "v": ["فتح تراكب الساعات "] }, "Open minutes overlay": { "v": ["فتح تراكب الدقائق"] }, "Open months overlay": { "v": ["فتح تراكب الشهور"] }, "Open seconds overlay": { "v": ["فتح تراكب الثواني"] }, "Open time picker": { "v": ["فتح لاقط الوقت"] }, "Open years overlay": { "v": ["فتح تراكب السنوات"] }, "Pick": { "v": ["إلتقاط"] }, "Previous month": { "v": ["الشهر الماضي"] }, "Previous year": { "v": ["السنة الماضية"] }, "Select date": { "v": ["إختيار التاريخ"] }, "Select date and time": { "v": ["إختيار التاريخ والوقت"] }, "Select month": { "v": ["إختيار الشهر"] }, "Select time": { "v": ["إختيار الوقت"] }, "Select time range": { "v": ["إختيار المدى الزمني"] }, "Select week": { "v": ["إختيار الأسبوع"] }, "Select year": { "v": ["إختيار السنة"] }, "Switch AM/PM mode": { "v": ["تبديل وضعية صباحاً/مساءً"] }, "Time picker": { "v": ["لاقط الوقت"] }, "Toggle overlay": { "v": ["تبديل التراكب"] }, "W": { "v": ["أ"] }, "Year picker": { "v": ["لاقط السنة"] }, "Year picker overlay": { "v": ["تراكب لاقط السنة"] } } }, { "l": "ast", "t": {} }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Calendar icon": { "v": ["Ikona kalendáře"] }, "Cancel": { "v": ["Storno"] }, "Clear value": { "v": ["Vyčistit hodnotu"] }, "Close time Picker": { "v": ["Zavřít výběr času"] }, "Datepicker input": { "v": ["Vstup výběru data"] }, "Datepicker menu": { "v": ["Nabídka výběru data"] }, "Decrement hours": { "v": ["Snížit hodiny"] }, "Decrement minutes": { "v": ["Snížit minuty"] }, "Decrement seconds": { "v": ["Snížit sekundy"] }, "Increment hours": { "v": ["Zvýšit hodiny"] }, "Increment minutes": { "v": ["Zvýšit minuty"] }, "Increment seconds": { "v": ["Zvýšit sekundy"] }, "Month picker": { "v": ["Výběr měsíce"] }, "Month picker overlay": { "v": ["Překryvné okno výběru měsíce"] }, "Next month": { "v": ["Příští měsíc"] }, "Next year": { "v": ["Příští rok"] }, "Now": { "v": ["Nyní"] }, "Open hours overlay": { "v": ["Otevřít překryvné okno hodin"] }, "Open minutes overlay": { "v": ["Otevřít překryvné okno minut"] }, "Open months overlay": { "v": ["Otevřít překryvné okno měsíců"] }, "Open seconds overlay": { "v": ["Otevřít překryvné okno sekund"] }, "Open time picker": { "v": ["Otevřít výběr času"] }, "Open years overlay": { "v": ["Otevřít překryvné okno roku"] }, "Pick": { "v": ["Vybrat"] }, "Previous month": { "v": ["Předchozí měsíc"] }, "Previous year": { "v": ["Předchozí rok"] }, "Select date": { "v": ["Vybrat datum"] }, "Select date and time": { "v": ["Vybrat datum a čas"] }, "Select month": { "v": ["Vybrat měsíc"] }, "Select time": { "v": ["Vybrat čas"] }, "Select time range": { "v": ["Vybrat časový rozsah"] }, "Select week": { "v": ["Vybrat týden"] }, "Select year": { "v": ["Vybrat rok"] }, "Switch AM/PM mode": { "v": ["Přepnout režim dopo/odpoledne"] }, "Time picker": { "v": ["Výběr času"] }, "Time zone": { "v": ["Časové pásmo"] }, "Toggle overlay": { "v": ["Vyp/zap. překryvné okno"] }, "W": { "v": ["T"] }, "Year picker": { "v": ["Výběr roku"] }, "Year picker overlay": { "v": ["Překryvné okno výběru roku"] } } }, { "l": "cs-CZ", "t": {} }, { "l": "da", "t": { "Calendar icon": { "v": ["Kalenderikon"] }, "Cancel": { "v": ["Annullér"] }, "Clear value": { "v": ["Klar værdi"] }, "Close time Picker": { "v": ["Nærtid Picker"] }, "Datepicker input": { "v": ["Datapicker input"] }, "Datepicker menu": { "v": ["Datapicker menu"] }, "Decrement hours": { "v": ["Formindsk timer"] }, "Decrement minutes": { "v": ["Formindsk minutter"] }, "Decrement seconds": { "v": ["Formindsk sekunder"] }, "Increment hours": { "v": ["Forøg timer"] }, "Increment minutes": { "v": ["Forøg minutter"] }, "Increment seconds": { "v": ["Forøg sekunder"] }, "Month picker": { "v": ["Månedsvælger"] }, "Month picker overlay": { "v": ["Måneder vælger overlay"] }, "Next month": { "v": ["Næste måned"] }, "Next year": { "v": ["Næste år"] }, "Now": { "v": ["Nu"] }, "Open hours overlay": { "v": ["Åbne timer overlay"] }, "Open minutes overlay": { "v": ["Åbn minutter overlay"] }, "Open months overlay": { "v": ["Åbne måneder overlay"] }, "Open seconds overlay": { "v": ["Åbne sekunder overlay"] }, "Open time picker": { "v": ["Åbent tidsvælger"] }, "Open years overlay": { "v": ["Åbne år overlay"] }, "Pick": { "v": ["Vælg"] }, "Previous month": { "v": ["Forrige måned"] }, "Previous year": { "v": ["Foregående år"] }, "Select date": { "v": ["Vælg dato"] }, "Select date and time": { "v": ["Vælg dato og tidspunkt"] }, "Select month": { "v": ["Vælg måned"] }, "Select time": { "v": ["Vælg tid"] }, "Select time range": { "v": ["Vælg tidsinterval"] }, "Select week": { "v": ["Vælg uge"] }, "Select year": { "v": ["Vælg år"] }, "Switch AM/PM mode": { "v": ["Skift AM/PM-tilstand"] }, "Time picker": { "v": ["Tidsvælger"] }, "Time zone": { "v": ["Tidszone"] }, "Toggle overlay": { "v": ["Slå overlay til / fra"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["År vælger"] }, "Year picker overlay": { "v": ["År vælger overlay"] } } }, { "l": "de", "t": { "Calendar icon": { "v": ["Kalendersymbol"] }, "Cancel": { "v": ["Abbrechen"] }, "Clear value": { "v": ["Wert löschen"] }, "Close time Picker": { "v": ["Zeitauswahl schließen"] }, "Datepicker input": { "v": ["Eingabe Datumsauswahl"] }, "Datepicker menu": { "v": ["Menü Datumsauswahl"] }, "Decrement hours": { "v": ["Stunden verringern"] }, "Decrement minutes": { "v": ["Minuten verringern"] }, "Decrement seconds": { "v": ["Sekunden verringern"] }, "Increment hours": { "v": ["Stunden hochzählen"] }, "Increment minutes": { "v": ["Minuten hochzählen"] }, "Increment seconds": { "v": ["Sekunden hochzählen"] }, "Month picker": { "v": ["Monatsauswahl"] }, "Month picker overlay": { "v": ["Monatsauswahl-Overlay"] }, "Next month": { "v": ["Nächster Monat"] }, "Next year": { "v": ["Nächstes Jahr"] }, "Now": { "v": ["Jetzt"] }, "Open hours overlay": { "v": ["Stunden-Overlay öffnen"] }, "Open minutes overlay": { "v": ["Minuten-Overlay öffnen"] }, "Open months overlay": { "v": ["Monate-Overlay öffnen"] }, "Open seconds overlay": { "v": ["Sekunden-Overlay öffnen"] }, "Open time picker": { "v": ["Zeitauswahl öffnen"] }, "Open years overlay": { "v": ["Jahre-Overlay öffnen"] }, "Pick": { "v": ["Auswählen"] }, "Previous month": { "v": ["Vorheriger Monat"] }, "Previous year": { "v": ["Vorheriges Jahr"] }, "Select date": { "v": ["Datum auswählen"] }, "Select date and time": { "v": ["Datum und Uhrzeit auswählen"] }, "Select month": { "v": ["Monat auswählen"] }, "Select time": { "v": ["Uhrzeit auswählen"] }, "Select time range": { "v": ["Zeitspanne auswählen"] }, "Select week": { "v": ["Woche auswählen"] }, "Select year": { "v": ["Jahr auswählen"] }, "Switch AM/PM mode": { "v": ["Zwischen AM/PM-Modus wechseln"] }, "Time picker": { "v": ["Zeitauswahl"] }, "Time zone": { "v": ["Zeitzone"] }, "Toggle overlay": { "v": ["Overlay umschalten"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Jahresauswahl"] }, "Year picker overlay": { "v": ["Jahre-Overlay öffnen"] } } }, { "l": "de-DE", "t": { "Calendar icon": { "v": ["Kalendersymbol"] }, "Cancel": { "v": ["Abbrechen"] }, "Clear value": { "v": ["Wert löschen"] }, "Close time Picker": { "v": ["Zeitauswahl schließen"] }, "Datepicker input": { "v": ["Eingabe Datumsauswahl"] }, "Datepicker menu": { "v": ["Menü Datumsauswahl"] }, "Decrement hours": { "v": ["Stunden verringern"] }, "Decrement minutes": { "v": ["Minuten verringern"] }, "Decrement seconds": { "v": ["Sekunden verringern"] }, "Increment hours": { "v": ["Stunden hochzählen"] }, "Increment minutes": { "v": ["Minuten hochzählen"] }, "Increment seconds": { "v": ["Sekunden hochzählen"] }, "Month picker": { "v": ["Monatsauswahl"] }, "Month picker overlay": { "v": ["Monatsauswahl-Overlay"] }, "Next month": { "v": ["Nächster Monat"] }, "Next year": { "v": ["Nächstes Jahr"] }, "Now": { "v": ["Jetzt"] }, "Open hours overlay": { "v": ["Stunden-Overlay öffnen"] }, "Open minutes overlay": { "v": ["Minuten-Overlay öffnen"] }, "Open months overlay": { "v": ["Monate-Overlay öffnen"] }, "Open seconds overlay": { "v": ["Sekunden-Overlay öffnen"] }, "Open time picker": { "v": ["Zeitauswahl öffnen"] }, "Open years overlay": { "v": ["Jahre-Overlay öffnen"] }, "Pick": { "v": ["Auswählen"] }, "Previous month": { "v": ["Vorheriger Monat"] }, "Previous year": { "v": ["Vorheriges Jahr"] }, "Select date": { "v": ["Datum auswählen"] }, "Select date and time": { "v": ["Datum und Uhrzeit auswählen"] }, "Select month": { "v": ["Monat auswählen"] }, "Select time": { "v": ["Uhrzeit auswählen"] }, "Select time range": { "v": ["Zeitspanne auswählen"] }, "Select week": { "v": ["Woche auswählen"] }, "Select year": { "v": ["Jahr auswählen"] }, "Switch AM/PM mode": { "v": ["Zwischen AM/PM-Modus wechseln"] }, "Time picker": { "v": ["Zeitauswahl"] }, "Time zone": { "v": ["Zeitzone"] }, "Toggle overlay": { "v": ["Overlay umschalten"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Jahresauswahl"] }, "Year picker overlay": { "v": ["Jahre-Overlay öffnen"] } } }, { "l": "el", "t": { "Calendar icon": { "v": ["Εικονίδιο ημερολογίου"] }, "Cancel": { "v": ["Ακύρωση"] }, "Clear value": { "v": ["Εκκαθάριση αξίας"] }, "Close time Picker": { "v": ["Κλείσιμο επιλογέα ώρας"] }, "Datepicker input": { "v": ["Εισαγωγή ημερομηνίας"] }, "Datepicker menu": { "v": ["Μενού επιλογής ημερομηνίας"] }, "Decrement hours": { "v": ["Μείωση ωρών"] }, "Decrement minutes": { "v": ["Μείωση λεπτών"] }, "Decrement seconds": { "v": ["Μείωση δευτερολέπτων"] }, "Increment hours": { "v": ["Αύξηση ωρών"] }, "Increment minutes": { "v": ["Αύξηση λεπτών"] }, "Increment seconds": { "v": ["Αύξηση δευτερολέπτων"] }, "Month picker": { "v": ["Επιλογή μήνα"] }, "Month picker overlay": { "v": ["Επικάλυψη επιλογής μήνα"] }, "Next month": { "v": ["Επόμενος μήνας"] }, "Next year": { "v": ["Επόμενο έτος"] }, "Now": { "v": ["Τώρα"] }, "Open hours overlay": { "v": ["Άνοιγμα επικάλυψης ωρών"] }, "Open minutes overlay": { "v": ["Άνοιγμα επικάλυψης λεπτών"] }, "Open months overlay": { "v": ["Άνοιγμα επικάλυψης μηνών"] }, "Open seconds overlay": { "v": ["Άνοιγμα επικάλυψης δευτερολέπτων"] }, "Open time picker": { "v": ["Άνοιγμα επιλογέα ώρας"] }, "Open years overlay": { "v": ["Άνοιγμα επικάλυψης ετών"] }, "Pick": { "v": ["Επιλογή"] }, "Previous month": { "v": ["Προηγούμενος μήνας"] }, "Previous year": { "v": ["Προηγούμενο έτος"] }, "Select date": { "v": ["Επιλογή ημερομηνίας"] }, "Select date and time": { "v": ["Επιλογή ημερομηνίας και ώρας"] }, "Select month": { "v": ["Επιλογή μήνα"] }, "Select time": { "v": ["Επιλογή ώρας"] }, "Select time range": { "v": ["Επιλογή χρονικού διαστήματος"] }, "Select week": { "v": ["Επιλογή εβδομάδας"] }, "Select year": { "v": ["Επιλογή έτους"] }, "Switch AM/PM mode": { "v": ["Εναλλαγή λειτουργίας AM/PM"] }, "Time picker": { "v": ["Επιλογή ώρας"] }, "Toggle overlay": { "v": ["Εναλλαγή επικάλυψης"] }, "W": { "v": ["Τε"] }, "Year picker": { "v": ["Επιλογέας έτους"] }, "Year picker overlay": { "v": ["Επικάλυψη επιλογέα έτους"] } } }, { "l": "en-GB", "t": { "Calendar icon": { "v": ["Calendar icon"] }, "Cancel": { "v": ["Cancel"] }, "Clear value": { "v": ["Clear value"] }, "Close time Picker": { "v": ["Close time Picker"] }, "Datepicker input": { "v": ["Datepicker input"] }, "Datepicker menu": { "v": ["Datepicker menu"] }, "Decrement hours": { "v": ["Decrement hours"] }, "Decrement minutes": { "v": ["Decrement minutes"] }, "Decrement seconds": { "v": ["Decrement seconds"] }, "Increment hours": { "v": ["Increment hours"] }, "Increment minutes": { "v": ["Increment minutes"] }, "Increment seconds": { "v": ["Increment seconds"] }, "Month picker": { "v": ["Month picker"] }, "Month picker overlay": { "v": ["Month picker overlay"] }, "Next month": { "v": ["Next month"] }, "Next year": { "v": ["Next year"] }, "Now": { "v": ["Now"] }, "Open hours overlay": { "v": ["Open hours overlay"] }, "Open minutes overlay": { "v": ["Open minutes overlay"] }, "Open months overlay": { "v": ["Open months overlay"] }, "Open seconds overlay": { "v": ["Open seconds overlay"] }, "Open time picker": { "v": ["Open time picker"] }, "Open years overlay": { "v": ["Open years overlay"] }, "Pick": { "v": ["Pick"] }, "Previous month": { "v": ["Previous month"] }, "Previous year": { "v": ["Previous year"] }, "Select date": { "v": ["Select date"] }, "Select date and time": { "v": ["Select date and time"] }, "Select month": { "v": ["Select month"] }, "Select time": { "v": ["Select time"] }, "Select time range": { "v": ["Select time range"] }, "Select week": { "v": ["Select week"] }, "Select year": { "v": ["Select year"] }, "Switch AM/PM mode": { "v": ["Switch AM/PM mode"] }, "Time picker": { "v": ["Time picker"] }, "Time zone": { "v": ["Time zone"] }, "Toggle overlay": { "v": ["Toggle overlay"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Year picker"] }, "Year picker overlay": { "v": ["Year picker overlay"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": {} }, { "l": "es-AR", "t": {} }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": {} }, { "l": "et-EE", "t": { "Calendar icon": { "v": ["Kalendriikoon"] }, "Cancel": { "v": ["Katkesta"] }, "Clear value": { "v": ["Kustuta väärtus"] }, "Close time Picker": { "v": ["Sulge ajavalija"] }, "Datepicker input": { "v": ["Kuupäevavalija sisend"] }, "Datepicker menu": { "v": ["Kuupäevavalija menüü"] }, "Decrement hours": { "v": ["Vähenda tunde"] }, "Decrement minutes": { "v": ["Vähenda minuteid"] }, "Decrement seconds": { "v": ["Vähenda sekundeid"] }, "Increment hours": { "v": ["Suurenda tunde"] }, "Increment minutes": { "v": ["Suurenda minuteid"] }, "Increment seconds": { "v": ["Suurenda sekundeid"] }, "Month picker": { "v": ["Kuupäevavalija"] }, "Month picker overlay": { "v": ["Kuupäevavalija ülekatteaken"] }, "Next month": { "v": ["Järgmine kuu"] }, "Next year": { "v": ["Järgmine aasta"] }, "Now": { "v": ["Praegu"] }, "Open hours overlay": { "v": ["Ava tundide vaade"] }, "Open minutes overlay": { "v": ["Ava minutite vaade"] }, "Open months overlay": { "v": ["Ava kuude vaade"] }, "Open seconds overlay": { "v": ["Ava sekundite vaade"] }, "Open time picker": { "v": ["Ava ajavalija"] }, "Open years overlay": { "v": ["Ava aastate vaade"] }, "Pick": { "v": ["Vali"] }, "Previous month": { "v": ["Eelmine kuu"] }, "Previous year": { "v": ["Eelmine aasta"] }, "Select date": { "v": ["Vali kuupäev"] }, "Select date and time": { "v": ["Vali kuupäev ja kellaaeg"] }, "Select month": { "v": ["Vali kuu"] }, "Select time": { "v": ["Vali aeg"] }, "Select time range": { "v": ["Vali ajavahemik"] }, "Select week": { "v": ["Vali nädal"] }, "Select year": { "v": ["Vali aasta"] }, "Switch AM/PM mode": { "v": ["Vaheta AM/PM kuvamist"] }, "Time picker": { "v": ["Ajavalija"] }, "Time zone": { "v": ["Ajavöönd"] }, "Toggle overlay": { "v": ["Lülita ülekatteaken sisse/välja"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Aastavalija"] }, "Year picker overlay": { "v": ["Aastavavalija ülekatteaken"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": {} }, { "l": "fi", "t": {} }, { "l": "fr", "t": { "Calendar icon": { "v": ["Icône de calendrier"] }, "Cancel": { "v": ["Annuler"] }, "Clear value": { "v": ["Effacer la valeur"] }, "Close time Picker": { "v": ["Fermer le sélecteur de temps"] }, "Datepicker input": { "v": ["Entrée du sélecteur de date"] }, "Datepicker menu": { "v": ["Menu du sélecteur de date"] }, "Decrement hours": { "v": ["Diminuer les heures"] }, "Decrement minutes": { "v": ["Diminuer les minutes"] }, "Decrement seconds": { "v": ["Diminuer les secondes"] }, "Increment hours": { "v": ["Augmenter les heures"] }, "Increment minutes": { "v": ["Augmenter les minutes"] }, "Increment seconds": { "v": ["Augmenter les secondes"] }, "Month picker": { "v": ["Sélecteur de mois"] }, "Month picker overlay": { "v": ["Superposition du sélecteur de mois"] }, "Next month": { "v": ["Mois prochain"] }, "Next year": { "v": ["Année prochaine"] }, "Now": { "v": ["Maintenant"] }, "Open hours overlay": { "v": ["Superposition des heures d'ouverture"] }, "Open minutes overlay": { "v": ["Superposition des minutes d'ouverture"] }, "Open months overlay": { "v": ["Superposition des mois ouverts"] }, "Open seconds overlay": { "v": ["Superposition des secondes ouvertes"] }, "Open time picker": { "v": ["Ouvrir le sélecteur de temps"] }, "Open years overlay": { "v": ["Superposition des années ouvertes"] }, "Pick": { "v": ["Choisir"] }, "Previous month": { "v": ["Mois précédent"] }, "Previous year": { "v": ["Année précédente"] }, "Select date": { "v": ["Sélectionnez la date"] }, "Select date and time": { "v": ["Sélectionnez la date et l'heure"] }, "Select month": { "v": ["Sélectionnez le mois"] }, "Select time": { "v": ["Sélectionnez l'heure"] }, "Select time range": { "v": ["Sélectionnez la plage horaire"] }, "Select week": { "v": ["Sélectionnez la semaine"] }, "Select year": { "v": ["Sélectionnez l'année"] }, "Switch AM/PM mode": { "v": ["Basculer le mode Matin/Après-midi"] }, "Time picker": { "v": ["Sélecteur de temps"] }, "Time zone": { "v": ["Fuseau horaire"] }, "Toggle overlay": { "v": ["Basculer la superposition"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Sélecteur d'année"] }, "Year picker overlay": { "v": ["Superposition du sélecteur d’année"] } } }, { "l": "ga", "t": { "Calendar icon": { "v": ["Deilbhín féilire"] }, "Cancel": { "v": ["Cealaigh"] }, "Clear value": { "v": ["Luach soiléir"] }, "Close time Picker": { "v": ["Roghnóir am dúnta"] }, "Datepicker input": { "v": ["Ionchur datepicker"] }, "Datepicker menu": { "v": ["Roghchlár datepicker"] }, "Decrement hours": { "v": ["Laghdaigh uaireanta"] }, "Decrement minutes": { "v": ["Laghdaigh nóiméid "] }, "Decrement seconds": { "v": ["Laghdaigh soicind"] }, "Increment hours": { "v": ["Méadaigh uaireanta"] }, "Increment minutes": { "v": ["Méadaigh nóiméid"] }, "Increment seconds": { "v": ["Méadaigh soicind"] }, "Month picker": { "v": ["Roghnóir míosa"] }, "Month picker overlay": { "v": ["Forleagan roghnóir míosa"] }, "Next month": { "v": ["An mhí seo chugainn"] }, "Next year": { "v": ["An bhliain seo chugainn"] }, "Now": { "v": ["Anois"] }, "Open hours overlay": { "v": ["Forleagan uaireanta oscailte"] }, "Open minutes overlay": { "v": ["Forleagan nóiméad oscailte"] }, "Open months overlay": { "v": ["Forleagan míonna oscailte"] }, "Open seconds overlay": { "v": ["Soicind oscailte forleagan"] }, "Open time picker": { "v": ["Roghnóir am oscailte"] }, "Open years overlay": { "v": ["Forleagan blianta oscailte"] }, "Pick": { "v": ["Pioc"] }, "Previous month": { "v": ["An mhí roimhe sin"] }, "Previous year": { "v": ["Bhliain roimhe sin"] }, "Select date": { "v": ["Roghnaigh dáta"] }, "Select date and time": { "v": ["Roghnaigh dáta agus am"] }, "Select month": { "v": ["Roghnaigh mí"] }, "Select time": { "v": ["Roghnaigh am"] }, "Select time range": { "v": ["Roghnaigh raon ama"] }, "Select week": { "v": ["Roghnaigh seachtain"] }, "Select year": { "v": ["Roghnaigh bliain"] }, "Switch AM/PM mode": { "v": ["Athraigh mód AM/PM"] }, "Time picker": { "v": ["Roghnóir ama"] }, "Time zone": { "v": ["Crios ama"] }, "Toggle overlay": { "v": ["Scoránaigh forleagan"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Roghnóir bliana"] }, "Year picker overlay": { "v": ["Forleagan roghnóir bliana"] } } }, { "l": "gl", "t": { "Calendar icon": { "v": ["Icona do calendario"] }, "Cancel": { "v": ["Cancelar"] }, "Clear value": { "v": ["Limpar o valor"] }, "Close time Picker": { "v": ["Pechar o Selector de hora"] }, "Datepicker input": { "v": ["Entrada do selector de datas"] }, "Datepicker menu": { "v": ["Menú do selector de datas"] }, "Decrement hours": { "v": ["Diminuír as horas"] }, "Decrement minutes": { "v": ["Diminuír os minutos"] }, "Decrement seconds": { "v": ["Diminuír os segundos"] }, "Increment hours": { "v": ["Aumentar as horas"] }, "Increment minutes": { "v": ["Aumentar os minutos"] }, "Increment seconds": { "v": ["Aumentar os segundos"] }, "Month picker": { "v": ["Selector de mes"] }, "Month picker overlay": { "v": ["Superposición do selector de mes"] }, "Next month": { "v": ["Próximo mes"] }, "Next year": { "v": ["Próximo ano"] }, "Now": { "v": ["Agora"] }, "Open hours overlay": { "v": ["Abrir a superposición de horas"] }, "Open minutes overlay": { "v": ["Abrir a superposición de minutos"] }, "Open months overlay": { "v": ["Abrir a superposición de meses"] }, "Open seconds overlay": { "v": ["Abrir a superposición de segundos"] }, "Open time picker": { "v": ["Abrir o selector de hora"] }, "Open years overlay": { "v": ["Abrir a superposición de anos"] }, "Pick": { "v": ["Escoller"] }, "Previous month": { "v": ["Mes pasado"] }, "Previous year": { "v": ["Ano pasado"] }, "Select date": { "v": ["Seleccione a data"] }, "Select date and time": { "v": ["Seleccione a data e a hora"] }, "Select month": { "v": ["Seleccione o mes"] }, "Select time": { "v": ["Seleccione a hora"] }, "Select time range": { "v": [" Seleccione o intervalo de tempo"] }, "Select week": { "v": ["Seleccione a semana"] }, "Select year": { "v": ["Seleccione o ano"] }, "Switch AM/PM mode": { "v": ["Alternar o modo AM/PM"] }, "Time picker": { "v": ["Selector de hora"] }, "Time zone": { "v": ["Fuso horario"] }, "Toggle overlay": { "v": ["Alternar a sobreposición"] }, "W": { "v": ["S"] }, "Year picker": { "v": ["Selector de ano"] }, "Year picker overlay": { "v": ["Superposición do selector de ano"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "Calendar icon": { "v": ["Ikona kalendara"] }, "Cancel": { "v": ["Otkaži"] }, "Clear value": { "v": ["Očisti vrijednost"] }, "Close time Picker": { "v": ["Zatvori odabir vremena"] }, "Datepicker input": { "v": ["Unos birača datuma"] }, "Datepicker menu": { "v": ["Izbornik birača datuma"] }, "Decrement hours": { "v": ["Smanji sate"] }, "Decrement minutes": { "v": ["Smanji minute"] }, "Decrement seconds": { "v": ["Smanji sekunde"] }, "Increment hours": { "v": ["Povećaj sate"] }, "Increment minutes": { "v": ["Povećaj minute"] }, "Increment seconds": { "v": ["Povećaj sekunde"] }, "Month picker": { "v": ["Odabir mjeseca"] }, "Month picker overlay": { "v": ["Sloj za odabir mjeseca"] }, "Next month": { "v": ["Sljedeći mjesec"] }, "Next year": { "v": ["Sljedeća godina"] }, "Now": { "v": ["Sada"] }, "Open hours overlay": { "v": ["Otvori sloj za odabir sati"] }, "Open minutes overlay": { "v": ["Otvori sloj za odabir minuta"] }, "Open months overlay": { "v": ["Otvori sloj za odabir mjeseci"] }, "Open seconds overlay": { "v": ["Otvori sloj za odabir sekundi"] }, "Open time picker": { "v": ["Otvori birač vremena"] }, "Open years overlay": { "v": ["Otvori sloj za odabir godina"] }, "Pick": { "v": ["Odaberi"] }, "Previous month": { "v": ["Prethodni mjesec"] }, "Previous year": { "v": ["Prethodna godina"] }, "Select date": { "v": ["Odaberi datum"] }, "Select date and time": { "v": ["Odaberi datum i vrijeme"] }, "Select month": { "v": ["Odaberi mjesec"] }, "Select time": { "v": ["Odaberi vrijeme"] }, "Select time range": { "v": ["Odaberi vremenski raspon"] }, "Select week": { "v": ["Odaberi tjedan"] }, "Select year": { "v": ["Odaberi godinu"] }, "Switch AM/PM mode": { "v": ["Prebaci AM/PM način"] }, "Time picker": { "v": ["Odabir vremena"] }, "Time zone": { "v": ["Vremenska zona"] }, "Toggle overlay": { "v": ["Uključi/isključi sloj"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Odabir godine"] }, "Year picker overlay": { "v": ["Sloj za odabir godine"] } } }, { "l": "hu", "t": { "Calendar icon": { "v": ["Naptárikon"] }, "Cancel": { "v": ["Mégse"] }, "Clear value": { "v": ["Érték törlése"] }, "Close time Picker": { "v": ["Időválasztó bezárása"] }, "Datepicker input": { "v": ["Dátumválasztó bemenet"] }, "Datepicker menu": { "v": ["Dátumválasztó menü"] }, "Decrement hours": { "v": ["Órák csökkentése"] }, "Decrement minutes": { "v": ["Percek csökkentése"] }, "Decrement seconds": { "v": ["Másodpercek csökkentése"] }, "Increment hours": { "v": ["Órák növelése"] }, "Increment minutes": { "v": ["Percek növelése"] }, "Increment seconds": { "v": ["Másodpercek növelése"] }, "Month picker": { "v": ["Hónapválasztó"] }, "Month picker overlay": { "v": ["Hónapválasztó átfedés"] }, "Next month": { "v": ["Következő hónap"] }, "Next year": { "v": ["Következő év"] }, "Now": { "v": ["Most"] }, "Open hours overlay": { "v": ["Órák átfedésének megnyitása"] }, "Open minutes overlay": { "v": ["Percek átfedésének megnyitása"] }, "Open months overlay": { "v": ["Hónapok átfedésének megnyitása"] }, "Open seconds overlay": { "v": ["Másodpercek átfedésének megnyitása"] }, "Open time picker": { "v": ["Időválasztó megnyitása"] }, "Open years overlay": { "v": ["Évek átfedésének megnyitása"] }, "Pick": { "v": ["Válasszon"] }, "Previous month": { "v": ["Előző hónap"] }, "Previous year": { "v": ["Előző év"] }, "Select date": { "v": ["Válasszon dátumot"] }, "Select date and time": { "v": ["Válasszon dátumot és időt"] }, "Select month": { "v": ["Válasszon hónapot"] }, "Select time": { "v": ["Válasszon időt"] }, "Select time range": { "v": ["Válasszon időszakot"] }, "Select week": { "v": ["Válasszon hetet"] }, "Select year": { "v": ["Válasszon évet"] }, "Switch AM/PM mode": { "v": ["Váltás de./du. módra"] }, "Time picker": { "v": ["Időválasztó"] }, "Time zone": { "v": ["Időzóna"] }, "Toggle overlay": { "v": ["Átfedés be/ki"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Évválasztó"] }, "Year picker overlay": { "v": ["Évválasztó átfedés"] } } }, { "l": "id", "t": { "Calendar icon": { "v": ["Ikon kalender"] }, "Cancel": { "v": ["Batal"] }, "Clear value": { "v": ["Hapus nilai"] }, "Close time Picker": { "v": ["Tutup pemilih waktu"] }, "Datepicker input": { "v": ["Input pemilih tanggal"] }, "Datepicker menu": { "v": ["Menu pemilih tanggal"] }, "Decrement hours": { "v": ["Kurangi jam"] }, "Decrement minutes": { "v": ["Kurangi menit"] }, "Decrement seconds": { "v": ["Kurangi detik"] }, "Increment hours": { "v": ["Tambah jam"] }, "Increment minutes": { "v": ["Tambah menit"] }, "Increment seconds": { "v": ["Tambah detik"] }, "Month picker": { "v": ["Pemilih bulan"] }, "Month picker overlay": { "v": ["Overlay pemilih bulan"] }, "Next month": { "v": ["Bulan berikutnya"] }, "Next year": { "v": ["Tahun berikutnya"] }, "Now": { "v": ["Sekarang"] }, "Open hours overlay": { "v": ["Buka overlay jam"] }, "Open minutes overlay": { "v": ["Buka overlay menit"] }, "Open months overlay": { "v": ["Buka overlay bulan"] }, "Open seconds overlay": { "v": ["Buka overlay detik"] }, "Open time picker": { "v": ["Buka pemilih waktu"] }, "Open years overlay": { "v": ["Buka overlay tahun"] }, "Pick": { "v": ["Pilih"] }, "Previous month": { "v": ["Bulan sebelumnya"] }, "Previous year": { "v": ["Tahun sebelumnya"] }, "Select date": { "v": ["Pilih tanggal"] }, "Select date and time": { "v": ["Pilih tanggal dan waktu"] }, "Select month": { "v": ["Pilih bulan"] }, "Select time": { "v": ["Pilih waktu"] }, "Select time range": { "v": ["Pilih rentang waktu"] }, "Select week": { "v": ["Pilih minggu"] }, "Select year": { "v": ["Pilih tahun"] }, "Switch AM/PM mode": { "v": ["Ganti mode AM/PM"] }, "Time picker": { "v": ["Pemilih waktu"] }, "Time zone": { "v": ["Zona waktu"] }, "Toggle overlay": { "v": ["Alihkan overlay"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Pemilih tahun"] }, "Year picker overlay": { "v": ["Overlay pemilih tahun"] } } }, { "l": "is", "t": {} }, { "l": "it", "t": {} }, { "l": "ja", "t": { "Calendar icon": { "v": ["カレンダーのアイコン"] }, "Cancel": { "v": ["キャンセル"] }, "Clear value": { "v": ["値をクリア"] }, "Close time Picker": { "v": ["時間ピッカーを閉じる"] }, "Datepicker input": { "v": ["データピッカー入力"] }, "Datepicker menu": { "v": ["データピッカーメニュー"] }, "Decrement hours": { "v": ["時間を減らす"] }, "Decrement minutes": { "v": ["分を減らす"] }, "Decrement seconds": { "v": ["秒を減らす"] }, "Increment hours": { "v": ["時間を増やす"] }, "Increment minutes": { "v": ["分を増やす"] }, "Increment seconds": { "v": ["秒を増やす"] }, "Month picker": { "v": ["月ピッカー"] }, "Month picker overlay": { "v": ["月ピッカーオーバーレイ"] }, "Next month": { "v": ["次月"] }, "Next year": { "v": ["次年"] }, "Now": { "v": ["現在"] }, "Open hours overlay": { "v": ["時間オーバーレイを開く"] }, "Open minutes overlay": { "v": ["分オーバーレイを開く"] }, "Open months overlay": { "v": ["月オーバーレイを開く"] }, "Open seconds overlay": { "v": ["秒オーバーレイを開く"] }, "Open time picker": { "v": ["時間ピッカーを開く"] }, "Open years overlay": { "v": ["年オーバーレイを開く"] }, "Pick": { "v": ["選択"] }, "Previous month": { "v": ["前月"] }, "Previous year": { "v": ["前年"] }, "Select date": { "v": ["日付を選択"] }, "Select date and time": { "v": ["日付と時刻を選択"] }, "Select month": { "v": ["月を選択"] }, "Select time": { "v": ["時刻を選択"] }, "Select time range": { "v": ["時間範囲を選択"] }, "Select week": { "v": ["週を選択"] }, "Select year": { "v": ["年を選択"] }, "Switch AM/PM mode": { "v": ["AM/PMモードの切り替え"] }, "Time picker": { "v": ["時刻ピッカー"] }, "Time zone": { "v": ["タイムゾーン"] }, "Toggle overlay": { "v": ["オーバーレイの切り替え"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["年ピッカー"] }, "Year picker overlay": { "v": ["年ピッカーオーバーレイ"] } } }, { "l": "ja-JP", "t": {} }, { "l": "ko", "t": { "Calendar icon": { "v": ["캘린더 아이콘"] }, "Cancel": { "v": ["취소"] }, "Clear value": { "v": ["값 지우기"] }, "Close time Picker": { "v": ["시간 선택기 닫기"] }, "Datepicker input": { "v": ["날짜 선택기 입력"] }, "Datepicker menu": { "v": ["날짜 입력기 메뉴"] }, "Decrement hours": { "v": ["시 감소"] }, "Decrement minutes": { "v": ["분 감소"] }, "Decrement seconds": { "v": ["초 감소"] }, "Increment hours": { "v": ["시 증가"] }, "Increment minutes": { "v": ["분 증가"] }, "Increment seconds": { "v": ["초 증가"] }, "Month picker": { "v": ["월 선택기"] }, "Month picker overlay": { "v": ["월 선택기 오버레이"] }, "Next month": { "v": ["다음 달"] }, "Next year": { "v": ["다음 해"] }, "Now": { "v": ["현재"] }, "Open hours overlay": { "v": ["시 오버레이 열기"] }, "Open minutes overlay": { "v": ["분 오버레이 열기"] }, "Open months overlay": { "v": ["월 오버레이 열기"] }, "Open seconds overlay": { "v": ["초 오버레이 열기"] }, "Open time picker": { "v": ["시간 선택기 열기"] }, "Open years overlay": { "v": ["년 오버레이 열기"] }, "Pick": { "v": ["선택"] }, "Previous month": { "v": ["이전 달"] }, "Previous year": { "v": ["이전 해"] }, "Select date": { "v": ["날짜 선택"] }, "Select date and time": { "v": ["날짜와 시간 선택"] }, "Select month": { "v": ["월 선택"] }, "Select time": { "v": ["시간 선택"] }, "Select time range": { "v": ["시간 구간 선택"] }, "Select week": { "v": ["주 선택"] }, "Select year": { "v": ["년도 선택"] }, "Switch AM/PM mode": { "v": ["AM/PM 모드 전환"] }, "Time picker": { "v": ["시간 선택기"] }, "Time zone": { "v": ["시간대"] }, "Toggle overlay": { "v": ["오버레이 토글"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["년도 선택기"] }, "Year picker overlay": { "v": ["년도 선택기 오버레이"] } } }, { "l": "lo", "t": { "Calendar icon": { "v": ["ໄອຄອນປະຕິທິນ"] }, "Cancel": { "v": ["ຍົກເລີກ"] }, "Clear value": { "v": ["ລຶບຄ່າ"] }, "Close time Picker": { "v": ["ປິດໂຕເລືອກເວລາ"] }, "Datepicker input": { "v": ["ຊ່ອງປ້ອນວັນທີ"] }, "Datepicker menu": { "v": ["ເມນູໂຕເລືອກວັນທີ"] }, "Decrement hours": { "v": ["ຫຼຸດຊົ່ວໂມງ"] }, "Decrement minutes": { "v": ["ຫຼຸດນາທີ"] }, "Decrement seconds": { "v": ["ຫຼຸດວິນາທີ"] }, "Increment hours": { "v": ["ເພີ່ມຊົ່ວໂມງ"] }, "Increment minutes": { "v": ["ເພີ່ມນາທີ"] }, "Increment seconds": { "v": ["ເພີ່ມວິນາທີ"] }, "Month picker": { "v": ["ໂຕເລືອກເດືອນ"] }, "Month picker overlay": { "v": ["ໜ້າຕ່າງໂຕເລືອກເດືອນ"] }, "Next month": { "v": ["ເດືອນໜ້າ"] }, "Next year": { "v": ["ປີໜ້າ"] }, "Now": { "v": ["ຕອນນີ້"] }, "Open hours overlay": { "v": ["ເປີດໜ້າຕ່າງເລືອກຊົ່ວໂມງ"] }, "Open minutes overlay": { "v": ["ເປີດໜ້າຕ່າງເລືອກນາທີ"] }, "Open months overlay": { "v": ["ເປີດໜ້າຕ່າງເລືອກເດືອນ"] }, "Open seconds overlay": { "v": ["ເປີດໜ້າຕ່າງເລືອກວິນາທີ"] }, "Open time picker": { "v": ["ເປີດໂຕເລືອກເວລາ"] }, "Open years overlay": { "v": ["ເປີດໜ້າຕ່າງເລືອກປີ"] }, "Pick": { "v": ["ເລືອກ"] }, "Previous month": { "v": ["ເດືອນກ່ອນ"] }, "Previous year": { "v": ["ປີກ່ອນ"] }, "Select date": { "v": ["ເລືອກວັນທີ"] }, "Select date and time": { "v": ["ເລືອກວັນທີ ແລະ ເວລາ"] }, "Select month": { "v": ["ເລືອກເດືອນ"] }, "Select time": { "v": ["ເລືອກເວລາ"] }, "Select time range": { "v": ["ເລືອກຊ່ວງເວລາ"] }, "Select week": { "v": ["ເລືອກອາທິດ"] }, "Select year": { "v": ["ເລືອກປີ"] }, "Switch AM/PM mode": { "v": ["ສະຫຼັບໂໝດ AM/PM"] }, "Time picker": { "v": ["ໂຕເລືອກເວລາ"] }, "Time zone": { "v": ["ເຂດເວລາ"] }, "Toggle overlay": { "v": ["ສະຫຼັບໜ້າຕ່າງ"] }, "W": { "v": ["ອ"] }, "Year picker": { "v": ["ໂຕເລືອກປີ"] }, "Year picker overlay": { "v": ["ໜ້າຕ່າງໂຕເລືອກປີ"] } } }, { "l": "lt-LT", "t": { "Calendar icon": { "v": ["Kalendoriaus piktograma"] }, "Cancel": { "v": ["Atsisakyti"] }, "Clear value": { "v": ["Aiški vertė"] }, "Close time Picker": { "v": ["Uždaryti laiko pasirinkimo langą"] }, "Datepicker input": { "v": ["Datos rinkiklio įvestis"] }, "Datepicker menu": { "v": ["Datos rinkiklio meniu"] }, "Decrement hours": { "v": ["Sumažinkite valandas"] }, "Decrement minutes": { "v": ["Sumažinkite minutes"] }, "Decrement seconds": { "v": ["Sumažinkite sekundes"] }, "Increment hours": { "v": ["Padidinkite valandas"] }, "Increment minutes": { "v": ["Padidinkite minutes"] }, "Increment seconds": { "v": ["Padidinkite sekundes"] }, "Month picker": { "v": ["Mėnesio pasirinkimas"] }, "Month picker overlay": { "v": ["Mėnesio parinkiklio langas"] }, "Next month": { "v": ["Kitą mėnesį"] }, "Next year": { "v": ["Kiti metai"] }, "Now": { "v": ["Dabar"] }, "Open hours overlay": { "v": ["Atidaryti valandų pasirinkimą"] }, "Open minutes overlay": { "v": ["Atidaryti minučių pasirinkimą"] }, "Open months overlay": { "v": ["Atidaryti mėnesių pasirinkimą"] }, "Open seconds overlay": { "v": ["Atidaryti sekundžių pasirinkimą"] }, "Open time picker": { "v": ["Atverti laiko pasirinkimo langą"] }, "Open years overlay": { "v": ["Atidaryti metų pasirinkimą"] }, "Pick": { "v": ["Pasirinkti"] }, "Previous month": { "v": ["Ankstesnis mėnesis"] }, "Previous year": { "v": ["Ankstesni metai"] }, "Select date": { "v": ["Pasirinkti datą"] }, "Select date and time": { "v": ["Pasirinkti datą ir laiką"] }, "Select month": { "v": ["Pasirinkti mėnesį"] }, "Select time": { "v": ["Pasirinkti laiką"] }, "Select time range": { "v": ["Pasirinkti laikotarpį"] }, "Select week": { "v": ["Pasirinkti savaitę"] }, "Select year": { "v": ["Pasirinkti metus"] }, "Switch AM/PM mode": { "v": ["Perjungti AM/PM režimą"] }, "Time picker": { "v": ["Laiko parinkiklis"] }, "Time zone": { "v": ["Laiko juosta"] }, "Toggle overlay": { "v": ["Perjungti pasirinkimo langą"] }, "W": { "v": ['"W"'] }, "Year picker": { "v": ["Metų parinkiklis"] }, "Year picker overlay": { "v": ["Metų pasirinkimo langas"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Calendar icon": { "v": ["Икона за календар"] }, "Cancel": { "v": ["Откажи"] }, "Clear value": { "v": ["Исчисти вредност"] }, "Close time Picker": { "v": ["Затвори избирач на време"] }, "Datepicker input": { "v": ["Поле за избор на датум"] }, "Datepicker menu": { "v": ["Мени за избор на датум"] }, "Decrement hours": { "v": ["Намали часови"] }, "Decrement minutes": { "v": ["Намали минути"] }, "Decrement seconds": { "v": ["Намали секунди"] }, "Increment hours": { "v": ["Зголеми часови"] }, "Increment minutes": { "v": ["Зголеми минути"] }, "Increment seconds": { "v": ["Зголеми секунди"] }, "Month picker": { "v": ["Избор на месец"] }, "Month picker overlay": { "v": ["Надолжен избор на месец"] }, "Next month": { "v": ["Следен месец"] }, "Next year": { "v": ["Следна година"] }, "Now": { "v": ["Сега"] }, "Open hours overlay": { "v": ["Отвори преклоп за часови"] }, "Open minutes overlay": { "v": ["Отвори преклоп за минути"] }, "Open months overlay": { "v": ["Отвори преклоп за месеци"] }, "Open seconds overlay": { "v": ["Отвори преклоп за секунди"] }, "Open time picker": { "v": ["Отвори избор на време"] }, "Open years overlay": { "v": ["Отвори преклоп за години"] }, "Pick": { "v": ["Избери"] }, "Previous month": { "v": ["Предходен месец"] }, "Previous year": { "v": ["Предходна година"] }, "Select date": { "v": ["Избери датум"] }, "Select date and time": { "v": ["Избери датум и време"] }, "Select month": { "v": ["Избери месец"] }, "Select time": { "v": ["Избери време"] }, "Select time range": { "v": ["Избери времески опсег"] }, "Select week": { "v": ["Избери недела"] }, "Select year": { "v": ["Избери година"] }, "Switch AM/PM mode": { "v": ["Смени AM/PM режим"] }, "Time picker": { "v": ["Избирач на време"] }, "Time zone": { "v": ["Временска зона"] }, "Toggle overlay": { "v": ["Вклучи/исклучи преклоп"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Избор на година"] }, "Year picker overlay": { "v": ["Надолжен избор на година"] } } }, { "l": "mn", "t": { "Calendar icon": { "v": ["Календарийн дүрс"] }, "Cancel": { "v": ["Цуцлах"] }, "Clear value": { "v": ["Утгыг цэвэрлэх"] }, "Close time Picker": { "v": ["Цаг сонгогчийг хаах"] }, "Datepicker input": { "v": ["Огноо сонгогчийн оролт"] }, "Datepicker menu": { "v": ["Огноо сонгогчийн цэс"] }, "Decrement hours": { "v": ["Цагийг бууруулах"] }, "Decrement minutes": { "v": ["Минутыг бууруулах"] }, "Decrement seconds": { "v": ["Секундыг бууруулах"] }, "Increment hours": { "v": ["Цагийг нэмэгдүүлэх"] }, "Increment minutes": { "v": ["Минутыг нэмэгдүүлэх"] }, "Increment seconds": { "v": ["Секундыг нэмэгдүүлэх"] }, "Month picker": { "v": ["Сар сонгогч"] }, "Month picker overlay": { "v": ["Сар сонгогчийн давхарга"] }, "Next month": { "v": ["Дараа сар"] }, "Next year": { "v": ["Дараа жил"] }, "Now": { "v": ["Одоо"] }, "Open hours overlay": { "v": ["Цагийн давхаргыг нээх"] }, "Open minutes overlay": { "v": ["Минутын давхаргыг нээх"] }, "Open months overlay": { "v": ["Сарын давхаргыг нээх"] }, "Open seconds overlay": { "v": ["Секундын давхаргыг нээх"] }, "Open time picker": { "v": ["Цаг сонгогчийг нээх"] }, "Open years overlay": { "v": ["Жилийн давхаргыг нээх"] }, "Pick": { "v": ["Сонгох"] }, "Previous month": { "v": ["Өмнөх сар"] }, "Previous year": { "v": ["Өмнөх жил"] }, "Select date": { "v": ["Огноо сонгох"] }, "Select date and time": { "v": ["Огноо, цаг сонгох"] }, "Select month": { "v": ["Сар сонгох"] }, "Select time": { "v": ["Цаг сонгох"] }, "Select time range": { "v": ["Цагийн хүрээ сонгох"] }, "Select week": { "v": ["Долоо хоног сонгох"] }, "Select year": { "v": ["Жил сонгох"] }, "Switch AM/PM mode": { "v": ["ҮӨ/ҮХ горимыг солих"] }, "Time picker": { "v": ["Цаг сонгогч"] }, "Time zone": { "v": ["Цагийн бүс"] }, "Toggle overlay": { "v": ["Давхаргыг сэлгэх"] }, "W": { "v": ["Д"] }, "Year picker": { "v": ["Жил сонгогч"] }, "Year picker overlay": { "v": ["Жил сонгогчийн давхарга"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": {} }, { "l": "nl", "t": { "Calendar icon": { "v": ["Kalender-pictogram"] }, "Cancel": { "v": ["Annuleren"] }, "Clear value": { "v": ["Waarde wissen"] }, "Close time Picker": { "v": ["Tijdkiezer sluiten"] }, "Datepicker input": { "v": ["Datumkiezer invoer"] }, "Datepicker menu": { "v": ["Datumkiezer menu"] }, "Decrement hours": { "v": ["Uren verminderen"] }, "Decrement minutes": { "v": ["Minuten verminderen"] }, "Decrement seconds": { "v": ["Seconden verminderen"] }, "Increment hours": { "v": ["Uren vermeerderen"] }, "Increment minutes": { "v": ["Minuten vermeerderen"] }, "Increment seconds": { "v": ["Seconden vermeerderen"] }, "Month picker": { "v": ["Maandkiezer"] }, "Month picker overlay": { "v": ["Maandkiezer-overlay"] }, "Next month": { "v": ["Volgende maand"] }, "Next year": { "v": ["Volgend jaar"] }, "Now": { "v": ["Nu"] }, "Open hours overlay": { "v": ["Uren-overlay openen"] }, "Open minutes overlay": { "v": ["Minuten-overlay openen"] }, "Open months overlay": { "v": ["Maanden-overlay openen"] }, "Open seconds overlay": { "v": ["Seconden-overlay openen"] }, "Open time picker": { "v": ["Tijdkiezer openen"] }, "Open years overlay": { "v": ["Jaren-overlay openen"] }, "Pick": { "v": ["Kiezen"] }, "Previous month": { "v": ["Vorige maand"] }, "Previous year": { "v": ["Vorig jaar"] }, "Select date": { "v": ["Selecteer datum"] }, "Select date and time": { "v": ["Selecteer datum en tijd"] }, "Select month": { "v": ["Selecteer maand"] }, "Select time": { "v": ["Selecteer tijd"] }, "Select time range": { "v": ["Selecteer tijdsbereik"] }, "Select week": { "v": ["Selecteer week"] }, "Select year": { "v": ["Selecteer jaar"] }, "Switch AM/PM mode": { "v": ["AM/PM-modus wisselen"] }, "Time picker": { "v": ["Tijdkiezer"] }, "Time zone": { "v": ["Tijdzone"] }, "Toggle overlay": { "v": ["Overlay wisselen"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Jaarkiezer"] }, "Year picker overlay": { "v": ["Jaarkiezer-overlay"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": {} }, { "l": "pt-BR", "t": { "Calendar icon": { "v": ["Ícone de calendário"] }, "Cancel": { "v": ["Cancelar"] }, "Clear value": { "v": ["Limpar valor"] }, "Close time Picker": { "v": ["Fechar Seletor de tempo"] }, "Datepicker input": { "v": ["entrada do seletor de data"] }, "Datepicker menu": { "v": ["menu do seletor de data"] }, "Decrement hours": { "v": ["Diminuir horas"] }, "Decrement minutes": { "v": ["Diminuir minutos"] }, "Decrement seconds": { "v": ["Diminuir segundos"] }, "Increment hours": { "v": ["Aumentar horas"] }, "Increment minutes": { "v": ["Aumentar minutos"] }, "Increment seconds": { "v": ["Aumentar segundos"] }, "Month picker": { "v": ["Seletor de meses"] }, "Month picker overlay": { "v": ["Sobreposição do seletor de meses"] }, "Next month": { "v": ["Próximo mês"] }, "Next year": { "v": ["Próximo ano"] }, "Now": { "v": ["Agora"] }, "Open hours overlay": { "v": ["Abrir sobreposição de horas"] }, "Open minutes overlay": { "v": ["Abrir sobreposição de minutos"] }, "Open months overlay": { "v": ["Abrir sobreposição de meses"] }, "Open seconds overlay": { "v": ["Abrir sobreposição de segundos"] }, "Open time picker": { "v": ["Abrir seletor de tempo"] }, "Open years overlay": { "v": ["Abrir sobreposição de anos"] }, "Pick": { "v": ["Escolher"] }, "Previous month": { "v": ["Mês anterior"] }, "Previous year": { "v": ["Ano anterior"] }, "Select date": { "v": ["Selecione data"] }, "Select date and time": { "v": ["Selecione data e hora"] }, "Select month": { "v": ["Selecione mês"] }, "Select time": { "v": ["Selecione hora"] }, "Select time range": { "v": ["Selecione intervalo de tempo"] }, "Select week": { "v": ["Selecione semana"] }, "Select year": { "v": ["Selecione ano"] }, "Switch AM/PM mode": { "v": ["Alternar modo AM/PM"] }, "Time picker": { "v": ["Seletor de tempo"] }, "Time zone": { "v": ["Fuso horário"] }, "Toggle overlay": { "v": ["Alternar sobreposição"] }, "W": { "v": ["S"] }, "Year picker": { "v": ["Seletor de ano"] }, "Year picker overlay": { "v": ["Sobreposição do seletor de ano"] } } }, { "l": "pt-PT", "t": { "Calendar icon": { "v": ["Ícone de calendário"] }, "Cancel": { "v": ["Cancelar"] }, "Clear value": { "v": ["Limpar valor"] }, "Close time Picker": { "v": ["Fechar seletor de hora"] }, "Datepicker input": { "v": ["Campo do seletor de data"] }, "Datepicker menu": { "v": ["Menu do seletor de data"] }, "Decrement hours": { "v": ["Diminuir horas"] }, "Decrement minutes": { "v": ["Diminuir minutos"] }, "Decrement seconds": { "v": ["Diminuir segundos"] }, "Increment hours": { "v": ["Aumentar horas"] }, "Increment minutes": { "v": ["Aumentar minutos"] }, "Increment seconds": { "v": ["Aumentar segundos"] }, "Month picker": { "v": ["Seletor de mês"] }, "Month picker overlay": { "v": ["Janela do seletor de mês"] }, "Next month": { "v": ["Próximo mês"] }, "Next year": { "v": ["Próximo ano"] }, "Now": { "v": ["Agora"] }, "Open hours overlay": { "v": ["Abrir janela de horas"] }, "Open minutes overlay": { "v": ["Abrir janela de minutos"] }, "Open months overlay": { "v": ["Abrir janela de meses"] }, "Open seconds overlay": { "v": ["Abrir janela de segundos"] }, "Open time picker": { "v": ["Abrir seletor de hora"] }, "Open years overlay": { "v": ["Abrir janela de anos"] }, "Pick": { "v": ["Selecionar"] }, "Previous month": { "v": ["Mês anterior"] }, "Previous year": { "v": ["Ano anterior"] }, "Select date": { "v": ["Selecionar data"] }, "Select date and time": { "v": ["Selecionar data e hora"] }, "Select month": { "v": ["Selecionar mês"] }, "Select time": { "v": ["Selecionar hora"] }, "Select time range": { "v": ["Selecionar intervalo de horas"] }, "Select week": { "v": ["Selecionar semana"] }, "Select year": { "v": ["Selecionar ano"] }, "Switch AM/PM mode": { "v": ["Alternar modo AM/PM"] }, "Time picker": { "v": ["Seletor de hora"] }, "Toggle overlay": { "v": ["Alternar sobreposição"] }, "W": { "v": ["S"] }, "Year picker": { "v": ["Seletor de ano"] }, "Year picker overlay": { "v": ["Janela do seletor de ano"] } } }, { "l": "ro", "t": {} }, { "l": "ru", "t": { "Calendar icon": { "v": ["Значок календаря"] }, "Cancel": { "v": ["Отмена"] }, "Clear value": { "v": ["Очистить значение"] }, "Close time Picker": { "v": ["Закрыть выбор времени"] }, "Datepicker input": { "v": ["Поле выбора даты"] }, "Datepicker menu": { "v": ["Меню выбора даты"] }, "Decrement hours": { "v": ["Уменьшить количество часов"] }, "Decrement minutes": { "v": ["Уменьшить количество минут"] }, "Decrement seconds": { "v": ["Уменьшить количество секунд"] }, "Increment hours": { "v": ["Увеличить количество часов"] }, "Increment minutes": { "v": ["Увеличить количество минут"] }, "Increment seconds": { "v": ["Увеличить количество секунд"] }, "Month picker": { "v": ["Выбор месяца"] }, "Month picker overlay": { "v": ["Окно выбора месяца"] }, "Next month": { "v": ["Следующий месяц"] }, "Next year": { "v": ["Следующий год"] }, "Now": { "v": ["Сейчас"] }, "Open hours overlay": { "v": ["Открыть окно выбора часов"] }, "Open minutes overlay": { "v": ["Открыть окно выбора минут"] }, "Open months overlay": { "v": ["Открыть окно выбора месяца"] }, "Open seconds overlay": { "v": ["Открыть окно выбора секунд"] }, "Open time picker": { "v": ["Открыть средство выбора времени"] }, "Open years overlay": { "v": ["Открыть окно выбора года"] }, "Pick": { "v": ["Выбор"] }, "Previous month": { "v": ["Предыдущий месяц"] }, "Previous year": { "v": ["Предыдущий год"] }, "Select date": { "v": ["Выбрать дату"] }, "Select date and time": { "v": ["Выбрать дату и время"] }, "Select month": { "v": ["Выбрать месяц"] }, "Select time": { "v": ["Выбрать время"] }, "Select time range": { "v": ["Выбрать временной диапазон"] }, "Select week": { "v": ["Выбрать неделю"] }, "Select year": { "v": ["Выбрать год"] }, "Switch AM/PM mode": { "v": ["Переключение режима AM/PM"] }, "Time picker": { "v": ["Выбор времени"] }, "Time zone": { "v": ["Часовой пояс"] }, "Toggle overlay": { "v": ["Переключить панель"] }, "W": { "v": ["Н"] }, "Year picker": { "v": ["Выбор года"] }, "Year picker overlay": { "v": ["Окно выбора года"] } } }, { "l": "sk", "t": {} }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Calendar icon": { "v": ["Икона календара"] }, "Cancel": { "v": ["Откажи"] }, "Clear value": { "v": ["Обриши вредност"] }, "Close time Picker": { "v": ["Затвори бирач времена"] }, "Datepicker input": { "v": ["Улаз бирача датума"] }, "Datepicker menu": { "v": ["Мени бирача датума"] }, "Decrement hours": { "v": ["Умањи сате"] }, "Decrement minutes": { "v": ["Умањи минуте"] }, "Decrement seconds": { "v": ["Умањи секунде"] }, "Increment hours": { "v": ["Увећај сате"] }, "Increment minutes": { "v": ["Увећај минуте"] }, "Increment seconds": { "v": ["Увећај секунде"] }, "Month picker": { "v": ["Бирач месеца"] }, "Month picker overlay": { "v": ["Маска бирача месеца"] }, "Next month": { "v": ["Наредни месец"] }, "Next year": { "v": ["Наредна година"] }, "Now": { "v": ["Сада"] }, "Open hours overlay": { "v": ["Отвори маску сати"] }, "Open minutes overlay": { "v": ["Отвори маску минута"] }, "Open months overlay": { "v": ["Отвори маску месеци"] }, "Open seconds overlay": { "v": ["Отвори маску секунди"] }, "Open time picker": { "v": ["Отвори бирач времена"] }, "Open years overlay": { "v": ["Отвори маску година"] }, "Pick": { "v": ["Изабери"] }, "Previous month": { "v": ["Претходни месец"] }, "Previous year": { "v": ["Претходна година"] }, "Select date": { "v": ["Изаберите датум"] }, "Select date and time": { "v": ["Изаберите датум и време"] }, "Select month": { "v": ["Изаберите месец"] }, "Select time": { "v": ["Изаберите време"] }, "Select time range": { "v": ["Изаберите опсег времена"] }, "Select week": { "v": ["Изаберите недељу"] }, "Select year": { "v": ["Изаберите годину"] }, "Switch AM/PM mode": { "v": ["Укљ./Искљ. AM/PM режим"] }, "Time picker": { "v": ["Бирач времена"] }, "Toggle overlay": { "v": ["Укљ./Искљ. маску"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Бирач године"] }, "Year picker overlay": { "v": ["Маска бирача године"] } } }, { "l": "sv", "t": { "Calendar icon": { "v": ["Kalenderikon"] }, "Cancel": { "v": ["Avbryt"] }, "Clear value": { "v": ["Rensa värde"] }, "Close time Picker": { "v": ["Stäng tidsväljaren"] }, "Datepicker input": { "v": ["Inmatning för datumväljare"] }, "Datepicker menu": { "v": ["Datumväljarmeny"] }, "Decrement hours": { "v": ["Minska timmar"] }, "Decrement minutes": { "v": ["Minska minuter"] }, "Decrement seconds": { "v": ["Minska sekunder"] }, "Increment hours": { "v": ["Öka timmar"] }, "Increment minutes": { "v": ["Öka minuter"] }, "Increment seconds": { "v": ["Öka sekunder"] }, "Month picker": { "v": ["Månadsväljare"] }, "Month picker overlay": { "v": ["Månadsväljarens panel"] }, "Next month": { "v": ["Nästa månad"] }, "Next year": { "v": ["Nästa år"] }, "Now": { "v": ["Nu"] }, "Open hours overlay": { "v": ["Öppna timmespanel"] }, "Open minutes overlay": { "v": ["Öppna minutpanel"] }, "Open months overlay": { "v": ["Öppna månadspanel"] }, "Open seconds overlay": { "v": ["Öppna sekundpanel"] }, "Open time picker": { "v": ["Öppna tidsväljaren"] }, "Open years overlay": { "v": ["Öppna årspanel"] }, "Pick": { "v": ["Välj"] }, "Previous month": { "v": ["Föregående månad"] }, "Previous year": { "v": ["Föregående år"] }, "Select date": { "v": ["Välj datum"] }, "Select date and time": { "v": ["Välj datum och tid"] }, "Select month": { "v": ["Välj månad"] }, "Select time": { "v": ["Välj tid"] }, "Select time range": { "v": ["Välj tidsintervall"] }, "Select week": { "v": ["Välj vecka"] }, "Select year": { "v": ["Välj år"] }, "Switch AM/PM mode": { "v": ["Växla mellan AM/PM-läge"] }, "Time picker": { "v": ["Tidsväljare"] }, "Time zone": { "v": ["Tidszon"] }, "Toggle overlay": { "v": ["Växla panel"] }, "W": { "v": ["V"] }, "Year picker": { "v": ["Årsväljare"] }, "Year picker overlay": { "v": ["Årsväljarens panel"] } } }, { "l": "tr", "t": { "Calendar icon": { "v": ["Takvim simgesi"] }, "Cancel": { "v": ["İptal"] }, "Clear value": { "v": ["Değeri temizle"] }, "Close time Picker": { "v": ["Zaman seçiciyi kapat"] }, "Datepicker input": { "v": ["Tarih seçici girişi"] }, "Datepicker menu": { "v": ["Tarih seçici menüsü"] }, "Decrement hours": { "v": ["Azalma saati"] }, "Decrement minutes": { "v": ["Azalma dakikası"] }, "Decrement seconds": { "v": ["Azalma saniyesi"] }, "Increment hours": { "v": ["Artma saati"] }, "Increment minutes": { "v": ["Artma dakikası"] }, "Increment seconds": { "v": ["Artma saniyesi"] }, "Month picker": { "v": ["Ay seçici"] }, "Month picker overlay": { "v": ["Ay seçici kaplaması"] }, "Next month": { "v": ["Sonraki ay"] }, "Next year": { "v": ["Sonraki yıl"] }, "Now": { "v": ["Şimdi"] }, "Open hours overlay": { "v": ["Açık saatler kaplaması"] }, "Open minutes overlay": { "v": ["Dakika kaplamasını aç"] }, "Open months overlay": { "v": ["Ay kaplamasını aç"] }, "Open seconds overlay": { "v": ["Saniye kaplamasını aç"] }, "Open time picker": { "v": ["Saat seçiciyi aç"] }, "Open years overlay": { "v": ["Yıl kaplamasını aç"] }, "Pick": { "v": ["Seçin"] }, "Previous month": { "v": ["Önceki ay"] }, "Previous year": { "v": ["Önceki yıl"] }, "Select date": { "v": ["Tarih seçin"] }, "Select date and time": { "v": ["Tarih ve saat seçin"] }, "Select month": { "v": ["Ay seçin"] }, "Select time": { "v": ["Saat seçin"] }, "Select time range": { "v": ["Saat aralığı seçin"] }, "Select week": { "v": ["Hafta seçin"] }, "Select year": { "v": ["Yıl seçin"] }, "Switch AM/PM mode": { "v": ["ÖÖ/ÖS kipine geç"] }, "Time picker": { "v": ["Saat seçici"] }, "Time zone": { "v": ["Saat dilimi"] }, "Toggle overlay": { "v": ["Kaplamayı aç/kapat"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Yıl seçici"] }, "Year picker overlay": { "v": ["Yıl seçici kaplaması"] } } }, { "l": "uk", "t": { "Calendar icon": { "v": ["Значок календаря"] }, "Cancel": { "v": ["Скасувати"] }, "Clear value": { "v": ["Очистити значення"] }, "Close time Picker": { "v": ["Закрити вибір часу"] }, "Datepicker input": { "v": ["Вибір дати"] }, "Datepicker menu": { "v": ["Меню вибору дати"] }, "Decrement hours": { "v": ["Зменшення годин"] }, "Decrement minutes": { "v": ["Зменшення хвилин"] }, "Decrement seconds": { "v": ["Зменшення секунд"] }, "Increment hours": { "v": ["Збільшення годин"] }, "Increment minutes": { "v": ["Збільшення хвилин"] }, "Increment seconds": { "v": ["Збільшення секунд"] }, "Month picker": { "v": ["Вибір місяця"] }, "Month picker overlay": { "v": ["Напис вибору місяця"] }, "Next month": { "v": ["Наступний місяць"] }, "Next year": { "v": ["Наступний рік"] }, "Now": { "v": ["Зараз"] }, "Open hours overlay": { "v": ["Відкрити напис годин"] }, "Open minutes overlay": { "v": ["Відкрити напис хвилин"] }, "Open months overlay": { "v": ["Відкрити напис місяців"] }, "Open seconds overlay": { "v": ["Відкрити напис секунд"] }, "Open time picker": { "v": ["Відкрити вибір часу"] }, "Open years overlay": { "v": ["Відкрити напис років"] }, "Pick": { "v": ["Вибрати"] }, "Previous month": { "v": ["Попередній місяць"] }, "Previous year": { "v": ["Попередній рік"] }, "Select date": { "v": ["Вибрати дату"] }, "Select date and time": { "v": ["Вибрати дату та час"] }, "Select month": { "v": ["Вибрати місяць"] }, "Select time": { "v": ["Вибрати час"] }, "Select time range": { "v": ["Вибрати проміжок часу"] }, "Select week": { "v": ["Вибрати тиждень"] }, "Select year": { "v": ["Вибрати рік"] }, "Switch AM/PM mode": { "v": ["Перемкнути показ по полудні/до полудня"] }, "Time picker": { "v": ["Вибір часу"] }, "Toggle overlay": { "v": ["Перемкнути напис"] }, "W": { "v": ["Тиж."] }, "Year picker": { "v": ["Вибір року"] }, "Year picker overlay": { "v": ["Напис вибору року"] } } }, { "l": "uz", "t": { "Calendar icon": { "v": ["Kalendar belgisi"] }, "Cancel": { "v": ["Bekor qilish"] }, "Clear value": { "v": ["Qiymatni tozalash"] }, "Close time Picker": { "v": ["Vaqtni tanlash vositasini yopish"] }, "Datepicker input": { "v": ["Sana tanlash vositasi kiritish"] }, "Datepicker menu": { "v": ["Sana tanlash menyusi"] }, "Decrement hours": { "v": ["Ish vaqtini qisqartirish"] }, "Decrement minutes": { "v": ["Daqiqalarni kamaytirish"] }, "Decrement seconds": { "v": ["Soniyalarni kamaytirish"] }, "Increment hours": { "v": ["Ish soatlarini oshirish"] }, "Increment minutes": { "v": ["Daqiqalarni oshiring"] }, "Increment seconds": { "v": ["Soniyalarni ko'paytirish"] }, "Month picker": { "v": ["Oyni tanlovchi"] }, "Month picker overlay": { "v": ["Oyni tanlash vositasi qoplamasi"] }, "Next month": { "v": ["Keyingi oy"] }, "Next year": { "v": ["Keyingi yil"] }, "Now": { "v": ["Hozir"] }, "Open hours overlay": { "v": ["Ochiq ish soatlari"] }, "Open minutes overlay": { "v": ["Ochiq daqiqalar qoplamasi"] }, "Open months overlay": { "v": ["Ochiq oylik qoplama"] }, "Open seconds overlay": { "v": ["Ochiq soniyalar qoplamasi"] }, "Open time picker": { "v": ["Vaqt tanlagichni ochish"] }, "Open years overlay": { "v": ["Yillar qoplamasini ochish"] }, "Pick": { "v": ["Tanlash"] }, "Previous month": { "v": ["Oldingi oy"] }, "Previous year": { "v": ["O'tgan yil"] }, "Select date": { "v": ["Sana tanlang"] }, "Select date and time": { "v": ["Sana va vaqtni tanlang"] }, "Select month": { "v": ["Oyni tanlang"] }, "Select time": { "v": ["Oyni tanlang"] }, "Select time range": { "v": ["Vaqt oralig'ini tanlang"] }, "Select week": { "v": ["Haftani tanlang"] }, "Select year": { "v": ["Yilni tanlang"] }, "Switch AM/PM mode": { "v": ["AM/PM rejimini almashtiring"] }, "Time picker": { "v": ["Vaqtni tanlovchi"] }, "Time zone": { "v": ["Vaqt mintaqasi"] }, "Toggle overlay": { "v": ["Qoplamani almashtirish"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["Yilni tanlovchi"] }, "Year picker overlay": { "v": ["Yilni tanlash vositasi"] } } }, { "l": "zh-CN", "t": {} }, { "l": "zh-HK", "t": { "Calendar icon": { "v": ["行事曆圖示"] }, "Cancel": { "v": ["取消"] }, "Clear value": { "v": ["清除值"] }, "Close time Picker": { "v": ["關閉時間挑選器"] }, "Datepicker input": { "v": ["日期挑選器輸入"] }, "Datepicker menu": { "v": ["日期挑選器選單"] }, "Decrement hours": { "v": ["小時遞減"] }, "Decrement minutes": { "v": ["分鐘遞減"] }, "Decrement seconds": { "v": ["秒遞減"] }, "Increment hours": { "v": ["小時遞增"] }, "Increment minutes": { "v": ["分鐘遞增"] }, "Increment seconds": { "v": ["秒遞增"] }, "Month picker": { "v": ["月挑選器"] }, "Month picker overlay": { "v": ["月挑選器覆蓋層"] }, "Next month": { "v": ["下個月"] }, "Next year": { "v": ["明年"] }, "Now": { "v": ["現在"] }, "Open hours overlay": { "v": ["開啟小時覆蓋層"] }, "Open minutes overlay": { "v": ["開啟分鐘覆蓋層"] }, "Open months overlay": { "v": ["開啟月覆蓋層"] }, "Open seconds overlay": { "v": ["開啟秒覆蓋層"] }, "Open time picker": { "v": ["開啟時間挑選器"] }, "Open years overlay": { "v": ["開啟年覆蓋層"] }, "Pick": { "v": ["挑選"] }, "Previous month": { "v": ["上個月"] }, "Previous year": { "v": ["去年"] }, "Select date": { "v": ["選取日期"] }, "Select date and time": { "v": ["選取日期與時間"] }, "Select month": { "v": ["選取月"] }, "Select time": { "v": ["選取時間"] }, "Select time range": { "v": ["選取時間範圍"] }, "Select week": { "v": ["選取週"] }, "Select year": { "v": ["選取年"] }, "Switch AM/PM mode": { "v": ["切換上午/下午模式"] }, "Time picker": { "v": ["時間挑選器"] }, "Time zone": { "v": ["時區"] }, "Toggle overlay": { "v": ["切換覆蓋層"] }, "W": { "v": ["週"] }, "Year picker": { "v": ["年挑選器"] }, "Year picker overlay": { "v": ["年挑選器覆蓋層"] } } }, { "l": "zh-TW", "t": { "Calendar icon": { "v": ["行事曆圖示"] }, "Cancel": { "v": ["取消"] }, "Clear value": { "v": ["清除值"] }, "Close time Picker": { "v": ["關閉時間挑選器"] }, "Datepicker input": { "v": ["日期挑選器輸入"] }, "Datepicker menu": { "v": ["日期挑選器選單"] }, "Decrement hours": { "v": ["小時遞減"] }, "Decrement minutes": { "v": ["分鐘遞減"] }, "Decrement seconds": { "v": ["秒遞減"] }, "Increment hours": { "v": ["小時遞增"] }, "Increment minutes": { "v": ["分鐘遞增"] }, "Increment seconds": { "v": ["秒遞增"] }, "Month picker": { "v": ["月挑選器"] }, "Month picker overlay": { "v": ["月挑選器覆蓋層"] }, "Next month": { "v": ["下個月"] }, "Next year": { "v": ["明年"] }, "Now": { "v": ["現在"] }, "Open hours overlay": { "v": ["開啟小時覆蓋層"] }, "Open minutes overlay": { "v": ["開啟分鐘覆蓋層"] }, "Open months overlay": { "v": ["開啟月覆蓋層"] }, "Open seconds overlay": { "v": ["開啟秒覆蓋層"] }, "Open time picker": { "v": ["開啟時間挑選器"] }, "Open years overlay": { "v": ["開啟年覆蓋層"] }, "Pick": { "v": ["挑選"] }, "Previous month": { "v": ["上個月"] }, "Previous year": { "v": ["去年"] }, "Select date": { "v": ["選取日期"] }, "Select date and time": { "v": ["選取日期與時間"] }, "Select month": { "v": ["選取月"] }, "Select time": { "v": ["選取時間"] }, "Select time range": { "v": ["選取時間範圍"] }, "Select week": { "v": ["選取週"] }, "Select year": { "v": ["選取年"] }, "Switch AM/PM mode": { "v": ["切換上午/下午模式"] }, "Time picker": { "v": ["時間挑選器"] }, "Time zone": { "v": ["時區"] }, "Toggle overlay": { "v": ["切換覆蓋層"] }, "W": { "v": ["W"] }, "Year picker": { "v": ["年挑選器"] }, "Year picker overlay": { "v": ["年挑選器覆蓋層"] } } }];
const t14 = [{ "l": "ar", "t": { "Cancel changes": { "v": ["إلغاء التغييرات"] }, "Confirm changes": { "v": ["تأكيد التغييرات"] } } }, { "l": "ast", "t": { "Cancel changes": { "v": ["Encaboxar los cambeos"] }, "Confirm changes": { "v": ["Confirmar los cambeos"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Cancel changes": { "v": ["Cancel·la els canvis"] }, "Confirm changes": { "v": ["Confirmeu els canvis"] } } }, { "l": "cs", "t": { "Cancel changes": { "v": ["Zrušit změny"] }, "Confirm changes": { "v": ["Potvrdit změny"] } } }, { "l": "cs-CZ", "t": { "Cancel changes": { "v": ["Zrušit změny"] }, "Confirm changes": { "v": ["Potvrdit změny"] } } }, { "l": "da", "t": { "Cancel changes": { "v": ["Annuller ændringer"] }, "Confirm changes": { "v": ["Bekræft ændringer"] } } }, { "l": "de", "t": { "Cancel changes": { "v": ["Änderungen verwerfen"] }, "Confirm changes": { "v": ["Änderungen bestätigen"] } } }, { "l": "de-DE", "t": { "Cancel changes": { "v": ["Änderungen verwerfen"] }, "Confirm changes": { "v": ["Änderungen bestätigen"] } } }, { "l": "el", "t": { "Cancel changes": { "v": ["Ακύρωση αλλαγών"] }, "Confirm changes": { "v": ["Επιβεβαίωση αλλαγών"] } } }, { "l": "en-GB", "t": { "Cancel changes": { "v": ["Cancel changes"] }, "Confirm changes": { "v": ["Confirm changes"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Cancel changes": { "v": ["Cancelar cambios"] }, "Confirm changes": { "v": ["Confirmar cambios"] } } }, { "l": "es-AR", "t": { "Cancel changes": { "v": ["Cancelar cambios"] }, "Confirm changes": { "v": ["Confirmar cambios"] } } }, { "l": "es-EC", "t": { "Cancel changes": { "v": ["Cancelar cambios"] }, "Confirm changes": { "v": ["Confirmar cambios"] } } }, { "l": "es-MX", "t": { "Cancel changes": { "v": ["Cancelar cambios"] }, "Confirm changes": { "v": ["Confirmar cambios"] } } }, { "l": "et-EE", "t": { "Cancel changes": { "v": ["Tühista muudatused"] }, "Confirm changes": { "v": ["Kinnita muudatused"] } } }, { "l": "eu", "t": { "Cancel changes": { "v": ["Ezeztatu aldaketak"] }, "Confirm changes": { "v": ["Baieztatu aldaketak"] } } }, { "l": "fa", "t": { "Cancel changes": { "v": ["لغو تغییرات"] }, "Confirm changes": { "v": ["تایید تغییرات"] } } }, { "l": "fi", "t": { "Cancel changes": { "v": ["Peruuta muutokset"] }, "Confirm changes": { "v": ["Vahvista muutokset"] } } }, { "l": "fr", "t": { "Cancel changes": { "v": ["Annuler les modifications"] }, "Confirm changes": { "v": ["Confirmer les modifications"] } } }, { "l": "ga", "t": { "Cancel changes": { "v": ["Cealaigh athruithe"] }, "Confirm changes": { "v": ["Deimhnigh na hathruithe"] } } }, { "l": "gl", "t": { "Cancel changes": { "v": ["Cancelar os cambios"] }, "Confirm changes": { "v": ["Confirma os cambios"] } } }, { "l": "he", "t": { "Cancel changes": { "v": ["ביטול שינויים"] }, "Confirm changes": { "v": ["אישור השינויים"] } } }, { "l": "hr", "t": { "Cancel changes": { "v": ["Otkaži promjene"] }, "Confirm changes": { "v": ["Potvrdi promjene"] } } }, { "l": "hu", "t": { "Cancel changes": { "v": ["Változtatások elvetése"] }, "Confirm changes": { "v": ["Változtatások megerősítése"] } } }, { "l": "id", "t": { "Cancel changes": { "v": ["Batalkan perubahan"] }, "Confirm changes": { "v": ["Konfirmasikan perubahan"] } } }, { "l": "is", "t": { "Cancel changes": { "v": ["Hætta við breytingar"] }, "Confirm changes": { "v": ["Staðfesta breytingar"] } } }, { "l": "it", "t": { "Cancel changes": { "v": ["Annulla modifiche"] }, "Confirm changes": { "v": ["Conferma modifiche"] } } }, { "l": "ja", "t": { "Cancel changes": { "v": ["変更をキャンセル"] }, "Confirm changes": { "v": ["変更を承認"] } } }, { "l": "ja-JP", "t": { "Cancel changes": { "v": ["変更をキャンセル"] }, "Confirm changes": { "v": ["変更を承認"] } } }, { "l": "ko", "t": { "Cancel changes": { "v": ["변경 취소"] }, "Confirm changes": { "v": ["변경 사항 확인"] } } }, { "l": "lo", "t": { "Cancel changes": { "v": ["ຍົກເລີກການປ່ຽນແປງ"] }, "Confirm changes": { "v": ["ຢືນຢັນການປ່ຽນແປງ"] } } }, { "l": "lt-LT", "t": { "Cancel changes": { "v": ["Atsisakyti pakeitimų"] }, "Confirm changes": { "v": ["Patvirtinti pakeitimus"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Cancel changes": { "v": ["Откажи ги промените"] }, "Confirm changes": { "v": ["Потврди ги промените"] } } }, { "l": "mn", "t": { "Cancel changes": { "v": ["Өөрчлөлтийг цуцлах"] }, "Confirm changes": { "v": ["Өөрчлөлтийг баталгаажуулах"] } } }, { "l": "my", "t": { "Cancel changes": { "v": ["ပြောင်းလဲမှုများ ပယ်ဖျက်ရန်"] }, "Confirm changes": { "v": ["ပြောင်းလဲမှုများ အတည်ပြုရန်"] } } }, { "l": "nb", "t": { "Cancel changes": { "v": ["Avbryt endringer"] }, "Confirm changes": { "v": ["Bekreft endringer"] } } }, { "l": "nl", "t": { "Cancel changes": { "v": ["Wijzigingen annuleren"] }, "Confirm changes": { "v": ["Wijzigingen bevestigen"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Cancel changes": { "v": ["Anuluj zmiany"] }, "Confirm changes": { "v": ["Potwierdź zmiany"] } } }, { "l": "pt-BR", "t": { "Cancel changes": { "v": ["Cancelar alterações"] }, "Confirm changes": { "v": ["Confirmar alterações"] } } }, { "l": "pt-PT", "t": { "Cancel changes": { "v": ["Cancelar alterações"] }, "Confirm changes": { "v": ["Confirmar alterações"] } } }, { "l": "ro", "t": { "Cancel changes": { "v": ["Anulează modificările"] }, "Confirm changes": { "v": ["Confirmați modificările"] } } }, { "l": "ru", "t": { "Cancel changes": { "v": ["Отменить изменения"] }, "Confirm changes": { "v": ["Подтвердить изменения"] } } }, { "l": "sk", "t": { "Cancel changes": { "v": ["Zrušiť zmeny"] }, "Confirm changes": { "v": ["Potvrdiť zmeny"] } } }, { "l": "sl", "t": { "Cancel changes": { "v": ["Prekliči spremembe"] }, "Confirm changes": { "v": ["Potrdi spremembe"] } } }, { "l": "sr", "t": { "Cancel changes": { "v": ["Откажи измене"] }, "Confirm changes": { "v": ["Потврдите измене"] } } }, { "l": "sv", "t": { "Cancel changes": { "v": ["Avbryt ändringar"] }, "Confirm changes": { "v": ["Bekräfta ändringar"] } } }, { "l": "tr", "t": { "Cancel changes": { "v": ["Değişiklikleri iptal et"] }, "Confirm changes": { "v": ["Değişiklikleri onayla"] } } }, { "l": "uk", "t": { "Cancel changes": { "v": ["Скасувати зміни"] }, "Confirm changes": { "v": ["Підтвердити зміни"] } } }, { "l": "uz", "t": { "Cancel changes": { "v": ["O'zgarishlarni bekor qilish"] }, "Confirm changes": { "v": ["O'zgarishlarni tasdiqlang"] } } }, { "l": "zh-CN", "t": { "Cancel changes": { "v": ["取消更改"] }, "Confirm changes": { "v": ["确认更改"] } } }, { "l": "zh-HK", "t": { "Cancel changes": { "v": ["取消更改"] }, "Confirm changes": { "v": ["確認更改"] } } }, { "l": "zh-TW", "t": { "Cancel changes": { "v": ["取消變更"] }, "Confirm changes": { "v": ["確認變更"] } } }];
const t15 = [{ "l": "ar", "t": { "Change name": { "v": ["تغيير الاسم"] }, "Close sidebar": { "v": ["قفل الشريط الجانبي"] }, "Favorite": { "v": ["المفضلة"] }, "Open sidebar": { "v": ["إفتَح الشريط الجانبي"] } } }, { "l": "ast", "t": { "Change name": { "v": ["Camudar el nome"] }, "Close sidebar": { "v": ["Zarrar la barra llateral"] }, "Favorite": { "v": ["Favoritu"] }, "Open sidebar": { "v": ["Abrir la barra llateral"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Close sidebar": { "v": ["Tancar la barra lateral"] }, "Favorite": { "v": ["Preferit"] } } }, { "l": "cs", "t": { "Change name": { "v": ["Změnit název"] }, "Close sidebar": { "v": ["Zavřít postranní panel"] }, "Favorite": { "v": ["Oblíbené"] }, "Open sidebar": { "v": ["Otevřít postranní panel"] } } }, { "l": "cs-CZ", "t": { "Change name": { "v": ["Změnit název"] }, "Close sidebar": { "v": ["Zavřít postranní panel"] }, "Favorite": { "v": ["Oblíbené"] } } }, { "l": "da", "t": { "Change name": { "v": ["Ændre navn"] }, "Close sidebar": { "v": ["Luk sidepanel"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Åbn sidepanel"] } } }, { "l": "de", "t": { "Change name": { "v": ["Namen ändern"] }, "Close sidebar": { "v": ["Seitenleiste schließen"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Seitenleiste öffnen"] } } }, { "l": "de-DE", "t": { "Change name": { "v": ["Namen ändern"] }, "Close sidebar": { "v": ["Seitenleiste schließen"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Seitenleiste öffnen"] } } }, { "l": "el", "t": { "Change name": { "v": ["Αλλαγή ονόματος"] }, "Close sidebar": { "v": ["Κλείσιμο πλευρικής μπάρας"] }, "Favorite": { "v": ["Αγαπημένα"] }, "Open sidebar": { "v": ["Άνοιγμα πλευρικής μπάρας"] } } }, { "l": "en-GB", "t": { "Change name": { "v": ["Change name"] }, "Close sidebar": { "v": ["Close sidebar"] }, "Favorite": { "v": ["Favourite"] }, "Open sidebar": { "v": ["Open sidebar"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Change name": { "v": ["Cambiar nombre"] }, "Close sidebar": { "v": ["Cerrar barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir barra lateral"] } } }, { "l": "es-AR", "t": { "Change name": { "v": ["Cambiar nombre"] }, "Close sidebar": { "v": ["Cerrar barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir barra lateral"] } } }, { "l": "es-EC", "t": { "Change name": { "v": ["Cambiar nombre"] }, "Close sidebar": { "v": ["Cerrar barra lateral"] }, "Favorite": { "v": ["Favorito"] } } }, { "l": "es-MX", "t": { "Change name": { "v": ["Cambiar nombre"] }, "Close sidebar": { "v": ["Cerrar barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir barra lateral"] } } }, { "l": "et-EE", "t": { "Change name": { "v": ["Muuda nime"] }, "Close sidebar": { "v": ["Sulge külgriba"] }, "Favorite": { "v": ["Lemmik"] }, "Open sidebar": { "v": ["Ava külgriba"] } } }, { "l": "eu", "t": { "Change name": { "v": ["Aldatu izena"] }, "Close sidebar": { "v": ["Itxi albo-barra"] }, "Favorite": { "v": ["Gogokoa"] } } }, { "l": "fa", "t": { "Change name": { "v": ["تغییر نام"] }, "Close sidebar": { "v": ["بستن نوار کناری"] }, "Favorite": { "v": ["مورد علاقه"] }, "Open sidebar": { "v": ["باز کردن نوار کنار"] } } }, { "l": "fi", "t": { "Change name": { "v": ["Vaihda nimi"] }, "Close sidebar": { "v": ["Sulje sivupalkki"] }, "Favorite": { "v": ["Suosikki"] }, "Open sidebar": { "v": ["Avaa sivupalkki"] } } }, { "l": "fr", "t": { "Change name": { "v": ["Modifier le nom"] }, "Close sidebar": { "v": ["Fermer la barre latérale"] }, "Favorite": { "v": ["Favori"] }, "Open sidebar": { "v": ["Ouvrir la barre latérale"] } } }, { "l": "ga", "t": { "Change name": { "v": ["Athrú ainm"] }, "Close sidebar": { "v": ["Dún barra taoibh"] }, "Favorite": { "v": ["is fearr leat"] }, "Open sidebar": { "v": ["Oscail barra taoibh"] } } }, { "l": "gl", "t": { "Change name": { "v": ["Cambiar o nome"] }, "Close sidebar": { "v": ["Pechar a barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir a barra lateral"] } } }, { "l": "he", "t": { "Change name": { "v": ["החלפת שם"] }, "Close sidebar": { "v": ["סגירת סרגל הצד"] }, "Favorite": { "v": ["למועדפים"] } } }, { "l": "hr", "t": { "Change name": { "v": ["Promjeni naziv"] }, "Close sidebar": { "v": ["Zatvori bočnu traku"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Otvori bočnu traku"] } } }, { "l": "hu", "t": { "Change name": { "v": ["Név módosítása"] }, "Close sidebar": { "v": ["Oldalsáv bezárása"] }, "Favorite": { "v": ["Kedvenc"] }, "Open sidebar": { "v": ["Oldalsáv megnyitása"] } } }, { "l": "id", "t": { "Change name": { "v": ["Ubah nama"] }, "Close sidebar": { "v": ["Tutup bilah sisi"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Buka bilah sisi"] } } }, { "l": "is", "t": { "Change name": { "v": ["Breyta nafni"] }, "Close sidebar": { "v": ["Loka hliðarstiku"] }, "Favorite": { "v": ["Eftirlæti"] }, "Open sidebar": { "v": ["Opna hliðarspjald"] } } }, { "l": "it", "t": { "Change name": { "v": ["Cambia nome"] }, "Close sidebar": { "v": ["Chiudi la barra laterale"] }, "Favorite": { "v": ["Preferito"] } } }, { "l": "ja", "t": { "Change name": { "v": ["名前の変更"] }, "Close sidebar": { "v": ["サイドバーを閉じる"] }, "Favorite": { "v": ["お気に入り"] }, "Open sidebar": { "v": ["サイドバーを開く"] } } }, { "l": "ja-JP", "t": { "Change name": { "v": ["名前の変更"] }, "Close sidebar": { "v": ["サイドバーを閉じる"] }, "Favorite": { "v": ["お気に入り"] }, "Open sidebar": { "v": ["サイドバーを開く"] } } }, { "l": "ko", "t": { "Change name": { "v": ["이름 변경"] }, "Close sidebar": { "v": ["사이드바 닫기"] }, "Favorite": { "v": ["즐겨찾기"] }, "Open sidebar": { "v": ["사이드바 열기"] } } }, { "l": "lo", "t": { "Change name": { "v": ["ປ່ຽນຊື່"] }, "Close sidebar": { "v": ["ປິດແຖບດ້ານຂ້າງ"] }, "Favorite": { "v": ["ລາຍການທີ່ມັກ"] }, "Open sidebar": { "v": ["ເປີດແຖບດ້ານຂ້າງ"] } } }, { "l": "lt-LT", "t": { "Change name": { "v": ["Pakeisti vardą"] }, "Close sidebar": { "v": ["Užverti šoninę juostą"] }, "Favorite": { "v": ["Mėgstamiausias"] }, "Open sidebar": { "v": ["Atverti šoninę juostą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Change name": { "v": ["Промени име"] }, "Close sidebar": { "v": ["Затвори странична лента"] }, "Favorite": { "v": ["Фаворити"] }, "Open sidebar": { "v": ["Отвори странична лента"] } } }, { "l": "mn", "t": { "Change name": { "v": ["Нэр солих"] }, "Close sidebar": { "v": ["Хажуугийн самбарыг хаах"] }, "Favorite": { "v": ["Дуртай"] }, "Open sidebar": { "v": ["Хажуугийн самбарыг нээх"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Change name": { "v": ["Endre navn"] }, "Close sidebar": { "v": ["Lukk sidepanel"] }, "Favorite": { "v": ["Favoritt"] }, "Open sidebar": { "v": ["Åpne sidefelt"] } } }, { "l": "nl", "t": { "Change name": { "v": ["Naam wijzigen"] }, "Close sidebar": { "v": ["Zijbalk sluiten"] }, "Favorite": { "v": ["Favoriet"] }, "Open sidebar": { "v": ["Zijbalk openen"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Change name": { "v": ["Zmień nazwę"] }, "Close sidebar": { "v": ["Zamknij pasek boczny"] }, "Favorite": { "v": ["Ulubiony"] }, "Open sidebar": { "v": ["Otwórz pasek boczny"] } } }, { "l": "pt-BR", "t": { "Change name": { "v": ["Mudar nome"] }, "Close sidebar": { "v": ["Fechar barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir barra lateral"] } } }, { "l": "pt-PT", "t": { "Change name": { "v": ["Alterar nome"] }, "Close sidebar": { "v": ["Fechar barra lateral"] }, "Favorite": { "v": ["Favorito"] }, "Open sidebar": { "v": ["Abrir barra lateral"] } } }, { "l": "ro", "t": { "Change name": { "v": ["Modifică numele"] }, "Close sidebar": { "v": ["Închide bara laterală"] }, "Favorite": { "v": ["Favorit"] } } }, { "l": "ru", "t": { "Change name": { "v": ["Изменить имя"] }, "Close sidebar": { "v": ["Закрыть сайдбар"] }, "Favorite": { "v": ["Избранное"] }, "Open sidebar": { "v": ["Открыть боковую панель"] } } }, { "l": "sk", "t": { "Change name": { "v": ["Zmeniť názov"] }, "Close sidebar": { "v": ["Zavrieť bočný panel"] }, "Favorite": { "v": ["Obľúbené"] }, "Open sidebar": { "v": ["Otvoriť bočný panel"] } } }, { "l": "sl", "t": { "Close sidebar": { "v": ["Zapri stransko vrstico"] }, "Favorite": { "v": ["Priljubljeno"] } } }, { "l": "sr", "t": { "Change name": { "v": ["Измени назив"] }, "Close sidebar": { "v": ["Затвори бочну траку"] }, "Favorite": { "v": ["Омиљени"] }, "Open sidebar": { "v": ["Отвори бочну траку"] } } }, { "l": "sv", "t": { "Change name": { "v": ["Ändra namn"] }, "Close sidebar": { "v": ["Stäng sidofältet"] }, "Favorite": { "v": ["Favorit"] }, "Open sidebar": { "v": ["Öppna sidofältet"] } } }, { "l": "tr", "t": { "Change name": { "v": ["Adı değiştir"] }, "Close sidebar": { "v": ["Yan çubuğu kapat"] }, "Favorite": { "v": ["Sık kullanılanlara ekle"] }, "Open sidebar": { "v": ["Yan çubuğu aç"] } } }, { "l": "uk", "t": { "Change name": { "v": ["Змінити назву"] }, "Close sidebar": { "v": ["Закрити бічну панель"] }, "Favorite": { "v": ["Із зірочкою"] }, "Open sidebar": { "v": ["Бокове меню"] } } }, { "l": "uz", "t": { "Change name": { "v": ["Ismni o'zgartirish"] }, "Close sidebar": { "v": ["Yon panelni yoping"] }, "Favorite": { "v": ["Tanlangan"] }, "Open sidebar": { "v": ["Yon panelni oching"] } } }, { "l": "zh-CN", "t": { "Change name": { "v": ["修改名称"] }, "Close sidebar": { "v": ["关闭侧边栏"] }, "Favorite": { "v": ["喜爱"] }, "Open sidebar": { "v": ["打开侧边栏"] } } }, { "l": "zh-HK", "t": { "Change name": { "v": ["更改名稱"] }, "Close sidebar": { "v": ["關閉側邊欄"] }, "Favorite": { "v": ["喜愛"] }, "Open sidebar": { "v": ["打開側邊欄"] } } }, { "l": "zh-TW", "t": { "Change name": { "v": ["變更名稱"] }, "Close sidebar": { "v": ["關閉側邊欄"] }, "Favorite": { "v": ["最愛"] }, "Open sidebar": { "v": ["開啟側邊欄"] } } }];
const t17 = [{ "l": "ar", "t": { "Clear selected": { "v": ["محو المحدّد"] }, "Deselect {option}": { "v": ["إلغاء تحديد {option}"] }, "No results": { "v": ["ليس هناك أية نتيجة"] }, "Options": { "v": ["خيارات"] } } }, { "l": "ast", "t": { "Clear selected": { "v": ["Borrar lo seleicionao"] }, "Deselect {option}": { "v": ["Deseleicionar «{option}»"] }, "No results": { "v": ["Nun hai nengún resultáu"] }, "Options": { "v": ["Opciones"] } } }, { "l": "br", "t": { "No results": { "v": ["Disoc'h ebet"] } } }, { "l": "ca", "t": { "No results": { "v": ["Sense resultats"] } } }, { "l": "cs", "t": { "Clear selected": { "v": ["Vyčistit vybrané"] }, "Deselect {option}": { "v": ["Zrušit výběr {option}"] }, "No results": { "v": ["Nic nenalezeno"] }, "Options": { "v": ["Možnosti"] } } }, { "l": "cs-CZ", "t": { "Clear selected": { "v": ["Vyčistit vybrané"] }, "Deselect {option}": { "v": ["Zrušit výběr {option}"] }, "No results": { "v": ["Nic nenalezeno"] }, "Options": { "v": ["Možnosti"] } } }, { "l": "da", "t": { "Clear selected": { "v": ["Ryd valgt"] }, "Deselect {option}": { "v": ["Fravælg {option}"] }, "No results": { "v": ["Ingen resultater"] }, "Options": { "v": ["Indstillinger"] } } }, { "l": "de", "t": { "Clear selected": { "v": ["Auswahl leeren"] }, "Deselect {option}": { "v": ["{option} abwählen"] }, "No results": { "v": ["Keine Ergebnisse"] }, "Options": { "v": ["Optionen"] } } }, { "l": "de-DE", "t": { "Clear selected": { "v": ["Auswahl leeren"] }, "Deselect {option}": { "v": ["{option} abwählen"] }, "No results": { "v": ["Keine Ergebnisse"] }, "Options": { "v": ["Optionen"] } } }, { "l": "el", "t": { "Clear selected": { "v": ["Εκκαθάριση επιλογής"] }, "Deselect {option}": { "v": ["Αποεπιλογή {option}"] }, "No results": { "v": ["Κανένα αποτέλεσμα"] }, "Options": { "v": ["Επιλογές"] } } }, { "l": "en-GB", "t": { "Clear selected": { "v": ["Clear selected"] }, "Deselect {option}": { "v": ["Deselect {option}"] }, "No results": { "v": ["No results"] }, "Options": { "v": ["Options"] } } }, { "l": "eo", "t": { "No results": { "v": ["La rezulto forestas"] } } }, { "l": "es", "t": { "Clear selected": { "v": ["Limpiar selección"] }, "Deselect {option}": { "v": ["Deseleccionar {option}"] }, "No results": { "v": [" Ningún resultado"] }, "Options": { "v": ["Opciones"] } } }, { "l": "es-AR", "t": { "Clear selected": { "v": ["Limpiar selección"] }, "Deselect {option}": { "v": ["Deseleccionar {option}"] }, "No results": { "v": ["Sin resultados"] }, "Options": { "v": ["Opciones"] } } }, { "l": "es-EC", "t": { "No results": { "v": ["Sin resultados"] } } }, { "l": "es-MX", "t": { "Clear selected": { "v": ["Limpiar selección"] }, "Deselect {option}": { "v": ["Deseleccionar {option}"] }, "No results": { "v": ["Sin resultados"] }, "Options": { "v": ["Opciones"] } } }, { "l": "et-EE", "t": { "Clear selected": { "v": ["Tühjenda valik"] }, "Deselect {option}": { "v": ["Eemalda {option} valik"] }, "No results": { "v": ["Tulemusi pole"] }, "Options": { "v": ["Valikud"] } } }, { "l": "eu", "t": { "No results": { "v": ["Emaitzarik ez"] } } }, { "l": "fa", "t": { "Clear selected": { "v": ["پاک کردن مورد انتخاب شده"] }, "Deselect {option}": { "v": ["لغو انتخاب {option}"] }, "No results": { "v": ["بدون هیچ نتیجه‌ای"] }, "Options": { "v": ["گزینه‌ها"] } } }, { "l": "fi", "t": { "Clear selected": { "v": ["Tyhjennä valitut"] }, "Deselect {option}": { "v": ["Poista valinta {option}"] }, "No results": { "v": ["Ei tuloksia"] }, "Options": { "v": ["Valinnat"] } } }, { "l": "fr", "t": { "Clear selected": { "v": ["Vider la sélection"] }, "Deselect {option}": { "v": ["Désélectionner {option}"] }, "No results": { "v": ["Aucun résultat"] }, "Options": { "v": ["Options"] } } }, { "l": "ga", "t": { "Clear selected": { "v": ["Glan roghnaithe"] }, "Deselect {option}": { "v": ["Díroghnaigh {option}"] }, "No results": { "v": ["Gan torthaí"] }, "Options": { "v": ["Roghanna"] } } }, { "l": "gl", "t": { "Clear selected": { "v": ["Limpar o seleccionado"] }, "Deselect {option}": { "v": ["Desmarcar {option}"] }, "No results": { "v": ["Sen resultados"] }, "Options": { "v": ["Opcións"] } } }, { "l": "he", "t": { "No results": { "v": ["אין תוצאות"] } } }, { "l": "hr", "t": { "Clear selected": { "v": ["Očisti odabir"] }, "Deselect {option}": { "v": ["Odznači {option}"] }, "No results": { "v": ["Nema rezultata"] }, "Options": { "v": ["Mogućnosti"] } } }, { "l": "hu", "t": { "Clear selected": { "v": ["Kijelölés törlése"] }, "Deselect {option}": { "v": ["{option} kijelölésének megszüntetése"] }, "No results": { "v": ["Nincs találat"] }, "Options": { "v": ["Beállítások"] } } }, { "l": "id", "t": { "Clear selected": { "v": ["Hapus terpilih"] }, "Deselect {option}": { "v": ["Batalkan pemilihan {option}"] }, "No results": { "v": ["Tidak ada hasil"] }, "Options": { "v": ["Opsi"] } } }, { "l": "is", "t": { "Clear selected": { "v": ["Hreinsa valið"] }, "Deselect {option}": { "v": ["Afvelja {option}"] }, "No results": { "v": ["Engar niðurstöður"] }, "Options": { "v": ["Valkostir"] } } }, { "l": "it", "t": { "Clear selected": { "v": ["Cancella selezionati"] }, "Deselect {option}": { "v": ["Deselezionare {option}"] }, "No results": { "v": ["Nessun risultato"] } } }, { "l": "ja", "t": { "Clear selected": { "v": ["選択を解除"] }, "Deselect {option}": { "v": ["{option} の選択を解除"] }, "No results": { "v": ["結果無し"] }, "Options": { "v": ["オプション"] } } }, { "l": "ja-JP", "t": { "Clear selected": { "v": ["選択を解除"] }, "Deselect {option}": { "v": ["{option} の選択を解除"] }, "No results": { "v": ["結果無し"] }, "Options": { "v": ["オプション"] } } }, { "l": "ko", "t": { "Clear selected": { "v": ["선택 항목 지우기"] }, "Deselect {option}": { "v": ["{option} 선택 해제"] }, "No results": { "v": ["결과 없음"] }, "Options": { "v": ["옵션"] } } }, { "l": "lo", "t": { "Clear selected": { "v": ["ລຶບສິ່ງທີ່ເລືອກ"] }, "Deselect {option}": { "v": ["ຍົກເລີກການເລືອກ {option}"] }, "No results": { "v": ["ບໍ່ມີຜົນລັບ"] }, "Options": { "v": ["ຕົວເລືອກ"] } } }, { "l": "lt-LT", "t": { "Clear selected": { "v": ["Išvalyti pasirinkimą"] }, "Deselect {option}": { "v": ["Panaikinkite {option} pasirinkimą"] }, "No results": { "v": ["Nėra rezultatų"] }, "Options": { "v": ["Parinktys"] } } }, { "l": "lv", "t": { "No results": { "v": ["Nav rezultātu"] } } }, { "l": "mk", "t": { "Clear selected": { "v": ["Исчисти означени"] }, "Deselect {option}": { "v": ["Откажи избор на {option}"] }, "No results": { "v": ["Нема резултати"] }, "Options": { "v": ["Опции"] } } }, { "l": "mn", "t": { "Clear selected": { "v": ["Сонголтыг цэвэрлэх"] }, "Deselect {option}": { "v": ["{option}-г сонголтоос хасах"] }, "No results": { "v": ["Үр дүн алга"] }, "Options": { "v": ["Тохиргоо"] } } }, { "l": "my", "t": { "No results": { "v": ["ရလဒ်မရှိပါ"] } } }, { "l": "nb", "t": { "Clear selected": { "v": ["Tøm merket"] }, "Deselect {option}": { "v": ["Opphev valg {option}"] }, "No results": { "v": ["Ingen resultater"] }, "Options": { "v": ["Alternativer"] } } }, { "l": "nl", "t": { "Clear selected": { "v": ["Selectie wissen"] }, "Deselect {option}": { "v": ["Selectie {option} opheffen"] }, "No results": { "v": ["Geen resultaten"] }, "Options": { "v": ["Opties"] } } }, { "l": "oc", "t": { "No results": { "v": ["Cap de resultat"] } } }, { "l": "pl", "t": { "Clear selected": { "v": ["Wyczyść wybrane"] }, "Deselect {option}": { "v": ["Odznacz {option}"] }, "No results": { "v": ["Brak wyników"] }, "Options": { "v": ["Opcje"] } } }, { "l": "pt-BR", "t": { "Clear selected": { "v": ["Limpar selecionado"] }, "Deselect {option}": { "v": ["Desselecionar {option}"] }, "No results": { "v": ["Sem resultados"] }, "Options": { "v": ["Opções"] } } }, { "l": "pt-PT", "t": { "Clear selected": { "v": ["Limpeza selecionada"] }, "Deselect {option}": { "v": ["Desmarcar {option}"] }, "No results": { "v": ["Sem resultados"] }, "Options": { "v": ["Opções"] } } }, { "l": "ro", "t": { "Clear selected": { "v": ["Șterge selecția"] }, "Deselect {option}": { "v": ["Deselctează {option}"] }, "No results": { "v": ["Nu există rezultate"] } } }, { "l": "ru", "t": { "Clear selected": { "v": ["Очистить выбранный"] }, "Deselect {option}": { "v": ["Отменить выбор {option}"] }, "No results": { "v": ["Результаты отсуствуют"] }, "Options": { "v": ["Варианты"] } } }, { "l": "sk", "t": { "Clear selected": { "v": ["Vymazať vybraté"] }, "Deselect {option}": { "v": ["Zrušiť výber {option}"] }, "No results": { "v": ["Žiadne výsledky"] }, "Options": { "v": ["možnosti"] } } }, { "l": "sl", "t": { "No results": { "v": ["Ni zadetkov"] } } }, { "l": "sr", "t": { "Clear selected": { "v": ["Обриши изабрано"] }, "Deselect {option}": { "v": ["Уклони избор {option}"] }, "No results": { "v": ["Нема резултата"] }, "Options": { "v": ["Опције"] } } }, { "l": "sv", "t": { "Clear selected": { "v": ["Rensa val"] }, "Deselect {option}": { "v": ["Avmarkera {option}"] }, "No results": { "v": ["Inga resultat"] }, "Options": { "v": ["Alternativ"] } } }, { "l": "tr", "t": { "Clear selected": { "v": ["Seçilmişleri temizle"] }, "Deselect {option}": { "v": ["{option} bırak"] }, "No results": { "v": ["Herhangi bir sonuç bulunamadı"] }, "Options": { "v": ["Seçenekler"] } } }, { "l": "uk", "t": { "Clear selected": { "v": ["Очистити вибране"] }, "Deselect {option}": { "v": ["Зняти вибір {option}"] }, "No results": { "v": ["Відсутні результати"] }, "Options": { "v": ["Параметри"] } } }, { "l": "uz", "t": { "Clear selected": { "v": ["Tanlanganni tozalash"] }, "Deselect {option}": { "v": ["{option}tanlovni bekor qiling"] }, "No results": { "v": ["Natija yoʻq"] }, "Options": { "v": ["Variantlar"] } } }, { "l": "zh-CN", "t": { "Clear selected": { "v": ["清除所选"] }, "Deselect {option}": { "v": ["取消选择 {option}"] }, "No results": { "v": ["无结果"] }, "Options": { "v": ["选项"] } } }, { "l": "zh-HK", "t": { "Clear selected": { "v": ["清除所選項目"] }, "Deselect {option}": { "v": ["取消選擇 {option}"] }, "No results": { "v": ["無結果"] }, "Options": { "v": ["選項"] } } }, { "l": "zh-TW", "t": { "Clear selected": { "v": ["清除選定項目"] }, "Deselect {option}": { "v": ["取消選取 {option}"] }, "No results": { "v": ["無結果"] }, "Options": { "v": ["選項"] } } }];
const t18 = [{ "l": "ar", "t": { "Clear text": { "v": ["محو النص"] }, "Save changes": { "v": ["حفظ التغييرات"] } } }, { "l": "ast", "t": { "Clear text": { "v": ["Borrar el testu"] }, "Save changes": { "v": ["Guardar los cambeos"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Clear text": { "v": ["Netejar text"] } } }, { "l": "cs", "t": { "Clear text": { "v": ["Čitelný text"] }, "Save changes": { "v": ["Uložit změny"] } } }, { "l": "cs-CZ", "t": { "Clear text": { "v": ["Čitelný text"] }, "Save changes": { "v": ["Uložit změny"] } } }, { "l": "da", "t": { "Clear text": { "v": ["Ryd tekst"] }, "Save changes": { "v": ["Gem ændringer"] } } }, { "l": "de", "t": { "Clear text": { "v": ["Klartext"] }, "Save changes": { "v": ["Änderungen speichern"] } } }, { "l": "de-DE", "t": { "Clear text": { "v": ["Klartext"] }, "Save changes": { "v": ["Änderungen speichern"] } } }, { "l": "el", "t": { "Clear text": { "v": ["Εκκαθάριση κειμένου"] }, "Save changes": { "v": ["Αποθήκευση αλλαγών"] } } }, { "l": "en-GB", "t": { "Clear text": { "v": ["Clear text"] }, "Save changes": { "v": ["Save changes"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Clear text": { "v": ["Limpiar texto"] }, "Save changes": { "v": ["Guardar cambios"] } } }, { "l": "es-AR", "t": { "Clear text": { "v": ["Limpiar texto"] }, "Save changes": { "v": ["Guardar cambios"] } } }, { "l": "es-EC", "t": { "Clear text": { "v": ["Limpiar texto"] } } }, { "l": "es-MX", "t": { "Clear text": { "v": ["Limpiar texto"] }, "Save changes": { "v": ["Guardar cambios"] } } }, { "l": "et-EE", "t": { "Clear text": { "v": ["Kustuta tekst"] }, "Save changes": { "v": ["Salvesta muudatused"] } } }, { "l": "eu", "t": { "Clear text": { "v": ["Garbitu testua"] } } }, { "l": "fa", "t": { "Clear text": { "v": ["پاک کردن متن"] }, "Save changes": { "v": ["ذخیرهٔ تغییرات"] } } }, { "l": "fi", "t": { "Clear text": { "v": ["Tyhjennä teksti"] }, "Save changes": { "v": ["Tallenna muutokset"] } } }, { "l": "fr", "t": { "Clear text": { "v": ["Effacer le texte"] }, "Save changes": { "v": ["Sauvegarder les changements"] } } }, { "l": "ga", "t": { "Clear text": { "v": ["Glan téacs"] }, "Save changes": { "v": ["Sabháil na hathruithe"] } } }, { "l": "gl", "t": { "Clear text": { "v": ["Limpar o texto"] }, "Save changes": { "v": ["Gardar os cambios"] } } }, { "l": "he", "t": { "Clear text": { "v": ["פינוי טקסט"] } } }, { "l": "hr", "t": { "Clear text": { "v": ["Očisti tekst"] }, "Save changes": { "v": ["Spremi promjene"] } } }, { "l": "hu", "t": { "Clear text": { "v": ["Szöveg törlése"] }, "Save changes": { "v": ["Változtatások mentése"] } } }, { "l": "id", "t": { "Clear text": { "v": ["Bersihkan teks"] }, "Save changes": { "v": ["Simpan perubahan"] } } }, { "l": "is", "t": { "Clear text": { "v": ["Hreinsa texta"] }, "Save changes": { "v": ["Vista breytingar"] } } }, { "l": "it", "t": { "Clear text": { "v": ["Cancella il testo"] }, "Save changes": { "v": ["Salva le modifiche"] } } }, { "l": "ja", "t": { "Clear text": { "v": ["テキストをクリア"] }, "Save changes": { "v": ["変更を保存"] } } }, { "l": "ja-JP", "t": { "Clear text": { "v": ["テキストをクリア"] }, "Save changes": { "v": ["変更を保存"] } } }, { "l": "ko", "t": { "Clear text": { "v": ["텍스트 지우기"] }, "Save changes": { "v": ["변경 사항 저장"] } } }, { "l": "lo", "t": { "Clear text": { "v": ["ລຶບຂໍ້ຄວາມ"] }, "Save changes": { "v": ["ບັນທຶກການປ່ຽນແປງ"] } } }, { "l": "lt-LT", "t": { "Clear text": { "v": ["Išvalyti tekstą"] }, "Save changes": { "v": ["Įrašyti pakeitimus"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Clear text": { "v": ["Исчисти текст"] }, "Save changes": { "v": ["Зачувај промени"] } } }, { "l": "mn", "t": { "Clear text": { "v": ["Текстийг цэвэрлэх"] }, "Save changes": { "v": ["Өөрчлөлтийг хадгалах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Clear text": { "v": ["Fjern tekst"] }, "Save changes": { "v": ["Lagre endringer"] } } }, { "l": "nl", "t": { "Clear text": { "v": ["Tekst wissen"] }, "Save changes": { "v": ["Wijzigingen opslaan"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Clear text": { "v": ["Wyczyść tekst"] }, "Save changes": { "v": ["Zapisz zmiany"] } } }, { "l": "pt-BR", "t": { "Clear text": { "v": ["Limpar texto"] }, "Save changes": { "v": ["Salvar alterações"] } } }, { "l": "pt-PT", "t": { "Clear text": { "v": ["Limpar texto"] }, "Save changes": { "v": ["Gravar alterações"] } } }, { "l": "ro", "t": { "Clear text": { "v": ["Șterge textul"] }, "Save changes": { "v": ["Salvează modificările"] } } }, { "l": "ru", "t": { "Clear text": { "v": ["Очистить текст"] }, "Save changes": { "v": ["Сохранить изменения"] } } }, { "l": "sk", "t": { "Clear text": { "v": ["Vamazať text"] }, "Save changes": { "v": ["Uložiť zmeny"] } } }, { "l": "sl", "t": { "Clear text": { "v": ["Počisti besedilo"] } } }, { "l": "sr", "t": { "Clear text": { "v": ["Обриши текст"] }, "Save changes": { "v": ["Сачувај измене"] } } }, { "l": "sv", "t": { "Clear text": { "v": ["Ta bort text"] }, "Save changes": { "v": ["Spara ändringar"] } } }, { "l": "tr", "t": { "Clear text": { "v": ["Metni temizle"] }, "Save changes": { "v": ["Değişiklikleri kaydet"] } } }, { "l": "uk", "t": { "Clear text": { "v": ["Очистити текст"] }, "Save changes": { "v": ["Зберегти зміни"] } } }, { "l": "uz", "t": { "Clear text": { "v": ["Matnni tozalash"] }, "Save changes": { "v": ["O'zgarishlarni saqlang"] } } }, { "l": "zh-CN", "t": { "Clear text": { "v": ["清除文本"] }, "Save changes": { "v": ["保存修改"] } } }, { "l": "zh-HK", "t": { "Clear text": { "v": ["清除文本"] }, "Save changes": { "v": ["保存更改"] } } }, { "l": "zh-TW", "t": { "Clear text": { "v": ["清除文字"] }, "Save changes": { "v": ["儲存變更"] } } }];
const t19 = [{ "l": "ar", "t": { "Close": { "v": ["إغلاق"] } } }, { "l": "ast", "t": { "Close": { "v": ["Zarrar"] } } }, { "l": "br", "t": { "Close": { "v": ["Serriñ"] } } }, { "l": "ca", "t": { "Close": { "v": ["Tanca"] } } }, { "l": "cs", "t": { "Close": { "v": ["Zavřít"] } } }, { "l": "cs-CZ", "t": { "Close": { "v": ["Zavřít"] } } }, { "l": "da", "t": { "Close": { "v": ["Luk"] } } }, { "l": "de", "t": { "Close": { "v": ["Schließen"] } } }, { "l": "de-DE", "t": { "Close": { "v": ["Schließen"] } } }, { "l": "el", "t": { "Close": { "v": ["Κλείσιμο"] } } }, { "l": "en-GB", "t": { "Close": { "v": ["Close"] } } }, { "l": "eo", "t": { "Close": { "v": ["Fermu"] } } }, { "l": "es", "t": { "Close": { "v": ["Cerrar"] } } }, { "l": "es-AR", "t": { "Close": { "v": ["Cerrar"] } } }, { "l": "es-EC", "t": { "Close": { "v": ["Cerrar"] } } }, { "l": "es-MX", "t": { "Close": { "v": ["Cerrar"] } } }, { "l": "et-EE", "t": { "Close": { "v": ["Sulge"] } } }, { "l": "eu", "t": { "Close": { "v": ["Itxi"] } } }, { "l": "fa", "t": { "Close": { "v": ["بستن"] } } }, { "l": "fi", "t": { "Close": { "v": ["Sulje"] } } }, { "l": "fr", "t": { "Close": { "v": ["Fermer"] } } }, { "l": "ga", "t": { "Close": { "v": ["Dún"] } } }, { "l": "gl", "t": { "Close": { "v": ["Pechar"] } } }, { "l": "he", "t": { "Close": { "v": ["סגירה"] } } }, { "l": "hr", "t": { "Close": { "v": ["Zatvori"] } } }, { "l": "hu", "t": { "Close": { "v": ["Bezárás"] } } }, { "l": "id", "t": { "Close": { "v": ["Tutup"] } } }, { "l": "is", "t": { "Close": { "v": ["Loka"] } } }, { "l": "it", "t": { "Close": { "v": ["Chiudi"] } } }, { "l": "ja", "t": { "Close": { "v": ["閉じる"] } } }, { "l": "ja-JP", "t": { "Close": { "v": ["閉じる"] } } }, { "l": "ko", "t": { "Close": { "v": ["닫기"] } } }, { "l": "lo", "t": { "Close": { "v": ["ປິດ"] } } }, { "l": "lt-LT", "t": { "Close": { "v": ["Užverti"] } } }, { "l": "lv", "t": { "Close": { "v": ["Aizvērt"] } } }, { "l": "mk", "t": { "Close": { "v": ["Затвори"] } } }, { "l": "mn", "t": { "Close": { "v": ["Хаах"] } } }, { "l": "my", "t": { "Close": { "v": ["ပိတ်ရန်"] } } }, { "l": "nb", "t": { "Close": { "v": ["Lukk"] } } }, { "l": "nl", "t": { "Close": { "v": ["Sluiten"] } } }, { "l": "oc", "t": { "Close": { "v": ["Tampar"] } } }, { "l": "pl", "t": { "Close": { "v": ["Zamknij"] } } }, { "l": "pt-BR", "t": { "Close": { "v": ["Fechar"] } } }, { "l": "pt-PT", "t": { "Close": { "v": ["Fechar"] } } }, { "l": "ro", "t": { "Close": { "v": ["Închideți"] } } }, { "l": "ru", "t": { "Close": { "v": ["Закрыть"] } } }, { "l": "sk", "t": { "Close": { "v": ["Zavrieť"] } } }, { "l": "sl", "t": { "Close": { "v": ["Zapri"] } } }, { "l": "sr", "t": { "Close": { "v": ["Затвори"] } } }, { "l": "sv", "t": { "Close": { "v": ["Stäng"] } } }, { "l": "tr", "t": { "Close": { "v": ["Kapat"] } } }, { "l": "uk", "t": { "Close": { "v": ["Закрити"] } } }, { "l": "uz", "t": { "Close": { "v": ["Yopish"] } } }, { "l": "zh-CN", "t": { "Close": { "v": ["关闭"] } } }, { "l": "zh-HK", "t": { "Close": { "v": ["關閉"] } } }, { "l": "zh-TW", "t": { "Close": { "v": ["關閉"] } } }];
const t20 = [{ "l": "ar", "t": { "Close navigation": { "v": ["إغلاق التصفح"] }, "Open navigation": { "v": ["فتح التنقُّل"] } } }, { "l": "ast", "t": { "Close navigation": { "v": ["Zarrar la navegación"] }, "Open navigation": { "v": ["Abrir la navegación"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Close navigation": { "v": ["Tanca la navegació"] }, "Open navigation": { "v": ["Obre la navegació"] } } }, { "l": "cs", "t": { "Close navigation": { "v": ["Zavřít navigaci"] }, "Open navigation": { "v": ["Otevřít navigaci"] } } }, { "l": "cs-CZ", "t": { "Close navigation": { "v": ["Zavřít navigaci"] }, "Open navigation": { "v": ["Otevřít navigaci"] } } }, { "l": "da", "t": { "Close navigation": { "v": ["Luk navigation"] }, "Open navigation": { "v": ["Åben navigation"] } } }, { "l": "de", "t": { "Close navigation": { "v": ["Navigation schließen"] }, "Open navigation": { "v": ["Navigation öffnen"] } } }, { "l": "de-DE", "t": { "Close navigation": { "v": ["Navigation schließen"] }, "Open navigation": { "v": ["Navigation öffnen"] } } }, { "l": "el", "t": { "Close navigation": { "v": ["Κλείσιμο πλοήγησης"] }, "Open navigation": { "v": ["Άνοιγμα πλοήγησης"] } } }, { "l": "en-GB", "t": { "Close navigation": { "v": ["Close navigation"] }, "Open navigation": { "v": ["Open navigation"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Close navigation": { "v": ["Cerrar navegación"] }, "Open navigation": { "v": ["Abrir navegación"] } } }, { "l": "es-AR", "t": { "Close navigation": { "v": ["Cerrar navegación"] }, "Open navigation": { "v": ["Abrir navegación"] } } }, { "l": "es-EC", "t": { "Close navigation": { "v": ["Cerrar navegación"] }, "Open navigation": { "v": ["Abrir navegación"] } } }, { "l": "es-MX", "t": { "Close navigation": { "v": ["Cerrar navegación"] }, "Open navigation": { "v": ["Abrir navegación"] } } }, { "l": "et-EE", "t": { "Close navigation": { "v": ["Sulge navigatsioon"] }, "Open navigation": { "v": ["Ava liikumisvaade"] } } }, { "l": "eu", "t": { "Close navigation": { "v": ["Itxi nabigazioa"] }, "Open navigation": { "v": ["Ireki nabigazioa"] } } }, { "l": "fa", "t": { "Close navigation": { "v": ["بستن بخش ناوبری"] }, "Open navigation": { "v": ["باز کردن بخش ناوبری"] } } }, { "l": "fi", "t": { "Close navigation": { "v": ["Sulje navigaatio"] } } }, { "l": "fr", "t": { "Close navigation": { "v": ["Fermer la navigation"] }, "Open navigation": { "v": ["Ouvrir la navigation"] } } }, { "l": "ga", "t": { "Close navigation": { "v": ["Dún nascleanúint"] }, "Open navigation": { "v": ["Oscail nascleanúint"] } } }, { "l": "gl", "t": { "Close navigation": { "v": ["Pechar a navegación"] }, "Open navigation": { "v": ["Abrir a navegación"] } } }, { "l": "he", "t": { "Close navigation": { "v": ["סגירת הניווט"] }, "Open navigation": { "v": ["פתיחת ניווט"] } } }, { "l": "hr", "t": { "Close navigation": { "v": ["Zatvori navigaciju"] }, "Open navigation": { "v": ["Otvori navigaciju"] } } }, { "l": "hu", "t": { "Close navigation": { "v": ["Navigáció bezárása"] }, "Open navigation": { "v": ["Navigáció megnyitása"] } } }, { "l": "id", "t": { "Close navigation": { "v": ["Tutup navigasi"] }, "Open navigation": { "v": ["Buka navigasi"] } } }, { "l": "is", "t": { "Close navigation": { "v": ["Loka leiðsagnarsleða"] } } }, { "l": "it", "t": { "Close navigation": { "v": ["Chiudi la navigazione"] }, "Open navigation": { "v": ["Apri la navigazione"] } } }, { "l": "ja", "t": { "Close navigation": { "v": ["ナビゲーションを閉じる"] }, "Open navigation": { "v": ["ナビゲーションを開く"] } } }, { "l": "ja-JP", "t": { "Close navigation": { "v": ["ナビゲーションを閉じる"] }, "Open navigation": { "v": ["ナビゲーションを開く"] } } }, { "l": "ko", "t": { "Close navigation": { "v": ["탐색 닫기"] }, "Open navigation": { "v": ["탐색 열기"] } } }, { "l": "lo", "t": { "Close navigation": { "v": ["ປິດການນຳທາງ"] }, "Open navigation": { "v": ["ເປີດການນຳທາງ"] } } }, { "l": "lt-LT", "t": { "Close navigation": { "v": ["Užverti naršymą"] }, "Open navigation": { "v": ["Atverti naršymą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Close navigation": { "v": ["Затвори навигација"] }, "Open navigation": { "v": ["Отвори навигација"] } } }, { "l": "mn", "t": { "Close navigation": { "v": ["Навигацийг хаах"] }, "Open navigation": { "v": ["Навигацийг нээх"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Close navigation": { "v": ["Lukk navigasjon"] }, "Open navigation": { "v": ["Åpne navigasjon"] } } }, { "l": "nl", "t": { "Close navigation": { "v": ["Navigatie sluiten"] }, "Open navigation": { "v": ["Navigatie openen"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Close navigation": { "v": ["Zamknij nawigację"] } } }, { "l": "pt-BR", "t": { "Close navigation": { "v": ["Fechar navegação"] }, "Open navigation": { "v": ["Abrir navegação"] } } }, { "l": "pt-PT", "t": { "Close navigation": { "v": ["Fechar navegação"] }, "Open navigation": { "v": ["Abrir navegação"] } } }, { "l": "ro", "t": { "Close navigation": { "v": ["Închideți navigarea"] }, "Open navigation": { "v": ["Deschideți navigația"] } } }, { "l": "ru", "t": { "Close navigation": { "v": ["Закрыть навигацию"] }, "Open navigation": { "v": ["Открыть навигацию"] } } }, { "l": "sk", "t": { "Close navigation": { "v": ["Zavrieť navigáciu"] } } }, { "l": "sl", "t": { "Close navigation": { "v": ["Zapri krmarjenje"] }, "Open navigation": { "v": ["Odpri krmarjenje"] } } }, { "l": "sr", "t": { "Close navigation": { "v": ["Затвори навигацију"] }, "Open navigation": { "v": ["Отвори навигацију"] } } }, { "l": "sv", "t": { "Close navigation": { "v": ["Stäng navigering"] }, "Open navigation": { "v": ["Öppna navigering"] } } }, { "l": "tr", "t": { "Close navigation": { "v": ["Gezinmeyi kapat"] }, "Open navigation": { "v": ["Gezinmeyi aç"] } } }, { "l": "uk", "t": { "Close navigation": { "v": ["Закрити навігацію"] }, "Open navigation": { "v": ["Перейти до навігації"] } } }, { "l": "uz", "t": { "Close navigation": { "v": ["Navigatsiyani yopish"] }, "Open navigation": { "v": ["Navigatsiyani oching"] } } }, { "l": "zh-CN", "t": { "Close navigation": { "v": ["关闭导航"] } } }, { "l": "zh-HK", "t": { "Close navigation": { "v": ["關閉導航"] }, "Open navigation": { "v": ["開啟導航"] } } }, { "l": "zh-TW", "t": { "Close navigation": { "v": ["關閉導航"] }, "Open navigation": { "v": ["開啟導航"] } } }];
const t21 = [{ "l": "ar", "t": { "Collapse menu": { "v": ["طي القائمة"] }, "Open menu": { "v": ["إفتَح القائمة"] } } }, { "l": "ast", "t": { "Collapse menu": { "v": ["Recoyer el menú"] }, "Open menu": { "v": ["Abrir le menú"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Collapse menu": { "v": ["Sbalit nabídku"] }, "Open menu": { "v": ["Otevřít nabídku"] } } }, { "l": "cs-CZ", "t": { "Collapse menu": { "v": ["Sbalit nabídku"] }, "Open menu": { "v": ["Otevřít nabídku"] } } }, { "l": "da", "t": { "Collapse menu": { "v": ["Skjul menuen"] }, "Open menu": { "v": ["Åben menu"] } } }, { "l": "de", "t": { "Collapse menu": { "v": ["Menü einklappen"] }, "Open menu": { "v": ["Menü öffnen"] } } }, { "l": "de-DE", "t": { "Collapse menu": { "v": ["Menü einklappen"] }, "Open menu": { "v": ["Menü öffnen"] } } }, { "l": "el", "t": { "Collapse menu": { "v": ["Σύμπτυξη μενού"] }, "Open menu": { "v": ["Άνοιγμα μενού"] } } }, { "l": "en-GB", "t": { "Collapse menu": { "v": ["Collapse menu"] }, "Open menu": { "v": ["Open menu"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Collapse menu": { "v": ["Ocultar menú"] }, "Open menu": { "v": ["Abrir menú"] } } }, { "l": "es-AR", "t": { "Collapse menu": { "v": ["Ocultar menú"] }, "Open menu": { "v": ["Abrir menú"] } } }, { "l": "es-EC", "t": { "Collapse menu": { "v": ["Ocultar menú"] }, "Open menu": { "v": ["Abrir menú"] } } }, { "l": "es-MX", "t": { "Collapse menu": { "v": ["Ocultar menú"] }, "Open menu": { "v": ["Abrir menú"] } } }, { "l": "et-EE", "t": { "Collapse menu": { "v": ["Ahenda menüü"] }, "Open menu": { "v": ["Ava menüü"] } } }, { "l": "eu", "t": { "Collapse menu": { "v": ["Tolestu menua"] }, "Open menu": { "v": ["Ireki menua"] } } }, { "l": "fa", "t": { "Collapse menu": { "v": ["بستن فهرست"] }, "Open menu": { "v": ["باز کردن فهرست"] } } }, { "l": "fi", "t": { "Collapse menu": { "v": ["Supista valikko"] }, "Open menu": { "v": ["Avaa valikko"] } } }, { "l": "fr", "t": { "Collapse menu": { "v": ["Réduire le menu"] }, "Open menu": { "v": ["Ouvrir le menu"] } } }, { "l": "ga", "t": { "Collapse menu": { "v": ["Roghchlár Laghdaigh"] }, "Open menu": { "v": ["Roghchlár a oscailt"] } } }, { "l": "gl", "t": { "Collapse menu": { "v": ["Contraer o menú"] }, "Open menu": { "v": ["Abrir o menú"] } } }, { "l": "he", "t": { "Collapse menu": { "v": ["צמצום התפריט"] }, "Open menu": { "v": ["פתיחת תפריט"] } } }, { "l": "hr", "t": { "Collapse menu": { "v": ["Sakrij izbornik"] }, "Open menu": { "v": ["Otvori izbornik"] } } }, { "l": "hu", "t": { "Collapse menu": { "v": ["Menü összecsukása"] }, "Open menu": { "v": ["Menü megnyitása"] } } }, { "l": "id", "t": { "Collapse menu": { "v": ["Ciutkan menu"] }, "Open menu": { "v": ["Buka menu"] } } }, { "l": "is", "t": { "Collapse menu": { "v": ["Fella valmynd saman"] }, "Open menu": { "v": ["Opna valmynd"] } } }, { "l": "it", "t": { "Collapse menu": { "v": ["Chiudi Menu"] }, "Open menu": { "v": ["Apri il menu"] } } }, { "l": "ja", "t": { "Collapse menu": { "v": ["メニューの折りたたみ"] }, "Open menu": { "v": ["メニューを開く"] } } }, { "l": "ja-JP", "t": { "Collapse menu": { "v": ["メニューの折りたたみ"] }, "Open menu": { "v": ["メニューを開く"] } } }, { "l": "ko", "t": { "Collapse menu": { "v": ["메뉴 접기"] }, "Open menu": { "v": ["메뉴 열기"] } } }, { "l": "lo", "t": { "Collapse menu": { "v": ["ຫຍໍ້ເມນູ"] }, "Open menu": { "v": ["ເປີດເມນູ"] } } }, { "l": "lt-LT", "t": { "Collapse menu": { "v": ["Suskleisti meniu"] }, "Open menu": { "v": ["Atverti meniu"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Collapse menu": { "v": ["Скриј мени"] }, "Open menu": { "v": ["Отвори мени"] } } }, { "l": "mn", "t": { "Collapse menu": { "v": ["Цэсийг хураах"] }, "Open menu": { "v": ["Цэсийг нээх"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Collapse menu": { "v": ["Skjul meny"] }, "Open menu": { "v": ["Åpne meny"] } } }, { "l": "nl", "t": { "Collapse menu": { "v": ["Menu inklappen"] }, "Open menu": { "v": ["Menu openen"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Collapse menu": { "v": ["Zwiń menu"] }, "Open menu": { "v": ["Otwórz menu"] } } }, { "l": "pt-BR", "t": { "Collapse menu": { "v": ["Recolher menu"] }, "Open menu": { "v": ["Abrir menu"] } } }, { "l": "pt-PT", "t": { "Collapse menu": { "v": ["Ocultar menu"] }, "Open menu": { "v": ["Abrir menu"] } } }, { "l": "ro", "t": { "Collapse menu": { "v": ["Restrânge meniul"] }, "Open menu": { "v": ["Deschide meniul"] } } }, { "l": "ru", "t": { "Collapse menu": { "v": ["Свернуть меню"] }, "Open menu": { "v": ["Открыть меню"] } } }, { "l": "sk", "t": { "Collapse menu": { "v": ["Zbaliť menu"] }, "Open menu": { "v": ["Otvoriť menu"] } } }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Collapse menu": { "v": ["Сажми мени"] }, "Open menu": { "v": ["Отвори мени"] } } }, { "l": "sv", "t": { "Collapse menu": { "v": ["Dölj menyn"] }, "Open menu": { "v": ["Öppna menyn"] } } }, { "l": "tr", "t": { "Collapse menu": { "v": ["Menüyü daralt"] }, "Open menu": { "v": ["Menüyü aç"] } } }, { "l": "uk", "t": { "Collapse menu": { "v": ["Згорнути меню"] }, "Open menu": { "v": ["Відкрити меню"] } } }, { "l": "uz", "t": { "Collapse menu": { "v": ["Menyuni yig‘ish"] }, "Open menu": { "v": ["Menyuni oching"] } } }, { "l": "zh-CN", "t": { "Collapse menu": { "v": ["收起菜单"] }, "Open menu": { "v": ["打开菜单"] } } }, { "l": "zh-HK", "t": { "Collapse menu": { "v": ["折疊選單"] }, "Open menu": { "v": ["開啟選單"] } } }, { "l": "zh-TW", "t": { "Collapse menu": { "v": ["折疊選單"] }, "Open menu": { "v": ["開啟選單"] } } }];
const t23 = [{ "l": "ar", "t": { "Edit item": { "v": ["تعديل عنصر"] } } }, { "l": "ast", "t": { "Edit item": { "v": ["Editar l'elementu"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Edit item": { "v": ["Edita l'element"] } } }, { "l": "cs", "t": { "Edit item": { "v": ["Upravit položku"] } } }, { "l": "cs-CZ", "t": { "Edit item": { "v": ["Upravit položku"] } } }, { "l": "da", "t": { "Edit item": { "v": ["Rediger emne"] } } }, { "l": "de", "t": { "Edit item": { "v": ["Element bearbeiten"] } } }, { "l": "de-DE", "t": { "Edit item": { "v": ["Element bearbeiten"] } } }, { "l": "el", "t": { "Edit item": { "v": ["Επεξεργασία αντικειμένου"] } } }, { "l": "en-GB", "t": { "Edit item": { "v": ["Edit item"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Edit item": { "v": ["Editar elemento"] } } }, { "l": "es-AR", "t": { "Edit item": { "v": ["Editar elemento"] } } }, { "l": "es-EC", "t": { "Edit item": { "v": ["Editar elemento"] } } }, { "l": "es-MX", "t": { "Edit item": { "v": ["Editar elemento"] } } }, { "l": "et-EE", "t": { "Edit item": { "v": ["Muuda objekti"] } } }, { "l": "eu", "t": { "Edit item": { "v": ["Editatu elementua"] } } }, { "l": "fa", "t": { "Edit item": { "v": ["ویرایش مورد"] } } }, { "l": "fi", "t": { "Edit item": { "v": ["Muokkaa kohdetta"] } } }, { "l": "fr", "t": { "Edit item": { "v": ["Éditer l'élément"] } } }, { "l": "ga", "t": { "Edit item": { "v": ["Cuir mír in eagar"] } } }, { "l": "gl", "t": { "Edit item": { "v": ["Editar o elemento"] } } }, { "l": "he", "t": { "Edit item": { "v": ["עריכת פריט"] } } }, { "l": "hr", "t": { "Edit item": { "v": ["Uredi stavku"] } } }, { "l": "hu", "t": { "Edit item": { "v": ["Elem szerkesztése"] } } }, { "l": "id", "t": { "Edit item": { "v": ["Edit item"] } } }, { "l": "is", "t": { "Edit item": { "v": ["Breyta atriði"] } } }, { "l": "it", "t": { "Edit item": { "v": ["Modifica l'elemento"] } } }, { "l": "ja", "t": { "Edit item": { "v": ["編集"] } } }, { "l": "ja-JP", "t": { "Edit item": { "v": ["編集"] } } }, { "l": "ko", "t": { "Edit item": { "v": ["항목 수정"] } } }, { "l": "lo", "t": { "Edit item": { "v": ["ແກ້ໄຂລາຍການ"] } } }, { "l": "lt-LT", "t": { "Edit item": { "v": ["Taisyti elementą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Edit item": { "v": ["Уреди"] } } }, { "l": "mn", "t": { "Edit item": { "v": ["Зүйлийг засварлах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Edit item": { "v": ["Rediger"] } } }, { "l": "nl", "t": { "Edit item": { "v": ["Item bewerken"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Edit item": { "v": ["Edytuj element"] } } }, { "l": "pt-BR", "t": { "Edit item": { "v": ["Editar item"] } } }, { "l": "pt-PT", "t": { "Edit item": { "v": ["Editar item"] } } }, { "l": "ro", "t": { "Edit item": { "v": ["Editați elementul"] } } }, { "l": "ru", "t": { "Edit item": { "v": ["Изменить элемент"] } } }, { "l": "sk", "t": { "Edit item": { "v": ["Upraviť položku"] } } }, { "l": "sl", "t": { "Edit item": { "v": ["Uredi predmet"] } } }, { "l": "sr", "t": { "Edit item": { "v": ["Уреди ставку"] } } }, { "l": "sv", "t": { "Edit item": { "v": ["Redigera objekt"] } } }, { "l": "tr", "t": { "Edit item": { "v": ["Ögeyi düzenle"] } } }, { "l": "uk", "t": { "Edit item": { "v": ["Редагувати елемент"] } } }, { "l": "uz", "t": { "Edit item": { "v": ["Elementni tahrirlash"] } } }, { "l": "zh-CN", "t": { "Edit item": { "v": ["编辑项目"] } } }, { "l": "zh-HK", "t": { "Edit item": { "v": ["編輯項目"] } } }, { "l": "zh-TW", "t": { "Edit item": { "v": ["編輯項目"] } } }];
const t26 = [{ "l": "ar", "t": {} }, { "l": "ast", "t": {} }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "External documentation": { "v": ["Externí dokumentace"] } } }, { "l": "cs-CZ", "t": {} }, { "l": "da", "t": { "External documentation": { "v": ["Ekstern dokumentation"] } } }, { "l": "de", "t": { "External documentation": { "v": ["Externe Dokumentation"] } } }, { "l": "de-DE", "t": { "External documentation": { "v": ["Externe Dokumentation"] } } }, { "l": "el", "t": { "External documentation": { "v": ["Εξωτερική τεκμηρίωση"] } } }, { "l": "en-GB", "t": { "External documentation": { "v": ["External documentation"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": {} }, { "l": "es-AR", "t": {} }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": {} }, { "l": "et-EE", "t": { "External documentation": { "v": ["Dokumentatsioon välises allikas"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": {} }, { "l": "fi", "t": {} }, { "l": "fr", "t": { "External documentation": { "v": ["Documentation externe"] } } }, { "l": "ga", "t": { "External documentation": { "v": ["Doiciméadú seachtrach"] } } }, { "l": "gl", "t": { "External documentation": { "v": ["Documentación externa"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "External documentation": { "v": ["Vanjska dokumentacija"] } } }, { "l": "hu", "t": { "External documentation": { "v": ["Külső dokumentáció"] } } }, { "l": "id", "t": { "External documentation": { "v": ["Dokumentasi eksternal"] } } }, { "l": "is", "t": {} }, { "l": "it", "t": {} }, { "l": "ja", "t": { "External documentation": { "v": ["外部ドキュメント"] } } }, { "l": "ja-JP", "t": {} }, { "l": "ko", "t": { "External documentation": { "v": ["외부 문서"] } } }, { "l": "lo", "t": { "External documentation": { "v": ["ເອກະສານພາຍນອກ"] } } }, { "l": "lt-LT", "t": { "External documentation": { "v": ["Išorinė dokumentacija"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "External documentation": { "v": ["Надворешна документација"] } } }, { "l": "mn", "t": { "External documentation": { "v": ["Гадаад баримт бичиг"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": {} }, { "l": "nl", "t": { "External documentation": { "v": ["Externe documentatie"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": {} }, { "l": "pt-BR", "t": { "External documentation": { "v": ["Documentação externa"] } } }, { "l": "pt-PT", "t": {} }, { "l": "ro", "t": {} }, { "l": "ru", "t": { "External documentation": { "v": ["Внешняя документация"] } } }, { "l": "sk", "t": {} }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "External documentation": { "v": ["Спољна документација"] } } }, { "l": "sv", "t": { "External documentation": { "v": ["Extern dokumentation"] } } }, { "l": "tr", "t": { "External documentation": { "v": ["Dış belgeler"] } } }, { "l": "uk", "t": { "External documentation": { "v": ["Зовнішня документація"] } } }, { "l": "uz", "t": { "External documentation": { "v": ["Tashqi hujjatlar"] } } }, { "l": "zh-CN", "t": {} }, { "l": "zh-HK", "t": { "External documentation": { "v": ["外部文件"] } } }, { "l": "zh-TW", "t": { "External documentation": { "v": ["外部文件"] } } }];
const t27 = [{ "l": "ar", "t": { "Go back to the list": { "v": ["عودة إلى القائمة"] } } }, { "l": "ast", "t": { "Go back to the list": { "v": ["Volver a la llista"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Go back to the list": { "v": ["Torna a la llista"] } } }, { "l": "cs", "t": { "Go back to the list": { "v": ["Jít zpět na seznam"] } } }, { "l": "cs-CZ", "t": { "Go back to the list": { "v": ["Jít zpět na seznam"] } } }, { "l": "da", "t": { "Go back to the list": { "v": ["Tilbage til listen"] } } }, { "l": "de", "t": { "Go back to the list": { "v": ["Zurück zur Liste"] } } }, { "l": "de-DE", "t": { "Go back to the list": { "v": ["Zurück zur Liste"] } } }, { "l": "el", "t": { "Go back to the list": { "v": ["Επιστροφή στην αρχική λίστα"] } } }, { "l": "en-GB", "t": { "Go back to the list": { "v": ["Go back to the list"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Go back to the list": { "v": ["Volver a la lista"] } } }, { "l": "es-AR", "t": { "Go back to the list": { "v": ["Volver a la lista"] } } }, { "l": "es-EC", "t": { "Go back to the list": { "v": ["Volver a la lista"] } } }, { "l": "es-MX", "t": { "Go back to the list": { "v": ["Regresar a la lista"] } } }, { "l": "et-EE", "t": { "Go back to the list": { "v": ["Tagasi nimekirja juurde"] } } }, { "l": "eu", "t": { "Go back to the list": { "v": ["Bueltatu zerrendara"] } } }, { "l": "fa", "t": { "Go back to the list": { "v": ["برگشت به لیست"] } } }, { "l": "fi", "t": { "Go back to the list": { "v": ["Takaisin listaan"] } } }, { "l": "fr", "t": { "Go back to the list": { "v": ["Retourner à la liste"] } } }, { "l": "ga", "t": { "Go back to the list": { "v": ["Téigh ar ais go dtí an liosta"] } } }, { "l": "gl", "t": { "Go back to the list": { "v": ["Volver á lista"] } } }, { "l": "he", "t": { "Go back to the list": { "v": ["חזרה לרשימה"] } } }, { "l": "hr", "t": { "Go back to the list": { "v": ["Vrati se na popis"] } } }, { "l": "hu", "t": { "Go back to the list": { "v": ["Ugrás vissza a listához"] } } }, { "l": "id", "t": { "Go back to the list": { "v": ["Kembali ke daftar"] } } }, { "l": "is", "t": { "Go back to the list": { "v": ["Fara til baka í listann"] } } }, { "l": "it", "t": { "Go back to the list": { "v": ["Torna all'elenco"] } } }, { "l": "ja", "t": { "Go back to the list": { "v": ["リストに戻る"] } } }, { "l": "ja-JP", "t": { "Go back to the list": { "v": ["リストに戻る"] } } }, { "l": "ko", "t": { "Go back to the list": { "v": ["목록으로 돌아가기"] } } }, { "l": "lo", "t": { "Go back to the list": { "v": ["ກັບໄປທີ່ລາຍການ"] } } }, { "l": "lt-LT", "t": { "Go back to the list": { "v": ["Grįžti į sąrašą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Go back to the list": { "v": ["Врати се на листата"] } } }, { "l": "mn", "t": { "Go back to the list": { "v": ["Жагсаалт руу буцах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Go back to the list": { "v": ["Gå tilbake til listen"] } } }, { "l": "nl", "t": { "Go back to the list": { "v": ["Ga terug naar de lijst"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Go back to the list": { "v": ["Powrót do listy"] } } }, { "l": "pt-BR", "t": { "Go back to the list": { "v": ["Voltar para a lista"] } } }, { "l": "pt-PT", "t": { "Go back to the list": { "v": ["Voltar para a lista"] } } }, { "l": "ro", "t": { "Go back to the list": { "v": ["Întoarceți-vă la listă"] } } }, { "l": "ru", "t": { "Go back to the list": { "v": ["Вернуться к списку"] } } }, { "l": "sk", "t": { "Go back to the list": { "v": ["Späť na zoznam"] } } }, { "l": "sl", "t": { "Go back to the list": { "v": ["Vrni se na seznam"] } } }, { "l": "sr", "t": { "Go back to the list": { "v": ["Назад на листу"] } } }, { "l": "sv", "t": { "Go back to the list": { "v": ["Gå tillbaka till listan"] } } }, { "l": "tr", "t": { "Go back to the list": { "v": ["Listeye dön"] } } }, { "l": "uk", "t": { "Go back to the list": { "v": ["Повернутися до списку"] } } }, { "l": "uz", "t": { "Go back to the list": { "v": ["Ro'yxatga qayting"] } } }, { "l": "zh-CN", "t": { "Go back to the list": { "v": ["返回至列表"] } } }, { "l": "zh-HK", "t": { "Go back to the list": { "v": ["返回清單"] } } }, { "l": "zh-TW", "t": { "Go back to the list": { "v": ["回到清單"] } } }];
const t29 = [{ "l": "ar", "t": { "Hide password": { "v": ["إخفاء كلمة المرور"] }, "Password is secure": { "v": ["كلمة المرور آمنة"] }, "Show password": { "v": ["أظهِر كلمة المرور"] } } }, { "l": "ast", "t": { "Hide password": { "v": ["Anubrir la contraseña"] }, "Password is secure": { "v": ["La contraseña ye segura"] }, "Show password": { "v": ["Amosar la contraseña"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Hide password": { "v": ["Amagar contrasenya"] }, "Password is secure": { "v": ["Contrasenya segura<br>"] }, "Show password": { "v": ["Mostrar contrasenya"] } } }, { "l": "cs", "t": { "Hide password": { "v": ["Skrýt heslo"] }, "Password is secure": { "v": ["Heslo je bezpečné"] }, "Show password": { "v": ["Zobrazit heslo"] } } }, { "l": "cs-CZ", "t": { "Hide password": { "v": ["Skrýt heslo"] }, "Password is secure": { "v": ["Heslo je bezpečné"] }, "Show password": { "v": ["Zobrazit heslo"] } } }, { "l": "da", "t": { "Hide password": { "v": ["Skjul kodeord"] }, "Password is secure": { "v": ["Kodeordet er sikkert"] }, "Show password": { "v": ["Vis kodeord"] } } }, { "l": "de", "t": { "Hide password": { "v": ["Passwort verbergen"] }, "Password is secure": { "v": ["Passwort ist sicher"] }, "Show password": { "v": ["Passwort anzeigen"] } } }, { "l": "de-DE", "t": { "Hide password": { "v": ["Passwort verbergen"] }, "Password is secure": { "v": ["Passwort ist sicher"] }, "Show password": { "v": ["Passwort anzeigen"] } } }, { "l": "el", "t": { "Hide password": { "v": ["Απόκρυψη συνθηματικού"] }, "Password is secure": { "v": ["Το συνθηματικό είναι ασφαλές"] }, "Show password": { "v": ["Εμφάνιση κωδικού πρόσβασης"] } } }, { "l": "en-GB", "t": { "Hide password": { "v": ["Hide password"] }, "Password is secure": { "v": ["Password is secure"] }, "Show password": { "v": ["Show password"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Hide password": { "v": ["Ocultar contraseña"] }, "Password is secure": { "v": ["La contraseña es segura"] }, "Show password": { "v": ["Mostrar contraseña"] } } }, { "l": "es-AR", "t": { "Hide password": { "v": ["Ocultar contraseña"] }, "Password is secure": { "v": ["La contraseña es segura"] }, "Show password": { "v": ["Mostrar contraseña"] } } }, { "l": "es-EC", "t": { "Hide password": { "v": ["Ocultar contraseña"] }, "Password is secure": { "v": ["La contraseña es segura"] }, "Show password": { "v": ["Mostrar contraseña"] } } }, { "l": "es-MX", "t": { "Hide password": { "v": ["Ocultar contraseña"] }, "Password is secure": { "v": ["La contraseña es segura"] }, "Show password": { "v": ["Mostrar contraseña"] } } }, { "l": "et-EE", "t": { "Hide password": { "v": ["Peida salasõna"] }, "Password is secure": { "v": ["Salasõna on turvaline"] }, "Show password": { "v": ["Näita salasõna"] } } }, { "l": "eu", "t": { "Hide password": { "v": ["Ezkutatu pasahitza"] }, "Password is secure": { "v": ["Pasahitza segurua da"] }, "Show password": { "v": ["Erakutsi pasahitza"] } } }, { "l": "fa", "t": { "Hide password": { "v": ["پنهان کردن رمز عبور"] }, "Password is secure": { "v": ["گذرواژه امن است"] }, "Show password": { "v": ["نمایش گذرواژه"] } } }, { "l": "fi", "t": { "Hide password": { "v": ["Piilota salasana"] }, "Password is secure": { "v": ["Salasana on turvallinen"] }, "Show password": { "v": ["Näytä salasana"] } } }, { "l": "fr", "t": { "Hide password": { "v": ["Cacher le mot de passe"] }, "Password is secure": { "v": ["Le mot de passe est sécurisé"] }, "Show password": { "v": ["Afficher le mot de passe"] } } }, { "l": "ga", "t": { "Hide password": { "v": ["Folaigh pasfhocal"] }, "Password is secure": { "v": ["Tá pasfhocal slán"] }, "Show password": { "v": ["Taispeáin pasfhocal"] } } }, { "l": "gl", "t": { "Hide password": { "v": ["Agochar o contrasinal"] }, "Password is secure": { "v": ["O contrasinal é seguro"] }, "Show password": { "v": ["Amosar o contrasinal"] } } }, { "l": "he", "t": { "Hide password": { "v": ["הסתרת סיסמה"] }, "Password is secure": { "v": ["הסיסמה מאובטחת"] }, "Show password": { "v": ["הצגת סיסמה"] } } }, { "l": "hr", "t": { "Hide password": { "v": ["Sakrij lozinku"] }, "Password is secure": { "v": ["Lozinka je zaštićena"] }, "Show password": { "v": ["Prikaži lozinku"] } } }, { "l": "hu", "t": { "Hide password": { "v": ["Jelszó elrejtése"] }, "Password is secure": { "v": ["A jelszó biztonságos"] }, "Show password": { "v": ["Jelszó megjelenítése"] } } }, { "l": "id", "t": { "Hide password": { "v": ["Sembunyikan sandi"] }, "Password is secure": { "v": ["Kata sandi sudah aman"] }, "Show password": { "v": ["Tampilkan sandi"] } } }, { "l": "is", "t": { "Hide password": { "v": ["Fela lykilorð"] }, "Password is secure": { "v": ["Lykilorðið er öruggt"] }, "Show password": { "v": ["Birta lykilorð"] } } }, { "l": "it", "t": { "Hide password": { "v": ["Nascondi la password"] }, "Password is secure": { "v": ["La password è sicura"] }, "Show password": { "v": ["Mostra la password"] } } }, { "l": "ja", "t": { "Hide password": { "v": ["パスワードを非表示"] }, "Password is secure": { "v": ["パスワードは保護されています"] }, "Show password": { "v": ["パスワードを表示"] } } }, { "l": "ja-JP", "t": { "Hide password": { "v": ["パスワードを非表示"] }, "Password is secure": { "v": ["パスワードは保護されています"] }, "Show password": { "v": ["パスワードを表示"] } } }, { "l": "ko", "t": { "Hide password": { "v": ["암호 숨기기"] }, "Password is secure": { "v": ["암호가 안전합니다."] }, "Show password": { "v": ["암호 표시"] } } }, { "l": "lo", "t": { "Hide password": { "v": ["ເຊື່ອງລະຫັດຜ່ານ"] }, "Password is secure": { "v": ["ລະຫັດຜ່ານປອດໄພ"] }, "Show password": { "v": ["ສະແດງລະຫັດຜ່ານ"] } } }, { "l": "lt-LT", "t": { "Hide password": { "v": ["Slėpti slaptažodį"] }, "Password is secure": { "v": ["Slaptažodis yra saugus"] }, "Show password": { "v": ["Rodyti slaptažodį"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Hide password": { "v": ["Сокриј лозинка"] }, "Password is secure": { "v": ["Лозинката е безбедна"] }, "Show password": { "v": ["Прикажи лозинка"] } } }, { "l": "mn", "t": { "Hide password": { "v": ["Нууц үгийг нуух"] }, "Password is secure": { "v": ["Нууц үг найдвартай байна"] }, "Show password": { "v": ["Нууц үгийг харуулах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Hide password": { "v": ["Skjul passord"] }, "Password is secure": { "v": ["Passordet er sikkert"] }, "Show password": { "v": ["Vis passord"] } } }, { "l": "nl", "t": { "Hide password": { "v": ["Wachtwoord verbergen"] }, "Password is secure": { "v": ["Wachtwoord is veilig"] }, "Show password": { "v": ["Wachtwoord weergeven"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Hide password": { "v": ["Ukryj hasło"] }, "Password is secure": { "v": ["Hasło jest bezpieczne"] }, "Show password": { "v": ["Pokaż hasło"] } } }, { "l": "pt-BR", "t": { "Hide password": { "v": ["Ocultar senha"] }, "Password is secure": { "v": ["A senha é segura"] }, "Show password": { "v": ["Mostrar senha"] } } }, { "l": "pt-PT", "t": { "Hide password": { "v": ["Ocultar palavra-passe"] }, "Password is secure": { "v": ["A palavra-passe é segura"] }, "Show password": { "v": ["Mostrar palavra-passe"] } } }, { "l": "ro", "t": { "Hide password": { "v": ["Ascunde parola"] }, "Password is secure": { "v": ["Parola este sigură"] }, "Show password": { "v": ["Arată parola"] } } }, { "l": "ru", "t": { "Hide password": { "v": ["Скрыть пароль"] }, "Password is secure": { "v": ["Пароль надежный"] }, "Show password": { "v": ["Показать пароль"] } } }, { "l": "sk", "t": { "Hide password": { "v": ["Skryť heslo"] }, "Password is secure": { "v": ["Heslo je bezpečné"] }, "Show password": { "v": ["Zobraziť heslo"] } } }, { "l": "sl", "t": { "Hide password": { "v": ["Skrij geslo"] }, "Password is secure": { "v": ["Geslo je varno"] }, "Show password": { "v": ["Pokaži geslo"] } } }, { "l": "sr", "t": { "Hide password": { "v": ["Сакриј лозинку"] }, "Password is secure": { "v": ["Лозинка је безбедна"] }, "Show password": { "v": ["Прикажи лозинку"] } } }, { "l": "sv", "t": { "Hide password": { "v": ["Göm lösenordet"] }, "Password is secure": { "v": ["Lössenordet är säkert"] }, "Show password": { "v": ["Visa lösenordet"] } } }, { "l": "tr", "t": { "Hide password": { "v": ["Parolayı gizle"] }, "Password is secure": { "v": ["Parola güvenli"] }, "Show password": { "v": ["Parolayı görüntüle"] } } }, { "l": "uk", "t": { "Hide password": { "v": ["Приховати пароль"] }, "Password is secure": { "v": ["Пароль безпечний"] }, "Show password": { "v": ["Показати пароль"] } } }, { "l": "uz", "t": { "Hide password": { "v": ["Parolni yashirish"] }, "Password is secure": { "v": ["Parol xavfsiz"] }, "Show password": { "v": ["Parolni ko'rsatish"] } } }, { "l": "zh-CN", "t": { "Hide password": { "v": ["隐藏密码"] }, "Password is secure": { "v": ["密码安全"] }, "Show password": { "v": ["显示密码"] } } }, { "l": "zh-HK", "t": { "Hide password": { "v": ["隱藏密碼"] }, "Password is secure": { "v": ["密碼是安全的"] }, "Show password": { "v": ["顯示密碼"] } } }, { "l": "zh-TW", "t": { "Hide password": { "v": ["隱藏密碼"] }, "Password is secure": { "v": ["密碼安全"] }, "Show password": { "v": ["顯示密碼"] } } }];
const t30 = [{ "l": "ar", "t": { "Keyboard navigation help": { "v": ["مساعدة في التنقل باستعمال لوحة المفاتيح"] }, "Skip to app navigation": { "v": ["تجاوَز إلى التنقل في التطبيق"] }, "Skip to main content": { "v": ["تجاوَز إلى المحتوى الرئيسي"] } } }, { "l": "ast", "t": { "Keyboard navigation help": { "v": ["Ayuda de la navegación pente'l tecláu"] }, "Skip to app navigation": { "v": ["Dir a la navegación d'aplicaciones"] }, "Skip to main content": { "v": ["Dir al conteníu principal"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Keyboard navigation help": { "v": ["Nápověda pro pohyb pomocí klávesnice"] }, "Skip to app navigation": { "v": ["Přeskočit na navigaci aplikace"] }, "Skip to main content": { "v": ["Přeskočit na hlavní obsah"] } } }, { "l": "cs-CZ", "t": { "Keyboard navigation help": { "v": ["Nápověda pro pohyb pomocí klávesnice"] }, "Skip to app navigation": { "v": ["Přeskočit na navigaci aplikace"] }, "Skip to main content": { "v": ["Přeskočit na hlavní obsah"] } } }, { "l": "da", "t": { "Keyboard navigation help": { "v": ["Hjælp til tastaturnavigation"] }, "Skip to app navigation": { "v": ["Spring til app navigation"] }, "Skip to main content": { "v": ["Spring til hovedindhold"] } } }, { "l": "de", "t": { "Keyboard navigation help": { "v": ["Tastatur-Navigationshilfe"] }, "Skip to app navigation": { "v": ["Zur App-Navigation springen"] }, "Skip to main content": { "v": ["Zum Hauptinhalt springen"] } } }, { "l": "de-DE", "t": { "Keyboard navigation help": { "v": ["Tastatur-Navigationshilfe"] }, "Skip to app navigation": { "v": ["Zur App-Navigation springen"] }, "Skip to main content": { "v": ["Zum Hauptinhalt springen"] } } }, { "l": "el", "t": { "Keyboard navigation help": { "v": ["Βοήθεια πλοήγησης με πληκτρολόγιο"] }, "Skip to app navigation": { "v": ["Μετάβαση στην πλοήγηση της εφαρμογής"] }, "Skip to main content": { "v": ["Μετάβαση στο κύριο περιεχόμενο"] } } }, { "l": "en-GB", "t": { "Keyboard navigation help": { "v": ["Keyboard navigation help"] }, "Skip to app navigation": { "v": ["Skip to app navigation"] }, "Skip to main content": { "v": ["Skip to main content"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Keyboard navigation help": { "v": ["Ayuda de navegación del teclado"] }, "Skip to app navigation": { "v": ["Saltar a la navegación de apps"] }, "Skip to main content": { "v": ["Saltar al contenido principal"] } } }, { "l": "es-AR", "t": { "Keyboard navigation help": { "v": ["Ayuda de navegación del teclado"] }, "Skip to app navigation": { "v": ["Saltar a la navegación de app"] }, "Skip to main content": { "v": ["Saltar al contenido principal"] } } }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": { "Keyboard navigation help": { "v": ["Ayuda de navegación del teclado"] }, "Skip to app navigation": { "v": ["Saltar a la navegación de app"] }, "Skip to main content": { "v": ["Saltar al contenido principal"] } } }, { "l": "et-EE", "t": { "Keyboard navigation help": { "v": ["Klahvistiku kasutuse abiteave"] }, "Skip to app navigation": { "v": ["Suundu rakenduses liikumise valikute juurde"] }, "Skip to main content": { "v": ["Suundu põhisisu juurde"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": { "Keyboard navigation help": { "v": ["راهنمای ناوبری صفحه کلید"] }, "Skip to app navigation": { "v": ["رفتن به پیمایش برنامه"] }, "Skip to main content": { "v": ["رفتن به محتوای اصلی"] } } }, { "l": "fi", "t": { "Keyboard navigation help": { "v": ["Näppäimistönavigoinnin ohje"] }, "Skip to app navigation": { "v": ["Siirry sovelluksen navigaatioon"] }, "Skip to main content": { "v": ["Siirry pääsisältöön"] } } }, { "l": "fr", "t": { "Keyboard navigation help": { "v": ["Aide à la navigation du clavier"] }, "Skip to app navigation": { "v": ["Passer à l'app navigation"] }, "Skip to main content": { "v": ["Passer au contenu principal"] } } }, { "l": "ga", "t": { "Keyboard navigation help": { "v": ["Cabhair le nascleanúint méarchláir"] }, "Skip to app navigation": { "v": ["Téigh ar aghaidh chuig nascleanúint aip"] }, "Skip to main content": { "v": ["Téigh ar aghaidh chuig an bpríomhábhar"] } } }, { "l": "gl", "t": { "Keyboard navigation help": { "v": ["Axuda á navegación co teclado"] }, "Skip to app navigation": { "v": ["Ir á navegación da aplicación"] }, "Skip to main content": { "v": ["Ir ao contido principal"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "Keyboard navigation help": { "v": ["Pomoć za navigaciju tipkovnicom"] }, "Skip to app navigation": { "v": ["Preskoči na navigaciju aplikacije"] }, "Skip to main content": { "v": ["Preskoči na glavni sadržaj"] } } }, { "l": "hu", "t": { "Keyboard navigation help": { "v": ["Billentyűzetes navigáció súgója"] }, "Skip to app navigation": { "v": ["Ugrás az alkalmazásnavigációhoz"] }, "Skip to main content": { "v": ["Ugrás a fő tartalomhoz"] } } }, { "l": "id", "t": { "Keyboard navigation help": { "v": ["Bantuan navigasi keyboard"] }, "Skip to app navigation": { "v": ["Lewati ke navigasi aplikasi"] }, "Skip to main content": { "v": ["Lewati ke konten utama"] } } }, { "l": "is", "t": { "Keyboard navigation help": { "v": ["Aðstoð við rötun á lyklaborði"] }, "Skip to app navigation": { "v": ["Sleppa og fara í flakk innan forrits"] }, "Skip to main content": { "v": ["Sleppa og fara í meginefni"] } } }, { "l": "it", "t": {} }, { "l": "ja", "t": { "Keyboard navigation help": { "v": ["キーボード・ナビゲーション・ヘルプ"] }, "Skip to app navigation": { "v": ["アプリのナビゲーションへ移動"] }, "Skip to main content": { "v": ["メインコンテンツへ移動"] } } }, { "l": "ja-JP", "t": { "Keyboard navigation help": { "v": ["キーボード・ナビゲーション・ヘルプ"] }, "Skip to app navigation": { "v": ["アプリのナビゲーションへ移動"] }, "Skip to main content": { "v": ["メインコンテンツへ移動"] } } }, { "l": "ko", "t": { "Keyboard navigation help": { "v": ["키보드 탐색 도움말"] }, "Skip to app navigation": { "v": ["앱 탐색으로 건너뛰기"] }, "Skip to main content": { "v": ["본 내용으로 건너뛰기"] } } }, { "l": "lo", "t": { "Keyboard navigation help": { "v": ["ການຊ່ວຍເຫຼືອການນຳທາງດ້ວຍຄີບອດ"] }, "Skip to app navigation": { "v": ["ຂ້າມໄປທີ່ການນຳທາງຂອງແອັບ"] }, "Skip to main content": { "v": ["ຂ້າມໄປທີ່ເນື້ອຫາຫຼັກ"] } } }, { "l": "lt-LT", "t": { "Keyboard navigation help": { "v": ["Klaviatūros navigacijos pagalba"] }, "Skip to app navigation": { "v": ["Pereiti prie programėlės naršymo"] }, "Skip to main content": { "v": ["Pereiti prie pagrindinio turinio"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Keyboard navigation help": { "v": ["Навигација со тастатура"] }, "Skip to app navigation": { "v": ["Прескокни на навигација на апликацијата"] }, "Skip to main content": { "v": ["Прескокни на главна содржина"] } } }, { "l": "mn", "t": { "Keyboard navigation help": { "v": ["Гарын навигацийн тусламж"] }, "Skip to app navigation": { "v": ["Аппын навигаци руу алгасах"] }, "Skip to main content": { "v": ["Үндсэн агуулга руу алгасах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Keyboard navigation help": { "v": ["Hjelp for tastaturnavigering"] }, "Skip to app navigation": { "v": ["Hopp til appnavigering"] }, "Skip to main content": { "v": ["Hopp til hovedinnhold"] } } }, { "l": "nl", "t": { "Keyboard navigation help": { "v": ["Hulp voor toetsenbordnavigatie"] }, "Skip to app navigation": { "v": ["Doorgaan naar app-navigatie"] }, "Skip to main content": { "v": ["Naar hoofdinhoud gaan"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Keyboard navigation help": { "v": ["Pomoc w nawigacji za pomocą klawiatury"] }, "Skip to app navigation": { "v": ["Przewiń do nawigacji"] }, "Skip to main content": { "v": ["Przewiń do głównych treści"] } } }, { "l": "pt-BR", "t": { "Keyboard navigation help": { "v": ["Ajuda para navegação pelo teclado"] }, "Skip to app navigation": { "v": ["Ir para navegação de aplicativo"] }, "Skip to main content": { "v": ["Ir para conteúdo principal"] } } }, { "l": "pt-PT", "t": { "Keyboard navigation help": { "v": ["Ajuda à navegação no teclado"] }, "Skip to app navigation": { "v": ["Saltar para navegação da app"] }, "Skip to main content": { "v": ["Saltar para conteúdo principal"] } } }, { "l": "ro", "t": {} }, { "l": "ru", "t": { "Keyboard navigation help": { "v": ["Справка по навигации с помощью клавиатуры"] }, "Skip to app navigation": { "v": ["Перейти к навигации по приложению"] }, "Skip to main content": { "v": ["Перейти к основному содержанию"] } } }, { "l": "sk", "t": { "Keyboard navigation help": { "v": ["Pomoc pri navigácii pomocou klávesnice"] }, "Skip to app navigation": { "v": ["Preskočiť na navigáciu v aplikácii"] }, "Skip to main content": { "v": ["Preskočiť na hlavný obsah"] } } }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Keyboard navigation help": { "v": ["Помоћ за навигацију тастатуром"] }, "Skip to app navigation": { "v": ["Прескочи на навигацију апликацијом"] }, "Skip to main content": { "v": ["Прескочи на главни садржај"] } } }, { "l": "sv", "t": { "Keyboard navigation help": { "v": ["Hjälp med tangentbordsnavigering"] }, "Skip to app navigation": { "v": ["Hoppa till appnavigering"] }, "Skip to main content": { "v": ["Hoppa till huvudinnehåll"] } } }, { "l": "tr", "t": { "Keyboard navigation help": { "v": ["Klavye ile gezinme yardımı"] }, "Skip to app navigation": { "v": ["Uygulama gezinmesine git"] }, "Skip to main content": { "v": ["Ana içeriğe git"] } } }, { "l": "uk", "t": { "Keyboard navigation help": { "v": ["Допомога з навігацією клавішами"] }, "Skip to app navigation": { "v": ["Пропустити навігацію по застосунках"] }, "Skip to main content": { "v": ["Перейти одразу до головного вмісту"] } } }, { "l": "uz", "t": { "Keyboard navigation help": { "v": ["Klaviatura navigatsiyasi yordami"] }, "Skip to app navigation": { "v": ["Ilova navigatsiyasiga oʻtish"] }, "Skip to main content": { "v": ["Asosiy tarkibga o'tish"] } } }, { "l": "zh-CN", "t": { "Keyboard navigation help": { "v": ["键盘导航栏帮助"] }, "Skip to app navigation": { "v": ["跳转至应用程序导航页"] }, "Skip to main content": { "v": ["跳转至主要内容"] } } }, { "l": "zh-HK", "t": { "Keyboard navigation help": { "v": ["鍵盤導航幫助"] }, "Skip to app navigation": { "v": ["跳至應用程式導航"] }, "Skip to main content": { "v": ["跳至主要內容"] } } }, { "l": "zh-TW", "t": { "Keyboard navigation help": { "v": ["鍵盤導航說明"] }, "Skip to app navigation": { "v": ["略過應用程式導覽"] }, "Skip to main content": { "v": ["跳至主要內容"] } } }];
const t33 = [{ "l": "ar", "t": { "Loading …": { "v": ["التحميل جارٍ ..."] } } }, { "l": "ast", "t": {} }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Loading …": { "v": ["Načítání …"] } } }, { "l": "cs-CZ", "t": {} }, { "l": "da", "t": { "Loading …": { "v": ["Indlæser ..."] } } }, { "l": "de", "t": { "Loading …": { "v": ["Wird geladen …"] } } }, { "l": "de-DE", "t": { "Loading …": { "v": ["Wird geladen …"] } } }, { "l": "el", "t": { "Loading …": { "v": ["Φόρτωση  …"] } } }, { "l": "en-GB", "t": { "Loading …": { "v": ["Loading …"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": {} }, { "l": "es-AR", "t": {} }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": {} }, { "l": "et-EE", "t": { "Loading …": { "v": ["Laadin…"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": { "Loading …": { "v": ["در حال بارگذاری ..."] } } }, { "l": "fi", "t": { "Loading …": { "v": ["Ladataan ..."] } } }, { "l": "fr", "t": { "Loading …": { "v": ["Chargement..."] } } }, { "l": "ga", "t": { "Loading …": { "v": ["Ag lódáil …"] } } }, { "l": "gl", "t": { "Loading …": { "v": ["Cargando…"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "Loading …": { "v": ["Učitavanje …"] } } }, { "l": "hu", "t": { "Loading …": { "v": ["Betöltés…"] } } }, { "l": "id", "t": { "Loading …": { "v": ["Memuat …"] } } }, { "l": "is", "t": { "Loading …": { "v": ["Hleð inn …"] } } }, { "l": "it", "t": {} }, { "l": "ja", "t": { "Loading …": { "v": ["読み込み中 …"] } } }, { "l": "ja-JP", "t": {} }, { "l": "ko", "t": { "Loading …": { "v": ["로딩 중 ..."] } } }, { "l": "lo", "t": { "Loading …": { "v": ["ກຳລັງໂຫຼດ…"] } } }, { "l": "lt-LT", "t": { "Loading …": { "v": ["Įkeliama …"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Loading …": { "v": ["Вчитување …"] } } }, { "l": "mn", "t": { "Loading …": { "v": ["Ачаалж байна …"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Loading …": { "v": ["Laster inn..."] } } }, { "l": "nl", "t": { "Loading …": { "v": ["Laden …"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Loading …": { "v": ["Wczytywanie…"] } } }, { "l": "pt-BR", "t": { "Loading …": { "v": ["Carregando …"] } } }, { "l": "pt-PT", "t": { "Loading …": { "v": ["A carregar..."] } } }, { "l": "ro", "t": {} }, { "l": "ru", "t": { "Loading …": { "v": ["Загрузка …"] } } }, { "l": "sk", "t": { "Loading …": { "v": ["Nahrávam ..."] } } }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Loading …": { "v": ["Учитава се…"] } } }, { "l": "sv", "t": { "Loading …": { "v": ["Laddar …"] } } }, { "l": "tr", "t": { "Loading …": { "v": ["Yükleniyor…"] } } }, { "l": "uk", "t": { "Loading …": { "v": ["Завантаження …"] } } }, { "l": "uz", "t": { "Loading …": { "v": ["Yuklanmoqda..."] } } }, { "l": "zh-CN", "t": { "Loading …": { "v": ["加载中..."] } } }, { "l": "zh-HK", "t": { "Loading …": { "v": ["加載中 …"] } } }, { "l": "zh-TW", "t": { "Loading …": { "v": ["載入中......"] } } }];
const t36 = [{ "l": "ar", "t": { "Next": { "v": ["التالي"] }, "Pause slideshow": { "v": ["تجميد عرض الشرائح"] }, "Previous": { "v": ["السابق"] }, "Start slideshow": { "v": ["إبدإ العرض"] } } }, { "l": "ast", "t": { "Next": { "v": ["Siguiente"] }, "Pause slideshow": { "v": ["Posar la presentación de diapositives"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Aniciar la presentación de diapositives"] } } }, { "l": "br", "t": { "Next": { "v": ["Da heul"] }, "Pause slideshow": { "v": ["Arsav an diaporama"] }, "Previous": { "v": ["A-raok"] }, "Start slideshow": { "v": ["Kregiñ an diaporama"] } } }, { "l": "ca", "t": { "Next": { "v": ["Següent"] }, "Pause slideshow": { "v": ["Atura la presentació"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Inicia la presentació"] } } }, { "l": "cs", "t": { "Next": { "v": ["Následující"] }, "Pause slideshow": { "v": ["Pozastavit prezentaci"] }, "Previous": { "v": ["Předchozí"] }, "Start slideshow": { "v": ["Spustit prezentaci"] } } }, { "l": "cs-CZ", "t": { "Next": { "v": ["Následující"] }, "Pause slideshow": { "v": ["Pozastavit prezentaci"] }, "Previous": { "v": ["Předchozí"] }, "Start slideshow": { "v": ["Spustit prezentaci"] } } }, { "l": "da", "t": { "Next": { "v": ["Videre"] }, "Pause slideshow": { "v": ["Suspender fremvisning"] }, "Previous": { "v": ["Forrige"] }, "Start slideshow": { "v": ["Start fremvisning"] } } }, { "l": "de", "t": { "Next": { "v": ["Weiter"] }, "Pause slideshow": { "v": ["Diashow pausieren"] }, "Previous": { "v": ["Vorherige"] }, "Start slideshow": { "v": ["Diashow starten"] } } }, { "l": "de-DE", "t": { "Next": { "v": ["Weiter"] }, "Pause slideshow": { "v": ["Diashow pausieren"] }, "Previous": { "v": ["Vorherige"] }, "Start slideshow": { "v": ["Diashow starten"] } } }, { "l": "el", "t": { "Next": { "v": ["Επόμενο"] }, "Pause slideshow": { "v": ["Παύση προβολής διαφανειών"] }, "Previous": { "v": ["Προηγούμενο"] }, "Start slideshow": { "v": ["Έναρξη προβολής διαφανειών"] } } }, { "l": "en-GB", "t": { "Next": { "v": ["Next"] }, "Pause slideshow": { "v": ["Pause slideshow"] }, "Previous": { "v": ["Previous"] }, "Start slideshow": { "v": ["Start slideshow"] } } }, { "l": "eo", "t": { "Next": { "v": ["Sekva"] }, "Pause slideshow": { "v": ["Payzi bildprezenton"] }, "Previous": { "v": ["Antaŭa"] }, "Start slideshow": { "v": ["Komenci bildprezenton"] } } }, { "l": "es", "t": { "Next": { "v": ["Siguiente"] }, "Pause slideshow": { "v": ["Pausar la presentación "] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar la presentación"] } } }, { "l": "es-AR", "t": { "Next": { "v": ["Siguiente"] }, "Pause slideshow": { "v": ["Pausar la presentación "] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar la presentación"] } } }, { "l": "es-EC", "t": { "Next": { "v": ["Siguiente"] }, "Pause slideshow": { "v": ["Pausar presentación de diapositivas"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar presentación de diapositivas"] } } }, { "l": "es-MX", "t": { "Next": { "v": ["Siguiente"] }, "Pause slideshow": { "v": ["Pausar presentación de diapositivas"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar presentación de diapositivas"] } } }, { "l": "et-EE", "t": { "Next": { "v": ["Edasi"] }, "Pause slideshow": { "v": ["Slaidiesitluse paus"] }, "Previous": { "v": ["Eelmine"] }, "Start slideshow": { "v": ["Alusta slaidiesitust"] } } }, { "l": "eu", "t": { "Next": { "v": ["Hurrengoa"] }, "Pause slideshow": { "v": ["Pausatu diaporama"] }, "Previous": { "v": ["Aurrekoa"] }, "Start slideshow": { "v": ["Hasi diaporama"] } } }, { "l": "fa", "t": { "Next": { "v": ["بعدی"] }, "Pause slideshow": { "v": ["توقف نمایش اسلاید"] }, "Previous": { "v": ["قبلی"] }, "Start slideshow": { "v": ["شروع نمایش اسلاید"] } } }, { "l": "fi", "t": { "Next": { "v": ["Seuraava"] }, "Pause slideshow": { "v": ["Keskeytä diaesitys"] }, "Previous": { "v": ["Edellinen"] }, "Start slideshow": { "v": ["Aloita diaesitys"] } } }, { "l": "fr", "t": { "Next": { "v": ["Suivant"] }, "Pause slideshow": { "v": ["Mettre le diaporama en pause"] }, "Previous": { "v": ["Précédent"] }, "Start slideshow": { "v": ["Démarrer le diaporama"] } } }, { "l": "ga", "t": { "Next": { "v": ["Ar aghaidh"] }, "Pause slideshow": { "v": ["Cuir taispeántas sleamhnán ar sos"] }, "Previous": { "v": ["Roimhe Seo"] }, "Start slideshow": { "v": ["Tosaigh taispeántas sleamhnán"] } } }, { "l": "gl", "t": { "Next": { "v": ["Seguinte"] }, "Pause slideshow": { "v": ["Pausar o diaporama"] }, "Previous": { "v": ["Anterir"] }, "Start slideshow": { "v": ["Iniciar o diaporama"] } } }, { "l": "he", "t": { "Next": { "v": ["הבא"] }, "Pause slideshow": { "v": ["השהיית מצגת"] }, "Previous": { "v": ["הקודם"] }, "Start slideshow": { "v": ["התחלת המצגת"] } } }, { "l": "hr", "t": { "Next": { "v": ["Sljedeće"] }, "Pause slideshow": { "v": ["Pauziraj dijaprojekciju"] }, "Previous": { "v": ["Prethodno"] }, "Start slideshow": { "v": ["Pokreni dijaprojekciju"] } } }, { "l": "hu", "t": { "Next": { "v": ["Következő"] }, "Pause slideshow": { "v": ["Diavetítés szüneteltetése"] }, "Previous": { "v": ["Előző"] }, "Start slideshow": { "v": ["Diavetítés indítása"] } } }, { "l": "id", "t": { "Next": { "v": ["Selanjutnya"] }, "Pause slideshow": { "v": ["Jeda tayangan slide"] }, "Previous": { "v": ["Sebelumnya"] }, "Start slideshow": { "v": ["Mulai salindia"] } } }, { "l": "is", "t": { "Next": { "v": ["Næsta"] }, "Pause slideshow": { "v": ["Gera hlé á skyggnusýningu"] }, "Previous": { "v": ["Fyrri"] }, "Start slideshow": { "v": ["Byrja skyggnusýningu"] } } }, { "l": "it", "t": { "Next": { "v": ["Successivo"] }, "Pause slideshow": { "v": ["Presentazione in pausa"] }, "Previous": { "v": ["Precedente"] }, "Start slideshow": { "v": ["Avvia presentazione"] } } }, { "l": "ja", "t": { "Next": { "v": ["次"] }, "Pause slideshow": { "v": ["スライドショーを一時停止"] }, "Previous": { "v": ["前"] }, "Start slideshow": { "v": ["スライドショーを開始"] } } }, { "l": "ja-JP", "t": { "Next": { "v": ["次"] }, "Pause slideshow": { "v": ["スライドショーを一時停止"] }, "Previous": { "v": ["前"] }, "Start slideshow": { "v": ["スライドショーを開始"] } } }, { "l": "ko", "t": { "Next": { "v": ["다음"] }, "Pause slideshow": { "v": ["슬라이드쇼 일시정지"] }, "Previous": { "v": ["이전"] }, "Start slideshow": { "v": ["슬라이드쇼 시작"] } } }, { "l": "lo", "t": { "Next": { "v": ["ຕໍ່ໄປ"] }, "Pause slideshow": { "v": ["ຢຸດສະໄລ້ໂຊຊົ່ວຄາວ"] }, "Previous": { "v": ["ກ່ອນໜ້າ"] }, "Start slideshow": { "v": ["ເລີ່ມສະໄລ້ໂຊ"] } } }, { "l": "lt-LT", "t": { "Next": { "v": ["Kitas"] }, "Pause slideshow": { "v": ["Pristabdyti skaidrių rodymą"] }, "Previous": { "v": ["Ankstesnis"] }, "Start slideshow": { "v": ["Pradėti skaidrių rodymą"] } } }, { "l": "lv", "t": { "Next": { "v": ["Nākamais"] }, "Pause slideshow": { "v": ["Pauzēt slaidrādi"] }, "Previous": { "v": ["Iepriekšējais"] }, "Start slideshow": { "v": ["Sākt slaidrādi"] } } }, { "l": "mk", "t": { "Next": { "v": ["Следно"] }, "Pause slideshow": { "v": ["Пузирај слајдшоу"] }, "Previous": { "v": ["Предходно"] }, "Start slideshow": { "v": ["Стартувај слајдшоу"] } } }, { "l": "mn", "t": { "Next": { "v": ["Дараах"] }, "Pause slideshow": { "v": ["Слайд шоуг түр зогсоох"] }, "Previous": { "v": ["Өмнөх"] }, "Start slideshow": { "v": ["Слайд шоуг эхлүүлэх"] } } }, { "l": "my", "t": { "Next": { "v": ["နောက်သို့ဆက်ရန်"] }, "Pause slideshow": { "v": ["စလိုက်ရှိုး ခေတ္တရပ်ရန်"] }, "Previous": { "v": ["ယခင်"] }, "Start slideshow": { "v": ["စလိုက်ရှိုးအား စတင်ရန်"] } } }, { "l": "nb", "t": { "Next": { "v": ["Neste"] }, "Pause slideshow": { "v": ["Pause lysbildefremvisning"] }, "Previous": { "v": ["Forrige"] }, "Start slideshow": { "v": ["Start lysbildefremvisning"] } } }, { "l": "nl", "t": { "Next": { "v": ["Volgende"] }, "Pause slideshow": { "v": ["Diavoorstelling pauzeren"] }, "Previous": { "v": ["Vorige"] }, "Start slideshow": { "v": ["Diavoorstelling starten"] } } }, { "l": "oc", "t": { "Next": { "v": ["Seguent"] }, "Pause slideshow": { "v": ["Metre en pausa lo diaporama"] }, "Previous": { "v": ["Precedent"] }, "Start slideshow": { "v": ["Lançar lo diaporama"] } } }, { "l": "pl", "t": { "Next": { "v": ["Następny"] }, "Pause slideshow": { "v": ["Wstrzymaj pokaz slajdów"] }, "Previous": { "v": ["Poprzedni"] }, "Start slideshow": { "v": ["Rozpocznij pokaz slajdów"] } } }, { "l": "pt-BR", "t": { "Next": { "v": ["Próximo"] }, "Pause slideshow": { "v": ["Pausar apresentação de slides"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar apresentação de slides"] } } }, { "l": "pt-PT", "t": { "Next": { "v": ["Seguinte"] }, "Pause slideshow": { "v": ["Pausar diaporama"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Iniciar diaporama"] } } }, { "l": "ro", "t": { "Next": { "v": ["Următorul"] }, "Pause slideshow": { "v": ["Pauză prezentare de diapozitive"] }, "Previous": { "v": ["Anterior"] }, "Start slideshow": { "v": ["Începeți prezentarea de diapozitive"] } } }, { "l": "ru", "t": { "Next": { "v": ["Следующее"] }, "Pause slideshow": { "v": ["Приостановить показ слйдов"] }, "Previous": { "v": ["Предыдущее"] }, "Start slideshow": { "v": ["Начать показ слайдов"] } } }, { "l": "sk", "t": { "Next": { "v": ["Ďalej"] }, "Pause slideshow": { "v": ["Pozastaviť prezentáciu"] }, "Previous": { "v": ["Predchádzajúce"] }, "Start slideshow": { "v": ["Začať prezentáciu"] } } }, { "l": "sl", "t": { "Next": { "v": ["Naslednji"] }, "Pause slideshow": { "v": ["Ustavi predstavitev"] }, "Previous": { "v": ["Predhodni"] }, "Start slideshow": { "v": ["Začni predstavitev"] } } }, { "l": "sr", "t": { "Next": { "v": ["Следеће"] }, "Pause slideshow": { "v": ["Паузирај слајд шоу"] }, "Previous": { "v": ["Претходно"] }, "Start slideshow": { "v": ["Покрени слајд шоу"] } } }, { "l": "sv", "t": { "Next": { "v": ["Nästa"] }, "Pause slideshow": { "v": ["Pausa bildspelet"] }, "Previous": { "v": ["Föregående"] }, "Start slideshow": { "v": ["Starta bildspelet"] } } }, { "l": "tr", "t": { "Next": { "v": ["Sonraki"] }, "Pause slideshow": { "v": ["Slayt sunumunu duraklat"] }, "Previous": { "v": ["Önceki"] }, "Start slideshow": { "v": ["Slayt sunumunu başlat"] } } }, { "l": "uk", "t": { "Next": { "v": ["Вперед"] }, "Pause slideshow": { "v": ["Пауза у показі слайдів"] }, "Previous": { "v": ["Назад"] }, "Start slideshow": { "v": ["Почати показ слайдів"] } } }, { "l": "uz", "t": { "Next": { "v": ["Keyingi"] }, "Pause slideshow": { "v": ["Slayd-shouni to'xtatib turish"] }, "Previous": { "v": ["Oldingi"] }, "Start slideshow": { "v": ["Slayd-shouni boshlash"] } } }, { "l": "zh-CN", "t": { "Next": { "v": ["下一个"] }, "Pause slideshow": { "v": ["暂停幻灯片"] }, "Previous": { "v": ["上一个"] }, "Start slideshow": { "v": ["开始幻灯片"] } } }, { "l": "zh-HK", "t": { "Next": { "v": ["下一個"] }, "Pause slideshow": { "v": ["暫停幻燈片"] }, "Previous": { "v": ["上一個"] }, "Start slideshow": { "v": ["開始幻燈片"] } } }, { "l": "zh-TW", "t": { "Next": { "v": ["下一個"] }, "Pause slideshow": { "v": ["暫停幻燈片"] }, "Previous": { "v": ["上一個"] }, "Start slideshow": { "v": ["開始幻燈片"] } } }];
const t40 = [{ "l": "ar", "t": {} }, { "l": "ast", "t": {} }, { "l": "br", "t": {} }, { "l": "ca", "t": {} }, { "l": "cs", "t": { "Please choose a date": { "v": ["Zvolte datum"] } } }, { "l": "cs-CZ", "t": {} }, { "l": "da", "t": { "Please choose a date": { "v": ["Vælg en dato"] } } }, { "l": "de", "t": { "Please choose a date": { "v": ["Bitte ein Datum wählen"] } } }, { "l": "de-DE", "t": { "Please choose a date": { "v": ["Bitte ein Datum wählen"] } } }, { "l": "el", "t": { "Please choose a date": { "v": ["Παρακαλώ επιλέξτε μια ημερομηνία"] } } }, { "l": "en-GB", "t": { "Please choose a date": { "v": ["Please choose a date"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": {} }, { "l": "es-AR", "t": {} }, { "l": "es-EC", "t": {} }, { "l": "es-MX", "t": {} }, { "l": "et-EE", "t": { "Please choose a date": { "v": ["Palun vali kuupäev"] } } }, { "l": "eu", "t": {} }, { "l": "fa", "t": {} }, { "l": "fi", "t": {} }, { "l": "fr", "t": { "Please choose a date": { "v": ["Veuillez choisir une date"] } } }, { "l": "ga", "t": { "Please choose a date": { "v": ["Roghnaigh dáta le do thoil"] } } }, { "l": "gl", "t": { "Please choose a date": { "v": ["Escolla unha data"] } } }, { "l": "he", "t": {} }, { "l": "hr", "t": { "Please choose a date": { "v": ["Molimo odaberite datum"] } } }, { "l": "hu", "t": { "Please choose a date": { "v": ["Válasszon egy dátumot"] } } }, { "l": "id", "t": { "Please choose a date": { "v": ["Silakan pilih tanggal"] } } }, { "l": "is", "t": {} }, { "l": "it", "t": {} }, { "l": "ja", "t": { "Please choose a date": { "v": ["日付を選択してください"] } } }, { "l": "ja-JP", "t": {} }, { "l": "ko", "t": { "Please choose a date": { "v": ["날짜를 선택해주세요"] } } }, { "l": "lo", "t": { "Please choose a date": { "v": ["ກະລຸນາເລືອກວັນທີ"] } } }, { "l": "lt-LT", "t": { "Please choose a date": { "v": ["Pasirinkite datą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Please choose a date": { "v": ["Избери датум"] } } }, { "l": "mn", "t": { "Please choose a date": { "v": ["Огноо сонгоно уу"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": {} }, { "l": "nl", "t": { "Please choose a date": { "v": ["Kies een datum"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": {} }, { "l": "pt-BR", "t": { "Please choose a date": { "v": ["Por favor, escolha uma data"] } } }, { "l": "pt-PT", "t": { "Please choose a date": { "v": ["Por favor, escolha uma data"] } } }, { "l": "ro", "t": {} }, { "l": "ru", "t": { "Please choose a date": { "v": ["Выберите дату"] } } }, { "l": "sk", "t": {} }, { "l": "sl", "t": {} }, { "l": "sr", "t": { "Please choose a date": { "v": ["Молимо вас да изаберете датум"] } } }, { "l": "sv", "t": { "Please choose a date": { "v": ["Välj ett datum"] } } }, { "l": "tr", "t": { "Please choose a date": { "v": ["Lütfen bir tarih seçin"] } } }, { "l": "uk", "t": { "Please choose a date": { "v": ["Виберіть дату"] } } }, { "l": "uz", "t": { "Please choose a date": { "v": ["Iltimos, sanani tanlang"] } } }, { "l": "zh-CN", "t": {} }, { "l": "zh-HK", "t": { "Please choose a date": { "v": ["請選擇日期"] } } }, { "l": "zh-TW", "t": { "Please choose a date": { "v": ["請選擇日期"] } } }];
const t45 = [{ "l": "ar", "t": { "Type to search time zone": { "v": ["أكتُب للبحث عن منطقة زمنية"] } } }, { "l": "ast", "t": { "Search for time zone": { "v": ["Buscar fusos horarios"] }, "Type to search time zone": { "v": ["Escribi pa buscar un fusu horariu"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Type to search time zone": { "v": ["Escriviu per cercar la zona horària"] } } }, { "l": "cs", "t": { "Search for time zone": { "v": ["Vyhledat časové pásmo"] }, "Type to search time zone": { "v": ["Psaním vyhledejte časovou zónu"] } } }, { "l": "cs-CZ", "t": { "Search for time zone": { "v": ["Vyhledat časové pásmo"] }, "Type to search time zone": { "v": ["Psaním vyhledejte časovou zónu"] } } }, { "l": "da", "t": { "Search for time zone": { "v": ["Søg efter tidszone"] }, "Type to search time zone": { "v": ["Indtast for at søge efter tidszone"] } } }, { "l": "de", "t": { "Search for time zone": { "v": ["Nach Zeitzone suchen"] }, "Type to search time zone": { "v": ["Tippen, um eine Zeitzone zu suchen"] } } }, { "l": "de-DE", "t": { "Search for time zone": { "v": ["Nach Zeitzone suchen"] }, "Type to search time zone": { "v": ["Tippen, um eine Zeitzone zu suchen"] } } }, { "l": "el", "t": { "Type to search time zone": { "v": ["Πληκτρολογήστε για αναζήτηση ζώνης ώρας"] } } }, { "l": "en-GB", "t": { "Search for time zone": { "v": ["Search for time zone"] }, "Type to search time zone": { "v": ["Type to search time zone"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Search for time zone": { "v": ["Buscar huso horario"] }, "Type to search time zone": { "v": ["Escriba para buscar un huso horario"] } } }, { "l": "es-AR", "t": { "Search for time zone": { "v": ["Buscar zona horaria"] }, "Type to search time zone": { "v": ["Escriba para buscar la zona horaria"] } } }, { "l": "es-EC", "t": { "Type to search time zone": { "v": ["Escribe para buscar la zona horaria"] } } }, { "l": "es-MX", "t": { "Search for time zone": { "v": ["Buscar zona horaria"] }, "Type to search time zone": { "v": ["Escriba para buscar la zona horaria"] } } }, { "l": "et-EE", "t": { "Search for time zone": { "v": ["Otsi ajavööndit"] }, "Type to search time zone": { "v": ["Ajavööndi otsimiseks kirjuta midagi"] } } }, { "l": "eu", "t": { "Type to search time zone": { "v": ["Idatzi ordu-zona bat bilatzeko"] } } }, { "l": "fa", "t": { "Search for time zone": { "v": ["جستجو برای منطقهٔ زمانی"] }, "Type to search time zone": { "v": ["برای جستجوی منطقه زمانی تایپ کنید"] } } }, { "l": "fi", "t": { "Search for time zone": { "v": ["Etsi aikavyöhykettä"] }, "Type to search time zone": { "v": ["Kirjoita etsiäksesi aikavyöhykettä"] } } }, { "l": "fr", "t": { "Search for time zone": { "v": ["Rechercher le fuseau horaire"] }, "Type to search time zone": { "v": ["Saisissez les premiers lettres pour rechercher un fuseau horaire"] } } }, { "l": "ga", "t": { "Search for time zone": { "v": ["Cuardaigh crios ama"] }, "Type to search time zone": { "v": ["Clóscríobh chun crios ama a chuardach"] } } }, { "l": "gl", "t": { "Search for time zone": { "v": ["Buscar por fuso horario"] }, "Type to search time zone": { "v": ["Escriba para buscar o fuso horario"] } } }, { "l": "he", "t": { "Type to search time zone": { "v": ["יש להקליד כדי לחפש אזור זמן"] } } }, { "l": "hr", "t": { "Search for time zone": { "v": ["Pretraži vremensku zonu"] }, "Type to search time zone": { "v": ["Upišite za pretraživanje vremenske zone"] } } }, { "l": "hu", "t": { "Search for time zone": { "v": ["Időzóna keresése"] }, "Type to search time zone": { "v": ["Gépeljen az időzóna kereséséhez"] } } }, { "l": "id", "t": { "Search for time zone": { "v": ["Cari zona waktu"] }, "Type to search time zone": { "v": ["Ketik untuk mencari zona waktu"] } } }, { "l": "is", "t": { "Search for time zone": { "v": ["Leita að tímabelti"] }, "Type to search time zone": { "v": ["Skrifaðu til að leita að tímabelti"] } } }, { "l": "it", "t": { "Search for time zone": { "v": ["Ricerca del fuso orario"] }, "Type to search time zone": { "v": ["Digita per cercare un fuso orario"] } } }, { "l": "ja", "t": { "Search for time zone": { "v": ["タイムゾーンを検索"] }, "Type to search time zone": { "v": ["タイムゾーン検索のため入力してください"] } } }, { "l": "ja-JP", "t": { "Search for time zone": { "v": ["タイムゾーンを検索"] }, "Type to search time zone": { "v": ["タイムゾーン検索のため入力してください"] } } }, { "l": "ko", "t": { "Search for time zone": { "v": ["시간대 찾기"] }, "Type to search time zone": { "v": ["입력하여 시간대를 검색"] } } }, { "l": "lo", "t": { "Search for time zone": { "v": ["ຄົ້ນຫາເຂດເວລາ"] }, "Type to search time zone": { "v": ["ພິມເພື່ອຄົ້ນຫາເຂດເວລາ"] } } }, { "l": "lt-LT", "t": { "Search for time zone": { "v": ["Ieškoti laiko juostų"] }, "Type to search time zone": { "v": ["Įveskite, kad surastumėte laiko juostą"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Search for time zone": { "v": ["Барај временска зона"] }, "Type to search time zone": { "v": ["Напишете за да пребарате временска зона"] } } }, { "l": "mn", "t": { "Search for time zone": { "v": ["Цагийн бүс хайх"] }, "Type to search time zone": { "v": ["Цагийн бүс хайхын тулд бичнэ үү"] } } }, { "l": "my", "t": { "Type to search time zone": { "v": ["ဒေသစံတော်ချိန်များ ရှာဖွေရန် စာရိုက်ပါ"] } } }, { "l": "nb", "t": { "Search for time zone": { "v": ["Søk etter tidssone"] }, "Type to search time zone": { "v": ["Tast for å søke etter tidssone"] } } }, { "l": "nl", "t": { "Search for time zone": { "v": ["Zoeken naar tijdzone"] }, "Type to search time zone": { "v": ["Typ om een tijdzone te zoeken"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Search for time zone": { "v": ["Szukaj strefy czasowej"] }, "Type to search time zone": { "v": ["Wpisz, aby wyszukać strefę czasową"] } } }, { "l": "pt-BR", "t": { "Search for time zone": { "v": ["Pesquisar fuso horário"] }, "Type to search time zone": { "v": ["Digite para pesquisar o fuso horário "] } } }, { "l": "pt-PT", "t": { "Type to search time zone": { "v": ["Digite para pesquisar o fuso horário "] } } }, { "l": "ro", "t": { "Search for time zone": { "v": ["Căutare zonă de timp"] }, "Type to search time zone": { "v": ["Tastați pentru a căuta fusul orar"] } } }, { "l": "ru", "t": { "Search for time zone": { "v": ["Поиск часового пояса"] }, "Type to search time zone": { "v": ["Введите для поиска часового пояса"] } } }, { "l": "sk", "t": { "Search for time zone": { "v": ["Vyhľadať časové pásmo"] }, "Type to search time zone": { "v": ["Začníte písať pre vyhľadávanie časovej zóny"] } } }, { "l": "sl", "t": { "Type to search time zone": { "v": ["Vpišite niz za iskanje časovnega pasu"] } } }, { "l": "sr", "t": { "Type to search time zone": { "v": ["Куцајте да претражите временске зоне"] } } }, { "l": "sv", "t": { "Search for time zone": { "v": ["Sök efter tidszon"] }, "Type to search time zone": { "v": ["Skriv för att välja tidszon"] } } }, { "l": "tr", "t": { "Search for time zone": { "v": ["Saat dilimi ara"] }, "Type to search time zone": { "v": ["Saat dilimi aramak için yazmaya başlayın"] } } }, { "l": "uk", "t": { "Type to search time zone": { "v": ["Введіть для пошуку часовий пояс"] } } }, { "l": "uz", "t": { "Search for time zone": { "v": ["Vaqt mintaqasini qidirish"] }, "Type to search time zone": { "v": ["Vaqt mintaqasini qidirish uchun kiriting"] } } }, { "l": "zh-CN", "t": { "Search for time zone": { "v": ["搜索时区"] }, "Type to search time zone": { "v": ["打字以搜索时区"] } } }, { "l": "zh-HK", "t": { "Search for time zone": { "v": ["搜索時區"] }, "Type to search time zone": { "v": ["鍵入以搜索時區"] } } }, { "l": "zh-TW", "t": { "Search for time zone": { "v": ["搜尋時區"] }, "Type to search time zone": { "v": ["輸入以搜尋時區"] } } }];
const t48 = [{ "l": "ar", "t": { "Settings navigation": { "v": ["إعدادات التّصفُّح"] } } }, { "l": "ast", "t": { "Settings navigation": { "v": ["Navegación pela configuración"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Settings navigation": { "v": ["Navegació d'opcions"] } } }, { "l": "cs", "t": { "Settings navigation": { "v": ["Pohyb po nastavení"] } } }, { "l": "cs-CZ", "t": { "Settings navigation": { "v": ["Pohyb po nastavení"] } } }, { "l": "da", "t": { "Settings navigation": { "v": ["Naviger i indstillinger"] } } }, { "l": "de", "t": { "Settings navigation": { "v": ["Einstellungen für die Navigation"] } } }, { "l": "de-DE", "t": { "Settings navigation": { "v": ["Einstellungen für die Navigation"] } } }, { "l": "el", "t": { "Settings navigation": { "v": ["Πλοήγηση ρυθμίσεων"] } } }, { "l": "en-GB", "t": { "Settings navigation": { "v": ["Settings navigation"] } } }, { "l": "eo", "t": { "Settings navigation": { "v": ["Agorda navigado"] } } }, { "l": "es", "t": { "Settings navigation": { "v": ["Navegación de ajustes"] } } }, { "l": "es-AR", "t": { "Settings navigation": { "v": ["Navegación de configuraciones"] } } }, { "l": "es-EC", "t": { "Settings navigation": { "v": ["Navegación de configuraciones"] } } }, { "l": "es-MX", "t": { "Settings navigation": { "v": ["Navegación por ajustes"] } } }, { "l": "et-EE", "t": { "Settings navigation": { "v": ["Liikumine seadistustes"] } } }, { "l": "eu", "t": { "Settings navigation": { "v": ["Nabigazio ezarpenak"] } } }, { "l": "fa", "t": { "Settings navigation": { "v": ["ناوبری تنظیمات"] } } }, { "l": "fi", "t": { "Settings navigation": { "v": ["Asetusten navigointi"] } } }, { "l": "fr", "t": { "Settings navigation": { "v": ["Navigation dans les paramètres"] } } }, { "l": "ga", "t": { "Settings navigation": { "v": ["Nascleanúint socruithe"] } } }, { "l": "gl", "t": { "Settings navigation": { "v": ["Navegación polos axustes"] } } }, { "l": "he", "t": { "Settings navigation": { "v": ["ניווט בהגדרות"] } } }, { "l": "hr", "t": { "Settings navigation": { "v": ["Navigacija postavki"] } } }, { "l": "hu", "t": { "Settings navigation": { "v": ["Navigáció a beállításokban"] } } }, { "l": "id", "t": { "Settings navigation": { "v": ["Navigasi pengaturan"] } } }, { "l": "is", "t": { "Settings navigation": { "v": ["Flakk um stillingar"] } } }, { "l": "it", "t": { "Settings navigation": { "v": ["Navigazione delle impostazioni"] } } }, { "l": "ja", "t": { "Settings navigation": { "v": ["ナビゲーション設定"] } } }, { "l": "ja-JP", "t": { "Settings navigation": { "v": ["ナビゲーション設定"] } } }, { "l": "ko", "t": { "Settings navigation": { "v": ["세팅 탐색"] } } }, { "l": "lo", "t": { "Settings navigation": { "v": ["ການນຳທາງການຕັ້ງຄ່າ"] } } }, { "l": "lt-LT", "t": { "Settings navigation": { "v": ["Naršymas nustatymuose"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Settings navigation": { "v": ["Параметри за навигација"] } } }, { "l": "mn", "t": { "Settings navigation": { "v": ["Тохиргооны навигаци"] } } }, { "l": "my", "t": { "Settings navigation": { "v": ["ချိန်ညှိချက်အညွှန်း"] } } }, { "l": "nb", "t": { "Settings navigation": { "v": ["Navigasjonsinstillinger"] } } }, { "l": "nl", "t": { "Settings navigation": { "v": ["Instellingen navigatie"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Settings navigation": { "v": ["Ustawienia nawigacji"] } } }, { "l": "pt-BR", "t": { "Settings navigation": { "v": ["Navegação de configurações"] } } }, { "l": "pt-PT", "t": { "Settings navigation": { "v": ["Navegação de configurações"] } } }, { "l": "ro", "t": { "Settings navigation": { "v": ["Navigare setări"] } } }, { "l": "ru", "t": { "Settings navigation": { "v": ["Навигация по настройкам"] } } }, { "l": "sk", "t": { "Settings navigation": { "v": ["Navigácia v nastaveniach"] } } }, { "l": "sl", "t": { "Settings navigation": { "v": ["Krmarjenje nastavitev"] } } }, { "l": "sr", "t": { "Settings navigation": { "v": ["Кретање по подешавањима"] } } }, { "l": "sv", "t": { "Settings navigation": { "v": ["Inställningsmeny"] } } }, { "l": "tr", "t": { "Settings navigation": { "v": ["Gezinme ayarları"] } } }, { "l": "uk", "t": { "Settings navigation": { "v": ["Навігація у налаштуваннях"] } } }, { "l": "uz", "t": { "Settings navigation": { "v": ["Sozlamalar navigatsiyasi"] } } }, { "l": "zh-CN", "t": { "Settings navigation": { "v": ["设置向导"] } } }, { "l": "zh-HK", "t": { "Settings navigation": { "v": ["設定值導覽"] } } }, { "l": "zh-TW", "t": { "Settings navigation": { "v": ["設定值導覽"] } } }];
const t49 = [{ "l": "ar", "t": { "Submit": { "v": ["إرسال"] } } }, { "l": "ast", "t": { "Submit": { "v": ["Unviar"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Submit": { "v": ["Envia"] } } }, { "l": "cs", "t": { "Submit": { "v": ["Odeslat"] } } }, { "l": "cs-CZ", "t": { "Submit": { "v": ["Odeslat"] } } }, { "l": "da", "t": { "Submit": { "v": ["Send"] } } }, { "l": "de", "t": { "Submit": { "v": ["Einreichen"] } } }, { "l": "de-DE", "t": { "Submit": { "v": ["Einreichen"] } } }, { "l": "el", "t": { "Submit": { "v": ["Υποβολή"] } } }, { "l": "en-GB", "t": { "Submit": { "v": ["Submit"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "es-AR", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "es-EC", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "es-MX", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "et-EE", "t": { "Submit": { "v": ["Saada"] } } }, { "l": "eu", "t": { "Submit": { "v": ["Bidali"] } } }, { "l": "fa", "t": { "Submit": { "v": ["ارسال"] } } }, { "l": "fi", "t": { "Submit": { "v": ["Lähetä"] } } }, { "l": "fr", "t": { "Submit": { "v": ["Valider"] } } }, { "l": "ga", "t": { "Submit": { "v": ["Cuir isteach"] } } }, { "l": "gl", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "he", "t": { "Submit": { "v": ["הגשה"] } } }, { "l": "hr", "t": { "Submit": { "v": ["Pošalji"] } } }, { "l": "hu", "t": { "Submit": { "v": ["Beküldés"] } } }, { "l": "id", "t": { "Submit": { "v": ["Kirimkan"] } } }, { "l": "is", "t": { "Submit": { "v": ["Senda inn"] } } }, { "l": "it", "t": { "Submit": { "v": ["Invia"] } } }, { "l": "ja", "t": { "Submit": { "v": ["提出"] } } }, { "l": "ja-JP", "t": { "Submit": { "v": ["提出"] } } }, { "l": "ko", "t": { "Submit": { "v": ["제출"] } } }, { "l": "lo", "t": { "Submit": { "v": ["ສົ່ງ"] } } }, { "l": "lt-LT", "t": { "Submit": { "v": ["Pateikti"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Submit": { "v": ["Испрати"] } } }, { "l": "mn", "t": { "Submit": { "v": ["Илгээх"] } } }, { "l": "my", "t": { "Submit": { "v": ["တင်သွင်းရန်"] } } }, { "l": "nb", "t": { "Submit": { "v": ["Send"] } } }, { "l": "nl", "t": { "Submit": { "v": ["Indienen"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Submit": { "v": ["Wyślij"] } } }, { "l": "pt-BR", "t": { "Submit": { "v": ["Enviar"] } } }, { "l": "pt-PT", "t": { "Submit": { "v": ["Submeter"] } } }, { "l": "ro", "t": { "Submit": { "v": ["Trimiteți"] } } }, { "l": "ru", "t": { "Submit": { "v": ["Утвердить"] } } }, { "l": "sk", "t": { "Submit": { "v": ["Odoslať"] } } }, { "l": "sl", "t": { "Submit": { "v": ["Pošlji"] } } }, { "l": "sr", "t": { "Submit": { "v": ["Поднеси"] } } }, { "l": "sv", "t": { "Submit": { "v": ["Skicka"] } } }, { "l": "tr", "t": { "Submit": { "v": ["Gönder"] } } }, { "l": "uk", "t": { "Submit": { "v": ["Надіслати"] } } }, { "l": "uz", "t": { "Submit": { "v": ["Yuborish"] } } }, { "l": "zh-CN", "t": { "Submit": { "v": ["提交"] } } }, { "l": "zh-HK", "t": { "Submit": { "v": ["提交"] } } }, { "l": "zh-TW", "t": { "Submit": { "v": ["遞交"] } } }];
const t51 = [{ "l": "ar", "t": { "Undo changes": { "v": ["تراجَع عن التغييرات"] } } }, { "l": "ast", "t": { "Undo changes": { "v": ["Desfacer los cambeos"] } } }, { "l": "br", "t": {} }, { "l": "ca", "t": { "Undo changes": { "v": ["Desfés els canvis"] } } }, { "l": "cs", "t": { "Undo changes": { "v": ["Vzít změny zpět"] } } }, { "l": "cs-CZ", "t": { "Undo changes": { "v": ["Vzít změny zpět"] } } }, { "l": "da", "t": { "Undo changes": { "v": ["Fortryd ændringer"] } } }, { "l": "de", "t": { "Undo changes": { "v": ["Änderungen rückgängig machen"] } } }, { "l": "de-DE", "t": { "Undo changes": { "v": ["Änderungen rückgängig machen"] } } }, { "l": "el", "t": { "Undo changes": { "v": ["Αναίρεση Αλλαγών"] } } }, { "l": "en-GB", "t": { "Undo changes": { "v": ["Undo changes"] } } }, { "l": "eo", "t": {} }, { "l": "es", "t": { "Undo changes": { "v": ["Deshacer cambios"] } } }, { "l": "es-AR", "t": { "Undo changes": { "v": ["Deshacer cambios"] } } }, { "l": "es-EC", "t": { "Undo changes": { "v": ["Deshacer cambios"] } } }, { "l": "es-MX", "t": { "Undo changes": { "v": ["Deshacer cambios"] } } }, { "l": "et-EE", "t": { "Undo changes": { "v": ["Pööra muudatused tagasi"] } } }, { "l": "eu", "t": { "Undo changes": { "v": ["Aldaketak desegin"] } } }, { "l": "fa", "t": { "Undo changes": { "v": ["لغو تغییرات"] } } }, { "l": "fi", "t": { "Undo changes": { "v": ["Kumoa muutokset"] } } }, { "l": "fr", "t": { "Undo changes": { "v": ["Annuler les changements"] } } }, { "l": "ga", "t": { "Undo changes": { "v": ["Cealaigh athruithe"] } } }, { "l": "gl", "t": { "Undo changes": { "v": ["Desfacer os cambios"] } } }, { "l": "he", "t": { "Undo changes": { "v": ["ביטול שינויים"] } } }, { "l": "hr", "t": { "Undo changes": { "v": ["Poništi promjene"] } } }, { "l": "hu", "t": { "Undo changes": { "v": ["Változtatások visszavonása"] } } }, { "l": "id", "t": { "Undo changes": { "v": ["Urungkan perubahan"] } } }, { "l": "is", "t": { "Undo changes": { "v": ["Afturkalla breytingar"] } } }, { "l": "it", "t": { "Undo changes": { "v": ["Cancella i cambiamenti"] } } }, { "l": "ja", "t": { "Undo changes": { "v": ["変更を取り消し"] } } }, { "l": "ja-JP", "t": { "Undo changes": { "v": ["変更を取り消し"] } } }, { "l": "ko", "t": { "Undo changes": { "v": ["변경 되돌리기"] } } }, { "l": "lo", "t": { "Undo changes": { "v": ["ຍ້ອນຄືນການປ່ຽນແປງ"] } } }, { "l": "lt-LT", "t": { "Undo changes": { "v": ["Atšaukti pakeitimus"] } } }, { "l": "lv", "t": {} }, { "l": "mk", "t": { "Undo changes": { "v": ["Врати ги промените"] } } }, { "l": "mn", "t": { "Undo changes": { "v": ["Өөрчлөлтийг буцаах"] } } }, { "l": "my", "t": {} }, { "l": "nb", "t": { "Undo changes": { "v": ["Tilbakestill endringer"] } } }, { "l": "nl", "t": { "Undo changes": { "v": ["Wijzigingen ongedaan maken"] } } }, { "l": "oc", "t": {} }, { "l": "pl", "t": { "Undo changes": { "v": ["Cofnij zmiany"] } } }, { "l": "pt-BR", "t": { "Undo changes": { "v": ["Desfazer modificações"] } } }, { "l": "pt-PT", "t": { "Undo changes": { "v": ["Anular alterações"] } } }, { "l": "ro", "t": { "Undo changes": { "v": ["Anularea modificărilor"] } } }, { "l": "ru", "t": { "Undo changes": { "v": ["Отменить изменения"] } } }, { "l": "sk", "t": { "Undo changes": { "v": ["Vrátiť zmeny"] } } }, { "l": "sl", "t": { "Undo changes": { "v": ["Razveljavi spremembe"] } } }, { "l": "sr", "t": { "Undo changes": { "v": ["Поништи измене"] } } }, { "l": "sv", "t": { "Undo changes": { "v": ["Ångra ändringar"] } } }, { "l": "tr", "t": { "Undo changes": { "v": ["Değişiklikleri geri al"] } } }, { "l": "uk", "t": { "Undo changes": { "v": ["Скасувати зміни"] } } }, { "l": "uz", "t": { "Undo changes": { "v": ["O'zgarishlarni bekor qilish"] } } }, { "l": "zh-CN", "t": { "Undo changes": { "v": ["撤销更改"] } } }, { "l": "zh-HK", "t": { "Undo changes": { "v": ["取消更改"] } } }, { "l": "zh-TW", "t": { "Undo changes": { "v": ["還原變更"] } } }];
const [majorVersion] = window.OC?.config?.version?.split(".") ?? [];
const major = Number.parseInt(majorVersion ?? "34");
const isLegacy = major < 32;
const isLegacy34 = major < 34;
const NC_FORM_BOX_CONTEXT_KEY = /* @__PURE__ */ Symbol.for("NcFormBox:context");
function useNcFormBox() {
  return inject(NC_FORM_BOX_CONTEXT_KEY, {
    isInFormBox: false,
    formBoxItemClass: void 0
  });
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$G = { class: "button-vue__wrapper" };
const _hoisted_2$x = { class: "button-vue__icon" };
const _hoisted_3$t = { class: "button-vue__text" };
const _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "NcButton",
  props: {
    alignment: { default: "center" },
    ariaLabel: { default: void 0 },
    disabled: { type: Boolean },
    download: { type: [String, Boolean], default: void 0 },
    href: { default: void 0 },
    pressed: { type: Boolean, default: void 0 },
    size: { default: "normal" },
    target: { default: "_self" },
    text: { default: void 0 },
    to: { default: void 0 },
    type: { default: "button" },
    variant: { default: "secondary" },
    wide: { type: Boolean }
  },
  emits: ["click", "update:pressed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const { formBoxItemClass } = useNcFormBox();
    const hasVueRouterContext = inject(routerKey, null) !== null;
    const tag = computed(() => {
      if (hasVueRouterContext && props.to) {
        return "RouterLink";
      } else if (props.href) {
        return "a";
      } else {
        return "button";
      }
    });
    const hasPressedState = computed(() => tag.value === "button" && typeof props.pressed === "boolean");
    const variantWithPressed = computed(() => {
      if (props.pressed) {
        return "primary";
      }
      if (props.pressed === false && props.variant === "primary") {
        return "secondary";
      }
      return props.variant;
    });
    const isTertiaryVariant = computed(() => variantWithPressed.value.startsWith("tertiary"));
    const flexAlignment = computed(() => props.alignment.split("-")[0]);
    const isReverseAligned = computed(() => props.alignment.includes("-"));
    const getNcPopoverTriggerAttrs = inject("NcPopover:trigger:attrs", () => ({}), false);
    const ncPopoverTriggerAttrs = computed(() => getNcPopoverTriggerAttrs());
    const attrs = computed(() => {
      if (tag.value === "RouterLink") {
        return {
          to: props.to,
          activeClass: "active"
        };
      } else if (tag.value === "a") {
        return {
          href: props.href || "#",
          target: props.target,
          rel: "nofollow noreferrer noopener",
          download: props.download || void 0
        };
      } else if (tag.value === "button") {
        return {
          ...ncPopoverTriggerAttrs.value,
          "aria-pressed": props.pressed,
          type: props.type,
          disabled: props.disabled
        };
      }
      return void 0;
    });
    function onClick(event) {
      if (hasPressedState.value) {
        emit2("update:pressed", !props.pressed);
      }
      emit2("click", event);
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tag.value), mergeProps({
        class: ["button-vue", [
          `button-vue--size-${__props.size}`,
          {
            [`button-vue--${variantWithPressed.value}`]: variantWithPressed.value,
            "button-vue--tertiary": isTertiaryVariant.value,
            "button-vue--wide": __props.wide,
            [`button-vue--${flexAlignment.value}`]: flexAlignment.value !== "center",
            "button-vue--reverse": isReverseAligned.value,
            "button-vue--legacy": unref(isLegacy),
            "button-vue--legacy34": unref(isLegacy34)
          },
          unref(formBoxItemClass)
        ]],
        "aria-label": __props.ariaLabel
      }, attrs.value, { onClick }), {
        default: withCtx(() => [
          createBaseVNode("span", _hoisted_1$G, [
            createBaseVNode("span", _hoisted_2$x, [
              renderSlot(_ctx.$slots, "icon", {}, void 0, true)
            ]),
            createBaseVNode("span", _hoisted_3$t, [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createTextVNode(toDisplayString(__props.text), 1)
              ], true)
            ])
          ])
        ]),
        _: 3
      }, 16, ["class", "aria-label"]);
    };
  }
});
const NcButton = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-00a99684"]]);
const _hoisted_1$F = ["aria-hidden", "aria-label"];
const _hoisted_2$w = {
  key: 0,
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
};
const _hoisted_3$s = ["d"];
const _hoisted_4$p = ["innerHTML"];
const _sfc_main$O = /* @__PURE__ */ defineComponent({
  __name: "NcIconSvgWrapper",
  props: {
    directional: { type: Boolean },
    inline: { type: Boolean },
    svg: { default: "" },
    name: { default: void 0 },
    path: { default: "" },
    size: { default: 20 }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "fb515064": iconSize.value
    }));
    const props = __props;
    const iconSize = computed(() => typeof props.size === "number" ? `${props.size}px` : props.size);
    const cleanSvg = computed(() => {
      if (!props.svg || props.path) {
        return;
      }
      const svg2 = purify.sanitize(props.svg);
      const svgDocument = new DOMParser().parseFromString(svg2, "image/svg+xml");
      if (svgDocument.querySelector("parsererror")) {
        return "";
      }
      if (svgDocument.documentElement.id) {
        svgDocument.documentElement.removeAttribute("id");
      }
      return svgDocument.documentElement.outerHTML;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        "aria-hidden": __props.name ? void 0 : "true",
        "aria-label": __props.name || void 0,
        class: normalizeClass(["icon-vue", {
          "icon-vue--directional": __props.directional,
          "icon-vue--inline": __props.inline
        }]),
        role: "img"
      }, [
        !cleanSvg.value ? (openBlock(), createElementBlock("svg", _hoisted_2$w, [
          createBaseVNode("path", { d: __props.path }, null, 8, _hoisted_3$s)
        ])) : (openBlock(), createElementBlock("span", {
          key: 1,
          innerHTML: cleanSvg.value
        }, null, 8, _hoisted_4$p))
      ], 10, _hoisted_1$F);
    };
  }
});
const NcIconSvgWrapper = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["__scopeId", "data-v-aaedb1c3"]]);
const _hoisted_1$E = ["aria-label"];
const _hoisted_2$v = ["width", "height"];
const _hoisted_3$r = ["fill"];
const _hoisted_4$o = ["fill"];
const _hoisted_5$c = { key: 0 };
const _sfc_main$N = /* @__PURE__ */ defineComponent({
  __name: "NcLoadingIcon",
  props: {
    appearance: { default: "auto" },
    name: { default: "" },
    size: { default: 20 }
  },
  setup(__props) {
    const props = __props;
    const colors = computed(() => {
      const colors2 = ["#777", "#CCC"];
      if (props.appearance === "light") {
        return colors2;
      } else if (props.appearance === "dark") {
        return colors2.reverse();
      }
      return ["var(--color-loading-light)", "var(--color-loading-dark)"];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        "aria-label": __props.name,
        role: "img",
        class: "material-design-icon loading-icon"
      }, [
        (openBlock(), createElementBlock("svg", {
          width: __props.size,
          height: __props.size,
          viewBox: "0 0 24 24"
        }, [
          createBaseVNode("path", {
            fill: colors.value[0],
            d: "M12,4V2A10,10 0 1,0 22,12H20A8,8 0 1,1 12,4Z"
          }, null, 8, _hoisted_3$r),
          createBaseVNode("path", {
            fill: colors.value[1],
            d: "M12,4V2A10,10 0 0,1 22,12H20A8,8 0 0,0 12,4Z"
          }, [
            __props.name ? (openBlock(), createElementBlock("title", _hoisted_5$c, toDisplayString(__props.name), 1)) : createCommentVNode("", true)
          ], 8, _hoisted_4$o)
        ], 8, _hoisted_2$v))
      ], 8, _hoisted_1$E);
    };
  }
});
const NcLoadingIcon = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["__scopeId", "data-v-cf399190"]]);
register(t33);
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "NcDialogButton",
  props: {
    callback: { type: Function, default: () => {
    } },
    disabled: { type: Boolean, default: false },
    icon: { default: void 0 },
    label: {},
    type: { default: "button" },
    variant: { default: "tertiary" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit2 = __emit;
    const isLoading = ref(false);
    async function handleClick(e) {
      if (isLoading.value) {
        return;
      }
      isLoading.value = true;
      try {
        const fallback = props.type === "reset" ? false : void 0;
        const result = await props.callback?.() ?? fallback;
        if (result !== false) {
          emit2("click", e, result);
        }
      } finally {
        isLoading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcButton), {
        "aria-label": __props.label,
        disabled: __props.disabled,
        type: __props.type,
        variant: __props.variant,
        onClick: handleClick
      }, {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            isLoading.value ? (openBlock(), createBlock(unref(NcLoadingIcon), {
              key: 0,
              name: unref(t)("Loading …")
              /* TRANSLATORS: The button is in a loading state*/
            }, null, 8, ["name"])) : __props.icon !== void 0 ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
              key: 1,
              svg: __props.icon
            }, null, 8, ["svg"])) : createCommentVNode("", true)
          ])
        ]),
        default: withCtx(() => [
          createTextVNode(toDisplayString(__props.label) + " ", 1)
        ]),
        _: 3
      }, 8, ["aria-label", "disabled", "type", "variant"]);
    };
  }
});
var mdiAlert = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z";
var mdiAlertCircleOutline = "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z";
var mdiAlertDecagram = "M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M13,17H11V15H13V17M13,13H11V7H13V13Z";
var mdiArrowLeft = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
var mdiArrowRight = "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";
var mdiArrowTopRight = "M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z";
var mdiCalendarBlank = "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1";
var mdiCheck = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";
var mdiCheckboxMarkedCircle = "M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiChevronDown = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
var mdiChevronLeft = "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z";
var mdiChevronRight = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z";
var mdiChevronUp = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
var mdiClock = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z";
var mdiClose = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
var mdiCloseCircleOutline = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z";
var mdiDotsHorizontal = "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z";
var mdiEye = "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z";
var mdiEyeOff = "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z";
var mdiInformation = "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiMenu = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";
var mdiMenuOpen = "M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z";
var mdiOpenInNew = "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z";
var mdiPause = "M14,19H18V5H14M6,19H10V5H6V19Z";
var mdiPlay = "M8,5.14V19.14L19,12.14L8,5.14Z";
var mdiUndo = "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z";
/*!
* tabbable 6.5.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = ["input:not([inert]):not([inert] *)", "select:not([inert]):not([inert] *)", "textarea:not([inert]):not([inert] *)", "a[href]:not([inert]):not([inert] *)", "area[href]:not([inert]):not([inert] *)", "button:not([inert]):not([inert] *)", "[tabindex]:not(slot):not([inert]):not([inert] *)", "audio[controls]:not([inert]):not([inert] *)", "video[controls]:not([inert]):not([inert] *)", '[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)', "details>summary:first-of-type:not([inert]):not([inert] *)", "details:not([inert]):not([inert] *)"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var _isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && // closest does not exist on shadow roots, so we fall back to a manual
  // lookup upward, in case it is not defined.
  (typeof node.closest === "function" ? node.closest("[inert]") : _isInert(node.parentNode));
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (_isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var _getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (_isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = _getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !_isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = _getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b2) {
  return a.tabIndex === b2.tabIndex ? a.documentOrder - b2.documentOrder : a.tabIndex - b2.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (displayCheck === "full-native") {
    if ("checkVisibility" in node) {
      var visible = node.checkVisibility({
        // Checking opacity might be desirable for some use cases, but natively,
        // opacity zero elements _are_ focusable and tabbable.
        checkOpacity: false,
        opacityProperty: false,
        contentVisibilityAuto: true,
        visibilityProperty: true,
        // This is an alias for `visibilityProperty`. Contemporary browsers
        // support both. However, this alias has wider browser support (Chrome
        // >= 105 and Firefox >= 106, vs. Chrome >= 121 and Firefox >= 122), so
        // we include it anyway.
        checkVisibilityCSS: true
      });
      return !visible;
    }
  }
  var _getComputedStyle = getComputedStyle(node), visibility = _getComputedStyle.visibility;
  if (visibility === "hidden" || visibility === "collapse") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || // full-native can run this branch when it falls through in case
  // Element#checkVisibility is unsupported
  displayCheck === "full-native" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isShadowRootTabbable = function isShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var _sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? _sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = _getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return _sortByOrder(candidates);
};
var focusable = function focusable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = _getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe:not([inert]):not([inert] *)").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};
/*!
* focus-trap 8.2.2
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n2 = Array(a); e < a; e++) n2[e] = r[e];
  return n2;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _createForOfIteratorHelper(r, e) {
  var t5 = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t5) {
    if (Array.isArray(r) || (t5 = _unsupportedIterableToArray(r)) || e) {
      t5 && (r = t5);
      var n2 = 0, F = function() {
      };
      return {
        s: F,
        n: function() {
          return n2 >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n2++]
          };
        },
        e: function(r2) {
          throw r2;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o, a = true, u = false;
  return {
    s: function() {
      t5 = t5.call(r);
    },
    n: function() {
      var r2 = t5.next();
      return a = r2.done, r2;
    },
    e: function(r2) {
      u = true, o = r2;
    },
    f: function() {
      try {
        a || null == t5.return || t5.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t5) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t5,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t5, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t5 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t5.push.apply(t5, o);
  }
  return t5;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t5 = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t5), true).forEach(function(r2) {
      _defineProperty(e, r2, t5[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t5)) : ownKeys(Object(t5)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t5, r2));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t5, r) {
  if ("object" != typeof t5 || !t5) return t5;
  var e = t5[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t5, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t5);
}
function _toPropertyKey(t5) {
  var i = _toPrimitive(t5, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t5 = {}.toString.call(r).slice(8, -1);
    return "Object" === t5 && r.constructor && (t5 = r.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var activeFocusTraps = {
  // Returns the trap from the top of the stack.
  getActiveTrap: function getActiveTrap(trapStack) {
    if ((trapStack === null || trapStack === void 0 ? void 0 : trapStack.length) > 0) {
      return trapStack[trapStack.length - 1];
    }
    return null;
  },
  // Pauses the currently active trap, then adds a new trap to the stack.
  activateTrap: function activateTrap(trapStack, trap) {
    var activeTrap = activeFocusTraps.getActiveTrap(trapStack);
    if (trap !== activeTrap) {
      activeFocusTraps.pauseTrap(trapStack);
    }
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex === -1) {
      trapStack.push(trap);
    } else {
      trapStack.splice(trapIndex, 1);
      trapStack.push(trap);
    }
  },
  // Removes the trap from the top of the stack, then unpauses the next trap down.
  deactivateTrap: function deactivateTrap(trapStack, trap) {
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex !== -1) {
      trapStack.splice(trapIndex, 1);
    }
    activeFocusTraps.unpauseTrap(trapStack);
  },
  // Pauses the trap at the top of the stack.
  pauseTrap: function pauseTrap(trapStack) {
    var activeTrap = activeFocusTraps.getActiveTrap(trapStack);
    activeTrap === null || activeTrap === void 0 || activeTrap._setPausedState(true);
  },
  // Unpauses the trap at the top of the stack.
  unpauseTrap: function unpauseTrap(trapStack) {
    var activeTrap = activeFocusTraps.getActiveTrap(trapStack);
    if (activeTrap && !activeTrap._isManuallyPaused()) {
      activeTrap._setPausedState(false);
    }
  }
};
var isSelectableInput = function isSelectableInput2(node) {
  return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
};
var isTabEvent = function isTabEvent2(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
};
var isKeyForward = function isKeyForward2(e) {
  return isTabEvent(e) && !e.shiftKey;
};
var isKeyBackward = function isKeyBackward2(e) {
  return isTabEvent(e) && e.shiftKey;
};
var delay = function delay2(fn) {
  return setTimeout(fn, 0);
};
var valueOrHandler = function valueOrHandler2(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event) {
  return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var internalTrapStack = [];
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true,
    delayReturnFocus: true,
    isolateSubtrees: false,
    isKeyForward,
    isKeyBackward
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    /** @type {Array<HTMLElement>} */
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    /** @type {Array<{
     *    container: HTMLElement,
     *    tabbableNodes: Array<HTMLElement>, // empty if none
     *    focusableNodes: Array<HTMLElement>, // empty if none
     *    posTabIndexesFound: boolean,
     *    firstTabbableNode: HTMLElement|undefined,
     *    lastTabbableNode: HTMLElement|undefined,
     *    firstDomTabbableNode: HTMLElement|undefined,
     *    lastDomTabbableNode: HTMLElement|undefined,
     *    nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
     *  }>}
     */
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    // references to nodes that are siblings to the ancestors of this trap's containers.
    /** @type {Set<HTMLElement>} */
    adjacentElements: /* @__PURE__ */ new Set(),
    // references to nodes that were inert or aria-hidden before the trap was activated.
    /** @type {Set<HTMLElement>} */
    alreadySilent: /* @__PURE__ */ new Set(),
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    manuallyPaused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0,
    // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
    recentNavEvent: void 0
  };
  var trap;
  var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };
  var findContainerIndex = function findContainerIndex2(element, event) {
    var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
    return state.containerGroups.findIndex(function(_ref) {
      var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
        return node === element;
      });
    });
  };
  var getNodeForOption = function getNodeForOption2(optionName) {
    var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$hasFallback = _ref2.hasFallback, hasFallback = _ref2$hasFallback === void 0 ? false : _ref2$hasFallback, _ref2$params = _ref2.params, params = _ref2$params === void 0 ? [] : _ref2$params;
    var optionValue = config[optionName];
    if (typeof optionValue === "function") {
      optionValue = optionValue.apply(void 0, _toConsumableArray(params));
    }
    if (optionValue === true) {
      optionValue = void 0;
    }
    if (!optionValue) {
      if (optionValue === void 0 || optionValue === false) {
        return optionValue;
      }
      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue;
    if (typeof optionValue === "string") {
      try {
        node = doc.querySelector(optionValue);
      } catch (err) {
        throw new Error("`".concat(optionName, '` appears to be an invalid selector; error="').concat(err.message, '"'));
      }
      if (!node) {
        if (!hasFallback) {
          throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        }
      }
    }
    return node;
  };
  var _getActiveElement = function getActiveElement(el) {
    var activeElement = el.activeElement;
    if (!activeElement) {
      return null;
    }
    if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
      return _getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  };
  var getInitialFocusNode = function getInitialFocusNode2() {
    var node = getNodeForOption("initialFocus", {
      hasFallback: true
    });
    if (node === false) {
      return false;
    }
    if (node === void 0 || node && !isFocusable(node, config.tabbableOptions)) {
      var activeElement = _getActiveElement(doc);
      if (findContainerIndex(activeElement) >= 0) {
        node = activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
        node = firstTabbableNode || getNodeForOption("fallbackFocus");
      }
    } else if (node === null) {
      node = getNodeForOption("fallbackFocus");
    }
    if (!node) {
      throw new Error("Your focus-trap needs to have at least one focusable element");
    }
    return node;
  };
  var updateTabbableNodes = function updateTabbableNodes2() {
    state.containerGroups = state.containers.map(function(container) {
      var tabbableNodes = tabbable(container, config.tabbableOptions);
      var focusableNodes = focusable(container, config.tabbableOptions);
      var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
      var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
      var firstDomTabbableNode = focusableNodes.find(function(node) {
        return isTabbable(node);
      });
      var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
        return isTabbable(node);
      });
      var posTabIndexesFound = !!tabbableNodes.find(function(node) {
        return getTabIndex(node) > 0;
      });
      return {
        container,
        tabbableNodes,
        focusableNodes,
        /** True if at least one node with positive `tabindex` was found in this container. */
        posTabIndexesFound,
        /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
        firstTabbableNode,
        /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
        lastTabbableNode,
        // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
        //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        //  because that API doesn't work with Shadow DOM as well as it should (@see
        //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
        //  to address an edge case related to positive tabindex support, this seems like a much easier,
        //  "close enough most of the time" alternative for positive tabindexes which should generally
        //  be avoided anyway...
        /** First tabbable node in container, __DOM__ order; `undefined` if none. */
        firstDomTabbableNode,
        /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
        lastDomTabbableNode,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function nextTabbableNode(node) {
          var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var nodeIdx = tabbableNodes.indexOf(node);
          if (nodeIdx < 0) {
            if (forward) {
              return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
                return isTabbable(el);
              });
            }
            return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
              return isTabbable(el);
            });
          }
          return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function(group) {
      return group.tabbableNodes.length > 0;
    });
    if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
    if (state.containerGroups.find(function(g2) {
      return g2.posTabIndexesFound;
    }) && state.containerGroups.length > 1) {
      throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
    }
  };
  var _tryFocus = function tryFocus(node) {
    if (node === false) {
      return;
    }
    if (node === _getActiveElement(document)) {
      return;
    }
    if (!node || !node.focus) {
      _tryFocus(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
    var node = getNodeForOption("setReturnFocus", {
      params: [previousActiveElement]
    });
    return node ? node : node === false ? false : previousActiveElement;
  };
  var findNextNavNode = function findNextNavNode2(_ref3) {
    var target = _ref3.target, event = _ref3.event, _ref3$isBackward = _ref3.isBackward, isBackward = _ref3$isBackward === void 0 ? false : _ref3$isBackward;
    target = target || getActualTarget(event);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      var containerIndex = findContainerIndex(target, event);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
      if (containerIndex < 0) {
        if (isBackward) {
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (isBackward) {
        var startOfGroupIndex = state.tabbableGroups.findIndex(function(_ref4) {
          var firstTabbableNode = _ref4.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target, false);
        }
      } else {
        var lastOfGroupIndex = state.tabbableGroups.findIndex(function(_ref5) {
          var lastTabbableNode = _ref5.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
        } else if (!isTabEvent(event)) {
          destinationNode = containerGroup.nextTabbableNode(target);
        }
      }
    } else {
      destinationNode = getNodeForOption("fallbackFocus");
    }
    return destinationNode;
  };
  var checkPointerDown = function checkPointerDown2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      trap.deactivate({
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked (and if not focusable, to "nothing"); by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node), whether the
        //  outside click was on a focusable node or not
        returnFocus: config.returnFocusOnDeactivate
      });
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
  };
  var checkFocusIn = function checkFocusIn2(event) {
    var target = getActualTarget(event);
    var targetContained = findContainerIndex(target, event) >= 0;
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      event.stopImmediatePropagation();
      var nextNode;
      var navAcrossContainers = true;
      if (state.mostRecentlyFocusedNode) {
        if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
          var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
          var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
          if (tabbableNodes.length > 0) {
            var mruTabIdx = tabbableNodes.findIndex(function(node) {
              return node === state.mostRecentlyFocusedNode;
            });
            if (mruTabIdx >= 0) {
              if (config.isKeyForward(state.recentNavEvent)) {
                if (mruTabIdx + 1 < tabbableNodes.length) {
                  nextNode = tabbableNodes[mruTabIdx + 1];
                  navAcrossContainers = false;
                }
              } else {
                if (mruTabIdx - 1 >= 0) {
                  nextNode = tabbableNodes[mruTabIdx - 1];
                  navAcrossContainers = false;
                }
              }
            }
          }
        } else {
          if (!state.containerGroups.some(function(g2) {
            return g2.tabbableNodes.some(function(n2) {
              return getTabIndex(n2) > 0;
            });
          })) {
            navAcrossContainers = false;
          }
        }
      } else {
        navAcrossContainers = false;
      }
      if (navAcrossContainers) {
        nextNode = findNextNavNode({
          // move FROM the MRU node, not event-related node (which will be the node that is
          //  outside the trap causing the focus escape we're trying to fix)
          target: state.mostRecentlyFocusedNode,
          isBackward: config.isKeyBackward(state.recentNavEvent)
        });
      }
      if (nextNode) {
        _tryFocus(nextNode);
      } else {
        _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
      }
    }
    state.recentNavEvent = void 0;
  };
  var checkKeyNav = function checkKeyNav2(event) {
    var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    state.recentNavEvent = event;
    var destinationNode = findNextNavNode({
      event,
      isBackward
    });
    if (destinationNode) {
      if (isTabEvent(event)) {
        event.preventDefault();
      }
      _tryFocus(destinationNode);
    }
  };
  var checkTabKey = function checkTabKey2(event) {
    if (config.isKeyForward(event) || config.isKeyBackward(event)) {
      checkKeyNav(event, config.isKeyBackward(event));
    }
  };
  var checkEscapeKey = function checkEscapeKey2(event) {
    if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
      event.preventDefault();
      trap.deactivate();
    }
  };
  var checkClick = function checkClick2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  var addListeners = function addListeners2() {
    if (!state.active) {
      return;
    }
    activeFocusTraps.activateTrap(trapStack, trap);
    var promise;
    if (config.delayInitialFocus) {
      promise = new Promise(function(resolve) {
        state.delayInitialFocusTimer = delay(function() {
          _tryFocus(getInitialFocusNode());
          resolve();
        });
      });
    } else {
      _tryFocus(getInitialFocusNode());
    }
    doc.addEventListener("focusin", checkFocusIn, true);
    doc.addEventListener("mousedown", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("touchstart", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("click", checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkTabKey, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkEscapeKey);
    return promise;
  };
  var collectAdjacentElements = function collectAdjacentElements2(containers) {
    if (state.active && !state.paused) {
      trap._setSubtreeIsolation(false);
    }
    state.adjacentElements.clear();
    state.alreadySilent.clear();
    var containerAncestors = /* @__PURE__ */ new Set();
    var adjacentElements = /* @__PURE__ */ new Set();
    var _iterator = _createForOfIteratorHelper(containers), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var container = _step.value;
        containerAncestors.add(container);
        var insideShadowRoot = typeof ShadowRoot !== "undefined" && container.getRootNode() instanceof ShadowRoot;
        var current = container;
        while (current) {
          containerAncestors.add(current);
          var parent = current.parentElement;
          var siblings = [];
          if (parent) {
            siblings = parent.children;
          } else if (!parent && insideShadowRoot) {
            siblings = current.getRootNode().children;
            parent = current.getRootNode().host;
            insideShadowRoot = typeof ShadowRoot !== "undefined" && parent.getRootNode() instanceof ShadowRoot;
          }
          var _iterator2 = _createForOfIteratorHelper(siblings), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var child = _step2.value;
              adjacentElements.add(child);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          current = parent;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    containerAncestors.forEach(function(el) {
      adjacentElements["delete"](el);
    });
    state.adjacentElements = adjacentElements;
  };
  var removeListeners = function removeListeners2() {
    if (!state.active) {
      return;
    }
    doc.removeEventListener("focusin", checkFocusIn, true);
    doc.removeEventListener("mousedown", checkPointerDown, true);
    doc.removeEventListener("touchstart", checkPointerDown, true);
    doc.removeEventListener("click", checkClick, true);
    doc.removeEventListener("keydown", checkTabKey, true);
    doc.removeEventListener("keydown", checkEscapeKey);
    return trap;
  };
  var checkDomRemoval = function checkDomRemoval2(mutations) {
    var focusedNode = state.mostRecentlyFocusedNode;
    if (!focusedNode) {
      return;
    }
    var isFocusedNodeRemoved = mutations.some(function(mutation) {
      var removedNodes = Array.from(mutation.removedNodes);
      return removedNodes.some(function(node) {
        return node === focusedNode || typeof node.contains === "function" && node.contains(focusedNode);
      });
    });
    if (isFocusedNodeRemoved && state.containers.some(function(container) {
      return container === null || container === void 0 ? void 0 : container.isConnected;
    })) {
      updateTabbableNodes();
      var initialFocusNode = getInitialFocusNode();
      _tryFocus(initialFocusNode);
    }
  };
  var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0;
  var updateObservedNodes = function updateObservedNodes2() {
    if (!mutationObserver) {
      return;
    }
    mutationObserver.disconnect();
    if (state.active && !state.paused) {
      state.containers.map(function(container) {
        mutationObserver.observe(container, {
          subtree: true,
          childList: true
        });
      });
    }
  };
  trap = {
    get active() {
      return state.active;
    },
    get paused() {
      return state.paused;
    },
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, "onActivate");
      var onPostActivate = getOption(activateOptions, "onPostActivate");
      var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
      var preexistingTrap = activeFocusTraps.getActiveTrap(trapStack);
      var revertState = false;
      if (preexistingTrap && !preexistingTrap.paused) {
        var _preexistingTrap$_set;
        (_preexistingTrap$_set = preexistingTrap._setSubtreeIsolation) === null || _preexistingTrap$_set === void 0 || _preexistingTrap$_set.call(preexistingTrap, false);
        revertState = true;
      }
      try {
        if (!checkCanFocusTrap) {
          updateTabbableNodes();
        }
        state.active = true;
        state.paused = false;
        state.nodeFocusedBeforeActivation = _getActiveElement(doc);
        onActivate === null || onActivate === void 0 || onActivate({
          trap
        });
        var finishActivation = function finishActivation2() {
          if (checkCanFocusTrap) {
            updateTabbableNodes();
          }
          var afterListeners = function afterListeners2() {
            trap._setSubtreeIsolation(true);
            updateObservedNodes();
            onPostActivate === null || onPostActivate === void 0 || onPostActivate({
              trap
            });
          };
          var listenersPromise = addListeners();
          if (listenersPromise) {
            listenersPromise.then(afterListeners);
          } else {
            afterListeners();
          }
        };
        if (checkCanFocusTrap) {
          checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
          return this;
        }
        finishActivation();
      } catch (error) {
        if (preexistingTrap === activeFocusTraps.getActiveTrap(trapStack) && revertState) {
          var _preexistingTrap$_set2;
          (_preexistingTrap$_set2 = preexistingTrap._setSubtreeIsolation) === null || _preexistingTrap$_set2 === void 0 || _preexistingTrap$_set2.call(preexistingTrap, true);
        }
        throw error;
      }
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
      var options = _objectSpread2({
        onDeactivate: config.onDeactivate,
        onPostDeactivate: config.onPostDeactivate,
        checkCanReturnFocus: config.checkCanReturnFocus
      }, deactivateOptions);
      clearTimeout(state.delayInitialFocusTimer);
      state.delayInitialFocusTimer = void 0;
      if (!state.paused) {
        trap._setSubtreeIsolation(false);
      }
      state.alreadySilent.clear();
      removeListeners();
      state.active = false;
      state.paused = false;
      updateObservedNodes();
      activeFocusTraps.deactivateTrap(trapStack, trap);
      var onDeactivate = getOption(options, "onDeactivate");
      var onPostDeactivate = getOption(options, "onPostDeactivate");
      var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
      var delayReturnFocus = getOption(options, "delayReturnFocus");
      var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
      onDeactivate === null || onDeactivate === void 0 || onDeactivate({
        trap
      });
      var completeDeactivation = function completeDeactivation2() {
        if (returnFocus) {
          _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
        }
        onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate({
          trap
        });
      };
      var finishDeactivation = function finishDeactivation2() {
        if (delayReturnFocus && returnFocus) {
          delay(completeDeactivation);
        } else {
          completeDeactivation();
        }
      };
      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }
      finishDeactivation();
      return this;
    },
    pause: function pause(pauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = true;
      return this._setPausedState(true, pauseOptions);
    },
    unpause: function unpause(unpauseOptions) {
      if (!state.active) {
        return this;
      }
      state.manuallyPaused = false;
      if (trapStack[trapStack.length - 1] !== this) {
        return this;
      }
      return this._setPausedState(false, unpauseOptions);
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function(element) {
        return typeof element === "string" ? doc.querySelector(element) : element;
      });
      if (config.isolateSubtrees) {
        collectAdjacentElements(state.containers);
      }
      if (state.active) {
        updateTabbableNodes();
        if (!state.paused) {
          trap._setSubtreeIsolation(true);
        }
      }
      updateObservedNodes();
      return this;
    }
  };
  Object.defineProperties(trap, {
    _isManuallyPaused: {
      value: function value() {
        return state.manuallyPaused;
      }
    },
    _setPausedState: {
      value: function value(paused, options) {
        if (state.paused === paused) {
          return this;
        }
        state.paused = paused;
        if (paused) {
          var onPause = getOption(options, "onPause");
          var onPostPause = getOption(options, "onPostPause");
          onPause === null || onPause === void 0 || onPause({
            trap
          });
          removeListeners();
          trap._setSubtreeIsolation(false);
          updateObservedNodes();
          onPostPause === null || onPostPause === void 0 || onPostPause({
            trap
          });
        } else {
          var onUnpause = getOption(options, "onUnpause");
          var onPostUnpause = getOption(options, "onPostUnpause");
          onUnpause === null || onUnpause === void 0 || onUnpause({
            trap
          });
          var finishUnpause = function finishUnpause2() {
            updateTabbableNodes();
            var afterListeners = function afterListeners2() {
              trap._setSubtreeIsolation(true);
              updateObservedNodes();
              onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause({
                trap
              });
            };
            var listenersPromise = addListeners();
            if (listenersPromise) {
              listenersPromise.then(afterListeners);
            } else {
              afterListeners();
            }
          };
          finishUnpause();
        }
        return this;
      }
    },
    _setSubtreeIsolation: {
      value: function value(isEnabled) {
        if (config.isolateSubtrees) {
          state.adjacentElements.forEach(function(el) {
            var _el$getAttribute;
            if (isEnabled) {
              switch (config.isolateSubtrees) {
                case "aria-hidden":
                  if (el.ariaHidden === "true" || ((_el$getAttribute = el.getAttribute("aria-hidden")) === null || _el$getAttribute === void 0 ? void 0 : _el$getAttribute.toLowerCase()) === "true") {
                    state.alreadySilent.add(el);
                  }
                  el.setAttribute("aria-hidden", "true");
                  break;
                default:
                  if (el.inert || el.hasAttribute("inert")) {
                    state.alreadySilent.add(el);
                  }
                  el.setAttribute("inert", true);
                  break;
              }
            } else {
              if (state.alreadySilent.has(el)) ;
              else {
                switch (config.isolateSubtrees) {
                  case "aria-hidden":
                    el.removeAttribute("aria-hidden");
                    break;
                  default:
                    el.removeAttribute("inert");
                    break;
                }
              }
            }
          });
        }
      }
    }
  });
  trap.updateContainerElements(elements);
  return trap;
};
function getTrapStack() {
  window._nc_focus_trap ??= [];
  return window._nc_focus_trap;
}
function createTrapStackController() {
  let pausedStack = [];
  return {
    /**
     * Pause the current focus-trap stack
     */
    pause() {
      pausedStack = [...getTrapStack()];
      for (const trap of pausedStack) {
        trap.pause();
      }
    },
    /**
     * Unpause the paused focus trap stack
     * If the actual stack is different from the paused one, ignore unpause.
     */
    unpause() {
      if (pausedStack.length === getTrapStack().length) {
        for (const trap of pausedStack) {
          trap.unpause();
        }
      }
      pausedStack = [];
    }
  };
}
function useTrapStackControl(shouldPause, options = {}) {
  const trapStackController = createTrapStackController();
  watch(shouldPause, () => {
    if (toValue(options.disabled)) {
      return;
    }
    if (toValue(shouldPause)) {
      trapStackController.pause();
    } else {
      trapStackController.unpause();
    }
  });
  onUnmounted(() => {
    trapStackController.unpause();
  });
}
const h = {
  // Disable popper components
  disabled: false,
  // Default position offset along main axis (px)
  distance: 5,
  // Default position offset along cross axis (px)
  skidding: 0,
  // Default container where the tooltip will be appended
  container: "body",
  // Element used to compute position and size boundaries
  boundary: void 0,
  // Skip delay & CSS transitions when another popper is shown, so that the popper appear to instanly move to the new position.
  instantMove: false,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 150,
  // Triggers on the popper itself
  popperTriggers: [],
  // Positioning strategy
  strategy: "absolute",
  // Prevent overflow
  preventOverflow: true,
  // Flip to the opposite placement if needed
  flip: true,
  // Shift on the cross axis to prevent the popper from overflowing
  shift: true,
  // Overflow padding (px)
  overflowPadding: 0,
  // Arrow padding (px)
  arrowPadding: 0,
  // Compute arrow overflow (useful to hide it)
  arrowOverflow: true,
  /**
   * By default, compute autohide on 'click'.
   */
  autoHideOnMousedown: false,
  // Themes
  themes: {
    tooltip: {
      // Default tooltip placement relative to target element
      placement: "top",
      // Default events that trigger the tooltip
      triggers: ["hover", "focus", "touch"],
      // Close tooltip on click on tooltip target
      hideTriggers: (e) => [...e, "click"],
      // Delay (ms)
      delay: {
        show: 200,
        hide: 0
      },
      // Update popper on content resize
      handleResize: false,
      // Enable HTML content in directive
      html: false,
      // Displayed when tooltip content is loading
      loadingContent: "..."
    },
    dropdown: {
      // Default dropdown placement relative to target element
      placement: "bottom",
      // Default events that trigger the dropdown
      triggers: ["click"],
      // Delay (ms)
      delay: 0,
      // Update popper on content resize
      handleResize: true,
      // Hide on clock outside
      autoHide: true
    },
    menu: {
      $extend: "dropdown",
      triggers: ["hover", "focus"],
      popperTriggers: ["hover"],
      delay: {
        show: 0,
        hide: 400
      }
    }
  }
};
function S(e, t5) {
  let o = h.themes[e] || {}, i;
  do
    i = o[t5], typeof i > "u" ? o.$extend ? o = h.themes[o.$extend] || {} : (o = null, i = h[t5]) : o = null;
  while (o);
  return i;
}
function Ze(e) {
  const t5 = [e];
  let o = h.themes[e] || {};
  do
    o.$extend && !o.$resetCss ? (t5.push(o.$extend), o = h.themes[o.$extend] || {}) : o = null;
  while (o);
  return t5.map((i) => `v-popper--theme-${i}`);
}
function re(e) {
  const t5 = [e];
  let o = h.themes[e] || {};
  do
    o.$extend ? (t5.push(o.$extend), o = h.themes[o.$extend] || {}) : o = null;
  while (o);
  return t5;
}
let $ = false;
if (typeof window < "u") {
  $ = false;
  try {
    const e = Object.defineProperty({}, "passive", {
      get() {
        $ = true;
      }
    });
    window.addEventListener("test", null, e);
  } catch {
  }
}
let _e = false;
typeof window < "u" && typeof navigator < "u" && (_e = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
const Te = ["auto", "top", "bottom", "left", "right"].reduce((e, t5) => e.concat([
  t5,
  `${t5}-start`,
  `${t5}-end`
]), []), pe = {
  hover: "mouseenter",
  focus: "focus",
  click: "click",
  touch: "touchstart",
  pointer: "pointerdown"
}, ae = {
  hover: "mouseleave",
  focus: "blur",
  click: "click",
  touch: "touchend",
  pointer: "pointerup"
};
function de(e, t5) {
  const o = e.indexOf(t5);
  o !== -1 && e.splice(o, 1);
}
function G() {
  return new Promise((e) => requestAnimationFrame(() => {
    requestAnimationFrame(e);
  }));
}
const d = [];
let g = null;
const le = {};
function he(e) {
  let t5 = le[e];
  return t5 || (t5 = le[e] = []), t5;
}
let Y = function() {
};
typeof window < "u" && (Y = window.Element);
function n(e) {
  return function(t5) {
    return S(t5.theme, e);
  };
}
const q = "__floating-vue__popper", Q = () => defineComponent({
  name: "VPopper",
  provide() {
    return {
      [q]: {
        parentPopper: this
      }
    };
  },
  inject: {
    [q]: { default: null }
  },
  props: {
    theme: {
      type: String,
      required: true
    },
    targetNodes: {
      type: Function,
      required: true
    },
    referenceNode: {
      type: Function,
      default: null
    },
    popperNode: {
      type: Function,
      required: true
    },
    shown: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: String,
      default: null
    },
    // eslint-disable-next-line vue/require-prop-types
    ariaId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: n("disabled")
    },
    positioningDisabled: {
      type: Boolean,
      default: n("positioningDisabled")
    },
    placement: {
      type: String,
      default: n("placement"),
      validator: (e) => Te.includes(e)
    },
    delay: {
      type: [String, Number, Object],
      default: n("delay")
    },
    distance: {
      type: [Number, String],
      default: n("distance")
    },
    skidding: {
      type: [Number, String],
      default: n("skidding")
    },
    triggers: {
      type: Array,
      default: n("triggers")
    },
    showTriggers: {
      type: [Array, Function],
      default: n("showTriggers")
    },
    hideTriggers: {
      type: [Array, Function],
      default: n("hideTriggers")
    },
    popperTriggers: {
      type: Array,
      default: n("popperTriggers")
    },
    popperShowTriggers: {
      type: [Array, Function],
      default: n("popperShowTriggers")
    },
    popperHideTriggers: {
      type: [Array, Function],
      default: n("popperHideTriggers")
    },
    container: {
      type: [String, Object, Y, Boolean],
      default: n("container")
    },
    boundary: {
      type: [String, Y],
      default: n("boundary")
    },
    strategy: {
      type: String,
      validator: (e) => ["absolute", "fixed"].includes(e),
      default: n("strategy")
    },
    autoHide: {
      type: [Boolean, Function],
      default: n("autoHide")
    },
    handleResize: {
      type: Boolean,
      default: n("handleResize")
    },
    instantMove: {
      type: Boolean,
      default: n("instantMove")
    },
    eagerMount: {
      type: Boolean,
      default: n("eagerMount")
    },
    popperClass: {
      type: [String, Array, Object],
      default: n("popperClass")
    },
    computeTransformOrigin: {
      type: Boolean,
      default: n("computeTransformOrigin")
    },
    /**
     * @deprecated
     */
    autoMinSize: {
      type: Boolean,
      default: n("autoMinSize")
    },
    autoSize: {
      type: [Boolean, String],
      default: n("autoSize")
    },
    /**
     * @deprecated
     */
    autoMaxSize: {
      type: Boolean,
      default: n("autoMaxSize")
    },
    autoBoundaryMaxSize: {
      type: Boolean,
      default: n("autoBoundaryMaxSize")
    },
    preventOverflow: {
      type: Boolean,
      default: n("preventOverflow")
    },
    overflowPadding: {
      type: [Number, String],
      default: n("overflowPadding")
    },
    arrowPadding: {
      type: [Number, String],
      default: n("arrowPadding")
    },
    arrowOverflow: {
      type: Boolean,
      default: n("arrowOverflow")
    },
    flip: {
      type: Boolean,
      default: n("flip")
    },
    shift: {
      type: Boolean,
      default: n("shift")
    },
    shiftCrossAxis: {
      type: Boolean,
      default: n("shiftCrossAxis")
    },
    noAutoFocus: {
      type: Boolean,
      default: n("noAutoFocus")
    },
    disposeTimeout: {
      type: Number,
      default: n("disposeTimeout")
    }
  },
  emits: {
    show: () => true,
    hide: () => true,
    "update:shown": (e) => true,
    "apply-show": () => true,
    "apply-hide": () => true,
    "close-group": () => true,
    "close-directive": () => true,
    "auto-hide": () => true,
    resize: () => true
  },
  data() {
    return {
      isShown: false,
      isMounted: false,
      skipTransition: false,
      classes: {
        showFrom: false,
        showTo: false,
        hideFrom: false,
        hideTo: true
      },
      result: {
        x: 0,
        y: 0,
        placement: "",
        strategy: this.strategy,
        arrow: {
          x: 0,
          y: 0,
          centerOffset: 0
        },
        transformOrigin: null
      },
      randomId: `popper_${[Math.random(), Date.now()].map((e) => e.toString(36).substring(2, 10)).join("_")}`,
      shownChildren: /* @__PURE__ */ new Set(),
      lastAutoHide: true,
      pendingHide: false,
      containsGlobalTarget: false,
      isDisposed: true,
      mouseDownContains: false
    };
  },
  computed: {
    popperId() {
      return this.ariaId != null ? this.ariaId : this.randomId;
    },
    shouldMountContent() {
      return this.eagerMount || this.isMounted;
    },
    slotData() {
      return {
        popperId: this.popperId,
        isShown: this.isShown,
        shouldMountContent: this.shouldMountContent,
        skipTransition: this.skipTransition,
        autoHide: typeof this.autoHide == "function" ? this.lastAutoHide : this.autoHide,
        show: this.show,
        hide: this.hide,
        handleResize: this.handleResize,
        onResize: this.onResize,
        classes: {
          ...this.classes,
          popperClass: this.popperClass
        },
        result: this.positioningDisabled ? null : this.result,
        attrs: this.$attrs
      };
    },
    parentPopper() {
      var e;
      return (e = this[q]) == null ? void 0 : e.parentPopper;
    },
    hasPopperShowTriggerHover() {
      var e, t5;
      return ((e = this.popperTriggers) == null ? void 0 : e.includes("hover")) || ((t5 = this.popperShowTriggers) == null ? void 0 : t5.includes("hover"));
    }
  },
  watch: {
    shown: "$_autoShowHide",
    disabled(e) {
      e ? this.dispose() : this.init();
    },
    async container() {
      this.isShown && (this.$_ensureTeleport(), await this.$_computePosition());
    },
    triggers: {
      handler: "$_refreshListeners",
      deep: true
    },
    positioningDisabled: "$_refreshListeners",
    ...[
      "placement",
      "distance",
      "skidding",
      "boundary",
      "strategy",
      "overflowPadding",
      "arrowPadding",
      "preventOverflow",
      "shift",
      "shiftCrossAxis",
      "flip"
    ].reduce((e, t5) => (e[t5] = "$_computePosition", e), {})
  },
  created() {
    this.autoMinSize && console.warn('[floating-vue] `autoMinSize` option is deprecated. Use `autoSize="min"` instead.'), this.autoMaxSize && console.warn("[floating-vue] `autoMaxSize` option is deprecated. Use `autoBoundaryMaxSize` instead.");
  },
  mounted() {
    this.init(), this.$_detachPopperNode();
  },
  activated() {
    this.$_autoShowHide();
  },
  deactivated() {
    this.hide();
  },
  beforeUnmount() {
    this.dispose();
  },
  methods: {
    show({ event: e = null, skipDelay: t5 = false, force: o = false } = {}) {
      var i, s;
      (i = this.parentPopper) != null && i.lockedChild && this.parentPopper.lockedChild !== this || (this.pendingHide = false, (o || !this.disabled) && (((s = this.parentPopper) == null ? void 0 : s.lockedChild) === this && (this.parentPopper.lockedChild = null), this.$_scheduleShow(e, t5), this.$emit("show"), this.$_showFrameLocked = true, requestAnimationFrame(() => {
        this.$_showFrameLocked = false;
      })), this.$emit("update:shown", true));
    },
    hide({ event: e = null, skipDelay: t5 = false } = {}) {
      var o;
      if (!this.$_hideInProgress) {
        if (this.shownChildren.size > 0) {
          this.pendingHide = true;
          return;
        }
        if (this.hasPopperShowTriggerHover && this.$_isAimingPopper()) {
          this.parentPopper && (this.parentPopper.lockedChild = this, clearTimeout(this.parentPopper.lockedChildTimer), this.parentPopper.lockedChildTimer = setTimeout(() => {
            this.parentPopper.lockedChild === this && (this.parentPopper.lockedChild.hide({ skipDelay: t5 }), this.parentPopper.lockedChild = null);
          }, 1e3));
          return;
        }
        ((o = this.parentPopper) == null ? void 0 : o.lockedChild) === this && (this.parentPopper.lockedChild = null), this.pendingHide = false, this.$_scheduleHide(e, t5), this.$emit("hide"), this.$emit("update:shown", false);
      }
    },
    init() {
      var e;
      this.isDisposed && (this.isDisposed = false, this.isMounted = false, this.$_events = [], this.$_preventShow = false, this.$_referenceNode = ((e = this.referenceNode) == null ? void 0 : e.call(this)) ?? this.$el, this.$_targetNodes = this.targetNodes().filter((t5) => t5.nodeType === t5.ELEMENT_NODE), this.$_popperNode = this.popperNode(), this.$_innerNode = this.$_popperNode.querySelector(".v-popper__inner"), this.$_arrowNode = this.$_popperNode.querySelector(".v-popper__arrow-container"), this.$_swapTargetAttrs("title", "data-original-title"), this.$_detachPopperNode(), this.triggers.length && this.$_addEventListeners(), this.shown && this.show());
    },
    dispose() {
      this.isDisposed || (this.isDisposed = true, this.$_removeEventListeners(), this.hide({ skipDelay: true }), this.$_detachPopperNode(), this.isMounted = false, this.isShown = false, this.$_updateParentShownChildren(false), this.$_swapTargetAttrs("data-original-title", "title"));
    },
    async onResize() {
      this.isShown && (await this.$_computePosition(), this.$emit("resize"));
    },
    async $_computePosition() {
      if (this.isDisposed || this.positioningDisabled)
        return;
      const e = {
        strategy: this.strategy,
        middleware: []
      };
      (this.distance || this.skidding) && e.middleware.push(offset({
        mainAxis: this.distance,
        crossAxis: this.skidding
      }));
      const t5 = this.placement.startsWith("auto");
      if (t5 ? e.middleware.push(autoPlacement({
        alignment: this.placement.split("-")[1] ?? ""
      })) : e.placement = this.placement, this.preventOverflow && (this.shift && e.middleware.push(shift({
        padding: this.overflowPadding,
        boundary: this.boundary,
        crossAxis: this.shiftCrossAxis
      })), !t5 && this.flip && e.middleware.push(flip({
        padding: this.overflowPadding,
        boundary: this.boundary
      }))), e.middleware.push(arrow({
        element: this.$_arrowNode,
        padding: this.arrowPadding
      })), this.arrowOverflow && e.middleware.push({
        name: "arrowOverflow",
        fn: ({ placement: i, rects: s, middlewareData: r }) => {
          let p;
          const { centerOffset: a } = r.arrow;
          return i.startsWith("top") || i.startsWith("bottom") ? p = Math.abs(a) > s.reference.width / 2 : p = Math.abs(a) > s.reference.height / 2, {
            data: {
              overflow: p
            }
          };
        }
      }), this.autoMinSize || this.autoSize) {
        const i = this.autoSize ? this.autoSize : this.autoMinSize ? "min" : null;
        e.middleware.push({
          name: "autoSize",
          fn: ({ rects: s, placement: r, middlewareData: p }) => {
            var u;
            if ((u = p.autoSize) != null && u.skip)
              return {};
            let a, l;
            return r.startsWith("top") || r.startsWith("bottom") ? a = s.reference.width : l = s.reference.height, this.$_innerNode.style[i === "min" ? "minWidth" : i === "max" ? "maxWidth" : "width"] = a != null ? `${a}px` : null, this.$_innerNode.style[i === "min" ? "minHeight" : i === "max" ? "maxHeight" : "height"] = l != null ? `${l}px` : null, {
              data: {
                skip: true
              },
              reset: {
                rects: true
              }
            };
          }
        });
      }
      (this.autoMaxSize || this.autoBoundaryMaxSize) && (this.$_innerNode.style.maxWidth = null, this.$_innerNode.style.maxHeight = null, e.middleware.push(size({
        boundary: this.boundary,
        padding: this.overflowPadding,
        apply: ({ availableWidth: i, availableHeight: s }) => {
          this.$_innerNode.style.maxWidth = i != null ? `${i}px` : null, this.$_innerNode.style.maxHeight = s != null ? `${s}px` : null;
        }
      })));
      const o = await B$1(this.$_referenceNode, this.$_popperNode, e);
      Object.assign(this.result, {
        x: o.x,
        y: o.y,
        placement: o.placement,
        strategy: o.strategy,
        arrow: {
          ...o.middlewareData.arrow,
          ...o.middlewareData.arrowOverflow
        }
      });
    },
    $_scheduleShow(e, t5 = false) {
      if (this.$_updateParentShownChildren(true), this.$_hideInProgress = false, clearTimeout(this.$_scheduleTimer), g && this.instantMove && g.instantMove && g !== this.parentPopper) {
        g.$_applyHide(true), this.$_applyShow(true);
        return;
      }
      t5 ? this.$_applyShow() : this.$_scheduleTimer = setTimeout(this.$_applyShow.bind(this), this.$_computeDelay("show"));
    },
    $_scheduleHide(e, t5 = false) {
      if (this.shownChildren.size > 0) {
        this.pendingHide = true;
        return;
      }
      this.$_updateParentShownChildren(false), this.$_hideInProgress = true, clearTimeout(this.$_scheduleTimer), this.isShown && (g = this), t5 ? this.$_applyHide() : this.$_scheduleTimer = setTimeout(this.$_applyHide.bind(this), this.$_computeDelay("hide"));
    },
    $_computeDelay(e) {
      const t5 = this.delay;
      return parseInt(t5 && t5[e] || t5 || 0);
    },
    async $_applyShow(e = false) {
      clearTimeout(this.$_disposeTimer), clearTimeout(this.$_scheduleTimer), this.skipTransition = e, !this.isShown && (this.$_ensureTeleport(), await G(), await this.$_computePosition(), await this.$_applyShowEffect(), this.positioningDisabled || this.$_registerEventListeners([
        ...D(this.$_referenceNode),
        ...D(this.$_popperNode)
      ], "scroll", () => {
        this.$_computePosition();
      }));
    },
    async $_applyShowEffect() {
      if (this.$_hideInProgress)
        return;
      if (this.computeTransformOrigin) {
        const t5 = this.$_referenceNode.getBoundingClientRect(), o = this.$_popperNode.querySelector(".v-popper__wrapper"), i = o.parentNode.getBoundingClientRect(), s = t5.x + t5.width / 2 - (i.left + o.offsetLeft), r = t5.y + t5.height / 2 - (i.top + o.offsetTop);
        this.result.transformOrigin = `${s}px ${r}px`;
      }
      this.isShown = true, this.$_applyAttrsToTarget({
        "aria-describedby": this.popperId,
        "data-popper-shown": ""
      });
      const e = this.showGroup;
      if (e) {
        let t5;
        for (let o = 0; o < d.length; o++)
          t5 = d[o], t5.showGroup !== e && (t5.hide(), t5.$emit("close-group"));
      }
      d.push(this), document.body.classList.add("v-popper--some-open");
      for (const t5 of re(this.theme))
        he(t5).push(this), document.body.classList.add(`v-popper--some-open--${t5}`);
      this.$emit("apply-show"), this.classes.showFrom = true, this.classes.showTo = false, this.classes.hideFrom = false, this.classes.hideTo = false, await G(), this.classes.showFrom = false, this.classes.showTo = true, this.noAutoFocus || this.$_popperNode.focus();
    },
    async $_applyHide(e = false) {
      if (this.shownChildren.size > 0) {
        this.pendingHide = true, this.$_hideInProgress = false;
        return;
      }
      if (clearTimeout(this.$_scheduleTimer), !this.isShown)
        return;
      this.skipTransition = e, de(d, this), d.length === 0 && document.body.classList.remove("v-popper--some-open");
      for (const o of re(this.theme)) {
        const i = he(o);
        de(i, this), i.length === 0 && document.body.classList.remove(`v-popper--some-open--${o}`);
      }
      g === this && (g = null), this.isShown = false, this.$_applyAttrsToTarget({
        "aria-describedby": void 0,
        "data-popper-shown": void 0
      }), clearTimeout(this.$_disposeTimer);
      const t5 = this.disposeTimeout;
      t5 !== null && (this.$_disposeTimer = setTimeout(() => {
        this.$_popperNode && (this.$_detachPopperNode(), this.isMounted = false);
      }, t5)), this.$_removeEventListeners("scroll"), this.$emit("apply-hide"), this.classes.showFrom = false, this.classes.showTo = false, this.classes.hideFrom = true, this.classes.hideTo = false, await G(), this.classes.hideFrom = false, this.classes.hideTo = true;
    },
    $_autoShowHide() {
      this.shown ? this.show() : this.hide();
    },
    $_ensureTeleport() {
      if (this.isDisposed)
        return;
      let e = this.container;
      if (typeof e == "string" ? e = window.document.querySelector(e) : e === false && (e = this.$_targetNodes[0].parentNode), !e)
        throw new Error("No container for popover: " + this.container);
      e.appendChild(this.$_popperNode), this.isMounted = true;
    },
    $_addEventListeners() {
      const e = (o) => {
        this.isShown && !this.$_hideInProgress || (o.usedByTooltip = true, !this.$_preventShow && this.show({ event: o }));
      };
      this.$_registerTriggerListeners(this.$_targetNodes, pe, this.triggers, this.showTriggers, e), this.$_registerTriggerListeners([this.$_popperNode], pe, this.popperTriggers, this.popperShowTriggers, e);
      const t5 = (o) => {
        o.usedByTooltip || this.hide({ event: o });
      };
      this.$_registerTriggerListeners(this.$_targetNodes, ae, this.triggers, this.hideTriggers, t5), this.$_registerTriggerListeners([this.$_popperNode], ae, this.popperTriggers, this.popperHideTriggers, t5);
    },
    $_registerEventListeners(e, t5, o) {
      this.$_events.push({ targetNodes: e, eventType: t5, handler: o }), e.forEach((i) => i.addEventListener(t5, o, $ ? {
        passive: true
      } : void 0));
    },
    $_registerTriggerListeners(e, t5, o, i, s) {
      let r = o;
      i != null && (r = typeof i == "function" ? i(r) : i), r.forEach((p) => {
        const a = t5[p];
        a && this.$_registerEventListeners(e, a, s);
      });
    },
    $_removeEventListeners(e) {
      const t5 = [];
      this.$_events.forEach((o) => {
        const { targetNodes: i, eventType: s, handler: r } = o;
        !e || e === s ? i.forEach((p) => p.removeEventListener(s, r)) : t5.push(o);
      }), this.$_events = t5;
    },
    $_refreshListeners() {
      this.isDisposed || (this.$_removeEventListeners(), this.$_addEventListeners());
    },
    $_handleGlobalClose(e, t5 = false) {
      this.$_showFrameLocked || (this.hide({ event: e }), e.closePopover ? this.$emit("close-directive") : this.$emit("auto-hide"), t5 && (this.$_preventShow = true, setTimeout(() => {
        this.$_preventShow = false;
      }, 300)));
    },
    $_detachPopperNode() {
      this.$_popperNode.parentNode && this.$_popperNode.parentNode.removeChild(this.$_popperNode);
    },
    $_swapTargetAttrs(e, t5) {
      for (const o of this.$_targetNodes) {
        const i = o.getAttribute(e);
        i && (o.removeAttribute(e), o.setAttribute(t5, i));
      }
    },
    $_applyAttrsToTarget(e) {
      for (const t5 of this.$_targetNodes)
        for (const o in e) {
          const i = e[o];
          i == null ? t5.removeAttribute(o) : t5.setAttribute(o, i);
        }
    },
    $_updateParentShownChildren(e) {
      let t5 = this.parentPopper;
      for (; t5; )
        e ? t5.shownChildren.add(this.randomId) : (t5.shownChildren.delete(this.randomId), t5.pendingHide && t5.hide()), t5 = t5.parentPopper;
    },
    $_isAimingPopper() {
      const e = this.$_referenceNode.getBoundingClientRect();
      if (y >= e.left && y <= e.right && _ >= e.top && _ <= e.bottom) {
        const t5 = this.$_popperNode.getBoundingClientRect(), o = y - c, i = _ - m, r = t5.left + t5.width / 2 - c + (t5.top + t5.height / 2) - m + t5.width + t5.height, p = c + o * r, a = m + i * r;
        return C(c, m, p, a, t5.left, t5.top, t5.left, t5.bottom) || // Left edge
        C(c, m, p, a, t5.left, t5.top, t5.right, t5.top) || // Top edge
        C(c, m, p, a, t5.right, t5.top, t5.right, t5.bottom) || // Right edge
        C(c, m, p, a, t5.left, t5.bottom, t5.right, t5.bottom);
      }
      return false;
    }
  },
  render() {
    return this.$slots.default(this.slotData);
  }
});
if (typeof document < "u" && typeof window < "u") {
  if (_e) {
    const e = $ ? {
      passive: true,
      capture: true
    } : true;
    document.addEventListener("touchstart", (t5) => ue(t5), e), document.addEventListener("touchend", (t5) => fe(t5, true), e);
  } else
    window.addEventListener("mousedown", (e) => ue(e), true), window.addEventListener("click", (e) => fe(e, false), true);
  window.addEventListener("resize", tt);
}
function ue(e, t5) {
  for (let o = 0; o < d.length; o++) {
    const i = d[o];
    try {
      i.mouseDownContains = i.popperNode().contains(e.target);
    } catch {
    }
  }
}
function fe(e, t5) {
  Pe(e, t5);
}
function Pe(e, t5) {
  const o = {};
  for (let i = d.length - 1; i >= 0; i--) {
    const s = d[i];
    try {
      const r = s.containsGlobalTarget = s.mouseDownContains || s.popperNode().contains(e.target);
      s.pendingHide = false, requestAnimationFrame(() => {
        if (s.pendingHide = false, !o[s.randomId] && ce(s, r, e)) {
          if (s.$_handleGlobalClose(e, t5), !e.closeAllPopover && e.closePopover && r) {
            let a = s.parentPopper;
            for (; a; )
              o[a.randomId] = true, a = a.parentPopper;
            return;
          }
          let p = s.parentPopper;
          for (; p && ce(p, p.containsGlobalTarget, e); ) {
            p.$_handleGlobalClose(e, t5);
            p = p.parentPopper;
          }
        }
      });
    } catch {
    }
  }
}
function ce(e, t5, o) {
  return o.closeAllPopover || o.closePopover && t5 || et(e, o) && !t5;
}
function et(e, t5) {
  if (typeof e.autoHide == "function") {
    const o = e.autoHide(t5);
    return e.lastAutoHide = o, o;
  }
  return e.autoHide;
}
function tt() {
  for (let e = 0; e < d.length; e++)
    d[e].$_computePosition();
}
let c = 0, m = 0, y = 0, _ = 0;
typeof window < "u" && window.addEventListener("mousemove", (e) => {
  c = y, m = _, y = e.clientX, _ = e.clientY;
}, $ ? {
  passive: true
} : void 0);
function C(e, t5, o, i, s, r, p, a) {
  const l = ((p - s) * (t5 - r) - (a - r) * (e - s)) / ((a - r) * (o - e) - (p - s) * (i - t5)), u = ((o - e) * (t5 - r) - (i - t5) * (e - s)) / ((a - r) * (o - e) - (p - s) * (i - t5));
  return l >= 0 && l <= 1 && u >= 0 && u <= 1;
}
const ot = {
  extends: Q()
}, B = (e, t5) => {
  const o = e.__vccOpts || e;
  for (const [i, s] of t5)
    o[i] = s;
  return o;
};
function it(e, t5, o, i, s, r) {
  return openBlock(), createElementBlock("div", {
    ref: "reference",
    class: normalizeClass(["v-popper", {
      "v-popper--shown": e.slotData.isShown
    }])
  }, [
    renderSlot(e.$slots, "default", normalizeProps(guardReactiveProps(e.slotData)))
  ], 2);
}
const st = /* @__PURE__ */ B(ot, [["render", it]]);
function nt() {
  var e = window.navigator.userAgent, t5 = e.indexOf("MSIE ");
  if (t5 > 0)
    return parseInt(e.substring(t5 + 5, e.indexOf(".", t5)), 10);
  var o = e.indexOf("Trident/");
  if (o > 0) {
    var i = e.indexOf("rv:");
    return parseInt(e.substring(i + 3, e.indexOf(".", i)), 10);
  }
  var s = e.indexOf("Edge/");
  return s > 0 ? parseInt(e.substring(s + 5, e.indexOf(".", s)), 10) : -1;
}
let z;
function X() {
  X.init || (X.init = true, z = nt() !== -1);
}
var E = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    X(), nextTick(() => {
      this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitOnMount && this.emitSize();
    });
    const e = document.createElement("object");
    this._resizeObject = e, e.setAttribute("aria-hidden", "true"), e.setAttribute("tabindex", -1), e.onload = this.addResizeHandlers, e.type = "text/html", z && this.$el.appendChild(e), e.data = "about:blank", z || this.$el.appendChild(e);
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) && (this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitSize());
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify), this.compareAndNotify();
    },
    removeResizeHandlers() {
      this._resizeObject && this._resizeObject.onload && (!z && this._resizeObject.contentDocument && this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify), this.$el.removeChild(this._resizeObject), this._resizeObject.onload = null, this._resizeObject = null);
    }
  }
};
const rt = /* @__PURE__ */ withScopeId();
pushScopeId("data-v-b329ee4c");
const pt = {
  class: "resize-observer",
  tabindex: "-1"
};
popScopeId();
const at = /* @__PURE__ */ rt((e, t5, o, i, s, r) => (openBlock(), createBlock("div", pt)));
E.render = at;
E.__scopeId = "data-v-b329ee4c";
E.__file = "src/components/ResizeObserver.vue";
const Z = (e = "theme") => ({
  computed: {
    themeClass() {
      return Ze(this[e]);
    }
  }
}), dt = defineComponent({
  name: "VPopperContent",
  components: {
    ResizeObserver: E
  },
  mixins: [
    Z()
  ],
  props: {
    popperId: String,
    theme: String,
    shown: Boolean,
    mounted: Boolean,
    skipTransition: Boolean,
    autoHide: Boolean,
    handleResize: Boolean,
    classes: Object,
    result: Object
  },
  emits: [
    "hide",
    "resize"
  ],
  methods: {
    toPx(e) {
      return e != null && !isNaN(e) ? `${e}px` : null;
    }
  }
}), lt = ["id", "aria-hidden", "tabindex", "data-popper-placement"], ht = {
  ref: "inner",
  class: "v-popper__inner"
}, ut = /* @__PURE__ */ createBaseVNode("div", { class: "v-popper__arrow-outer" }, null, -1), ft = /* @__PURE__ */ createBaseVNode("div", { class: "v-popper__arrow-inner" }, null, -1), ct = [
  ut,
  ft
];
function mt(e, t5, o, i, s, r) {
  const p = resolveComponent("ResizeObserver");
  return openBlock(), createElementBlock("div", {
    id: e.popperId,
    ref: "popover",
    class: normalizeClass(["v-popper__popper", [
      e.themeClass,
      e.classes.popperClass,
      {
        "v-popper__popper--shown": e.shown,
        "v-popper__popper--hidden": !e.shown,
        "v-popper__popper--show-from": e.classes.showFrom,
        "v-popper__popper--show-to": e.classes.showTo,
        "v-popper__popper--hide-from": e.classes.hideFrom,
        "v-popper__popper--hide-to": e.classes.hideTo,
        "v-popper__popper--skip-transition": e.skipTransition,
        "v-popper__popper--arrow-overflow": e.result && e.result.arrow.overflow,
        "v-popper__popper--no-positioning": !e.result
      }
    ]]),
    style: normalizeStyle(e.result ? {
      position: e.result.strategy,
      transform: `translate3d(${Math.round(e.result.x)}px,${Math.round(e.result.y)}px,0)`
    } : void 0),
    "aria-hidden": e.shown ? "false" : "true",
    tabindex: e.autoHide ? 0 : void 0,
    "data-popper-placement": e.result ? e.result.placement : void 0,
    onKeyup: t5[2] || (t5[2] = withKeys((a) => e.autoHide && e.$emit("hide"), ["esc"]))
  }, [
    createBaseVNode("div", {
      class: "v-popper__backdrop",
      onClick: t5[0] || (t5[0] = (a) => e.autoHide && e.$emit("hide"))
    }),
    createBaseVNode("div", {
      class: "v-popper__wrapper",
      style: normalizeStyle(e.result ? {
        transformOrigin: e.result.transformOrigin
      } : void 0)
    }, [
      createBaseVNode("div", ht, [
        e.mounted ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("div", null, [
            renderSlot(e.$slots, "default")
          ]),
          e.handleResize ? (openBlock(), createBlock(p, {
            key: 0,
            onNotify: t5[1] || (t5[1] = (a) => e.$emit("resize", a))
          })) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 512),
      createBaseVNode("div", {
        ref: "arrow",
        class: "v-popper__arrow-container",
        style: normalizeStyle(e.result ? {
          left: e.toPx(e.result.arrow.x),
          top: e.toPx(e.result.arrow.y)
        } : void 0)
      }, ct, 4)
    ], 4)
  ], 46, lt);
}
const ee = /* @__PURE__ */ B(dt, [["render", mt]]), te = {
  methods: {
    show(...e) {
      return this.$refs.popper.show(...e);
    },
    hide(...e) {
      return this.$refs.popper.hide(...e);
    },
    dispose(...e) {
      return this.$refs.popper.dispose(...e);
    },
    onResize(...e) {
      return this.$refs.popper.onResize(...e);
    }
  }
};
let K = function() {
};
typeof window < "u" && (K = window.Element);
const gt = defineComponent({
  name: "VPopperWrapper",
  components: {
    Popper: st,
    PopperContent: ee
  },
  mixins: [
    te,
    Z("finalTheme")
  ],
  props: {
    theme: {
      type: String,
      default: null
    },
    referenceNode: {
      type: Function,
      default: null
    },
    shown: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: String,
      default: null
    },
    // eslint-disable-next-line vue/require-prop-types
    ariaId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    positioningDisabled: {
      type: Boolean,
      default: void 0
    },
    placement: {
      type: String,
      default: void 0
    },
    delay: {
      type: [String, Number, Object],
      default: void 0
    },
    distance: {
      type: [Number, String],
      default: void 0
    },
    skidding: {
      type: [Number, String],
      default: void 0
    },
    triggers: {
      type: Array,
      default: void 0
    },
    showTriggers: {
      type: [Array, Function],
      default: void 0
    },
    hideTriggers: {
      type: [Array, Function],
      default: void 0
    },
    popperTriggers: {
      type: Array,
      default: void 0
    },
    popperShowTriggers: {
      type: [Array, Function],
      default: void 0
    },
    popperHideTriggers: {
      type: [Array, Function],
      default: void 0
    },
    container: {
      type: [String, Object, K, Boolean],
      default: void 0
    },
    boundary: {
      type: [String, K],
      default: void 0
    },
    strategy: {
      type: String,
      default: void 0
    },
    autoHide: {
      type: [Boolean, Function],
      default: void 0
    },
    handleResize: {
      type: Boolean,
      default: void 0
    },
    instantMove: {
      type: Boolean,
      default: void 0
    },
    eagerMount: {
      type: Boolean,
      default: void 0
    },
    popperClass: {
      type: [String, Array, Object],
      default: void 0
    },
    computeTransformOrigin: {
      type: Boolean,
      default: void 0
    },
    /**
     * @deprecated
     */
    autoMinSize: {
      type: Boolean,
      default: void 0
    },
    autoSize: {
      type: [Boolean, String],
      default: void 0
    },
    /**
     * @deprecated
     */
    autoMaxSize: {
      type: Boolean,
      default: void 0
    },
    autoBoundaryMaxSize: {
      type: Boolean,
      default: void 0
    },
    preventOverflow: {
      type: Boolean,
      default: void 0
    },
    overflowPadding: {
      type: [Number, String],
      default: void 0
    },
    arrowPadding: {
      type: [Number, String],
      default: void 0
    },
    arrowOverflow: {
      type: Boolean,
      default: void 0
    },
    flip: {
      type: Boolean,
      default: void 0
    },
    shift: {
      type: Boolean,
      default: void 0
    },
    shiftCrossAxis: {
      type: Boolean,
      default: void 0
    },
    noAutoFocus: {
      type: Boolean,
      default: void 0
    },
    disposeTimeout: {
      type: Number,
      default: void 0
    }
  },
  emits: {
    show: () => true,
    hide: () => true,
    "update:shown": (e) => true,
    "apply-show": () => true,
    "apply-hide": () => true,
    "close-group": () => true,
    "close-directive": () => true,
    "auto-hide": () => true,
    resize: () => true
  },
  computed: {
    finalTheme() {
      return this.theme ?? this.$options.vPopperTheme;
    }
  },
  methods: {
    getTargetNodes() {
      return Array.from(this.$el.children).filter((e) => e !== this.$refs.popperContent.$el);
    }
  }
});
function wt(e, t5, o, i, s, r) {
  const p = resolveComponent("PopperContent"), a = resolveComponent("Popper");
  return openBlock(), createBlock(a, mergeProps({ ref: "popper" }, e.$props, {
    theme: e.finalTheme,
    "target-nodes": e.getTargetNodes,
    "popper-node": () => e.$refs.popperContent.$el,
    class: [
      e.themeClass
    ],
    onShow: t5[0] || (t5[0] = () => e.$emit("show")),
    onHide: t5[1] || (t5[1] = () => e.$emit("hide")),
    "onUpdate:shown": t5[2] || (t5[2] = (l) => e.$emit("update:shown", l)),
    onApplyShow: t5[3] || (t5[3] = () => e.$emit("apply-show")),
    onApplyHide: t5[4] || (t5[4] = () => e.$emit("apply-hide")),
    onCloseGroup: t5[5] || (t5[5] = () => e.$emit("close-group")),
    onCloseDirective: t5[6] || (t5[6] = () => e.$emit("close-directive")),
    onAutoHide: t5[7] || (t5[7] = () => e.$emit("auto-hide")),
    onResize: t5[8] || (t5[8] = () => e.$emit("resize"))
  }), {
    default: withCtx(({
      popperId: l,
      isShown: u,
      shouldMountContent: L,
      skipTransition: D2,
      autoHide: I,
      show: F,
      hide: v,
      handleResize: R,
      onResize: j,
      classes: V,
      result: Ee
    }) => [
      renderSlot(e.$slots, "default", {
        shown: u,
        show: F,
        hide: v
      }),
      createVNode(p, {
        ref: "popperContent",
        "popper-id": l,
        theme: e.finalTheme,
        shown: u,
        mounted: L,
        "skip-transition": D2,
        "auto-hide": I,
        "handle-resize": R,
        classes: V,
        result: Ee,
        onHide: v,
        onResize: j
      }, {
        default: withCtx(() => [
          renderSlot(e.$slots, "popper", {
            shown: u,
            hide: v
          })
        ]),
        _: 2
      }, 1032, ["popper-id", "theme", "shown", "mounted", "skip-transition", "auto-hide", "handle-resize", "classes", "result", "onHide", "onResize"])
    ]),
    _: 3
  }, 16, ["theme", "target-nodes", "popper-node", "class"]);
}
const k = /* @__PURE__ */ B(gt, [["render", wt]]), Se = {
  ...k,
  name: "VDropdown",
  vPopperTheme: "dropdown"
};
({
  ...k
});
({
  ...k
});
defineComponent({
  name: "VTooltipDirective",
  components: {
    Popper: Q(),
    PopperContent: ee
  },
  mixins: [
    te
  ],
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: "tooltip"
    },
    html: {
      type: Boolean,
      default: (e) => S(e.theme, "html")
    },
    content: {
      type: [String, Number, Function],
      default: null
    },
    loadingContent: {
      type: String,
      default: (e) => S(e.theme, "loadingContent")
    },
    targetNodes: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      asyncContent: null
    };
  },
  computed: {
    isContentAsync() {
      return typeof this.content == "function";
    },
    loading() {
      return this.isContentAsync && this.asyncContent == null;
    },
    finalContent() {
      return this.isContentAsync ? this.loading ? this.loadingContent : this.asyncContent : this.content;
    }
  },
  watch: {
    content: {
      handler() {
        this.fetchContent(true);
      },
      immediate: true
    },
    async finalContent() {
      await this.$nextTick(), this.$refs.popper.onResize();
    }
  },
  created() {
    this.$_fetchId = 0;
  },
  methods: {
    fetchContent(e) {
      if (typeof this.content == "function" && this.$_isShown && (e || !this.$_loading && this.asyncContent == null)) {
        this.asyncContent = null, this.$_loading = true;
        const t5 = ++this.$_fetchId, o = this.content(this);
        o.then ? o.then((i) => this.onResult(t5, i)) : this.onResult(t5, o);
      }
    },
    onResult(e, t5) {
      e === this.$_fetchId && (this.$_loading = false, this.asyncContent = t5);
    },
    onShow() {
      this.$_isShown = true, this.fetchContent();
    },
    onHide() {
      this.$_isShown = false;
    }
  }
});
const Ht = h, kt = Se;
const logger = getLoggerBuilder().detectUser().setApp("@nextcloud/vue").build();
const isRtl = isRTL();
const _sfc_main$1$b = defineComponent({
  name: "NcPopoverTriggerProvider",
  provide() {
    return {
      "NcPopover:trigger:shown": () => this.shown,
      "NcPopover:trigger:attrs": () => this.triggerAttrs
    };
  },
  props: {
    /**
     * Is the popover currently shown
     */
    shown: {
      type: Boolean,
      required: true
    },
    /**
     * ARIA Role of the popup
     */
    popupRole: {
      type: String,
      default: void 0
    }
  },
  computed: {
    triggerAttrs() {
      return {
        "aria-haspopup": this.popupRole,
        "aria-expanded": this.shown.toString()
      };
    }
  },
  render() {
    return this.$slots.default?.({
      attrs: this.triggerAttrs
    });
  }
});
const ncPopover = "_ncPopover_zfWgY";
const style0$5 = {
  "material-design-icon": "_material-design-icon_bkeq-",
  ncPopover
};
const theme = "nc-popover-9";
Ht.themes[theme] = structuredClone(Ht.themes.dropdown);
const _sfc_main$L = {
  name: "NcPopover",
  components: {
    Dropdown: kt,
    NcPopoverTriggerProvider: _sfc_main$1$b
  },
  props: {
    /**
     * Element to use for calculating the popper boundary (size and position).
     * Either a query string or the actual HTMLElement.
     */
    boundary: {
      type: [String, Object],
      default: ""
    },
    /**
     * Automatically hide the popover on click outside.
     *
     * @deprecated Use `no-close-on-click-outside` instead (inverted value)
     */
    closeOnClickOutside: {
      type: Boolean,
      // eslint-disable-next-line vue/no-boolean-default
      default: true
    },
    /**
     * Disable the automatic popover hide on click outside.
     */
    noCloseOnClickOutside: {
      type: Boolean,
      default: false
    },
    /**
     * Container where to mount the popover.
     * Either a select query or `false` to mount to the parent node.
     */
    container: {
      type: [Boolean, String],
      default: "body"
    },
    /**
     * Delay for showing or hiding the popover.
     *
     * Can either be a number or an object to configure different delays (`{ show: number, hide: number }`).
     */
    delay: {
      type: [Number, Object],
      default: 0
    },
    /**
     * Disable the popover focus trap.
     */
    noFocusTrap: {
      type: Boolean,
      default: false
    },
    /**
     * Where to place the popover.
     *
     * This consists of the vertical placement and the horizontal placement.
     * E.g. `bottom` will place the popover on the bottom of the trigger (horizontally centered),
     * while `buttom-start` will horizontally align the popover on the logical start (e.g. for LTR layout on the left.).
     * The `start` or `end` placement will align the popover on the left or right side or the trigger element.
     *
     * @type {'auto'|'auto-start'|'auto-end'|'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'start'|'end'}
     */
    placement: {
      type: String,
      default: "bottom"
    },
    /**
     * Class to be applied to the popover base
     */
    popoverBaseClass: {
      type: String,
      default: ""
    },
    /**
     * Events that trigger the popover on the popover container itself.
     * This is useful if you set `triggers` to `hover` and also want the popover to stay open while hovering the popover itself.
     *
     * It is possible to also pass an object to define different triggers for hide and show `{ show: ['hover'], hide: ['click'] }`.
     */
    popoverTriggers: {
      type: [Array, Object],
      default: null
    },
    /**
     * Popup role
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup#values
     */
    popupRole: {
      type: String,
      default: void 0,
      validator: (value) => ["menu", "listbox", "tree", "grid", "dialog", "true"].includes(value)
    },
    /**
     * Set element to return focus to after focus trap deactivation
     *
     * @type {SetReturnFocus}
     */
    setReturnFocus: {
      default: void 0,
      type: [Boolean, HTMLElement, SVGElement, String, Function]
    },
    /**
     * Show or hide the popper
     */
    shown: {
      type: Boolean,
      default: false
    },
    /**
     * Events that trigger the popover.
     *
     * If you pass an empty array then only the `shown` prop can control the popover state.
     * Following events are available:
     * - `'hover'`
     * - `'click'`
     * - `'focus'`
     * - `'touch'`
     *
     * It is also possible to pass an object to have different events for show and hide:
     * `{ hide: ['click'], show: ['click', 'hover'] }`
     */
    triggers: {
      type: [Array, Object],
      default: () => ["click"]
    }
  },
  emits: [
    "afterShow",
    "afterHide",
    "update:shown"
  ],
  setup() {
    return {
      theme
    };
  },
  data() {
    return {
      internalShown: this.shown
    };
  },
  computed: {
    popperTriggers() {
      if (this.popoverTriggers && Array.isArray(this.popoverTriggers)) {
        return this.popoverTriggers;
      }
      return void 0;
    },
    popperHideTriggers() {
      if (this.popoverTriggers && typeof this.popoverTriggers === "object") {
        return this.popoverTriggers.hide;
      }
      return void 0;
    },
    popperShowTriggers() {
      if (this.popoverTriggers && typeof this.popoverTriggers === "object") {
        return this.popoverTriggers.show;
      }
      return void 0;
    },
    internalTriggers() {
      if (this.triggers && Array.isArray(this.triggers)) {
        return this.triggers;
      }
      return void 0;
    },
    hideTriggers() {
      if (this.triggers && typeof this.triggers === "object") {
        return this.triggers.hide;
      }
      return void 0;
    },
    showTriggers() {
      if (this.triggers && typeof this.triggers === "object") {
        return this.triggers.show;
      }
      return void 0;
    },
    internalPlacement() {
      if (this.placement === "start") {
        return isRtl ? "right" : "left";
      } else if (this.placement === "end") {
        return isRtl ? "left" : "right";
      }
      return this.placement;
    }
  },
  watch: {
    shown(value) {
      this.internalShown = value;
    },
    internalShown(value) {
      this.$emit("update:shown", value);
    }
  },
  mounted() {
    this.checkTriggerA11y();
  },
  beforeUnmount() {
    this.clearFocusTrap();
    this.clearEscapeStopPropagation();
  },
  methods: {
    /**
     * Check if the trigger has all required a11y attributes.
     * Important to check custom trigger button.
     */
    checkTriggerA11y() {
      if (window.OC?.debug) {
        const triggerContainer = this.getPopoverTriggerContainerElement();
        triggerContainer.querySelector("[aria-expanded]");
      }
    },
    /**
     * Remove incorrect aria-describedby attribute from the trigger.
     *
     * @see https://github.com/Akryum/floating-vue/blob/8d4f7125aae0e3ea00ba4093d6d2001ab15058f1/packages/floating-vue/src/components/Popper.ts#L734
     */
    removeFloatingVueAriaDescribedBy() {
      const triggerContainer = this.getPopoverTriggerContainerElement();
      const triggerElements = triggerContainer.querySelectorAll("[data-popper-shown]");
      for (const el of triggerElements) {
        el.removeAttribute("aria-describedby");
      }
    },
    /**
     * @return {HTMLElement|undefined}
     */
    getPopoverContentElement() {
      return this.$refs.popover?.$refs.popperContent?.$el;
    },
    /**
     * @return {HTMLElement|undefined}
     */
    getPopoverTriggerContainerElement() {
      return this.$refs.popover?.$refs.popper?.$refs.reference;
    },
    /**
     * Add focus trap for accessibility.
     */
    async useFocusTrap() {
      await this.$nextTick();
      if (this.noFocusTrap) {
        return;
      }
      const el = this.getPopoverContentElement();
      el.tabIndex = -1;
      if (!el) {
        return;
      }
      this.$focusTrap = createFocusTrap(el, {
        // Prevents to lose focus using esc key
        // Focus will be release when popover be hide
        escapeDeactivates: false,
        allowOutsideClick: true,
        setReturnFocus: this.setReturnFocus,
        trapStack: getTrapStack(),
        fallBackFocus: el
      });
      this.$focusTrap.activate();
    },
    /**
     * Remove focus trap
     *
     * @param {object} options The configuration options for focusTrap
     */
    clearFocusTrap(options2 = {}) {
      try {
        this.$focusTrap?.deactivate(options2);
        this.$focusTrap = null;
      } catch (error) {
        logger.warn("[NcPopover] Failed to clear focus trap", { error });
      }
    },
    /**
     * Add stopPropagation for Escape.
     * It prevents global Escape handling after closing popover.
     *
     * Manual event handling is used here instead of v-on because there is no direct access to the node.
     * Alternative - wrap <template #popover> in a div wrapper.
     */
    addEscapeStopPropagation() {
      const el = this.getPopoverContentElement();
      el?.addEventListener("keydown", this.stopKeydownEscapeHandler);
    },
    /**
     * Remove stop Escape handler
     */
    clearEscapeStopPropagation() {
      const el = this.getPopoverContentElement();
      el?.removeEventListener("keydown", this.stopKeydownEscapeHandler);
    },
    /**
     * @param {KeyboardEvent} event - native keydown event
     */
    stopKeydownEscapeHandler(event) {
      if (event.type === "keydown" && event.key === "Escape") {
        event.stopPropagation();
      }
    },
    async afterShow() {
      this.getPopoverContentElement().addEventListener("transitionend", () => {
        this.$emit("afterShow");
      }, { once: true, passive: true });
      this.removeFloatingVueAriaDescribedBy();
      await this.$nextTick();
      await this.useFocusTrap();
      this.addEscapeStopPropagation();
    },
    afterHide() {
      this.getPopoverContentElement()?.addEventListener("transitionend", () => {
        this.$emit("afterHide");
      }, { once: true, passive: true });
      this.clearFocusTrap();
      this.clearEscapeStopPropagation();
    }
  }
};
function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcPopoverTriggerProvider = resolveComponent("NcPopoverTriggerProvider");
  const _component_Dropdown = resolveComponent("Dropdown");
  return openBlock(), createBlock(_component_Dropdown, {
    ref: "popover",
    shown: $data.internalShown,
    "onUpdate:shown": [
      _cache[0] || (_cache[0] = ($event) => $data.internalShown = $event),
      _cache[1] || (_cache[1] = ($event) => $data.internalShown = $event)
    ],
    arrowPadding: 10,
    autoHide: !$props.noCloseOnClickOutside && $props.closeOnClickOutside,
    boundary: $props.boundary || void 0,
    container: $props.container,
    delay: $props.delay,
    distance: 10,
    handleResize: "",
    noAutoFocus: true,
    placement: $options.internalPlacement,
    popperClass: [_ctx.$style.ncPopover, $props.popoverBaseClass],
    popperTriggers: $options.popperTriggers,
    popperHideTriggers: $options.popperHideTriggers,
    popperShowTriggers: $options.popperShowTriggers,
    theme: $setup.theme,
    triggers: $options.internalTriggers,
    hideTriggers: $options.hideTriggers,
    showTriggers: $options.showTriggers,
    onApplyShow: $options.afterShow,
    onApplyHide: $options.afterHide
  }, {
    popper: withCtx((slotProps) => [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)))
    ]),
    default: withCtx(() => [
      createVNode(_component_NcPopoverTriggerProvider, {
        shown: $data.internalShown,
        popupRole: $props.popupRole
      }, {
        default: withCtx((slotProps) => [
          renderSlot(_ctx.$slots, "trigger", normalizeProps(guardReactiveProps(slotProps)))
        ]),
        _: 3
      }, 8, ["shown", "popupRole"])
    ]),
    _: 3
  }, 8, ["shown", "autoHide", "boundary", "container", "delay", "placement", "popperClass", "popperTriggers", "popperHideTriggers", "popperShowTriggers", "theme", "triggers", "hideTriggers", "showTriggers", "onApplyShow", "onApplyHide"]);
}
const cssModules$5 = {
  "$style": style0$5
};
const NcPopover = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$n], ["__cssModules", cssModules$5]]);
const NC_ACTIONS_IS_SEMANTIC_MENU = /* @__PURE__ */ Symbol.for("NcActions:isSemanticMenu");
const NC_ACTIONS_CLOSE_MENU = /* @__PURE__ */ Symbol.for("NcActions:closeMenu");
const _sfc_main$1$a = {
  name: "DotsHorizontalIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$D = ["aria-hidden", "aria-label"];
const _hoisted_2$u = ["fill", "width", "height"];
const _hoisted_3$q = { d: "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" };
const _hoisted_4$n = { key: 0 };
function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon dots-horizontal-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$q, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$n, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$u))
  ], 16, _hoisted_1$D);
}
const IconDotsHorizontal = /* @__PURE__ */ _export_sfc(_sfc_main$1$a, [["render", _sfc_render$m]]);
register(t4);
function isSlotPopulated(vnodes) {
  return Array.isArray(vnodes) && vnodes.some((node) => {
    if (node === null) {
      return false;
    } else if (typeof node === "object") {
      const vnode = node;
      if (vnode.type === Comment) {
        return false;
      } else if (vnode.type === Fragment && !isSlotPopulated(vnode.children)) {
        return false;
      } else if (vnode.type === Text && !vnode.children.trim()) {
        return false;
      }
    }
    return true;
  });
}
const focusableSelector = ".focusable";
const _sfc_main$K = {
  name: "NcActions",
  components: {
    NcButton,
    NcPopover
  },
  provide() {
    return {
      /**
       * NcActions can be used as:
       * - Application menu (has menu role)
       * - Navigation (has no specific role, should be used an element with navigation role)
       * - Popover with plain text or text inputs (has no specific role)
       * Depending on the usage (used items), the menu and its items should have different roles for a11y.
       * Provide the role for NcAction* components in the NcActions content.
       *
       * @type {import('vue').ComputedRef<boolean>}
       */
      [NC_ACTIONS_IS_SEMANTIC_MENU]: computed(() => this.actionsMenuSemanticType === "menu"),
      [NC_ACTIONS_CLOSE_MENU]: this.closeMenu
    };
  },
  props: {
    /**
     * Specify the open state of the popover menu
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * This disables the internal open management,
     * so the actions menu only respects the `open` prop.
     * This is e.g. necessary for the NcAvatar component
     * to only open the actions menu after loading it's entries has finished.
     */
    manualOpen: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Force the name to show for single actions
     */
    forceName: {
      type: Boolean,
      default: false
    },
    /**
     * Specify the menu name
     */
    menuName: {
      type: String,
      default: null
    },
    /**
     * Apply primary styling for this menu
     */
    primary: {
      type: Boolean,
      default: false
    },
    /**
     * Icon to show for the toggle menu button
     * when more than one action is inside the actions component.
     * Only replace the default three-dot icon if really necessary.
     */
    defaultIcon: {
      type: String,
      default: ""
    },
    /**
     * Aria label for the actions menu.
     *
     * If `menuName` is defined this will not be used to prevent
     * any accessible name conflicts. This ensures that the
     * element can be activated via voice input.
     */
    ariaLabel: {
      type: String,
      default: t("Actions")
    },
    /**
     * Wanted direction of the menu
     */
    placement: {
      type: String,
      default: "bottom"
    },
    /**
     * DOM element for the actions' popover boundaries
     */
    boundariesElement: {
      type: Element,
      default: () => document.getElementById("content-vue") ?? document.querySelector("body")
    },
    /**
     * Selector for the actions' popover container
     */
    container: {
      type: [Boolean, String, Object, Element],
      default: "body"
    },
    /**
     * Disabled state of the main button (single action or menu toggle)
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Display x items inline out of the dropdown menu
     * Will be ignored if `forceMenu` is set
     */
    inline: {
      type: Number,
      default: 0
    },
    /**
     * Specifies the button variant used for trigger and single actions buttons.
     *
     * If left empty, the default button style will be applied.
     *
     * @since 8.23.0
     */
    variant: {
      type: String,
      validator(value) {
        return ["primary", "secondary", "tertiary", "tertiary-no-background", "tertiary-on-primary", "error", "warning", "success"].includes(value);
      },
      default: null
    },
    /**
     * Specifies whether the button should span all the available width.
     */
    wide: {
      type: Boolean,
      default: false
    },
    /**
     * Specify the size used for trigger and single actions buttons.
     *
     * If left empty, the default button size will be applied.
     */
    size: {
      type: String,
      default: "normal",
      validator(value) {
        return ["small", "normal", "large"].includes(value);
      }
    }
  },
  emits: [
    "click",
    "blur",
    "focus",
    "close",
    "closed",
    "open",
    "opened",
    "update:open"
  ],
  setup() {
    const randomId = createElementId();
    return {
      randomId
    };
  },
  data() {
    return {
      opened: this.open,
      focusIndex: 0,
      /**
       * @type {'menu'|'navigation'|'dialog'|'tooltip'|'unknown'}
       */
      actionsMenuSemanticType: "unknown"
    };
  },
  computed: {
    triggerButtonVariant() {
      return this.variant || (this.primary ? "primary" : this.menuName ? "secondary" : "tertiary");
    },
    /**
     * A11y roles and keyboard navigation configuration depending on the semantic type
     */
    config() {
      const configs = {
        menu: {
          popupRole: "menu",
          withArrowNavigation: true,
          withTabNavigation: false,
          withFocusTrap: false
        },
        navigation: {
          popupRole: void 0,
          withArrowNavigation: false,
          withTabNavigation: true,
          withFocusTrap: false
        },
        dialog: {
          popupRole: "dialog",
          withArrowNavigation: false,
          withTabNavigation: true,
          withFocusTrap: true
        },
        tooltip: {
          popupRole: void 0,
          withArrowNavigation: false,
          withTabNavigation: false,
          withFocusTrap: false
        },
        // Due to Vue limitations, we sometimes cannot determine the true type
        // As a fallback use both arrow navigation and focus trap
        unknown: {
          popupRole: void 0,
          role: void 0,
          withArrowNavigation: true,
          withTabNavigation: false,
          withFocusTrap: true
        }
      };
      return configs[this.actionsMenuSemanticType];
    },
    withFocusTrap() {
      return this.config.withFocusTrap;
    }
  },
  watch: {
    // Watch parent prop
    open(state) {
      if (state === this.opened) {
        return;
      }
      this.opened = state;
    },
    opened() {
      if (this.opened) {
        document.body.addEventListener("keydown", this.handleEscapePressed);
      } else {
        document.body.removeEventListener("keydown", this.handleEscapePressed);
      }
    }
  },
  created() {
    useTrapStackControl(() => this.opened, {
      disabled: () => this.config.withFocusTrap
    });
    if ("ariaHidden" in this.$attrs) ;
  },
  methods: {
    /**
     * Get the name of the action component
     *
     * @param {import('vue').VNode} action - a vnode with a NcAction* component instance
     * @return {string} the name of the action component
     */
    getActionName(action) {
      return action?.type?.name;
    },
    /**
     * Do we have exactly one Action and
     * is it allowed as a standalone element?
     *
     * @param {import('vue').VNode} action The action to check
     * @return {boolean}
     */
    isValidSingleAction(action) {
      return ["NcActionButton", "NcActionLink", "NcActionRouter"].includes(this.getActionName(action));
    },
    isAction(action) {
      return this.getActionName(action)?.startsWith?.("NcAction");
    },
    /**
     * Check whether a icon prop value is an URL or not
     *
     * @param {string} url The icon prop value
     */
    isIconUrl(url) {
      try {
        return !!new URL(url, url.startsWith("/") ? window.location.origin : void 0);
      } catch {
        return false;
      }
    },
    // MENU STATE MANAGEMENT
    toggleMenu(state) {
      if (state) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },
    openMenu() {
      if (this.opened) {
        return;
      }
      this.opened = true;
      this.$emit("update:open", true);
      this.$emit("open");
    },
    async closeMenu(returnFocus = true) {
      if (!this.opened) {
        return;
      }
      await this.$nextTick();
      this.opened = false;
      this.$refs.popover?.clearFocusTrap({ returnFocus });
      this.$emit("update:open", false);
      this.$emit("close");
      this.focusIndex = 0;
      if (returnFocus) {
        this.$refs.triggerButton?.$el.focus();
      }
    },
    /**
     * Called when popover is shown after the show delay
     */
    onOpened() {
      this.$nextTick(() => {
        this.focusFirstAction(null);
        this.$emit("opened");
      });
    },
    onClosed() {
      this.$emit("closed");
    },
    // MENU KEYS & FOCUS MANAGEMENT
    /**
     * @return {HTMLElement|null}
     */
    getCurrentActiveMenuItemElement() {
      return this.$refs.menu.querySelector("li.active");
    },
    /**
     * @return {NodeList<HTMLElement>}
     */
    getFocusableMenuItemElements() {
      return this.$refs.menu.querySelectorAll(focusableSelector);
    },
    /**
     * Dispatches the keydown listener to different handlers
     *
     * @param {object} event The keydown event
     */
    onKeydown(event) {
      if (event.key === "Tab") {
        if (this.config.withFocusTrap) {
          return;
        }
        if (!this.config.withTabNavigation) {
          this.closeMenu(true);
          return;
        }
        event.preventDefault();
        const focusList = this.getFocusableMenuItemElements();
        const focusIndex = [...focusList].indexOf(document.activeElement);
        if (focusIndex === -1) {
          return;
        }
        const newFocusIndex = event.shiftKey ? focusIndex - 1 : focusIndex + 1;
        if (newFocusIndex < 0 || newFocusIndex === focusList.length) {
          this.closeMenu(true);
        }
        this.focusIndex = newFocusIndex;
        this.focusAction();
        return;
      }
      if (this.config.withArrowNavigation) {
        if (event.key === "ArrowUp") {
          this.focusPreviousAction(event);
        }
        if (event.key === "ArrowDown") {
          this.focusNextAction(event);
        }
        if (event.key === "PageUp") {
          this.focusFirstAction(event);
        }
        if (event.key === "PageDown") {
          this.focusLastAction(event);
        }
      }
      this.handleEscapePressed(event);
    },
    onTriggerKeydown(event) {
      if (event.key === "Escape") {
        if (this.actionsMenuSemanticType === "tooltip") {
          this.closeMenu();
        }
      }
    },
    handleEscapePressed(event) {
      if (event.key === "Escape") {
        this.closeMenu();
        event.preventDefault();
      }
    },
    removeCurrentActive() {
      const currentActiveElement = this.$refs.menu.querySelector("li.active");
      if (currentActiveElement) {
        currentActiveElement.classList.remove("active");
      }
    },
    focusAction() {
      const focusElement = this.getFocusableMenuItemElements()[this.focusIndex];
      if (focusElement) {
        this.removeCurrentActive();
        const liMenuParent = focusElement.closest("li.action");
        focusElement.focus();
        if (liMenuParent) {
          liMenuParent.classList.add("active");
        }
      }
    },
    focusPreviousAction(event) {
      if (this.opened) {
        if (this.focusIndex === 0) {
          this.focusLastAction(event);
        } else {
          this.preventIfEvent(event);
          this.focusIndex = this.focusIndex - 1;
        }
        this.focusAction();
      }
    },
    focusNextAction(event) {
      if (this.opened) {
        const indexLength = this.getFocusableMenuItemElements().length - 1;
        if (this.focusIndex === indexLength) {
          this.focusFirstAction(event);
        } else {
          this.preventIfEvent(event);
          this.focusIndex = this.focusIndex + 1;
        }
        this.focusAction();
      }
    },
    focusFirstAction(event) {
      if (this.opened) {
        this.preventIfEvent(event);
        const firstCheckedIndex = [...this.getFocusableMenuItemElements()].findIndex((button) => {
          return button.getAttribute("aria-checked") === "true" && button.getAttribute("role") === "menuitemradio";
        });
        this.focusIndex = firstCheckedIndex > -1 ? firstCheckedIndex : 0;
        this.focusAction();
      }
    },
    focusLastAction(event) {
      if (this.opened) {
        this.preventIfEvent(event);
        this.focusIndex = this.getFocusableMenuItemElements().length - 1;
        this.focusAction();
      }
    },
    preventIfEvent(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    onFocus(event) {
      this.$emit("focus", event);
    },
    onBlur(event) {
      this.$emit("blur", event);
      if (this.actionsMenuSemanticType === "tooltip") {
        if (this.$refs.menu && this.getFocusableMenuItemElements().length === 0) {
          this.closeMenu(false);
        }
      }
    },
    onClick(event) {
      this.$emit("click", event);
    }
  },
  /**
   * The render function to display the component
   *
   * @return {object|undefined} The created VNode
   */
  render() {
    const actions = [];
    const findActions = (vnodes, actions2) => {
      vnodes.forEach((vnode) => {
        if (this.isAction(vnode)) {
          actions2.push(vnode);
          return;
        }
        if (vnode.type === Fragment) {
          findActions(vnode.children, actions2);
        }
      });
    };
    findActions(this.$slots.default?.(), actions);
    if (actions.length === 0) {
      return;
    }
    let validInlineActions = actions.filter(this.isValidSingleAction);
    if (this.forceMenu && validInlineActions.length > 0 && this.inline > 0) {
      validInlineActions = [];
    }
    const inlineActions = validInlineActions.slice(0, this.inline);
    const menuActions = actions.filter((action) => !inlineActions.includes(action));
    const menuItemsActions = ["NcActionButton", "NcActionButtonGroup", "NcActionCheckbox", "NcActionRadio"];
    const textInputActions = ["NcActionInput", "NcActionTextEditable"];
    const linkActions = ["NcActionLink", "NcActionRouter"];
    const hasTextInputAction = menuActions.some((action) => textInputActions.includes(this.getActionName(action)));
    const hasMenuItemAction = menuActions.some((action) => menuItemsActions.includes(this.getActionName(action)));
    const hasLinkAction = menuActions.some((action) => linkActions.includes(this.getActionName(action)));
    if (hasTextInputAction) {
      this.actionsMenuSemanticType = "dialog";
    } else if (hasMenuItemAction) {
      this.actionsMenuSemanticType = "menu";
    } else if (hasLinkAction) {
      this.actionsMenuSemanticType = "navigation";
    } else {
      const ncActions = actions.filter((action) => this.getActionName(action).startsWith("NcAction"));
      if (ncActions.length === actions.length) {
        this.actionsMenuSemanticType = "tooltip";
      } else {
        this.actionsMenuSemanticType = "unknown";
      }
    }
    const renderInlineAction = (action) => {
      const iconProp = action?.props?.icon;
      const icon = action?.children?.icon?.()?.[0] ?? (this.isIconUrl(iconProp) ? h$1("img", { class: "action-item__menutoggle__icon", src: iconProp, alt: "" }) : h$1("span", { class: ["icon", iconProp] }));
      const text = action?.children?.default?.()?.[0]?.children?.trim();
      const buttonText = this.forceName ? text : "";
      let title = action?.props?.title;
      if (!(this.forceName || title)) {
        title = text;
      }
      const propsToForward = { ...action?.props ?? {} };
      const type = ["submit", "reset"].includes(propsToForward.type) ? propsToForward.modelValue : "button";
      delete propsToForward.modelValue;
      delete propsToForward.type;
      return h$1(
        NcButton,
        mergeProps(
          propsToForward,
          {
            class: [
              "action-item action-item--single",
              {
                "action-item--wide": this.wide
              }
            ],
            "aria-label": action?.props?.["aria-label"] || text,
            title,
            disabled: this.disabled || action?.props?.disabled,
            pressed: action?.props?.modelValue,
            size: this.size,
            type,
            wide: this.wide,
            // If it has a menuName, we use a secondary button
            variant: this.variant || (buttonText ? "secondary" : "tertiary"),
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            // forward any pressed state from NcButton just like NcActionButton does
            "onUpdate:pressed": action?.props?.["onUpdate:modelValue"] ?? (() => {
            })
          }
        ),
        {
          default: () => buttonText,
          icon: () => icon
        }
      );
    };
    const renderActionsPopover = (actions2) => {
      const triggerIcon = isSlotPopulated(this.$slots.icon?.()) ? this.$slots.icon?.() : this.defaultIcon ? h$1("span", { class: ["icon", this.defaultIcon] }) : h$1(IconDotsHorizontal, { size: 20 });
      const triggerRandomId = `${this.randomId}-trigger`;
      return h$1(
        NcPopover,
        {
          ref: "popover",
          delay: 0,
          shown: this.opened,
          placement: this.placement,
          boundary: this.boundariesElement,
          autoBoundaryMaxSize: true,
          container: this.container,
          ...this.manualOpen && {
            triggers: []
          },
          noCloseOnClickOutside: this.manualOpen,
          popoverBaseClass: "action-item__popper",
          popupRole: this.config.popupRole,
          setReturnFocus: this.config.withFocusTrap ? this.$refs.triggerButton?.$el : void 0,
          noFocusTrap: !this.config.withFocusTrap,
          "onUpdate:shown": this.toggleMenu,
          onAfterShow: this.onOpened,
          onAfterClose: this.onClosed
        },
        {
          trigger: () => h$1(NcButton, {
            id: triggerRandomId,
            class: "action-item__menutoggle",
            disabled: this.disabled,
            size: this.size,
            variant: this.triggerButtonVariant,
            wide: this.wide,
            ref: "triggerButton",
            "aria-label": this.menuName ? null : this.ariaLabel,
            // 'aria-controls' should only present together with a valid aria-haspopup
            "aria-controls": this.opened && this.config.popupRole ? this.randomId : null,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onClick: this.onClick,
            onKeydown: this.onTriggerKeydown
          }, {
            icon: () => triggerIcon,
            default: () => this.menuName
          }),
          default: () => h$1("div", {
            class: {
              open: this.opened
            },
            tabindex: "-1",
            onKeydown: this.onKeydown,
            ref: "menu"
          }, [
            h$1("ul", {
              id: this.randomId,
              tabindex: "-1",
              ref: "menuList",
              role: this.config.popupRole,
              // For most roles a label is required (dialog, menu), but also in general nothing speaks against labelling a list.
              // It is even recommended to do so.
              "aria-labelledby": triggerRandomId,
              "aria-modal": this.actionsMenuSemanticType === "dialog" ? "true" : void 0
            }, [
              actions2
            ])
          ])
        }
      );
    };
    if (actions.length === 1 && validInlineActions.length === 1 && !this.forceMenu) {
      return renderInlineAction(actions[0]);
    }
    this.$nextTick(() => {
      if (this.opened && this.$refs.menu) {
        const isAnyActive = this.$refs.menu.querySelector("li.active") || [];
        if (isAnyActive.length === 0) {
          this.focusFirstAction();
        }
      }
    });
    if (inlineActions.length > 0 && this.inline > 0) {
      return h$1(
        "div",
        {
          class: [
            "action-items",
            `action-item--${this.triggerButtonVariant}`
          ]
        },
        [
          // Render inline actions
          ...inlineActions.map(renderInlineAction),
          // render the rest within the popover menu
          menuActions.length > 0 ? h$1(
            "div",
            {
              class: [
                "action-item",
                {
                  "action-item--open": this.opened
                }
              ]
            },
            [renderActionsPopover(menuActions)]
          ) : null
        ]
      );
    }
    return h$1(
      "div",
      {
        class: [
          "action-item action-item--default-popover",
          `action-item--${this.triggerButtonVariant}`,
          {
            "action-item--open": this.opened,
            "action-item--wide": this.wide
          }
        ]
      },
      [
        renderActionsPopover(actions)
      ]
    );
  }
};
const NcActions = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["__scopeId", "data-v-23e5cae7"]]);
register(t2);
const FEW_SECONDS_AGO = {
  long: t("a few seconds ago"),
  short: t("seconds ago"),
  // FOR TRANSLATORS: Shorter version of 'a few seconds ago'
  narrow: t("sec. ago")
  // FOR TRANSLATORS: If possible in your language an even shorter version of 'a few seconds ago'
};
function useFormatRelativeTime(timestamp = Date.now(), opts = {}) {
  let timeoutId;
  const date = computed(() => new Date(toValue(timestamp)));
  const options = computed(() => {
    const { language, relativeTime: relativeTime2, ignoreSeconds } = toValue(opts);
    return {
      ...language && { language },
      ...relativeTime2 && { relativeTime: relativeTime2 },
      ignoreSeconds: ignoreSeconds ? FEW_SECONDS_AGO[relativeTime2 || "long"] : false
    };
  });
  const relativeTime = ref("");
  watchEffect(() => updateRelativeTime());
  function updateRelativeTime() {
    relativeTime.value = formatRelativeTime(date.value, options.value);
    if (toValue(opts).update !== false) {
      const diff = Math.abs(Date.now() - new Date(toValue(timestamp)).getTime());
      const interval = diff > 12e4 || options.value.ignoreSeconds ? Math.min(diff / 60, 18e5) : 1e3;
      timeoutId = window.setTimeout(updateRelativeTime, interval);
    }
  }
  onUnmounted(() => timeoutId && window.clearTimeout(timeoutId));
  return readonly(relativeTime);
}
function useFormatTime(timestamp, opts) {
  const options = computed(() => ({
    locale: getCanonicalLocale(),
    format: { dateStyle: "short", timeStyle: "medium" },
    ...toValue(opts)
  }));
  const formatter = computed(() => new Intl.DateTimeFormat(options.value.locale, options.value.format));
  return computed(() => formatter.value.format(toValue(timestamp)));
}
const isMac = /mac|ipad|iphone|darwin/i.test(navigator.userAgent);
const disableKeyboardShortcuts = window.OCP?.Accessibility?.disableKeyboardShortcuts?.();
const derivedKeysRegex = /^[a-zA-Z0-9]$/;
const nonAsciiPrintableRegex = /^[^\x20-\x7F]$/;
function shouldIgnoreEvent(event, options) {
  if (!(event.target instanceof HTMLElement) || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement || event.target.isContentEditable) {
    return true;
  }
  if (options.allowInModal) {
    return false;
  }
  return Array.from(document.getElementsByClassName("modal-mask")).filter((el) => el.checkVisibility()).length > 0;
}
function eventHandler(callback, options) {
  return (event) => {
    const ctrlKeyPressed = isMac ? event.metaKey : event.ctrlKey;
    if (ctrlKeyPressed !== Boolean(options.ctrl)) {
      return;
    } else if (event.altKey !== Boolean(options.alt)) {
      return;
    } else if (options.shift !== void 0 && event.shiftKey !== Boolean(options.shift)) {
      return;
    } else if (shouldIgnoreEvent(event, options)) {
      return;
    }
    if (options.prevent) {
      event.preventDefault();
    }
    if (options.stop) {
      event.stopPropagation();
    }
    callback(event);
  };
}
function useHotKey(keysOrFilter, callback = () => {
}, options = {}) {
  if (disableKeyboardShortcuts) {
    return () => {
    };
  }
  const validateKeyEvent = (event, key) => {
    if (event.key === key) {
      return true;
    }
    if (options.caseSensitive) {
      const isKeyInLowerCase = key === key.toLowerCase();
      const isEventKeyInLowerCase = event.key === event.key.toLowerCase();
      if (isKeyInLowerCase !== isEventKeyInLowerCase) {
        return false;
      }
    }
    if (derivedKeysRegex.test(key) && nonAsciiPrintableRegex.test(event.key)) {
      return event.code.replace(/^(?:Key|Digit|Numpad)/, "") === key.toUpperCase();
    }
    return event.key.toLowerCase() === key.toLowerCase();
  };
  const keyFilter = (event) => {
    if (typeof keysOrFilter === "function") {
      return keysOrFilter(event);
    } else if (typeof keysOrFilter === "string") {
      return validateKeyEvent(event, keysOrFilter);
    } else if (Array.isArray(keysOrFilter)) {
      return keysOrFilter.some((key) => validateKeyEvent(event, key));
    } else {
      return true;
    }
  };
  const stopKeyDown = onKeyStroke(keyFilter, eventHandler(callback, options), {
    eventName: "keydown",
    dedupe: true,
    passive: !options.prevent
  });
  const stopKeyUp = options.push ? onKeyStroke(keyFilter, eventHandler(callback, options), {
    eventName: "keyup",
    passive: !options.prevent
  }) : () => {
  };
  return () => {
    stopKeyDown();
    stopKeyUp();
  };
}
function checkIfDarkTheme(el = document.body) {
  const backgroundInvertIfDark = window.getComputedStyle(el).getPropertyValue("--background-invert-if-dark");
  if (backgroundInvertIfDark !== void 0) {
    return backgroundInvertIfDark === "invert(100%)";
  }
  return false;
}
checkIfDarkTheme();
const isFullscreen = ref(checkIfIsFullscreen());
window.addEventListener("resize", () => {
  isFullscreen.value = checkIfIsFullscreen();
});
function checkIfIsFullscreen() {
  return window.outerHeight === window.screen.height;
}
const MOBILE_BREAKPOINT = 1024;
const MOBILE_SMALL_BREAKPOINT = MOBILE_BREAKPOINT / 2;
const isLessThanBreakpoint = (breakpoint) => document.documentElement.clientWidth < breakpoint;
const isMobile = ref(isLessThanBreakpoint(MOBILE_BREAKPOINT));
const isSmallMobile = ref(isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT));
window.addEventListener("resize", () => {
  isMobile.value = isLessThanBreakpoint(MOBILE_BREAKPOINT);
  isSmallMobile.value = isLessThanBreakpoint(MOBILE_SMALL_BREAKPOINT);
}, { passive: true });
function useIsMobile() {
  return readonly(isMobile);
}
function useIsSmallMobile() {
  return readonly(isSmallMobile);
}
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
function getSameNodeParent(instance) {
  if (!instance.parent) {
    return null;
  }
  if ("vapor" in instance || "vapor" in instance.parent) {
    return null;
  }
  if (instance.parent.subTree !== instance.vnode) {
    return null;
  }
  return instance.parent;
}
function getSameNodeAncestors(instance) {
  const ancestors = [instance];
  let parent = getSameNodeParent(instance);
  while (parent) {
    ancestors.push(parent);
    parent = getSameNodeParent(parent);
  }
  return ancestors;
}
function useScopeIdAttrs() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error("useScopeId must be called within a setup context");
  }
  const sameNodeAncestors = getSameNodeAncestors(instance);
  const scopeIds = sameNodeAncestors.map((instance2) => instance2.vnode.scopeId).filter(Boolean);
  const scopeIdAttrs = Object.fromEntries(scopeIds.map((scopeId) => [scopeId, ""]));
  return scopeIdAttrs;
}
register(t19, t36);
const _hoisted_1$C = ["aria-labelledby", "aria-describedby"];
const _hoisted_2$t = ["data-theme-light", "data-theme-dark"];
const _hoisted_3$p = ["id"];
const _hoisted_4$m = { class: "icons-menu" };
const _hoisted_5$b = ["title"];
const _hoisted_6$9 = ["id"];
const _hoisted_7$6 = { class: "modal-container__content" };
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "NcModal",
  props: /* @__PURE__ */ mergeModels({
    name: { default: "" },
    hasPrevious: { type: Boolean },
    hasNext: { type: Boolean },
    outTransition: { type: Boolean },
    enableSlideshow: { type: Boolean },
    slideshowDelay: { default: 5e3 },
    slideshowPaused: { type: Boolean },
    disableSwipe: { type: Boolean },
    spreadNavigation: { type: Boolean },
    size: { default: "normal" },
    noClose: { type: Boolean },
    closeOnClickOutside: { type: Boolean },
    dark: { type: Boolean },
    lightBackdrop: { type: Boolean },
    container: { default: "body" },
    closeButtonOutside: { type: Boolean },
    additionalTrapElements: { default: () => [] },
    inlineActions: { default: 0 },
    labelId: { default: "" },
    setReturnFocus: { default: void 0 }
  }, {
    "show": { type: Boolean, ...{ default: true } },
    "showModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["next", "previous", "close", "update:show"], ["update:show"]),
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "v046d2bb2": numHeaderActions.value,
      "v71f7c020": cssSlideshowDelay.value
    }));
    const showModal = useModel(__props, "show");
    const props = __props;
    const emit2 = __emit;
    const scopeIdAttrs = useScopeIdAttrs();
    const modalId = createElementId();
    const maskElement = useTemplateRef("mask");
    let focusTrap;
    onUnmounted(() => clearFocusTrap());
    watch(() => props.additionalTrapElements, (elements) => {
      if (focusTrap) {
        focusTrap.updateContainerElements([maskElement.value, ...elements]);
      }
    });
    const {
      isActive: isPlaying,
      pause: stopSlideshow,
      resume: startSlideshow
    } = useIntervalFn(nextSlide, toRef(() => props.slideshowDelay), { immediate: false });
    const animationKey = ref(0);
    const runSlideshow = ref(false);
    watchEffect(() => {
      if (runSlideshow.value && !props.slideshowPaused) {
        startSlideshow();
      } else if (isPlaying.value) {
        stopSlideshow();
      }
    });
    const cssSlideshowDelay = computed(() => `${props.slideshowDelay}ms`);
    const { stop: stopSwipe } = useSwipe(maskElement, {
      onSwipeEnd: handleSwipe
    });
    onUnmounted(stopSwipe);
    useHotKey("Escape", () => {
      const trapStack = getTrapStack();
      if (trapStack.at(-1) === focusTrap) {
        close();
      }
    }, { allowInModal: true });
    useHotKey(["ArrowLeft", "ArrowRight"], (event) => {
      if (document.activeElement && !maskElement.value.contains(document.activeElement)) {
        return;
      }
      if (event.key === "ArrowLeft" !== isRtl) {
        previousSlide();
      } else {
        nextSlide();
      }
    }, { allowInModal: true });
    const slots = useSlots();
    const numHeaderActions = computed(() => {
      let actions = 0;
      if (props.hasNext && props.enableSlideshow) {
        actions++;
      }
      if (!props.noClose && props.closeButtonOutside) {
        actions++;
      }
      if (slots.actions) {
        actions++;
      }
      return actions;
    });
    onMounted(() => {
      if (!props.name && !props.labelId) ;
    });
    function nextSlide(event) {
      if (!props.hasNext) {
        runSlideshow.value = false;
        return;
      }
      if (event && isPlaying.value) {
        restartSlideshow();
      }
      emit2("next", event);
    }
    function previousSlide(event) {
      if (!props.hasPrevious) {
        return;
      }
      if (event && isPlaying.value) {
        restartSlideshow();
      }
      emit2("previous", event);
    }
    function handleSwipe(e, direction) {
      if (!props.disableSwipe) {
        if (direction !== "left" && direction !== "right") {
          return;
        }
        if (direction === "left" !== isRtl) {
          nextSlide(e);
        } else {
          previousSlide(e);
        }
      }
    }
    function restartSlideshow() {
      stopSlideshow();
      startSlideshow();
      animationKey.value++;
    }
    function close(event) {
      if (props.noClose) {
        return;
      }
      showModal.value = false;
      setTimeout(() => {
        emit2("close", event);
      }, 300);
    }
    function handleClickModalWrapper(event) {
      if (props.closeOnClickOutside) {
        close(event);
      }
    }
    async function useFocusTrap() {
      if (focusTrap) {
        return;
      }
      await nextTick();
      const options = {
        allowOutsideClick: true,
        fallbackFocus: maskElement.value,
        trapStack: getTrapStack(),
        // Esc can be used without stop in content or additionalTrapElements where it should not deactivate modal's focus trap.
        // Focus trap is deactivated on modal close anyway.
        escapeDeactivates: false,
        setReturnFocus: props.setReturnFocus
      };
      focusTrap = createFocusTrap([maskElement.value, ...props.additionalTrapElements], options);
      focusTrap.activate();
    }
    function clearFocusTrap() {
      if (!focusTrap) {
        return;
      }
      focusTrap?.deactivate();
      focusTrap = void 0;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        disabled: __props.container === null,
        to: __props.container
      }, [
        createVNode(Transition, {
          name: "fade",
          appear: "",
          onAfterEnter: useFocusTrap,
          onBeforeLeave: clearFocusTrap
        }, {
          default: withCtx(() => [
            withDirectives(createBaseVNode("div", mergeProps({ ..._ctx.$attrs, ...unref(scopeIdAttrs) }, {
              ref: "mask",
              class: ["modal-mask", {
                "modal-mask--opaque": __props.dark || __props.closeButtonOutside || __props.hasPrevious || __props.hasNext,
                "modal-mask--light": __props.lightBackdrop
              }],
              role: "dialog",
              "aria-modal": "true",
              "aria-labelledby": __props.labelId || `modal-name-${unref(modalId)}`,
              "aria-describedby": "modal-description-" + unref(modalId),
              tabindex: "-1"
            }), [
              createVNode(Transition, {
                name: "fade-visibility",
                appear: ""
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: "modal-header",
                    "data-theme-light": __props.lightBackdrop,
                    "data-theme-dark": !__props.lightBackdrop
                  }, [
                    __props.name.trim() !== "" ? (openBlock(), createElementBlock("h2", {
                      key: 0,
                      id: "modal-name-" + unref(modalId),
                      class: "modal-header__name"
                    }, toDisplayString(__props.name), 9, _hoisted_3$p)) : createCommentVNode("", true),
                    createBaseVNode("div", _hoisted_4$m, [
                      __props.hasNext && __props.enableSlideshow ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: normalizeClass(["play-pause-icons", { "play-pause-icons--paused": __props.slideshowPaused }]),
                        title: unref(isPlaying) ? unref(t)("Pause slideshow") : unref(t)("Start slideshow"),
                        type: "button",
                        onClick: _cache[0] || (_cache[0] = ($event) => runSlideshow.value = !runSlideshow.value)
                      }, [
                        createVNode(NcIconSvgWrapper, {
                          class: "play-pause-icons__icon",
                          inline: "",
                          name: unref(isPlaying) ? unref(t)("Pause slideshow") : unref(t)("Start slideshow"),
                          path: unref(isPlaying) ? unref(mdiPause) : unref(mdiPlay)
                        }, null, 8, ["name", "path"]),
                        unref(isPlaying) ? (openBlock(), createElementBlock("svg", {
                          key: `${unref(modalId)}-animation-${animationKey.value}`,
                          class: "progress-ring",
                          height: "50",
                          width: "50"
                        }, [..._cache[1] || (_cache[1] = [
                          createBaseVNode("circle", {
                            class: "progress-ring__circle",
                            stroke: "white",
                            "stroke-width": "2",
                            fill: "transparent",
                            r: "15",
                            cx: "25",
                            cy: "25"
                          }, null, -1)
                        ])])) : createCommentVNode("", true)
                      ], 10, _hoisted_5$b)) : createCommentVNode("", true),
                      createVNode(NcActions, {
                        class: "header-actions",
                        inline: __props.inlineActions
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "actions", {}, void 0, true)
                        ]),
                        _: 3
                      }, 8, ["inline"]),
                      !__props.noClose && __props.closeButtonOutside ? (openBlock(), createBlock(NcButton, {
                        key: 1,
                        "aria-label": unref(t)("Close"),
                        class: "header-close",
                        variant: "tertiary",
                        onClick: close
                      }, {
                        icon: withCtx(() => [
                          createVNode(NcIconSvgWrapper, { path: unref(mdiClose) }, null, 8, ["path"])
                        ]),
                        _: 1
                      }, 8, ["aria-label"])) : createCommentVNode("", true)
                    ])
                  ], 8, _hoisted_2$t)
                ]),
                _: 3
              }),
              createVNode(Transition, {
                name: `modal-${__props.outTransition ? "out" : "in"}`,
                appear: ""
              }, {
                default: withCtx(() => [
                  withDirectives(createBaseVNode("div", {
                    class: normalizeClass(["modal-wrapper", [
                      `modal-wrapper--${__props.size}`,
                      { "modal-wrapper--spread-navigation": __props.spreadNavigation }
                    ]]),
                    onMousedown: withModifiers(handleClickModalWrapper, ["self"])
                  }, [
                    createVNode(Transition, {
                      name: "fade-visibility",
                      appear: ""
                    }, {
                      default: withCtx(() => [
                        withDirectives(createVNode(NcButton, {
                          "aria-label": unref(t)("Previous"),
                          class: "prev",
                          variant: "tertiary-no-background",
                          onClick: previousSlide
                        }, {
                          icon: withCtx(() => [
                            createVNode(NcIconSvgWrapper, {
                              directional: "",
                              path: unref(mdiChevronLeft),
                              size: 40
                            }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label"]), [
                          [vShow, __props.hasPrevious]
                        ])
                      ]),
                      _: 1
                    }),
                    createBaseVNode("div", {
                      id: "modal-description-" + unref(modalId),
                      class: "modal-container"
                    }, [
                      createBaseVNode("div", _hoisted_7$6, [
                        renderSlot(_ctx.$slots, "default", {}, void 0, true)
                      ]),
                      !__props.noClose && !__props.closeButtonOutside ? (openBlock(), createBlock(NcButton, {
                        key: 0,
                        "aria-label": unref(t)("Close"),
                        class: "modal-container__close",
                        variant: "tertiary",
                        onClick: close
                      }, {
                        icon: withCtx(() => [
                          createVNode(NcIconSvgWrapper, { path: unref(mdiClose) }, null, 8, ["path"])
                        ]),
                        _: 1
                      }, 8, ["aria-label"])) : createCommentVNode("", true)
                    ], 8, _hoisted_6$9),
                    createVNode(Transition, {
                      name: "fade-visibility",
                      appear: ""
                    }, {
                      default: withCtx(() => [
                        withDirectives(createVNode(NcButton, {
                          "aria-label": unref(t)("Next"),
                          class: "next",
                          variant: "tertiary-no-background",
                          onClick: nextSlide
                        }, {
                          icon: withCtx(() => [
                            createVNode(NcIconSvgWrapper, {
                              directional: "",
                              path: unref(mdiChevronRight),
                              size: 40
                            }, null, 8, ["path"])
                          ]),
                          _: 1
                        }, 8, ["aria-label"]), [
                          [vShow, __props.hasNext]
                        ])
                      ]),
                      _: 1
                    })
                  ], 34), [
                    [vShow, showModal.value]
                  ])
                ]),
                _: 3
              }, 8, ["name"])
            ], 16, _hoisted_1$C), [
              [vShow, showModal.value]
            ])
          ]),
          _: 3
        })
      ], 8, ["disabled", "to"]);
    };
  }
});
const NcModal = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["__scopeId", "data-v-3c357e2d"]]);
const _hoisted_1$B = ["id", "textContent"];
const _hoisted_2$s = ["aria-label", "aria-labelledby"];
const _hoisted_3$o = { class: "dialog__text" };
const _hoisted_4$l = { class: "dialog__actions" };
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "NcDialog",
  props: /* @__PURE__ */ mergeModels({
    name: {},
    message: { default: "" },
    additionalTrapElements: { default: () => [] },
    container: { default: "body" },
    size: { default: "small" },
    buttons: { default: () => [] },
    isForm: { type: Boolean },
    noClose: { type: Boolean },
    closeOnClickOutside: { type: Boolean },
    outTransition: { type: Boolean },
    navigationAriaLabel: { default: "" },
    navigationAriaLabelledby: { default: "" },
    contentClasses: { default: "" },
    dialogClasses: { default: "" },
    navigationClasses: { default: "" }
  }, {
    "open": { type: Boolean, ...{ default: true } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["closing", "reset", "submit"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const open = useModel(__props, "open");
    const props = __props;
    const emit2 = __emit;
    const slots = useSlots();
    const wrapperElement = useTemplateRef("wrapper");
    const { width: dialogWidth } = useElementSize(wrapperElement, { width: 900, height: 0 });
    const isNavigationCollapsed = computed(() => dialogWidth.value < 876);
    const hasNavigation = computed(() => slots?.navigation !== void 0);
    const navigationId = createElementId();
    const navigationAriaLabelAttr = computed(() => props.navigationAriaLabel || void 0);
    const navigationAriaLabelledbyAttr = computed(() => {
      if (props.navigationAriaLabel) {
        return void 0;
      }
      return props.navigationAriaLabelledby || navigationId;
    });
    const dialogRootElement = useTemplateRef("dialogElement");
    const dialogTagName = computed(() => props.isForm && !hasNavigation.value ? "form" : "div");
    const dialogListeners = computed(() => {
      if (dialogTagName.value !== "form") {
        return {};
      }
      return {
        /**
         * @param event - Form submit event
         */
        submit(event) {
          event.preventDefault();
          emit2("submit", event);
        },
        /**
         * @param event - Form submit event
         */
        reset(event) {
          event.preventDefault();
          emit2("reset", event);
        }
      };
    });
    const showModal = ref(true);
    function handleButtonClose(button, result) {
      if (button.type === "submit" && dialogTagName.value === "form" && "reportValidity" in dialogRootElement.value && !dialogRootElement.value.reportValidity()) {
        return;
      }
      handleClosing(result);
      window.setTimeout(() => handleClosed(), 300);
    }
    function handleClosing(result) {
      showModal.value = false;
      emit2("closing", result);
    }
    function handleClosed() {
      showModal.value = true;
      open.value = false;
    }
    const modalProps = computed(() => ({
      noClose: props.noClose,
      container: props.container === void 0 ? "body" : props.container,
      // we do not pass the name as we already have the name as the headline
      // name: props.name,
      // But we need to set the correct label id so the dialog is labelled
      labelId: navigationId,
      size: props.size,
      show: open.value && showModal.value,
      outTransition: props.outTransition,
      closeOnClickOutside: props.closeOnClickOutside,
      additionalTrapElements: props.additionalTrapElements
    }));
    return (_ctx, _cache) => {
      return open.value ? (openBlock(), createBlock(unref(NcModal), mergeProps({
        key: 0,
        class: "dialog__modal",
        disableSwipe: ""
      }, modalProps.value, {
        onClose: handleClosed,
        "onUpdate:show": _cache[0] || (_cache[0] = ($event) => handleClosing())
      }), {
        default: withCtx(() => [
          createBaseVNode("h2", {
            id: unref(navigationId),
            class: "dialog__name",
            textContent: toDisplayString(__props.name)
          }, null, 8, _hoisted_1$B),
          (openBlock(), createBlock(resolveDynamicComponent(dialogTagName.value), mergeProps({
            ref: "dialogElement",
            class: ["dialog", __props.dialogClasses]
          }, toHandlers(dialogListeners.value)), {
            default: withCtx(() => [
              createBaseVNode("div", {
                ref: "wrapper",
                class: normalizeClass(["dialog__wrapper", [{ "dialog__wrapper--collapsed": isNavigationCollapsed.value }]])
              }, [
                hasNavigation.value ? (openBlock(), createElementBlock("nav", {
                  key: 0,
                  class: normalizeClass(["dialog__navigation", __props.navigationClasses]),
                  "aria-label": navigationAriaLabelAttr.value,
                  "aria-labelledby": navigationAriaLabelledbyAttr.value
                }, [
                  renderSlot(_ctx.$slots, "navigation", { isCollapsed: isNavigationCollapsed.value }, void 0, true)
                ], 10, _hoisted_2$s)) : createCommentVNode("", true),
                createBaseVNode("div", {
                  class: normalizeClass(["dialog__content", __props.contentClasses])
                }, [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createBaseVNode("p", _hoisted_3$o, toDisplayString(__props.message), 1)
                  ], true)
                ], 2)
              ], 2),
              createBaseVNode("div", _hoisted_4$l, [
                renderSlot(_ctx.$slots, "actions", {}, () => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(__props.buttons, (button, idx) => {
                    return openBlock(), createBlock(unref(_sfc_main$M), mergeProps({ key: idx }, { ref_for: true }, button, {
                      onClick: (_2, result) => handleButtonClose(button, result)
                    }), null, 16, ["onClick"]);
                  }), 128))
                ], true)
              ])
            ]),
            _: 3
          }, 16, ["class"]))
        ]),
        _: 3
      }, 16)) : createCommentVNode("", true);
    };
  }
});
const NcDialog = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["__scopeId", "data-v-24e91b99"]]);
const _hoisted_1$A = ["role"];
const _hoisted_2$r = {
  key: 0,
  class: "notecard__heading"
};
const _hoisted_3$n = { class: "notecard__text" };
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "NcNoteCard",
  props: {
    heading: { default: void 0 },
    showAlert: { type: Boolean },
    text: { default: void 0 },
    type: { default: "warning" }
  },
  setup(__props) {
    const props = __props;
    const shouldShowAlert = computed(() => props.showAlert || props.type === "error");
    const iconPath = computed(() => {
      switch (props.type) {
        case "error":
          return mdiAlertDecagram;
        case "success":
          return mdiCheckboxMarkedCircle;
        case "info":
          return mdiInformation;
        case "warning":
        default:
          return mdiAlert;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["notecard", {
          [`notecard--${__props.type}`]: __props.type,
          "notecard--legacy": unref(isLegacy)
        }]),
        role: shouldShowAlert.value ? "alert" : "note"
      }, [
        renderSlot(_ctx.$slots, "icon", {}, () => [
          createVNode(unref(NcIconSvgWrapper), {
            path: iconPath.value,
            class: normalizeClass(["notecard__icon", { "notecard__icon--heading": __props.heading }]),
            inline: ""
          }, null, 8, ["path", "class"])
        ], true),
        createBaseVNode("div", null, [
          __props.heading ? (openBlock(), createElementBlock("p", _hoisted_2$r, toDisplayString(__props.heading), 1)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default", {}, () => [
            createBaseVNode("p", _hoisted_3$n, toDisplayString(__props.text), 1)
          ], true)
        ])
      ], 10, _hoisted_1$A);
    };
  }
});
const NcNoteCard = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["__scopeId", "data-v-6be9fa31"]]);
const svg = `<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 12">
	<path d="M17,1H7A5,5 0 0,0 2,6 5,5 0 0,0 7,11H17A5,5 0 0,0 22,6 5,5 0 0,0 17,1Z" />
	<circle
		cy="6"
		r="3"
		fill="var(--color-main-background)" />
</svg>`;
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "NcIconToggleSwitch",
  props: {
    checked: { type: Boolean },
    size: { default: 34 },
    inline: { type: Boolean, default: false }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "v6bd152af": color.value,
      "v16fd8ca9": cx.value
    }));
    const color = computed(() => __props.checked ? "var(--color-primary-element)" : "var(--color-text-maxcontrast)");
    const cx = computed(() => __props.checked ? "calc(17 / 24 * 100%)" : "calc(7 / 24 * 100%)");
    return (_ctx, _cache) => {
      return openBlock(), createBlock(NcIconSvgWrapper, {
        class: normalizeClass(_ctx.$style.iconToggleSwitch),
        svg,
        size: __props.size,
        inline: __props.inline
      }, null, 8, ["class", "size", "inline"]);
    };
  }
});
const iconToggleSwitch = "_iconToggleSwitch_IKWaj";
const style0$4 = {
  "material-design-icon": "_material-design-icon_63AMQ",
  iconToggleSwitch
};
const cssModules$4 = {
  "$style": style0$4
};
const NcIconToggleSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__cssModules", cssModules$4]]);
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const INSIDE_RADIO_GROUP_KEY = /* @__PURE__ */ Symbol.for("insideRadioGroup");
function useInsideRadioGroup() {
  return inject(INSIDE_RADIO_GROUP_KEY, void 0);
}
const _sfc_main$6$1 = {
  name: "CheckboxBlankOutlineIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$6$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$5$1 = ["fill", "width", "height"];
const _hoisted_3$5$1 = { d: "M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" };
const _hoisted_4$4$1 = { key: 0 };
function _sfc_render$6$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon checkbox-blank-outline-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$5$1, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$4$1, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$5$1))
  ], 16, _hoisted_1$6$1);
}
const CheckboxBlankOutline = /* @__PURE__ */ _export_sfc(_sfc_main$6$1, [["render", _sfc_render$6$1]]);
const _sfc_main$5$2 = {
  name: "CheckboxMarkedIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$5$2 = ["aria-hidden", "aria-label"];
const _hoisted_2$4$1 = ["fill", "width", "height"];
const _hoisted_3$4$1 = { d: "M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" };
const _hoisted_4$3$2 = { key: 0 };
function _sfc_render$5$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon checkbox-marked-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$4$1, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$3$2, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$4$1))
  ], 16, _hoisted_1$5$2);
}
const CheckboxMarked = /* @__PURE__ */ _export_sfc(_sfc_main$5$2, [["render", _sfc_render$5$1]]);
const _sfc_main$4$2 = {
  name: "MinusBoxIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$4$2 = ["aria-hidden", "aria-label"];
const _hoisted_2$3$2 = ["fill", "width", "height"];
const _hoisted_3$3$2 = { d: "M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" };
const _hoisted_4$2$3 = { key: 0 };
function _sfc_render$4$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon minus-box-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$3$2, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$2$3, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$3$2))
  ], 16, _hoisted_1$4$2);
}
const MinusBox = /* @__PURE__ */ _export_sfc(_sfc_main$4$2, [["render", _sfc_render$4$2]]);
const _sfc_main$3$3 = {
  name: "RadioboxBlankIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$3$2 = ["aria-hidden", "aria-label"];
const _hoisted_2$2$3 = ["fill", "width", "height"];
const _hoisted_3$2$3 = { d: "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" };
const _hoisted_4$1$4 = { key: 0 };
function _sfc_render$3$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon radiobox-blank-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$2$3, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$1$4, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$2$3))
  ], 16, _hoisted_1$3$2);
}
const RadioboxBlank = /* @__PURE__ */ _export_sfc(_sfc_main$3$3, [["render", _sfc_render$3$3]]);
const _sfc_main$2$3 = {
  name: "RadioboxMarkedIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$2$3 = ["aria-hidden", "aria-label"];
const _hoisted_2$1$4 = ["fill", "width", "height"];
const _hoisted_3$1$4 = { d: "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" };
const _hoisted_4$k = { key: 0 };
function _sfc_render$2$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon radiobox-marked-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$1$4, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$k, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$1$4))
  ], 16, _hoisted_1$2$3);
}
const RadioboxMarked = /* @__PURE__ */ _export_sfc(_sfc_main$2$3, [["render", _sfc_render$2$3]]);
const TYPE_CHECKBOX = "checkbox";
const TYPE_RADIO = "radio";
const TYPE_SWITCH = "switch";
const TYPE_BUTTON = "button";
const _sfc_main$1$9 = {
  name: "NcCheckboxContent",
  components: {
    NcLoadingIcon,
    NcIconToggleSwitch
  },
  props: {
    /**
     * Class for the icon element
     */
    iconClass: {
      type: [String, Object],
      default: null
    },
    /**
     * Class for the text element
     */
    textClass: {
      type: [String, Object],
      default: null
    },
    /**
     * Type of the input. checkbox, radio, switch, or button.
     *
     * Only use button when used in a `tablist` container and the
     * `tab` role is set.
     *
     * @type {'checkbox'|'radio'|'switch'|'button'}
     */
    type: {
      type: String,
      default: "checkbox",
      validator: (type) => [
        TYPE_CHECKBOX,
        TYPE_RADIO,
        TYPE_SWITCH,
        TYPE_BUTTON
      ].includes(type)
    },
    /**
     * Toggle the alternative button style
     */
    buttonVariant: {
      type: Boolean,
      default: false
    },
    /**
     * True if the entry is checked
     */
    isChecked: {
      type: Boolean,
      default: false
    },
    /**
     * Indeterminate state
     */
    indeterminate: {
      type: Boolean,
      default: false
    },
    /**
     * Loading state
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Icon size
     */
    iconSize: {
      type: Number,
      default: 24
    },
    /**
     * Label id attribute
     */
    labelId: {
      type: String,
      required: true
    },
    /**
     * Description id attribute
     */
    descriptionId: {
      type: String,
      required: true
    }
  },
  computed: {
    isButtonType() {
      return this.type === TYPE_BUTTON;
    },
    isSwitchType() {
      return this.type === TYPE_SWITCH;
    },
    /**
     * Returns the proper Material icon depending on the select case
     *
     * @return {object}
     */
    checkboxRadioIconElement() {
      if (this.type === TYPE_RADIO) {
        if (this.isChecked) {
          return RadioboxMarked;
        }
        return RadioboxBlank;
      }
      if (this.indeterminate) {
        return MinusBox;
      }
      if (this.isChecked) {
        return CheckboxMarked;
      }
      return CheckboxBlankOutline;
    }
  }
};
const _hoisted_1$1$6 = {
  key: 0,
  class: "checkbox-content__wrapper"
};
const _hoisted_2$q = ["id"];
const _hoisted_3$m = ["id"];
function _sfc_render$1$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcLoadingIcon = resolveComponent("NcLoadingIcon");
  const _component_NcIconToggleSwitch = resolveComponent("NcIconToggleSwitch");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass(["checkbox-content", {
      ["checkbox-content-" + $props.type]: true,
      "checkbox-content--button-variant": $props.buttonVariant,
      "checkbox-content--has-text": !!_ctx.$slots.default
    }])
  }, [
    createBaseVNode("span", {
      class: normalizeClass(["checkbox-content__icon", {
        "checkbox-content__icon--checked": $props.isChecked,
        "checkbox-content__icon--has-description": !$options.isButtonType && _ctx.$slots.description,
        [$props.iconClass]: true
      }]),
      "aria-hidden": true,
      inert: ""
    }, [
      renderSlot(_ctx.$slots, "icon", {
        checked: $props.isChecked,
        loading: $props.loading
      }, () => [
        $props.loading ? (openBlock(), createBlock(_component_NcLoadingIcon, { key: 0 })) : $options.isSwitchType ? (openBlock(), createBlock(_component_NcIconToggleSwitch, {
          key: 1,
          checked: $props.isChecked,
          size: $props.iconSize,
          inline: ""
        }, null, 8, ["checked", "size"])) : !$props.buttonVariant ? (openBlock(), createBlock(resolveDynamicComponent($options.checkboxRadioIconElement), {
          key: 2,
          size: $props.iconSize
        }, null, 8, ["size"])) : createCommentVNode("", true)
      ], true)
    ], 2),
    _ctx.$slots.default || _ctx.$slots.description ? (openBlock(), createElementBlock("span", _hoisted_1$1$6, [
      _ctx.$slots.default ? (openBlock(), createElementBlock("span", {
        key: 0,
        id: $props.labelId,
        class: normalizeClass(["checkbox-content__text", $props.textClass])
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 10, _hoisted_2$q)) : createCommentVNode("", true),
      !$options.isButtonType && _ctx.$slots.description ? (openBlock(), createElementBlock("span", {
        key: 1,
        id: $props.descriptionId,
        class: "checkbox-content__description"
      }, [
        renderSlot(_ctx.$slots, "description", {}, void 0, true)
      ], 8, _hoisted_3$m)) : createCommentVNode("", true)
    ])) : createCommentVNode("", true)
  ], 2);
}
const NcCheckboxContent = /* @__PURE__ */ _export_sfc(_sfc_main$1$9, [["render", _sfc_render$1$4], ["__scopeId", "data-v-5ca1e30f"]]);
register();
const _sfc_main$F = {
  name: "NcCheckboxRadioSwitch",
  components: {
    NcCheckboxContent
  },
  // We need to pass attributes to the input element
  inheritAttrs: false,
  props: {
    /**
     * Unique id attribute of the input
     */
    id: {
      type: String,
      default: () => "checkbox-radio-switch-" + createElementId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * Unique id attribute of the wrapper element
     */
    wrapperId: {
      type: String,
      default: null
    },
    /**
     * Input name. Required for radio, optional for checkbox, and ignored
     * for button.
     */
    name: {
      type: String,
      default: null
    },
    /**
     * Required if no text is set.
     * The aria-label is forwarded to the input or button.
     */
    ariaLabel: {
      type: String,
      default: ""
    },
    /**
     * Type of the input. checkbox, radio, switch, or button.
     *
     * Only use button when used in a `tablist` container and the
     * `tab` role is set.
     *
     * @type {'checkbox'|'radio'|'switch'|'button'}
     */
    type: {
      type: String,
      default: "checkbox",
      validator: (type) => [
        TYPE_CHECKBOX,
        TYPE_RADIO,
        TYPE_SWITCH,
        TYPE_BUTTON
      ].includes(type)
    },
    /**
     * Toggle the alternative button style
     *
     * @deprecated - Use `NcRadioGroup` instead
     */
    buttonVariant: {
      type: Boolean,
      default: false
    },
    /**
     * Are the elements are all direct siblings?
     * If so they will be grouped horizontally or vertically
     *
     * @type {'no'|'horizontal'|'vertical'}
     * @deprecated - Use `NcRadioGroup` instead
     */
    buttonVariantGrouped: {
      type: String,
      default: "no",
      validator: (v) => ["no", "vertical", "horizontal"].includes(v)
    },
    /**
     * Checked state. To be used with `v-model:value`
     */
    modelValue: {
      type: [Boolean, Array, String],
      default: false
    },
    /**
     * Value to be synced on check
     */
    value: {
      type: String,
      default: null
    },
    /**
     * Disabled state
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Indeterminate state
     */
    indeterminate: {
      type: Boolean,
      default: false
    },
    /**
     * Required state
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * Loading state
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Wrapping element tag
     *
     * When `type` is set to `button` this will be ignored
     *
     * Defaults to `span`
     */
    wrapperElement: {
      type: String,
      default: null
    },
    /**
     * The class(es) to pass to the wrapper / root element of the component
     */
    class: {
      type: [String, Array, Object],
      default: ""
    },
    /**
     * The style to pass to the wrapper / root element of the component
     */
    style: {
      type: [String, Array, Object],
      default: ""
    },
    /**
     * Description
     *
     * This is unsupported when using button has type.
     */
    description: {
      type: String,
      default: null
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit: emit2 }) {
    const radioGroup = useInsideRadioGroup();
    onMounted(() => radioGroup?.value.register(false));
    const internalType = computed(() => radioGroup?.value ? TYPE_RADIO : props.type);
    const internalModelValue = computed({
      get() {
        if (radioGroup?.value) {
          return radioGroup.value.modelValue;
        }
        return props.modelValue;
      },
      set(value) {
        if (radioGroup?.value) {
          radioGroup.value.onUpdate(value);
        } else {
          emit2("update:modelValue", value);
        }
      }
    });
    return {
      internalType,
      internalModelValue,
      labelId: createElementId(),
      descriptionId: createElementId()
    };
  },
  computed: {
    isButtonType() {
      return this.internalType === TYPE_BUTTON;
    },
    computedWrapperElement() {
      if (this.isButtonType) {
        return "button";
      }
      if (this.wrapperElement !== null) {
        return this.wrapperElement;
      }
      return "span";
    },
    listeners() {
      if (this.isButtonType) {
        return {
          click: this.onToggle
        };
      }
      return {
        change: this.onToggle
      };
    },
    iconSize() {
      return this.internalType === TYPE_SWITCH ? 36 : 20;
    },
    cssIconSize() {
      return this.iconSize + "px";
    },
    cssIconHeight() {
      return this.internalType === TYPE_SWITCH ? "16px" : this.cssIconSize;
    },
    /**
     * Return the input type.
     * Switch is not an official type
     *
     * @return {string}
     */
    inputType() {
      const nativeTypes = [
        TYPE_CHECKBOX,
        TYPE_RADIO,
        TYPE_BUTTON
      ];
      if (nativeTypes.includes(this.internalType)) {
        return this.internalType;
      }
      return TYPE_CHECKBOX;
    },
    /**
     * Check if that entry is checked
     * If value is defined, we use that as the checked value
     * If not, we expect true/false in this.checked
     *
     * @return {boolean}
     */
    isChecked() {
      if (this.value !== null) {
        if (Array.isArray(this.internalModelValue)) {
          return [...this.internalModelValue].indexOf(this.value) > -1;
        }
        return this.internalModelValue === this.value;
      }
      return this.internalModelValue === true;
    },
    hasIndeterminate() {
      return [
        TYPE_CHECKBOX,
        TYPE_RADIO
      ].includes(this.inputType);
    }
  },
  mounted() {
    if (this.name && this.internalType === TYPE_CHECKBOX) {
      if (!Array.isArray(this.internalModelValue)) {
        throw new Error("When using groups of checkboxes, the updated value will be an array.");
      }
    }
    if (this.name && this.internalType === TYPE_SWITCH) {
      throw new Error("Switches are not made to be used for data sets. Please use checkboxes instead.");
    }
    if (typeof this.internalModelValue !== "boolean" && this.internalType === TYPE_SWITCH) {
      throw new Error("Switches can only be used with boolean as modelValue prop.");
    }
  },
  methods: {
    t,
    n: n$1,
    onToggle(event) {
      if (this.disabled || event.target.tagName.toLowerCase() === "a") {
        return;
      }
      if (this.internalType === TYPE_RADIO) {
        this.internalModelValue = this.value;
        return;
      }
      if (this.internalType === TYPE_SWITCH) {
        this.internalModelValue = !this.isChecked;
        return;
      }
      if (typeof this.internalModelValue === "boolean") {
        this.internalModelValue = !this.internalModelValue;
        return;
      }
      if (this.isChecked) {
        this.internalModelValue = this.internalModelValue.filter((v) => v !== this.value);
      } else {
        this.internalModelValue = [...this.internalModelValue, this.value];
      }
    }
  }
};
const __injectCSSVars__ = () => {
  useCssVars((_ctx) => ({
    "v5ac25550": _ctx.cssIconSize,
    "d98ce684": _ctx.cssIconHeight
  }));
};
const __setup__ = _sfc_main$F.setup;
_sfc_main$F.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
const _hoisted_1$z = ["id", "aria-labelledby", "aria-describedby", "aria-label", "disabled", "type", "value", "checked", ".indeterminate", "required", "name"];
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcCheckboxContent = resolveComponent("NcCheckboxContent");
  return openBlock(), createBlock(resolveDynamicComponent($options.computedWrapperElement), mergeProps({
    id: $props.wrapperId ?? ($options.isButtonType ? $props.id : null),
    "aria-label": $options.isButtonType && $props.ariaLabel ? $props.ariaLabel : void 0,
    class: ["checkbox-radio-switch", [
      _ctx.$props.class,
      {
        ["checkbox-radio-switch-" + $setup.internalType]: $setup.internalType,
        "checkbox-radio-switch--checked": $options.isChecked,
        "checkbox-radio-switch--disabled": $props.disabled,
        "checkbox-radio-switch--indeterminate": $options.hasIndeterminate ? $props.indeterminate : false,
        "checkbox-radio-switch--button-variant": $props.buttonVariant,
        "checkbox-radio-switch--button-variant-v-grouped": $props.buttonVariant && $props.buttonVariantGrouped === "vertical",
        "checkbox-radio-switch--button-variant-h-grouped": $props.buttonVariant && $props.buttonVariantGrouped === "horizontal",
        "button-vue": $options.isButtonType
      }
    ]],
    style: $props.style,
    type: $options.isButtonType ? "button" : null
  }, $options.isButtonType ? _ctx.$attrs : {}, toHandlers($options.isButtonType ? $options.listeners : {})), {
    default: withCtx(() => [
      !$options.isButtonType ? (openBlock(), createElementBlock("input", mergeProps({
        key: 0,
        id: $props.id,
        "aria-labelledby": !$options.isButtonType && !$props.ariaLabel ? $setup.labelId : null,
        "aria-describedby": !$options.isButtonType && ($props.description || _ctx.$slots.description) ? $setup.descriptionId : null,
        "aria-label": $props.ariaLabel || void 0,
        class: "checkbox-radio-switch__input",
        disabled: $props.disabled,
        type: $options.inputType,
        value: $props.value,
        checked: $options.isChecked,
        ".indeterminate": $options.hasIndeterminate ? $props.indeterminate : null,
        required: $props.required,
        name: $props.name
      }, _ctx.$attrs, toHandlers($options.listeners, true)), null, 48, _hoisted_1$z)) : createCommentVNode("", true),
      createVNode(_component_NcCheckboxContent, {
        id: !$options.isButtonType ? `${$props.id}-label` : void 0,
        class: "checkbox-radio-switch__content",
        iconClass: "checkbox-radio-switch__icon",
        textClass: "checkbox-radio-switch__text",
        type: $setup.internalType,
        indeterminate: $options.hasIndeterminate ? $props.indeterminate : false,
        buttonVariant: $props.buttonVariant,
        isChecked: $options.isChecked,
        loading: $props.loading,
        labelId: $setup.labelId,
        descriptionId: $setup.descriptionId,
        iconSize: $options.iconSize,
        onClick: $options.onToggle
      }, createSlots({
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "icon", {}, void 0, true)
        ]),
        _: 2
      }, [
        _ctx.$slots.description || $props.description ? {
          name: "description",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "description", {}, () => [
              createTextVNode(toDisplayString($props.description), 1)
            ], true)
          ]),
          key: "0"
        } : void 0,
        !!_ctx.$slots.default ? {
          name: "default",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["id", "type", "indeterminate", "buttonVariant", "isChecked", "loading", "labelId", "descriptionId", "iconSize", "onClick"])
    ]),
    _: 3
  }, 16, ["id", "aria-label", "class", "style", "type"]);
}
const NcCheckboxRadioSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$l], ["__scopeId", "data-v-c34c63a4"]]);
const _sfc_main$1$8 = {
  name: "HelpCircleIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$1$5 = ["aria-hidden", "aria-label"];
const _hoisted_2$1$3 = ["fill", "width", "height"];
const _hoisted_3$1$3 = { d: "M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" };
const _hoisted_4$1$3 = { key: 0 };
function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon help-circle-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$1$3, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$1$3, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$1$3))
  ], 16, _hoisted_1$1$5);
}
const HelpCircle = /* @__PURE__ */ _export_sfc(_sfc_main$1$8, [["render", _sfc_render$k]]);
register(t26);
const _hoisted_1$y = { class: "settings-section" };
const _hoisted_2$p = { class: "settings-section__name" };
const _hoisted_3$l = ["aria-label", "href", "title"];
const _hoisted_4$j = {
  key: 0,
  class: "settings-section__desc"
};
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "NcSettingsSection",
  props: {
    name: {},
    description: { default: "" },
    docUrl: { default: "" }
  },
  setup(__props) {
    const ariaLabel = t("External documentation");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$y, [
        createBaseVNode("h2", _hoisted_2$p, [
          createTextVNode(toDisplayString(__props.name) + " ", 1),
          __props.docUrl ? (openBlock(), createElementBlock("a", {
            key: 0,
            "aria-label": unref(ariaLabel),
            class: "settings-section__info",
            href: __props.docUrl,
            rel: "noreferrer nofollow",
            target: "_blank",
            title: unref(ariaLabel)
          }, [
            createVNode(HelpCircle, { size: 20 })
          ], 8, _hoisted_3$l)) : createCommentVNode("", true)
        ]),
        __props.description ? (openBlock(), createElementBlock("p", _hoisted_4$j, toDisplayString(__props.description), 1)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]);
    };
  }
});
const NcSettingsSection = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-9cedb949"]]);
const _hoisted_1$x = { class: "textarea__main-wrapper" };
const _hoisted_2$o = ["id", "aria-describedby", "disabled", "placeholder", "value"];
const _hoisted_3$k = ["for"];
const _hoisted_4$i = ["id"];
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "NcTextArea",
  props: /* @__PURE__ */ mergeModels({
    disabled: { type: Boolean },
    error: { type: Boolean },
    helperText: { default: void 0 },
    id: { default: () => createElementId() },
    inputClass: { default: "" },
    label: { default: void 0 },
    labelOutside: { type: Boolean },
    placeholder: { default: void 0 },
    resize: { default: "both" },
    success: { type: Boolean }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    __expose({
      focus,
      select
    });
    const attrs = useAttrs();
    const textAreaElement = useTemplateRef("input");
    const internalPlaceholder = computed(() => props.placeholder || (isLegacy ? props.label : void 0));
    watch(() => props.labelOutside, () => {
      if (!props.labelOutside && !props.label) {
        logger.warn("[NcTextArea] You need to add a label to the NcInputField component. Either use the prop label or use an external one, as per the example in the documentation.");
      }
    });
    const ariaDescribedby = computed(() => {
      const ariaDescribedby2 = [];
      if (props.helperText) {
        ariaDescribedby2.push(`${props.id}-helper-text`);
      }
      if (typeof attrs["aria-describedby"] === "string") {
        ariaDescribedby2.push(attrs["aria-describedby"]);
      }
      return ariaDescribedby2.join(" ") || void 0;
    });
    function handleInput(event) {
      const { value } = event.target;
      modelValue.value = value;
    }
    function focus(options) {
      textAreaElement.value.focus(options);
    }
    function select() {
      textAreaElement.value.select();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["textarea", [
          _ctx.$attrs.class,
          {
            "textarea--disabled": __props.disabled,
            "textarea--legacy": unref(isLegacy)
          }
        ]])
      }, [
        createBaseVNode("div", _hoisted_1$x, [
          createBaseVNode("textarea", mergeProps({ ..._ctx.$attrs, class: void 0 }, {
            id: __props.id,
            ref: "input",
            "aria-describedby": ariaDescribedby.value,
            "aria-live": "polite",
            class: ["textarea__input", [
              __props.inputClass,
              {
                "textarea__input--label-outside": __props.labelOutside,
                "textarea__input--legacy": unref(isLegacy),
                "textarea__input--success": __props.success,
                "textarea__input--error": __props.error
              }
            ]],
            disabled: __props.disabled,
            placeholder: internalPlaceholder.value,
            style: { resize: __props.resize },
            value: modelValue.value,
            onInput: handleInput
          }), null, 16, _hoisted_2$o),
          !__props.labelOutside ? (openBlock(), createElementBlock("label", {
            key: 0,
            class: "textarea__label",
            for: __props.id
          }, toDisplayString(__props.label), 9, _hoisted_3$k)) : createCommentVNode("", true)
        ]),
        __props.helperText ? (openBlock(), createElementBlock("p", {
          key: 0,
          id: `${__props.id}-helper-text`,
          class: normalizeClass(["textarea__helper-text-message", {
            "textarea__helper-text-message--error": __props.error,
            "textarea__helper-text-message--success": __props.success
          }])
        }, [
          __props.success ? (openBlock(), createBlock(NcIconSvgWrapper, {
            key: 0,
            class: "textarea__helper-text-message__icon",
            path: unref(mdiCheck),
            inline: ""
          }, null, 8, ["path"])) : __props.error ? (openBlock(), createBlock(NcIconSvgWrapper, {
            key: 1,
            class: "textarea__helper-text-message__icon",
            path: unref(mdiAlertCircleOutline),
            inline: ""
          }, null, 8, ["path"])) : createCommentVNode("", true),
          createTextVNode(" " + toDisplayString(__props.helperText), 1)
        ], 10, _hoisted_4$i)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const NcTextArea = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-d327fb49"]]);
const _hoisted_1$w = { class: "input-field__main-wrapper" };
const _hoisted_2$n = ["id", "aria-describedby", "disabled", "placeholder", "type", "value"];
const _hoisted_3$j = ["for"];
const _hoisted_4$h = { class: "input-field__icon input-field__icon--leading" };
const _hoisted_5$a = {
  key: 2,
  class: "input-field__icon input-field__icon--trailing"
};
const _hoisted_6$8 = ["id"];
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "NcInputField",
  props: /* @__PURE__ */ mergeModels({
    class: { default: "" },
    inputClass: { default: "" },
    id: { default: () => createElementId() },
    label: { default: void 0 },
    labelOutside: { type: Boolean },
    type: { default: "text" },
    placeholder: { default: void 0 },
    showTrailingButton: { type: Boolean },
    trailingButtonLabel: { default: void 0 },
    success: { type: Boolean },
    error: { type: Boolean },
    helperText: { default: "" },
    disabled: { type: Boolean },
    pill: { type: Boolean }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["trailingButtonClick"], ["update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    const emit2 = __emit;
    __expose({
      focus,
      select
    });
    const attrs = useAttrs();
    const inputElement = useTemplateRef("input");
    const hasTrailingIcon = computed(() => props.showTrailingButton || props.success);
    const internalPlaceholder = computed(() => {
      if (props.placeholder) {
        return props.placeholder;
      }
      if (props.label) {
        return isLegacy ? props.label : "";
      }
      return void 0;
    });
    const isValidLabel = computed(() => {
      const isValidLabel2 = props.label || props.labelOutside;
      return isValidLabel2;
    });
    const ariaDescribedby = computed(() => {
      const ariaDescribedby2 = [];
      if (props.helperText) {
        ariaDescribedby2.push(`${props.id}-helper-text`);
      }
      if (attrs["aria-describedby"]) {
        ariaDescribedby2.push(String(attrs["aria-describedby"]));
      }
      return ariaDescribedby2.join(" ") || void 0;
    });
    function focus(options) {
      inputElement.value.focus(options);
    }
    function select() {
      inputElement.value.select();
    }
    function handleInput(event) {
      const target = event.target;
      modelValue.value = props.type === "number" && typeof modelValue.value === "number" ? parseFloat(target.value) : target.value;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["input-field", [{
          "input-field--disabled": __props.disabled,
          "input-field--error": __props.error,
          "input-field--label-outside": __props.labelOutside || !isValidLabel.value,
          "input-field--leading-icon": !!_ctx.$slots.icon,
          "input-field--trailing-icon": hasTrailingIcon.value,
          "input-field--pill": __props.pill,
          "input-field--success": __props.success,
          "input-field--legacy": unref(isLegacy)
        }, _ctx.$props.class]])
      }, [
        createBaseVNode("div", _hoisted_1$w, [
          createBaseVNode("input", mergeProps(_ctx.$attrs, {
            id: __props.id,
            ref: "input",
            "aria-describedby": ariaDescribedby.value,
            "aria-live": "polite",
            class: ["input-field__input", __props.inputClass],
            disabled: __props.disabled,
            placeholder: internalPlaceholder.value,
            type: __props.type,
            value: modelValue.value.toString(),
            onInput: handleInput
          }), null, 16, _hoisted_2$n),
          !__props.labelOutside && isValidLabel.value ? (openBlock(), createElementBlock("label", {
            key: 0,
            class: "input-field__label",
            for: __props.id
          }, toDisplayString(__props.label), 9, _hoisted_3$j)) : createCommentVNode("", true),
          withDirectives(createBaseVNode("div", _hoisted_4$h, [
            renderSlot(_ctx.$slots, "icon", {}, void 0, true)
          ], 512), [
            [vShow, !!_ctx.$slots.icon]
          ]),
          __props.showTrailingButton ? (openBlock(), createBlock(NcButton, {
            key: 1,
            class: "input-field__trailing-button",
            "aria-label": __props.trailingButtonLabel,
            disabled: __props.disabled,
            variant: "tertiary-no-background",
            onClick: _cache[0] || (_cache[0] = ($event) => emit2("trailingButtonClick", $event))
          }, {
            icon: withCtx(() => [
              renderSlot(_ctx.$slots, "trailing-button-icon", {}, void 0, true)
            ]),
            _: 3
          }, 8, ["aria-label", "disabled"])) : __props.success || __props.error ? (openBlock(), createElementBlock("div", _hoisted_5$a, [
            __props.success ? (openBlock(), createBlock(NcIconSvgWrapper, {
              key: 0,
              path: unref(mdiCheck)
            }, null, 8, ["path"])) : (openBlock(), createBlock(NcIconSvgWrapper, {
              key: 1,
              path: unref(mdiAlertCircleOutline)
            }, null, 8, ["path"]))
          ])) : createCommentVNode("", true)
        ]),
        __props.helperText ? (openBlock(), createElementBlock("p", {
          key: 0,
          id: `${__props.id}-helper-text`,
          class: "input-field__helper-text-message"
        }, [
          __props.success ? (openBlock(), createBlock(NcIconSvgWrapper, {
            key: 0,
            class: "input-field__helper-text-message__icon",
            path: unref(mdiCheck),
            inline: ""
          }, null, 8, ["path"])) : __props.error ? (openBlock(), createBlock(NcIconSvgWrapper, {
            key: 1,
            class: "input-field__helper-text-message__icon",
            path: unref(mdiAlertCircleOutline),
            inline: ""
          }, null, 8, ["path"])) : createCommentVNode("", true),
          createTextVNode(" " + toDisplayString(__props.helperText), 1)
        ], 8, _hoisted_6$8)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const NcInputField = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["__scopeId", "data-v-8e16cbb5"]]);
register(t18, t51);
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "NcTextField",
  props: /* @__PURE__ */ mergeModels({
    class: {},
    inputClass: {},
    id: {},
    label: {},
    labelOutside: { type: Boolean },
    type: {},
    placeholder: {},
    showTrailingButton: { type: Boolean },
    trailingButtonLabel: { default: void 0 },
    success: { type: Boolean },
    error: { type: Boolean },
    helperText: {},
    disabled: { type: Boolean },
    pill: { type: Boolean },
    trailingButtonIcon: { default: "close" }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    __expose({
      focus,
      select
    });
    const inputFieldInstance = useTemplateRef("inputField");
    const defaultTrailingButtonLabels = {
      arrowEnd: t("Save changes"),
      close: t("Clear text"),
      undo: t("Undo changes")
    };
    const NcInputFieldPropNames = new Set(Object.keys(NcInputField.props));
    const propsToForward = computed(() => {
      const sharedProps = Object.fromEntries(Object.entries(props).filter(([key]) => NcInputFieldPropNames.has(key)));
      sharedProps.trailingButtonLabel ??= defaultTrailingButtonLabels[props.trailingButtonIcon];
      return sharedProps;
    });
    function focus(options) {
      inputFieldInstance.value.focus(options);
    }
    function select() {
      inputFieldInstance.value.select();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcInputField), mergeProps(propsToForward.value, {
        ref: "inputField",
        modelValue: modelValue.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelValue.value = $event)
      }), createSlots({ _: 2 }, [
        !!_ctx.$slots.icon ? {
          name: "icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "icon")
          ]),
          key: "0"
        } : void 0,
        __props.type !== "search" ? {
          name: "trailing-button-icon",
          fn: withCtx(() => [
            __props.trailingButtonIcon === "arrowEnd" ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
              key: 0,
              directional: "",
              path: unref(mdiArrowRight)
            }, null, 8, ["path"])) : (openBlock(), createBlock(unref(NcIconSvgWrapper), {
              key: 1,
              path: __props.trailingButtonIcon === "undo" ? unref(mdiUndo) : unref(mdiClose)
            }, null, 8, ["path"]))
          ]),
          key: "1"
        } : void 0
      ]), 1040, ["modelValue"]);
    };
  }
});
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
function once(func) {
  let wasCalled = false;
  let result;
  return (...args) => {
    if (!wasCalled) {
      wasCalled = true;
      result = func(...args);
    }
    return result;
  };
}
let realAppName = "missing-app-name";
try {
  realAppName = appName;
} catch {
  logger.error("The `@nextcloud/vue` library was used without setting / replacing the `appName`.");
}
const APP_NAME = realAppName;
let realAppVersion = "";
try {
  realAppVersion = appVersion;
} catch {
  logger.error("The `@nextcloud/vue` library was used without setting / replacing the `appVersion`.");
}
const APP_VERSION = realAppVersion;
function useAppName() {
  return inject("appName", APP_NAME);
}
const useLocalizedAppName = once(() => {
  const apps = loadState("core", "apps", []);
  const realAppName2 = useAppName();
  return apps.find(({ id }) => id === realAppName2)?.name ?? realAppName2;
});
register(t27);
const _sfc_main$1$7 = /* @__PURE__ */ defineComponent({
  __name: "NcAppContentDetailsToggle",
  setup(__props) {
    const isMobile2 = useIsMobile();
    watch(isMobile2, toggleAppNavigationButton);
    onMounted(() => {
      toggleAppNavigationButton(isMobile2.value);
    });
    onBeforeUnmount(() => {
      if (isMobile2.value) {
        toggleAppNavigationButton(false);
      }
    });
    function toggleAppNavigationButton(hide = true) {
      const appNavigationToggle = document.querySelector(".app-navigation .app-navigation-toggle");
      if (appNavigationToggle) {
        appNavigationToggle.style.display = hide ? "none" : "";
        if (hide === true) {
          emit("toggle-navigation", { open: false });
        }
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcButton), {
        "aria-label": unref(t)("Go back to the list"),
        class: normalizeClass(["app-details-toggle", { "app-details-toggle--mobile": unref(isMobile2) }]),
        title: unref(t)("Go back to the list"),
        variant: "tertiary"
      }, {
        icon: withCtx(() => [
          createVNode(unref(NcIconSvgWrapper), {
            directional: "",
            path: unref(mdiArrowRight)
          }, null, 8, ["path"])
        ]),
        _: 1
      }, 8, ["aria-label", "class", "title"]);
    };
  }
});
const NcAppContentDetailsToggle = /* @__PURE__ */ _export_sfc(_sfc_main$1$7, [["__scopeId", "data-v-a28923a1"]]);
const browserStorage = getBuilder("nextcloud").persist().build();
const instanceName = getCapabilities().theming?.name ?? "Nextcloud";
const _sfc_main$A = {
  name: "NcAppContent",
  components: {
    NcAppContentDetailsToggle,
    Pane: b,
    Splitpanes: y$1
  },
  props: {
    /**
     * Allows to disable the control by swipe of the app navigation open state.
     */
    disableSwipe: {
      type: Boolean,
      default: false
    },
    /**
     * Allows you to set the default width of the resizable list in % on vertical-split
     * or respectively the default height on horizontal-split.
     *
     * Must be between `listMinWidth` and `listMaxWidth`.
     */
    listSize: {
      type: Number,
      default: 20
    },
    /**
     * Allows you to set the minimum width of the list column in % on vertical-split
     * or respectively the minimum height on horizontal-split.
     */
    listMinWidth: {
      type: Number,
      default: 15
    },
    /**
     * Allows you to set the maximum width of the list column in % on vertical-split
     * or respectively the maximum height on horizontal-split.
     */
    listMaxWidth: {
      type: Number,
      default: 40
    },
    /**
     * Specify the config key for the pane config sizes
     * Default is the global var appName if you use the webpack-vue-config
     */
    paneConfigKey: {
      type: String,
      default: ""
    },
    /**
     * When in mobile view, only the list or the details are shown.
     *
     * If you provide a list, you need to provide a variable
     * that will be set to true by the user when an element of
     * the list gets selected. The details will then show a back
     * arrow to return to the list that will update this prop to false.
     */
    showDetails: {
      type: Boolean,
      default: true
    },
    /**
     * Content layout used when there is a list together with content:
     * - `vertical-split` - a 2-column layout with list and default content separated vertically
     * - `no-split` - a single column layout; List is shown when `showDetails` is `false`, otherwise the default slot content is shown with a back button to return to the list.
     * - 'horizontal-split' - a 2-column layout with list and default content separated horizontally
     * On mobile screen `no-split` layout is forced.
     */
    layout: {
      type: String,
      default: "vertical-split",
      validator(value) {
        return ["no-split", "vertical-split", "horizontal-split"].includes(value);
      }
    },
    /**
     * Specify the `<h1>` page heading
     */
    pageHeading: {
      type: String,
      default: null
    },
    /**
     * Allow setting the page's `<title>`
     *
     * If a page heading is set it defaults to `{pageHeading} - {appName} - {instanceName}` e.g. `Favorites - Files - MyPersonalCloud`.
     * When the page heading and the app name is the same only one is used, e.g. `Files - Files - MyPersonalCloud` is shown as `Files - MyPersonalCloud`.
     * When setting the prop then the following format will be used: `{pageTitle} - {instanceName}`
     */
    pageTitle: {
      type: String,
      default: null
    }
  },
  emits: [
    "update:showDetails",
    "resizeList"
  ],
  setup() {
    return {
      appName: useAppName(),
      localizedAppName: useLocalizedAppName(),
      isMobile: useIsMobile(),
      isRtl
    };
  },
  data() {
    return {
      contentHeight: 0,
      swiping: {},
      listPaneSize: this.restorePaneConfig()
    };
  },
  computed: {
    paneConfigID() {
      if (this.paneConfigKey !== "") {
        return `pane-list-size-${this.paneConfigKey}`;
      }
      try {
        return `pane-list-size-${this.appName}`;
      } catch {
        logger.info("[NcAppContent]: falling back to global nextcloud pane config");
        return "pane-list-size-nextcloud";
      }
    },
    detailsPaneSize() {
      if (this.listPaneSize) {
        return 100 - this.listPaneSize;
      }
      return this.paneDefaults.details.size;
    },
    paneDefaults() {
      return {
        list: {
          size: this.listSize,
          min: this.listMinWidth,
          max: this.listMaxWidth
        },
        // set the inverse values of the details column
        // based on the provided (or default) values of the list column
        details: {
          size: 100 - this.listSize,
          min: 100 - this.listMaxWidth,
          max: 100 - this.listMinWidth
        }
      };
    },
    realPageTitle() {
      const entries = /* @__PURE__ */ new Set();
      if (this.pageTitle) {
        for (const part of this.pageTitle.split(" - ")) {
          entries.add(part);
        }
      } else if (this.pageHeading) {
        for (const part of this.pageHeading.split(" - ")) {
          entries.add(part);
        }
        if (entries.size > 0) {
          entries.add(this.localizedAppName);
        }
      } else {
        return null;
      }
      entries.add(instanceName);
      return [...entries.values()].join(" - ");
    }
  },
  watch: {
    realPageTitle: {
      immediate: true,
      handler() {
        if (this.realPageTitle !== null) {
          document.title = this.realPageTitle;
        }
      }
    },
    paneConfigKey: {
      immediate: true,
      handler() {
        this.restorePaneConfig();
      }
    }
  },
  mounted() {
    if (!this.disableSwipe) {
      this.swiping = useSwipe(this.$el, {
        onSwipeEnd: this.handleSwipe
      });
    }
    this.restorePaneConfig();
  },
  methods: {
    /**
     * handle the swipe event
     *
     * @param {TouchEvent} e The touch event
     * @param {import('@vueuse/core').SwipeDirection} direction The swipe direction of the event
     */
    handleSwipe(e, direction) {
      const minSwipeX = 70;
      const touchZone = 300;
      if (Math.abs(this.swiping.lengthX) > minSwipeX) {
        if (this.swiping.coordsStart.x < touchZone / 2 && direction === "right") {
          emit("toggle-navigation", {
            open: true
          });
        } else if (this.swiping.coordsStart.x < touchZone * 1.5 && direction === "left") {
          emit("toggle-navigation", {
            open: false
          });
        }
      }
    },
    handlePaneResize(event) {
      const listPaneSize = parseInt(event.panes[0].size, 10);
      browserStorage.setItem(this.paneConfigID, JSON.stringify(listPaneSize));
      this.listPaneSize = listPaneSize;
      this.$emit("resizeList", { size: listPaneSize });
      logger.debug("[NcAppContent] pane config", { listPaneSize });
    },
    // browserStorage is not reactive, we need to update this manually
    restorePaneConfig() {
      const listPaneSize = parseInt(browserStorage.getItem(this.paneConfigID), 10);
      if (!isNaN(listPaneSize) && listPaneSize !== this.listPaneSize) {
        logger.debug("[NcAppContent] pane config", { listPaneSize });
        this.listPaneSize = listPaneSize;
        return listPaneSize;
      }
    },
    /**
     * The user clicked the back arrow from the details view
     */
    hideDetails() {
      this.$emit("update:showDetails", false);
    }
  }
};
const _hoisted_1$v = {
  key: 0,
  class: "hidden-visually"
};
const _hoisted_2$m = { class: "app-content-wrapper__list" };
const _hoisted_3$i = {
  key: 1,
  class: "app-content-wrapper"
};
function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcAppContentDetailsToggle = resolveComponent("NcAppContentDetailsToggle");
  const _component_Pane = resolveComponent("Pane");
  const _component_Splitpanes = resolveComponent("Splitpanes");
  return openBlock(), createElementBlock("main", {
    id: "app-content-vue",
    class: normalizeClass(["app-content no-snapper", { "app-content--has-list": !!_ctx.$slots.list }])
  }, [
    $props.pageHeading ? (openBlock(), createElementBlock("h1", _hoisted_1$v, toDisplayString($props.pageHeading), 1)) : createCommentVNode("", true),
    !!_ctx.$slots.list ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      $setup.isMobile || $props.layout === "no-split" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["app-content-wrapper app-content-wrapper--no-split", {
          "app-content-wrapper--show-details": $props.showDetails,
          "app-content-wrapper--show-list": !$props.showDetails,
          "app-content-wrapper--mobile": $setup.isMobile
        }])
      }, [
        $props.showDetails ? (openBlock(), createBlock(_component_NcAppContentDetailsToggle, {
          key: 0,
          onClick: withModifiers($options.hideDetails, ["stop", "prevent"])
        }, null, 8, ["onClick"])) : createCommentVNode("", true),
        withDirectives(createBaseVNode("div", _hoisted_2$m, [
          renderSlot(_ctx.$slots, "list", {}, void 0, true)
        ], 512), [
          [vShow, !$props.showDetails]
        ]),
        $props.showDetails ? renderSlot(_ctx.$slots, "default", { key: 1 }, void 0, true) : createCommentVNode("", true)
      ], 2)) : $props.layout === "vertical-split" || $props.layout === "horizontal-split" ? (openBlock(), createElementBlock("div", _hoisted_3$i, [
        createVNode(_component_Splitpanes, {
          horizontal: $props.layout === "horizontal-split",
          class: normalizeClass(["default-theme", {
            "splitpanes--horizontal": $props.layout === "horizontal-split",
            "splitpanes--vertical": $props.layout === "vertical-split"
          }]),
          rtl: $setup.isRtl,
          onResized: $options.handlePaneResize
        }, {
          default: withCtx(() => [
            createVNode(_component_Pane, {
              class: "splitpanes__pane-list",
              size: $data.listPaneSize || $options.paneDefaults.list.size,
              minSize: $options.paneDefaults.list.min,
              maxSize: $options.paneDefaults.list.max
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "list", {}, void 0, true)
              ]),
              _: 3
            }, 8, ["size", "minSize", "maxSize"]),
            createVNode(_component_Pane, {
              class: "splitpanes__pane-details",
              size: $options.detailsPaneSize,
              minSize: $options.paneDefaults.details.min,
              maxSize: $options.paneDefaults.details.max
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ]),
              _: 3
            }, 8, ["size", "minSize", "maxSize"])
          ]),
          _: 3
        }, 8, ["horizontal", "class", "rtl", "onResized"])
      ])) : createCommentVNode("", true)
    ], 64)) : createCommentVNode("", true),
    !_ctx.$slots.list ? renderSlot(_ctx.$slots, "default", { key: 2 }, void 0, true) : createCommentVNode("", true)
  ], 2);
}
const NcAppContent = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$j], ["__scopeId", "data-v-51427d61"]]);
const _sfc_main$z = {
  name: "ArrowRightIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$u = ["aria-hidden", "aria-label"];
const _hoisted_2$l = ["fill", "width", "height"];
const _hoisted_3$h = { d: "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" };
const _hoisted_4$g = { key: 0 };
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon arrow-right-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$h, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$g, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$l))
  ], 16, _hoisted_1$u);
}
const IconArrowRight = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$i]]);
const _sfc_main$y = {
  name: "CloseIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$t = ["aria-hidden", "aria-label"];
const _hoisted_2$k = ["fill", "width", "height"];
const _hoisted_3$g = { d: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" };
const _hoisted_4$f = { key: 0 };
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon close-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$g, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$f, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$k))
  ], 16, _hoisted_1$t);
}
const IconClose = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$h]]);
const _sfc_main$x = defineComponent({
  name: "NcVNodes",
  props: {
    /**
     * The vnodes to render
     */
    vnodes: {
      type: [Array, Object],
      default: null
    }
  },
  /**
   * The render function to display the component
   */
  render() {
    return this.vnodes || this.$slots?.default?.({});
  }
});
const directive$1 = {
  mounted(el) {
    el.focus();
  }
};
function linkifyString(str) {
  const options = new Options({
    defaultProtocol: "https",
    target: "_blank",
    className: "external linkified",
    attributes: {
      rel: "nofollow noopener noreferrer"
    }
  }, defaultRender);
  const tokens = tokenize(str);
  const result = [];
  for (const token of tokens) {
    if (token.t === "nl" && options.get("nl2br")) {
      result.push("<br>\n");
    } else if (!token.isLink || !options.check(token)) {
      result.push(escapeHTML(token.toString()));
    } else {
      result.push(options.render(token));
    }
  }
  return result.join("");
}
function escapeAttr(href) {
  return href.replace(/"/g, "&quot;");
}
function attributesToString(attributes) {
  const result = [];
  for (const attr in attributes) {
    const val = attributes[attr] + "";
    result.push(`${attr}="${escapeAttr(val)}"`);
  }
  return result.join(" ");
}
function defaultRender({ tagName, attributes, content }) {
  return `<${tagName} ${attributesToString(attributes)}>${escapeHTML(content)}</${tagName}>`;
}
const directive = function(el, { value }) {
  if (value?.linkify === true) {
    el.innerHTML = linkifyString(value.text);
  }
};
const _hoisted_1$s = ["title"];
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "NcAppSidebarHeader",
  props: {
    name: {},
    title: {},
    linkify: { type: Boolean }
  },
  setup(__props) {
    const headerRef = inject("NcAppSidebar:header:ref");
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("h2", {
        ref_key: "headerRef",
        ref: headerRef,
        tabindex: "-1",
        title: __props.title
      }, [
        createTextVNode(toDisplayString(__props.name), 1)
      ], 8, _hoisted_1$s)), [
        [unref(directive), { text: __props.name, linkify: __props.linkify }]
      ]);
    };
  }
});
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const HAS_APP_NAVIGATION_KEY = /* @__PURE__ */ Symbol.for("NcContent:setHasAppNavigation");
const CONTENT_SELECTOR_KEY = /* @__PURE__ */ Symbol.for("NcContent:selector");
const _hoisted_1$r = ["aria-labelledby"];
const _hoisted_2$j = {
  key: 0,
  class: "empty-content__icon",
  "aria-hidden": "true"
};
const _hoisted_3$f = ["id"];
const _hoisted_4$e = {
  key: 2,
  class: "empty-content__description"
};
const _hoisted_5$9 = {
  key: 3,
  class: "empty-content__action"
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "NcEmptyContent",
  props: {
    description: { default: "" },
    name: { default: "" }
  },
  setup(__props) {
    const nameId = createElementId();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        "aria-labelledby": unref(nameId),
        class: "empty-content",
        role: "note"
      }, [
        _ctx.$slots.icon ? (openBlock(), createElementBlock("div", _hoisted_2$j, [
          renderSlot(_ctx.$slots, "icon", {}, void 0, true)
        ])) : createCommentVNode("", true),
        __props.name !== "" || _ctx.$slots.name ? (openBlock(), createElementBlock("div", {
          key: 1,
          id: unref(nameId),
          class: "empty-content__name"
        }, [
          renderSlot(_ctx.$slots, "name", {}, () => [
            createTextVNode(toDisplayString(__props.name), 1)
          ], true)
        ], 8, _hoisted_3$f)) : createCommentVNode("", true),
        __props.description !== "" || _ctx.$slots.description ? (openBlock(), createElementBlock("p", _hoisted_4$e, [
          renderSlot(_ctx.$slots, "description", {}, () => [
            createTextVNode(toDisplayString(__props.description), 1)
          ], true)
        ])) : createCommentVNode("", true),
        _ctx.$slots.action ? (openBlock(), createElementBlock("div", _hoisted_5$9, [
          renderSlot(_ctx.$slots, "action", {}, void 0, true)
        ])) : createCommentVNode("", true)
      ], 8, _hoisted_1$r);
    };
  }
});
const NcEmptyContent = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-8609a4c1"]]);
const _sfc_main$5$1 = {
  name: "DockRightIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$5$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$3$1 = ["fill", "width", "height"];
const _hoisted_3$3$1 = { d: "M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M15 18H4V6H15Z" };
const _hoisted_4$3$1 = { key: 0 };
function _sfc_render$4$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon dock-right-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$3$1, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$3$1, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$3$1))
  ], 16, _hoisted_1$5$1);
}
const IconDockRight = /* @__PURE__ */ _export_sfc(_sfc_main$5$1, [["render", _sfc_render$4$1]]);
const _sfc_main$4$1 = {
  name: "StarIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$4$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$2$2 = ["fill", "width", "height"];
const _hoisted_3$2$2 = { d: "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" };
const _hoisted_4$2$2 = { key: 0 };
function _sfc_render$3$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon star-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$2$2, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$2$2, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$2$2))
  ], 16, _hoisted_1$4$1);
}
const IconStar = /* @__PURE__ */ _export_sfc(_sfc_main$4$1, [["render", _sfc_render$3$2]]);
const _sfc_main$3$2 = {
  name: "StarOutlineIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$3$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$1$2 = ["fill", "width", "height"];
const _hoisted_3$1$2 = { d: "M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" };
const _hoisted_4$1$2 = { key: 0 };
function _sfc_render$2$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon star-outline-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$1$2, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$1$2, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$1$2))
  ], 16, _hoisted_1$3$1);
}
const IconStarOutline = /* @__PURE__ */ _export_sfc(_sfc_main$3$2, [["render", _sfc_render$2$2]]);
const _hoisted_1$2$2 = ["aria-selected", "tabindex"];
const _sfc_main$2$2 = /* @__PURE__ */ defineComponent({
  __name: "NcAppSidebarTabsButton",
  props: /* @__PURE__ */ mergeModels({
    tab: {}
  }, {
    "selected": { type: Boolean, ...{ required: true } },
    "selectedModifiers": {}
  }),
  emits: ["update:selected"],
  setup(__props) {
    const selected = useModel(__props, "selected");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["button-vue", [_ctx.$style.sidebarTabsButton, {
          [_ctx.$style.sidebarTabsButton_selected]: selected.value,
          [_ctx.$style.sidebarTabsButton_legacy]: unref(isLegacy34)
        }]]),
        role: "tab",
        "aria-selected": selected.value,
        tabindex: selected.value ? 0 : -1,
        onClick: _cache[0] || (_cache[0] = ($event) => selected.value = true)
      }, [
        createBaseVNode("span", {
          class: normalizeClass(_ctx.$style.sidebarTabsButton__icon)
        }, [
          createVNode(_sfc_main$x, {
            vnodes: __props.tab.renderIcon()
          }, {
            default: withCtx(() => [
              createBaseVNode("span", {
                class: normalizeClass([_ctx.$style.sidebarTabsButton__legacyIcon, __props.tab.icon])
              }, null, 2)
            ]),
            _: 1
          }, 8, ["vnodes"])
        ], 2),
        createBaseVNode("span", {
          class: normalizeClass(_ctx.$style.sidebarTabsButton__name)
        }, toDisplayString(__props.tab.name), 3)
      ], 10, _hoisted_1$2$2);
    };
  }
});
const sidebarTabsButton = "_sidebarTabsButton_OCROY";
const sidebarTabsButton_legacy = "_sidebarTabsButton_legacy_e9-y9";
const sidebarTabsButton_selected = "_sidebarTabsButton_selected_S48M1";
const sidebarTabsButton__name = "_sidebarTabsButton__name_GZRY8";
const sidebarTabsButton__icon = "_sidebarTabsButton__icon_ZDmkU";
const sidebarTabsButton__legacyIcon = "_sidebarTabsButton__legacyIcon_y6cLW";
const style0$3 = {
  "material-design-icon": "_material-design-icon_v9SPG",
  sidebarTabsButton,
  sidebarTabsButton_legacy,
  sidebarTabsButton_selected,
  sidebarTabsButton__name,
  sidebarTabsButton__icon,
  sidebarTabsButton__legacyIcon
};
const cssModules$3 = {
  "$style": style0$3
};
const NcAppSidebarTabsButton = /* @__PURE__ */ _export_sfc(_sfc_main$2$2, [["__cssModules", cssModules$3]]);
const _sfc_main$1$6 = {
  name: "NcAppSidebarTabs",
  components: {
    NcAppSidebarTabsButton
  },
  provide() {
    return {
      registerTab: this.registerTab,
      unregisterTab: this.unregisterTab,
      // Getter as an alternative to Vue 2.7 computed(() => this.activeTab)
      getActiveTab: () => this.activeTab,
      // Used to check whether the tab header is shown so the tabs can reference the tab header for `aria-labelledby` or not
      isTablistShown: () => this.hasMultipleTabs
    };
  },
  props: {
    /**
     * Id of the tab to activate
     */
    active: {
      type: String,
      default: ""
    },
    /**
     * Force the tab navigation to display even if there is only one tab
     */
    forceTabs: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:active"],
  data(props) {
    return {
      /**
       * Tab descriptions from the passed NcSidebarTab components' props to build the tab navbar from.
       */
      tabs: [],
      /**
       * Local active (open) tab's ID. It allows to use component without v-model:active
       */
      activeTab: props.active,
      isLegacy34
    };
  },
  computed: {
    /**
     * Has multiple tabs. If only one tab - its content is shown without navigation
     *
     * @return {boolean}
     */
    hasMultipleTabs() {
      return this.tabs.length > 1;
    },
    showForSingleTab() {
      return this.forceTabs && this.tabs.length === 1;
    },
    currentTabIndex() {
      return this.tabs.findIndex((tab) => tab.id === this.activeTab);
    }
  },
  watch: {
    tabs() {
      if (this.active) {
        this.updateActive();
      }
    },
    active(active) {
      if (active !== this.activeTab) {
        this.updateActive();
      }
    }
  },
  methods: {
    /**
     * Set the current active tab
     *
     * @param {string} id the id of the tab
     */
    setActive(id) {
      this.activeTab = id;
      this.$emit("update:active", this.activeTab);
    },
    /**
     * Focus the previous tab
     * and emit to the parent component
     */
    focusPreviousTab() {
      if (this.currentTabIndex > 0) {
        this.setActive(this.tabs[this.currentTabIndex - 1].id);
      }
      this.focusActiveTab();
    },
    /**
     * Focus the next tab
     * and emit to the parent component
     */
    focusNextTab() {
      if (this.currentTabIndex < this.tabs.length - 1) {
        this.setActive(this.tabs[this.currentTabIndex + 1].id);
      }
      this.focusActiveTab();
    },
    /**
     * Focus the first tab
     * and emit to the parent component
     */
    focusFirstTab() {
      this.setActive(this.tabs[0].id);
      this.focusActiveTab();
    },
    /**
     * Focus the last tab
     * and emit to the parent component
     */
    focusLastTab() {
      this.setActive(this.tabs[this.tabs.length - 1].id);
      this.focusActiveTab();
    },
    /**
     * Focus the current active tab
     */
    focusActiveTab() {
      this.$el.querySelector(`#tab-button-${this.activeTab}`).focus();
    },
    /**
     * Focus the content on tab
     * see aria accessibility guidelines
     */
    focusActiveTabContent() {
      this.$el.querySelector("#tab-" + this.activeTab).focus();
    },
    /**
     * Update the current active tab
     */
    updateActive() {
      this.activeTab = this.active && this.tabs.some(({ id }) => id === this.active) ? this.active : this.tabs[0]?.id ?? "";
    },
    /**
     * Register child tab in the tabs
     *
     * @param {object} tab child tab passed to slot
     */
    registerTab(tab) {
      this.tabs.push(tab);
      this.tabs.sort((a, b2) => {
        if (a.order === b2.order) {
          return a.name.localeCompare(b2.name, [getCanonicalLocale()]);
        }
        return a.order - b2.order;
      });
      this.updateActive();
    },
    /**
     * Unregister child tab from the tabs
     *
     * @param {string} id tab's id
     */
    unregisterTab(id) {
      const tabIndex = this.tabs.findIndex((tab) => tab.id === id);
      if (tabIndex !== -1) {
        this.tabs.splice(tabIndex, 1);
      }
      if (this.activeTab === id) {
        this.updateActive();
      }
    }
  }
};
const _hoisted_1$1$4 = { class: "app-sidebar-tabs" };
function _sfc_render$1$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcAppSidebarTabsButton = resolveComponent("NcAppSidebarTabsButton");
  return openBlock(), createElementBlock("div", _hoisted_1$1$4, [
    $options.hasMultipleTabs || $options.showForSingleTab ? (openBlock(), createElementBlock("div", {
      key: 0,
      role: "tablist",
      class: normalizeClass(["app-sidebar-tabs__nav", { "app-sidebar-tabs__nav--legacy": $data.isLegacy34 }]),
      onKeydown: [
        _cache[0] || (_cache[0] = withKeys(withModifiers((...args) => $options.focusPreviousTab && $options.focusPreviousTab(...args), ["exact", "prevent", "stop"]), ["left"])),
        _cache[1] || (_cache[1] = withKeys(withModifiers((...args) => $options.focusNextTab && $options.focusNextTab(...args), ["exact", "prevent", "stop"]), ["right"])),
        _cache[2] || (_cache[2] = withKeys(withModifiers((...args) => $options.focusActiveTabContent && $options.focusActiveTabContent(...args), ["exact", "prevent", "stop"]), ["tab"])),
        _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => $options.focusFirstTab && $options.focusFirstTab(...args), ["exact", "prevent", "stop"]), ["home"])),
        _cache[4] || (_cache[4] = withKeys(withModifiers((...args) => $options.focusLastTab && $options.focusLastTab(...args), ["exact", "prevent", "stop"]), ["end"])),
        _cache[5] || (_cache[5] = withKeys(withModifiers((...args) => $options.focusFirstTab && $options.focusFirstTab(...args), ["exact", "prevent", "stop"]), ["page-up"])),
        _cache[6] || (_cache[6] = withKeys(withModifiers((...args) => $options.focusLastTab && $options.focusLastTab(...args), ["exact", "prevent", "stop"]), ["page-down"]))
      ]
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.tabs, (tab) => {
        return openBlock(), createBlock(_component_NcAppSidebarTabsButton, {
          id: `tab-button-${tab.id}`,
          key: tab.id,
          class: "app-sidebar-tabs__tab",
          "aria-controls": `tab-${tab.id}`,
          selected: $data.activeTab === tab.id,
          tab,
          "onUpdate:selected": ($event) => $options.setActive(tab.id)
        }, null, 8, ["id", "aria-controls", "selected", "tab", "onUpdate:selected"]);
      }), 128))
    ], 34)) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass(["app-sidebar-tabs__content", { "app-sidebar-tabs__content--multiple": $options.hasMultipleTabs }])
    }, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 2)
  ]);
}
const NcAppSidebarTabs = /* @__PURE__ */ _export_sfc(_sfc_main$1$6, [["render", _sfc_render$1$3], ["__scopeId", "data-v-e74d1502"]]);
register(t15);
const _sfc_main$u = {
  name: "NcAppSidebar",
  components: {
    NcActions,
    NcAppSidebarHeader: _sfc_main$w,
    NcAppSidebarTabs,
    NcButton,
    NcLoadingIcon,
    NcEmptyContent,
    IconArrowRight,
    IconClose,
    IconDockRight,
    IconStar,
    IconStarOutline
  },
  directives: {
    Focus: directive$1,
    /** @type {import('vue').ObjectDirective} */
    ClickOutside: vOnClickOutside
  },
  inject: {
    ncContentSelector: {
      from: CONTENT_SELECTOR_KEY,
      default: void 0
    }
  },
  props: {
    /**
     * The active tab
     */
    active: {
      type: String,
      default: ""
    },
    /**
     * Main text of the sidebar
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Allow to edit the sidebar name.
     */
    nameEditable: {
      type: Boolean,
      default: false
    },
    /**
     * Placeholder in the edit field if the name is editable.
     */
    namePlaceholder: {
      type: String,
      default: ""
    },
    /**
     * Secondary name of the sidebar (subline)
     */
    subname: {
      type: String,
      default: ""
    },
    /**
     * Title to display for the subname.
     */
    subtitle: {
      type: String,
      default: ""
    },
    /**
     * Url to the top header background image
     * Applied with css
     */
    background: {
      type: String,
      default: ""
    },
    /**
     * Enable the favourite icon if not null
     * See fired events
     */
    starred: {
      type: Boolean,
      default: null
    },
    /**
     * Show loading spinner instead of the star icon
     */
    starLoading: {
      type: Boolean,
      default: false
    },
    /**
     * Show loading spinner instead of tabs
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Display the sidebar in compact mode
     */
    compact: {
      type: Boolean,
      default: false
    },
    /**
     * Only display close button and default slot content.
     * Don't display other header content and primary and secondary actions.
     * Useful when showing the EmptyContent component as content.
     */
    empty: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Force the tab navigation to display even if there is only one tab
     */
    forceTabs: {
      type: Boolean,
      default: false
    },
    /**
     * Linkify the name
     */
    linkifyName: {
      type: Boolean,
      default: false
    },
    /**
     * Title to display for the name.
     * Can be set to the same text in case it's too long.
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * Allow to conditionally show the sidebar
     * You can also use `v-if` on the sidebar, but using the open prop allow to keep
     * the sidebar inside the DOM for performance if it is opened and closed multiple times.
     *
     * When using the `open` property to close the sidebar a built-in toggle button will be shown to reopen it,
     * similar to the app navigation. You can remove this button with the `no-toggle` prop.
     */
    open: {
      type: Boolean,
      default: true
    },
    /**
     * Custom classes to assign to the sidebar toggle button.
     * If needed this can be used to assign styles to the button using `:deep()` selector.
     */
    toggleClasses: {
      type: [String, Array, Object],
      default: ""
    },
    /**
     * Custom attrs to assign to the sidebar toggle button.
     */
    toggleAttrs: {
      type: Object,
      default: void 0
    },
    /**
     * Do not add the built-in toggle button with `open` prop.
     */
    noToggle: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "close",
    "closed",
    "opened",
    // 'figureClick', not emitted on purpose to make "hasFigureClickListener" work
    "update:active",
    "update:name",
    "update:nameEditable",
    "update:open",
    "update:starred",
    "submitName",
    "dismissEditing"
  ],
  setup() {
    const headerRef = ref(null);
    provide("NcAppSidebar:header:ref", headerRef);
    return {
      uid: createElementId(),
      isMobile: useIsSmallMobile(),
      headerRef
    };
  },
  data() {
    return {
      changeNameTranslated: t("Change name"),
      closeTranslated: t("Close sidebar"),
      favoriteTranslated: t("Favorite"),
      isStarred: this.starred,
      focusTrap: null,
      elementToReturnFocus: null
    };
  },
  computed: {
    canStar() {
      return this.isStarred !== null;
    },
    hasFigureClickListener() {
      return !!this.$attrs.onFigureClick;
    }
  },
  watch: {
    starred() {
      this.isStarred = this.starred;
    },
    isMobile() {
      this.toggleFocusTrap();
    },
    open() {
      this.checkToggleButtonContainerAvailability();
    }
  },
  created() {
    this.preserveElementToReturnFocus();
    this.checkToggleButtonContainerAvailability();
  },
  beforeUnmount() {
    this.$emit("closed");
    this.focusTrap?.deactivate();
  },
  methods: {
    isSlotPopulated,
    t,
    preserveElementToReturnFocus() {
      if (document.activeElement && document.activeElement !== document.body) {
        this.elementToReturnFocus = document.activeElement;
        if (this.elementToReturnFocus.getAttribute("role") === "menuitem") {
          const menu = this.elementToReturnFocus.closest('[role="menu"]');
          if (menu) {
            const menuTrigger = document.querySelector(`[aria-controls="${menu.id}"]`);
            this.elementToReturnFocus = menuTrigger;
          }
        }
      }
    },
    initFocusTrap() {
      if (this.focusTrap) {
        return;
      }
      this.focusTrap = createFocusTrap([
        // The sidebar itself
        this.$refs.sidebar,
        // Nextcloud Server header navigation
        document.querySelector("#header")
      ], {
        allowOutsideClick: true,
        fallbackFocus: this.$refs.closeButton.$el,
        trapStack: getTrapStack(),
        escapeDeactivates: false
      });
    },
    /**
     * Activate focus trap if it is currently needed, otherwise deactivate
     */
    toggleFocusTrap() {
      if (this.open && this.isMobile) {
        this.initFocusTrap();
        this.focusTrap.activate();
      } else {
        this.focusTrap?.deactivate();
      }
    },
    /**
     * Close the sidebar on pressing the escape key on mobile
     *
     * @param {KeyboardEvent} event key down event
     */
    onKeydownEsc(event) {
      if (this.isMobile) {
        event.stopPropagation();
        this.closeSidebar();
      }
    },
    onAfterEnter(element) {
      if (this.elementToReturnFocus) {
        this.focus();
      }
      this.toggleFocusTrap();
      this.$emit("opened", element);
    },
    onAfterLeave(element) {
      this.$emit("closed", element);
      this.toggleFocusTrap();
      this.elementToReturnFocus?.focus({ focusVisible: true });
      this.elementToReturnFocus = null;
    },
    /**
     * Used to tell parent component the user asked to close the sidebar
     *
     * @param {Event} e close icon click event
     */
    closeSidebar(e) {
      this.$emit("close", e);
      this.$emit("update:open", false);
    },
    /**
     * Emit figure click event to parent component
     *
     * @param {Event} e click event
     */
    onFigureClick(e) {
      this.$emit("figureClick", e);
    },
    /**
     * Toggle the favourite state
     * and emit to the parent component
     */
    toggleStarred() {
      this.isStarred = !this.isStarred;
      this.$emit("update:starred", this.isStarred);
    },
    async editName() {
      this.$emit("update:nameEditable", true);
      if (this.nameEditable) {
        await this.$nextTick();
        this.$refs.nameInput.focus();
      }
    },
    /**
     * Focus the sidebar
     *
     * @public
     */
    focus() {
      if (!this.open && !this.noToggle) {
        this.$refs.toggle.$el.focus();
        return;
      }
      try {
        this.headerRef.focus();
      } catch {
      }
    },
    /**
     * Focus the active tab
     *
     * @public
     */
    focusActiveTabContent() {
      this.preserveElementToReturnFocus();
      this.$refs.tabs.focusActiveTabContent();
    },
    /**
     * Check if the toggle button container is available
     */
    checkToggleButtonContainerAvailability() {
      if (this.open === false && !this.noToggle && !this.ncContentSelector) {
        logger.warn("[NcAppSidebar] It looks like you want to use NcAppSidebar with the built-in toggle button. This feature is only available when NcAppSidebar is used in NcContent.");
      }
    },
    /**
     * Emit name change event to parent component
     *
     * @param {Event} event input event
     */
    onNameInput(event) {
      this.$emit("update:name", event.target.value);
    },
    /**
     * Emit when the name form edit confirm button is pressed in order
     * to change the name.
     *
     * @param {Event} event submit event
     */
    onSubmitName(event) {
      this.$emit("update:nameEditable", false);
      this.$emit("submitName", event);
    },
    onDismissEditing() {
      this.$emit("update:nameEditable", false);
      this.$emit("dismissEditing");
    },
    onUpdateActive(activeTab) {
      this.$emit("update:active", activeTab);
    }
  }
};
const _hoisted_1$q = ["aria-labelledby"];
const _hoisted_2$i = { class: "app-sidebar-header__info" };
const _hoisted_3$e = {
  key: 0,
  class: "app-sidebar-header__tertiary-actions"
};
const _hoisted_4$d = { class: "app-sidebar-header__name-container" };
const _hoisted_5$8 = { class: "app-sidebar-header__mainname-container" };
const _hoisted_6$7 = ["placeholder", "value"];
const _hoisted_7$5 = ["title"];
const _hoisted_8$3 = {
  key: 2,
  class: "app-sidebar-header__description"
};
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconDockRight = resolveComponent("IconDockRight");
  const _component_NcButton = resolveComponent("NcButton");
  const _component_NcLoadingIcon = resolveComponent("NcLoadingIcon");
  const _component_IconStar = resolveComponent("IconStar");
  const _component_IconStarOutline = resolveComponent("IconStarOutline");
  const _component_NcAppSidebarHeader = resolveComponent("NcAppSidebarHeader");
  const _component_IconArrowRight = resolveComponent("IconArrowRight");
  const _component_NcActions = resolveComponent("NcActions");
  const _component_IconClose = resolveComponent("IconClose");
  const _component_NcAppSidebarTabs = resolveComponent("NcAppSidebarTabs");
  const _component_NcEmptyContent = resolveComponent("NcEmptyContent");
  const _directive_focus = resolveDirective("focus");
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createBlock(Transition, {
    appear: "",
    name: "slide-right",
    onAfterEnter: $options.onAfterEnter,
    onAfterLeave: $options.onAfterLeave
  }, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("aside", {
        id: "app-sidebar-vue",
        ref: "sidebar",
        class: "app-sidebar",
        "aria-labelledby": `app-sidebar-vue-${$setup.uid}__header`,
        onKeydown: _cache[6] || (_cache[6] = withKeys((...args) => $options.onKeydownEsc && $options.onKeydownEsc(...args), ["esc"]))
      }, [
        $options.ncContentSelector && !$props.open && !$props.noToggle ? (openBlock(), createBlock(Teleport, {
          key: 0,
          to: $options.ncContentSelector
        }, [
          createVNode(_component_NcButton, mergeProps({
            ref: "toggle",
            "aria-label": $options.t("Open sidebar"),
            class: ["app-sidebar__toggle", $props.toggleClasses],
            variant: "tertiary"
          }, $props.toggleAttrs, {
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:open", true))
          }), {
            icon: withCtx(() => [
              renderSlot(_ctx.$slots, "toggle-icon", {}, () => [
                createVNode(_component_IconDockRight, { size: 20 })
              ], true)
            ]),
            _: 3
          }, 16, ["aria-label", "class"])
        ], 8, ["to"])) : createCommentVNode("", true),
        createBaseVNode("header", {
          class: normalizeClass(["app-sidebar-header", {
            "app-sidebar-header--with-figure": $options.isSlotPopulated(_ctx.$slots.header?.()) || $props.background,
            "app-sidebar-header--compact": $props.compact
          }])
        }, [
          !$props.empty ? renderSlot(_ctx.$slots, "info", { key: 0 }, () => [
            createBaseVNode("div", _hoisted_2$i, [
              $options.isSlotPopulated(_ctx.$slots.header?.()) || $props.background ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["app-sidebar-header__figure", {
                  "app-sidebar-header__figure--with-action": $options.hasFigureClickListener
                }]),
                style: normalizeStyle({
                  backgroundImage: `url(${$props.background})`
                }),
                tabindex: "0",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.onFigureClick && $options.onFigureClick(...args)),
                onKeydown: _cache[2] || (_cache[2] = withKeys((...args) => $options.onFigureClick && $options.onFigureClick(...args), ["enter"]))
              }, [
                renderSlot(_ctx.$slots, "header", { class: "app-sidebar-header__background" }, void 0, true)
              ], 38)) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: normalizeClass(["app-sidebar-header__desc", {
                  "app-sidebar-header__desc--with-tertiary-action": $options.canStar || $options.isSlotPopulated(_ctx.$slots["tertiary-actions"]?.()),
                  "app-sidebar-header__desc--editable": $props.nameEditable && !$props.subname,
                  "app-sidebar-header__desc--with-subname--editable": $props.nameEditable && $props.subname,
                  "app-sidebar-header__desc--without-actions": !$options.isSlotPopulated(_ctx.$slots["secondary-actions"]?.())
                }])
              }, [
                $options.canStar || $options.isSlotPopulated(_ctx.$slots["tertiary-actions"]?.()) ? (openBlock(), createElementBlock("div", _hoisted_3$e, [
                  renderSlot(_ctx.$slots, "tertiary-actions", {}, () => [
                    $options.canStar ? (openBlock(), createBlock(_component_NcButton, {
                      key: 0,
                      "aria-label": $data.favoriteTranslated,
                      pressed: $data.isStarred,
                      class: "app-sidebar-header__star",
                      variant: "secondary",
                      onClick: withModifiers($options.toggleStarred, ["prevent"])
                    }, {
                      icon: withCtx(() => [
                        $props.starLoading ? (openBlock(), createBlock(_component_NcLoadingIcon, { key: 0 })) : $data.isStarred ? (openBlock(), createBlock(_component_IconStar, {
                          key: 1,
                          size: 20
                        })) : (openBlock(), createBlock(_component_IconStarOutline, {
                          key: 2,
                          size: 20
                        }))
                      ]),
                      _: 1
                    }, 8, ["aria-label", "pressed", "onClick"])) : createCommentVNode("", true)
                  ], true)
                ])) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_4$d, [
                  createBaseVNode("div", _hoisted_5$8, [
                    withDirectives(createVNode(_component_NcAppSidebarHeader, {
                      class: "app-sidebar-header__mainname",
                      name: $props.name,
                      linkify: $props.linkifyName,
                      title: $props.title,
                      tabindex: $props.nameEditable ? 0 : -1,
                      onClick: withModifiers($options.editName, ["self"])
                    }, null, 8, ["name", "linkify", "title", "tabindex", "onClick"]), [
                      [vShow, !$props.nameEditable]
                    ]),
                    $props.nameEditable ? withDirectives((openBlock(), createElementBlock("form", {
                      key: 0,
                      class: "app-sidebar-header__mainname-form",
                      onSubmit: _cache[5] || (_cache[5] = withModifiers((...args) => $options.onSubmitName && $options.onSubmitName(...args), ["prevent"]))
                    }, [
                      withDirectives(createBaseVNode("input", {
                        ref: "nameInput",
                        class: "app-sidebar-header__mainname-input",
                        type: "text",
                        placeholder: $props.namePlaceholder,
                        value: $props.name,
                        onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => $options.onDismissEditing && $options.onDismissEditing(...args), ["stop"]), ["esc"])),
                        onInput: _cache[4] || (_cache[4] = (...args) => $options.onNameInput && $options.onNameInput(...args))
                      }, null, 40, _hoisted_6$7), [
                        [_directive_focus]
                      ]),
                      createVNode(_component_NcButton, {
                        "aria-label": $data.changeNameTranslated,
                        type: "submit",
                        variant: "tertiary-no-background"
                      }, {
                        icon: withCtx(() => [
                          createVNode(_component_IconArrowRight, { size: 20 })
                        ]),
                        _: 1
                      }, 8, ["aria-label"])
                    ], 32)), [
                      [_directive_click_outside, () => $options.onSubmitName()]
                    ]) : createCommentVNode("", true),
                    $options.isSlotPopulated(_ctx.$slots["secondary-actions"]?.()) ? (openBlock(), createBlock(_component_NcActions, {
                      key: 1,
                      class: "app-sidebar-header__menu",
                      forceMenu: $props.forceMenu
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "secondary-actions", {}, void 0, true)
                      ]),
                      _: 3
                    }, 8, ["forceMenu"])) : createCommentVNode("", true)
                  ]),
                  $props.subname.trim() !== "" || _ctx.$slots["subname"] ? (openBlock(), createElementBlock("p", {
                    key: 0,
                    title: $props.subtitle || void 0,
                    class: "app-sidebar-header__subname"
                  }, [
                    renderSlot(_ctx.$slots, "subname", {}, () => [
                      createTextVNode(toDisplayString($props.subname), 1)
                    ], true)
                  ], 8, _hoisted_7$5)) : createCommentVNode("", true)
                ])
              ], 2)
            ])
          ], true) : (openBlock(), createBlock(_component_NcAppSidebarHeader, {
            key: 1,
            class: "app-sidebar-header__mainname--hidden",
            name: $props.name,
            tabindex: "-1"
          }, null, 8, ["name"])),
          createVNode(_component_NcButton, {
            ref: "closeButton",
            "aria-label": $data.closeTranslated,
            title: $data.closeTranslated,
            class: "app-sidebar__close",
            variant: "tertiary",
            onClick: withModifiers($options.closeSidebar, ["prevent"])
          }, {
            icon: withCtx(() => [
              createVNode(_component_IconClose, { size: 20 })
            ]),
            _: 1
          }, 8, ["aria-label", "title", "onClick"]),
          $options.isSlotPopulated(_ctx.$slots.description?.()) && !$props.empty ? (openBlock(), createElementBlock("div", _hoisted_8$3, [
            renderSlot(_ctx.$slots, "description", {}, void 0, true)
          ])) : createCommentVNode("", true)
        ], 2),
        withDirectives(createVNode(_component_NcAppSidebarTabs, {
          ref: "tabs",
          active: $props.active,
          forceTabs: $props.forceTabs,
          "onUpdate:active": $options.onUpdateActive
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          _: 3
        }, 8, ["active", "forceTabs", "onUpdate:active"]), [
          [vShow, !$props.loading]
        ]),
        $props.loading ? (openBlock(), createBlock(_component_NcEmptyContent, { key: 1 }, {
          icon: withCtx(() => [
            createVNode(_component_NcLoadingIcon, { size: 64 })
          ]),
          _: 1
        })) : createCommentVNode("", true)
      ], 40, _hoisted_1$q), [
        [vShow, $props.open]
      ])
    ]),
    _: 3
  }, 8, ["onAfterEnter", "onAfterLeave"]);
}
const NcAppSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$g], ["__scopeId", "data-v-e8979b7f"]]);
register(t30);
const contentSvg = '<!--\n  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors\n  - SPDX-License-Identifier: AGPL-3.0-or-later\n-->\n<svg width="395" height="314" viewBox="0 0 395 314" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="395" height="314" rx="11" fill="#439DCD"/>\n<rect x="13" y="51" width="366" height="248" rx="8" fill="white"/>\n<rect x="22" y="111" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="127" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="63" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="191" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="143" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="79" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="159" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="95" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="175" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<path d="M288 145C277.56 147.8 265.32 149 254 149C242.68 149 230.44 147.8 220 145L218 153C225.44 155 234 156.32 242 157V209H250V185H258V209H266V157C274 156.32 282.56 155 290 153L288 145ZM254 145C258.4 145 262 141.4 262 137C262 132.6 258.4 129 254 129C249.6 129 246 132.6 246 137C246 141.4 249.6 145 254 145Z" fill="#DEDEDE"/>\n<path d="M43.5358 13C38.6641 13 34.535 16.2415 33.2552 20.6333C32.143 18.3038 29.7327 16.6718 26.9564 16.6718C23.1385 16.6718 20 19.7521 20 23.4993C20 27.2465 23.1385 30.3282 26.9564 30.3282C29.7327 30.3282 32.1429 28.6952 33.2552 26.3653C34.535 30.7575 38.6641 34 43.5358 34C48.3715 34 52.4796 30.8064 53.7921 26.4637C54.9249 28.7407 57.3053 30.3282 60.0421 30.3282C63.8601 30.3282 67 27.2465 67 23.4993C67 19.7521 63.8601 16.6718 60.0421 16.6718C57.3053 16.6718 54.9249 18.2583 53.7921 20.5349C52.4796 16.1926 48.3715 13 43.5358 13ZM43.5358 17.0079C47.2134 17.0079 50.1512 19.8899 50.1512 23.4993C50.1512 27.1087 47.2134 29.9921 43.5358 29.9921C39.8583 29.9921 36.9218 27.1087 36.9218 23.4993C36.9218 19.8899 39.8583 17.0079 43.5358 17.0079ZM26.9564 20.6797C28.5677 20.6797 29.8307 21.9179 29.8307 23.4993C29.8307 25.0807 28.5677 26.3203 26.9564 26.3203C25.3452 26.3203 24.0836 25.0807 24.0836 23.4993C24.0836 21.9179 25.3452 20.6797 26.9564 20.6797ZM60.0421 20.6797C61.6534 20.6797 62.9164 21.9179 62.9164 23.4993C62.9164 25.0807 61.6534 26.3203 60.0421 26.3203C58.4309 26.3203 57.1693 25.0807 57.1693 23.4993C57.1693 21.9179 58.4309 20.6797 60.0421 20.6797Z" fill="white"/>\n<rect x="79" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="99" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="119" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="139" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="159" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="179" y="20" width="8" height="8" rx="4" fill="white"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37258 0 0 5.37259 0 12V302C0 308.627 5.37259 314 12 314H383C389.627 314 395 308.627 395 302V12C395 5.37258 389.627 0 383 0H12ZM140 44C132.268 44 126 50.268 126 58V292C126 299.732 132.268 306 140 306H372C379.732 306 386 299.732 386 292V58C386 50.268 379.732 44 372 44H140Z" fill="black" fill-opacity="0.35"/>\n</svg>\n';
const navigationSvg = '<!--\n  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors\n  - SPDX-License-Identifier: AGPL-3.0-or-later\n-->\n<svg width="395" height="314" viewBox="0 0 395 314" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect width="395" height="314" rx="11" fill="#439DCD"/>\n<rect x="13" y="51" width="366" height="248" rx="8" fill="white"/>\n<rect x="22" y="111" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="127" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="63" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="191" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="143" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="79" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="159" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="95" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<rect x="22" y="175" width="92" height="12" rx="6" fill="#DEDEDE"/>\n<path d="M288 145C277.56 147.8 265.32 149 254 149C242.68 149 230.44 147.8 220 145L218 153C225.44 155 234 156.32 242 157V209H250V185H258V209H266V157C274 156.32 282.56 155 290 153L288 145ZM254 145C258.4 145 262 141.4 262 137C262 132.6 258.4 129 254 129C249.6 129 246 132.6 246 137C246 141.4 249.6 145 254 145Z" fill="#DEDEDE"/>\n<path d="M43.5358 13C38.6641 13 34.535 16.2415 33.2552 20.6333C32.143 18.3038 29.7327 16.6718 26.9564 16.6718C23.1385 16.6718 20 19.7521 20 23.4993C20 27.2465 23.1385 30.3282 26.9564 30.3282C29.7327 30.3282 32.1429 28.6952 33.2552 26.3653C34.535 30.7575 38.6641 34 43.5358 34C48.3715 34 52.4796 30.8064 53.7921 26.4637C54.9249 28.7407 57.3053 30.3282 60.0421 30.3282C63.8601 30.3282 67 27.2465 67 23.4993C67 19.7521 63.8601 16.6718 60.0421 16.6718C57.3053 16.6718 54.9249 18.2583 53.7921 20.5349C52.4796 16.1926 48.3715 13 43.5358 13ZM43.5358 17.0079C47.2134 17.0079 50.1512 19.8899 50.1512 23.4993C50.1512 27.1087 47.2134 29.9921 43.5358 29.9921C39.8583 29.9921 36.9218 27.1087 36.9218 23.4993C36.9218 19.8899 39.8583 17.0079 43.5358 17.0079ZM26.9564 20.6797C28.5677 20.6797 29.8307 21.9179 29.8307 23.4993C29.8307 25.0807 28.5677 26.3203 26.9564 26.3203C25.3452 26.3203 24.0836 25.0807 24.0836 23.4993C24.0836 21.9179 25.3452 20.6797 26.9564 20.6797ZM60.0421 20.6797C61.6534 20.6797 62.9164 21.9179 62.9164 23.4993C62.9164 25.0807 61.6534 26.3203 60.0421 26.3203C58.4309 26.3203 57.1693 25.0807 57.1693 23.4993C57.1693 21.9179 58.4309 20.6797 60.0421 20.6797Z" fill="white"/>\n<rect x="79" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="99" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="119" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="139" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="159" y="20" width="8" height="8" rx="4" fill="white"/>\n<rect x="179" y="20" width="8" height="8" rx="4" fill="white"/>\n<path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37258 0 0 5.37259 0 12V302C0 308.627 5.37259 314 12 314H383C389.627 314 395 308.627 395 302V12C395 5.37258 389.627 0 383 0H12ZM112 44C119.732 44 126 50.268 126 58V292C126 299.732 119.732 306 112 306H20C12.268 306 6 299.732 6 292V58C6 50.268 12.268 44 20 44H112Z" fill="black" fill-opacity="0.35"/>\n</svg>\n';
const _hoisted_1$p = { class: "vue-skip-actions__container" };
const _hoisted_2$h = { class: "vue-skip-actions__headline" };
const _hoisted_3$d = { class: "vue-skip-actions__buttons" };
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "NcContent",
  props: {
    appName: {}
  },
  setup(__props) {
    const props = __props;
    provide(HAS_APP_NAVIGATION_KEY, setAppNavigation);
    provide(CONTENT_SELECTOR_KEY, "#content-vue");
    provide("appName", computed(() => props.appName));
    const isMobile2 = useIsMobile();
    const hasAppNavigation = ref(false);
    const currentFocus = ref();
    const currentImage = computed(() => currentFocus.value === "navigation" ? navigationSvg : contentSvg);
    onBeforeMount(() => {
      const container = document.getElementById("skip-actions");
      if (container) {
        container.innerHTML = "";
        container.classList.add("vue-skip-actions");
      }
    });
    function openAppNavigation() {
      emit("toggle-navigation", { open: true });
      nextTick(() => {
        window.location.hash = "app-navigation-vue";
        document.getElementById("app-navigation-vue").focus();
      });
    }
    function setAppNavigation(value) {
      hasAppNavigation.value = value;
      if (!currentFocus.value) {
        currentFocus.value = "navigation";
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        id: "content-vue",
        class: normalizeClass(["content", [`app-${__props.appName.toLowerCase()}`, { "content--legacy": unref(isLegacy34) }]])
      }, [
        (openBlock(), createBlock(Teleport, { to: "#skip-actions" }, [
          createBaseVNode("div", _hoisted_1$p, [
            createBaseVNode("div", _hoisted_2$h, toDisplayString(unref(t)("Keyboard navigation help")), 1),
            createBaseVNode("div", _hoisted_3$d, [
              withDirectives(createVNode(NcButton, {
                href: "#app-navigation-vue",
                variant: "tertiary",
                onClick: withModifiers(openAppNavigation, ["prevent"]),
                onFocusin: _cache[0] || (_cache[0] = ($event) => currentFocus.value = "navigation"),
                onMouseover: _cache[1] || (_cache[1] = ($event) => currentFocus.value = "navigation")
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("Skip to app navigation")), 1)
                ]),
                _: 1
              }, 512), [
                [vShow, hasAppNavigation.value]
              ]),
              createVNode(NcButton, {
                href: "#app-content-vue",
                variant: "tertiary",
                onFocusin: _cache[2] || (_cache[2] = ($event) => currentFocus.value = "content"),
                onMouseover: _cache[3] || (_cache[3] = ($event) => currentFocus.value = "content")
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("Skip to main content")), 1)
                ]),
                _: 1
              })
            ]),
            withDirectives(createVNode(NcIconSvgWrapper, {
              class: "vue-skip-actions__image",
              svg: currentImage.value,
              size: "auto"
            }, null, 8, ["svg"]), [
              [vShow, !unref(isMobile2)]
            ])
          ])
        ])),
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 2);
    };
  }
});
const NcContent = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-d13dcb98"]]);
const ActionGlobalMixin = {
  beforeUpdate() {
    this.text = this.getText();
  },
  data() {
    return {
      // $slots are not reactive.
      // We need to update  the content manually
      text: this.getText()
    };
  },
  computed: {
    isLongText() {
      return this.text && this.text.trim().length > 20;
    }
  },
  methods: {
    getText() {
      return this.$slots.default?.()[0].children?.trim?.() || "";
    }
  }
};
const ActionTextMixin = {
  mixins: [ActionGlobalMixin],
  props: {
    /**
     * Icon to show with the action, can be either a CSS class or an URL
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * Whether we close the Actions menu after the click
     */
    closeAfterClick: {
      type: Boolean,
      default: false
    },
    /**
     * Aria label for the button. Not needed if the button has text.
     */
    ariaLabel: {
      type: String,
      default: null
    }
  },
  inject: {
    closeMenu: {
      from: NC_ACTIONS_CLOSE_MENU
    }
  },
  emits: [
    "click"
  ],
  created() {
    if ("ariaHidden" in this.$attrs) ;
  },
  computed: {
    /**
     * Check if icon prop is an URL
     *
     * @return {boolean} Whether the icon prop is an URL
     */
    isIconUrl() {
      try {
        return !!new URL(this.icon, this.icon.startsWith("/") ? window.location.origin : void 0);
      } catch {
        return false;
      }
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
      if (this.closeAfterClick) {
        this.closeMenu(false);
      }
    }
  }
};
const _sfc_main$s = {
  name: "NcActionButton",
  components: {
    NcIconSvgWrapper
  },
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: NC_ACTIONS_IS_SEMANTIC_MENU,
      default: false
    }
  },
  props: {
    /**
     * disabled state of the action button
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * If this is a menu, a chevron icon will
     * be added at the end of the line
     */
    isMenu: {
      type: Boolean,
      default: false
    },
    /**
     * The button's behavior, by default the button acts like a normal button with optional toggle button behavior if `modelValue` is `true` or `false`.
     * But you can also set to checkbox button behavior with tri-state or radio button like behavior.
     * This extends the native HTML button type attribute.
     */
    type: {
      type: String,
      default: "button",
      validator: (behavior) => ["button", "checkbox", "radio", "reset", "submit"].includes(behavior)
    },
    /**
     * The buttons state if `type` is 'checkbox' or 'radio' (meaning if it is pressed / selected).
     * For checkbox and toggle button behavior - boolean value.
     * For radio button behavior - could be a boolean checked or a string with the value of the button.
     * Note: Unlike native radio buttons, NcActionButton are not grouped by name, so you need to connect them by bind correct modelValue.
     *
     *  **This is not availabe for `type='submit'` or `type='reset'`**
     *
     * If using `type='checkbox'` a `model-value` of `true` means checked, `false` means unchecked and `null` means indeterminate (tri-state)
     * For `type='radio'` `null` is equal to `false`
     */
    modelValue: {
      type: [Boolean, String],
      default: null
    },
    /**
     * The value used for the `modelValue` when this component is used with radio behavior
     * Similar to the `value` attribute of `<input type="radio">`
     */
    value: {
      type: String,
      default: null
    },
    /**
     * Small underlying text content of the entry
     */
    description: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      mdiCheck,
      mdiChevronRight
    };
  },
  computed: {
    /**
     * determines if the action is focusable
     *
     * @return {boolean} is the action focusable ?
     */
    isFocusable() {
      return !this.disabled;
    },
    /**
     * The current "checked" or "pressed" state for the model behavior
     */
    isChecked() {
      if (this.type === "radio" && typeof this.modelValue !== "boolean") {
        return this.modelValue === this.value;
      }
      return this.modelValue;
    },
    /**
     * The native HTML type to set on the button
     */
    nativeType() {
      if (this.type === "submit" || this.type === "reset") {
        return this.type;
      }
      return "button";
    },
    /**
     * HTML attributes to bind to the <button>
     */
    buttonAttributes() {
      const attributes = {};
      if (this.isInSemanticMenu) {
        attributes.role = "menuitem";
        if (this.type === "radio") {
          attributes.role = "menuitemradio";
          attributes["aria-checked"] = this.isChecked ? "true" : "false";
        } else if (this.type === "checkbox" || this.nativeType === "button" && this.modelValue !== null) {
          attributes.role = "menuitemcheckbox";
          attributes["aria-checked"] = this.modelValue === null ? "mixed" : this.modelValue ? "true" : "false";
        }
      } else if (this.modelValue !== null && this.nativeType === "button") {
        attributes["aria-pressed"] = this.modelValue ? "true" : "false";
      }
      return attributes;
    }
  },
  methods: {
    /**
     * Forward click event, let mixin handle the close-after-click and emit new modelValue if needed
     *
     * @param {MouseEvent} event - The click event
     */
    handleClick(event) {
      this.onClick(event);
      if (this.modelValue !== null || this.type !== "button") {
        if (this.type === "radio") {
          if (typeof this.modelValue !== "boolean") {
            if (!this.isChecked) {
              this.$emit("update:modelValue", this.value);
            }
          } else {
            this.$emit("update:modelValue", !this.isChecked);
          }
        } else {
          this.$emit("update:modelValue", !this.isChecked);
        }
      }
    }
  }
};
const _hoisted_1$o = ["role"];
const _hoisted_2$g = ["aria-label", "disabled", "title", "type"];
const _hoisted_3$c = { class: "action-button__longtext-wrapper" };
const _hoisted_4$c = {
  key: 0,
  class: "action-button__name"
};
const _hoisted_5$7 = ["textContent"];
const _hoisted_6$6 = {
  key: 2,
  class: "action-button__text"
};
const _hoisted_7$4 = ["textContent"];
const _hoisted_8$2 = {
  key: 2,
  class: "action-button__pressed-icon material-design-icon"
};
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcIconSvgWrapper = resolveComponent("NcIconSvgWrapper");
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(["action", { "action--disabled": $props.disabled }]),
    role: $options.isInSemanticMenu && "presentation"
  }, [
    createBaseVNode("button", mergeProps({
      "aria-label": _ctx.ariaLabel,
      class: ["action-button button-vue", {
        "action-button--active": $options.isChecked,
        focusable: $options.isFocusable
      }],
      disabled: $props.disabled,
      title: _ctx.title,
      type: $options.nativeType
    }, $options.buttonAttributes, {
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
    }), [
      renderSlot(_ctx.$slots, "icon", {}, () => [
        createBaseVNode("span", {
          class: normalizeClass([[_ctx.isIconUrl ? "action-button__icon--url" : _ctx.icon], "action-button__icon"]),
          style: normalizeStyle({ backgroundImage: _ctx.isIconUrl ? `url(${_ctx.icon})` : null }),
          "aria-hidden": "true"
        }, null, 6)
      ], true),
      createBaseVNode("span", _hoisted_3$c, [
        _ctx.name ? (openBlock(), createElementBlock("strong", _hoisted_4$c, toDisplayString(_ctx.name), 1)) : createCommentVNode("", true),
        _ctx.isLongText ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: "action-button__longtext",
          textContent: toDisplayString(_ctx.text)
        }, null, 8, _hoisted_5$7)) : (openBlock(), createElementBlock("span", _hoisted_6$6, toDisplayString(_ctx.text), 1)),
        $props.description ? (openBlock(), createElementBlock("span", {
          key: 3,
          class: "action-button__description",
          textContent: toDisplayString($props.description)
        }, null, 8, _hoisted_7$4)) : createCommentVNode("", true)
      ]),
      $props.isMenu ? (openBlock(), createBlock(_component_NcIconSvgWrapper, {
        key: 0,
        class: "action-button__menu-icon",
        directional: "",
        path: $setup.mdiChevronRight
      }, null, 8, ["path"])) : $options.isChecked ? (openBlock(), createBlock(_component_NcIconSvgWrapper, {
        key: 1,
        path: $setup.mdiCheck,
        class: "action-button__pressed-icon"
      }, null, 8, ["path"])) : $options.isChecked === false ? (openBlock(), createElementBlock("span", _hoisted_8$2)) : createCommentVNode("", true),
      createCommentVNode("", true)
    ], 16, _hoisted_2$g)
  ], 10, _hoisted_1$o);
}
const NcActionButton = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$f], ["__scopeId", "data-v-6c2daf4e"]]);
const _sfc_main$1$5 = {
  name: "ChevronRightIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$1$3 = ["aria-hidden", "aria-label"];
const _hoisted_2$f = ["fill", "width", "height"];
const _hoisted_3$b = { d: "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" };
const _hoisted_4$b = { key: 0 };
function _sfc_render$1$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon chevron-right-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$b, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$b, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$f))
  ], 16, _hoisted_1$1$3);
}
const ChevronRight = /* @__PURE__ */ _export_sfc(_sfc_main$1$5, [["render", _sfc_render$1$2]]);
const _sfc_main$r = {
  name: "NcBreadcrumb",
  components: {
    NcActions,
    ChevronRight,
    NcButton
  },
  inheritAttrs: false,
  props: {
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: null
    },
    /**
     * Route Location the link should navigate to when clicked on.
     *
     * @see https://v3.router.vuejs.org/api/#to
     */
    to: {
      type: [String, Object],
      default: void 0
    },
    /**
     * Set this prop if your app doesn't use vue-router, breadcrumbs will show as normal links.
     */
    href: {
      type: String,
      default: void 0
    },
    /**
     * Set a css icon-class to show an icon along name text (if forceIconText is provided, otherwise just icon).
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * Enables text to accompany the icon, if the icon was provided. The text that will be displayed is the name prop.
     */
    forceIconText: {
      type: Boolean,
      default: false
    },
    /**
     * Disable dropping on this breadcrumb.
     */
    disableDrop: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Open state of the Actions menu
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * CSS class to apply to the root element.
     */
    class: {
      type: [String, Array, Object],
      default: ""
    }
  },
  emits: [
    "dragenter",
    "dragleave",
    "dropped",
    "update:open"
  ],
  setup() {
    const crumbId = createElementId();
    return {
      actionsContainer: `.vue-crumb[data-crumb-id="${crumbId}"]`,
      crumbId
    };
  },
  data() {
    return {
      /**
       * Variable to track if we hover over the breadcrumb
       */
      hovering: false
    };
  },
  computed: {
    /**
     * The attributes to pass to `router-link` or `a`
     */
    linkAttributes() {
      if (this.to) {
        return { to: this.to, ...this.$attrs };
      } else if (this.href) {
        return { href: this.href, ...this.$attrs };
      }
      return this.$attrs;
    }
  },
  methods: {
    /**
     * Function to handle changing the open state of the Actions menu
     * $emit the open state.
     *
     * @param {boolean} open The open state of the Actions menu
     */
    onOpenChange(open) {
      this.$emit("update:open", open);
    },
    /**
     * Function to handle a drop on the breadcrumb.
     * $emit the event and the path, remove the hovering state.
     *
     * @param {object} e The drop event
     * @return {boolean}
     */
    dropped(e) {
      if (this.disableDrop) {
        return false;
      }
      this.$emit("dropped", e, this.to || this.href);
      this.$parent.$emit("dropped", e, this.to || this.href);
      this.hovering = false;
      return false;
    },
    /**
     * Add the hovering state on drag enter
     *
     * @param {DragEvent} e The drag-enter event
     */
    dragEnter(e) {
      this.$emit("dragenter", e);
      if (this.disableDrop) {
        return;
      }
      this.hovering = true;
    },
    /**
     * Remove the hovering state on drag leave
     *
     * @param {DragEvent} e The drag leave event
     */
    dragLeave(e) {
      this.$emit("dragleave", e);
      if (this.disableDrop) {
        return;
      }
      if (e.target.contains(e.relatedTarget) || this.$refs.crumb.contains(e.relatedTarget)) {
        return;
      }
      this.hovering = false;
    }
  }
};
const _hoisted_1$n = ["data-crumb-id"];
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcButton = resolveComponent("NcButton");
  const _component_NcActions = resolveComponent("NcActions");
  const _component_ChevronRight = resolveComponent("ChevronRight");
  return openBlock(), createElementBlock("li", {
    ref: "crumb",
    class: normalizeClass(["vue-crumb", [{ "vue-crumb--hovered": $data.hovering }, _ctx.$props.class]]),
    "data-crumb-id": $setup.crumbId,
    draggable: "false",
    onDragstart: withModifiers(() => {
    }, ["prevent"]),
    onDrop: _cache[0] || (_cache[0] = withModifiers((...args) => $options.dropped && $options.dropped(...args), ["prevent"])),
    onDragover: withModifiers(() => {
    }, ["prevent"]),
    onDragenter: _cache[1] || (_cache[1] = (...args) => $options.dragEnter && $options.dragEnter(...args)),
    onDragleave: _cache[2] || (_cache[2] = (...args) => $options.dragLeave && $options.dragLeave(...args))
  }, [
    ($props.name || $props.icon || _ctx.$slots.icon) && !_ctx.$slots.default ? (openBlock(), createBlock(_component_NcButton, mergeProps({
      key: 0,
      "aria-label": $props.icon ? $props.name : void 0,
      variant: "tertiary"
    }, $options.linkAttributes), createSlots({ _: 2 }, [
      _ctx.$slots.icon || $props.icon ? {
        name: "icon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            createBaseVNode("span", {
              class: normalizeClass([$props.icon, "icon"])
            }, null, 2)
          ], true)
        ]),
        key: "0"
      } : void 0,
      !(_ctx.$slots.icon || $props.icon) || $props.forceIconText ? {
        name: "default",
        fn: withCtx(() => [
          createTextVNode(toDisplayString($props.name), 1)
        ]),
        key: "1"
      } : void 0
    ]), 1040, ["aria-label"])) : createCommentVNode("", true),
    _ctx.$slots.default ? (openBlock(), createBlock(_component_NcActions, {
      key: 1,
      ref: "actions",
      container: $setup.actionsContainer,
      forceMenu: $props.forceMenu,
      forceName: "",
      menuName: $props.name,
      open: $props.open,
      title: $props.title,
      variant: "tertiary",
      "onUpdate:open": $options.onOpenChange
    }, {
      icon: withCtx(() => [
        renderSlot(_ctx.$slots, "menu-icon", {}, void 0, true)
      ]),
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
    }, 8, ["container", "forceMenu", "menuName", "open", "title", "onUpdate:open"])) : createCommentVNode("", true),
    createVNode(_component_ChevronRight, {
      class: "vue-crumb__separator",
      size: 20
    })
  ], 42, _hoisted_1$n);
}
const NcBreadcrumb = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$e], ["__scopeId", "data-v-7cec4a3e"]]);
const _sfc_main$q = {
  name: "NcActionLink",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: NC_ACTIONS_IS_SEMANTIC_MENU,
      default: false
    }
  },
  props: {
    /**
     * destionation to link to
     */
    href: {
      type: String,
      required: true,
      validator: (value) => {
        try {
          return new URL(value);
        } catch {
          return value.startsWith("#") || value.startsWith("/");
        }
      }
    },
    /**
     * download the link instead of opening
     */
    download: {
      type: String,
      default: null
    },
    /**
     * target to open the link
     */
    target: {
      type: String,
      default: "_self",
      validator: (value) => {
        return value && (!value.startsWith("_") || ["_blank", "_self", "_parent", "_top"].indexOf(value) > -1);
      }
    },
    /**
     * Declares a native tooltip when not null
     */
    title: {
      type: String,
      default: null
    }
  }
};
const _hoisted_1$m = ["role"];
const _hoisted_2$e = ["download", "href", "aria-label", "target", "title", "role"];
const _hoisted_3$a = {
  key: 0,
  class: "action-link__longtext-wrapper"
};
const _hoisted_4$a = { class: "action-link__name" };
const _hoisted_5$6 = ["textContent"];
const _hoisted_6$5 = ["textContent"];
const _hoisted_7$3 = {
  key: 2,
  class: "action-link__text"
};
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: "action",
    role: $options.isInSemanticMenu && "presentation"
  }, [
    createBaseVNode("a", {
      download: $props.download,
      href: $props.href,
      "aria-label": _ctx.ariaLabel,
      target: $props.target,
      title: $props.title,
      class: "action-link focusable",
      rel: "nofollow noreferrer noopener",
      role: $options.isInSemanticMenu && "menuitem",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, [
      renderSlot(_ctx.$slots, "icon", {}, () => [
        createBaseVNode("span", {
          "aria-hidden": "true",
          class: normalizeClass(["action-link__icon", [_ctx.isIconUrl ? "action-link__icon--url" : _ctx.icon]]),
          style: normalizeStyle({ backgroundImage: _ctx.isIconUrl ? `url(${_ctx.icon})` : null })
        }, null, 6)
      ], true),
      _ctx.name ? (openBlock(), createElementBlock("span", _hoisted_3$a, [
        createBaseVNode("strong", _hoisted_4$a, toDisplayString(_ctx.name), 1),
        _cache[1] || (_cache[1] = createBaseVNode("br", null, null, -1)),
        createBaseVNode("span", {
          class: "action-link__longtext",
          textContent: toDisplayString(_ctx.text)
        }, null, 8, _hoisted_5$6)
      ])) : _ctx.isLongText ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: "action-link__longtext",
        textContent: toDisplayString(_ctx.text)
      }, null, 8, _hoisted_6$5)) : (openBlock(), createElementBlock("span", _hoisted_7$3, toDisplayString(_ctx.text), 1)),
      createCommentVNode("", true)
    ], 8, _hoisted_2$e)
  ], 8, _hoisted_1$m);
}
const NcActionLink = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$d], ["__scopeId", "data-v-32f01b7a"]]);
const _sfc_main$p = {
  name: "NcActionRouter",
  mixins: [ActionTextMixin],
  inject: {
    isInSemanticMenu: {
      from: NC_ACTIONS_IS_SEMANTIC_MENU,
      default: false
    }
  },
  props: {
    /**
     * router-link to prop [https://router.vuejs.org/api/#to](https://router.vuejs.org/api/#to)
     */
    to: {
      type: [String, Object],
      required: true
    }
  }
};
const _hoisted_1$l = ["role"];
const _hoisted_2$d = {
  key: 0,
  class: "action-router__longtext-wrapper"
};
const _hoisted_3$9 = { class: "action-router__name" };
const _hoisted_4$9 = ["textContent"];
const _hoisted_5$5 = ["textContent"];
const _hoisted_6$4 = {
  key: 2,
  class: "action-router__text"
};
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("li", {
    class: "action",
    role: $options.isInSemanticMenu && "presentation"
  }, [
    createVNode(_component_RouterLink, {
      "aria-label": _ctx.ariaLabel,
      class: "action-router focusable",
      rel: "nofollow noreferrer noopener",
      role: $options.isInSemanticMenu && "menuitem",
      title: _ctx.title,
      to: $props.to,
      onClick: _ctx.onClick
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "icon", {}, () => [
          createBaseVNode("span", {
            "aria-hidden": "true",
            class: normalizeClass(["action-router__icon", [_ctx.isIconUrl ? "action-router__icon--url" : _ctx.icon]]),
            style: normalizeStyle({ backgroundImage: _ctx.isIconUrl ? `url(${_ctx.icon})` : null })
          }, null, 6)
        ], true),
        _ctx.name ? (openBlock(), createElementBlock("span", _hoisted_2$d, [
          createBaseVNode("strong", _hoisted_3$9, toDisplayString(_ctx.name), 1),
          _cache[0] || (_cache[0] = createBaseVNode("br", null, null, -1)),
          createBaseVNode("span", {
            class: "action-router__longtext",
            textContent: toDisplayString(_ctx.text)
          }, null, 8, _hoisted_4$9)
        ])) : _ctx.isLongText ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: "action-router__longtext",
          textContent: toDisplayString(_ctx.text)
        }, null, 8, _hoisted_5$5)) : (openBlock(), createElementBlock("span", _hoisted_6$4, toDisplayString(_ctx.text), 1)),
        createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["aria-label", "role", "title", "to", "onClick"])
  ], 8, _hoisted_1$l);
}
const NcActionRouter = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$c], ["__scopeId", "data-v-87267750"]]);
const _sfc_main$1$4 = {
  name: "FolderIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$k = ["aria-hidden", "aria-label"];
const _hoisted_2$c = ["fill", "width", "height"];
const _hoisted_3$8 = { d: "M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" };
const _hoisted_4$8 = { key: 0 };
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon folder-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$8, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$8, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$c))
  ], 16, _hoisted_1$k);
}
const IconFolder = /* @__PURE__ */ _export_sfc(_sfc_main$1$4, [["render", _sfc_render$b]]);
const crumbClass = "vue-crumb";
const _sfc_main$o = {
  name: "NcBreadcrumbs",
  components: {
    NcActions,
    NcActionButton,
    NcActionRouter,
    NcActionLink,
    NcBreadcrumb,
    IconFolder
  },
  props: {
    /**
     * Set a css icon-class for the icon of the root breadcrumb to be used.
     */
    rootIcon: {
      type: String,
      default: "icon-home"
    },
    /**
     * Set the aria-label of the nav element.
     */
    ariaLabel: {
      type: String,
      default: null
    }
  },
  emits: ["dropped"],
  data() {
    return {
      /**
       * Array to track the hidden breadcrumbs by their index.
       * Comparing two crumbs somehow does not work, so we use the indices.
       */
      hiddenIndices: [],
      /**
       * This is the props of the middle Action menu
       * that show the ellipsised breadcrumbs
       */
      menuBreadcrumbProps: {
        // Don't show a name for this breadcrumb, only the Actions menu
        name: "",
        forceMenu: true,
        // Don't allow dropping directly on the actions breadcrumb
        disableDrop: true,
        // Is the menu open or not
        open: false
      },
      breadcrumbsRefs: []
    };
  },
  created() {
    window.addEventListener("resize", debounce(() => {
      this.handleWindowResize();
    }, 100));
    subscribe("navigation-toggled", this.delayedResize);
  },
  mounted() {
    this.handleWindowResize();
  },
  updated() {
    this.delayedResize();
    this.$nextTick(() => {
      this.hideCrumbs();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    unsubscribe("navigation-toggled", this.delayedResize);
  },
  methods: {
    /**
     * Close the actions menu
     *
     * @param {object} e The event
     */
    closeActions(e) {
      if (this.$refs.actionsBreadcrumb.$el.contains(e.relatedTarget)) {
        return;
      }
      this.menuBreadcrumbProps.open = false;
    },
    /**
     * Call the resize function after a delay
     */
    async delayedResize() {
      await this.$nextTick();
      this.handleWindowResize();
    },
    /**
     * Check the width of the breadcrumb and hide breadcrumbs
     * if we overflow otherwise.
     */
    handleWindowResize() {
      if (!this.$refs.container) {
        return;
      }
      const nrCrumbs = this.breadcrumbsRefs.length;
      const hiddenIndices = [];
      const availableWidth = this.$refs.container.offsetWidth;
      let totalWidth = this.getTotalWidth();
      if (this.$refs.breadcrumb__actions) {
        totalWidth += this.$refs.breadcrumb__actions.offsetWidth;
      }
      let overflow = totalWidth - availableWidth;
      overflow += overflow > 0 ? 64 : 0;
      let i = 0;
      const startIndex = Math.floor(nrCrumbs / 2);
      while (overflow > 0 && i < nrCrumbs - 2) {
        const currentIndex = startIndex + (i % 2 ? i + 1 : i) / 2 * Math.pow(-1, i + nrCrumbs % 2);
        overflow -= this.getWidth(this.breadcrumbsRefs[currentIndex]?.$el, currentIndex === this.breadcrumbsRefs.length - 1);
        hiddenIndices.push(currentIndex);
        i++;
      }
      if (!this.arraysEqual(this.hiddenIndices, hiddenIndices.sort((a, b2) => a - b2))) {
        this.hiddenIndices = hiddenIndices;
      }
    },
    /**
     * Checks if two arrays are equal.
     * Only works for primitive arrays, but that's enough here.
     *
     * @param {Array} a The first array
     * @param {Array} b The second array
     * @return {boolean} Wether the arrays are equal
     */
    arraysEqual(a, b2) {
      if (a.length !== b2.length) {
        return false;
      } else if (a === b2) {
        return true;
      } else if (a === null || b2 === null) {
        return false;
      }
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    },
    /**
     * Calculates the total width of all breadcrumbs
     *
     * @return {number} The total width
     */
    getTotalWidth() {
      return this.breadcrumbsRefs.reduce((width, crumb, index2) => width + this.getWidth(crumb.$el, index2 === this.breadcrumbsRefs.length - 1), 0);
    },
    /**
     * Calculates the width of the provided element
     *
     * @param {object} el The element
     * @param {boolean} isLast Is this the last crumb
     * @return {number} The width
     */
    getWidth(el, isLast) {
      if (!el?.classList) {
        return 0;
      }
      const hide = el.classList.contains(`${crumbClass}--hidden`);
      el.style.minWidth = "auto";
      if (isLast) {
        el.style.maxWidth = "210px";
      }
      el.classList.remove(`${crumbClass}--hidden`);
      const w = el.offsetWidth;
      if (hide) {
        el.classList.add(`${crumbClass}--hidden`);
      }
      el.style.minWidth = "";
      el.style.maxWidth = "";
      return w;
    },
    /**
     * Prevents the default of a provided event
     *
     * @param {object} e The event
     * @return {boolean}
     */
    preventDefault(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    },
    /**
     * Handles the drag start.
     * Prevents a breadcrumb from being draggable.
     *
     * @param {object} e The event
     * @return {boolean}
     */
    dragStart(e) {
      return this.preventDefault(e);
    },
    /**
     * Handles when something is dropped on the breadcrumb.
     *
     * @param {object} e The drop event
     * @param {string} path The path of the breadcrumb
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     * @return {boolean}
     */
    dropped(e, path, disabled) {
      if (!disabled) {
        this.$emit("dropped", e, path);
      }
      this.menuBreadcrumbProps.open = false;
      const crumbs = document.querySelectorAll(`.${crumbClass}`);
      for (const crumb of crumbs) {
        crumb.classList.remove(`${crumbClass}--hovered`);
      }
      return this.preventDefault(e);
    },
    /**
     * Handles the drag over event
     *
     * @param {object} e The drag over event
     * @return {boolean}
     */
    dragOver(e) {
      return this.preventDefault(e);
    },
    /**
     * Handles the drag enter event
     *
     * @param {object} e The drag over event
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     */
    dragEnter(e, disabled) {
      if (disabled) {
        return;
      }
      if (e.target.closest) {
        const target = e.target.closest(`.${crumbClass}`);
        if (target.classList && target.classList.contains(crumbClass)) {
          const crumbs = document.querySelectorAll(`.${crumbClass}`);
          for (const crumb of crumbs) {
            crumb.classList.remove(`${crumbClass}--hovered`);
          }
          target.classList.add(`${crumbClass}--hovered`);
        }
      }
    },
    /**
     * Handles the drag leave event
     *
     * @param {object} e The drag leave event
     * @param {boolean} disabled Whether dropping is disabled for this breadcrumb
     */
    dragLeave(e, disabled) {
      if (disabled) {
        return;
      }
      if (e.target.contains(e.relatedTarget)) {
        return;
      }
      if (e.target.closest) {
        const target = e.target.closest(`.${crumbClass}`);
        if (target.contains(e.relatedTarget)) {
          return;
        }
        if (target.classList && target.classList.contains(crumbClass)) {
          target.classList.remove(`${crumbClass}--hovered`);
        }
      }
    },
    /**
     * Check for each crumb if we have to hide it and
     * add it to the array of all crumbs.
     */
    hideCrumbs() {
      this.breadcrumbsRefs.forEach((crumb, i) => {
        if (crumb?.$el?.classList) {
          if (this.hiddenIndices.includes(i)) {
            crumb.$el.classList.add(`${crumbClass}--hidden`);
          } else {
            crumb.$el.classList.remove(`${crumbClass}--hidden`);
          }
        }
      });
    },
    isBreadcrumb(vnode) {
      return vnode?.type?.name === "NcBreadcrumb";
    }
  },
  /**
   * The render function to display the component
   *
   * @return {object|undefined} The created VNode
   */
  render() {
    let breadcrumbs = [];
    this.$slots.default?.().forEach((vnode) => {
      if (this.isBreadcrumb(vnode)) {
        breadcrumbs.push(vnode);
        return;
      }
      if (vnode?.type === Fragment) {
        vnode?.children?.forEach?.((child) => {
          if (this.isBreadcrumb(child)) {
            breadcrumbs.push(child);
          }
        });
      }
    });
    if (breadcrumbs.length === 0) {
      return;
    }
    breadcrumbs[0] = cloneVNode(breadcrumbs[0], {
      icon: this.rootIcon,
      ref: "breadcrumbs"
    });
    const breadcrumbsRefs = [];
    breadcrumbs = breadcrumbs.map((crumb, index2) => cloneVNode(crumb, {
      ref: (crumb2) => {
        breadcrumbsRefs[index2] = crumb2;
      }
    }));
    const crumbs = [...breadcrumbs];
    if (this.hiddenIndices.length) {
      crumbs.splice(
        Math.round(breadcrumbs.length / 2),
        0,
        // The Actions menu
        // Use a breadcrumb component for the hidden breadcrumbs
        h$1(NcBreadcrumb, {
          class: "dropdown",
          ...this.menuBreadcrumbProps,
          // Hide the dropdown menu from screen-readers,
          // since the crumbs in the menu are still in the list.
          "aria-hidden": true,
          // Add a ref to the Actions menu
          ref: "actionsBreadcrumb",
          key: "actions-breadcrumb-1",
          // Add handlers so the Actions menu opens on hover
          onDragenter: () => {
            this.menuBreadcrumbProps.open = true;
          },
          onDragleave: this.closeActions,
          // Make sure we keep the same open state
          // as the Actions component
          "onUpdate:open": (open) => {
            this.menuBreadcrumbProps.open = open;
          }
          // Add all hidden breadcrumbs as ActionRouter or ActionLink
        }, {
          default: () => this.hiddenIndices.filter((index2) => index2 <= breadcrumbs.length - 1).map((index2) => {
            const crumb = breadcrumbs[index2];
            const {
              // Get the parameters from the breadcrumb component props
              to,
              href,
              disableDrop,
              name,
              // Props to forward
              ...propsToForward
            } = crumb.props;
            delete propsToForward.ref;
            let element = NcActionButton;
            let path = "";
            if (href) {
              element = NcActionLink;
              path = href;
            }
            if (to) {
              element = NcActionRouter;
              path = to;
            }
            const folderIcon = h$1(IconFolder, {
              size: 20
            });
            return h$1(element, {
              ...propsToForward,
              class: crumbClass,
              href: href || null,
              to: to || null,
              // Prevent the breadcrumbs from being draggable
              draggable: false,
              // Add the drag and drop handlers
              onDragstart: this.dragStart,
              onDrop: ($event) => this.dropped($event, path, disableDrop),
              onDragover: this.dragOver,
              onDragenter: ($event) => this.dragEnter($event, disableDrop),
              onDragleave: ($event) => this.dragLeave($event, disableDrop)
            }, {
              default: () => name,
              icon: () => folderIcon
            });
          })
        })
      );
    }
    const wrapper = [h$1("nav", { "aria-label": this.ariaLabel }, [h$1("ul", { class: "breadcrumb__crumbs" }, [crumbs])])];
    if (isSlotPopulated(this.$slots.actions?.())) {
      wrapper.push(h$1("div", { class: "breadcrumb__actions", ref: "breadcrumb__actions" }, this.$slots.actions?.()));
    }
    this.breadcrumbsRefs = breadcrumbsRefs;
    return h$1("div", { class: ["breadcrumb", { "breadcrumb--collapsed": this.hiddenIndices.length === breadcrumbs.length - 2 }], ref: "container" }, wrapper);
  }
};
const NcBreadcrumbs = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-5a4d73af"]]);
const _hoisted_1$j = ["title"];
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "NcCounterBubble",
  props: {
    count: {},
    active: { type: Boolean },
    type: { default: "" },
    raw: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const humanizedCount = computed(() => {
      if (props.raw) {
        return props.count.toString();
      }
      const formatter = new Intl.NumberFormat(getCanonicalLocale(), {
        notation: "compact",
        compactDisplay: "short"
      });
      return formatter.format(props.count);
    });
    const originalCountAsTitleIfNeeded = computed(() => {
      if (props.raw) {
        return;
      }
      const countAsString = props.count.toString();
      if (countAsString === humanizedCount.value) {
        return;
      }
      return countAsString;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["counter-bubble__counter", {
          active: __props.active,
          "counter-bubble__counter--highlighted": __props.type === "highlighted",
          "counter-bubble__counter--outlined": __props.type === "outlined"
        }]),
        title: originalCountAsTitleIfNeeded.value
      }, toDisplayString(humanizedCount.value), 11, _hoisted_1$j);
    };
  }
});
const NcCounterBubble = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-36ffc13f"]]);
const _sfc_main$m = {
  name: "NcListItem",
  components: {
    NcActions,
    NcCounterBubble,
    NcVNodes: _sfc_main$x
  },
  inheritAttrs: false,
  props: {
    /**
     * The details text displayed in the upper right part of the component
     */
    details: {
      type: String,
      default: ""
    },
    /**
     * Name (first line of text)
     */
    name: {
      type: String,
      default: void 0
    },
    /**
     * The route for the router link.
     */
    to: {
      type: [String, Object],
      default: null
    },
    /**
     * The value for the external link
     */
    href: {
      type: String,
      default: "#"
    },
    /**
     * The HTML target attribute used for the link
     */
    target: {
      type: String,
      default: ""
    },
    /**
     * Id for the `<a>` element
     */
    anchorId: {
      type: String,
      default: ""
    },
    /**
     * Make subname bold
     */
    bold: {
      type: Boolean,
      default: false
    },
    /**
     * Show the NcListItem in compact design
     */
    compact: {
      type: Boolean,
      default: false
    },
    /**
     * Toggle the active state of the component
     */
    active: {
      type: Boolean,
      default: void 0
    },
    /**
     * Aria label for the wrapper element
     */
    linkAriaLabel: {
      type: String,
      default: ""
    },
    /**
     * Aria label for the actions toggle
     */
    actionsAriaLabel: {
      type: String,
      default: void 0
    },
    /**
     * If different from 0 this component will display the
     * NcCounterBubble component
     */
    counterNumber: {
      type: [Number, String],
      default: 0
    },
    /**
     * Outlined or highlighted state of the counter
     */
    counterType: {
      type: String,
      default: "",
      validator(value) {
        return ["highlighted", "outlined", ""].indexOf(value) !== -1;
      }
    },
    /**
     * To be used only when the elements in the actions menu are very important
     */
    forceDisplayActions: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * Show the list component layout
     */
    oneLine: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "click",
    "dragstart",
    "update:menuOpen"
  ],
  setup() {
    return { isLegacy34 };
  },
  data() {
    return {
      hovered: false,
      hasActions: false,
      hasSubname: false,
      displayActionsOnHoverFocus: false,
      menuOpen: false,
      hasIndicator: false,
      hasDetails: false
    };
  },
  computed: {
    showAdditionalElements() {
      return !this.displayActionsOnHoverFocus || this.forceDisplayActions;
    },
    showDetails() {
      return (this.details !== "" || this.hasDetails) && (!this.displayActionsOnHoverFocus || this.forceDisplayActions);
    }
  },
  watch: {
    menuOpen(newValue) {
      if (!newValue && !this.hovered) {
        this.displayActionsOnHoverFocus = false;
      }
    }
  },
  mounted() {
    this.checkSlots();
  },
  updated() {
    this.checkSlots();
  },
  methods: {
    /**
     * Handle link click
     *
     * @param {MouseEvent|KeyboardEvent} event - Native click or keydown event
     * @param {(event: Event) => void} [navigate] - VueRouter link's navigate if any
     * @param {string} [routerLinkHref] - VueRouter link's href
     */
    onClick(event, navigate, routerLinkHref) {
      this.$emit("click", event);
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }
      if (routerLinkHref) {
        navigate?.(event);
        event.preventDefault();
      }
    },
    showActions() {
      if (this.hasActions) {
        this.displayActionsOnHoverFocus = true;
      }
      this.hovered = false;
    },
    hideActions() {
      this.displayActionsOnHoverFocus = false;
    },
    /**
     * @param {FocusEvent} event UI event
     */
    handleBlur(event) {
      if (this.menuOpen) {
        return;
      }
      if (this.$refs["list-item"]?.contains(event.relatedTarget)) {
        return;
      }
      this.hideActions();
    },
    /**
     * Hide the actions on mouseleave unless the menu is open
     */
    handleMouseleave() {
      if (!this.menuOpen) {
        this.displayActionsOnHoverFocus = false;
      }
      this.hovered = false;
    },
    handleMouseover() {
      this.showActions();
      this.hovered = true;
    },
    handleActionsUpdateOpen(e) {
      this.menuOpen = e;
      this.$emit("update:menuOpen", e);
    },
    // Check if subname and actions slots are populated
    checkSlots() {
      if (this.hasActions !== !!this.$slots.actions) {
        this.hasActions = !!this.$slots.actions;
      }
      if (this.hasSubname !== !!this.$slots.subname) {
        this.hasSubname = !!this.$slots.subname;
      }
      if (this.hasIndicator !== !!this.$slots.indicator) {
        this.hasIndicator = !!this.$slots.indicator;
      }
      if (this.hasDetails !== !!this.$slots.details) {
        this.hasDetails = !!this.$slots.details;
      }
    }
  }
};
const _hoisted_1$i = ["id", "aria-label", "href", "target", "rel", "onClick"];
const _hoisted_2$b = { class: "list-item-content" };
const _hoisted_3$7 = { class: "list-item-content__main" };
const _hoisted_4$7 = { class: "list-item-content__name" };
const _hoisted_5$4 = { class: "list-item-content__details" };
const _hoisted_6$3 = {
  key: 0,
  class: "list-item-details__details"
};
const _hoisted_7$2 = {
  key: 1,
  class: "list-item-details__extra"
};
const _hoisted_8$1 = {
  key: 1,
  class: "list-item-details__indicator"
};
const _hoisted_9 = {
  key: 0,
  class: "list-item-content__extra-actions"
};
const _hoisted_10 = {
  key: 2,
  class: "list-item__extra"
};
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcCounterBubble = resolveComponent("NcCounterBubble");
  const _component_NcActions = resolveComponent("NcActions");
  return openBlock(), createBlock(resolveDynamicComponent($props.to ? "router-link" : "NcVNodes"), normalizeProps(guardReactiveProps({ ...$props.to && { custom: true, to: $props.to } })), {
    default: withCtx(({ href: routerLinkHref, navigate, isActive }) => [
      createBaseVNode("li", mergeProps({
        class: ["list-item__wrapper", {
          "list-item__wrapper--active": $props.active ?? isActive,
          "list-item__wrapper--legacy": $setup.isLegacy34
        }]
      }, _ctx.$attrs), [
        createBaseVNode("div", {
          ref: "list-item",
          class: normalizeClass(["list-item", {
            "list-item--compact": $props.compact,
            "list-item--one-line": $props.oneLine
          }]),
          onMouseover: _cache[5] || (_cache[5] = (...args) => $options.handleMouseover && $options.handleMouseover(...args)),
          onMouseleave: _cache[6] || (_cache[6] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
        }, [
          createBaseVNode("a", {
            id: $props.anchorId || void 0,
            "aria-label": $props.linkAriaLabel,
            class: "list-item__anchor",
            href: routerLinkHref || $props.href,
            target: $props.target || ($props.href === "#" ? void 0 : "_blank"),
            rel: $props.href === "#" ? void 0 : "noopener noreferrer",
            onFocus: _cache[0] || (_cache[0] = (...args) => $options.showActions && $options.showActions(...args)),
            onFocusout: _cache[1] || (_cache[1] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
            onClick: ($event) => $options.onClick($event, navigate, routerLinkHref),
            onDragstart: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("dragstart", $event)),
            onKeydown: _cache[3] || (_cache[3] = withKeys((...args) => $options.hideActions && $options.hideActions(...args), ["esc"]))
          }, [
            renderSlot(_ctx.$slots, "icon", {}, void 0, true),
            createBaseVNode("div", _hoisted_2$b, [
              createBaseVNode("div", _hoisted_3$7, [
                createBaseVNode("div", _hoisted_4$7, [
                  renderSlot(_ctx.$slots, "name", {}, () => [
                    createTextVNode(toDisplayString($props.name), 1)
                  ], true)
                ]),
                $data.hasSubname ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: normalizeClass(["list-item-content__subname", { "list-item-content__subname--bold": $props.bold }])
                }, [
                  renderSlot(_ctx.$slots, "subname", {}, void 0, true)
                ], 2)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_5$4, [
                $options.showDetails ? (openBlock(), createElementBlock("div", _hoisted_6$3, [
                  renderSlot(_ctx.$slots, "details", {}, () => [
                    createTextVNode(toDisplayString($props.details), 1)
                  ], true)
                ])) : createCommentVNode("", true),
                $props.counterNumber !== 0 || $data.hasIndicator ? withDirectives((openBlock(), createElementBlock("div", _hoisted_7$2, [
                  $props.counterNumber !== 0 ? (openBlock(), createBlock(_component_NcCounterBubble, {
                    key: 0,
                    count: $props.counterNumber,
                    active: $setup.isLegacy34 ? $props.active ?? isActive : false,
                    class: "list-item-details__counter",
                    type: $props.counterType
                  }, null, 8, ["count", "active", "type"])) : createCommentVNode("", true),
                  $data.hasIndicator ? (openBlock(), createElementBlock("span", _hoisted_8$1, [
                    renderSlot(_ctx.$slots, "indicator", {}, void 0, true)
                  ])) : createCommentVNode("", true)
                ], 512)), [
                  [vShow, $options.showAdditionalElements]
                ]) : createCommentVNode("", true)
              ])
            ])
          ], 40, _hoisted_1$i),
          _ctx.$slots["extra-actions"] ? (openBlock(), createElementBlock("div", _hoisted_9, [
            renderSlot(_ctx.$slots, "extra-actions", {}, void 0, true)
          ])) : createCommentVNode("", true),
          $props.forceDisplayActions || $data.displayActionsOnHoverFocus ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: "list-item-content__actions",
            onFocusout: _cache[4] || (_cache[4] = (...args) => $options.handleBlur && $options.handleBlur(...args))
          }, [
            createVNode(_component_NcActions, {
              ref: "actions",
              primary: $setup.isLegacy34 ? $props.active ?? isActive : false,
              forceMenu: $props.forceMenu,
              "aria-label": $props.actionsAriaLabel,
              "onUpdate:open": $options.handleActionsUpdateOpen
            }, createSlots({
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "actions", {}, void 0, true)
              ]),
              _: 2
            }, [
              _ctx.$slots["actions-icon"] ? {
                name: "icon",
                fn: withCtx(() => [
                  renderSlot(_ctx.$slots, "actions-icon", {}, void 0, true)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["primary", "forceMenu", "aria-label", "onUpdate:open"])
          ], 32)) : createCommentVNode("", true),
          _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_10, [
            renderSlot(_ctx.$slots, "extra", {}, void 0, true)
          ])) : createCommentVNode("", true)
        ], 34)
      ], 16)
    ]),
    _: 3
  }, 16);
}
const NcListItem = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$a], ["__scopeId", "data-v-0e705f5a"]]);
const _sfc_main$l = {
  name: "NcAppNavigationList"
};
const _hoisted_1$h = { class: "app-navigation-list" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("ul", _hoisted_1$h, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ]);
}
const NcAppNavigationList = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$9], ["__scopeId", "data-v-d72957ed"]]);
register(t20);
const _hoisted_1$1$2 = { class: "app-navigation-toggle-wrapper" };
const _sfc_main$1$3 = /* @__PURE__ */ defineComponent({
  __name: "NcAppNavigationToggle",
  props: {
    "open": { type: Boolean, ...{ required: true } },
    "openModifiers": {}
  },
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const title = computed(() => open.value ? t("Close navigation") : t("Open navigation"));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1$2, [
        createVNode(unref(NcButton), {
          class: "app-navigation-toggle",
          "aria-controls": "app-navigation-vue",
          "aria-expanded": open.value ? "true" : "false",
          "aria-label": title.value,
          title: title.value,
          variant: "tertiary",
          onClick: _cache[0] || (_cache[0] = ($event) => open.value = !open.value)
        }, {
          icon: withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              path: open.value ? unref(mdiMenuOpen) : unref(mdiMenu)
            }, null, 8, ["path"])
          ]),
          _: 1
        }, 8, ["aria-expanded", "aria-label", "title"])
      ]);
    };
  }
});
const NcAppNavigationToggle = /* @__PURE__ */ _export_sfc(_sfc_main$1$3, [["__scopeId", "data-v-5a15295d"]]);
const _hoisted_1$g = ["aria-hidden", "aria-label", "aria-labelledby", "inert"];
const _hoisted_2$a = { class: "app-navigation__search" };
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "NcAppNavigation",
  props: {
    ariaLabel: {},
    ariaLabelledby: {}
  },
  setup(__props) {
    const props = __props;
    let focusTrap;
    const setHasAppNavigation = inject(
      HAS_APP_NAVIGATION_KEY,
      () => warn(),
      false
    );
    const appNavigationContainerElement = useTemplateRef("appNavigationContainer");
    const isMobile2 = useIsMobile();
    const open = ref(!isMobile2.value);
    const shouldActivateFocusTrap = computed(() => isMobile2.value && open.value);
    watchEffect(() => {
      if (!props.ariaLabel && !props.ariaLabelledby) ;
    });
    watch(isMobile2, () => {
      open.value = !isMobile2.value;
    });
    watch(shouldActivateFocusTrap, () => {
      toggleFocusTrap();
    });
    onMounted(() => {
      setHasAppNavigation(true);
      subscribe("toggle-navigation", toggleNavigationByEventBus);
      emit("navigation-toggled", {
        open: open.value
      });
      focusTrap = createFocusTrap(appNavigationContainerElement.value, {
        allowOutsideClick: true,
        clickOutsideDeactivates: () => {
          if (isMobile2.value) {
            focusTrap.deactivate({ returnFocus: false });
            toggleNavigation(false);
          }
          return false;
        },
        fallbackFocus: appNavigationContainerElement.value,
        trapStack: getTrapStack(),
        escapeDeactivates: false
      });
      toggleFocusTrap();
    });
    onUnmounted(() => {
      setHasAppNavigation(false);
      unsubscribe("toggle-navigation", toggleNavigationByEventBus);
      focusTrap.deactivate();
    });
    function toggleNavigation(state) {
      if (open.value === state) {
        emit("navigation-toggled", {
          open: open.value
        });
        return;
      }
      open.value = state === void 0 ? !open.value : state;
      const bodyStyles = getComputedStyle(document.body);
      const animationLength = parseInt(bodyStyles.getPropertyValue("--animation-quick")) || 100;
      setTimeout(() => {
        emit("navigation-toggled", {
          open: open.value
        });
      }, 1.5 * animationLength);
    }
    function toggleNavigationByEventBus({ open: open2 }) {
      return toggleNavigation(open2);
    }
    function toggleFocusTrap() {
      if (shouldActivateFocusTrap.value) {
        focusTrap.activate();
      } else {
        focusTrap.deactivate();
      }
    }
    function handleEsc() {
      if (isMobile2.value) {
        toggleNavigation(false);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref: "appNavigationContainer",
        class: normalizeClass(["app-navigation", {
          "app-navigation--closed": !open.value,
          "app-navigation--legacy": unref(isLegacy34)
        }])
      }, [
        createBaseVNode("nav", {
          id: "app-navigation-vue",
          "aria-hidden": open.value ? "false" : "true",
          "aria-label": __props.ariaLabel || void 0,
          "aria-labelledby": __props.ariaLabelledby || void 0,
          class: "app-navigation__content",
          inert: !open.value || void 0,
          onKeydown: withKeys(handleEsc, ["esc"])
        }, [
          createBaseVNode("div", _hoisted_2$a, [
            renderSlot(_ctx.$slots, "search", {}, void 0, true)
          ]),
          createBaseVNode("div", {
            class: normalizeClass(["app-navigation__body", { "app-navigation__body--no-list": !_ctx.$slots.list }])
          }, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ], 2),
          _ctx.$slots.list ? (openBlock(), createBlock(NcAppNavigationList, {
            key: 0,
            class: "app-navigation__list"
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "list", {}, void 0, true)
            ]),
            _: 3
          })) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "footer", {}, void 0, true)
        ], 40, _hoisted_1$g),
        createVNode(NcAppNavigationToggle, {
          open: open.value,
          "onUpdate:open": toggleNavigation
        }, null, 8, ["open"])
      ], 2);
    };
  }
});
const NcAppNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-1344f70d"]]);
const _sfc_main$j = {
  name: "NcAppNavigationCaption",
  components: {
    NcActions
  },
  props: {
    /**
     * The text of the caption
     */
    name: {
      type: String,
      required: true
    },
    /**
     * `id` to set on the inner caption
     * Can be used for connecting the `NcActionCaption` with `NcActionList` using `aria-labelledby`.
     */
    headingId: {
      type: String,
      default: null
    },
    /**
     * Enable when used as a heading
     * e.g. Before NcAppNavigationList
     */
    isHeading: {
      type: Boolean,
      default: false
    },
    /**
     * If `isHeading` is set, this defines the heading level that should be used
     */
    headingLevel: {
      type: Number,
      default: 2
    },
    /**
     * Any [NcActions](#/Components/NcActions?id=ncactions-1) prop
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    ...NcActions.props
  },
  computed: {
    actionsProps() {
      const actionProps = Object.keys(NcActions.props);
      const props = Object.entries(this.$props).filter(([key, _value]) => actionProps.includes(key));
      return Object.fromEntries(props);
    },
    wrapperTag() {
      return this.isHeading ? "div" : "li";
    },
    captionTag() {
      const headingLevel = Math.max(2, this.headingLevel);
      return this.isHeading ? `h${headingLevel}` : "span";
    }
  }
};
const _hoisted_1$f = {
  key: 0,
  class: "app-navigation-caption__actions"
};
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcActions = resolveComponent("NcActions");
  return openBlock(), createBlock(resolveDynamicComponent($options.wrapperTag), {
    class: normalizeClass(["app-navigation-caption", { "app-navigation-caption--heading": $props.isHeading }])
  }, {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($options.captionTag), {
        id: $props.headingId,
        class: "app-navigation-caption__name"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString($props.name), 1)
        ]),
        _: 1
      }, 8, ["id"])),
      !!_ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_1$f, [
        createVNode(_component_NcActions, normalizeProps(guardReactiveProps($options.actionsProps)), {
          icon: withCtx(() => [
            renderSlot(_ctx.$slots, "actionsTriggerIcon", {}, void 0, true)
          ]),
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "actions", {}, void 0, true)
          ]),
          _: 3
        }, 16)
      ])) : createCommentVNode("", true)
    ]),
    _: 3
  }, 8, ["class"]);
}
const NcAppNavigationCaption = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$8], ["__scopeId", "data-v-f0e411c2"]]);
const _sfc_main$i = {
  name: "ChevronDownIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$e = ["aria-hidden", "aria-label"];
const _hoisted_2$9 = ["fill", "width", "height"];
const _hoisted_3$6 = { d: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" };
const _hoisted_4$6 = { key: 0 };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon chevron-down-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$6, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$6, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$9))
  ], 16, _hoisted_1$e);
}
const ChevronDown = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$7]]);
const _sfc_main$h = {
  name: "ChevronUpIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$d = ["aria-hidden", "aria-label"];
const _hoisted_2$8 = ["fill", "width", "height"];
const _hoisted_3$5 = { d: "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" };
const _hoisted_4$5 = { key: 0 };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon chevron-up-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$5, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$5, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$8))
  ], 16, _hoisted_1$d);
}
const ChevronUp = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$6]]);
register(t14);
const _sfc_main$g = {
  name: "NcInputConfirmCancel",
  components: {
    IconArrowRight,
    IconClose,
    NcButton
  },
  props: {
    /**
     * If this element is used on a primary element set to true for primary styling.
     */
    primary: {
      default: false,
      type: Boolean
    },
    /**
     * Placeholder of the edit field
     */
    placeholder: {
      default: "",
      type: String
    },
    /**
     * The current name (model value)
     */
    modelValue: {
      default: "",
      type: String
    }
  },
  emits: [
    "cancel",
    "confirm",
    "update:modelValue"
  ],
  setup() {
    return { isLegacy34 };
  },
  data() {
    return {
      labelConfirm: t("Confirm changes"),
      labelCancel: t("Cancel changes")
    };
  },
  computed: {
    valueModel: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      }
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
    focusInput() {
      this.$refs.input.focus();
    }
  }
};
const _hoisted_1$c = ["placeholder"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconArrowRight = resolveComponent("IconArrowRight");
  const _component_NcButton = resolveComponent("NcButton");
  const _component_IconClose = resolveComponent("IconClose");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["app-navigation-input-confirm", { "app-navigation-input-confirm--legacy": $setup.isLegacy34 }])
  }, [
    createBaseVNode("form", {
      onSubmit: _cache[1] || (_cache[1] = withModifiers((...args) => $options.confirm && $options.confirm(...args), ["prevent"])),
      onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers((...args) => $options.cancel && $options.cancel(...args), ["exact", "stop", "prevent"]), ["esc"])),
      onClick: _cache[3] || (_cache[3] = withModifiers(() => {
      }, ["stop", "prevent"]))
    }, [
      withDirectives(createBaseVNode("input", {
        ref: "input",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.valueModel = $event),
        type: "text",
        class: "app-navigation-input-confirm__input",
        placeholder: $props.placeholder
      }, null, 8, _hoisted_1$c), [
        [vModelText, $options.valueModel]
      ]),
      createVNode(_component_NcButton, {
        "aria-label": $data.labelConfirm,
        type: "submit",
        variant: "primary",
        onClick: withModifiers($options.confirm, ["stop", "prevent"])
      }, {
        icon: withCtx(() => [
          createVNode(_component_IconArrowRight, { size: 20 })
        ]),
        _: 1
      }, 8, ["aria-label", "onClick"]),
      createVNode(_component_NcButton, {
        "aria-label": $data.labelCancel,
        type: "reset",
        variant: $props.primary ? "primary" : "tertiary",
        onClick: withModifiers($options.cancel, ["stop", "prevent"])
      }, {
        icon: withCtx(() => [
          createVNode(_component_IconClose, { size: 20 })
        ]),
        _: 1
      }, 8, ["aria-label", "variant", "onClick"])
    ], 32)
  ], 2);
}
const NcInputConfirmCancel = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$5], ["__scopeId", "data-v-6926a0b8"]]);
const _sfc_main$3$1 = {
  name: "PencilIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$2$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$2$1 = ["fill", "width", "height"];
const _hoisted_3$2$1 = { d: "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" };
const _hoisted_4$2$1 = { key: 0 };
function _sfc_render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon pencil-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$2$1, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$2$1, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$2$1))
  ], 16, _hoisted_1$2$1);
}
const Pencil = /* @__PURE__ */ _export_sfc(_sfc_main$3$1, [["render", _sfc_render$3$1]]);
const _sfc_main$2$1 = {
  name: "UndoIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
const _hoisted_1$1$1 = ["aria-hidden", "aria-label"];
const _hoisted_2$1$1 = ["fill", "width", "height"];
const _hoisted_3$1$1 = { d: "M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" };
const _hoisted_4$1$1 = { key: 0 };
function _sfc_render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps(_ctx.$attrs, {
    "aria-hidden": $props.title ? null : "true",
    "aria-label": $props.title,
    class: "material-design-icon undo-icon",
    role: "img",
    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
  }), [
    (openBlock(), createElementBlock("svg", {
      fill: $props.fillColor,
      class: "material-design-icon__svg",
      width: $props.size,
      height: $props.size,
      viewBox: "0 0 24 24"
    }, [
      createBaseVNode("path", _hoisted_3$1$1, [
        $props.title ? (openBlock(), createElementBlock("title", _hoisted_4$1$1, toDisplayString($props.title), 1)) : createCommentVNode("", true)
      ])
    ], 8, _hoisted_2$1$1))
  ], 16, _hoisted_1$1$1);
}
const Undo = /* @__PURE__ */ _export_sfc(_sfc_main$2$1, [["render", _sfc_render$2$1]]);
register(t21);
const _sfc_main$1$2 = {
  name: "NcAppNavigationIconCollapsible",
  components: {
    NcButton,
    ChevronDown,
    ChevronUp
  },
  props: {
    /**
     * Is the list currently open (or collapsed)
     */
    open: {
      type: Boolean,
      required: true
    },
    /**
     * Is the navigation item currently active.
     */
    active: {
      type: Boolean,
      required: true
    }
  },
  emits: ["click"],
  setup() {
    return { isLegacy34 };
  },
  computed: {
    labelButton() {
      return this.open ? t("Collapse menu") : t("Open menu");
    }
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    }
  }
};
function _sfc_render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ChevronUp = resolveComponent("ChevronUp");
  const _component_ChevronDown = resolveComponent("ChevronDown");
  const _component_NcButton = resolveComponent("NcButton");
  return openBlock(), createBlock(_component_NcButton, {
    class: normalizeClass(["icon-collapse", {
      "icon-collapse--active": $props.active,
      "icon-collapse--open": $props.open
    }]),
    "aria-label": $options.labelButton,
    variant: $props.active && $setup.isLegacy34 ? "tertiary-on-primary" : "tertiary",
    onClick: $options.onClick
  }, {
    icon: withCtx(() => [
      $props.open ? (openBlock(), createBlock(_component_ChevronUp, {
        key: 0,
        size: 20
      })) : (openBlock(), createBlock(_component_ChevronDown, {
        key: 1,
        size: 20
      }))
    ]),
    _: 1
  }, 8, ["class", "aria-label", "variant", "onClick"]);
}
const NcAppNavigationIconCollapsible = /* @__PURE__ */ _export_sfc(_sfc_main$1$2, [["render", _sfc_render$1$1], ["__scopeId", "data-v-cfbd3794"]]);
register(t23, t51);
const _sfc_main$f = {
  name: "NcAppNavigationItem",
  components: {
    NcActions,
    NcActionButton,
    NcAppNavigationIconCollapsible,
    NcInputConfirmCancel,
    NcLoadingIcon,
    NcVNodes: _sfc_main$x,
    Pencil,
    Undo
  },
  props: {
    /**
     * If you are not using vue-router you can use the property to set this item as the active navigation entry.
     * When using vue-router and the `to` property this is set automatically.
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * The main text content of the entry.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The title attribute of the element.
     */
    title: {
      type: String,
      default: null
    },
    /**
     * id attribute of the list item element
     */
    id: {
      type: String,
      default: () => createElementId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * Refers to the icon on the left, this prop accepts a class
     * like 'icon-category-enabled'.
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * Displays a loading animated icon on the left of the element
     * instead of the icon.
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Passing in a route will make the root element of this
     * component a `<router-link />` that points to that route.
     * By leaving this blank, the root element will be a `<li>`.
     */
    to: {
      type: [String, Object],
      default: null
    },
    /**
     * A direct link. This will be used as the `href` attribute.
     * This will ignore any `to` prop being defined.
     */
    href: {
      type: String,
      default: null
    },
    /**
     * Gives the possibility to collapse the children elements into the
     * parent element (true) or expands the children elements (false).
     */
    allowCollapse: {
      type: Boolean,
      default: false
    },
    /**
     * Makes the name of the item editable by providing an `ActionButton`
     * component that toggles a form
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * Only for 'editable' items, sets label for the edit action button.
     */
    editLabel: {
      type: String,
      default: ""
    },
    /**
     * Only for items in 'editable' mode, sets the placeholder text for the editing form.
     */
    editPlaceholder: {
      type: String,
      default: ""
    },
    /**
     * Pins the item to the bottom left area, above the settings. Do not
     * place 'non-pinned' `AppnavigationItem` components below `pinned`
     * ones.
     */
    pinned: {
      type: Boolean,
      default: false
    },
    /**
     * Puts the item in the 'undo' state.
     */
    undo: {
      type: Boolean,
      default: false
    },
    /**
     * The navigation collapsible state (synced)
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * The actions menu open state (synced)
     */
    menuOpen: {
      type: Boolean,
      default: false
    },
    /**
     * Force the actions to display in a three dot menu
     */
    forceMenu: {
      type: Boolean,
      default: false
    },
    /**
     * The action's menu default icon
     */
    menuIcon: {
      type: String,
      default: void 0
    },
    /**
     * The action's menu direction
     */
    menuPlacement: {
      type: String,
      default: "bottom"
    },
    /**
     * Entry aria details
     */
    ariaDescription: {
      type: String,
      default: null
    },
    /**
     * To be used only when the elements in the actions menu are very important
     */
    forceDisplayActions: {
      type: Boolean,
      default: false
    },
    /**
     * Number of action items outside the menu
     */
    inlineActions: {
      type: Number,
      default: 0
    }
  },
  emits: [
    "update:menuOpen",
    "update:open",
    "update:name",
    "click",
    "undo"
  ],
  setup() {
    return {
      isMobile: useIsMobile(),
      isLegacy34
    };
  },
  data() {
    return {
      actionsBoundariesElement: void 0,
      editingValue: "",
      opened: this.open,
      // Collapsible state
      editingActive: false,
      /**
       * Tracks the open state of the actions menu
       */
      menuOpenLocalValue: false,
      focused: false
    };
  },
  computed: {
    isRouterLink() {
      return this.to && !this.href;
    },
    // Checks if the component is already a children of another
    // instance of AppNavigationItem
    canHaveChildren() {
      if (this.$parent.$options._componentTag === "AppNavigationItem") {
        return false;
      } else {
        return true;
      }
    },
    editButtonAriaLabel() {
      return this.editLabel ? this.editLabel : t("Edit item");
    },
    undoButtonAriaLabel() {
      return t("Undo changes");
    }
  },
  watch: {
    open(newVal) {
      this.opened = newVal;
    }
  },
  mounted() {
    this.actionsBoundariesElement = document.querySelector("#content-vue") || void 0;
  },
  methods: {
    // sync opened menu state with prop
    onMenuToggle(state) {
      this.$emit("update:menuOpen", state);
      this.menuOpenLocalValue = state;
    },
    // toggle the collapsible state
    toggleCollapse() {
      this.opened = !this.opened;
      this.$emit("update:open", this.opened);
    },
    /**
     * Handle link click
     *
     * @param {PointerEvent} event - Native click event
     * @param {(event: PointerEvent) => void} [navigate] - VueRouter link's navigate if any
     * @param {string} [routerLinkHref] - VueRouter link's href
     */
    onClick(event, navigate, routerLinkHref) {
      this.$emit("click", event);
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }
      if (routerLinkHref) {
        navigate?.(event);
        event.preventDefault();
      }
    },
    // Edition methods
    handleEdit() {
      this.editingValue = this.name;
      this.editingActive = true;
      this.onMenuToggle(false);
      this.$nextTick(() => {
        this.$refs.editingInput.focusInput();
      });
    },
    cancelEditing() {
      this.editingActive = false;
    },
    handleEditingDone() {
      this.$emit("update:name", this.editingValue);
      this.editingValue = "";
      this.editingActive = false;
    },
    // Undo methods
    handleUndo() {
      this.$emit("undo");
    },
    /**
     * Show actions upon focus
     */
    handleFocus() {
      this.focused = true;
    },
    handleBlur() {
      this.focused = false;
    },
    /**
     * This method checks if the root element of the component is focused and
     * if that's the case it focuses the actions button if available
     *
     * @param {Event} e the keydown event
     */
    handleTab(e) {
      if (!this.$refs.actions) {
        return;
      }
      if (this.focused) {
        e.preventDefault();
        this.$refs.actions.$refs.triggerButton.$el.focus();
        this.focused = false;
      } else {
        this.$refs.actions.$refs.triggerButton.$el.blur();
      }
    },
    /**
     * Is this an external link
     *
     * @param {string} href The link to check
     * @return {boolean} Whether it is external or not
     */
    isExternal(href) {
      return href && href.match(/[a-z]+:\/\//i);
    }
  }
};
const _hoisted_1$b = ["id"];
const _hoisted_2$7 = ["aria-current", "aria-description", "aria-expanded", "href", "target", "title", "onClick"];
const _hoisted_3$4 = {
  key: 0,
  class: "editingContainer"
};
const _hoisted_4$4 = {
  key: 1,
  class: "app-navigation-entry__deleted"
};
const _hoisted_5$3 = { class: "app-navigation-entry__deleted-description" };
const _hoisted_6$2 = {
  key: 0,
  class: "app-navigation-entry__counter-wrapper"
};
const _hoisted_7$1 = {
  key: 0,
  class: "app-navigation-entry__children"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcLoadingIcon = resolveComponent("NcLoadingIcon");
  const _component_NcInputConfirmCancel = resolveComponent("NcInputConfirmCancel");
  const _component_Pencil = resolveComponent("Pencil");
  const _component_NcActionButton = resolveComponent("NcActionButton");
  const _component_Undo = resolveComponent("Undo");
  const _component_NcActions = resolveComponent("NcActions");
  const _component_NcAppNavigationIconCollapsible = resolveComponent("NcAppNavigationIconCollapsible");
  return openBlock(), createElementBlock("li", {
    id: $props.id,
    class: normalizeClass([{
      "app-navigation-entry--opened": $data.opened,
      "app-navigation-entry--pinned": $props.pinned,
      "app-navigation-entry--collapsible": $props.allowCollapse && !!_ctx.$slots.default
    }, "app-navigation-entry-wrapper"])
  }, [
    (openBlock(), createBlock(resolveDynamicComponent($options.isRouterLink ? "router-link" : "NcVNodes"), normalizeProps(guardReactiveProps({ ...$options.isRouterLink && { custom: true, to: $props.to } })), {
      default: withCtx(({ href: routerLinkHref, navigate, isActive }) => [
        createBaseVNode("div", {
          class: normalizeClass(["app-navigation-entry", {
            "app-navigation-entry--editing": $data.editingActive,
            "app-navigation-entry--deleted": $props.undo,
            "app-navigation-entry--legacy": $setup.isLegacy34,
            active: $props.to && isActive || $props.active
          }])
        }, [
          !$props.undo ? (openBlock(), createElementBlock("a", {
            key: 0,
            class: "app-navigation-entry-link",
            "aria-current": $props.active || $props.to && isActive ? "page" : void 0,
            "aria-description": $props.ariaDescription,
            "aria-expanded": !!_ctx.$slots.default ? $data.opened.toString() : void 0,
            href: $props.href || routerLinkHref || "#",
            target: $options.isExternal($props.href) ? "_blank" : void 0,
            title: $props.title || $props.name,
            onBlur: _cache[1] || (_cache[1] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
            onClick: ($event) => $options.onClick($event, navigate, routerLinkHref),
            onFocus: _cache[2] || (_cache[2] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
            onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => $options.handleTab && $options.handleTab(...args), ["exact"]), ["tab"]))
          }, [
            createBaseVNode("div", {
              class: normalizeClass(["app-navigation-entry-icon", { [$props.icon]: $props.icon }])
            }, [
              $props.loading ? (openBlock(), createBlock(_component_NcLoadingIcon, { key: 0 })) : renderSlot(_ctx.$slots, "icon", {
                key: 1,
                active: $props.active || $props.to && isActive
              }, void 0, true)
            ], 2),
            createBaseVNode("span", {
              class: normalizeClass(["app-navigation-entry__name", { "hidden-visually": $data.editingActive }])
            }, toDisplayString($props.name), 3),
            $data.editingActive ? (openBlock(), createElementBlock("div", _hoisted_3$4, [
              createVNode(_component_NcInputConfirmCancel, {
                ref: "editingInput",
                modelValue: $data.editingValue,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.editingValue = $event),
                placeholder: $props.editPlaceholder !== "" ? $props.editPlaceholder : $props.name,
                primary: $props.to && isActive || $props.active,
                onCancel: $options.cancelEditing,
                onConfirm: $options.handleEditingDone
              }, null, 8, ["modelValue", "placeholder", "primary", "onCancel", "onConfirm"])
            ])) : createCommentVNode("", true)
          ], 40, _hoisted_2$7)) : createCommentVNode("", true),
          $props.undo ? (openBlock(), createElementBlock("div", _hoisted_4$4, [
            createBaseVNode("div", _hoisted_5$3, toDisplayString($props.name), 1)
          ])) : createCommentVNode("", true),
          (!!_ctx.$slots.actions || !!_ctx.$slots.counter || $props.editable || $props.undo) && !$data.editingActive ? (openBlock(), createElementBlock("div", {
            key: 2,
            class: normalizeClass(["app-navigation-entry__utils", { "app-navigation-entry__utils--display-actions": $props.forceDisplayActions || $data.menuOpenLocalValue || $props.menuOpen }])
          }, [
            !!_ctx.$slots.counter ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
              renderSlot(_ctx.$slots, "counter", {}, void 0, true)
            ])) : createCommentVNode("", true),
            !!_ctx.$slots.actions || $props.editable && !$data.editingActive || $props.undo ? (openBlock(), createBlock(_component_NcActions, {
              key: 1,
              ref: "actions",
              class: "app-navigation-entry__actions",
              container: "#app-navigation-vue",
              boundariesElement: $data.actionsBoundariesElement,
              inline: $props.inlineActions,
              placement: $props.menuPlacement,
              open: $props.menuOpen,
              forceMenu: $props.forceMenu,
              defaultIcon: $props.menuIcon,
              variant: "tertiary",
              "onUpdate:open": $options.onMenuToggle
            }, {
              icon: withCtx(() => [
                renderSlot(_ctx.$slots, "menu-icon", {}, void 0, true)
              ]),
              default: withCtx(() => [
                $props.editable && !$data.editingActive ? (openBlock(), createBlock(_component_NcActionButton, {
                  key: 0,
                  "aria-label": $options.editButtonAriaLabel,
                  onClick: $options.handleEdit
                }, {
                  icon: withCtx(() => [
                    createVNode(_component_Pencil, { size: 20 })
                  ]),
                  default: withCtx(() => [
                    createTextVNode(" " + toDisplayString($props.editLabel), 1)
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : createCommentVNode("", true),
                $props.undo ? (openBlock(), createBlock(_component_NcActionButton, {
                  key: 1,
                  "aria-label": $options.undoButtonAriaLabel,
                  onClick: $options.handleUndo
                }, {
                  icon: withCtx(() => [
                    createVNode(_component_Undo, { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "actions", {}, void 0, true)
              ]),
              _: 3
            }, 8, ["boundariesElement", "inline", "placement", "open", "forceMenu", "defaultIcon", "onUpdate:open"])) : createCommentVNode("", true)
          ], 2)) : createCommentVNode("", true),
          $props.allowCollapse && !!_ctx.$slots.default ? (openBlock(), createBlock(_component_NcAppNavigationIconCollapsible, {
            key: 3,
            active: $props.to && isActive || $props.active,
            open: $data.opened,
            onClick: withModifiers($options.toggleCollapse, ["prevent", "stop"])
          }, null, 8, ["active", "open", "onClick"])) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "extra", {}, void 0, true)
        ], 2)
      ]),
      _: 3
    }, 16)),
    $options.canHaveChildren && !!_ctx.$slots.default ? (openBlock(), createElementBlock("ul", _hoisted_7$1, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ])) : createCommentVNode("", true)
  ], 10, _hoisted_1$b);
}
const NcAppNavigationItem = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$4], ["__scopeId", "data-v-fcab058b"]]);
const _sfc_main$e = {
  name: "NcActionSeparator"
};
const _hoisted_1$a = {
  class: "action action-separator action--disabled",
  role: "separator"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", _hoisted_1$a);
}
const NcActionSeparator = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$3], ["__scopeId", "data-v-3e2324b7"]]);
const _hoisted_1$9 = ["data-timestamp", "title", "textContent"];
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "NcDateTime",
  props: {
    timestamp: {},
    format: { default: () => ({ timeStyle: "medium", dateStyle: "short" }) },
    relativeTime: { type: [Boolean, String], default: "long" },
    ignoreSeconds: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const timeOptions = computed(() => ({ format: props.format }));
    const relativeTimeOptions = computed(() => ({
      ignoreSeconds: props.ignoreSeconds,
      relativeTime: props.relativeTime || "long",
      update: props.relativeTime !== false
    }));
    const title = useFormatTime(toRef(() => props.timestamp), timeOptions);
    const relativeTime = useFormatRelativeTime(toRef(() => props.timestamp), relativeTimeOptions);
    const formattedTime = computed(() => props.relativeTime ? relativeTime.value : title.value);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: "nc-datetime",
        dir: "auto",
        "data-timestamp": __props.timestamp,
        title: unref(title),
        textContent: toDisplayString(formattedTime.value)
      }, null, 8, _hoisted_1$9);
    };
  }
});
register(t40);
const _hoisted_1$8 = ["for"];
const _hoisted_2$6 = ["id", "type", "value", "min", "max"];
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "NcDateTimePickerNative",
  props: /* @__PURE__ */ mergeModels({
    class: { default: void 0 },
    id: { default: () => createElementId() },
    inputClass: { default: "" },
    type: { default: "date" },
    label: { default: () => t("Please choose a date") },
    min: { default: null },
    max: { default: null },
    hideLabel: { type: Boolean }
  }, {
    "modelValue": { default: null },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    const formattedValue = computed(() => modelValue.value ? formatValue(modelValue.value) : "");
    const formattedMax = computed(() => props.max ? formatValue(props.max) : void 0);
    const formattedMin = computed(() => props.min ? formatValue(props.min) : void 0);
    function getReadableDate(value) {
      const yyyy = value.getFullYear().toString().padStart(4, "0");
      const MM = (value.getMonth() + 1).toString().padStart(2, "0");
      const dd = value.getDate().toString().padStart(2, "0");
      const hh = value.getHours().toString().padStart(2, "0");
      const mm = value.getMinutes().toString().padStart(2, "0");
      return { yyyy, MM, dd, hh, mm };
    }
    function formatValue(value) {
      const { yyyy, MM, dd, hh, mm } = getReadableDate(value);
      if (props.type === "datetime-local") {
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
      } else if (props.type === "date") {
        return `${yyyy}-${MM}-${dd}`;
      } else if (props.type === "month") {
        return `${yyyy}-${MM}`;
      } else if (props.type === "time") {
        return `${hh}:${mm}`;
      } else if (props.type === "week") {
        const startDate = new Date(Number.parseInt(yyyy), 0, 1);
        const daysSinceBeginningOfYear = Math.floor((value.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1e3));
        const weekNumber = Math.ceil(daysSinceBeginningOfYear / 7);
        return `${yyyy}-W${weekNumber}`;
      }
      return "";
    }
    function onInput(event) {
      const input = event.target;
      if (!input || isNaN(input.valueAsNumber)) {
        modelValue.value = null;
      } else if (props.type === "time") {
        const time = input.value;
        const { yyyy, MM, dd } = getReadableDate(modelValue.value || /* @__PURE__ */ new Date());
        modelValue.value = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${time}`);
      } else if (props.type === "month") {
        const MM = (new Date(input.value).getMonth() + 1).toString().padStart(2, "0");
        const { yyyy, dd, hh, mm } = getReadableDate(modelValue.value || /* @__PURE__ */ new Date());
        modelValue.value = /* @__PURE__ */ new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`);
      } else {
        const timezoneOffsetSeconds = new Date(input.valueAsNumber).getTimezoneOffset() * 1e3 * 60;
        const inputDateWithTimezone = input.valueAsNumber + timezoneOffsetSeconds;
        modelValue.value = new Date(inputDateWithTimezone);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["native-datetime-picker", _ctx.$props.class])
      }, [
        createBaseVNode("label", {
          class: normalizeClass(["native-datetime-picker__label", { "hidden-visually": __props.hideLabel }]),
          for: __props.id
        }, toDisplayString(__props.label), 11, _hoisted_1$8),
        createBaseVNode("input", mergeProps({
          id: __props.id,
          class: ["native-datetime-picker__input", __props.inputClass],
          type: __props.type,
          value: formattedValue.value,
          min: formattedMin.value,
          max: formattedMax.value
        }, _ctx.$attrs, { onInput }), null, 16, _hoisted_2$6)
      ], 2);
    };
  }
});
const NcDateTimePickerNative = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-b97e1f7a"]]);
register(t29);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "NcPasswordField",
  props: /* @__PURE__ */ mergeModels({
    class: {},
    inputClass: { default: "" },
    id: {},
    label: {},
    labelOutside: { type: Boolean },
    placeholder: {},
    showTrailingButton: { type: Boolean, default: true },
    success: { type: Boolean },
    error: { type: Boolean },
    helperText: {},
    disabled: { type: Boolean },
    pill: { type: Boolean },
    checkPasswordStrength: { type: Boolean },
    minlength: { default: void 0 },
    asText: { type: Boolean }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {},
    "visible": { type: Boolean, ...{ default: false } },
    "visibleModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["valid", "invalid"], ["update:modelValue", "update:visible"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const modelValue = useModel(__props, "modelValue");
    const visible = useModel(__props, "visible");
    const props = __props;
    const emit2 = __emit;
    __expose({
      focus,
      select
    });
    const { password_policy: passwordPolicy } = getCapabilities();
    const inputFieldInstance = useTemplateRef("inputField");
    const internalHelpMessage = ref("");
    const isValid = ref();
    const propsToForward = computed(() => {
      const all = { ...props };
      delete all.checkPasswordStrength;
      delete all.minlength;
      delete all.asText;
      delete all.error;
      delete all.helperText;
      delete all.inputClass;
      delete all.success;
      return all;
    });
    const minLengthWithPolicy = computed(() => {
      return props.minlength ?? (props.checkPasswordStrength ? passwordPolicy?.minLength : void 0) ?? void 0;
    });
    watch(modelValue, () => {
      isValid.value = void 0;
      internalHelpMessage.value = "";
    });
    watch(modelValue, debounce(checkPassword, 500));
    async function checkPassword() {
      if (!props.checkPasswordStrength || !modelValue.value) {
        return;
      }
      try {
        const { data } = await cancelableClient.post(generateOcsUrl("apps/password_policy/api/v1/validate"), { password: modelValue.value });
        isValid.value = data.ocs.data.passed;
        if (data.ocs.data.passed) {
          internalHelpMessage.value = t("Password is secure");
          emit2("valid");
          return;
        }
        internalHelpMessage.value = data.ocs.data.reason;
        emit2("invalid");
      } catch (error) {
        logger.error("Password policy returned an error", { error });
      }
    }
    function toggleVisibility() {
      visible.value = !visible.value;
    }
    function focus(options) {
      inputFieldInstance.value.focus(options);
    }
    function select() {
      inputFieldInstance.value.select();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(NcInputField, mergeProps(propsToForward.value, {
        ref: "inputField",
        modelValue: modelValue.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelValue.value = $event),
        error: __props.error || isValid.value === false,
        helperText: __props.helperText || internalHelpMessage.value,
        inputClass: [__props.inputClass, { "password-field__input--secure-text": !visible.value && __props.asText }],
        minlength: minLengthWithPolicy.value,
        success: __props.success || isValid.value === true,
        trailingButtonLabel: visible.value ? unref(t)("Hide password") : unref(t)("Show password"),
        type: visible.value || __props.asText ? "text" : "password",
        onTrailingButtonClick: toggleVisibility
      }), createSlots({
        "trailing-button-icon": withCtx(() => [
          createVNode(NcIconSvgWrapper, {
            path: visible.value ? unref(mdiEyeOff) : unref(mdiEye)
          }, null, 8, ["path"])
        ]),
        _: 2
      }, [
        !!_ctx.$slots.icon ? {
          name: "icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "icon", {}, void 0, true)
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["modelValue", "error", "helperText", "inputClass", "minlength", "success", "trailingButtonLabel", "type"]);
    };
  }
});
const NcPasswordField = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-cb828737"]]);
register(t49);
const _sfc_main$a = {
  name: "NcActionInput",
  components: {
    NcDateTimePickerNative,
    NcPasswordField,
    NcTextField: _sfc_main$B,
    // Lazy load components with more than 50kB bundle size impact
    NcColorPicker: defineAsyncComponent(() => __vitePreload(() => Promise.resolve().then(() => index$1), true ? void 0 : void 0, import.meta.url)),
    NcDateTimePicker: defineAsyncComponent(() => __vitePreload(() => Promise.resolve().then(() => index), true ? void 0 : void 0, import.meta.url)),
    NcSelect: defineAsyncComponent(() => __vitePreload(() => Promise.resolve().then(() => index$2), true ? void 0 : void 0, import.meta.url))
  },
  mixins: [ActionGlobalMixin],
  inheritAttrs: false,
  props: {
    /**
     * id attribute of the checkbox element
     */
    id: {
      type: String,
      default: () => "action-" + createElementId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * id attribute of the text input element
     */
    inputId: {
      type: String,
      default: () => "action-input-" + createElementId(),
      validator: (id) => id.trim() !== ""
    },
    /**
     * Icon to show with the action, can be either a CSS class or an URL
     */
    icon: {
      type: String,
      default: ""
    },
    /**
     * type attribute of the input field
     */
    type: {
      type: String,
      default: "text",
      validator(type) {
        return [
          "date",
          "datetime-local",
          "month",
          "multiselect",
          "number",
          "password",
          "search",
          "tel",
          "text",
          "time",
          "url",
          "week",
          "color",
          "email"
        ].includes(type);
      }
    },
    /**
     * id attribute for the native date time picker
     */
    idNativeDateTimePicker: {
      type: String,
      default: "date-time-picker_id"
    },
    /**
     * Flag to use a native date time picker
     */
    isNativePicker: {
      type: Boolean,
      default: false
    },
    /**
     * The visible input label for accessibility purposes.
     */
    label: {
      type: String,
      default: null
    },
    /**
     * If you want to show the label just above the
     * input field, pass in `true` to this prop.
     */
    labelOutside: {
      type: Boolean,
      default: true
    },
    /**
     * value attribute of the input field
     */
    modelValue: {
      type: [String, Date, Number, Array],
      default: ""
    },
    /**
     * disabled state of the input field
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * aria-label attribute of the input field
     */
    ariaLabel: {
      type: String,
      default: ""
    },
    /**
     * Attribute forwarded to the underlying NcPasswordField and NcTextField
     */
    showTrailingButton: {
      type: Boolean,
      default: true
    },
    /**
     * Trailing button label forwarded to the underlying NcTextField
     */
    trailingButtonLabel: {
      type: String,
      default: t("Submit")
    },
    /**
     * CSS class to apply to the root element.
     */
    class: {
      type: [String, Array, Object],
      default: ""
    }
  },
  emits: [
    "submit",
    "update:modelValue"
  ],
  computed: {
    isIconUrl() {
      try {
        return new URL(this.icon);
      } catch {
        return false;
      }
    },
    isMultiselectType() {
      return this.type === "multiselect";
    },
    nativeDatePickerType() {
      switch (this.type) {
        case "date":
        case "month":
        case "time":
        case "week":
        case "datetime-local":
          return this.type;
      }
      return false;
    },
    datePickerType() {
      if (!this.isNativePicker) {
        switch (this.type) {
          case "date":
          case "month":
          case "time":
            return this.type;
          case "datetime-local":
            return "datetime";
        }
      }
      return false;
    },
    /**
     * determines if the action is focusable
     *
     * @return {boolean} is the action focusable ?
     */
    isFocusable() {
      return !this.disabled;
    }
  },
  methods: {
    // closing datepicker popup on mouseleave = unfocus
    onLeave() {
      if (this.$refs.datetimepicker && this.$refs.datetimepicker.$refs.datepicker) {
        this.$refs.datetimepicker.$refs.datepicker.closePopup();
      }
    },
    onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.disabled) {
        this.$emit("submit", event);
      } else {
        return false;
      }
    },
    onUpdateModelValue(event) {
      this.$emit("update:modelValue", event);
    }
  }
};
const _hoisted_1$7 = { class: "action-input__icon-wrapper" };
const _hoisted_2$5 = ["disabled"];
const _hoisted_3$3 = { class: "action-input__container" };
const _hoisted_4$3 = ["for"];
const _hoisted_5$2 = { class: "action-input__input-container" };
const _hoisted_6$1 = {
  key: 4,
  class: "action-input__container"
};
const _hoisted_7 = ["for"];
const _hoisted_8 = { class: "action-input__input-container" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcDateTimePicker = resolveComponent("NcDateTimePicker");
  const _component_NcDateTimePickerNative = resolveComponent("NcDateTimePickerNative");
  const _component_NcSelect = resolveComponent("NcSelect");
  const _component_NcPasswordField = resolveComponent("NcPasswordField");
  const _component_NcColorPicker = resolveComponent("NcColorPicker");
  const _component_NcTextField = resolveComponent("NcTextField");
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(["action", [{ "action--disabled": $props.disabled }, _ctx.$props.class]])
  }, [
    createBaseVNode("span", {
      class: normalizeClass(["action-input", {
        "action-input-picker--disabled": $props.disabled,
        "action-input--visible-label": $props.labelOutside && $props.label
      }]),
      onMouseleave: _cache[3] || (_cache[3] = (...args) => $options.onLeave && $options.onLeave(...args))
    }, [
      createBaseVNode("span", _hoisted_1$7, [
        renderSlot(_ctx.$slots, "icon", {}, () => [
          createBaseVNode("span", {
            "aria-hidden": "true",
            class: normalizeClass(["action-input__icon", [$options.isIconUrl ? "action-input__icon--url" : $props.icon]]),
            style: normalizeStyle({ backgroundImage: $options.isIconUrl ? `url(${$props.icon})` : null })
          }, null, 6)
        ], true)
      ]),
      createBaseVNode("form", {
        ref: "form",
        class: "action-input__form",
        disabled: $props.disabled,
        onSubmit: _cache[2] || (_cache[2] = withModifiers((...args) => $options.onSubmit && $options.onSubmit(...args), ["prevent"]))
      }, [
        createBaseVNode("div", _hoisted_3$3, [
          $props.label && $props.labelOutside && !$props.isNativePicker ? (openBlock(), createElementBlock("label", {
            key: 0,
            class: normalizeClass(["action-input__text-label", { "action-input__text-label--hidden": !$props.labelOutside }]),
            for: $props.inputId
          }, toDisplayString($props.label), 11, _hoisted_4$3)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_5$2, [
            $options.datePickerType ? (openBlock(), createBlock(_component_NcDateTimePicker, mergeProps({
              key: 0,
              ref: "datetimepicker",
              modelValue: $props.modelValue,
              style: { "z-index": "99999999999" },
              placeholder: _ctx.text,
              disabled: $props.disabled,
              type: $options.datePickerType,
              inputClass: ["mx-input", { focusable: $options.isFocusable }],
              class: "action-input__datetimepicker",
              appendToBody: ""
            }, _ctx.$attrs, { "onUpdate:modelValue": $options.onUpdateModelValue }), null, 16, ["modelValue", "placeholder", "disabled", "type", "inputClass", "onUpdate:modelValue"])) : $props.isNativePicker ? (openBlock(), createBlock(_component_NcDateTimePickerNative, mergeProps({
              key: 1,
              id: $props.idNativeDateTimePicker,
              modelValue: $props.modelValue,
              label: $props.label,
              type: $options.nativeDatePickerType,
              inputClass: { focusable: $options.isFocusable },
              class: "action-input__datetimepicker"
            }, _ctx.$attrs, { "onUpdate:modelValue": $options.onUpdateModelValue }), null, 16, ["id", "modelValue", "label", "type", "inputClass", "onUpdate:modelValue"])) : $options.isMultiselectType ? (openBlock(), createBlock(_component_NcSelect, mergeProps({
              key: 2,
              modelValue: $props.modelValue,
              placeholder: _ctx.text,
              disabled: $props.disabled,
              appendToBody: false,
              inputClass: { focusable: $options.isFocusable },
              class: "action-input__multi"
            }, _ctx.$attrs, { "onUpdate:modelValue": $options.onUpdateModelValue }), null, 16, ["modelValue", "placeholder", "disabled", "inputClass", "onUpdate:modelValue"])) : $props.type === "password" ? (openBlock(), createBlock(_component_NcPasswordField, mergeProps({
              key: 3,
              id: $props.inputId,
              modelValue: $props.modelValue,
              label: $props.label,
              labelOutside: !$props.label || $props.labelOutside,
              placeholder: _ctx.text,
              disabled: $props.disabled,
              inputClass: { focusable: $options.isFocusable },
              showTrailingButton: $props.showTrailingButton && !$props.disabled
            }, _ctx.$attrs, { "onUpdate:modelValue": $options.onUpdateModelValue }), null, 16, ["id", "modelValue", "label", "labelOutside", "placeholder", "disabled", "inputClass", "showTrailingButton", "onUpdate:modelValue"])) : $props.type === "color" ? (openBlock(), createElementBlock("div", _hoisted_6$1, [
              $props.label && $props.type === "color" ? (openBlock(), createElementBlock("label", {
                key: 0,
                class: normalizeClass(["action-input__text-label", { "action-input__text-label--hidden": !$props.labelOutside }]),
                for: $props.inputId
              }, toDisplayString($props.label), 11, _hoisted_7)) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_8, [
                createVNode(_component_NcColorPicker, mergeProps({
                  id: "inputId",
                  modelValue: $props.modelValue,
                  class: "colorpicker__trigger"
                }, _ctx.$attrs, {
                  "onUpdate:modelValue": $options.onUpdateModelValue,
                  onSubmit: _cache[0] || (_cache[0] = ($event) => _ctx.$refs.form.requestSubmit())
                }), {
                  default: withCtx(() => [
                    createBaseVNode("button", {
                      class: normalizeClass(["colorpicker__preview", { focusable: $options.isFocusable }]),
                      style: normalizeStyle({ "background-color": $props.modelValue })
                    }, null, 6)
                  ]),
                  _: 1
                }, 16, ["modelValue", "onUpdate:modelValue"])
              ])
            ])) : (openBlock(), createBlock(_component_NcTextField, mergeProps({
              key: 5,
              id: $props.inputId,
              modelValue: $props.modelValue,
              label: $props.label,
              labelOutside: !$props.label || $props.labelOutside,
              placeholder: _ctx.text,
              disabled: $props.disabled,
              inputClass: { focusable: $options.isFocusable },
              type: $props.type,
              trailingButtonIcon: "arrowRight",
              trailingButtonLabel: $props.trailingButtonLabel,
              showTrailingButton: $props.showTrailingButton && !$props.disabled
            }, _ctx.$attrs, {
              onTrailingButtonClick: _cache[1] || (_cache[1] = ($event) => _ctx.$refs.form.requestSubmit()),
              "onUpdate:modelValue": $options.onUpdateModelValue
            }), null, 16, ["id", "modelValue", "label", "labelOutside", "placeholder", "disabled", "inputClass", "type", "trailingButtonLabel", "showTrailingButton", "onUpdate:modelValue"]))
          ])
        ])
      ], 40, _hoisted_2$5)
    ], 34)
  ], 2);
}
const NcActionInput = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$2], ["__scopeId", "data-v-43230e98"]]);
/*!
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
function findRanges(text, search) {
  const ranges = [];
  let currentIndex = 0;
  let index2 = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
  let i = 0;
  while (index2 > -1 && i++ < text.length) {
    currentIndex = index2 + search.length;
    ranges.push({ start: index2, end: currentIndex });
    index2 = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
  }
  return ranges;
}
const _sfc_main$9 = defineComponent({
  name: "NcHighlight",
  props: {
    /**
     * The string to display
     */
    text: {
      type: String,
      default: ""
    },
    /**
     * The string to match and highlight
     */
    search: {
      type: String,
      default: ""
    },
    /**
     * The ranges to highlight, takes precedence over the search prop.
     */
    highlight: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    /**
     * The indice ranges which should be highlighted.
     * If an array with ranges is provided, we use it. Otherwise
     * we calculate it based on the provided substring to highlight.
     *
     * @return The array of ranges to highlight
     */
    ranges() {
      let ranges = [];
      if (!this.search && this.highlight.length === 0) {
        return ranges;
      }
      if (this.highlight.length > 0) {
        ranges = this.highlight;
      } else {
        ranges = findRanges(this.text, this.search);
      }
      ranges.forEach((range, i) => {
        if (range.end < range.start) {
          ranges[i] = {
            start: range.end,
            end: range.start
          };
        }
      });
      ranges = ranges.reduce((validRanges, range) => {
        if (range.start < this.text.length && range.end > 0) {
          validRanges.push({
            start: range.start < 0 ? 0 : range.start,
            end: range.end > this.text.length ? this.text.length : range.end
          });
        }
        return validRanges;
      }, []);
      ranges.sort((a, b2) => {
        return a.start - b2.start;
      });
      ranges = ranges.reduce((mergedRanges, range) => {
        if (!mergedRanges.length) {
          mergedRanges.push(range);
        } else {
          const idx = mergedRanges.length - 1;
          if (mergedRanges[idx].end >= range.start) {
            mergedRanges[idx] = {
              start: mergedRanges[idx].start,
              end: Math.max(mergedRanges[idx].end, range.end)
            };
          } else {
            mergedRanges.push(range);
          }
        }
        return mergedRanges;
      }, []);
      return ranges;
    },
    /**
     * Calculate the different chunks to show based on the ranges to highlight.
     */
    chunks() {
      if (this.ranges.length === 0) {
        return [{
          start: 0,
          end: this.text.length,
          highlight: false,
          text: this.text
        }];
      }
      const chunks = [];
      let currentIndex = 0;
      let currentRange = 0;
      while (currentIndex < this.text.length) {
        const range = this.ranges[currentRange];
        if (range.start === currentIndex) {
          chunks.push({
            ...range,
            highlight: true,
            text: this.text.slice(range.start, range.end)
          });
          currentRange++;
          currentIndex = range.end;
          if (currentRange >= this.ranges.length && currentIndex < this.text.length) {
            chunks.push({
              start: currentIndex,
              end: this.text.length,
              highlight: false,
              text: this.text.slice(currentIndex)
            });
            currentIndex = this.text.length;
          }
          continue;
        }
        chunks.push({
          start: currentIndex,
          end: range.start,
          highlight: false,
          text: this.text.slice(currentIndex, range.start)
        });
        currentIndex = range.start;
      }
      return chunks;
    }
  },
  /**
   * The render function to display the component
   */
  render() {
    if (!this.ranges.length) {
      return h$1("span", {}, this.text);
    }
    return h$1("span", {}, this.chunks.map((chunk) => {
      return chunk.highlight ? h$1("strong", {}, chunk.text) : chunk.text;
    }));
  }
});
const _sfc_main$8 = {
  name: "NcEllipsisedOption",
  components: {
    NcHighlight: _sfc_main$9
  },
  props: {
    /**
     * The text to be display in one line. If it is longer than 10 characters, it is be truncated with ellipsis in the end but keeping up to 10 last characters to fit the parent container.
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * The search value to highlight in the text
     */
    search: {
      type: String,
      default: ""
    }
  },
  computed: {
    needsTruncate() {
      return this.name && this.name.length >= 10;
    },
    /**
     * Index at which to split the name if it is longer than 10 characters.
     *
     * @return {number} The position at which to split
     */
    split() {
      return this.name.length - Math.min(Math.floor(this.name.length / 2), 10);
    },
    part1() {
      if (this.needsTruncate) {
        return this.name.slice(0, this.split);
      }
      return this.name;
    },
    part2() {
      if (this.needsTruncate) {
        return this.name.slice(this.split);
      }
      return "";
    },
    /**
     * The ranges to highlight. Since we split the string for ellipsising,
     * the Highlight component cannot figure this out itself and needs the ranges provided.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight1() {
      if (!this.search) {
        return [];
      }
      return findRanges(this.name, this.search);
    },
    /**
     * We shift the ranges for the second part by the position of the split.
     * Ranges out of the string length are discarded by the Highlight component,
     * so we don't need to take care of this here.
     *
     * @return {Array} The array with the ranges to highlight
     */
    highlight2() {
      return this.highlight1.map((range) => {
        return {
          start: range.start - this.split,
          end: range.end - this.split
        };
      });
    }
  }
};
const _hoisted_1$6 = ["title"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NcHighlight = resolveComponent("NcHighlight");
  return openBlock(), createElementBlock("span", {
    dir: "auto",
    class: "name-parts",
    title: $props.name
  }, [
    createVNode(_component_NcHighlight, {
      class: "name-parts__first",
      text: $options.part1,
      search: $props.search,
      highlight: $options.highlight1
    }, null, 8, ["text", "search", "highlight"]),
    $options.part2 ? (openBlock(), createBlock(_component_NcHighlight, {
      key: 0,
      class: "name-parts__last",
      text: $options.part2,
      search: $props.search,
      highlight: $options.highlight2
    }, null, 8, ["text", "search", "highlight"])) : createCommentVNode("", true)
  ], 8, _hoisted_1$6);
}
const NcEllipsisedOption = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$1], ["__scopeId", "data-v-a612f185"]]);
register(t17);
const _sfc_main$7 = {
  name: "NcSelect",
  components: {
    ChevronDown,
    NcEllipsisedOption,
    NcLoadingIcon,
    VueSelect: Select
  },
  props: {
    // Add VueSelect props to $props
    ...Select.props,
    ...Select.mixins.reduce((allProps, mixin) => ({ ...allProps, ...mixin.props }), {}),
    /**
     * `aria-label` for the clear input button
     */
    ariaLabelClearSelected: {
      type: String,
      default: t("Clear selected")
    },
    /**
     * `aria-label` for the search input
     *
     * A descriptive `inputLabel` is preferred as this is not visible.
     */
    ariaLabelCombobox: {
      type: String,
      default: null
    },
    /**
     * `aria-label` for the listbox element
     */
    ariaLabelListbox: {
      type: String,
      default: t("Options")
    },
    /**
     * Allows to customize the `aria-label` for the deselect-option button
     * The default is "Deselect " + optionLabel
     *
     * @type {(optionLabel: string) => string}
     */
    ariaLabelDeselectOption: {
      type: Function,
      default: (optionLabel) => t("Deselect {option}", { option: optionLabel })
    },
    /**
     * Append the dropdown element to the end of the body
     * and size/position it dynamically.
     *
     * @see https://vue-select.org/api/props.html#appendtobody
     */
    appendToBody: {
      type: Boolean,
      default: true
    },
    /**
     * When `appendToBody` is true, this function is responsible for
     * positioning the drop down list.
     *
     * If a function is returned from `calculatePosition`, it will
     * be called when the drop down list is removed from the DOM.
     * This allows for any garbage collection you may need to do.
     *
     * @see https://vue-select.org/api/props.html#calculateposition
     */
    calculatePosition: {
      type: Function,
      default: null
    },
    /**
     * Keep the dropdown open after selecting an option.
     *
     * @default false
     * @since 8.25.0
     */
    keepOpen: {
      type: Boolean,
      default: false
    },
    /**
     * Replace default vue-select components
     *
     * @see https://vue-select.org/api/props.html#components
     */
    components: {
      type: Object,
      default: () => ({
        Deselect: {
          render: () => h$1(IconClose, {
            size: 20,
            fillColor: "var(--vs-controls-color)",
            style: [
              { cursor: "pointer" }
            ]
          })
        }
      })
    },
    /**
     * Sets the maximum number of options to display in the dropdown list
     */
    limit: {
      type: Number,
      default: null
    },
    /**
     * Disable the component
     *
     * @see https://vue-select.org/api/props.html#disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Determines whether the dropdown should be open.
     * Receives the component instance as the only argument.
     *
     * @see https://vue-select.org/api/props.html#dropdownshouldopen
     */
    dropdownShouldOpen: {
      type: Function,
      default: ({ noDrop, open }) => {
        return noDrop ? false : open;
      }
    },
    /**
     * Callback to determine if the provided option should
     * match the current search text. Used to determine
     * if the option should be displayed.
     *
     * Defaults to the internal vue-select function documented at the link
     * below
     *
     * @see https://vue-select.org/api/props.html#filterby
     */
    filterBy: {
      type: Function,
      default: null
    },
    /**
     * Class for the `input`
     *
     * Necessary for use in NcActionInput
     */
    inputClass: {
      type: [String, Object],
      default: null
    },
    /**
     * Input element id
     */
    inputId: {
      type: String,
      default: () => createElementId()
    },
    /**
     * Visible label for the input element
     */
    inputLabel: {
      type: String,
      default: null
    },
    /**
     * Pass true if you are using an external label
     */
    labelOutside: {
      type: Boolean,
      default: false
    },
    /**
     * Display a visible border around dropdown options
     * which have keyboard focus
     */
    keyboardFocusBorder: {
      type: Boolean,
      default: true
    },
    /**
     * Key of the displayed label for object options
     *
     * Defaults to the internal vue-select string documented at the link
     * below
     *
     * @see https://vue-select.org/api/props.html#label
     */
    label: {
      type: String,
      default: null
    },
    /**
     * Show the loading icon
     *
     * @see https://vue-select.org/api/props.html#loading
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Allow selection of multiple options
     *
     * @see https://vue-select.org/api/props.html#multiple
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * Disable automatic wrapping when selected options overflow the width
     */
    noWrap: {
      type: Boolean,
      default: false
    },
    /**
     * Array of options
     *
     * @type {Array<string | number | Record<string | number, any>>}
     *
     * @see https://vue-select.org/api/props.html#options
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * Placeholder text
     *
     * @see https://vue-select.org/api/props.html#placeholder
     */
    placeholder: {
      type: String,
      default: ""
    },
    /**
     * Customized component's response to keydown events while the search input has focus
     *
     * @see https://vue-select.org/guide/keydown.html#mapkeydown
     */
    mapKeydown: {
      type: Function,
      /**
       * Patched Vue-Select keydown events handlers map to stop Escape propagation in open select
       *
       * @param {Record<number, (event: KeyboardEvent) => void>} map - Mapped keyCode to handlers { <keyCode>:<callback> }
       * @param {import('vue').ComponentPublicInstance} vm - VueSelect instance
       * @return {Record<number, (event: KeyboardEvent) => void>} patched keydown event handlers
       */
      default(map, vm) {
        return {
          ...map,
          /**
           * Patched Escape handler to stop propagation from open select
           *
           * @param {KeyboardEvent} event - default keydown event handler
           */
          27: (event) => {
            if (vm.open) {
              event.stopPropagation();
            }
            map[27](event);
          }
        };
      }
    },
    /**
     * A unique identifier used to generate IDs and DOM attributes. Must be unique for every instance of the component.
     *
     * @see https://vue-select.org/api/props.html#uid
     */
    uid: {
      type: String,
      default: () => createElementId()
    },
    /**
     * When `appendToBody` is true, this sets the placement of the dropdown
     *
     * @type {'bottom' | 'top'}
     */
    placement: {
      type: String,
      default: "bottom"
    },
    /**
     * If false, the focused dropdown option will not be reset when filtered
     * options change
     */
    resetFocusOnOptionsChange: {
      type: Boolean,
      default: true
    },
    /**
     * Currently selected value
     *
     * The `v-model` directive may be used for two-way data binding
     *
     * @type {string | number | Record<string | number, any> | Array<any>}
     *
     * @see https://vue-select.org/api/props.html#value
     */
    modelValue: {
      type: [String, Number, Object, Array],
      default: null
    },
    /**
     * Enable if a value is required for native form validation
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * Any available prop
     *
     * @see https://vue-select.org/api/props.html
     */
    // Not an actual prop but needed to show in vue-styleguidist docs
    // eslint-disable-next-line
    " ": {}
  },
  emits: [
    /**
     * All events from https://vue-select.org/api/events.html
     */
    // Not an actual event but needed to show in vue-styleguidist docs
    " ",
    "update:modelValue"
  ],
  setup() {
    const clickableArea = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-clickable-area"));
    const gridBaseLine = Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--default-grid-baseline"));
    const avatarSize = clickableArea - 2 * gridBaseLine;
    return {
      avatarSize,
      isLegacy
    };
  },
  data() {
    return {
      search: ""
    };
  },
  computed: {
    inputRequired() {
      if (!this.required) {
        return null;
      }
      return this.modelValue === null || Array.isArray(this.modelValue) && this.modelValue.length === 0;
    },
    localCalculatePosition() {
      if (this.calculatePosition !== null) {
        return this.calculatePosition;
      }
      return (dropdownMenu, component, { width }) => {
        dropdownMenu.style.width = width;
        const addClass = {
          name: "addClass",
          fn() {
            dropdownMenu.classList.add("vs__dropdown-menu--floating");
            return {};
          }
        };
        const togglePlacementClass = {
          name: "togglePlacementClass",
          fn({ placement }) {
            component.$el.classList.toggle(
              "select--drop-up",
              placement === "top"
            );
            dropdownMenu.classList.toggle(
              "vs__dropdown-menu--floating-placement-top",
              placement === "top"
            );
            return {};
          }
        };
        const updatePosition = () => {
          computePosition(component.$refs.toggle, dropdownMenu, {
            placement: this.placement,
            middleware: [
              offset$1(-1),
              addClass,
              togglePlacementClass,
              // Match popperjs default collision prevention behavior by appending the following middleware in order
              flip$1(),
              shift$1({ limiter: limitShift() })
            ]
          }).then(({ x, y: y2 }) => {
            Object.assign(dropdownMenu.style, {
              left: `${x}px`,
              top: `${y2}px`,
              width: `${component.$refs.toggle.getBoundingClientRect().width}px`
            });
          });
        };
        const cleanup = autoUpdate(
          component.$refs.toggle,
          dropdownMenu,
          updatePosition
        );
        return cleanup;
      };
    },
    localFilterBy() {
      return this.filterBy ?? Select.props.filterBy.default;
    },
    localLabel() {
      return this.label ?? Select.props.label.default;
    },
    propsToForward() {
      const vueSelectKeys = [
        ...Object.keys(Select.props),
        ...Select.mixins.flatMap((mixin) => Object.keys(mixin.props ?? {}))
      ];
      const initialPropsToForward = Object.fromEntries(Object.entries(this.$props).filter(([key, _value]) => vueSelectKeys.includes(key)));
      const propsToForward = {
        ...initialPropsToForward,
        // Custom overrides of vue-select props
        calculatePosition: this.localCalculatePosition,
        closeOnSelect: !this.keepOpen,
        filterBy: this.localFilterBy,
        label: this.localLabel
      };
      return propsToForward;
    }
  },
  mounted() {
    if (!this.labelOutside && !this.inputLabel && !this.ariaLabelCombobox) ;
    if (this.inputLabel && this.ariaLabelCombobox) ;
  },
  methods: {
    t
  }
};
const _hoisted_1$5 = ["for"];
const _hoisted_2$4 = ["required"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ChevronDown = resolveComponent("ChevronDown");
  const _component_NcEllipsisedOption = resolveComponent("NcEllipsisedOption");
  const _component_NcLoadingIcon = resolveComponent("NcLoadingIcon");
  const _component_VueSelect = resolveComponent("VueSelect");
  return openBlock(), createBlock(_component_VueSelect, mergeProps({
    class: ["select", {
      "select--legacy": $setup.isLegacy,
      "select--no-wrap": $props.noWrap
    }]
  }, $options.propsToForward, {
    onSearch: _cache[0] || (_cache[0] = ($event) => $data.search = $event),
    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:modelValue", $event))
  }), createSlots({
    search: withCtx(({ attributes, events }) => [
      createBaseVNode("input", mergeProps({
        class: ["vs__search", [$props.inputClass]]
      }, attributes, {
        required: $options.inputRequired,
        dir: "auto"
      }, toHandlers(events, true)), null, 16, _hoisted_2$4)
    ]),
    "open-indicator": withCtx(({ attributes }) => [
      createVNode(_component_ChevronDown, mergeProps(attributes, {
        fillColor: "var(--vs-controls-color)",
        style: {
          cursor: !$props.disabled ? "pointer" : null
        },
        size: 26
      }), null, 16, ["style"])
    ]),
    option: withCtx((option) => [
      renderSlot(_ctx.$slots, "option", normalizeProps(guardReactiveProps(option)), () => [
        createVNode(_component_NcEllipsisedOption, {
          name: String(option[$options.localLabel]),
          search: $data.search
        }, null, 8, ["name", "search"])
      ])
    ]),
    "selected-option": withCtx((selectedOption) => [
      renderSlot(_ctx.$slots, "selected-option", normalizeProps(guardReactiveProps(selectedOption)), () => [
        createVNode(_component_NcEllipsisedOption, {
          name: String(selectedOption[$options.localLabel]),
          search: $data.search
        }, null, 8, ["name", "search"])
      ])
    ]),
    spinner: withCtx((spinner) => [
      spinner.loading ? (openBlock(), createBlock(_component_NcLoadingIcon, { key: 0 })) : createCommentVNode("", true)
    ]),
    "no-options": withCtx(() => [
      createTextVNode(toDisplayString($options.t("No results")), 1)
    ]),
    _: 2
  }, [
    !$props.labelOutside && $props.inputLabel ? {
      name: "header",
      fn: withCtx(() => [
        createBaseVNode("label", {
          for: $props.inputId,
          class: "select__label"
        }, toDisplayString($props.inputLabel), 9, _hoisted_1$5)
      ]),
      key: "0"
    } : void 0,
    renderList(_ctx.$slots, (_2, name) => {
      return {
        name,
        fn: withCtx((data) => [
          renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(data)))
        ])
      };
    })
  ]), 1040, ["class"]);
}
const NcSelect = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render]]);
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NcSelect
}, Symbol.toStringTag, { value: "Module" }));
const APP_SETTINGS_REGISTRATION_KEY = /* @__PURE__ */ Symbol.for("NcAppSettingsDialog:registration");
const APP_SETTINGS_LEGACY_DESIGN_KEY = /* @__PURE__ */ Symbol.for("NcAppSettingsDialog:legacy");
function useAppSettingsDialog() {
  return inject(APP_SETTINGS_REGISTRATION_KEY);
}
const _sfc_main$1$1 = /* @__PURE__ */ defineComponent({
  __name: "NcAppSettingsDialogVersion",
  setup(__props) {
    const legacy = inject(APP_SETTINGS_LEGACY_DESIGN_KEY);
    const localizedAppName = useLocalizedAppName();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([_ctx.$style.appSettingsDialogVersion, { [_ctx.$style.appSettingsDialogVersion__legacy]: unref(legacy) }])
      }, toDisplayString(unref(localizedAppName)) + " " + toDisplayString(unref(APP_VERSION)), 3);
    };
  }
});
const appSettingsDialogVersion = "_appSettingsDialogVersion_Y2viq";
const appSettingsDialogVersion__legacy = "_appSettingsDialogVersion__legacy_I-lpS";
const style0$2 = {
  "material-design-icon": "_material-design-icon_1zyjw",
  appSettingsDialogVersion,
  appSettingsDialogVersion__legacy
};
const cssModules$2 = {
  "$style": style0$2
};
const NcAppSettingsDialogVersion = /* @__PURE__ */ _export_sfc(_sfc_main$1$1, [["__cssModules", cssModules$2]]);
register(t48);
const _hoisted_1$4 = {
  key: 0,
  class: "app-settings__title"
};
const _hoisted_2$3 = {
  key: 1,
  class: "navigation-list"
};
const _hoisted_3$2 = ["aria-current", "href", "onClick", "onKeydown"];
const _hoisted_4$2 = {
  key: 0,
  class: "navigation-list__link-icon"
};
const _hoisted_5$1 = { class: "navigation-list__link-text" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "NcAppSettingsDialog",
  props: /* @__PURE__ */ mergeModels({
    showNavigation: { type: Boolean },
    container: { default: "body" },
    name: { default: "" },
    additionalTrapElements: { default: () => [] },
    legacy: { type: Boolean, default: false },
    noVersion: { type: Boolean, default: false }
  }, {
    "open": { type: Boolean, ...{ required: true } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const props = __props;
    provide(APP_SETTINGS_REGISTRATION_KEY, {
      registerSection,
      unregisterSection
    });
    provide(APP_SETTINGS_LEGACY_DESIGN_KEY, toRef(() => props.legacy));
    const settingsScrollerElement = useTemplateRef("settingsScroller");
    const isMobile2 = useIsMobile();
    const selectedSection = ref("");
    const linkClicked = ref(false);
    const registeredSections = ref([]);
    const hasNavigation = computed(() => !isMobile2.value && props.showNavigation);
    const hasNavigationIcons = computed(() => registeredSections.value.some(({ icon }) => !!icon));
    const unfocusNavigationItem = debounce(() => {
      selectedSection.value = "";
      if (document.activeElement?.className.includes("navigation-list__link")) {
        document.activeElement.blur();
      }
    }, 300);
    const sectionsOrderMap = /* @__PURE__ */ new Map();
    onBeforeUnmount(() => {
      sectionsOrderMap.clear();
    });
    function handleSettingsNavigationClick(item) {
      linkClicked.value = true;
      document.getElementById("settings-section_" + item).scrollIntoView({
        behavior: "smooth",
        inline: "nearest"
      });
      selectedSection.value = item;
      setTimeout(() => {
        linkClicked.value = false;
      }, 1e3);
    }
    function handleCloseModal(isOpen) {
      if (isOpen) {
        return;
      }
      open.value = false;
      settingsScrollerElement.value.scrollTop = 0;
    }
    function handleScroll() {
      if (open.value && !linkClicked.value) {
        unfocusNavigationItem();
      }
    }
    function registerSection(id, name, order, icon) {
      if (registeredSections.value.some(({ id: otherId }) => id === otherId)) {
        throw new Error(`Duplicate section id found: ${id}. Settings navigation sections must have unique section ids.`);
      }
      if (registeredSections.value.some(({ name: otherName }) => name === otherName)) ;
      if (order !== void 0) {
        sectionsOrderMap.set(id, order);
      } else if (sectionsOrderMap.has(id)) {
        order = sectionsOrderMap.get(id);
      } else {
        order = Math.max(0, ...sectionsOrderMap.values()) + 1;
        sectionsOrderMap.set(id, order);
      }
      registeredSections.value = [...registeredSections.value, { id, name, order, icon }].sort(({ order: orderA }, { order: orderB }) => {
        return orderA - orderB;
      });
      if (registeredSections.value.length === 1) {
        selectedSection.value = id;
      }
    }
    function unregisterSection(id) {
      registeredSections.value = registeredSections.value.filter(({ id: otherId }) => id !== otherId);
      if (selectedSection.value === id) {
        selectedSection.value = registeredSections.value[0]?.id ?? "";
      }
    }
    return (_ctx, _cache) => {
      return open.value ? (openBlock(), createBlock(NcDialog, {
        key: 0,
        class: normalizeClass(["app-settings", { "app-settings--legacy": unref(isLegacy34) }]),
        contentClasses: "app-settings__content",
        navigationClasses: "app-settings__navigation",
        additionalTrapElements: __props.additionalTrapElements,
        container: __props.container,
        closeOnClickOutside: "",
        "navigation-aria-label": unref(t)("Settings navigation"),
        size: "large",
        name: __props.name,
        "onUpdate:open": handleCloseModal
      }, createSlots({
        default: withCtx(() => [
          createBaseVNode("div", {
            ref: "settingsScroller",
            onScroll: handleScroll
          }, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true),
            !__props.noVersion ? (openBlock(), createBlock(NcAppSettingsDialogVersion, { key: 0 })) : createCommentVNode("", true)
          ], 544)
        ]),
        _: 2
      }, [
        hasNavigation.value ? {
          name: "navigation",
          fn: withCtx(({ isCollapsed }) => [
            !unref(isLegacy34) ? (openBlock(), createElementBlock("div", _hoisted_1$4, toDisplayString(__props.name), 1)) : createCommentVNode("", true),
            !isCollapsed ? (openBlock(), createElementBlock("ul", _hoisted_2$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(registeredSections.value, (section) => {
                return openBlock(), createElementBlock("li", {
                  key: section.id
                }, [
                  createBaseVNode("a", {
                    "aria-current": `${section.id === selectedSection.value}`,
                    class: normalizeClass(["navigation-list__link", {
                      "navigation-list__link--active": section.id === selectedSection.value,
                      "navigation-list__link--icon": hasNavigationIcons.value
                    }]),
                    href: `#settings-section_${section.id}`,
                    tabindex: "0",
                    onClick: withModifiers(($event) => handleSettingsNavigationClick(section.id), ["prevent"]),
                    onKeydown: withKeys(($event) => handleSettingsNavigationClick(section.id), ["enter"])
                  }, [
                    hasNavigationIcons.value ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
                      section.icon ? (openBlock(), createBlock(_sfc_main$x, {
                        key: 0,
                        vnodes: section.icon
                      }, null, 8, ["vnodes"])) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createBaseVNode("span", _hoisted_5$1, toDisplayString(section.name), 1)
                  ], 42, _hoisted_3$2)
                ]);
              }), 128))
            ])) : createCommentVNode("", true)
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["class", "additionalTrapElements", "container", "navigation-aria-label", "name"])) : createCommentVNode("", true);
    };
  }
});
const NcAppSettingsDialog = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-71803906"]]);
const _hoisted_1$3 = ["id", "aria-labelledby"];
const _hoisted_2$2 = ["id"];
const _hoisted_3$1 = { class: "app-settings-section__description" };
const _hoisted_4$1 = { class: "app-settings-section__content" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "NcAppSettingsSection",
  props: {
    name: {},
    description: {},
    id: {},
    order: {}
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const { registerSection, unregisterSection } = useAppSettingsDialog();
    const legacy = inject(APP_SETTINGS_LEGACY_DESIGN_KEY);
    const htmlId = computed(() => "settings-section_" + props.id);
    watch(() => props.id, () => {
      if (!/^[a-z0-9\-_]+$/.test(props.id)) {
        logger.warn(`Invalid id prop: ${props.id}. Only alphanumeric, dash and underscore are allowed.`);
      }
    }, { immediate: true });
    watch([() => props.id, () => props.name, () => props.order], ([newId, newName, newOrder], [oldId, ,]) => {
      unregisterSection(oldId);
      registerSection(newId, newName, newOrder, slots?.icon?.());
    });
    onMounted(() => {
      registerSection(props.id, props.name, props.order, slots?.icon?.());
    });
    onBeforeUnmount(() => {
      unregisterSection(props.id);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        id: htmlId.value,
        "aria-labelledby": `${htmlId.value}--label`,
        class: normalizeClass(["app-settings-section", { "app-settings-section__legacy": unref(legacy) }])
      }, [
        createBaseVNode("h3", {
          id: `${htmlId.value}--label`,
          class: "app-settings-section__name"
        }, toDisplayString(__props.name), 9, _hoisted_2$2),
        createBaseVNode("div", _hoisted_3$1, toDisplayString(__props.description), 1),
        createBaseVNode("div", _hoisted_4$1, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ], 10, _hoisted_1$3);
    };
  }
});
const NcAppSettingsSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-9f146f2d"]]);
const _hoisted_1$2 = ["id"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "NcFormBoxItem",
  props: {
    tag: {},
    label: { default: () => void 0 },
    description: { default: () => void 0 },
    invertedAccent: { type: Boolean, default: false },
    class: { default: () => void 0 },
    itemClasses: { default: () => void 0 }
  },
  emits: ["click"],
  setup(__props) {
    const slots = useSlots();
    const { formBoxItemClass } = useNcFormBox();
    const descriptionId = createElementId();
    const hasDescription = () => !!__props.description || !!slots.description;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          __props.class,
          _ctx.$style.formBoxItem,
          unref(formBoxItemClass),
          {
            [_ctx.$style.formBoxItem_inverted]: __props.invertedAccent && hasDescription(),
            [_ctx.$style.formBoxItem_legacy]: unref(isLegacy)
          }
        ])
      }, [
        createBaseVNode("span", {
          class: normalizeClass(_ctx.$style.formBoxItem__content)
        }, [
          (openBlock(), createBlock(resolveDynamicComponent(__props.tag), mergeProps({
            class: [_ctx.$style.formBoxItem__element, __props.itemClasses]
          }, _ctx.$attrs, {
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
          }), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default", { descriptionId: unref(descriptionId) }, () => [
                createTextVNode(toDisplayString(__props.label || "⚠️ Label is missing"), 1)
              ])
            ]),
            _: 3
          }, 16, ["class"])),
          hasDescription() ? (openBlock(), createElementBlock("span", {
            key: 0,
            id: unref(descriptionId),
            class: normalizeClass(_ctx.$style.formBoxItem__description)
          }, [
            renderSlot(_ctx.$slots, "description", {}, () => [
              createTextVNode(toDisplayString(__props.description), 1)
            ])
          ], 10, _hoisted_1$2)) : createCommentVNode("", true)
        ], 2),
        createBaseVNode("span", {
          class: normalizeClass(_ctx.$style.formBoxItem__icon)
        }, [
          renderSlot(_ctx.$slots, "icon", { descriptionId: unref(descriptionId) }, () => [
            _cache[1] || (_cache[1] = createTextVNode(" ⚠️ Icon is missing ", -1))
          ])
        ], 2)
      ], 2);
    };
  }
});
const formBoxItem = "_formBoxItem_Gp-TA";
const formBoxItem__description = "_formBoxItem__description_UqZJ1";
const formBoxItem_legacy = "_formBoxItem_legacy_dP9aJ";
const formBoxItem_inverted = "_formBoxItem_inverted_BU-i-";
const formBoxItem__element = "_formBoxItem__element_jHCux";
const formBoxItem__content = "_formBoxItem__content_UKovC";
const formBoxItem__icon = "_formBoxItem__icon_AvkP3";
const style0$1 = {
  "material-design-icon": "_material-design-icon_8BFGk",
  formBoxItem,
  formBoxItem__description,
  formBoxItem_legacy,
  formBoxItem_inverted,
  formBoxItem__element,
  formBoxItem__content,
  formBoxItem__icon
};
const cssModules$1 = {
  "$style": style0$1
};
const NcFormBoxItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__cssModules", cssModules$1]]);
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
function useButtonLink(options) {
  const props = reactive(options);
  const hasVueRouterContext = inject(routerKey, null) !== null;
  const tag = computed(() => {
    if (hasVueRouterContext && props.to) {
      return "RouterLink";
    } else if (props.href) {
      return "a";
    } else {
      return "button";
    }
  });
  const isLink = computed(() => tag.value === "RouterLink" || tag.value === "a");
  const isHyperLink = computed(() => tag.value === "a");
  const isRouterLink = computed(() => tag.value === "RouterLink");
  const isButton = computed(() => tag.value === "button");
  const attrs = computed(() => {
    if (tag.value === "RouterLink") {
      return {
        to: props.to,
        activeClass: "active",
        ...props.additionalAttrs?.("RouterLink") ?? {}
      };
    } else if (tag.value === "a") {
      return {
        href: props.href,
        target: props.target,
        download: props.download || void 0,
        rel: "nofollow noreferrer noopener",
        ...props.additionalAttrs?.("a") ?? {}
      };
    } else if (tag.value === "button") {
      return {
        type: props.type || "button",
        disabled: props.disabled,
        ...props.additionalAttrs?.("button") ?? {}
      };
    }
  });
  return {
    tag,
    isLink,
    isHyperLink,
    isRouterLink,
    isButton,
    attrs
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "NcFormBoxButton",
  props: {
    label: { default: () => void 0 },
    description: { default: () => void 0 },
    invertedAccent: { type: Boolean, default: false },
    to: { default: () => void 0 },
    href: { default: () => void 0 },
    target: { default: () => void 0 },
    disabled: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(__props) {
    const { tag, attrs, isLink } = useButtonLink({
      to: toRef(() => __props.to),
      href: toRef(() => __props.href),
      target: toRef(() => __props.target),
      disabled: toRef(() => __props.disabled)
    });
    const icon = computed(() => {
      if (isLink.value) {
        return __props.target === "_blank" ? mdiOpenInNew : mdiArrowTopRight;
      }
      return void 0;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(NcFormBoxItem, mergeProps({
        tag: unref(tag),
        itemClasses: [
          "button-vue",
          /* Reset server's global HTML button styles */
          _ctx.$style.formBoxButton
        ],
        invertedAccent: __props.invertedAccent
      }, unref(attrs), {
        tabindex: "0",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
      }), createSlots({ _: 2 }, [
        _ctx.$slots.default || __props.label ? {
          name: "default",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createTextVNode(toDisplayString(__props.label), 1)
            ])
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.description || __props.description ? {
          name: "description",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "description", {}, () => [
              createTextVNode(toDisplayString(__props.description), 1)
            ])
          ]),
          key: "1"
        } : void 0,
        _ctx.$slots.icon || icon.value ? {
          name: "icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "icon", {}, () => [
              icon.value ? (openBlock(), createBlock(NcIconSvgWrapper, {
                key: 0,
                path: icon.value,
                inline: ""
              }, null, 8, ["path"])) : createCommentVNode("", true)
            ])
          ]),
          key: "2"
        } : void 0
      ]), 1040, ["tag", "itemClasses", "invertedAccent"]);
    };
  }
});
const formBoxButton = "_formBoxButton_E8Xfr";
const style0 = {
  "material-design-icon": "_material-design-icon_MaIxG",
  formBoxButton
};
const cssModules = {
  "$style": style0
};
const NcFormBoxButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__cssModules", cssModules]]);
register(t3);
class Color {
  /**
   * @param r - The red value
   * @param g - The green value
   * @param b - The blue value
   * @param name - The name of the color
   */
  constructor(r, g2, b2, name) {
    this.r = r;
    this.g = g2;
    this.b = b2;
    this.name = name;
    this.r = Math.min(r, 255);
    this.g = Math.min(g2, 255);
    this.b = Math.min(b2, 255);
    this.name = name;
  }
  r;
  g;
  b;
  name;
  /**
   * The hexadecimal color string.
   */
  get color() {
    const toHex = (int) => `00${int.toString(16)}`.slice(-2);
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
  }
}
const COLOR_RED = new Color(182, 70, 157, t("Purple"));
const COLOR_YELLOW = new Color(221, 203, 85, t("Gold"));
const COLOR_BLUE = new Color(0, 130, 201, t("Nextcloud blue"));
const COLOR_BLACK = new Color(0, 0, 0, t("Black"));
const COLOR_WHITE = new Color(255, 255, 255, t("White"));
const defaultPalette = [
  COLOR_RED,
  new Color(
    ...[191, 103, 139],
    t("Rosy brown")
    // TRANSLATORS: A color name for RGB(191, 103, 139)
  ),
  new Color(
    ...[201, 136, 121],
    t("Feldspar")
    // TRANSLATORS: A color name for RGB(201, 136, 121)
  ),
  new Color(
    ...[211, 169, 103],
    t("Whiskey")
    // TRANSLATORS: A color name for RGB(211, 169, 103)
  ),
  COLOR_YELLOW,
  new Color(
    ...[165, 184, 114],
    t("Olivine")
    // TRANSLATORS: A color name for RGB(165, 184, 114)
  ),
  new Color(
    ...[110, 166, 143],
    t("Acapulco")
    // TRANSLATORS: A color name for RGB(110, 166, 143)
  ),
  new Color(
    ...[55, 148, 172],
    t("Boston Blue")
    // TRANSLATORS: A color name for RGB(55, 148, 172)
  ),
  COLOR_BLUE,
  new Color(
    ...[45, 115, 190],
    t("Mariner")
    // TRANSLATORS: A color name for RGB(45, 115, 190)
  ),
  new Color(
    ...[91, 100, 179],
    t("Blue Violet")
    // TRANSLATORS: A color name for RGB(91, 100, 179)
  ),
  new Color(
    ...[136, 85, 168],
    t("Deluge")
    // TRANSLATORS: A color name for RGB(136, 85, 168)
  )
];
register(t1);
const _hoisted_1$1 = ["aria-label"];
const _hoisted_2$1 = {
  key: 0,
  class: "color-picker__simple"
};
const _hoisted_3 = ["aria-label", "name", "checked", "onClick"];
const _hoisted_4 = ["title"];
const _hoisted_5 = ["aria-label", "name", "checked"];
const _hoisted_6 = {
  key: 0,
  class: "color-picker__navigation"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "NcColorPicker",
  props: /* @__PURE__ */ mergeModels({
    advancedFields: { type: Boolean },
    clearable: { type: Boolean },
    container: { default: "body" },
    palette: { default: () => [] },
    paletteOnly: { type: Boolean }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {},
    "open": { type: Boolean },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit", "closed"], ["update:modelValue", "update:open"]),
  setup(__props, { emit: __emit }) {
    const currentColor = useModel(__props, "modelValue");
    const open = useModel(__props, "open");
    const props = __props;
    const emit2 = __emit;
    const HEX_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
    const id = createElementId();
    const advanced = ref(false);
    const normalizedPalette = computed(() => {
      let palette = props.palette;
      for (const color of palette) {
        if (typeof color === "string" && !color.match(HEX_REGEX) || typeof color === "object" && !color.color?.match(HEX_REGEX)) {
          logger.error("[NcColorPicker] Invalid palette passed", { color });
          palette = [];
          break;
        }
      }
      if (palette.length === 0) {
        palette = props.clearable ? [...defaultPalette, COLOR_BLACK, COLOR_WHITE] : [...defaultPalette];
      }
      return palette.map((item) => ({
        color: typeof item === "object" ? item.color : item,
        name: typeof item === "object" && item.name ? item.name : t("A color with a HEX value {hex}", { hex: typeof item === "string" ? item : item.color })
      }));
    });
    function handleConfirm(hideCallback) {
      emit2("submit", currentColor.value);
      hideCallback();
      advanced.value = false;
    }
    function toggleColor(color) {
      color = typeof color === "string" ? color : color.color;
      if (props.clearable && currentColor.value === color) {
        currentColor.value = void 0;
      } else {
        currentColor.value = color;
      }
    }
    function pickCustomColor(color) {
      currentColor.value = color.hex;
    }
    function getContrastColor(color) {
      return calculateLuma(color) > 0.5 ? COLOR_BLACK.color : COLOR_WHITE.color;
    }
    function calculateLuma(color) {
      const [red, green, blue] = hexToRGB(color);
      return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    }
    function hexToRGB(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) {
        return [0, 0, 0];
      }
      return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NcPopover), {
        shown: open.value,
        "onUpdate:shown": _cache[3] || (_cache[3] = ($event) => open.value = $event),
        container: __props.container,
        popupRole: "dialog",
        onApplyHide: _cache[4] || (_cache[4] = ($event) => emit2("closed"))
      }, {
        trigger: withCtx((slotProps) => [
          renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)), void 0, true)
        ]),
        default: withCtx((slotProps) => [
          createBaseVNode("div", {
            role: "dialog",
            class: normalizeClass(["color-picker", {
              "color-picker--advanced-fields": advanced.value && __props.advancedFields,
              "color-picker--clearable": __props.clearable
            }]),
            "aria-modal": "true",
            "aria-label": unref(t)("Color picker")
          }, [
            createVNode(Transition, {
              name: "slide",
              mode: "out-in"
            }, {
              default: withCtx(() => [
                !advanced.value ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedPalette.value, ({ color, name }, index2) => {
                    return openBlock(), createElementBlock("label", {
                      key: index2,
                      class: normalizeClass(["color-picker__simple-color-circle", { "color-picker__simple-color-circle--active": color === currentColor.value }]),
                      style: normalizeStyle({
                        backgroundColor: color,
                        color: getContrastColor(color)
                      })
                    }, [
                      color === currentColor.value ? (openBlock(), createBlock(unref(NcIconSvgWrapper), {
                        key: 0,
                        path: unref(mdiCheck)
                      }, null, 8, ["path"])) : createCommentVNode("", true),
                      createBaseVNode("input", {
                        type: "radio",
                        class: "hidden-visually",
                        "aria-label": name,
                        name: `color-picker-${unref(id)}`,
                        checked: color === currentColor.value,
                        onClick: ($event) => toggleColor(color)
                      }, null, 8, _hoisted_3)
                    ], 6);
                  }), 128)),
                  __props.clearable ? (openBlock(), createElementBlock("label", {
                    key: 0,
                    class: "color-picker__clear",
                    title: unref(t)("No color")
                  }, [
                    createVNode(unref(NcIconSvgWrapper), {
                      size: currentColor.value ? 28 : 34,
                      path: unref(mdiCloseCircleOutline)
                    }, null, 8, ["size", "path"]),
                    createBaseVNode("input", {
                      type: "radio",
                      class: "hidden-visually",
                      "aria-label": unref(t)("No color"),
                      name: `color-picker-${unref(id)}`,
                      checked: !currentColor.value,
                      onClick: _cache[0] || (_cache[0] = ($event) => currentColor.value = void 0)
                    }, null, 8, _hoisted_5)
                  ], 8, _hoisted_4)) : createCommentVNode("", true)
                ])) : (openBlock(), createBlock(unref(script), {
                  key: 1,
                  class: "color-picker__advanced",
                  disableAlpha: "",
                  disableFields: !__props.advancedFields,
                  modelValue: currentColor.value ?? "#000000",
                  "onUpdate:modelValue": pickCustomColor
                }, null, 8, ["disableFields", "modelValue"]))
              ]),
              _: 1
            }),
            !__props.paletteOnly ? (openBlock(), createElementBlock("div", _hoisted_6, [
              advanced.value ? (openBlock(), createBlock(unref(NcButton), {
                key: 0,
                "aria-label": unref(t)("Back"),
                title: unref(t)("Back"),
                variant: "tertiary",
                onClick: _cache[1] || (_cache[1] = ($event) => advanced.value = false)
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), {
                    directional: "",
                    path: unref(mdiArrowLeft)
                  }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["aria-label", "title"])) : (openBlock(), createBlock(unref(NcButton), {
                key: 1,
                "aria-label": unref(t)("More options"),
                title: unref(t)("More options"),
                variant: "tertiary",
                onClick: _cache[2] || (_cache[2] = ($event) => advanced.value = true)
              }, {
                icon: withCtx(() => [
                  createVNode(unref(NcIconSvgWrapper), { path: unref(mdiDotsHorizontal) }, null, 8, ["path"])
                ]),
                _: 1
              }, 8, ["aria-label", "title"])),
              createVNode(unref(NcButton), {
                variant: "primary",
                onClick: ($event) => handleConfirm(slotProps.hide)
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(t)("Choose")), 1)
                ]),
                _: 1
              }, 8, ["onClick"])
            ])) : createCommentVNode("", true)
          ], 10, _hoisted_1$1)
        ]),
        _: 3
      }, 8, ["shown", "container"]);
    };
  }
});
const NcColorPicker = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-fab7cffe"]]);
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NcColorPicker
}, Symbol.toStringTag, { value: "Module" }));
register(t45);
function formatTimezoneId(timezoneId) {
  return timezoneId.slice(timezoneId.indexOf("/") + 1).replaceAll("/", " - ").replaceAll("_", " ");
}
function getTimezones() {
  return Intl.supportedValuesOf("timeZone").filter((tz) => !tz.startsWith("Etc/")).map((timezoneId) => ({
    timezoneId,
    label: formatTimezoneId(timezoneId)
  })).sort((a, b2) => a.timezoneId.localeCompare(b2.timezoneId));
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NcTimezonePicker",
  props: /* @__PURE__ */ mergeModels({
    additionalTimezones: { default: () => [] },
    uid: { default: createElementId() }
  }, {
    "modelValue": { default: "floating" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = useModel(__props, "modelValue");
    const props = __props;
    const formattedAdditionalTimezones = computed(() => {
      return props.additionalTimezones.map(({ timezoneId, label }) => ({
        timezoneId,
        label
      }));
    });
    const options = computed(() => {
      const timezones = getTimezones();
      timezones.unshift(...formattedAdditionalTimezones.value);
      return timezones;
    });
    function filterBy(option, label, search) {
      const terms = search.trim().split(/\s+/);
      const values = Object.values(option);
      return terms.every((term) => {
        return values.some((value) => value.toLowerCase().includes(term.toLowerCase()));
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(NcSelect, {
        modelValue: modelValue.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelValue.value = $event),
        "aria-label-combobox": unref(t)("Search for time zone"),
        clearable: false,
        filterBy,
        multiple: false,
        options: options.value,
        placeholder: unref(t)("Type to search time zone"),
        uid: __props.uid,
        reduce: (option) => option.timezoneId,
        label: "label"
      }, null, 8, ["modelValue", "aria-label-combobox", "options", "placeholder", "uid", "reduce"]);
    };
  }
});
register(t13);
const _hoisted_1 = { class: "vue-date-time-picker__wrapper" };
const _hoisted_2 = {
  ref: "target",
  class: "vue-date-time-picker__wrapper vue-date-time-picker__wrapper--teleport"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NcDateTimePicker",
  props: /* @__PURE__ */ mergeModels({
    appendToBody: { type: Boolean },
    ariaLabel: { default: t("Datepicker input") },
    ariaLabelMenu: { default: t("Datepicker menu") },
    clearable: { type: Boolean },
    confirm: { type: Boolean },
    format: { type: [String, Function], default: void 0 },
    locale: { default: void 0 },
    max: { default: void 0 },
    min: { default: void 0 },
    minuteStep: { default: 10 },
    modelValue: { default: null },
    placeholder: { default: void 0 },
    showTimezoneSelect: { type: Boolean },
    showWeekNumber: { type: Boolean },
    type: { default: "date" },
    inline: { type: Boolean, default: false }
  }, {
    "timezoneId": { default: "UTC" },
    "timezoneIdModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue", "update:timezoneId", "blur"], ["update:timezoneId"]),
  setup(__props, { emit: __emit }) {
    const timezoneId = useModel(__props, "timezoneId");
    const props = __props;
    const emit2 = __emit;
    const realLocale = getCanonicalLocale();
    watchEffect(() => {
      if (props.locale !== void 0) ;
    });
    const targetElement = useTemplateRef("target");
    const pickerInstance = useTemplateRef("picker");
    const value = computed(() => {
      if (props.modelValue === null && props.clearable) {
        return null;
      }
      if (props.type === "week") {
        const date = props.modelValue instanceof Date ? props.modelValue : /* @__PURE__ */ new Date();
        const end = new Date(date);
        end.setUTCDate(date.getUTCDate() + 6);
        return [date, end];
      } else if (props.type === "year") {
        const date = props.modelValue instanceof Date ? props.modelValue : /* @__PURE__ */ new Date();
        return date.getUTCFullYear();
      } else if (props.type === "month") {
        const date = props.modelValue instanceof Date ? props.modelValue : /* @__PURE__ */ new Date();
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
      } else if (props.type === "time") {
        const time = props.modelValue instanceof Date ? props.modelValue : /* @__PURE__ */ new Date();
        return {
          hours: time.getHours(),
          minutes: time.getMinutes(),
          seconds: time.getSeconds()
        };
      } else if (props.type === "time-range") {
        const time = [props.modelValue].flat();
        if (time.length !== 2) {
          const start = /* @__PURE__ */ new Date();
          const end = new Date(start);
          end.setHours(end.getHours() + 1);
          time.splice(0, 2, start, end);
        }
        return time.map((date) => ({
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        }));
      } else if (props.type.endsWith("-range")) {
        if (props.modelValue === void 0) {
          const start = /* @__PURE__ */ new Date();
          const end = new Date(start);
          end.setUTCDate(start.getUTCDate() + 7);
          return [start, end];
        }
        return props.modelValue;
      }
      return props.modelValue ?? /* @__PURE__ */ new Date();
    });
    const placeholderFallback = computed(() => {
      if (props.type === "date") {
        return t("Select date");
      } else if (props.type === "time") {
        return t("Select time");
      } else if (props.type === "datetime") {
        return t("Select date and time");
      } else if (props.type === "week") {
        return t("Select week");
      } else if (props.type === "month") {
        return t("Select month");
      } else if (props.type === "year") {
        return t("Select year");
      } else if (props.type.endsWith("-range")) {
        return t("Select time range");
      }
      return t("Select date and time");
    });
    const realFormat = computed(() => {
      if (props.format) {
        return props.format;
      } else if (props.type === "week") {
        return "RR-II";
      }
      let formatter;
      if (props.type === "date" || props.type === "date-range") {
        formatter = new Intl.DateTimeFormat(realLocale, { dateStyle: "medium" });
      } else if (props.type === "time" || props.type === "time-range") {
        formatter = new Intl.DateTimeFormat(realLocale, { timeStyle: "short" });
      } else if (props.type === "datetime" || props.type === "datetime-range") {
        formatter = new Intl.DateTimeFormat(realLocale, { dateStyle: "medium", timeStyle: "short" });
      } else if (props.type === "month") {
        formatter = new Intl.DateTimeFormat(realLocale, { year: "numeric", month: "2-digit" });
      } else if (props.type === "year") {
        formatter = new Intl.DateTimeFormat(realLocale, { year: "numeric" });
      }
      if (formatter) {
        return (input) => Array.isArray(input) ? formatter.formatRange(input[0], input[1]) : formatter.format(input);
      }
      return void 0;
    });
    const pickerType = computed(() => ({
      timePicker: props.type === "time" || props.type === "time-range",
      yearPicker: props.type === "year",
      monthPicker: props.type === "month",
      weekPicker: props.type === "week",
      range: props.type.endsWith("-range") && {
        // do not use partial ranges (meaning after selecting the start [Date, null] will be emitted)
        // if this is needed someday we can enable it,
        // but its not covered by our component interface (props / events) documentation so just disabled for now.
        partialRange: false
      },
      enableTimePicker: !(props.type === "date" || props.type === "date-range"),
      flow: props.type === "datetime" ? ["calendar", "time"] : void 0
    }));
    const minTime = computed(() => props.min && { hours: props.min.getHours(), minutes: props.min.getMinutes(), seconds: props.min.getSeconds() });
    const maxTime = computed(() => props.max && { hours: props.max.getHours(), minutes: props.max.getMinutes(), seconds: props.max.getSeconds() });
    function onUpdateModelValue(value2) {
      if (value2 === null) {
        return emit2("update:modelValue", null);
      }
      if (props.type === "time") {
        emit2("update:modelValue", formatLibraryTime(value2));
      } else if (props.type === "time-range") {
        const start = formatLibraryTime(value2[0]);
        const end = formatLibraryTime(value2[1]);
        if (end.getTime() < start.getTime()) {
          end.setDate(end.getDate() + 1);
        }
        emit2("update:modelValue", [start, end]);
      } else if (props.type === "month") {
        const data = value2;
        emit2("update:modelValue", new Date(data.year, data.month, 1));
      } else if (props.type === "year") {
        emit2("update:modelValue", new Date(value2, 0));
      } else if (props.type === "week") {
        emit2("update:modelValue", value2[0]);
      } else {
        emit2("update:modelValue", value2);
      }
    }
    function formatLibraryTime(time) {
      const date = /* @__PURE__ */ new Date();
      date.setHours(time.hours);
      date.setMinutes(time.minutes);
      date.setSeconds(time.seconds);
      return date;
    }
    const weekStart = getFirstDay();
    const dayNames = [...getDayNamesMin()];
    for (let i = 0; i < weekStart; i++) {
      dayNames.push(dayNames.shift());
    }
    const weekNumName = t("W");
    const ariaLabels = computed(() => ({
      toggleOverlay: t("Toggle overlay"),
      menu: props.ariaLabelMenu,
      input: props.ariaLabel,
      openTimePicker: t("Open time picker"),
      closeTimePicker: t("Close time Picker"),
      incrementValue: (type) => {
        if (type === "hours") {
          return t("Increment hours");
        } else if (type === "minutes") {
          return t("Increment minutes");
        }
        return t("Increment seconds");
      },
      decrementValue: (type) => {
        if (type === "hours") {
          return t("Decrement hours");
        } else if (type === "minutes") {
          return t("Decrement minutes");
        }
        return t("Decrement seconds");
      },
      openTpOverlay: (type) => {
        if (type === "hours") {
          return t("Open hours overlay");
        } else if (type === "minutes") {
          return t("Open minutes overlay");
        }
        return t("Open seconds overlay");
      },
      amPmButton: t("Switch AM/PM mode"),
      openYearsOverlay: t("Open years overlay"),
      openMonthsOverlay: t("Open months overlay"),
      nextMonth: t("Next month"),
      prevMonth: t("Previous month"),
      nextYear: t("Next year"),
      prevYear: t("Previous year"),
      weekDay: (day) => getDayNames()[day],
      clearInput: t("Clear value"),
      calendarIcon: t("Calendar icon"),
      timePicker: t("Time picker"),
      monthPicker: (overlay) => overlay ? t("Month picker overlay") : t("Month picker"),
      yearPicker: (overlay) => overlay ? t("Year picker overlay") : t("Year picker")
    }));
    function selectDate() {
      pickerInstance.value.selectDate();
    }
    function cancelSelection() {
      pickerInstance.value.closeMenu();
    }
    const calcMinMaxTime = computed(() => {
      if (props.type === "datetime") {
        return {
          minDate: props.min,
          maxDate: props.max,
          minTime: props.min && value.value && sameDay(props.min, value.value) ? minTime.value : void 0,
          maxTime: props.max && value.value && sameDay(props.max, value.value) ? maxTime.value : void 0
        };
      }
      if (props.type === "datetime-range") {
        return {
          minDate: props.min,
          maxDate: props.max,
          minTime: props.min && value.value ? sameDay(props.min, value.value[0]) ? minTime.value : void 0 : void 0,
          maxTime: props.max && value.value ? sameDay(props.max, value.value[1]) ? maxTime.value : void 0 : void 0
        };
      }
      if (props.type === "time" || props.type === "time-range") {
        return {
          minTime: props.min ? minTime.value : void 0,
          maxTime: props.max ? maxTime.value : void 0
        };
      }
      return {
        minDate: props.min,
        maxDate: props.max
      };
    });
    function sameDay(a, b2) {
      return a.getFullYear() === b2.getFullYear() && a.getMonth() === b2.getMonth() && a.getDate() === b2.getDate();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(qn), mergeProps({
          ref: "picker",
          "aria-labels": ariaLabels.value,
          autoApply: !__props.confirm,
          class: ["vue-date-time-picker", { "vue-date-time-picker--clearable": __props.clearable }],
          cancelText: unref(t)("Cancel"),
          clearable: __props.clearable,
          dayNames,
          placeholder: __props.placeholder ?? placeholderFallback.value,
          format: realFormat.value,
          locale: unref(realLocale),
          minDate: calcMinMaxTime.value.minDate,
          maxDate: calcMinMaxTime.value.maxDate,
          minTime: calcMinMaxTime.value.minTime,
          maxTime: calcMinMaxTime.value.maxTime,
          minutesIncrement: __props.minuteStep,
          modelValue: value.value,
          nowButtonLabel: unref(t)("Now"),
          selectText: unref(t)("Pick"),
          sixWeeks: "fair",
          inline: __props.inline,
          teleport: __props.appendToBody ? targetElement.value || void 0 : false,
          textInput: "",
          weekNumName: unref(weekNumName),
          weekNumbers: __props.showWeekNumber ? { type: "iso" } : void 0,
          weekStart: unref(weekStart)
        }, pickerType.value, {
          "onUpdate:modelValue": onUpdateModelValue,
          onBlur: _cache[1] || (_cache[1] = ($event) => emit2("blur"))
        }), createSlots({
          "action-buttons": withCtx(() => [
            createVNode(unref(NcButton), {
              size: "small",
              variant: "tertiary",
              onClick: cancelSelection
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(t)("Cancel")), 1)
              ]),
              _: 1
            }),
            createVNode(unref(NcButton), {
              size: "small",
              variant: "primary",
              onClick: selectDate
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(t)("Pick")), 1)
              ]),
              _: 1
            })
          ]),
          "clear-icon": withCtx(({ clear }) => [
            createVNode(unref(NcButton), {
              "aria-label": unref(t)("Clear value"),
              variant: "tertiary-no-background",
              onClick: clear
            }, {
              icon: withCtx(() => [
                createVNode(NcIconSvgWrapper, {
                  inline: "",
                  path: unref(mdiClose),
                  size: 20
                }, null, 8, ["path"])
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          "input-icon": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              path: unref(mdiCalendarBlank),
              size: 20
            }, null, 8, ["path"])
          ]),
          "clock-icon": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              inline: "",
              path: unref(mdiClock),
              size: 20
            }, null, 8, ["path"])
          ]),
          "arrow-left": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              inline: "",
              path: unref(mdiChevronLeft),
              size: 20
            }, null, 8, ["path"])
          ]),
          "arrow-right": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              inline: "",
              path: unref(mdiChevronRight),
              size: 20
            }, null, 8, ["path"])
          ]),
          "arrow-down": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              inline: "",
              path: unref(mdiChevronDown),
              size: 20
            }, null, 8, ["path"])
          ]),
          "arrow-up": withCtx(() => [
            createVNode(NcIconSvgWrapper, {
              inline: "",
              path: unref(mdiChevronUp),
              size: 20
            }, null, 8, ["path"])
          ]),
          _: 2
        }, [
          __props.showTimezoneSelect ? {
            name: "action-extra",
            fn: withCtx(() => [
              createVNode(_sfc_main$1, {
                modelValue: timezoneId.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => timezoneId.value = $event),
                class: "vue-date-time-picker__timezone",
                appendToBody: false,
                inputLabel: unref(t)("Time zone")
              }, null, 8, ["modelValue", "inputLabel"])
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["aria-labels", "autoApply", "class", "cancelText", "clearable", "placeholder", "format", "locale", "minDate", "maxDate", "minTime", "maxTime", "minutesIncrement", "modelValue", "nowButtonLabel", "selectText", "inline", "teleport", "weekNumName", "weekNumbers", "weekStart"]),
        (openBlock(), createBlock(Teleport, {
          to: "body",
          disabled: !__props.appendToBody
        }, [
          createBaseVNode("div", _hoisted_2, null, 512)
        ], 8, ["disabled"]))
      ]);
    };
  }
});
const NcDateTimePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d689b5b9"]]);
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NcDateTimePicker
}, Symbol.toStringTag, { value: "Module" }));
export {
  NcAppSettingsSection as A,
  NcAppSettingsDialog as B,
  NcFormBoxButton as C,
  NcColorPicker as D,
  NcEmptyContent as N,
  _sfc_main$B as _,
  NcDialog as a,
  NcActions as b,
  NcActionInput as c,
  NcBreadcrumb as d,
  NcBreadcrumbs as e,
  NcCheckboxRadioSwitch as f,
  NcButton as g,
  NcIconSvgWrapper as h,
  NcSelect as i,
  _sfc_main$d as j,
  NcSettingsSection as k,
  NcNoteCard as l,
  NcTextArea as m,
  NcActionButton as n,
  NcPopover as o,
  NcListItem as p,
  NcLoadingIcon as q,
  NcActionLink as r,
  spawnDialog as s,
  NcAppNavigationItem as t,
  NcActionSeparator as u,
  NcAppNavigation as v,
  NcAppNavigationCaption as w,
  NcAppContent as x,
  NcAppSidebar as y,
  NcContent as z
};
