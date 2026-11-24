const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes mounted first
app.use('/ai', aiRoutes);

// Frontend static assets
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "frontend/dist")));

// Fallback for SPA client-side routing
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

module.exports = app;
