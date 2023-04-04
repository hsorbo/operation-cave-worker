import React from "react"
import { Link, useParams } from "react-router-dom";
import { surveyListFromByteArray } from 'mnemo-dmp';

export const MnemoDump = () => {
    const { id } = useParams();
    const raw = window.localStorage.getItem(`raw_import_id_${id}`);
    if (raw === null) {
        return (
            <div>
            <h1>Dump {id} not found</h1>
            <Link to='/'>Import</Link> 
        </div>
    
        )
    }
    else {
        const kake : Uint8Array = JSON.parse(raw);
        const surveyList = surveyListFromByteArray(kake);
        return (
            <div>
                <h1>Dump {id}</h1>
                <Link to='/'>Import</Link> 
                <br/>
                <pre id="json">{JSON.stringify(surveyList, null, 2)}</pre>
            </div>
        )
    }

    
}