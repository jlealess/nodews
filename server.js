const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('./models/pet');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const dbURL = process.env.MONGODB_URI || "mongodb://localhost/updog";

mongoose.connect(dbURL);

app.use(express.static('public'));
// use is middleware
// middlewares go top to bottom

app.use(bodyParser.json());
// body parser is also middleware
// when we make a request that has data it takes it and adds it as a property on the request (.body)

// express router
router.route('/')
  .get((req, res) => {
    res.json({
      message: 'Success'
    })
  });

router.route('/pets')
  .get((req, res) => {
    Pet.find({/* empty object is query*/}, (err, docs) => {
      if(err) {
        res.status(400).json({message: "You goofed it"});
        return;
      }
      res.status(200).json(docs);
    });
  })
  .post((req, res) => {
    const body = req.body;
    const pet = new Pet();

    pet.name = body.name;
    pet.description = body.description;
    pet.photo = body.photo;
    pet.score = 0;

    pet.save((err, doc) => {
      if (err) {
        res.status(400).json({ message: "You done messed up" });
        return;
      }
      res.status(200).json(doc);
    })

    // when you have a request you always have to send something back otherwise the server will just hang
  });

router.route('/pets/:pet_id')
  .get((req, res) => {
    const petId = req.params.pet_id;
    Pet.findById(petId, (err, pet) => {
      if (err) {
			  res.status(400).json({ message: "No pets here" });
			  return;
      }
      res.status(200).json(pet);
    })
  })
  .put((req, res) => {
    const petId = req.params.pet_id;
    Pet.findById(petId, (err, pet) => {
      if (err) {
        res.status(400).json({ message: "Errrrror" });
        return;
      }
      Object.assign(pet, req.body, {score: pet.score + 1});
      pet.save((err, savedDoc) => {
        if (err) {
          res.status(400).json({ message: "Errrrror" });
          return;
        }
        res.status(203).json(savedDoc);
      })
    })
  })
  .delete((req, res) => {
    const petId = req.params.pet_id;
    Pet.findByIdAndRemove(petId, (err, pet) => {
      if (err) {
  			res.status(400).json({ message: "Errrrror" });
	  		return;
		  }
      res.status(200).json(pet);
    });    
  });

// request handler accepts two params: request and response
app.use('/api', router);
app.listen(port);