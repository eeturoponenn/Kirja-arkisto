import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Etusivu from './pages/Etusivu';
import Sarjat from './pages/Sarjat';
import { Sarjat2 } from './pages/Sarjat2';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import  Kirjasto  from './pages/Kirjasto';
import  Kirjasto2  from './pages/Kirjasto2';
import "bootstrap/dist/css/bootstrap.min.css";
import Kirjaudu from './pages/Kirjaudu';
import Rekisteroidy from './pages/Rekisteroidy';
import Profile from './pages/Profiili';
import { OmaKirja } from './pages/OmaKirja';
import { Kirja } from './pages/Kirja';

function App() {
    return (
        <div className="App">
                <Navbar />
                    <Routes>
                        <Route path='/' element={<Etusivu />}/>
                        <Route path='/kirjasto' element={<Kirjasto />}/>
                        <Route path='/kirjasto/:serie/:desc/:id' element={<Kirjasto2 />}/>
                        <Route path='/sarjat' element={<Sarjat />}/>
                        <Route path='/sarjat/:serie/:desc/:id' element={<Sarjat2 />}/>
                        <Route path='/kirjaudu' element={<Kirjaudu />}/>
                        <Route path='/rekisteroidy' element={<Rekisteroidy />}/>
                        <Route path='/profiili' element={<Profile />}/>
                        <Route path='/omakirja' element={<OmaKirja />}/>
                        <Route path='/kirja' element={<Kirja />}/>
                    </Routes>
                <Footer />
        </div>
    );
}

export default App;
