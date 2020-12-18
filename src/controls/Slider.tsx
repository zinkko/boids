import styled from 'styled-components';

export interface SliderProps {
    unit?: string;
    value: number;
    minValue: number;
    maxValue: number;
    setValue: (newvalue: number) => void;
}


export default function Slider({ unit, value, setValue, maxValue, minValue }: SliderProps) {
    return (
        <SliderContainer>
            {value}&nbsp;{unit}
            <input
                type="range"
                min={minValue || 0}
                max={maxValue || 100}
                value={value}
                onChange={v => setValue(parseInt(v.target.value))}
            />
        </SliderContainer>
    );
}

const SliderContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 9fr;
    box-sizing: border-box;
`;
