// microserviceC/index.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

/**
 * In-memory store: groupId → { id, name, tabIds, createdAt }
 */
const groupsStore = {};

/**
 * Health‐check on GET /
 */
app.get('/', (_req, res) => {
    res.send(
        'Microservice C (Create and Delete Custom Groups) is running. Use POST /groups to create and DELETE /groups/:groupId to delete.'
    );
});

/**
 * POST /groups
 * Body: { name: string, tabIds: [<id>, …] }
 * Response: 201 → { id, name, tabIds, createdAt }
 */
app.post('/groups', (req, res) => {
    const { name, tabIds } = req.body;
    if (typeof name !== 'string' || !Array.isArray(tabIds)) {
        return res
            .status(400)
            .json({ error: 'Request must have "name" (string) and "tabIds" (array).' });
    }

    const newId = uuidv4();
    const createdAt = new Date().toISOString();
    const newGroup = { id: newId, name, tabIds, createdAt };

    groupsStore[newId] = newGroup;
    return res.status(201).json(newGroup);
});

/**
 * DELETE /groups/:groupId
 * Response: 204 (No Content) if deleted, or 404 if not found
 */
app.delete('/groups/:groupId', (req, res) => {
    const { groupId } = req.params;
    if (!groupsStore[groupId]) {
        return res.status(404).json({ error: 'Group not found.' });
    }
    delete groupsStore[groupId];
    return res.sendStatus(204);
});

/**
 * (Optional) GET /groups/:groupId ← for debugging
 */
app.get('/groups/:groupId', (req, res) => {
    const { groupId } = req.params;
    const group = groupsStore[groupId];
    if (!group) return res.status(404).json({ error: 'Not found.' });
    return res.json(group);
});

// Listen on port 3002
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Microservice C (Create and Delete Custom Groups) listening on port ${PORT}`);
});
