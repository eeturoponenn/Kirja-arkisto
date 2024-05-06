import React from 'react';
import '../styles/Kirja.css';
import { Link, Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";

export const OmaKirja = () => {
    
    const navigate = useNavigate();

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const name = queryParams.get('name');
    const author = queryParams.get('author');
    const condition = queryParams.get('condition');
    const etukansikuva = decodeURIComponent(queryParams.get('etukansikuva'));
    const takakansikuva = decodeURIComponent(queryParams.get('takakansikuva'));
    const lisakuva1 = decodeURIComponent(queryParams.get('lisakuva1'));
    const hankintahinta = queryParams.get('hankintahinta');
    const hankintaAika = queryParams.get('hankintaAika');
    const kuvausteksti = queryParams.get('kuvausteksti');
    const piirtajat = queryParams.get('piirtajat');
    const ensipainosvuosi = queryParams.get('ensipainosvuosi');
    const painos = queryParams.get('painos');

    return (
        <div className='component'>
            <div className="btn-back">
                <button onClick={() => navigate("/Kirjasto")}>Palaa takaisin</button>
            </div>
            <div className='content'>
            <div className='text'>
                <p>Nimi: {name}</p>
                <p>Kirjailija: {author}</p>
                <p>Kuntoluokka: {condition}</p>
                <p>Hankintahinta: {hankintahinta} </p>
                <p>Hankinta-aika: {hankintaAika}</p>
                <p>Kuvausteksi: {kuvausteksti}</p>
                <p>Piirtajat: {piirtajat}</p>
                <p>Ensipainosvuosi: {ensipainosvuosi}</p>
                <p>Painos: {painos}</p>
            </div>
            <div className='pictures'>
                <div className='pic'>
                    <p>Etukansikuva</p>
                    <img width={200} height={200} src={etukansikuva} />
                </div>
                
                <div className='pic'>
                    <p>Takakansikuva</p>
                    <img width={200} height={200} src = {takakansikuva} />
                </div>
                <div className='pic'>
                    <p>Sivukuva</p>
                    <img width={200} height={200} src = {lisakuva1} />
                </div>
            </div>
        </div>
        </div>

    )
}