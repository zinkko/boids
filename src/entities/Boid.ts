
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
    private color: string;
    private crowdingDistance: number;

    constructor(world: World) {
        this.size = 5;
        this.speed = 0.1;
        this.turnSpeed = 0.05;
        this.direction = directionFromAngle(Math.random() * Math.PI * 2);
        this.pos = { x: 100, y: 100 };
        this.world = world;
        this.visionRadius = this.size * 20;
        this.crowdingDistance = this.visionRadius / 3;
        const blue = Math.random() * 126 + 100;
        this.color = `rgb(80, 50, ${blue})`;
    }
    public ai() {
        const targets: DirectionVector[] = [];
        const addTarget = (tgtF: () => DirectionVector | null, weight: number) => {
            const tgt = tgtF();
            if (tgt) {
                for (let i=0; i<weight; i++) targets.push(tgt);
            }
        }
        if (this.world.boidsWithinVision(this).length > 0) {
            // boid actions
            addTarget(this.separate.bind(this), 2);
            addTarget(this.align.bind(this), 1);
            addTarget(this.cohere.bind(this), 1);
        }

        // addTarget(this.avoidWall.bind(this), 2);

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

    private separate(): DirectionVector | null {
        const others = this.world.boidsWithinVision(this).filter(b => {
            return distance(b.pos, this.pos) < this.crowdingDistance;
        });
        if (others.length === 0) {
            return null;
        }
        let closest = others[0];
        let d = this.world.width * 10;
        others.forEach(b => {
            const nd = distance(this.pos, b.pos)
            if (nd < d) {
                d = nd;
                closest = b;
            }
        });
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
        const back = pointOnCircle(this.pos, 0.5*this.size, this.direction.opposite());

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(nose.x, nose.y);
        ctx.lineTo(tail1.x, tail1.y);
        ctx.lineTo(back.x, back.y);
        ctx.lineTo(tail2.x, tail2.y);
        ctx.lineTo(nose.x, nose.y);
        ctx.fill();

    };
};
