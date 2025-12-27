import config from "../config/config";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";


export async function signIn(req: any, res: any) {
    const {email, password} = req.body;
    
    if(!(email && password)){
        res.status(400).send("Nem megfelelően megadott adatok.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            'SELECT login(?, ?) AS id',
            [email, password]
        ) as Array<any>;

        if(!result[0].id){
            res.status(401).send("Hibásan megadott email vagy jelszó.");
            return;
        };

        if(!config.jwtSecret){
            res.status(500).send("Hiba van a titkos kulcsnál.");
            return;
        };

        const token = jwt.sign({id: result[0].id}, config.jwtSecret, {expiresIn: "2h"});

        res.status(201).send({token: token});
    }
    catch(err){
        console.log(err);
    }
};