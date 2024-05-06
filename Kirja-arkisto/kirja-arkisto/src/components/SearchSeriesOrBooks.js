import React from "react";
import { useState, useEffect} from "react";
import { useSelector } from 'react-redux';


export const SearchSeriesOrBooks = (props) => {

    const { user: currentUser } = useSelector((state) => state.auth);
    const [searchName, setSearchName] = useState("");
    


    const [search, setSearch] = useState(false);
    const handleClick = () =>{
        setSearch(!search);
    }

    

    useEffect(() =>{
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/library/"+currentUser.id);
            let d = await response.json();
            console.log('haettu data hausta:', d.user.series); 

            const name = d.user.series.filter((s) => s.name === searchName);
            console.log("nimen pituus", name.length)
            if(name.length === 0){
                props.data(d.user.series);
                return;
            }
            props.data(name)
            
        }
        fetchSeries();  
    },[search])



    return (
        <div className="input-checbox-container">
            <div className="input-container">
                <input type="search" placeholder="Hae sarjaa..." value={searchName} onChange={(e) => setSearchName(e.target.value)}></input>
                <button onClick={() => handleClick()}>Hae</button>
            </div>
        </div>
    );
}