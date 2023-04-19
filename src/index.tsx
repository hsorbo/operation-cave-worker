import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
global.window.Buffer = Buffer;
import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router-dom';

import './scss/styles.scss'
import 'bootstrap';
import { DoImport } from './pages/import';
import { About } from './pages/about';
import { MnemoDump } from './pages/mnemodump';
import { Navbar } from './components/navbar';
import { SurveyStorage } from './common';

export const App = () => {
    const [imports, setImport] = useState(SurveyStorage.getImports());
    return (
        <div>
            <Navbar imports={imports} />
            <Routes>
                <Route path="/" element={<DoImport setImport={setImport} />} />
                <Route path="/about" element={<About />} />
                <Route path="/dump/:id/:surveyNumber" element={<MnemoDump />} />
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