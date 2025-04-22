const express = require('express');
const router = express.Router();
const filePlacesDb = require('../filePlacesDb');
const nanoid = require('nanoid');
const multer = require('multer');
const path = require('path');
const config = require('../config.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    const places = filePlacesDb.getItems();
    res.send(places);
});

router.get('/:id', async (req, res) => {
    const places = filePlacesDb.getItems();
    const place = places.find(item => item.id === req.params.id);
    if (!place) {
        res.status(404).send({ error: 'Place not found' });
    }
    res.send(place);
});

router.post('/', upload.single('image'), async (req, res) => {
    const id = nanoid();
    const place = { ...req.body, id };
    if (req.file) {
        place.image = req.file.filename;
    }

    await filePlacesDb.addItem(place);
    res.send(place);
});

router.delete('/:id', async (req, res) => {
    const success = await filePlacesDb.deleteItem(req.params.id);
    if (!success) {
        res.status(404), send({ error: 'Place not found' });
    }
    res.send({ message: 'Place deleted successfully' });
});

router.put("/:id", upload.single("image"), async(req, res) =>{
 const updatedData= {
    ...req.body
 }
 if(req.file) {
    updatedData.image=req.file.filename
 }
  const updatedPlace = await filePlacesDb.updateItem(req.params.id, updatedData)
  if(!updatedPlace) {
    return res.status(404).send({error: "place not found"});
  }
  res.send(updatedPlace);
})

module.exports = router;
