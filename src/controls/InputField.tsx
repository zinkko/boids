import { ReactNode } from 'react';
import styled from 'styled-components';

export default function InputField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <InputArea>
            <Label>{label}</Label>
            {children}
        </InputArea>
    );
}

const InputArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;

    padding: 16px;

`;

const Label = styled.label`
    color: #343434;
    padding-bottom: 4px;
    margin-bottom: 32px;
    border-bottom: solid 1px blue;
`;