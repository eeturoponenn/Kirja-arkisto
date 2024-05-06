import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BackgroundImage from '../assets/background.jpg';
import '../styles/Etusivu.css';

function Etusivu() {


  return (
    <div className="home" style={{backgroundImage: `url(${BackgroundImage})`}}>
      <div className="headerContainer">
        <h1> KIRJA-ARKISTO </h1>
        <p> Tervetuloa kirja-arkistoon!</p>
      </div>
    </div>
  );
}

export default Etusivu