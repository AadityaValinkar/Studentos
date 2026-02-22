const https = require('https');

https.get('https://success.cedokconnect.com/api/customer', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Is Array?", Array.isArray(json));
            if (Array.isArray(json)) {
                console.log("Total Records:", json.length);
                console.log("Sample 1:", JSON.stringify(json[0], null, 2));
            } else {
                console.log("Response Type:", typeof json);
                console.log("Snippet:", JSON.stringify(json).substring(0, 300));
            }
        } catch (e) {
            console.log("Parse Error Raw:", data.substring(0, 300));
        }
    });
}).on('error', (e) => {
    console.error("Network Error:", e);
});
