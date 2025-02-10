import express from "express";
import cors from "cors";
import { client } from "./databasepg.js";
import {
  finalCalculations,
  generatePortfolioByCarbonCreditsDemand,
  transformStringsToNumbers,
} from "./utils.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM projects");
    res.json({
      rows: transformStringsToNumbers(rows),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  if (
    typeof req.body.carbonCreditsDemand !== "number" &&
    Number.isInteger(req.body.carbonCreditsDemand)
  ) {
    res.status(400).send({ success: false, message: "Number is required" });
    return;
  }
  const { carbonCreditsDemand } = req.body;

  console.log("Received carbon credit demand in tons:", carbonCreditsDemand);
  const { rows } = await client.query("SELECT * FROM projects");

  const suggestedPortfolio = generatePortfolioByCarbonCreditsDemand(
    carbonCreditsDemand,
    transformStringsToNumbers(rows)
  );
  const cleanedSuggestedPortfolio = finalCalculations(suggestedPortfolio);

  res.status(200).send({
    success: true,
    carbonCreditsDemand,
    portfolio: cleanedSuggestedPortfolio,
  });
});

const PORT = Number(process.env.BACKEND_PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to PORT: ${PORT}`);
  client.connect();
  console.log("Server connected to database");
});
