const express = require("express");
const cors = require("cors");

const questionRoutes = require("./routes/questions");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});