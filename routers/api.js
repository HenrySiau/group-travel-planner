import express from 'express';
import data from '../src/testData';
import {Kitten} from '../models/models';

const router = express.Router();

router.get('/messages', (req, res) => {
  res.send({ contests: data.messages });
});

router.get('/addcat', (req, res) => {
  var Kate = new Kitten({ name: 'Katee' });
  Kate.save(function (err) {
    if (err) return console.error(err);
  });

  res.send({ contests: data.messages });
});


router.get('/cat', (req, res) => {
  Kitten.find( function(err, kittens){
    if (err){
      res.send(err);
    }else{
      var result='';
      kittens.forEach(
        kitten=>{
          result += kitten.name;
        }
      );
      res.send(kittens);
      
    }
  });
});

export default router;