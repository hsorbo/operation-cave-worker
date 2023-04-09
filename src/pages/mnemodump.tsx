import React from "react"
import { useParams } from "react-router-dom";
import { surveyListFromByteArray, dmpFromByteArray } from 'mnemo-dmp';
import { SurveyStorage } from "../common";

export const MnemoDump = () => {

    function downloadDmp(id: string | undefined) {
        if (id === undefined) return;
        const imports = SurveyStorage.getImports();
        const imp = imports.find(i => i.id === Number(id));
        if (imp === undefined) return;
        const fileContent = dmpFromByteArray(Uint8Array.from(imp.data));
        var bb = new Blob([fileContent ], { type: 'text/plain' });
        var a = document.createElement('a');
        a.download = 'export.dmp';
        a.href = window.URL.createObjectURL(bb);
        a.click();
    }

    const { id } = useParams();
    const imports = SurveyStorage.getImports();
    const imp = imports.find(i => i.id === Number(id));
    if (imp === undefined) {
        return (<h1>Dump {id} not found</h1>)
    }
    else {
        const surveyList = surveyListFromByteArray(Uint8Array.from(imp.data));
        return (
            <div>
                <h1>Dump {id}</h1>
                <button className="btn btn-primary btn-block" onClick={() => downloadDmp(id)}>Download as dmp</button>
                <pre id="json">{JSON.stringify(surveyList, null, 2)}</pre>
                
            </div>
        )
    }


}