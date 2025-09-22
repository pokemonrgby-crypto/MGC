export const MODEL_POOL = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
];
export function pickModels() {
  const shuffled = [...MODEL_POOL].sort(() => Math.random() - 0.5);
  return { primary: shuffled[0], fallback: shuffled[1] || shuffled[0] };
}
