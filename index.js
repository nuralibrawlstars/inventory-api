const express= require("express");
const app = express();
const categories = require("./app/categories");
const items = require("./app/items");
const places = require("./app/places");
const port = 8000;
const fileCategoriesDb=require("./fileCategoriesDb");
const fileItemsDb=require("./fileItemsDb");
const filePlacesDb=require("./filePlacesDb")


async function start() {
    app.use(express.json());
    app.use(express.static("public"));
    await fileCategoriesDb.init();
    await fileItemsDb.init();
    await filePlacesDb.init();
    app.use("/categories", categories);
    app.use("/items", items);
    app.use("/places", places);

    app.listen(port, ()=> {
        console.log(`server is runningc on ${port}`);
    })
}

start();