import { mnemo_import, can_import } from './mnemo';
// Import our custom CSS
import './scss/styles.scss'
import { Buffer } from 'buffer';
global.window.Buffer = Buffer;
import { from_string } from 'mnemo-dmp';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'




document.addEventListener('DOMContentLoaded', function () {
    const dmpA = document.getElementById("dump") as HTMLTextAreaElement || null;
    const dmpB = document.querySelector('#dump');

    const pungA = document.getElementById("pung") as HTMLTextAreaElement || null;
    const pungB = document.querySelector('#pung');

    dmpB!.addEventListener('input', async () => {
        try {
            pungA!.textContent = JSON.stringify(from_string(dmpA!.value));
        }
        catch(e) {
            pungA!.textContent = "error";
        }
    });

    document.querySelector('#button1')!.addEventListener('click', async () => {

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

    });
});