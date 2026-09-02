export function getAdjacentImageIndex(
  currentIndex: number,
  imageCount: number,
  direction: -1 | 1,
) {
  if (imageCount <= 1) return 0;
  return (currentIndex + direction + imageCount) % imageCount;
}

export function getSwipeDirection(
  startX: number,
  endX: number,
  threshold = 48,
): -1 | 0 | 1 {
  const distance = endX - startX;
  if (Math.abs(distance) < threshold) return 0;
  return distance < 0 ? 1 : -1;
}

export function getPinchDistance(
  first: Pick<Touch, "clientX" | "clientY">,
  second: Pick<Touch, "clientX" | "clientY">,
) {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

export function clampZoom(scale: number) {
  return Math.min(4, Math.max(1, scale));
}

export function isCompleteImageOrder(existingIds: string[], requestedIds: string[]) {
  if (existingIds.length !== requestedIds.length) return false;
  if (new Set(requestedIds).size !== requestedIds.length) return false;
  const existing = new Set(existingIds);
  return requestedIds.every((id) => existing.has(id));
}
