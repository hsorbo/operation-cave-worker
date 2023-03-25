console.log("hello world");

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function readWithTimeout(reader, timeout) {
    const timer = setTimeout(() => {
      reader.releaseLock();
    }, timeout);
    const result = await reader.read();
    clearTimeout(timer);
    return result;
  }


function concat(arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
      totalLength += arr.length;
    }
    let result = new Uint8Array(totalLength);
    let offset = 0;
    for (let arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

async function mnemo_import (port) {
    await port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        bufferSize: 8192
    });
    
    const date = new Date();
    const data = new Uint8Array([
        0x43,
        date.getFullYear() - 2000,
        date.getMonth()+1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()]); 
    
    console.log("writing");
    const writer = port.writable.getWriter();
    for (const x of data) {
        await writer.write(new Uint8Array([x]));
        await sleep(100);
    }
    writer.releaseLock();

    console.log("reading...");
    const reader = port.readable.getReader();
    let max = 1000;
    const chunks = [];
    while (true) {
        max--;
        if (max == 0) {
            throw Error("Probably deadlocked");
        }
        try {
            const { value, done } = await readWithTimeout(reader, 1000);
            chunks.push(value);
            if (done) {
                break;
            }    
        }
        catch {
            //TODO: Dirty to assume done here....
            break;
        }
        
        await sleep(100);
    }

    reader.releaseLock();
    return concat(chunks);
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#button1').addEventListener('click', async () => {
        if (!"serial" in navigator)
        {
            throw Error("Web serial not supported, use Kråom år Edj");
        }
        const filters = [
            { usbVendorId: 1240, usbProductId: 221 },
          ];
          
       const mnemo_port = await navigator.serial.requestPort({ filters });
        

        //const ports = await navigator.serial.getPorts();
        //console.log(`Found ${ports.length} potential ports`);

        // const mnemo_port = ports.find(port => {
        //     console.log("banan");
        //     const info = port.getInfo();
        //     return info.usbProductId == 221 && info.usbVendorId == 1240;
        //   });
        
        if (mnemo_port === undefined) {
            throw Error("mnemo not found");
        }
        const survey_data = await mnemo_import(mnemo_port);

        var textbox = document.getElementById("dump");
        textbox.value = survey_data.toString();

    });
});