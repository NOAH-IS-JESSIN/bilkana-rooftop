/**
 * Every interface string, EN + AR. Menu content lives in src/data/menu.ts.
 * Lines in quotes marked (Bilkana) are the venue's own words — from its reels and
 * page on thousandnights.com — reused rather than invented.
 * Numerals stay Latin in Arabic (build standard).
 */
import type { Lang } from "../lib/i18n";

const copy = {
  en: {
    skip: "Skip to the menu",
    brand: "Bilkana",
    brandSub: "Rooftop",
    loading: "Opening Bilkana's menu",
    langSwitch: "عربي",
    langSwitchLabel: "اقرأ المنيو بالعربية",
    searchOpen: "Search the menu",

    heroEyebrow: "Bilkana Rooftop · Amman",
    heroTitle: ["Under glass,", "above Amman."],
    heroLede:
      "Breakfast spreads, pizza from the oven and plates to share — on the roof of Thousand Nights Hotel, every day from 8 AM until 1 AM.",
    heroCta: "Explore the menu",
    heroSearch: "Search",
    scrollCue: "Scroll to discover",

    openNow: "Open now",
    closedNow: "Closed now",
    until: "until 1 AM",
    opensAt: "opens 8 AM",

    selectionEyebrow: "Bilkana selection",
    selectionTitle: ["From the first tea", "to the last mojito."],
    selectionLede: "Four plates, morning to night — tap one for the full story.",
    view: "View",

    menuEyebrow: "The menu",
    menuNote: "Prices in Jordanian dinars · subject to 8% tax and 7% service",
    items: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    currency: "JD",

    tagForTwo: "For two",
    tagSpicy: "Spicy",
    tagSignature: "Bilkana signature",
    tagSeasonal: "Seasonal",
    tagVegetarian: "Vegetarian",

    dayTitle: "Morning above Amman.",
    dayLine: "Breakfast with a view, under the glass roof.",
    noonTime: "16:00",
    noonTitle: "Good plates, great views.",
    noonLine: "Pizza from the oven, pasta and plates to share, while the light turns gold.",
    nightTitle: "Late nights at Bilkana.",
    nightLine: "Open until one, every night — desserts, coffee and something cold.",
    dayTime: "08:00",
    nightTime: "01:00",

    breakTitle: "Amman, from above.",
    breakLine: "On the roof of Thousand Nights Hotel",

    utilTitle: "Bilkana Rooftop",
    utilHours: "8:00 AM – 1:00 AM, every day",
    utilOpenToday: "Open today",
    utilAddress: ["Rooftop of Thousand Nights Hotel", "191 Al Madina Al Monawara St., Amman"],
    utilModes: "Dine in · Takeaway · Delivery",
    call: "Call",
    directions: "Directions",
    instagram: "Instagram",

    reserveTitle: ["Your table", "is waiting."],
    reserveLine: "Reservations, takeaway and delivery — all on one number.",
    reserveCta: "Reserve a table",
    reserveHint: "Calls",

    footerCity: "Amman, Jordan",
    footerCredit: "Digital menu prototype by",
    footerCreditName: "Mawqeijo",
    footerMenuSource: "Menu & prices from Bilkana's current menu",

    searchTitle: "Search the menu",
    searchPlaceholder: "Dishes, drinks, ingredients…",
    searchClose: "Close search",
    searchClear: "Clear",
    results: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
    searchEmpty: "Nothing matched that search.",
    searchBrowse: "Browse a category instead",
    searchSuggest: "Try",
    searchSuggestions: ["Breakfast", "Pizza", "Mojito", "Halloumi", "Latte"],

    sheetClose: "Close",
    addToList: "Add to my list",
    inList: "On your list",
    listTitle: "My list",
    listNote: "A list to show your waiter. Nothing is sent or ordered — prototype feature.",
    listEmpty: "Tap “Add to my list” on any dish to keep it here while you decide.",
    listTotal: "Estimate before tax & service",
    listClear: "Clear list",
    listRemove: "Remove",
    listLess: "One less",
    listMore: "One more",

    dockMenu: "Menu",
    dockSearch: "Search",
    dockList: "My list",
    dockTop: "Top",
    indexTitle: "The menu",
  },
  ar: {
    skip: "انتقل إلى المنيو",
    brand: "بالكانا",
    brandSub: "روف توب",
    loading: "جارٍ فتح منيو بالكانا",
    langSwitch: "EN",
    langSwitchLabel: "Read the menu in English",
    searchOpen: "ابحث في المنيو",

    heroEyebrow: "بالكانا روف توب · عمّان",
    heroTitle: ["تحت الزجاج،", "فوق عمّان."],
    heroLede:
      "موائد فطور، بيتزا من الفرن وأطباق للمشاركة — على سطح فندق ألف ليلة وليلة، كل يوم من 8 صباحاً حتى 1 بعد منتصف الليل.",
    heroCta: "تصفّح المنيو",
    heroSearch: "ابحث",
    scrollCue: "مرّر للاكتشاف",

    openNow: "مفتوح الآن",
    closedNow: "مغلق الآن",
    until: "حتى 1 بعد منتصف الليل",
    opensAt: "يفتح 8 صباحاً",

    selectionEyebrow: "اختيارات بالكانا",
    selectionTitle: ["من أول كوب شاي", "حتى آخر موهيتو."],
    selectionLede: "أربعة أطباق، من الصباح حتى الليل — اضغط على أيّ منها للتفاصيل.",
    view: "عرض",

    menuEyebrow: "المنيو",
    menuNote: "الأسعار بالدينار الأردني · تخضع لضريبة 8% وخدمة 7%",
    items: (n: number) => `${n} ${n === 1 ? "صنف" : n <= 10 ? "أصناف" : "صنفاً"}`,
    currency: "د.أ",

    tagForTwo: "لشخصين",
    tagSpicy: "حار",
    tagSignature: "من توقيع بالكانا",
    tagSeasonal: "موسمي",
    tagVegetarian: "نباتي",

    dayTitle: "صباحٌ فوق عمّان.",
    dayLine: "فطور تحت السقف الزجاجي.",
    noonTime: "16:00",
    noonTitle: "أطباق لذيذة وإطلالة رائعة.",
    noonLine: "بيتزا من الفرن، معكرونة وأطباق للمشاركة، بينما يصبح الضوء ذهبياً.",
    nightTitle: "سهرات بالكانا.",
    nightLine: "مفتوح حتى الواحدة كل ليلة — حلويات، قهوة وشيء بارد.",
    dayTime: "08:00",
    nightTime: "01:00",

    breakTitle: "عمّان من الأعلى.",
    breakLine: "على سطح فندق ألف ليلة وليلة",

    utilTitle: "بالكانا روف توب",
    utilHours: "8:00 صباحاً – 1:00 بعد منتصف الليل، يومياً",
    utilOpenToday: "مفتوح اليوم",
    utilAddress: ["سطح فندق ألف ليلة وليلة", "191 شارع المدينة المنورة، عمّان"],
    utilModes: "في المكان · سفري · توصيل",
    call: "اتصل",
    directions: "الاتجاهات",
    instagram: "إنستغرام",

    reserveTitle: ["طاولتك", "بانتظارك."],
    reserveLine: "الحجوزات والطلبات السفرية والتوصيل — كلها على رقم واحد.",
    reserveCta: "احجز طاولة",
    reserveHint: "اتصال",

    footerCity: "عمّان، الأردن",
    footerCredit: "نموذج منيو رقمي من",
    footerCreditName: "موقعيجو",
    footerMenuSource: "الأصناف والأسعار من منيو بالكانا الحالي",

    searchTitle: "ابحث في المنيو",
    searchPlaceholder: "أطباق، مشروبات، مكوّنات…",
    searchClose: "إغلاق البحث",
    searchClear: "مسح",
    results: (n: number) => `${n} ${n === 1 ? "نتيجة" : n <= 10 ? "نتائج" : "نتيجة"}`,
    searchEmpty: "لا شيء يطابق بحثك.",
    searchBrowse: "تصفّح أحد الأقسام بدلاً من ذلك",
    searchSuggest: "جرّب",
    searchSuggestions: ["فطور", "بيتزا", "موهيتو", "حلوم", "لاتيه"],

    sheetClose: "إغلاق",
    addToList: "أضف إلى قائمتي",
    inList: "في قائمتك",
    listTitle: "قائمتي",
    listNote: "قائمة تعرضها على النادل. لا يُرسل أي طلب — ميزة تجريبية.",
    listEmpty: "اضغط «أضف إلى قائمتي» على أي طبق لتحتفظ به هنا ريثما تقرّر.",
    listTotal: "تقدير قبل الضريبة والخدمة",
    listClear: "مسح القائمة",
    listRemove: "إزالة",
    listLess: "واحد أقل",
    listMore: "واحد أكثر",

    dockMenu: "المنيو",
    dockSearch: "بحث",
    dockList: "قائمتي",
    dockTop: "للأعلى",
    indexTitle: "المنيو",
  },
} as const;

export type Copy = (typeof copy)["en"];
export const COPY: Record<Lang, Copy> = copy as unknown as Record<Lang, Copy>;
