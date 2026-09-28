import { CATEGORIES, ITEMS, type MenuItem } from "../data/menu";

/**
 * Instant, static search across English + Arabic names, descriptions, category
 * and group names, and keywords. Every typed word must match the START of a word
 * ("lat" finds latte, not chocolate). Arabic is normalised (hamza/alef forms,
 * taa marbuta, alef maqsura, diacritics, tatweel) and the article "ال" is optional.
 */
export function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // latin accents (à la carte, piña)
    .replace(/[ً-ٰٟـ]/g, "") // arabic harakat + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/['’`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

type Entry = { item: MenuItem; words: string[] };
let index: Entry[] | null = null;

function build(): Entry[] {
  return ITEMS.map((item) => {
    const cat = CATEGORIES.find((c) => c.id === item.category)!;
    const grp = cat.groups?.find((g) => g.id === item.group);
    const hay = [
      item.name,
      item.nameAr,
      item.description,
      item.descriptionAr,
      cat.label,
      cat.labelAr,
      grp?.label,
      grp?.labelAr,
      item.keywords,
      item.group === "oven" ? "pizza بيتزا" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const words = norm(hay).split(" ");
    // let "الفطور" match "فطور" and vice versa
    const extra = words.filter((w) => w.startsWith("ال") && w.length > 3).map((w) => w.slice(2));
    return { item, words: [...words, ...extra] };
  });
}

export function search(q: string): MenuItem[] {
  const terms = norm(q)
    .split(" ")
    .filter(Boolean)
    .map((t) => (t.startsWith("ال") && t.length > 3 ? t.slice(2) : t));
  if (!terms.length) return [];
  index ??= build();
  const scored: { item: MenuItem; score: number }[] = [];
  for (const e of index) {
    let score = 0;
    let ok = true;
    for (const t of terms) {
      const i = e.words.findIndex((w) => w.startsWith(t));
      if (i < 0) {
        ok = false;
        break;
      }
      score += i < 6 ? 3 : 1; // name hits rank above description hits
    }
    if (ok) scored.push({ item: e.item, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
