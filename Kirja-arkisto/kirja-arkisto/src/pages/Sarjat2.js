import { Link, Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";
import '../styles/Kirjasto2.css';
import { useState, useEffect } from'react';
import { NewBook } from '../components/NewBook';
import { BookItems } from "../components/BookItems";
import { useSelector } from "react-redux";


export const Sarjat2 = () => {
    const { serie, desc, id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [addBook, setAddBook] = useState('');
    const [bookItems, setBookItems] = useState([]) // for passing bookItems to other components
    const [checkBooks, setCheckBooks] = useState('');

    
    // show new book form
    const handleAddBook = (state) => {
        if (state === true) {
            setAddBook(false);  
        }
        else {
            setAddBook(true);
        }
    }

    const handleCancelBook = () => {
        setAddBook('');
    }

    
    
     // get books when page is loaded
     useEffect(() => {
        const fetchBooks = async () => {
            let response = await fetch("http://localhost:5000/api/series/" + id);
            let d = await response.json();
        if (d) {
            console.log('haettu data kun ekan kerran latautuu:', d);
            const series = d.series
            const books = series.books
            setBookItems(books);
            setCheckBooks(false);
        }
        else {
            console.log('Aloita lisäämällä kirja');
            setCheckBooks(true);
        }
    }
            fetchBooks();      
    }, []);


    // get books when new book is added or removed
    useEffect(() => {
        console.log('serieId', id);
        const fetchBooks = async () => {
            //console.log('currenUserId', currentUser.id);
            //let response = await fetch("http://localhost:5000/api/books/?serialNumber=" + id);
            let response = await fetch("http://localhost:5000/api/series/" + id);
            //let response = await fetch("http://localhost:5000/api/library/" + currentUser.id);
            let d = await response.json();
        if (d) {
            console.log('haettu data kun uusi kirja lisätty/poistettu', d);
            //setAddBook('');
            const series = d.series;
            const books = series.books;
            setBookItems(books);
            setCheckBooks(false);
        }
        else {
                console.log('Aloita lisäämällä kirja');
                setCheckBooks(true);
            }
        
        }
            if (addBook === false) {
                fetchBooks();
            }
        
    }, [addBook]);

    return(
        <div className="serie-container">
        <div className="header-row">
             <div className="btn-back">
                <button onClick={() => navigate("/Sarjat")}>Palaa takaisin</button>
            </div>
            <div className="serie-column">
                <h1 className="serieName-header">{serie}</h1>
                <h3>{desc}</h3>
            </div>
        </div>
        <div className="add-book-container">
        { addBook ? <button className="btn-cancel-book" onClick={() => handleCancelBook()}>Peruuta</button>
        : <button className="btn-add-book" onClick={() => handleAddBook()}>Lisää kirja</button>}
        </div>
        <div>
            {addBook ? <NewBook bookItems={bookItems} handleAddBook={handleAddBook} serieId={id} serie={serie} desc={desc}/> :
             checkBooks ? <p className="add-books-info">Aloita lisäämällä kirja</p> : <BookItems handleAddBook={handleAddBook} bookItems={bookItems}/>}
        </div>
        </div>
    );
}