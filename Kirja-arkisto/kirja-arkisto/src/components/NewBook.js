import React from "react";
import { useState, useEffect} from "react";

export const NewBook = (props) => {

  const { bookItems } = props || [];
  const { handleAddBook } = props;
  const serie_id = props.serieId;
  const serie = props.serie;
  const desc = props.desc;
  

  // dropdown items for (kirjan kunto)
  const classificationList = ["Valitse", 1, 2, 3, 4, 5]; 
  const [error, setError] = useState(false);
  const [lastAddedBookId, setLastAddedBookId] = useState(); 


    // initial values for the form
    const [bookData, setBookData] = useState({
        name: "",
        orderNum: bookItems.length > 0 ? Math.max(...bookItems.map(item => item.orderNum)) + 1 : 1,
        etukansikuva: null,
        takakansikuva: null,
        lisakuva1: null,
        hankintahinta: 0,
        hankintaAika: "",
        kuvausteksti: "",
        author: "",
        piirtajat: "",
        ensipainosvuosi: 2000,
        painos: 1,
        condition: 0,
        //serie_id: serie_id
      });

      const [booksPost, setBooksPost] = useState([]); // for posting books
      const [addPressed, setAddPressed] = useState(false);
      const [query, setQuery] = useState(false);

    
  // when add pressed
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('bookdata', bookData);
    setBooksPost(bookData);
    
    setAddPressed(true);
  }

 
// if input fields are ok, set values in state
const handleChange = (event) => {
  const target = event.target;
  const name = target.name;
  const value = target.value;
  if (value.length >= 51) {
    setError(true);
  }
  else {
    setError(false);
    setBookData({
      ...bookData,
      [name]: value,
      //serie_id: serie_id,
      condition: name === "condition" ? value : bookData.condition
    });
  }
    
}

// Adding front book picture
const handleBookFrontChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    console.log(reader.result);
    setBookData({
      ...bookData,
      etukansikuva: reader.result,
    });
  };
};

// Adding back book picture
const handleBookBackChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    console.log(reader.result);
    setBookData({
      ...bookData,
      takakansikuva: reader.result,
    });
  };
};

// Adding side book picture
const handleBookSideChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    console.log(reader.result);
    setBookData({
      ...bookData,
      lisakuva1: reader.result,
    });
  };
};



// mut perjasttees siin pitää eka luoda kirja sitä api/books kautta 
// ja sit tehä put kutsu toho sarjaan ja laittaa sinne sen kirjan objectid pelkästää
/*
  // post book
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
      postData("http://localhost:5000/api/books/", booksPost)
      .then((data) => {
        console.log(data);
        //get activate
        setQuery(true);
      })
    }
    }, [addPressed]);
    */

    //post book, toimii
    if (addPressed) {
      postData("http://localhost:5000/api/books/", booksPost)
        .then((data) => {
          console.log('data.newBookId',data.newBookId);
          setLastAddedBookId(data.newBookId);
          console.log('postattu data', data);
          setQuery(true); // activate put
        })
    }
    async function postData(url = '', data) {
      const { etukansikuva, takakansikuva, lisakuva1 } = bookData;
      const requestBody = Object.assign(data, { etukansikuva, takakansikuva, lisakuva1});
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
        body: JSON.stringify(requestBody)
      });
      setAddPressed(false);
      const responseData = await response.json();
      const newBookId = responseData._id;
      return { response, newBookId };    
    }



    // put series
    useEffect(() => {
      console.log('lastaddendbookid', lastAddedBookId);
      async function updatePost() {
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: serie, description: desc, lastAddedBookId })
        };
        const response = await fetch('http://localhost:5000/api/series/' + serie_id, requestOptions);
        const data = await response.json();
        console.log('putattu data', data);
      
        // Update series with new book ID
        const updatedSeries = data.series;
        updatedSeries.books.push(lastAddedBookId);
      
        // PUT updated series with new book ID to the backend
        const updateSeriesRequestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSeries)
        };
        const updateSeriesResponse = await fetch('http://localhost:5000/api/series/' + serie_id, updateSeriesRequestOptions);
        const updateSeriesData = await updateSeriesResponse.json();
        console.log('updated series data', updateSeriesData);
      
        // set books state added in Sarjat2 component
        handleAddBook(true);
        setQuery(false);
      }
      if (query) {
        updatePost();
      }
  }, [query]);


 
/*
     // get books
     useEffect(() => {
      const fetchBooks = async () => {
          let response = await fetch("http://localhost:5000/api/books");
          let d = await response.json();
          console.log('haetaan dataa NewBookissa', d);


          // set books state added in Kirjasto2 component
          handleAddBook(true);
          setQuery(false);
      }
      if (query) {
          fetchBooks();
      }
  }, [query]);

  */
 
  return (
    <div>
      <form className="Add-book-form" onSubmit={handleSubmit}>
        <p>{error ? 'Nimen pituus max 50 merkkiä' : ''}</p>
        <label htmlFor="nimi">Nimi:</label>
        <input type="text" name="name" id="nimi" maxLength="51" value={bookData.name} onChange={handleChange} required/><br/>

        <label htmlFor="kirjailija">Kirjailija:</label>
        <input type="text" name="author" id="kirjailija" value={bookData.author} onChange={handleChange} /><br/>

      
        <label htmlFor="kuntoluokka">Kuntoluokka (1 = Heikko, 5 = Hyvä):</label>
            <select className="select-classifi" name="condition" value={bookData.condition} onChange={handleChange}>
             {classificationList.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}

            </select>

            
        <label htmlFor="etukansikuva">Etukansikuva (png, jpeg):</label>
        <input type="file" accept="image/png, image/jpeg" name="etukansikuva" id="etukansikuva" onChange={handleBookFrontChange}/><br/>
        {/*{bookData.etukansikuva == "" || bookData.etukansikuva == null ? "" : <img width={100} height={100} src={bookData.etukansikuva} />}*/}

        <label htmlFor="takakansikuva">Takakansikuva (png, jpeg):</label>
        <input type="file" accept="image/png, image/jpeg" name="takakansikuva" id="takakansikuva" onChange={handleBookBackChange} /><br/>
        {/*{bookData.takakansikuva == "" || bookData.takakansikuva == null ? "" : <img width={100} height={100} src={bookData.takakansikuva} />}*/}

        <label htmlFor="lisakuva1">Lisäkuva sivusta (png, jpeg):</label>
        <input type="file" accept="image/png, image/jpeg" id="lisakuva1" name="lisakuva1" onChange={handleBookSideChange}/><br />
        {/*{bookData.lisakuva1 == "" || bookData.lisakuva1 == null ? "" : <img width={100} height={100} src={bookData.lisakuva1} />}*/}

        <label htmlFor="jarjestysnumero">Järjestysnumero sarjassa:</label>
        <input type="number" min="1" name="orderNum" id="jarjestysnumero" value={bookData.orderNum} onChange={handleChange}/>

        <label htmlFor="hankintahinta">Hankintahinta:</label>
        <input type="number" min="0" id="hankintahinta" name="hankintahinta" value={bookData.hankintahinta} onChange={handleChange}/><br />

        <label htmlFor="hankintaAika">Hankinta-aika:</label>
        <input type="date" id="hankintaAika" name="hankintaAika" value={bookData.hankintaAika} onChange={handleChange}/><br />

        <label htmlFor="kuvausteksti">Kuvausteksti:</label>
        <textarea name="kuvausteksti" id="kuvausteksti" value={bookData.kuvausteksti} onChange={handleChange}></textarea><br/>

        <label htmlFor="piirtajat">Piirtäjät:</label>
        <input type="text" name="piirtajat" id="piirtajat" value={bookData.piirtajat} onChange={handleChange} /><br/>

        <label htmlFor="ensipainosvuosi">Ensipainosvuosi:</label>
        <input type="number" min="1" name="ensipainosvuosi" id="ensipainosvuosi" value={bookData.ensipainosvuosi} onChange={handleChange} /><br/>

        <label htmlFor="painos">Painos:</label>
        <input type="number" min="1" name="painos" id="painos" value={bookData.painos} onChange={handleChange} /><br/>
        
        <input className="btn-submit-book" type="submit" value="Lisää" />
      </form>
    </div>
  );
}