export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getHeadings(markdown: string): Heading[] {
  return markdown
    .split("\n")
    .filter((line) => /^#{1,3}\s/.test(line))
    .map((line) => {
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#{1,3}\s*/, "");

      return {
        id: slugify(text),
        text,
        level,
      };
    });
}