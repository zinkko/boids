
export interface Point {
    x: number;
    y: number;
}

export class DirectionVector {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public turn(a: number): DirectionVector {
        return new DirectionVector(
            this.x * Math.cos(a) - this.y * Math.sin(a),
            this.x * Math.sin(a) + this.y * Math.cos(a)
        );
    }
    public opposite(): DirectionVector {
        return new DirectionVector(-this.x, -this.y);
    }
    public angle(): number {
        return (Math.sign(this.x) || -Math.sign(this.y)) * Math.acos(this.x);
    }
}

export const angleBetween = (a: DirectionVector, b: DirectionVector) => {
    return Math.acos(a.x*b.x + a.y*b.y);
}

export const directionFromAngle = (a: number): DirectionVector => {
    return new DirectionVector(Math.cos(a), Math.sin(a));
};

export const pointOnCircle = (
    origin: Point,
    radius: number,
    direction: DirectionVector
): Point => ({
    x: origin.x + radius * direction.x,
    y: origin.y + radius * direction.y,
});

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
