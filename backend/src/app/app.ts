import express from "express";
import categoryRouter from "../category/routes";
import adRouter from "../advertisement/routes";
import cors from "cors";
import bodyparser from "body-parser";

const app = express();

app.use(cors({origin: "*"}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());

app.use('/', categoryRouter);
app.use('/', adRouter);

export default app;