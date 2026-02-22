const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const validNodes = json.nodes
                .filter(n => n.data && n.data.label && n.data.label.trim() !== "")
                .map(n => ({ id: n.id, label: n.data.label, type: n.type, y: n.position.y }));

            validNodes.sort((a, b) => a.y - b.y);

            fs.writeFileSync('test-nodes-filtered.json', JSON.stringify(validNodes.slice(0, 10), null, 2));
            console.log(`Found ${validNodes.length} valid nodes. Written top 10 to test-nodes-filtered.json`);
        } catch (e) {
            console.error(e);
        }
    });
});
