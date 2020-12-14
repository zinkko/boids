import { Point, pointOnCircle, DirectionVector, directionFromAngle, angleBetween, mod } from './geometry';
import World, { walls } from './World';

export default class Boid {
    public size: number;
    public speed: number;
    public turnSpeed: number;
    public direction: DirectionVector;
    public pos: Point;
    private world: World;
    public visionRadius: number;

    constructor(world: World) {
        this.size = 10;
        this.speed = 0.05;
        this.turnSpeed = -0.08;
        this.direction = directionFromAngle(1);
        this.pos = { x: 100, y: 100 };
        this.world = world;
        this.visionRadius = this.size * 7;
    }
    public ai() {
        // boid actions
        this.separate();
        this.align();
        this.cohere();

        // own actions
        this.avoidWall();
    }

    private avoidWall() {
        const [wall, d] = this.world.nearestWall(this);
        if (d <= this.visionRadius) {
            if (angleBetween(walls[wall], this.direction) < Math.PI / 2) {
                this.steerAway(walls[wall]);
            }
        }
    }

    private separate() {

    }

    private align() {

    }

    private cohere() {

    }

    private steerAway(direction: DirectionVector) {
        const ownAngle = this.direction.angle();
        const otherAngle = direction.angle();
        const refAngle = mod(ownAngle - otherAngle, Math.PI*2);
        const clockwise = Math.sign(Math.PI - refAngle);
        this.direction = this.direction.turn(clockwise * this.turnSpeed);
    }

    private steerToward(direction: DirectionVector) {
        this.steerAway(direction.opposite());
    }
    
    public draw(ctx: CanvasRenderingContext2D) {
        const a = 0.8 * Math.PI;
        const nose = pointOnCircle(this.pos, this.size, this.direction);
        const tail1 = pointOnCircle(this.pos, this.size, this.direction.turn(a));
        const tail2 = pointOnCircle(this.pos, this.size, this.direction.turn(-a));
        const back = pointOnCircle(this.pos, 0.5*this.size, this.direction.opposite())
        
        ctx.beginPath();
        ctx.moveTo(nose.x, nose.y);
        ctx.lineTo(tail1.x, tail1.y);
        ctx.lineTo(back.x, back.y);
        ctx.lineTo(tail2.x, tail2.y);
        ctx.lineTo(nose.x, nose.y);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'orange';
        ctx.moveTo(this.pos.x+this.visionRadius, this.pos.y);
        ctx.arc(this.pos.x, this.pos.y, this.visionRadius, 0, Math.PI*2);
        ctx.stroke();
        ctx.strokeStyle = 'black';
    };
};
