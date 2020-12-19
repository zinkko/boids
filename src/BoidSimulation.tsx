import React from 'react';
import { BoidProperties } from './entities/Boid';
import World, { DrawingConfig } from './entities/World';
import { randomColor, randomDirection, randomPosition } from './utils/random';

export interface SimulationConfig extends DrawingConfig {
    boidProperties: BoidProperties;
    amountOfBoids: number;
    windowWidth?: number;
    windowHeight?: number;
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

export interface SimulationProps {
    config: SimulationConfig;
}

export default class BoidSimulation extends React.Component<SimulationProps, { i: number }> {

    private canvasRef;
    private world: World;
    private animationFrame: number | null = null;

    constructor(props: { config: SimulationConfig}) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.world = createWorld(props.config);

        this.state = { i: 1 };
    }

    render() {
        if (this.state.i > 0) {
            this.setState({ i: 0 });
        }

        const config = this.props.config;
        this.world.changeBoidSize(config.boidProperties?.size || 5);
        // hack
        while (this.world.amountOfBoids() > config.amountOfBoids && config.amountOfBoids >= 0) {
            this.world.removeBoid();
        }
        while (this.world.amountOfBoids() < config.amountOfBoids) {
            this.world.addBoid({
                ...(config.boidProperties|| {}),
                pos: randomPosition({ maxX: this.world.width - 20, minX: 20, maxY: this.world.height - 20, minY: 20 }),
                color: randomColor(240, 'lightness', { minLightness: 20, maxLightness: 70 }),
                direction: randomDirection(),
            });
        }

        return (
            <div className="Simulation">
                <canvas
                    ref={this.canvasRef}
                    id="world"
                    style={{width: '100%', height: '100%' }}
                />
            </div>
        );
    }

    play = () => {
        const ctx = this.canvasRef?.current?.getContext('2d');
        if (!ctx) {
            return;
        }
        let lastTick = performance.now();
        const renderLoop = (timestamp: number) => {
            const deltaT = timestamp - lastTick;
            lastTick = timestamp;
            this.world.simulateWorld(deltaT);
            this.world.draw(ctx, this.props.config);
            this.animationFrame = requestAnimationFrame(renderLoop);
        };
        renderLoop(lastTick);
    }

    componentDidUpdate() {
        if (this.canvasRef.current) {
            this.world.width =
                this.canvasRef.current.width =
                this.canvasRef.current.offsetWidth;
            this.world.height =
                this.canvasRef.current.height =
                this.canvasRef.current.clientHeight;
        }
    }

    componentDidMount() {
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(this.play);
        }
    }

    componentWillUnmount() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
}