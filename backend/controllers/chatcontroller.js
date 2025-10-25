const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: "AIzaSyDwH9xVy2SVM8YIbFYU_55e0JxznRtVHdM",
});

exports.chatbot = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
    });

    res.status(200).json({
      message: response.text
    });
  } catch (error) {
    console.error(error);   
    res.status(500).json({ error: error.message });
  }
};
