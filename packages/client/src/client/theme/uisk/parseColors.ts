import { GeneratedThemeVariables } from "./types";

export type NestedColorObject = {
  [key: string]: string | NestedColorObject;
};

export function parseColors(
  colors: GeneratedThemeVariables["1. Color modes"]
): NestedColorObject {
  const parsedColors: NestedColorObject = {};

  Object.entries(colors).forEach(([key, color]) => {
    const splitKey = key.split("/");

    let colorCategories = splitKey
      .slice(0, -1)
      .map((category) => category.replace(" ", "-").toLowerCase());

    let colorName = removeTrailingNumberInBrackets(
      splitKey[splitKey.length - 1]
    );

    const shortendedCategoryNames = ["fg", "bg"];
    const splitColorName = colorName
      .split("-")
      // remove category names from the colour name
      .filter(
        (value) =>
          !(
            colorCategories.some(
              (category) =>
                category.split("-").includes(value) ||
                category.split("-").at(-1) === value + "s"
            ) || shortendedCategoryNames.includes(value)
          )
      );

    if (splitColorName.length > 1) {
      colorName = splitColorName[splitColorName.length - 1];
      colorCategories = [...colorCategories, ...splitColorName.slice(0, -1)];
    } else {
      colorName = splitColorName[0];
    }

    colorName = !colorName ? "main" : colorName;

    buildNestedColorObject(parsedColors, colorCategories, colorName, color);
  });

  return parsedColors;
}

function buildNestedColorObject(
  layer: NestedColorObject,
  categories: string[],
  name: string,
  color: string
) {
  const [category, ...remainingCategories] = categories;

  if (!layer[category]) {
    layer[category] = {};
  }

  if (!remainingCategories.length) {
    (layer[category] as NestedColorObject)[name] = color;
    return;
  }

  buildNestedColorObject(
    layer[category] as NestedColorObject,
    remainingCategories,
    name,
    color
  );
}

function removeTrailingNumberInBrackets(name: string) {
  const regex = /\s\(\d+\)$/;

  if (regex.test(name)) {
    return name.replace(regex, "");
  }
  return name;
}
