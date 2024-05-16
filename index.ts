import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./database";
import router from "./router/router";
import sessions from "./middleware/sessions";



dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);
app.use(sessions)

app.use("/",router())


app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});