import React, { ChangeEventHandler, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
global.window.Buffer = Buffer;
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import './scss/styles.scss'
import 'bootstrap';
import { Import } from './pages/import';
import { About } from './pages/about';
import { MnemoDump } from './pages/mnemodump';
import { SurveyStorage } from './common';

const Navbar = () => {
    const imports : any = [];
    SurveyStorage.getImports().forEach((data) => {
        imports.push(<li><Link className="dropdown-item" to={'/dump/' + data.id}>{data.date.toString()}</Link></li>)
    });

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Yolo!</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Import</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Imports
                            </a>
                            <ul className="dropdown-menu">
                                {imports}
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled">Disabled</a>
                        </li>
                    </ul>
                    {/* <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form> */}
                </div>
            </div>
        </nav>
    );
}

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
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}