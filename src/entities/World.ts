import { distance, Point, DirectionVector } from './geometry';
import Boid from './Boid';

export default class World {
    public width: number;
    public height: number;
    private boids: Boid[];

    constructor() {
        this.width = 500;
        this.height = 400;
        this.boids = [];
    }

    public addBoid(startPosition?: Point) {
        const boid = new Boid(this);
        if (startPosition) {
            boid.pos = startPosition;
        }
        this.boids.push(boid);
    }

    public boidsWithinVision(boid: Boid) {
        return this.boids.filter(b => {
            if (b === boid) {
                return false;
            }
            return distance(boid.pos, b.pos) <= boid.visionRadius;
        });
    }

    public simulateWorld = (deltaT: number) => {
        this.boids.forEach(boid => {
            boid.ai();

            boid.pos.x += deltaT * boid.speed * boid.direction.x;
            boid.pos.y += deltaT * boid.speed * boid.direction.y;
            boid.pos.x = Math.min(Math.max(boid.pos.x, 0), this.width); // mod(boid.pos.x, boid.width);
            boid.pos.y = Math.min(Math.max(boid.pos.y, 0), this.height);// mod(boid.pos.y, boid.height);
        });
    };

    public hilightVision = (ctx: CanvasRenderingContext2D) => {
        if (this.boids.length < 1) {
            return;
        }
        const main = this.boids[0];
        const inVision = this.boidsWithinVision(main);
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.arc(main.pos.x, main.pos.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        inVision.forEach(other => {
            ctx.moveTo(other.pos.x + 5, other.pos.y);
            ctx.arc(other.pos.x, other.pos.y, 5, 0, Math.PI * 2);
        })
        ctx.stroke();
    }

    public hilightNearestWall = (ctx: CanvasRenderingContext2D) => {
        if (this.boids.length < 1) {
            return;
        }
        const wall = this.nearestWall(this.boids[0])[0];
        const begin = (wall === 'north' || wall === 'west')
        ? { x: 0, y: 0 }
        : { x: this.width, y: this.height };
        const end = (wall === 'west' || wall === 'east')
            ? { x: begin.x, y: this.height - begin.y } // vertical
            : { x: this.width - begin.x, y: begin.y };

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.strokeStyle = 'black';
    }

    public draw = (ctx: CanvasRenderingContext2D, deltaT: number) => {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'black';

        this.boids.forEach(boid => {
            boid.draw(ctx);
        });
        
        this.hilightNearestWall(ctx);
        this.hilightVision(ctx);
    };

    public nearestWall = (boid: Boid): [Wall, number] => {
        const { x, y } = boid.pos;
        let d = y;
        let wall: Wall = 'north';
        if (x < d) {
            d = x; wall = 'west';
        }
        if (this.width - x < d) {
            d = this.width - x; wall = 'east';
        }
        if (this.height - y < d) {
            d = this.height - y; wall = 'south';
        }
    
        return [wall, d];
    };
};

// walls

export const walls = {
    north: new DirectionVector(0, -1),
    south: new DirectionVector(0, 1),
    east: new DirectionVector(1, 0),
    west: new DirectionVector(-1, 0),
};

export type Wall = keyof typeof walls;
