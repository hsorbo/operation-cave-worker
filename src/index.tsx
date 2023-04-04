import React from 'react';
import { createRoot } from 'react-dom/client';
import { mnemo_import, can_import } from './mnemo';
import { Buffer } from 'buffer';
global.window.Buffer = Buffer;
import { dmpToByteArray, surveyListFromByteArray } from 'mnemo-dmp';

import './scss/styles.scss'
import 'bootstrap';

const importer = async () => {
    try {
        if (!can_import()) {
            throw Error("Web serial not supported, use Kråom år Edj");
        }
        const survey_data = await mnemo_import(s => { console.log(s); });
        var textbox = document.getElementById("dump") as HTMLTextAreaElement || null;
        textbox!.value = survey_data.toString();
    }
    catch (e) {
        if (e instanceof Error) {
            //if (e instanceof NotFoundError) {
            if (e.name === 'NotFoundError') {
                return;
            }
        }
        alert(e);
    }
}

const App = () => {
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            <button type="button" className="btn btn-secondary btn-lg btn-block">Block level button</button>
            <button className="btn btn-primary btn-block btn-lg" onClick={importer}>Import</button>
            <div className="btn-group">
                <button type="button" className="btn btn-danger">Action</button>
                <button type="button" className="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                </ul>
            </div>
            <textarea className="w-100 p-3" id="dump" cols={80} rows={25} wrap="hard"></textarea>
            <textarea className="w-100 p-3" id="pung" cols={80} rows={25} wrap="hard"></textarea>
        </div>
    );
}

const root = document.getElementById('root');

if (root) {
    createRoot(root).render(<App />);
}



//old stuff, cleanup later


// document.addEventListener('DOMContentLoaded', function () {
//     const dmpA = document.getElementById("dump") as HTMLTextAreaElement || null;
//     const dmpB = document.querySelector('#dump');

//     const pungA = document.getElementById("pung") as HTMLTextAreaElement || null;
//     const pungB = document.querySelector('#pung');


//     dmpB!.addEventListener('input', async () => {
//         try {
//             const dmp = dmpA!.value;
//             const bytes = Uint8Array.from(dmp.split(',').map(x => parseInt(x, 10)));
//             pungA!.textContent = JSON.stringify(surveyListFromByteArray(bytes));
//             //pungA!.textContent = JSON.stringify(surveyListFromByteArray(dmpToByteArray(dmpA!.value)));
//         }
//         catch (e) {
//             if (e instanceof Error) {
//                 pungA!.textContent = e.message;
//             }
//             else {
//                 pungA!.textContent = "error";
//             }

//         }
//     });
   
// });