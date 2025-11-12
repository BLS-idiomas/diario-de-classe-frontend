export function isMobileFunction() {
  return typeof window !== 'undefined' && window.innerWidth < 640;
}
