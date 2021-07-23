import React, {useState} from "react";
import styled from 'styled-components';
import HubspotLogo from '../assets/HubspotLogo.png';
import axios from 'axios';
import history from '../types/history';

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
  color: #33475B;
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
    background-color: #FF8661
  }
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  border: 0;
  border-radius: 1em;
  cursor: pointer;
  color: white;
  background-color: #FF7A59;
  display: inherit;
  font-size: 36px;
  width: 180px;
  height: 80px;
`;
const ErrorText = styled.p`
    color: #F92929;
    font-size: 20px;
    display: flex;
`;

const HUBSPOT_AUTHORIZATION= '/hubspot_authorization'
const HUBSPOT_OAUTH_URL = '/hubspot_url'

interface states {
  showError: boolean;
  cookieError: boolean;
  OAuth: ()=>void;
}

export function Login() {
  return <View {...OAuthFunction()} />
}

export function OAuthFunction(){
  const [showError, setError] = useState(false);
  const [cookieError, setCookieError] = useState(false);
  
  const OAuth = async () => {
    // Check Server for Hubspot Authorization
    await axios.get(HUBSPOT_AUTHORIZATION)
    .then(response => {
      if (response.data === "Unauthorized"){
        // Get Hubspot OAuth URL from server
        axios.get(HUBSPOT_OAUTH_URL)
        .then( response => {
          // Open popup for Hubspot OAuth URL
          const popup = window.open(response.data, "OAuth Popup",`toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=${500}, height=${800}, top=150, left=650`);
          // Check for when popup closes
          var timer = setInterval(function() { 
            if(popup && popup.closed) {
              if (!navigator.cookieEnabled) {
                document.cookie="frontendToken=''; SameSite=None; Secure";
                setCookieError(true)
              } else {
                // Check Server for Hubspot Authorization
                axios.get(HUBSPOT_AUTHORIZATION)
                .then(response => {
                  // Send user to configuration page if authorized
                  if (response.data === "Authorized"){
                    clearInterval(timer);
                    history.push('/configuration');
                  }
                  // Show error message when popup window is closed without Authorization
                  if (response.data === "Unauthorized") {
                    clearInterval(timer);
                    setTimeout(function(){ 
                    setError(true)
                    }, 600);
                  }
                })
                .catch(function(err) {
                  console.error(err + "Error getting Hubspot Authorization from: " + HUBSPOT_AUTHORIZATION);
                });
              }
            }
          }, 200);
        })
        .catch(function(err) {
          console.error(err + "Error getting Hubspot URL from: " + HUBSPOT_OAUTH_URL);
        });
      } else {
        history.push('/configuration');
      }
    })
    .catch(function(err) {
      console.error(err + "Error getting Hubspot Authorization from: " + HUBSPOT_AUTHORIZATION);
    });
  }
  return {showError, cookieError, OAuth} as states
}

export function View( states: states ){
  return (
    <Wrapper className= "wrapper">
      <div>
        <TitleText className= "title-text"> Log in to <Logo src={HubspotLogo} /></TitleText>
        <InfoText className= "info-text">Your contacts will be synced using the HubSpot data from this user’s permissions.</InfoText>
        <LoginButton 
          onClick={states.OAuth}
          type= "button"
          className={"login-button"}
        >
          {"Log in"}
        </LoginButton>
        <div>
          { states.showError ? <ErrorText>
            Failed to authenticate: The pop-up window was closed before authentication.
          </ErrorText> : <React.Fragment />
          }
          { states.cookieError ? <ErrorText>
            Failed to authenticate: Please enable third-party cookies and try logging in again.
          </ErrorText> : <React.Fragment />
          }
        </div>
      </div>
    </Wrapper>
   );
 }
