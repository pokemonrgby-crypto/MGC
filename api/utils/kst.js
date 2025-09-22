export function nowKST() {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}
export function kstDateString(d = nowKST()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
export function isSameKSTDate(a, b) {
  const A = kstDateString(new Date(a));
  const B = kstDateString(new Date(b));
  return A === B;
}

