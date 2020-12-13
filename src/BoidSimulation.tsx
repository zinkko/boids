import { useEffect, useRef } from "react";
import World from "./entities/World";
import Boid from "./entities/Boid";

const world = new World();
world.addBoid();

export default function BoidSimulation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null); 

    const play = (ctx: CanvasRenderingContext2D) => {
        let lastTick = performance.now();
        const renderLoop = (timestamp: number) => {
            const deltaT = timestamp - lastTick;
            lastTick = timestamp;
            world.simulateWorld(deltaT);
            world.draw(ctx, lastTick);
            requestAnimationFrame(renderLoop);
        };
        renderLoop(lastTick);
    }

    useEffect(() => {
        const ctx = canvasRef?.current?.getContext('2d');
        if (ctx) {
            play(ctx);
        }
    }, [canvasRef]);


    return (
        <div className="Simulation">
            <canvas
                ref={canvasRef}
                id="world"
                width={world.width}
                height={world.height}
                style={{ border: '1px dashed black' }}
            />
        </div>
    );
};