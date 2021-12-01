
const calendar_days = require("./calendar_days.json");
const wled = require("./wled.json");
const wled_segment_off = require("./wled_segment_off.json");
const wled_segment_candle_effect = require("./wled_segment_candle_effect.json");
const http = require("http");

const run = () => {

    const today = new Date();
    const day = today.getDate(); // 24
    const month = today.getMonth() + 1; // 10 (Month is 0-based, so 10 means 11th Month)

    if (month == 12) {

        const data = JSON.parse(JSON.stringify(wled));

        // reset all
        for (let i = 0; i < 10; i++) {
            const seg = JSON.parse(JSON.stringify(wled_segment_off));
            seg.id = i;
            seg.start = i * 40;
            seg.stop = seg.start + 40;
            data.seg[i] = seg;
        }

        // enable the candle effect until the current day is reached
        for (let i = 0; i < calendar_days.length; i++) {
            const cDay = calendar_days[i];
            if (cDay.day <= day) {
                const seg = JSON.parse(JSON.stringify(wled_segment_candle_effect));
                seg.id = cDay.window - 1;
                seg.start = (cDay.window - 1) * 40;
                seg.stop = seg.start + 40;
                data.seg[cDay.window - 1] = seg;
            }
        }

        const dataStr = JSON.stringify(data);

        console.log(dataStr);

        const options = {
            hostname: "WLED-Fenster-2OG",
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
};

run(); // initially, run it once

setInterval(run, 1000 * 60 * 5); // run again every 5 minutes
