// microserviceB/index.js
const express = require('express');
const { URL } = require('url');
const app = express();

app.use(express.json()); // parse JSON bodies

function getHostname(fullUrl) {
    try {
        const parsed = new URL(fullUrl);
        return parsed.hostname;
    } catch (err) {
        return null;
    }
}

function getHostnamePlusTopPath(fullUrl) {
    try {
        const parsed = new URL(fullUrl);
        const hostname = parsed.hostname;
        const segments = parsed.pathname.split('/').filter(seg => seg.length > 0);
        const topLevel = segments.length > 0 ? segments[0] : '';
        return topLevel ? `${hostname}/${topLevel}` : `${hostname}/`;
    } catch (err) {
        return null;
    }
}

/**
 * POST /auto-group/hostname
 * Body: { tabs: [ { id: number|string, url: string }, … ] }
 * Response: { "<hostname>": [tabId, …], … }
 */
app.post('/auto-group/hostname', (req, res) => {
    const { tabs } = req.body;
    if (!Array.isArray(tabs)) {
        return res.status(400).json({ error: 'Request body must have a "tabs" array.' });
    }

    const groups = {}; // { hostname: [id, …], … }

    tabs.forEach(entry => {
        const { id, url } = entry;
        const host = getHostname(url);
        if (!host) return; // skip invalid URLs

        if (!groups[host]) {
            groups[host] = [];
        }
        groups[host].push(id);
    });

    return res.json(groups);
});


/**
 * POST /auto-group/path
 * Body: { tabs: [ { id: number|string, url: string }, … ] }
 * Response: { "<hostname>/<topPath>": [tabId, …], … }
 */
app.post('/auto-group/path', (req, res) => {
    const { tabs } = req.body;
    if (!Array.isArray(tabs)) {
        return res.status(400).json({ error: 'Request body must have a "tabs" array.' });
    }

    const groups = {}; // { hostname/topLevelPath: [id, …], … }

    tabs.forEach(entry => {
        const { id, url } = entry;
        const key = getHostnamePlusTopPath(url);
        if (!key) return; // skip invalid URLs

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(id);
    });

    return res.json(groups);
});

// Start server on port 3001 (for example)
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Microservice B (Auto-Group by Hostname / Path) listening on port ${PORT}`);
});
