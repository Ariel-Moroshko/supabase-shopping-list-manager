export type Language = "en" | "he" | "ru";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  he: () => import("./he.json").then((module) => module.default),
  ru: () => import("./ru.json").then((module) => module.default),
};

export const isValidLanguage = (language: string): language is Language =>
  ["en", "he", "ru"].includes(language);

export const getDictionary = async (language: Language) => {
  if (!isValidLanguage(language)) {
    throw new Error("No dictionary for language:", language);
  }
  return dictionaries[language]();
};

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>;
