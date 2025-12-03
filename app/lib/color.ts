export function getScoreBasedColor(score?: number) {
  if (score === 2) {
    return "tile-green";
  } else if (score === 1) {
    return "tile-yellow";
  } else {
    return "tile-gray";
  }
}
