import React from "react"
import { useParams } from "react-router-dom";
import { surveyListFromByteArray } from 'mnemo-dmp';
import { SurveyStorage } from "../common";

export const MnemoDump = () => {
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
                <pre id="json">{JSON.stringify(surveyList, null, 2)}</pre>
            </div>
        )
    }


}