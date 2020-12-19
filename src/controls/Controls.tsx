import { SimulationConfig } from "../BoidSimulation";
import { BoidProperties } from "../entities/Boid";
import InputField from "./InputField";
import Slider from "./Slider";
import DrawingOptions from './DrawingOptions'
import styled from 'styled-components';

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
            <Title>Settings</Title>
            <InputField label="Amount of Boids">
                <Slider
                    minValue={1}
                    maxValue={250}
                    value={values.amountOfBoids}
                    setValue={newvalue => update('amountOfBoids', newvalue)}
                />
            </InputField>
            <InputField label="Boid Size">
                <Slider
                    minValue={1}
                    maxValue={30}
                    unit="px"
                    value={values.boidProperties?.size || 5}
                    setValue={newvalue => update('size', newvalue)}
                />
            </InputField>

            <InputField label="Drawing Options">
                <DrawingOptions
                    values={values}
                    setValues={setValues}
                />
            </InputField>
        </div>
    );
}

const Title = styled.h2`
    padding: 0 16px;
    color: #343434;
`

