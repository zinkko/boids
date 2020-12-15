import { useEffect, useRef, useState } from "react";
import World from "./entities/World";


const createWorld = (): World => {
    const world = new World(800, 400);
    const n = 80;
    const pad = 20;
    for (let i=0; i < n; i++) {
        world.addBoid({
            x: Math.random()*(world.width -2*pad) + pad,
            y: Math.random()*(world.height-2*pad) + pad,
        });
    }
    return world;
}



export default function BoidSimulation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [world, _] = useState(createWorld());

    useEffect(() => {
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
            />
        </div>
    );
};