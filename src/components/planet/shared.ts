export function rotatePoint(
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number
) {
  angle = angle * (Math.PI / 180);

  const rotatedX =
    Math.cos(angle) * (point.x - center.x) -
    Math.sin(angle) * (point.y - center.y) +
    center.x;

  const rotatedY =
    Math.sin(angle) * (point.x - center.x) +
    Math.cos(angle) * (point.y - center.y) +
    center.y;

  return { x: rotatedX, y: rotatedY };
}