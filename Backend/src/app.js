const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');
const path = require("path");  // ✅ Fixed: Use require() instead of import

const app = express();

app.use(cors());
app.use(express.json());

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "frontend/dist")));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/ai', aiRoutes);

module.exports = app;