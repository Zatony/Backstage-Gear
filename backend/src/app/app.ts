import express from "express";
import cors from "cors";
import bodyparser from "body-parser";

import categoryRouter from "../category/routes";
import adRouter from "../advertisement/routes";
import profileRouter from "../profile/routes";


const app = express();

app.use(cors({origin: "*"}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());

app.use('/', categoryRouter);
app.use('/', adRouter);
app.use('/', profileRouter);

export default app;