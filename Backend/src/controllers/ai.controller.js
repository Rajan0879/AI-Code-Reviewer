const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    try {
        const code = req.body.code;

        if (!code) {
            return res.status(400).send("Prompt is required");
        }

        const response = await aiService(code);
        res.send(response);
    } catch (error) {
        console.error("AI review generation error:", error);
        res.status(500).json({
            error: "Failed to generate review",
            message: error.message || "An error occurred while contacting the Gemini model."
        });
    }
};
