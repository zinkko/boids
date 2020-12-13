import { Point, pointOnCircle, dAngle } from './geometry';
import World, { walls } from './World';

export default class Boid {
    public size: number;
    public speed: number;
    public turnSpeed: number;
    public direction: number;
    public pos: Point;
    private world: World;

    constructor(world: World) {
        this.size = 10;
        this.speed = 0.1;
        this.turnSpeed = -0.1;
        this.direction = Math.PI * 0.2;
        this.pos = { x: 100, y: 100 };
        this.world = world;
    }
    public ai() {
        const [wall, d] = this.world.nearestWall(this);
        const wallDirection = walls[wall];
        
        if (d < 5 * this.size && dAngle(this.direction, wallDirection) < Math.PI/2) {
            this.direction += this.turnSpeed * this.awayFrom(wallDirection);
        }
    }

    private awayFrom(angle: number) {
        const pos = angle + Math.PI/2;
        const neg = angle - Math.PI/2;
        return dAngle(this.direction, pos) < dAngle(this.direction, neg)
        ? -1
        : 1;
    }

    
    public draw(ctx: CanvasRenderingContext2D) {
        const a = 0.8 * Math.PI;
        const nose = pointOnCircle(this.pos, this.size, this.direction);
        const tail1 = pointOnCircle(this.pos, this.size, this.direction + a);
        const tail2 = pointOnCircle(this.pos, this.size, this.direction - a);
        const back = pointOnCircle(this.pos, 0.5*this.size, this.direction+Math.PI)
        
        ctx.beginPath();
        ctx.moveTo(nose.x, nose.y);
        ctx.lineTo(tail1.x, tail1.y);
        ctx.lineTo(back.x, back.y);
        ctx.lineTo(tail2.x, tail2.y);
        ctx.lineTo(nose.x, nose.y);
        ctx.fill();
    };
};
