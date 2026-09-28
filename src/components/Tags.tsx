import type { MenuItem } from "../data/menu";
import { useLang } from "../lib/i18n";
import { IconChili } from "./Icons";

/** Dietary / serving badges — text + icon, never colour alone. */
export function Tags({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const { t } = useLang();
  const tags = item.tags ?? [];
  if (!tags.length && !item.vegetarian) return null;
  const label: Record<string, string> = {
    spicy: t.tagSpicy,
    signature: t.tagSignature,
    seasonal: t.tagSeasonal,
    "for-two": t.tagForTwo,
  };
  return (
    <span className={`tags ${compact ? "tags--compact" : ""}`}>
      {tags.map((g) => (
        <span key={g} className={`tag tag--${g}`}>
          {g === "spicy" && <IconChili />}
          {label[g]}
        </span>
      ))}
      {item.vegetarian && <span className="tag tag--veg">{t.tagVegetarian}</span>}
    </span>
  );
}
