import express, {Application, Request, Response} from 'express';
import dotenv from "dotenv";
import cors from "cors";
import {DBUtil} from "./db/util/DBUtil";
import contactRoutes from "./routes/contactRoutes";
import groupRoutes from "./routes/groupRoutes";

const app: Application = express();

// configure dot-env
dotenv.config({path: "./.env"});
app.use(express.json());// configure express to read form data
app.use(cors()); // CORS configuration

const port: string | undefined | number = process.env.PORT || 9000;
const dbName: string | undefined = process.env.EXPRESS_MONGO_DB_DATABASE_NAME;
const dbUrl: string | undefined = process.env.EXPRESS_MONGO_DB_CLOUD_URL;

app.get("/", (request: Request, response: Response) => {
    response.status(200);
    response.json({
        msg: "Welcome to express server"
    });
});

// configure routes
app.use("/contacts", contactRoutes);
app.use("/groups", groupRoutes);

if (port) {
    app.listen(Number(port), () => {
        if (dbName && dbUrl) {
            DBUtil.connectToDB(dbName, dbUrl).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
                process.exit(1); // force-stop express server
            });
        }
        console.log(`Express server is started at ${port}`);
    });
}
