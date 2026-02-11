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
import mysql from "mysql2/promise";
import config from "../config/config";
import fs from "fs";


const app = express();

app.use(cors({origin: "*"}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());


app.use(
  "/profile-pictures",
  async (req, res, next) => {
    const fileId = req.path.replace(/^\//, "");
    if (!fileId) { return res.status(404).end(); }

    try {
      const connection = await mysql.createConnection(config.database as any);
      try {
        const [rows]: any = await connection.query('SELECT file_name FROM files WHERE id = ?', [fileId]);
        if (rows && rows.length > 0) {
          const originalName = rows[0].file_name as string;
          const ext = path.extname(originalName).toLowerCase();
          let contentType = 'application/octet-stream';
          if (ext === '.png') contentType = 'image/png';
          else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
          else if (ext === '.gif') contentType = 'image/gif';

          const filePath = path.join(process.cwd(), 'uploads', 'profile-pictures', fileId);
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
          return res.sendFile(filePath, (err) => {
            if (err) next();
          });
        }
      } finally {
        await connection.end();
      }
    } catch (err) {
      console.error('Error serving profile-pictures by id', err);
    }

    try {
      const filePath = path.join(process.cwd(), 'uploads', 'profile-pictures', fileId);
      if (fs.existsSync(filePath)) {
        const fd = fs.openSync(filePath, 'r');
        const header = Buffer.alloc(8);
        fs.readSync(fd, header, 0, 8, 0);
        fs.closeSync(fd);

        let contentType = 'application/octet-stream';
        if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
          contentType = 'image/png';
        } else if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
          contentType = 'image/jpeg';
        } else if (header.toString('ascii', 0, 3) === 'GIF') {
          contentType = 'image/gif';
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        return res.sendFile(filePath, (err) => { if (err) next(); });
      }
    } catch (e) {
      console.error('Error inferring profile-pictures MIME type', e);
    }

    next();
  },
  express.static(
    path.join(process.cwd(), "uploads", "profile-pictures")
  )
);

app.use(
  "/categories-pictures",
  express.static(
    path.join(process.cwd(), "uploads", "categories-pictures")
  )
);

app.use(
  "/ad-pictures",
  async (req, res, next) => {
    const fileId = req.path.replace(/^\//, "");
    if (!fileId) { return res.status(404).end(); }

    try {
      const connection = await mysql.createConnection(config.database as any);
      try {
        const [rows]: any = await connection.query('SELECT file_name FROM files WHERE id = ?', [fileId]);
        if (rows && rows.length > 0) {
          const originalName = rows[0].file_name as string;
          const ext = path.extname(originalName).toLowerCase();
          let contentType = 'application/octet-stream';
          if (ext === '.png') contentType = 'image/png';
          else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
          else if (ext === '.gif') contentType = 'image/gif';

          const filePath = path.join(process.cwd(), 'uploads', 'ad-pictures', fileId);
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
          return res.sendFile(filePath, (err) => {
            if (err) next();
          });
        }
      } finally {
        await connection.end();
      }
    } catch (err) {
      console.error('Error serving ad-pictures by id', err);
    }

    next();
  },
  express.static(
    path.join(process.cwd(), "uploads", "ad-pictures")
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