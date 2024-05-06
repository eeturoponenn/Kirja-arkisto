import React from "react";
import { useState, useEffect} from "react";
export const SelectBook = (props) => {

  const allBooks = props.allBooks; // get all books
  const user = props.user;


  const { handleAddBook } = props;
  const serie_id = props.serieId;
  const serie = props.serie;
  const desc = props.desc;

  const [bookData, setBookData] = useState([]);


  const [error, setError] = useState(false);
  const [lastAddedBookId, setLastAddedBookId] = useState(); 
  const [newData, setNewData] = useState();


      const [booksPost, setBooksPost] = useState([]); // for posting books
      const [addPressed, setAddPressed] = useState(false);
      const [query, setQuery] = useState(false);

  
  // put series
  useEffect(() => {
    
    console.log('lastaddendbookid', bookData);
    async function updatePost() {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seriesId: serie_id, // The id of the series object to update
          bookData: { name: newData.name, author: newData.author, condition: newData.condition, orderNum: newData.orderNum, etukansikuva: newData.etukansikuva, takakansikuva: newData.takakansikuva, lisakuva1: newData.lisakuva1, hankintahinta: newData.hankintahinta, hankintaAika: newData.hankintaAika, kuvausteksti: newData.kuvausteksti, piirtaja: newData.piirtaja, ensipainosvuosi: newData.ensipainosvuosi, painos: newData.painos} // The new book data to add to the series
        })
      };
      
      const response = await fetch('http://localhost:5000/api/library/' + user, requestOptions);
      const data = await response.json();
      console.log('putattu data', data);

     
      handleAddBook(true);
      setQuery(false);
    }
    if (query) {
      updatePost();
    }
  }, [query]);

      // useEffect(() => {
      //   async function updatePost() {
      //     const requestOptions = {
      //       method: 'PATCH',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ bookData: bookData }) // book data = bookID
      //     };
      //     const response = await fetch('http://localhost:5000/api/library/' + user, requestOptions);
      //     const data = await response.json();
      //     console.log('putattu data', data);
      //   }
        
      //   if (query) {
      //     updatePost();
      //     setQuery(false);
      //   }
      // }, [query]);

    
  // when add pressed
  const handleSubmit = (event) => {
    event.preventDefault();
    // activate put
    const data = allBooks.find((s) => s.name === bookData);
    setNewData(data)
 
    setQuery(true);
    //setBooksPost(bookData);
    setAddPressed(true);
  }

 

  const handleChange = (event) => {
    
    setBookData(event.target.value);
    

  }

 
  return (
    <div>
      <form className="Add-book-form" onSubmit={handleSubmit}>
        <label htmlFor="">Kirja:</label>
          <select className="select-book" name="books" value={bookData.name} onChange={handleChange}>
          <option>--Valitse--</option>
             {allBooks.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))}
          </select>
        <input className="btn-submit-book" type="submit" value="Lisää" />
      </form>
    </div>
  );
}