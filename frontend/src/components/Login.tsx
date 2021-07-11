import {useState} from "react";
import styled from 'styled-components';
import HubspotLogo from '../assets/HubspotLogo.png';
import axios from 'axios';
import history from '../types/history';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LoginBox = styled.div`
  height: 350px;
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

const HUBSPOT_OAUTH_URL = '/hubspot_url'
const HUBSPOT_OAUTH_CHECK_URL = '/hubspot_authorized'

interface states {
  showError: boolean;
  OAuth: ()=>void;
}

export function Login() {
  return <View {...OAuthFunction()} />
}

export function OAuthFunction(){
  const [showError, setError] = useState(false);
  
  const OAuth = async () => {
    setError(false);

    // Check Server for Hubspot Authorization
    axios.get(HUBSPOT_OAUTH_CHECK_URL)
    .then(response => {
      if (response.data === "Unauthorized"){
        // Redirect User to Hubspot OAuth URL Popup
        axios.get(HUBSPOT_OAUTH_URL)
        .then(response => {
          const h = 800;
          const w = 500;
          const popup = window.open(response.data, "OAuth Popup",`toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=${w}, height=${h}, top=150, left=650`);
        
          var timer = setInterval(function() { 
            if(popup && popup.closed) {
              // Check Server for Hubspot Authorization
              axios.get(HUBSPOT_OAUTH_CHECK_URL)
              .then(response => {
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
                console.error(err + "Error getting Hubspot OAuth Authorization from: " + HUBSPOT_OAUTH_CHECK_URL);
              });
            }
          }, 200);
        })
        .catch(function(err) {
          console.error(err + "Error getting Hubspot OAuth URL from: " + HUBSPOT_OAUTH_URL);
        });
      } else {
        history.push('/configuration');
      }
    })
    .catch(function(err) {
      console.error(err + "Error getting Hubspot OAuth Authorization from: " + HUBSPOT_OAUTH_CHECK_URL);
    });
  }
  return {showError, OAuth} as states
}

export function View( states: states ){
  return (
    <Wrapper className= "wrapper">
    <LoginBox className= "login">
      <TitleText className= "title-text"> Log in to <Logo src={HubspotLogo} /></TitleText>
      <InfoText className= "info-text">Your contacts will be synced using the HubSpot data from this user’s permissions.</InfoText>
      <InfoText className= "info-text">For more information read our&nbsp;<a href={`https://example.com`} >HubSpot Quickstart Guide.</a></InfoText>
      <LoginButton 
        onClick={states.OAuth}
        type= "button"
        className={"login-button"}
      >
        {"Log in"}
      </LoginButton>
      <div>
        { states.showError ? <ErrorText>
          Failed to authenticate: User closed the popup window.
        </ErrorText> : <div></div>
        }
      </div>
    </LoginBox>
  </Wrapper>
   );
 }
