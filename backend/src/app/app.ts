import express from "express";
import cors from "cors";
import bodyparser from "body-parser";

import categoryRouter from "../category/routes";
import adRouter from "../advertisement/routes";
import profileRouter from "../profile/routes";
import messageRouter from "../message/routes";
import cartRouter from "../cart/routes";
import userRouter from "../user/routes";


const app = express();

app.use(cors({origin: "*"}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());

app.use('/', categoryRouter);
app.use('/', adRouter);
app.use('/', profileRouter);
app.use('/', messageRouter);
app.use('/', cartRouter);
app.use('/', userRouter);

export default app;