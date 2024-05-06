import { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";
import { useSelector } from 'react-redux';


export const OwnSerieList = (props) => {
    const { data, editCancelled } = props || [];
    const [editPressed, setEditPressed] = useState(editCancelled);
    const [deleteQuery, setDeleteQuery] = useState(0);
    const [query, setQuery] = useState(false);
    const [deletePressed, setDeletePressed] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    

    let navigate = useNavigate();
  
    // when edit is cancelled or saved
    useEffect(() => {
        setEditPressed(0);
    }, [editCancelled]);
  
    // when Muokkaa pressed
    const edit = (serie) => {
        // handleEdit() ---> Kirjasto component
        console.log("data",data)
        if (props.handleEdit) {
            props.handleEdit(serie);
            setEditPressed(1);
        }
    }

    // when Poista pressed
    const handleDelete = (serie) => {
        if (window.confirm(`Haluatko varmasti poistaa sarjan ${serie.name}?`) == true) {

            
            setDeleteQuery(serie._id);
            setDeletePressed(true);
        }
        else {
            return;
        }
    }

    // Delete series
    useEffect(() => {
        const deleteData = async () => {

            
            let response = await fetch("http://localhost:5000/api/library/" + currentUser.id, {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({serieId: deleteQuery}),
                redirect: 'follow',
                referrerPolicy: 'no-referrer'
            });
            let d = await response.json();
            console.log('poistettu data:', d);
            setDeletePressed(false);
            //activate get 
            setQuery(true);         
        }
        if (deletePressed) {
            deleteData();
        }
    }, [deletePressed]);

    // get series
    useEffect(() => {
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/library/"+currentUser.id);
            let d = await response.json();
            console.log('haettu data:', d);

            // set data for Kirjasto component
            if (props.serieData) {
                props.serieData(d.user.series);
            }
            setQuery(false);
        }
        if (query) {
            fetchSeries();
        }
    }, [query]);

      

    // Navigate to Kirjasto2 page
    const handleOpen = (serie) => {
        console.log("serie.id: ", serie._id);
    
        navigate(`/kirjasto/${serie.name}/${serie.description}/${serie._id}`);
    }

    return (
        <table>
            <thead>
                <tr>
                    <td>Sarja</td>
                    <td>Kuvaus</td>
                </tr>
            </thead>
            <tbody>
                {
                data ? (
                  Object.entries(data).map(([key,serie], index) => {
                    console.log(serie)
                    return <tr key={index}>
                        <td>{serie.name}</td>
                        <td>{serie.description}</td>
                        <td><button className='btn-avaa' onClick={() => handleOpen(serie)}>Avaa</button></td>
                        <td>
                        {editPressed != 0 ? (<button className="disabled btn-muokkaa">Muokkaa</button>) : (<button className='btn-muokkaa' onClick={() => edit(serie)}>Muokkaa</button>) }
                        </td>                        
                        <td><button className='btn-poista' onClick={() => handleDelete(serie)}>Poista</button></td>
                    </tr>
                  })
                  ): (
                    <p>Loading data...</p>
                  )
                }
                
            </tbody>
        </table>
    );
}