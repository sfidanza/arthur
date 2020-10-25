import express from "express";
import MongoClient from "mongodb";
import code from "./src/code.js";

const {
	MONGO_HOSTNAME,
	MONGO_PORT,
	NODE_PORT,
	ADMIN_CODE
} = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

MongoClient.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`, { useUnifiedTopology: true })
	.then(client => {
		console.log("Connected to mongodb!");
		const db = client.db('no-game');

		app.use('/api/code', code(db, ADMIN_CODE));

		app.listen(NODE_PORT, function () {
			console.log(`App listening on port ${NODE_PORT}!`);
		});
	}).catch(console.error);
