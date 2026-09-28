import type { Lang } from "../lib/i18n";

export const META: Record<Lang, { path: string; title: string; description: string }> = {
  en: {
    path: "/",
    title: "Bilkana Rooftop · Menu · Amman",
    description:
      "The full Bilkana Rooftop menu — Turkish and baladi breakfasts, pizza from the oven, burgers, mains, desserts and drinks. On the roof of Thousand Nights Hotel, Amman, 8 AM – 1 AM daily.",
  },
  ar: {
    path: "/ar/",
    title: "منيو بالكانا روف توب · عمّان",
    description:
      "منيو بالكانا روف توب كاملاً — فطور تركي وبلدي، بيتزا من الفرن، برغر، أطباق رئيسية، حلويات ومشروبات. على سطح فندق ألف ليلة وليلة، عمّان، يومياً من 8 صباحاً حتى 1 بعد منتصف الليل.",
  },
};
