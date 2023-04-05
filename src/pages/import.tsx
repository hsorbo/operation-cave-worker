import React from 'react';
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";

import { mnemo_import, can_import } from '../mnemo';
import { dmpToByteArray } from 'mnemo-dmp';
import { ImportType, SurveyStorage } from '../common';

const MyComponent = () => {
    const ref = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();

    const handleClick = () => {
        ref!.current!.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            return;
        }
        try
        {
            const buf = await file.arrayBuffer();
            const arr = dmpToByteArray(new TextDecoder().decode(buf));
            const imported = SurveyStorage.addImportData(ImportType.Dmp, Array.from(arr));
            navigate(`/dump/${imported.id}`);
        }
        catch(e)
        {
            alert(e);
        }
    }
    return (
        <>
            <button className="btn btn-primary btn-block" onClick={handleClick}>Import from dmp-file</button>
            <input ref={ref} type="file" accept=".dmp" style={{ display: 'none' }} onChange={handleFileChange} />
        </>
    )
}

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

export const Import = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            {/* <Navbar /> */}
            <div className="card text-center">
                <div className="card-body">
                    <h5 className="card-title">Import survey data</h5>
                    <p className="card-text">Import data from dmp-file or MNemo if your browser supports it (Chrome)</p>
                    <div className="d-grid gap-2 col-6 mx-auto">
                        <a href="#" className="btn btn-primary btn-block" onClick={importer}>Import from MNemo</a>
                        <MyComponent />
                    </div>
                </div>
            </div>
            {/* <Demo /> */}
            {/* <textarea className="w-100 p-3" id="dump" cols={80} rows={25} wrap="hard"></textarea>
            <textarea className="w-100 p-3" id="pung" cols={80} rows={25} wrap="hard"></textarea> */}
        </div>
    );
}

