/**
 * Every photograph on the site. Files are built by scripts/build_assets.py into
 * public/media/<key>-<width>.webp; provenance is in ASSET_REGISTER.md.
 * Alt text describes what is actually in the frame.
 */

export type Media = {
  widths: number[];
  /** intrinsic aspect, used to reserve space (no layout shift) */
  w: number;
  h: number;
  alt: string;
  altAr: string;
  /** object-position focal point */
  pos?: string;
};

export const MEDIA = {
  "room-glass": {
    widths: [960, 1440, 1920],
    w: 3,
    h: 2,
    alt: "Bilkana's dining room under the glass roof, vines along the beams, velvet-blue chairs",
    altAr: "قاعة بالكانا تحت السقف الزجاجي، نباتات متسلقة على العوارض وكراسٍ زرقاء مخملية",
    pos: "56% 50%",
  },
  "room-glass-portrait": {
    widths: [540, 760, 960],
    w: 9,
    h: 16,
    alt: "Bilkana's dining room under the glass roof, vines along the beams, velvet-blue chairs",
    altAr: "قاعة بالكانا تحت السقف الزجاجي، نباتات متسلقة على العوارض وكراسٍ زرقاء مخملية",
    pos: "50% 40%",
  },
  "room-city": {
    widths: [540, 850],
    w: 4,
    h: 5,
    alt: "A velvet-blue banquette under the glass roof, the city through the windows",
    altAr: "مقعد مخملي أزرق تحت السقف الزجاجي، والمدينة من خلف النوافذ",
  },
  "room-banquette": {
    widths: [540, 720],
    w: 4,
    h: 5,
    alt: "Velvet banquettes and tub chairs along Bilkana's windows",
    altAr: "مقاعد مخملية وكراسٍ على امتداد نوافذ بالكانا",
  },
  "room-sign": {
    widths: [800, 1200, 1600],
    w: 3,
    h: 2,
    alt: "The KANA sign above Bilkana's bar, back-lit in warm light",
    altAr: "لافتة كانا فوق بار بالكانا بإضاءة دافئة خلفية",
    pos: "55% 45%",
  },
  "room-roof-open": {
    widths: [540, 720],
    w: 4,
    h: 5,
    alt: "Bilkana's terrace with the glass roof open to the sky",
    altAr: "تراس بالكانا والسقف الزجاجي مفتوح على السماء",
  },
  "food-arabic-breakfast": {
    widths: [480, 800, 1200, 1600],
    w: 3,
    h: 2,
    alt: "An Arabic breakfast spread from above: hummus, foul, falafel, manaqish, bread and tea on marble",
    altAr: "فطور عربي من الأعلى: حمص، فول، فلافل، مناقيش، خبز وشاي على الرخام",
  },
  "food-burger-and-fries": {
    widths: [480, 800, 1200, 1600],
    w: 4,
    h: 3,
    alt: "A burger and fries on a board, the Bilkana sign glowing behind",
    altAr: "برغر وبطاطا على لوح، ولافتة بالكانا مضاءة في الخلفية",
    pos: "50% 60%",
  },
  "food-drinks-and-pastries": {
    widths: [480, 800, 1200, 1600],
    w: 4,
    h: 3,
    alt: "A brass tray of iced drinks carried between the palms on the rooftop",
    altAr: "صينية نحاسية من المشروبات المثلجة بين أشجار النخيل على السطح",
  },
  "food-pizza-with-basil": {
    widths: [480, 800, 1200, 1600],
    w: 4,
    h: 3,
    alt: "A pizza with fresh basil and cherry tomatoes on marble",
    altAr: "بيتزا بالريحان الطازج والبندورة الكرزية على الرخام",
    pos: "42% 50%",
  },
  "food-table-spread": {
    widths: [480, 800, 1200, 1600],
    w: 3,
    h: 2,
    alt: "A table for sharing: pizzas, salads and mocktails beside a velvet banquette",
    altAr: "طاولة للمشاركة: بيتزا، سلطات وموكتيل بجانب مقعد مخملي",
  },
  "pick-baladi": {
    widths: [480, 800, 1080],
    w: 4,
    h: 5,
    alt: "A baladi breakfast board: falafel, hummus, labneh, eggs and vegetables in blue-and-white bowls",
    altAr: "لوح فطور بلدي: فلافل، حمص، لبنة، بيض وخضار في صحون زرقاء وبيضاء",
  },
  "pick-nachos": {
    widths: [480, 800, 1080],
    w: 4,
    h: 5,
    alt: "Loaded nachos with sour cream, salsa and cheese",
    altAr: "ناتشوز مع القشطة الحامضة والصلصة والجبنة",
  },
  "pick-sliders": {
    widths: [480, 800, 1080],
    w: 4,
    h: 5,
    alt: "Sliders on brioche with fries in a wire basket",
    altAr: "سلايدرز بخبز البريوش مع بطاطا مقلية",
  },
  "pick-mojito": {
    widths: [480, 800, 1080],
    w: 4,
    h: 5,
    alt: "A tall mojito with mint on marble, between palm leaves",
    altAr: "كأس موهيتو طويل بالنعناع على الرخام بين أوراق النخيل",
  },
  "item-turkish-breakfast": {
    widths: [480, 720],
    w: 4,
    h: 5,
    alt: "Turkish breakfast on a wooden board: eggs in skillets, cheeses, labneh with olive oil, jam",
    altAr: "فطور تركي على لوح خشبي: بيض في مقالٍ، أجبان، لبنة بزيت الزيتون، مربى",
  },
  "item-avocado-toast": {
    widths: [480, 720],
    w: 4,
    h: 5,
    alt: "Avocado toast on brown bread with cream cheese, tomato and rocket",
    altAr: "توست أفوكادو على خبز أسمر مع جبنة كريمية وبندورة وجرجير",
  },
  "item-croissant-tomato": {
    widths: [480, 720],
    w: 4,
    h: 5,
    alt: "A croissant with tomato, melted mozzarella and basil",
    altAr: "كرواسون بالبندورة والموزاريلا الذائبة والريحان",
  },
  "item-manaqish-zaatar": {
    widths: [480, 720],
    w: 4,
    h: 5,
    alt: "Za'atar manaqish cut into strips on a wooden board",
    altAr: "مناقيش زعتر مقطعة على لوح خشبي",
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof MEDIA;

export const srcset = (key: MediaKey) =>
  MEDIA[key].widths.map((w) => `${import.meta.env.BASE_URL}media/${key}-${w}.webp ${w}w`).join(", ");
export const src = (key: MediaKey) => {
  const ws = MEDIA[key].widths;
  return `${import.meta.env.BASE_URL}media/${key}-${ws[Math.min(1, ws.length - 1)]}.webp`;
};
