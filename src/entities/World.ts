import { distance2, DirectionVector, mod, centerOfMass } from './geometry';
import Boid, { BoidProperties } from './Boid';
import { SimulationConfig } from '../BoidSimulation';

export default class World {
    public width: number;
    public height: number;
    private boids: Boid[];

    constructor(width?: number, height?: number) {
        this.width = width || 500;
        this.height = height || 400;
        this.boids = [];
    }

    public addBoid(properties: BoidProperties) {
        this.boids.push(new Boid(this, properties));
    }

    public removeBoid() {
        this.boids = this.boids.slice(0, this.boids.length-1);
    }

    public amountOfBoids(): number {
        return this.boids.length;
    }

    public boidsWithinVision(boid: Boid) {
        return this.boids.filter(b => {
            if (b === boid) {
                return false;
            }
            return distance2(boid.pos, b.pos) <= boid.visionRadius*boid.visionRadius;
        });
    }

    public simulateWorld = (deltaT: number) => {
        this.boids.forEach(boid => {
            boid.ai();

            boid.pos.x += deltaT * boid.speed * boid.direction.x;
            boid.pos.y += deltaT * boid.speed * boid.direction.y;

            this.simulatePortalWalls(boid);
        });
    };
    
    private simulatePortalWalls(boid: Boid) {
        boid.pos.x = mod(boid.pos.x, this.width);
        boid.pos.y = mod(boid.pos.y, this.height);
    }
    
    private simulateSolidWalls(boid: Boid) {
        boid.pos.x = Math.min(Math.max(boid.pos.x, 0), this.width); 
        boid.pos.y = Math.min(Math.max(boid.pos.y, 0), this.height);
    }

    public hilightGroup = (ctx: CanvasRenderingContext2D, boid: Boid) => {
        ctx.beginPath();
        ctx.fillStyle = 'aliceblue';
        ctx.moveTo(boid.pos.x+boid.visionRadius/2, boid.pos.y);
        ctx.arc(boid.pos.x, boid.pos.y, boid.visionRadius/2, 0, Math.PI*2);
        ctx.fill();
    }

    public hilightVision = (ctx: CanvasRenderingContext2D) => {
        if (this.boids.length < 1) {
            return;
        }
        const main = this.boids[0];
        const inVision = this.boidsWithinVision(main);
        ctx.beginPath();
        ctx.strokeStyle = 'gold';
        ctx.arc(main.pos.x, main.pos.y, main.visionRadius, 0, Math.PI * 2);
        ctx.moveTo(main.pos.x + 5, main.pos.y);
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

    private hilightBoidCenterOfMass(ctx: CanvasRenderingContext2D) {
        const com = centerOfMass(this.boids.map(b => b.pos));
        ctx.beginPath();
        ctx.arc(com.x, com.y, 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    private hilightAngles(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const r = 20; 
        this.boids.forEach(({ pos:{ x, y }, direction }) => {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, direction.angle());
        });

        ctx.stroke();
    }

    public draw = (ctx: CanvasRenderingContext2D, config: DrawingConfig) => {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = 'black';

        if (config.showGroup) {
            this.boids.forEach(boid => {
                this.hilightGroup(ctx, boid);
            });
        }
        this.boids.forEach(boid => {
            boid.draw(ctx);
        });
        
        if (config.showVision) {
            this.hilightVision(ctx);
        }
        if (config.showCenterOfMass) {
            this.hilightBoidCenterOfMass(ctx);
        }
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

    public changeBoidSize(size: number) {
        if (size < 1 || 0.5*this.height < size) {
            return;
        }
        this.boids.forEach(b => {
            b.size = size;
        });
    }
};

export interface DrawingConfig {
    showGroup?: boolean;
    showCenterOfMass?: boolean;
    showVision?: boolean;
}

// walls

export const walls = {
    north: new DirectionVector(0, -1),
    south: new DirectionVector(0, 1),
    east: new DirectionVector(1, 0),
    west: new DirectionVector(-1, 0),
};

export type Wall = keyof typeof walls;
