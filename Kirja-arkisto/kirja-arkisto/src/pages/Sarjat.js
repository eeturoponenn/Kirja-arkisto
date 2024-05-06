import React from 'react';
import { NewSerie } from '../components/NewSerie';
import { SerieList } from '../components/SerieList';
import { EditSerie } from '../components/EditSerie';
import { SearchSeriesOrBooks } from '../components/SearchSeriesOrBooks';
import { useState, useEffect } from 'react';
import '../styles/Kirjasto.css';


    const Sarjat = () => {
    const [addSerie, setAddSerie] = useState('');
    const [seriesGet, setSeriesGet] = useState([]); 
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [cancelEditPressed, setCancelEditPressed] = useState(0); // SerieList component ---> cancel edit pressed
    const [id, setId] = useState(null);

     // get series when page loads first time
     useEffect(() => {
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/series");
            let d = await response.json();
            console.log('haettu data ekan kerran:', d); 
            setSeriesGet(d);      
        }
        fetchSeries();  
    }, []);

    // set data for SerieList component
    const serieData = (data) => {
        setSeriesGet(data);
    }
    // when Muokkaa button pressed in SerieList component
    const handleEdit = (serie) => {
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
            <h1>Sarjat</h1>
            </header>
            </div>
            {
            addSerie ? <button className='btnsAddCan' onClick={() => setAddSerie('')}>Peruuta lisääminen</button> 
            : addSerie === false ? <button className='btnsAddCan' onClick={() => cancelEdit()}>Peruuta muokkaus</button>
            :
            <button data-testid="testbutton" className='btnsAddCan' onClick={() => setAddSerie(true)}>Lisää uusi sarja</button>
            }
            {
            addSerie ? <NewSerie serieData={serieData} /> : addSerie === false ? <EditSerie cancelEdit={cancelEdit} id={id} editName={editName} editDesc={editDesc} serieData={serieData} /> : null
            }
            <SerieList data={seriesGet} serieData={serieData} handleEdit={handleEdit} editCancelled={cancelEditPressed} />
        </div>
    );
}
export default Sarjat;