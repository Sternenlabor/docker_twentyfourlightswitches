const wled = require("./wled.json");
const wled_segment = require("./wled_segment.json");
const http = require("http");

const colorPerDay = {
    1: {
        window: 1,
        color: [255, 0, 0]
    },
    2: {
        window: 2,
        color: [0, 255, 0]
    },
    3: {
        window: 3,
        color: [0, 0, 255]
    }
};

//START: DEMO CODE
let j = 0;
//END: DEMO CODE

setInterval(() => {

    const today = new Date();
    let day = today.getDate(); // 24
    let month = today.getMonth() + 1; // 10 (Month is 0-based, so 10 means 11th Month)

    //START: DEMO CODE
    month = 12;
    if (++j > 3) {
        j = 1;
    }
    day = j;
    //END: DEMO CODE

    if (month == 12) {

        const data = JSON.parse(JSON.stringify(wled));

        for (i = 0; i < 10; i++) {
            const seg = JSON.parse(JSON.stringify(wled_segment));
            seg.id = i;
            seg.start = i * 40;
            seg.stop = seg.start + 40;
            wled.seg[i] = seg;
        }

        /*
        const seg = JSON.parse(JSON.stringify(wled_segment));
        seg.col[0] = colorPerDay[day].color;
        seg.id = colorPerDay[day].window - 1;
        seg.start = (colorPerDay[day].window - 1) * 40;
        seg.stop = seg.start + 40;
        wled.seg[colorPerDay[day].window - 1] = seg;
        */

        const dataStr = JSON.stringify(data);

        console.log(dataStr);

        const options = {
            hostname: "192.168.200.141",
            port: 80,
            path: "/json/state",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": dataStr.length
            }
        };

        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on("data", d => {
                process.stdout.write(d);
            })
        })

        req.on("error", error => {
            console.error(error);
        })

        req.write(dataStr)
        req.end();
    }

}, 1000);
