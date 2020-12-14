import { useEffect, useRef } from "react";
import World from "./entities/World";

const world = new World();
const n = 40;
const pad = 20;
for (let i=0; i < n; i++) {
    world.addBoid({
        x: Math.random()*(world.width -2*pad) + pad,
        y: Math.random()*(world.height-2*pad) + pad,
    });
}



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
            />
        </div>
    );
};