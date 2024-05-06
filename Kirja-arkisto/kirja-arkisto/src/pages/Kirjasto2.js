import { Link, Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";
import '../styles/Kirjasto2.css';
import { useState, useEffect } from'react';
import { SelectBook } from '../components/SelectBook';
import { OwnBookItems } from "../components/OwnBookItems";
import { useSelector } from "react-redux";


    const Kirjasto2 = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { serie, desc, id } = useParams();
    const navigate = useNavigate();

    const [addBook, setAddBook] = useState('');
    const [bookItems, setBookItems] = useState([]) // for passing bookItems to other components
    const [checkBooks, setCheckBooks] = useState('');
    const [bookSearch, setBookSearch] = useState('');

    

    const [getAllBooks, setGetAllBooks] = useState([]);

    
    // show new book form
    const handleAddBook = (state) => {
        if (state === true) {
            setAddBook(false);  
        }
        else {
             // activate get
            setAddBook(true);
        }
    }

    const handleCancelBook = () => {
        setAddBook('');
    }

     // get books when page is loaded
     useEffect(() => {
        const fetchBooks = async () => {
            console.log(id)
            let response = await fetch("http://localhost:5000/api/library/" + currentUser.id);
            let d = await response.json();
            console.log("moi",id)
        if (d) {
            console.log('haettu data:', d);
            const series = d.user.series.find((s) => s.name === serie);
            if(series){
                setBookItems(series.books)
                setCheckBooks(false);
            }
            else{
                setCheckBooks(true)
            }
            
        }
        else {
            console.log('Aloita lisäämällä kirja');
            setCheckBooks(true);
        }
    }
            fetchBooks();      
    }, []);


    // get books when valitse kirja painettu (addbook === true)
    useEffect(() => {
        const fetchBooks = async () => {
            let response = await fetch("http://localhost:5000/api/books/");
            let d = await response.json();
            console.log("Kaikki kirjat",d)
        if (d) {
            setGetAllBooks(d);
           
            console.log('all books taulukko', getAllBooks);
        }
        else {
            console.log('Aloita lisäämällä kirja');
            setCheckBooks(true);
        }
    }
            if (addBook) {
                fetchBooks(); 
            }
                 
    }, [addBook]);


    // get books when new book is added or removed
    useEffect(() => {
        const fetchBooks = async () => {
            let response = await fetch("http://localhost:5000/api/library/" + currentUser.id);
            let d = await response.json();
        if (d) {
            console.log('haettu data:', d);
            console.log("moi")
            const series = d.user.series.find((s) => s.name === serie);
            if(series){
                setBookItems(series.books)
                setCheckBooks(false);
            }
            else{
                setCheckBooks(true)
            }
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


    //kirjojen haku ---------------------------------------------
    const [search, setSearch] = useState(false);
    const handleClick = () =>{
        setSearch(!search);
    }

    useEffect(() =>{
        const fetchSeries = async () => {
            let response = await fetch("http://localhost:5000/api/library/"+currentUser.id);
            let d = await response.json();
            console.log('haettu data hausta:', d.user.series); 
            const series = d.user.series.find((s) => s.name === serie);

            console.log("valitun sarjan nimi",serie)
            const filteredSeries = d.user.series.filter((s) => s.name === serie);
            console.log("sarjan nimi",filteredSeries)
            const filteredBooks = filteredSeries.flatMap((s) => s.books.filter((b) => b.name === bookSearch));

            console.log("etittävä kirja", filteredBooks)
            if(filteredBooks.length === 0){
                setBookItems(series.books);
                return;
            }
            setBookItems(filteredBooks)
            
            
        }
        fetchSeries();  
    },[search])
//----------------------------------------------------------------------------------------------------
    return(
        <div className="serie-container">
        <div className="header-row">
             <div className="btn-back">
                <button onClick={() => navigate("/Kirjasto")}>Palaa takaisin</button>
            </div>
            <div className="serie-column">
                <h1 className="serieName-header">{serie}</h1>
                <h3>{desc}</h3>
            </div>
            
            <div className="search-box">
                <input type="search" placeholder="Hae kirjaa..." value={bookSearch} onChange={(e) => setBookSearch(e.target.value)}></input>
                <button className="btn-search" onClick={() => handleClick()}>Hae</button>
            </div>
        </div>
        <div className="add-book-container">
        { addBook ? <button className="btn-cancel-book" onClick={() => handleCancelBook()}>Peruuta</button>
        : <button className="btn-add-book" onClick={() => handleAddBook()}>Tuo kirja</button>}
        </div>
        <div>
            {addBook ? <SelectBook user={currentUser.id} allBooks={getAllBooks} handleAddBook={handleAddBook} serieId={id} serie={serie} desc={desc}/> :
             checkBooks ? <p className="add-books-info">Aloita lisäämällä kirja</p> : <OwnBookItems serieId={id} handleAddBook={handleAddBook} bookItems={bookItems}/>}
        </div>
        </div>
    );
}

export default Kirjasto2;