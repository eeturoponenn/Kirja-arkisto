import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";

export const BookItems = (props) => {
  const { bookItems } = props || [];
  const { handleAddBook } = props;
  const [deletePressed, setDeletePressed] = useState(false);
  const [deleteQuery, setDeleteQuery] = useState(false);
  const navigate = useNavigate();
  

  // when Poista pressed
  const handleDelete = (book, event) => {
    event.stopPropagation();
    console.log("bookItems", bookItems)
    console.log("kirja",book)
    //const bookName = bookItems.filter((s) => s.name === )
    if (window.confirm(`Haluatko varmasti poistaa kirjan ${book.name}?`)) {
      setDeletePressed(true);
      setDeleteQuery(book._id);
    } else {
      return;
    }
  }

  // open book 
  const handleOpen = (book) => {
    console.log("handleOpen", book)
    console.log('etukuva', book.etukansikuva)
    navigate({
      pathname: '/kirja',
      search: `?name=${book.name}&author=${book.author}&condition=${book.condition}&etukansikuva=${encodeURIComponent(book.etukansikuva)}&takakansikuva=${encodeURIComponent(book.takakansikuva)}&lisakuva1=${encodeURIComponent(book.lisakuva1)}&hankintahinta=${book.hankintahinta}
      &hankintaAika=${book.hankintaAika}&kuvausteksti=${book.kuvausteksti}&piirtajat=${book.piirtajat}&ensipainosvuosi=${book.ensipainosvuosi}&painos=${book.painos}`
    });

  }
  

  // Delete book
  useEffect(() => {
    const deleteData = async () => {
      let response = await fetch("http://localhost:5000/api/books/" + deleteQuery, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      });
      let d = await response.json();
      console.log('poistettu data:', d);
      setDeletePressed(false);

      //activate get in sarjat2 component
      handleAddBook(true);
    }
    if (deletePressed) {
      handleAddBook(false);
      deleteData();
    }
  }, [deletePressed]);

  return (
    <div className="new-book-container">
      <div className="book-item-container">
        {
          
        }
     {bookItems.sort((a, b) => a.orderNum - b.orderNum).map((item, index) => (
      
      
            <div className="book-item" onClick={() => handleOpen(item)} key={index}>
              <button className="btnDelete" onClick={(event) => handleDelete(item, event)}>Poista</button>
              <div className="book-item-pic" style={{backgroundImage: `url(${item.etukansikuva})`}}></div>
              <div className="book-item-text">
                <p className='name-field'>{item.name}</p>
                <p>Kirjailija: {item.author}</p>
                <p>Kuntoluokka: {item.condition}</p>
                <p>Järjestysnumero: {item.orderNum}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}