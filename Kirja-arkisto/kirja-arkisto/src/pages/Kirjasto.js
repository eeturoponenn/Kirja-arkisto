import React from 'react';
import { GetNewSerie } from '../components/GetNewSerie';
import { OwnSerieList } from '../components/OwnSerieList';
import { OwnEditSerie } from '../components/OwnEditSerie';
import { SearchSeriesOrBooks } from '../components/SearchSeriesOrBooks';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/Kirjasto.css';
import {BrowserRouter as Router, useNavigate } from 'react-router-dom';




    const Kirjasto = () => {

    const { user: currentUser } = useSelector((state) => state.auth);
    

    const [addSerie, setAddSerie] = useState('');
    const [seriesGet, setSeriesGet] = useState([]); 
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [cancelEditPressed, setCancelEditPressed] = useState(0); // SerieList component ---> cancel edit pressed
    const [id, setId] = useState(null);
   

   

    
     // get series when page loads first time
     useEffect(() => {
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/library/"+currentUser.id);
            let d = await response.json();
            console.log('haettu data ekan kerran:', d.user.series); 
            setSeriesGet(d.user.series);
        }
        fetchSeries();  
    }, []);

    // set data for SerieList component
    const serieData = (data) => {
        setSeriesGet(data);
    }
    // when Muokkaa button pressed in SerieList component
    const handleEdit = (serie) => {
        console.log("serie",serie)
        setAddSerie(false);
        setEditName(serie.name);
        setEditDesc(serie.description);
        setId(serie._id);

    }
    // when Peruuta muokkaus pressed in Kirjasto or Tallenna pressed in EditSerie component
    const cancelEdit = (num) => { 
        setAddSerie('');  
        if (cancelEditPressed === 1 || cancelEditPressed === num) {
            setCancelEditPressed(0);
        }
        else {
            setCancelEditPressed(1);
        }
    }
    
    return (
        <div className='container'>
            <div className='header-search'>
            <header>
            <h1>Oma kirjasto</h1>
            </header>
            <SearchSeriesOrBooks data={serieData} />
            </div>
            {
            addSerie ? <button className='btnsAddCan' onClick={() => setAddSerie('')}>Peruuta tuominen</button> 
            : addSerie === false ? <button className='btnsAddCan' onClick={() => cancelEdit()}>Peruuta muokkaus</button>
            :
            <button className='btnsAddCan' onClick={() => setAddSerie(true)}>Tuo uusi sarja</button>
            }
            {
            addSerie ? <GetNewSerie userId={currentUser.id} serieData={serieData} /> : addSerie === false ? <OwnEditSerie cancelEdit={cancelEdit} id={id} editName={editName} editDesc={editDesc} serieData={serieData} /> : null
            }
            <OwnSerieList data={seriesGet} serieData={serieData} handleEdit={handleEdit} editCancelled={cancelEditPressed} />
        </div>
    );
}

export default Kirjasto;

