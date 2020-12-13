import { mod } from './geometry';
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

    public addBoid() {
        this.boids.push(new Boid(this));
    }

    public simulateWorld = (deltaT: number) => {
        this.boids.forEach(boid => {
            boid.ai();
            boid.direction = mod(boid.direction, Math.PI * 2);
            boid.pos.x += deltaT * boid.speed * Math.cos(boid.direction);
            boid.pos.y += deltaT * boid.speed * Math.sin(boid.direction);
            boid.pos.x = Math.min(Math.max(boid.pos.x, 0), this.width); // mod(boid.pos.x, boid.width);
            boid.pos.y = Math.min(Math.max(boid.pos.y, 0), this.height);// mod(boid.pos.y, boid.height);
        });
    };

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

        this.boids.forEach(boid => {
            boid.draw(ctx);
        });
        
        this.hilightNearestWall(ctx);
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
    north: -Math.PI/2,
    east: 0,
    south: Math.PI/2,
    west: -Math.PI,
};

export type Wall = keyof typeof walls;
