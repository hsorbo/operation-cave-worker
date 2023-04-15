import React from "react"
import { Link, useParams } from "react-router-dom";
import { surveyListFromByteArray, dmpFromByteArray, ShotType, Survey } from 'mnemo-dmp';
import { SurveyStorage } from "../common";

const RenderSurvey = (survey: Survey): JSX.Element => {
    return (
        <div className="list-group col-lg">
            <text>{survey.date.toTimeString()}</text>

            <div className="btn-group col-2 btn-group-sm" role="group" aria-label="Basic example">
                <input type="radio" className="btn-check " name="btnradio" id="btnradio1" autoComplete="off" />
                <label className="btn btn-outline-primary" htmlFor="btnradio1">IN</label>
                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" checked />
                <label className="btn btn-outline-primary" htmlFor="btnradio2">OUT</label>
            </div>
            <br />

            {survey.shots.filter(x => x.type != ShotType.CSA).map((shot, i) => (
                <>
                    <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">#{i + 1}</div>
                        </div>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>

                    </li>
                    {
                        shot.type != ShotType.EOC &&
                        <li className="list-group-item list-group-item-secondary d-flex justify-content-between align-items-start">
                            <div className="container text-center">
                                <div className="row">
                                    {/* <div className="col-sm">Shot {i + 1} -&gt; {i + 2}</div> */}
                                    <div className="col-sm">Heading {shot.head_in}/{shot.head_out}</div>
                                    <div className="col-sm">Depth {shot.depth_in}/{shot.depth_out}</div>
                                    <div className="col-sm">Length {shot.length}m</div>
                                </div>
                            </div>
                        </li>
                    }
                </>

            ))}
        </div>
    )
}

export const MnemoDump = () => {

    function downloadDmp(id: string | undefined) {
        if (id === undefined) return;
        const imports = SurveyStorage.getImports();
        const imp = imports.find(i => i.id === Number(id));
        if (imp === undefined) return;
        const fileContent = dmpFromByteArray(Uint8Array.from(imp.data));
        var bb = new Blob([fileContent], { type: 'text/plain' });
        var a = document.createElement('a');
        a.download = 'export.dmp';
        a.href = window.URL.createObjectURL(bb);
        a.click();
    }

    const { id, surveyNumber } = useParams();
    const imports = SurveyStorage.getImports();
    const imp = imports.find(i => i.id === Number(id));
    if (imp === undefined) {
        return (<h1>Dump {id} not found</h1>)
    }
    else {
        const surveyList = surveyListFromByteArray(Uint8Array.from(imp.data));
        const selectedSurvey = surveyList[Number(surveyNumber)];
        return (
            <div className="text-center">
                <h1>Import #{id}</h1>
                <text>Imported {imp.date.toString()}</text>
                <br/>
                <button className="btn btn-primary btn-block btn-sm justify-content-center" onClick={() => downloadDmp(id)}>Download as dmp</button>
                
                {
                    surveyList.length === 0 ? <h2>No surveys found</h2>
                        : <>
                <nav className="nav nav-tabs justify-content-center">
                    {surveyList.map((survey, i) => (
                        <Link className="nav-link" aria-current="page" to={"/dump/" + id + "/" + i}>BAS{i}</Link>),)}
                </nav>
                {RenderSurvey(selectedSurvey)}
                        </>
                }

            </div >
        )
    }
}