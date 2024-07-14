import bgs from "./backgroundImages";
import colors from "./colors";

const extractCSSColors = ({
    colorNames,
  }: {
    colorNames: (keyof typeof colors)[];
  }) => {
    try {
      const colorsToExport = colorNames.map((name) => ({
          name,
          colorObj: colors[name],
        })),
        colorVars = colorsToExport.reduce(
          (acc, { name, colorObj }) => ({
            ...acc,
            ...makeColorNames(name, colorObj),
          }),
          {},
        );
      return colorVars;
    } catch (err) {
      console.log("Failed to extract colors from theme", err);
    }
  },
  makeColorNames = (
    colorName: keyof typeof colors,
    colorObj: (typeof colors)[keyof typeof colors],
  ) => {
    if (!colorObj) return "";
    return Object.entries(colorObj).reduce((acc, [weight, value]) => {
      if (weight === "DEFAULT")
        return { ...acc, [`--color-${colorName}`]: value };
      return { ...acc, [`--color-${colorName}-${weight}`]: value };
    }, {});
  },
  extractBackgorundImages = () => {
    try {
      return Object.entries(bgs)
        .map(([name, value]) => ({ name, bg: value }))
        .reduce(
          (acc, { name, bg }) => ({ ...acc, ...makeBgName(name, bg) }),
          {},
        );
    } catch (err) {
      console.log("Failed to extract colors from theme", err);
    }
  },
  makeBgName = (bgName: string, bg: string) => {
    return { [`--bg-${bgName}`]: bg };
  },
  getRootCSSVariables = () => {
    const color =
        extractCSSColors({
          colorNames: ["green", "orange", "purple", "white", "alert"],
        }) ?? {},
      bg = extractBackgorundImages();

    return `:root {
    ${Object.entries({ ...color, ...bg })
      .map(([name, value]) => `${name}: ${value as string};`)
      .join("\n")}
  }`;
  };

export default getRootCSSVariables();
