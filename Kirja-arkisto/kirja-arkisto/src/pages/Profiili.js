import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import '../styles/Profiili.css';

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/kirjaudu" />;
  }

  return (
    <div className="container" >
      <header className="header-search" style={{marginTop: '20px'}}>
        <h1>
          <strong>{currentUser.username}</strong> Tiedot
        </h1>
      </header>

      <p data-testid="profiilinimi">
        <strong>Käyttäjä Id:</strong> {currentUser.id}
      </p>
      <p data-testid="profiilisäpö">
        <strong>Sähköposti:</strong> {currentUser.email}
      </p>
    {/*
      <p>
        <strong>JSON Salaustoken:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
     
      <strong>Käyttöoikeudet:</strong> {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      */}
    </div>
  );
};

export default Profile;