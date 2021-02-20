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
    const world = new World(config.windowWidth, config.windowHeight);
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
const canvas = document.getElementById('world') as HTMLCanvasElement;
const config: SimulationConfig = {
    amountOfBoids: 80,
    boidProperties: {

    },
    windowWidth: canvas.offsetWidth,
    windowHeight: canvas.offsetHeight,
};
const world = createWorld(config);
if (!canvas) {
    console.warn('Could not find the canvas!');
}
let animationFrame = 0;
const play = () => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        console.warn('Failed to get context');
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

window.onload = window.onresize = () => {
    world.width = canvas.width = canvas.offsetWidth;
    world.height = canvas.height = canvas.offsetHeight;
};

play();