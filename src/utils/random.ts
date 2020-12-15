import { DirectionVector, directionFromAngle, Point } from "../entities/geometry";

export const randomBetween = (a: number, b: number):number => {
    return Math.random() * Math.abs(a-b) + Math.min(a, b);
}

export interface randomColorConfig {
    minLightness?: number;
    maxLightness?: number;
    minSaturation?: number;
    maxSaturation?: number;
}

export const randomColor = (
    hue: number,
    mode: 'saturation' | 'lightness' | 'both',
    config?: randomColorConfig
): string => {
    let saturation = 90, lightness = 50;
    if (mode === 'saturation' || mode === 'both') {
        saturation = randomBetween(config?.minSaturation || 0, config?.maxSaturation || 100);
    }
    if (mode === 'lightness' || mode === 'both') {
        lightness = randomBetween(config?.minLightness || 0, config?.maxLightness || 100);
    }
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const randomDirection = (): DirectionVector => directionFromAngle(Math.random() * Math.PI * 2);

export interface RandomPositionConfig {
    maxX: number;
    minX: number;
    maxY: number;
    minY: number;
}

export const randomPosition = (config: RandomPositionConfig): Point => {
    return {
        x: randomBetween(config.maxX, config.minX),
        y: randomBetween(config.maxY, config.minY),
    };
}