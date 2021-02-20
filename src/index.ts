import World, { DrawingConfig } from './entities/World';
import { BoidProperties } from './entities/Boid';
import { randomPosition, randomColor, randomDirection } from './utils/random';

interface SimulationConfig extends DrawingConfig {
    boidProperties: BoidProperties;
    amountOfBoids: number;
    windowWidth?: number;
    windowHeight?: number;
}


const createWorld = (config: SimulationConfig) => {
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
const config: SimulationConfig = {
    amountOfBoids: 80,
    boidProperties: {},
    windowWidth: 600,
    windowHeight: 800
};
const world = createWorld(config);
const canvasRef = document.getElementById("world") as HTMLCanvasElement;
let animationFrame = 0;
const play = () => {
    const ctx = canvasRef?.getContext('2d');
    if (!ctx) {
        return;
    }
    let lastTick = performance.now();
    const renderLoop = (timestamp: number) => {
        const deltaT = timestamp - lastTick;
        lastTick = timestamp;
        world.simulateWorld(deltaT);
        world.draw(ctx, config);
        animationFrame = requestAnimationFrame(renderLoop);
    };
    renderLoop(lastTick);
}

   // play();