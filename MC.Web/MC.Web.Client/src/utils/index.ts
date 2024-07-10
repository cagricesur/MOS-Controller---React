export * from "./fetch";
export * from "./httpService";
export * from "./useAppStore";

import { parse } from "uuid";

export const isGuid = (value: string | undefined): boolean => {
  let guid: string | undefined = undefined;
  try {
    if (value) {
      guid = new TextDecoder().decode(parse(value));
    }
  } catch {
    guid = undefined;
  }
  if (guid) {
    return true;
  }
  return false;
};

export const scrollToTop = () => {
  document
    .getElementsByTagName("main")[0]
    .scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

export const isDark = (color?: string): boolean => {
  if (color) {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5), 16);
    const t = r + g + b;
    return t / 3 <= 85;
  } else {
    return false;
  }
};
