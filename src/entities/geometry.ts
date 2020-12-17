
export interface Point {
    x: number;
    y: number;
}

export class DirectionVector {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x / Math.hypot(x, y);
        this.y = y / Math.hypot(x, y);
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
        if (this.y < 0) {
            return -Math.acos(this.x);
        }
        return Math.acos(this.x);
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

const distance = (p1: Point, p2: Point) => {
    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    return Math.hypot(dx, dy);
}

export const distance2 = (p1: Point, p2: Point) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx*dx + dy*dy;
}

export const centerOfMass = (points: Point[]): Point => ({
    x: points.map(p => p.x).reduce(add) / points.length,
    y: points.map(p => p.y).reduce(add) / points.length,
});

export const averageOfDirections = (ds: DirectionVector[]): DirectionVector => {
    const { x, y } = centerOfMass(ds);
    if (x === 0 && y === 0) {
        return new DirectionVector(1, 0);
    }
    return new DirectionVector(x, y);
};

const add = (a: number, b: number) => a + b;
