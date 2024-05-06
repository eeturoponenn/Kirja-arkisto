import { useState, useEffect } from 'react';

export const NewSerie = (props) => {
    const [serie, setSerie] = useState('');
    const [description, setDescription] = useState('');
    const [seriesPost, setSeriesPost] = useState([]); // for posting series
    const [addPressed, setAddPressed] = useState(false);
    const [query, setQuery] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = () => {
        setSeriesPost({ name: serie, description: description});
        setAddPressed(true);
        setSerie('');
        setDescription('');
        setSaved(true);

        // show "Lisätty" text 2s
        setTimeout(() => {
            setSaved(false);
        }, 2000);
    }

    // post serie
    useEffect(() => {
        async function postData(url = '', data) {
            const response = await fetch(url, {
              method: 'POST',
              mode: 'cors', 
              cache: 'no-cache', 
              credentials: 'same-origin', 
              headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow', 
              referrerPolicy: 'no-referrer', 
              body: JSON.stringify(data) 
            });
            setAddPressed(false);
            return response.json(); 
          }
          if (addPressed) {
          postData("http://localhost:5000/api/series", seriesPost)
          .then((data) => {
            console.log(data);
            //get activate
            setQuery(true);
          })
        }
        }, [addPressed]);

        // get series
        useEffect(() => {
            const fetchSeries = async () => {
                let response = await fetch("http://localhost:5000/api/series/");
                let d = await response.json();
                console.log('haettu data:', d);
                 // set data for Kirjasto component
                if (props.serieData) {
                    props.serieData(d);
                }
                setQuery(false);
            }
            if (query) {
                fetchSeries();
            }
        }, [query]);

      

    return (
        <div className='form'>
            <div className='row'>
                <input data-testid="seriesnametest" type="text" value={serie} placeholder="Anna sarjalle nimi..." onChange={(e) => setSerie(e.target.value)}></input>
                <input data-testid="seriesdesctest" type="text" value={description} placeholder="Anna sarjalle kuvaus..." onChange={(e) => setDescription(e.target.value)}></input>
                { saved ? ( <button className='btnAdd'>Lisätty</button> ) : ( <button className='btnAdd' onClick={() => handleSubmit()}>Lisää</button>)}
                
            </div>
        </div>
    );
}