import { useState, useEffect } from 'react';

export const GetNewSerie = (props) => {
    const [serie, setSerie] = useState('');
    const [description, setDescription] = useState('');
    const [seriesPost, setSeriesPost] = useState([]); // for posting series
    const [addPressed, setAddPressed] = useState(false);
    const [query, setQuery] = useState(false);
    const [saved, setSaved] = useState(false);
    const [series, setSeries] = useState([]);
    const [serieId, setSerieId] = useState('');
    const userId = props.userId;
    const [getAfterPost, setGetAfterPost] = useState(false)
    const [newBooks, setNewBooks] = useState();
   

    const handleSubmit = () => {
        setSeriesPost({ serieId });
        setAddPressed(true);
        // setSerie('');
        // setDescription('');
        setSaved(true);
        setQuery(true); // put activate

        // show "Lisätty" text 2s
        setTimeout(() => {
            setSaved(false);
        }, 2000);
    }

        // get series when page loaded
        useEffect(() => {
            const fetchSeries = async () => {
                let response = await fetch("http://localhost:5000/api/series/");
                let d = await response.json();
                console.log('haettu data ekan kerran getnewseriesissä:', d);
                //set ready series for dropdown selection
                setSeries(d);
            }
            
            fetchSeries();
            
        }, []);
/*
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
          postData("http://localhost:5000/api/libraries", seriesPost)
          .then((data) => {
            console.log(data);
            //get activate
            setQuery(true);
          })
        }
        }, [addPressed]);
*/

// put series
useEffect(() => {
 
  console.log('userId', userId);
  console.log('serieId', serieId);
  async function updatePost() {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: serie, description: description, books: newBooks })
    };
    const response = await fetch('http://localhost:5000/api/library/' + userId, requestOptions);
    const data = await response.json();
    console.log('putattu data', data);
  
    setQuery(false);
    setGetAfterPost(true);
  }
  if (query) {
    updatePost();
  }
}, [query]);



             // get series when page loads first time
     useEffect(() => {
      const fetchSeries = async () => {
        console.log("sarjaid",serieId)
          let response = await fetch("http://localhost:5000/api/library/"+userId);
          let d = await response.json();
          console.log('haettu data ekan kerran:', d.user.series); 
          props.serieData(d.user.series);
      }
      if(getAfterPost){
      fetchSeries();  
      }
  }, [getAfterPost]);

 
   const handleSelect = (selectedOption) => {
    const selectedSerie = series.find((serie) => serie.name === selectedOption);
    
    if (selectedSerie) {
      
      setSerie(selectedSerie.name);
      setDescription(selectedSerie.description);
      setSerieId(selectedSerie._id);
      setNewBooks(selectedSerie.books)
      
    } else {
      setSerie('');
      setDescription('');
    }
}

return (
  <div className='form'>
    <div className='row'>
      <select data-testid="selectbutton" onChange={(e) => handleSelect(e.target.value)} >
        <option value="">Valitse sarja</option>
        {series.map((serie, index) => {
          return <option value={serie.name} key={index}>{serie.name}</option>
        })}
      </select>
      <input readOnly type="text" value={description} placeholder="Kuvaus..."></input>
      { saved ? ( <button className='btnAdd'>Lisätty</button> ) : ( <button className='btnAdd' onClick={() => handleSubmit()}>Lisää</button>)}
    </div>
  </div>
);
}