import React, { useState } from "react"
import { Link, useParams } from "react-router-dom";
import { surveyListFromByteArray, dmpFromByteArray, ShotType, Survey, Direction } from 'mnemo-dmp';
import { Import, SurveyStorage } from "../common";

class EditSurvey {
    survey: Survey;
    importId: number;
    surveyId: number;
    comments: string[];
    constructor(importId : number, surveyId : number, survey: Survey, comments: string[]) {
        this.survey = survey;
        this.comments = comments;
        this.surveyId = surveyId;
        this.importId = importId;
    }
}

function RenderSurvey({ survey, setSurvey }: { survey: EditSurvey, setSurvey: React.Dispatch<React.SetStateAction<EditSurvey>> }): JSX.Element  {
    console.log("RenderSurvey");
    const [direction, setDirection] = useState(survey.survey.direction);
    const updateComment = (i: number, s: string) => {
        setSurvey(old => {
            const newComments = [...old.comments];
            newComments[i] = s;
            const changed = { ...old, comments: newComments }
            //console.log(JSON.stringify(changed.comments, null, 2));
            SurveyStorage.setComments(survey.importId, survey.surveyId, changed.comments);
            return changed;
        })
    }
    //console.log(`direction: ${direction}}`);
    // const [text, setText] = useState(SurveyStorage.getComment(0, 0, i));
    //SurveyStorage.setComment(0, 0, i, e.target.value)
    return (<div className="list-group col-lg">
        <p>{survey.survey.date.toTimeString()}</p>
        <div className="text-center">
            <div className="btn-group col-2 btn-group-sm" role="group" aria-label="Basic example">
                <input
                    type="radio"
                    className="btn-check "
                    id="btnradio1"
                    onChange={() => { setDirection(Direction.In) }}
                    checked={direction == Direction.In} />
                <label className="btn btn-outline-primary" htmlFor="btnradio1">IN</label>
                <input
                    type="radio"
                    className="btn-check"
                    id="btnradio2"
                    readOnly={true}
                    onChange={() => { setDirection(Direction.Out) }}
                    checked={direction == Direction.Out}
                />
                <label className="btn btn-outline-primary" htmlFor="btnradio2">OUT</label>
            </div>
        </div>
        <br />

        {survey.survey.shots.filter(x => x.type != ShotType.CSA).map((shot, i) => {
            // style={{ "border": "1px solid red" }}
            return (
                <div key={i}>
                    <li className="list-group-item" >
                        <div className="row align-items-stretch">
                            <div className="col-md-1 bg-primary">
                                <div className="row">
                                    <div className="col fw-bold" >#{i + 1}</div>
                                </div>
                            </div>
                            <textarea
                                className="form-control col-md"
                                style={{ "resize": "none", "borderRadius": "0px" }}
                                onChange={e => updateComment(i, e.target.value)}
                                rows={3}
                                value={survey.comments[i]}
                            />
                        </div>
                    </li>
                    {
                        shot.type != ShotType.EOC &&
                        <li className="list-group-item list-group-item-secondary d-flex justify-content-between align-items-start">
                            <div className="container text-center">
                                <div className="row">
                                    {/* <div className="col-sm">Shot {i + 1} -&gt; {i + 2}</div> */}
                                    <div className="col-sm small">Heading {shot.head_in}/{shot.head_out}</div>
                                    <div className="col-sm small">Depth {shot.depth_in}/{shot.depth_out}</div>
                                    <div className="col-sm small">Length {shot.length}m</div>
                                </div>
                            </div>
                        </li>
                    }
                </div>
            )
        })}
    </div>)
}

export const MnemoDump = ({imports} : {imports : Import[]}) => {
    const { id, surveyNumber } = useParams();
    const surveyNumberInt = Number(surveyNumber);

    function downloadDmp(id: string | undefined) {
        if (id === undefined) return;
        const imports = SurveyStorage.getImports();
        const imp = imports.find(i => i.id === Number(id));
        if (imp === undefined) return;
        const fileContent = dmpFromByteArray(Uint8Array.from(imp.data));
        var bb = new Blob([fileContent], { type: 'text/plain' });
        var a = document.createElement('a');
        a.download = `${imp?.date} ${imp?.location} ${imp?.surveryors}.dmp`;
        a.href = window.URL.createObjectURL(bb);
        a.click();
    }

   
    const imp = imports.find(i => i.id === Number(id));
    if (imp === undefined) {
        return (<h1>Dump {id} not found</h1>)
    }

    const surveyList = surveyListFromByteArray(Uint8Array.from(imp.data));
      
    function downloadComments(id: string | undefined) {
        let txt = '';
        surveyList.forEach((x, idx) => {
            txt += `${x.name}${idx}\n`;
            const banan = SurveyStorage.getComments(Number(id), idx);
            banan.forEach((comment, station) => {
                if (comment === "") return;
                txt += `Station #${station + 1}: ${comment}\n`;
            });
            txt += '\n';
        });
        var bb = new Blob([txt], { type: 'text/plain' });
        var a = document.createElement('a');
        a.download = `${imp?.date} ${imp?.location} ${imp?.surveryors}.txt`;
        a.href = window.URL.createObjectURL(bb);
        a.click();
    }


    try {
        const s = surveyList[surveyNumberInt];

        function boom() {
            let comments = SurveyStorage.getComments(imp!.id, surveyNumberInt);
            if (comments.length != s.shots.length) {
                comments = new Array(s.shots.length).fill("");
            }
            return new EditSurvey(imp!.id, surveyNumberInt, s, comments);
        }

        const [survey, setSurvey] = useState(boom());
        React.useEffect(() => {
            console.log("survey changed");
            setSurvey(boom());
        }, [surveyNumber]);
        
        return (
            <div className="text-center">
                <h1>Import #{id}</h1>
                <p>Imported {imp.date.toString()}</p>
                <button className="btn btn-primary btn-block btn-sm justify-content-center" onClick={() => downloadDmp(id)}>Download as dmp</button>
                <button className="btn btn-primary btn-block btn-sm justify-content-center" onClick={() => downloadComments(id)}>Download comments</button>
                {surveyList.length < 1 && <h2>No surveys found</h2>}
                <nav className="nav nav-pills justify-content-center">
                    {surveyList.map((survey, i) => (
                        <Link key={survey.date.toString()}
                            className={`nav-link ${i == Number(surveyNumber) ? "active" : ""}`}
                            aria-current="page" to={"/dump/" + id + "/" + i}>{survey.name}{i}</Link>),)}
                </nav>
                <RenderSurvey survey={survey} setSurvey={setSurvey} />
            </div >
        )
    }
    catch (e) {
        console.error(e);
        return (
            <>
                <h1>Dump {id} is not a valid dmp file</h1>
                <div className="alert alert-danger" role="alert">
                    {JSON.stringify(e)}
                </div>
            </>)
    }
}