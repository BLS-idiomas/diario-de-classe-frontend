export function isMobileFunction(win) {
  // Accept an optional window-like object for easier testing and backwards compatibility
  const w =
    typeof win !== 'undefined'
      ? win
      : typeof window !== 'undefined'
        ? window
        : undefined;
  return typeof w !== 'undefined' && w.innerWidth < 640;
}
