import React, { useState } from 'react';
import styled from 'styled-components';
import HubspotLogo from '../assets/HubspotLogo.png';
import axios from 'axios';
import history from '../types/history';
import { usePenpal } from '@saasquatch/integration-boilerplate-react';
import jwt_decode from 'jwt-decode';
import ErrorDialog from './Dialog';

/**
 * Renders the login screen (available at /login).
 * Handles opening a popup with the HubSpot oauth, and stores the returned hubspot account info
 */

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Logo = styled.img`
    height: 60px;
`;
const TitleText = styled.h1`
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #33475b;
    text-align: left;
    margin: 0px;
    font-size: 48px;
    font-weight: bold;
    display: flex;
`;
const InfoText = styled.p`
    color: #000000;
    font-size: 20px;
    display: flex;
    margin-right: 5px;
`;
const LoginButton = styled.button`
    &:hover {
        background-color: #ff8661;
    }
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 400;
    border: 0;
    border-radius: 1em;
    cursor: pointer;
    color: white;
    background-color: #ff7a59;
    display: inherit;
    font-size: 36px;
    width: 180px;
    height: 80px;
`;
const ErrorText = styled.p`
    color: #f92929;
    font-size: 20px;
    display: flex;
`;

const HUBSPOT_AUTHORIZATION = '/hubspot_authorization';
const HUBSPOT_OAUTH_URL = '/hubspot_url';
const API_CONFIGURATION_URL = '/api/configuration';

interface states {
    showError: boolean;
    accountError: boolean;
    cookieError: boolean;
    OAuth: () => void;
}

export function Login() {
    return <View {...OAuthFunction()} />;
}

export function OAuthFunction() {
    const [showError, setError] = useState(false);
    const [accountError, setAccountError] = useState(false);
    const [cookieError, setCookieError] = useState(false);

    const penpal = usePenpal();
    // sub is the attribute of the tenant alias from the tenant token
    const tenantAliasUnparsed: { sub: string } = jwt_decode(penpal.tenantScopedToken);
    // the alias is sent of the form exampleAlias@tenants
    const tenantAliasParsed: string = tenantAliasUnparsed.sub.split('@')[0];

    const OAuth = async () => {
        let hubspotID = '';
        // Check Server for Hubspot Authorization
        await axios
            .get(HUBSPOT_AUTHORIZATION)
            .then((response) => {
                if (response.data === 'Unauthorized') {
                    // Get Hubspot OAuth URL from server
                    axios
                        .get(HUBSPOT_OAUTH_URL)
                        .then((response) => {
                            // Open popup for Hubspot OAuth URL
                            const popup = window.open(
                                response.data,
                                'OAuth Popup',
                                `toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=${500}, height=${800}, top=150, left=650`,
                            );
                            // Check for when popup closes
                            var timer = setInterval(function () {
                                if (popup && popup.closed) {
                                    setAccountError(false);
                                    if (!navigator.cookieEnabled) {
                                        document.cookie = "frontendToken=''; SameSite=None; Secure";
                                        setCookieError(true);
                                    } else {
                                        // Check Server for Hubspot Authorization
                                        axios
                                            .get(HUBSPOT_AUTHORIZATION)
                                            .then((response) => {
                                                // Show error message when popup window is closed without Authorization
                                                if (response.data === 'Unauthorized') {
                                                    clearInterval(timer);
                                                    setTimeout(function () {
                                                        setError(true);
                                                    }, 600);
                                                }
                                                // Send user to configuration page if authorized and integration account doesn't already exist
                                                else {
                                                    clearInterval(timer);
                                                    hubspotID = response.data;
                                                    axios
                                                        .get(API_CONFIGURATION_URL, {
                                                            params: { SaaSquatchTenantAlias: tenantAliasParsed },
                                                        })
                                                        .then((response) => {
                                                            // The hubspotID matches the existing user or a blank config object is returned if the user doesn't exist yet in the database
                                                            if (
                                                                response.data.hubspotID === hubspotID ||
                                                                (response.data.hubspotID === '' &&
                                                                    response.data.PushPartixipantsAsContacts ===
                                                                        false &&
                                                                    response.data.PullParticipantsIntoContacts ===
                                                                        false &&
                                                                    response.data
                                                                        .DeleteContactwhenParticipantDeleted ===
                                                                        false &&
                                                                    response.data.PushContactsAsParticipants ===
                                                                        false &&
                                                                    response.data.PullContactsIntoParticipants ===
                                                                        false &&
                                                                    response.data
                                                                        .DeleteParticipantWhenContactDeleted ===
                                                                        false &&
                                                                    response.data.accessToken === '' &&
                                                                    response.data.refreshToken === '')
                                                            ) {
                                                                history.push('/configuration');
                                                            } else {
                                                                // Show account error and reset frontend token if integration exists with a different Hubspot account
                                                                document.cookie =
                                                                    "frontendToken=''; SameSite=None; Secure";
                                                                setAccountError(true);
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.error(
                                                                'Error: Unable to retrieve Configuration Data',
                                                            );
                                                        });
                                                }
                                            })
                                            .catch(function (err) {
                                                console.error(
                                                    err +
                                                        'Error getting Hubspot Authorization from: ' +
                                                        HUBSPOT_AUTHORIZATION,
                                                );
                                            });
                                    }
                                }
                            }, 200);
                        })
                        .catch(function (err) {
                            console.error(err + 'Error getting Hubspot URL from: ' + HUBSPOT_OAUTH_URL);
                        });
                } else {
                    // Send user to configuration page if authorized and integration account doesn't already exist
                    hubspotID = response.data;
                    axios
                        .get(API_CONFIGURATION_URL, { params: { SaaSquatchTenantAlias: tenantAliasParsed } })
                        .then((response) => {
                            // The hubspotID matches the existing user or a blank config object is returned if the user doesn't exist yet in the database
                            if (
                                response.data.hubspotID === hubspotID ||
                                (response.data.hubspotID === '' &&
                                    response.data.PushPartixipantsAsContacts === false &&
                                    response.data.PullParticipantsIntoContacts === false &&
                                    response.data.DeleteContactwhenParticipantDeleted === false &&
                                    response.data.PushContactsAsParticipants === false &&
                                    response.data.PullContactsIntoParticipants === false &&
                                    response.data.DeleteParticipantWhenContactDeleted === false &&
                                    response.data.accessToken === '' &&
                                    response.data.refreshToken === '')
                            ) {
                                history.push('/configuration');
                            } else {
                                // Show account error and reset frontend token if integration exists with a different Hubspot account
                                document.cookie = "frontendToken=''; SameSite=None; Secure";
                                setAccountError(true);
                            }
                        })
                        .catch((error) => {
                            console.error('Error: Unable to retrieve Configuration Data');
                        });
                }
            })
            .catch(function (err) {
                console.error(err + 'Error getting Hubspot Authorization from: ' + HUBSPOT_AUTHORIZATION);
            });
    };
    return { showError, accountError, cookieError, OAuth } as states;
}

export function View(states: states) {
    return (
        <Wrapper className="wrapper">
            <div>
                <TitleText className="title-text">
                    {' '}
                    Log in to <Logo src={HubspotLogo} />
                </TitleText>
                <InfoText className="info-text">
                    Your contacts will be synced using the HubSpot data from this user’s permissions.
                </InfoText>
                <LoginButton onClick={states.OAuth} type="button" className={'login-button'}>
                    {'Log in'}
                </LoginButton>
                <div>
                    {states.showError ? (
                        <ErrorText>
                            Failed to authenticate: The pop-up window was closed before authentication.
                        </ErrorText>
                    ) : (
                        <React.Fragment />
                    )}
                    {states.cookieError ? (
                        <ErrorText>
                            Failed to authenticate: Please enable third-party cookies and try logging in again.
                        </ErrorText>
                    ) : (
                        <React.Fragment />
                    )}
                </div>
                <div>{states.accountError ? <ErrorDialog /> : <div></div>}</div>
            </div>
        </Wrapper>
    );
}
