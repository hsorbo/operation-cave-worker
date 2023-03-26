function sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function readWithTimeout(reader: ReadableStreamDefaultReader<Uint8Array>, timeout: number) {
    const timer = setTimeout(() => {
        reader.releaseLock();
    }, timeout);
    const result = await reader.read();
    clearTimeout(timer);
    return result;
}


function concat(arrays: Uint8Array[]) {
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

export function can_import() {
    return "serial" in navigator;
}

export async function mnemo_import(callback: (s:string) => void) {
    const filters = [
        { usbVendorId: 1240, usbProductId: 221 },
    ];

    const port = await navigator.serial.requestPort({ filters });

    //const ports = await navigator.serial.getPorts();
    //console.log(`Found ${ports.length} potential ports`);

    // const mnemo_port = ports.find(port => {
    //     console.log("banan");
    //     const info = port.getInfo();
    //     return info.usbProductId == 221 && info.usbVendorId == 1240;
    //   });

    if (port === undefined) {
        throw Error("mnemo not found");
    }
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
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()]);

    callback("writing");

    if (port.writable === null) {
        throw Error("Can't write to port");
    }

    const writer = port.writable.getWriter();
    for (const x of data) {
        await writer.write(new Uint8Array([x]));
        await sleep(100);
    }
    writer.releaseLock();

    callback("reading...");
    if (port.readable === null) {
        throw Error("Can't read from port");
    }

    const reader = port.readable.getReader();
    let max = 1000;
    let read = 0;
    const chunks = [];
    while (true) {
        max--;
        if (max == 0) {
            throw Error("Probably deadlocked");
        }
        try {
            const { value, done } = await readWithTimeout(reader, 1000);
            if (value != null) {
                chunks.push(value);
                read += value.length;
            }
            if (done) {
                break;
            }
            callback(`read ${read} bytes`)
        }
        catch {
            //TODO: Dirty to assume done here....
            break;
        }

        await sleep(100);
    }
    callback("done reading");

    reader.releaseLock();
    return concat(chunks);
}
