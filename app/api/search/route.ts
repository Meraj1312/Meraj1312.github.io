import { NextRequest, NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search";

export async function GET(req: NextRequest) {
  const query =
    req.nextUrl.searchParams
      .get("q")
      ?.trim()
      .toLowerCase() ?? "";

  if (!query) {
    return NextResponse.json([]);
  }

  const index = await buildSearchIndex();

  const filtered = index.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.repo.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query)
    );
  });

  // Remove duplicate search results
  const unique = Array.from(
    new Map(
      filtered.map((item) => [
        `${item.href}-${item.type}-${item.path}`,
        item,
      ])
    ).values()
  );

  return NextResponse.json(unique.slice(0, 50));
}