import { useState, useEffect } from 'react';

export const EditSerie = (props) => {
    const [serieEdit, setSerieEdit] = useState(props.editName);
    const [descriptionEdit, setDescriptionEdit] = useState(props.editDesc);
    const [id, setId] = useState(null);
    const [updateData, setUpdateData] = useState([]);
    const [query, setQuery] = useState(false);
    const [saved, setSaved] = useState(false);

    // when tallenna pressed
    const handleSubmit = () => {
        console.log("props",props)
        if (props.id) {

            setId(props.id);
            setUpdateData({name: serieEdit, description: descriptionEdit});
            setSerieEdit('');
            setDescriptionEdit('');
            setSaved(true);

            // show "Tallennettu" text 1s
            setTimeout(() => {
                setSaved(false);
                // activate cancelEdit func in Kirjasto component
                if (props.cancelEdit) {
                    props.cancelEdit(1);
                }
            }, 1000);
        }
    
    }

    // PUT request
    useEffect(() => {
        async function update() {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            };
            const response = await fetch("http://localhost:5000/api/series/" + id, requestOptions);
            const data = await response.json();
            console.log('data', data);

            //get 
            setQuery(true);
        }
        if (id) {
            update();
        }
            
    }, [id]);

       // get series
       useEffect(() => {
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/series");
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
            <input type="text" value={serieEdit} onChange={(e) => setSerieEdit(e.target.value)}></input>
            <br></br>
            <input type="text" value={descriptionEdit} onChange={(e) => setDescriptionEdit(e.target.value)}></input>
            <br></br>
            { saved ? ( <button className='btnAdd'>Tallennettu</button> ) : ( <button className='btnAdd' onClick={() => handleSubmit()}>Tallenna</button>)}
            </div>
        </div>
    );
}