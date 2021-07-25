import { Switch } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

/**
 * Renders a simple switch with some text
 * Is used in ConfigurationP1 & ConfigurationP2
 */

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const InfoText = styled.p`
    color: #000000;
    font-size: 20px;
    display: flex;
    margin-right: 5px;
`;

interface states {
    isChecked: boolean;
    settingText: string;
    handleChange: () => void;
    disabled: boolean;
}

export function ToggleSetting(props: {
    settingText: string;
    isChecked: boolean;
    handleChange: () => void;
    disabled?: boolean;
}) {
    return (
        <View
            settingText={props.settingText}
            isChecked={props.isChecked}
            handleChange={props.handleChange}
            disabled={props.disabled || false}
        />
    );
}

export function View(states: states) {
    return (
        <ItemContainer onClick={(event) => event.stopPropagation()} onFocus={(event) => event.stopPropagation()}>
            <Switch checked={states.isChecked} onChange={states.handleChange} disabled={states.disabled} />
            <InfoText>{states.settingText}</InfoText>
        </ItemContainer>
    );
}
