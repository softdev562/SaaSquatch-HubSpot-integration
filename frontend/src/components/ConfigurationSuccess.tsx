import styled from 'styled-components';
import SaaSquatchLogo from '../assets/SaaSquatchLogo.png';
import HubspotLogo from '../assets/HubspotLogo.png';
import history from '../types/history';

const PageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: Roboto, sans-serif;
`;
const PageContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const TitleLinkText = styled.h1`
    cursor: pointer;
    color: #33475b;
    text-align: center;
    margin: 20px;
    font-size: 44px;
    font-weight: bold;
    display: block;
`;
const TitleText = styled.h1`
    color: #33475b;
    text-align: center;
    margin: 20px;
    font-size: 48px;
    font-weight: bold;
    display: block;
`;
const Logo = styled.img`
    height: 60px;
    vertical-align: top;
`;
const InfoText = styled.p`
    color: #000000;
    font-size: 20px;
    display: flex;
    margin-right: 5px;
`;

interface states {
    handleRedirectP1: () => void;
    handleRedirectP2: () => void;
}

export function ConfigurationSuccess() {
    return <View {...Controller()} />;
}

export function Controller() {
    const handleRedirectP1 = () => {
        history.push('/configuration/1');
    };
    const handleRedirectP2 = () => {
        history.push('/configuration/2');
    };
    return { handleRedirectP1, handleRedirectP2 } as states;
}

export function View(states: states) {
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>HubSpot Integration is Connected</TitleText>
                <InfoText>Select a step below to reconfigure your integration</InfoText>
                <TitleLinkText onClick={states.handleRedirectP1}>
                    Step 1: Configure your <Logo src={HubspotLogo} /> Integration
                </TitleLinkText>
                <TitleLinkText onClick={states.handleRedirectP2}>
                    Step 2: Configure your <Logo src={SaaSquatchLogo} /> Integration
                </TitleLinkText>
            </PageContent>
        </PageWrapper>
    );
}
