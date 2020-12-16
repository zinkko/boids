import { SimulationConfig } from "../BoidSimulation";
import { BoidProperties } from "../entities/Boid";
import InputField from "./InputField";
import Slider from "./Slider";

export interface ControlProps {
    values: SimulationConfig;
    setValues: (newvalue: SimulationConfig) => void;
}

export default function Controls({ values, setValues }: ControlProps) {
    const update = (key: keyof SimulationConfig | keyof BoidProperties, value: any) => {
        if (key in values) {
            setValues({...values, [key]: value});
        } else {
            const boidProperties = { ...values.boidProperties, [key]: value };
            setValues({...values, boidProperties });
        }
    }
    return (
        <div className="Controls">
            <InputField label="Amount of Boids">
                <Slider
                    value={values.amountOfBoids}
                    setValue={newvalue => update('amountOfBoids', newvalue)}
                />
            </InputField>
        </div>
    );
}