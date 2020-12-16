import styled from 'styled-components';

export interface SliderProps {
    unit?: string;
    value: number;
    setValue: (newvalue: number) => void;
}

export default function Slider({ unit, value, setValue}: SliderProps) {
    return (
        <SliderContainer>
            <button onClick={() => setValue(value-1)}>-</button>
            {value}{unit && ` ${unit}`}
            <button onClick={() => setValue(value+1)}>+</button>
        </SliderContainer>
    );
}

const SliderContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
`;