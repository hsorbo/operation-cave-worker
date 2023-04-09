import React from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
global.window.Buffer = Buffer;
import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router-dom';

import './scss/styles.scss'
import 'bootstrap';
import { Import } from './pages/import';
import { About } from './pages/about';
import { MnemoDump } from './pages/mnemodump';
import { Navbar } from './components/navbar';



export const App = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Import />} />
                <Route path="/books" element={<h1>kake</h1>} />
                <Route path="/about" element={<About />} />
                <Route path="/dump/:id" element={<MnemoDump />} />
            </Routes>
        </div>
    );
}

const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <HashRouter>
                <App />
            </HashRouter>
        </React.StrictMode>
    );
}