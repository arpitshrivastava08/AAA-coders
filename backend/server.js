import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Fake data (replace later with DB)
const projects = [
  { id: 1, title: "Travel Blog", description: "Explore amazing destinations", tech: "Next.js" },
  { id: 2, title: "Caravan Booking", description: "Book caravans online", tech: "React + Tailwind" },
  { id: 3, title: "Community Forum", description: "Discuss & share experiences", tech: "Node.js" }
];

// API route
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
