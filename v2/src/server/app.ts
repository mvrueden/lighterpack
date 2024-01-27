import express from "express"
import compression from "compression"
import cookieParser from "cookie-parser"
import * as dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import fs from "node:fs"
import {usersRouter} from "./endpoints/users.routes"
import {connectToDatabase} from "./endpoints/database.service"
import {CsvService} from "../shared/csv.service"
import {Category, Item, Library, List} from "../shared/model";

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT || 9000;
connectToDatabase().then(() => {
    const app = express()
    app.use(compression())
    app.use(cookieParser())
    app.use(express.json({limit: '50mb'}))
    app.use(express.urlencoded({extended: true, limit: '50mb'}))
    app.use(cors())
    app.use(helmet())

    app.use('/', usersRouter)

    app.listen(SERVER_PORT, () => {
        console.log(`Server is listening on port ${SERVER_PORT}`)
    })
})
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });


fs.readFile('/Users/marskuh/Downloads/Standard.csv', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const rows = new CsvService().parse(data);
    if (rows.length > 0) {
        const newList = new List();
        rows.sort((a, b) => {
            return a.category.localeCompare(b.category);
        });
        let catIndex = 0;
        let itemIndex = 0;
        let category: Category | null = null;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (category == null || category.name != row.category) {
                category = new Category(++catIndex, true);
                category.name = row.category;
                newList.addCategory(category);
            }
            const newItem = new Item(++itemIndex, row.unit);
            newItem.name = row.item;
            newItem.url = row.url;
            newItem.qty = row.qty;
            newItem.price = row.price
            newItem.weight.value = row.weight
            newItem.isNew = true;
            newItem.consumable = row.consumable;
            newItem.worn = row.worn;
            // newItem.star = row.star; // TODO MVR
            category.addItem(newItem);
        }
        newList.calculateSubtotals();
        newList.categories.forEach(cat => console.log(cat))
        // console.log(newList);
    }
});

