// microserviceD/index.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

/**
 * In-memory store (for rename operations):
 *   groupId → { id, name, updatedAt }
 */
const groupsStoreD = {};

/**
 * Health‐check on GET /
 */
app.get('/', (_req, res) => {
    res.send(
        'Microservice D (Close Tabs & Rename Group) is running. Use POST /groups/:groupId/close and PATCH /groups/:groupId.'
    );
});

/**
 * POST /groups/:groupId/close
 * Body: { tabIds: [<id>, …] }
 * Response: { closedCount: <number> }
 */
app.post('/groups/:groupId/close', (req, res) => {
    const { groupId } = req.params;
    const { tabIds } = req.body;

    if (!Array.isArray(tabIds)) {
        return res.status(400).json({ error: '"tabIds" must be an array.' });
    }
    if (!groupsStoreD[groupId]) {
        return res.status(404).json({ error: 'Group not found in Microservice D (Close Tabs & Rename Group).' });
    }

    const closedCount = tabIds.length;
    return res.json({ closedCount });
});

/**
 * PATCH /groups/:groupId
 * Body: { name: "<newName>" }
 * Response: { id, name, updatedAt }
 *
 * If groupId does not exist, we create a placeholder record so D can rename it.
 */
app.patch('/groups/:groupId', (req, res) => {
    const { groupId } = req.params;
    const { name: newName } = req.body;

    if (typeof newName !== 'string' || newName.trim().length === 0) {
        return res.status(400).json({ error: '"name" must be a non-empty string.' });
    }

    if (!groupsStoreD[groupId]) {
        // Create new placeholder
        groupsStoreD[groupId] = {
            id: groupId,
            name: newName,
            updatedAt: new Date().toISOString()
        };
        return res.json(groupsStoreD[groupId]);
    }

    // Otherwise, update existing
    groupsStoreD[groupId].name = newName;
    groupsStoreD[groupId].updatedAt = new Date().toISOString();
    return res.json(groupsStoreD[groupId]);
});

/**
 * (Optional) GET /groups/:groupId ← for debugging
 */
app.get('/groups/:groupId', (req, res) => {
    const { groupId } = req.params;
    const rec = groupsStoreD[groupId];
    if (!rec) return res.status(404).json({ error: 'Group not found in Microservice D (Close Tabs & Rename Group).' });
    return res.json(rec);
});

// Listen on port 3003
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Microservice D (Close Tabs & Rename Group) listening on port ${PORT}`);
});
