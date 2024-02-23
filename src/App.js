import logo from './logo.svg';
import './App.css';
import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import page components
import { Home } from './pages/home/home.js';
import { Contact } from './pages/contact/contact';
import { Console } from './pages/console/console.js';
import { Music } from './pages/music/music';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { GetStarted } from './pages/getStarted/getStarted';
import {Mapper} from './pages/map/map.js';
import {Request} from './pages/console/request'
import {Supplier} from './pages/console/supplier'
import {Account} from './pages/account/account'

import { useLocation } from 'react-router-dom/dist';
import { Nav } from './pages/home/nav';

function App() {


  return (
    <div className="App">
      
        <Router>    
        <Nav style={{zindex:'5'}}/>   
               
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/console' element={<Console />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/login' element={<Login />} />
                <Route path='/getStarted' element={<GetStarted />} />
                <Route path='/map' element={<Mapper />} />
                <Route path='/supplier' element={<Supplier />} />
                <Route path='/account' element={<Account />} />
                <Route path='/request' element={<Request />} />
                <Route path="*" element={<NotFound />} />

            </Routes>

        </Router>
    </div>
  );
}

export default App;
