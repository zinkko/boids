import { useEffect, useRef, useState } from 'react';
import { BoidProperties } from './entities/Boid';
import World, { DrawingConfig } from './entities/World';
import { randomColor, randomDirection, randomPosition } from './utils/random';

export interface SimulationConfig extends DrawingConfig {
    boidProperties?: BoidProperties;
    amountOfBoids: number;
}

const createWorld = (config: SimulationConfig): World => {
    const world = new World(800, 400);
    const n = config.amountOfBoids;
    const pad = 20;
    for (let i=0; i < n; i++) {
        world.addBoid({
            ...(config.boidProperties|| {}),
            pos: randomPosition({ maxX: world.width - pad, minX: pad, maxY: world.height - pad, minY: pad }),
            color: randomColor(240, 'lightness', { minLightness: 20, maxLightness: 70 }),
            direction: randomDirection(),
        });
    }
    return world;
}

export default function BoidSimulation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [world, _] = useState(createWorld({ amountOfBoids: 80 }));

    useEffect(() => {
        const play = (ctx: CanvasRenderingContext2D) => {
            let lastTick = performance.now();
            const renderLoop = (timestamp: number) => {
                const deltaT = timestamp - lastTick;
                lastTick = timestamp;
                world.simulateWorld(deltaT);
                world.draw(ctx, {});
                requestAnimationFrame(renderLoop);
            };
            renderLoop(lastTick);
        }
        const ctx = canvasRef?.current?.getContext('2d');
        if (ctx) {
            play(ctx);
        }
    }, [canvasRef, world]);


    return (
        <div className="Simulation">
            <canvas
                ref={canvasRef}
                id="world"
                width={world.width}
                height={world.height}
            />
        </div>
    );
};