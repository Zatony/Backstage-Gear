import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import path from "path";

import categoryRouter from "../category/routes";
import adRouter from "../advertisement/routes";
import profileRouter from "../profile/routes";
import messageRouter from "../message/routes";
import cartRouter from "../cart/routes";
import userRouter from "../user/routes";
import fileRouter from "../upload/routes";


const app = express();

app.use(cors({origin: "*"}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());


app.use(
  "/profile-pictures",
  express.static(
    path.join(process.cwd(), "uploads", "profile-pictures")
  )
);


app.use('/', categoryRouter);
app.use('/', adRouter);
app.use('/', profileRouter);
app.use('/', messageRouter);
app.use('/', cartRouter);
app.use('/', userRouter);
app.use('/', fileRouter);

export default app;