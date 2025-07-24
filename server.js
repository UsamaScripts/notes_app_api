import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import noteRoutes from "./src/routes/note.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import Note from "./src/models/note.model.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";

dotenv.config();
await connectDB();
await Note.syncIndexes();

const app = express();
app.use(cors());
app.use(express.json());

//swagger

const swaggerFile = fs.readFileSync("./swagger.yaml", "utf-8");
const swaggerDocs = yaml.load(swaggerFile);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
//Routes 404
app.use(notFound);
//error handdling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on the port :  ${PORT}`);
});
