import styled from 'styled-components';

export interface SliderProps {
    value: number;
    setValue: (newvalue: number) => void;
}

export default function Slider({ value, setValue}: SliderProps) {
    return (
        <SliderContainer>
            <button onClick={() => setValue(value-1)}>-</button>
            {value}
            <button onClick={() => setValue(value+1)}>+</button>
        </SliderContainer>
    );
}

const SliderContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
`;