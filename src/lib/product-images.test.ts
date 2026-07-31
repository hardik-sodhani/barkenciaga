import { describe, expect, it } from "vitest";
import {
  imagesWithPositions,
  reorderImageIds,
  resolveGalleryImages,
} from "./product-images";

describe("reorderImageIds", () => {
  it("moves an id from one index to another", () => {
    expect(reorderImageIds(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
    expect(reorderImageIds(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("returns a copy when indexes are invalid or unchanged", () => {
    const ids = ["a", "b"];
    expect(reorderImageIds(ids, 1, 1)).toEqual(["a", "b"]);
    expect(reorderImageIds(ids, -1, 0)).toEqual(["a", "b"]);
    expect(reorderImageIds(ids, 0, 5)).toEqual(["a", "b"]);
  });
});

describe("imagesWithPositions", () => {
  it("assigns contiguous positions", () => {
    expect(imagesWithPositions(["x", "y"])).toEqual([
      { id: "x", position: 0 },
      { id: "y", position: 1 },
    ]);
  });
});

describe("resolveGalleryImages", () => {
  it("sorts by position", () => {
    const resolved = resolveGalleryImages(
      [
        { id: "2", path: "/b.webp", alt: "b", position: 2 },
        { id: "0", path: "/a.webp", alt: "a", position: 0 },
      ],
      { imagePath: null, name: "Coat", subtitle: null },
    );
    expect(resolved.map((i) => i.id)).toEqual(["0", "2"]);
  });

  it("falls back to legacy imagePath", () => {
    const resolved = resolveGalleryImages([], {
      imagePath: "/products/coat.webp",
      name: "Coat",
      subtitle: "Tartan",
    });
    expect(resolved).toEqual([
      {
        id: "legacy-default",
        path: "/products/coat.webp",
        alt: "Coat, Tartan",
        position: 0,
      },
    ]);
  });
});
