const express = require("express");
const router = express.Router();
const fileItemsDb = require("../fileItemsDb");
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
    const items = fileItemsDb.getItems();
    res.send(items)

});

router.get("/:id", async (req, res) => {
    const items = fileItemsDb.getItems();
    const item = items.find(item => item.id === req.params.id)
    if (!item) {
        res.status(404).send({ error: "Item not found" });
    }
    res.send(item);
})

router.delete("/:id", async(req, res)=> {
    const success= await fileItemsDb.deleteItem(req.params.id);
    if(!success) {
        res.status(404), send({error: "Item not found"});
    }
    res.send({message: "Item deleted successfully"});
});


router.post("/", upload.single("image"), async (req, res) => {
    const id = nanoid();
  
    const item = { ...req.body, id };
    if (req.file) {
        item.image = req.file.filename;
    }

    await fileItemsDb.addItem(item)
    res.send(item);
});

module.exports=router;

