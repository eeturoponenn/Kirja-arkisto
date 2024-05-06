import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Logo from '../assets/book_image3.jpg';
import ReorderIcon from "@mui/icons-material/Reorder";
import '../styles/Navbar.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { logout } from "../actions/auth";
import { clearMessage } from "../actions/messages";

function Navbar() {

    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    }

    const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();

  useEffect(() => {
    if (["/kirjaudu", "/rekisteroidy"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="navbar">
        <div className="leftSide" id={openLinks ? "open" : "close"}>
            <img src={Logo} />
            <div className="hiddenLinks">
                <Link to="/"> Etusivu</Link>
                <Link to="/sarjat"> Sarjat </Link>
                
                {currentUser && (
                    <Link to="/kirjasto"> Oma kirjasto</Link>
                )}
                
                {currentUser ? (
                    <><Link to="/profiili">Oma Profiili</Link><a href="/" className="nav-link" onClick={logOut}>Kirjaudu Ulos</a></>
                ) : (
                    <><Link to="/kirjaudu"> Kirjaudu </Link>
                    <Link to="/rekisteroidy"> Rekisteroidy </Link></>
                )}
                
            </div>
        </div>
        <div className="rightSide">
        <Link to="/"> Etusivu</Link>
                <Link to="/sarjat"> Sarjat </Link>
                {currentUser && (
                    <Link to="/kirjasto"> Oma kirjasto</Link>
                )}
                
                {currentUser ? (
                    <><Link to="/profiili">Oma Profiili</Link><a href="/" className="nav-link" onClick={logOut}>Kirjaudu Ulos</a></>
                ) : (
                    <><Link to="/kirjaudu"> Kirjaudu </Link>
                    <Link to="/rekisteroidy"> Rekisteroidy </Link></>
                )}
            <button onClick={toggleNavbar}>{ <ReorderIcon />}</button>
        </div>
    </div>
  )
}

export default Navbar