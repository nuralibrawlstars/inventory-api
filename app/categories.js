const express = require("express");
const router = express.Router();
const fileCategoriesDb = require("../fileCategoriesDb");
const nanoid = require("nanoid");
const multer = require("multer");
const path = require("path");
const config = require("../config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    fileName: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
    const categories = fileCategoriesDb.getItems();
    res.send(categories)

});

router.get("/:id", async (req, res) => {
    const categories = fileCategoriesDb.getItems();
    const category = categories.find(item => item.id === req.params.id)
    if (!category) {
        res.status(404).send({ error: "Category not found" });
    }
    res.send(category);
})

router.delete("/:id", async(req, res)=> {
    const success= await fileCategoriesDb.deleteItem(req.params.id);
    if(!success) {
        res.status(404), send({error: "Category not found"});
    }
    res.send({message: "Category deleted successfully"});
});



router.post("/", upload.single("image"), async (req, res) => {
    const id = nanoid();
    const category = { ...req.body, id };
    if (req.file) {
        category.image = req.file.filename;
    }

    await fileCategoriesDb.addItem(category)
    res.send(category);
});

module.exports=router;
