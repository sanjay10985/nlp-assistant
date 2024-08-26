import express from "express";
import cors from "cors";
import natural from "natural";

const app = express();
app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  const tokens = tokenizer.tokenize(text);
  const wordCount = tokens.length;
  const sentenceCount = text.split(/[.!?]+/).length;

  res.json({
    wordCount,
    sentenceCount,
    tokens,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
