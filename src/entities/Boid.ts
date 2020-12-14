import { Point, pointOnCircle, DirectionVector, directionFromAngle, angleBetween, mod, centerOfMass, averageOfDirections, distance } from './geometry';
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
        this.turnSpeed = 0.05;
        this.direction = directionFromAngle(Math.random() * Math.PI * 2);
        this.pos = { x: 100, y: 100 };
        this.world = world;
        this.visionRadius = 120; //this.size * 7;
    }
    public ai() {
        const targets: DirectionVector[] = [];
        if (this.world.boidsWithinVision(this).length > 0) {
            // boid actions
            targets.push(this.separate());
            targets.push(this.separate());
            targets.push(this.align());
            targets.push(this.cohere());
        }

        // own actions
        targets.push(this.avoidWall());

        if (targets.length > 0) {
            this.steerToward(averageOfDirections(targets));
        }
    }

    private avoidWall() {
        const [wall, d] = this.world.nearestWall(this);
        if (d <= this.visionRadius) {
            if (angleBetween(walls[wall], this.direction) < Math.PI / 2) {
                return walls[wall].opposite();
            }
        }
        return this.direction;
    }

    private separate(): DirectionVector {
        const others = this.world.boidsWithinVision(this);
        let closest = others[0];
        let d = this.world.width * 10;
        others.forEach(b => {
            const nd = distance(this.pos, b.pos)
            if (nd < d) {
                d = nd;
                closest = b;
            }
        })
        return new DirectionVector(
            this.pos.x - closest.pos.x,
            this.pos.y - closest.pos.y
        );
    }

    private align(): DirectionVector {
        const boids = [this, ...this.world.boidsWithinVision(this)]
        return averageOfDirections(boids.map(b => b.direction));
    }

    private cohere(): DirectionVector {
        const boids = [this, ...this.world.boidsWithinVision(this)];
        const com = centerOfMass(boids.map(b => b.pos));

        return new DirectionVector(com.x - this.pos.x, com.y - this.pos.y);
    }
    
    private steerToward(direction: DirectionVector) {
        const ownAngle = this.direction.angle();
        const otherAngle = direction.angle();
        const refAngle = mod(ownAngle - otherAngle, Math.PI*2);
        const clockwise = -Math.sign(Math.PI - refAngle);
        this.direction = this.direction.turn(clockwise * this.turnSpeed);
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

        // ctx.beginPath();
        // ctx.strokeStyle = 'orange';
        // ctx.moveTo(this.pos.x+this.visionRadius, this.pos.y);
        // ctx.arc(this.pos.x, this.pos.y, this.visionRadius, 0, Math.PI*2);
        // ctx.stroke();
        // ctx.strokeStyle = 'black';
    };
};
