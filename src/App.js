import logo from './logo.svg';
import './App.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/home.js';
import { Contact } from './pages/contact/contact';
import { Coding } from './pages/code/code';
import { Music } from './pages/music/music';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { GetStarted } from './pages/getStarted/getStarted';
import {Map} from './pages/map/map'; 

import { useLocation } from 'react-router-dom/dist';
import { Nav } from './pages/home/nav';

function App() {


  return (
    <div className="App">
      
        <Router>    
        <Nav style={{zindex:'5'}}/>   
               
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/coding' element={<Coding />} />
                <Route path='/music' element={<Music />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/login' element={<Login />} />
                <Route path='/getStarted' element={<GetStarted />} />
                <Route path='/map' element={<Map />} />

            </Routes>

        </Router>
    </div>
  );
}

export default App;
