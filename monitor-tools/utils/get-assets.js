
export const getSvgIcon = (name) => {
  return new URL(`../assets/icons/${name}.svg`, import.meta.url).href
};

export const getCursorIcon = (name) => {
  return new URL(`../assets/cursor-icons/${name}.png`, import.meta.url).href
};

