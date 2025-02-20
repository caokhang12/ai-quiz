"use client";

import D3WordCloud from "react-d3-cloud";
import { useTheme } from "next-themes";

const data = [
  { text: "Hey", value: 10 },
  { text: "lol", value: 2 },
  { text: "first impression", value: 8 },
  { text: "very cool", value: 5 },
  { text: "duck", value: 9 },
];

/**
 * Maps a word object to a font size based on its value.
 * The font size is calculated using a logarithmic scale.
 *
 * @param word - An object containing a `value` property representing the frequency or importance of the word.
 * @returns The calculated font size for the word.
 */
const mapFontSize = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const CustomWordCloud = () => {
  const theme = useTheme();
  return (
    <D3WordCloud
      data={data}
      height={550}
      font="Times"
      fontSize={mapFontSize}
      rotate={0}
      padding={10}
      fill={theme.theme === "dark" ? "white" : "black"} // fill color of the text
    />
  );
};

export default CustomWordCloud;
