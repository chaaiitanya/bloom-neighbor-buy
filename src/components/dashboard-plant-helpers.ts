
/**
 * Helper functions for plant list
 */
export function parseDistance(str: string) {
  // expects something like "2 km"
  const match = str.match(/^([\d.]+)\s*km$/i);
  if (!match) return Infinity;
  return parseFloat(match[1]);
}

export function parsePrice(str: string) {
  const match = str.match(/[\d.]+/);
  if (!match) return 0;
  return parseFloat(match[0]);
}
