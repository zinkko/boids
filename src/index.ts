import World, { DrawingConfig } from './entities/World';
import { BoidProperties } from './entities/Boid';
import { randomPosition, randomColor, randomDirection } from './utils/random';

interface SimulationConfig extends DrawingConfig {
    boidProperties: BoidProperties;
    amountOfBoids: number;
    windowWidth?: number;
    windowHeight?: number;
}

const createRandomizedBoidProperties = (baseProperties: BoidProperties, world: World, pad: number) => {
    return {
        ...baseProperties,
        pos: randomPosition({ maxX: world.width - pad, minX: pad, maxY: world.height - pad, minY: pad }),
        color: randomColor(240, 'lightness', { minLightness: 20, maxLightness: 70 }),
        direction: randomDirection(),
    };
}

const createWorld = (config: SimulationConfig) => {
    const world = new World(config.windowWidth, config.windowHeight);
    const n = config.amountOfBoids;
    const pad = 20;
    for (let i=0; i < n; i++) {
        world.addBoid(
            createRandomizedBoidProperties(config.boidProperties, world, pad)
        );
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


// controls
const boidAmountSlider: HTMLInputElement = document.getElementById('boid-amount-slider') as HTMLInputElement;
if (boidAmountSlider !== null) {
    boidAmountSlider.oninput = (event: Event) => {
        const value = (event.target as HTMLInputElement).valueAsNumber;
        const diff = world.amountOfBoids() - value;
        for (let i=0; i<Math.abs(diff); i++) {
            if (diff > 0) {
                world.removeBoid();
            } else {
                const properties = createRandomizedBoidProperties(config.boidProperties, world, 20); 
                world.addBoid(properties);
            }
        }
    };
    boidAmountSlider.value = '' + config.amountOfBoids;
} else {
    console.warn("unable to get boid amount slider");
}

const boidSizeSlider: HTMLInputElement = document.getElementById('boid-size-slider') as HTMLInputElement;
if (boidSizeSlider !== null) {
    boidSizeSlider.oninput = (event: Event) => {
        const value = (event.target as HTMLInputElement).valueAsNumber;
        config.boidProperties.size = value;
        world.changeBoidSize(value);
    };
    boidSizeSlider.value = '' + (config.boidProperties.size || 5);
} else {
    console.warn("unable to get boid size slider");
}

const showCoM = document.getElementById('show-center-of-mass');
if (showCoM !== null) {
    showCoM.onchange = (event: Event) => {
        config.showCenterOfMass = (event.target as HTMLInputElement).checked;
    };
} else {
    console.warn('unable to get input "show center of mass"');
}

const showBoidVision = document.getElementById('show-vision-of-boids');
if (showBoidVision !== null) {
    showBoidVision.onchange = (event: Event) => {
        config.showVision = (event.target as HTMLInputElement).checked;
    };
} else {
    console.warn('unable to get input show-boid-vision');
}

const showGroups = document.getElementById('show-groups');
if (showGroups !== null) {
    showGroups.onchange = (event: Event) => {
        config.showGroup = (event.target as HTMLInputElement).checked;
    };
} else {
    console.warn('unable to get show-groups');
}

// Start
play();