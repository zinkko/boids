export interface Point {
    x: number;
    y: number;
}

export const pointOnCircle = (
    origin: Point,
    radius: number,
    angle: number
): Point => {
    const x = origin.x + radius * Math.cos(angle);
    const y = origin.y + radius * Math.sin(angle);
    return { x, y };
};

export const dAngle = (a1: number, a2: number) => {
    const delta = mod(a1 - a2, Math.PI*2);
    return Math.min(delta, Math.PI*2 - delta);
}

export const mod = (a: number, m: number) => {
    return ((a % m) + m) % m;
}

export const distance = (p1: Point, p2: Point) => {
    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    return Math.hypot(dx, dy);
}
