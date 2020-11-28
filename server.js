
var express = require('express'),
bodyParser = require('body-parser'),
   _ = require('underscore'),
 json = require('./movies.json'),//We're also requiring a file named movies.json , which we'll create next.
app = express();
app.set('port', process.env.PORT || 3500);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var router = new express.Router();
//we are using postman to listen to these requests

router.get('/test', function(req, res) {
    var data = {
    name: 'Jason Krol',
    website: 'http://kroltech.com'
    };
    res.json(data);
});

router.get('/', function(req, res) {
        res.json(json);
    });
//we will use postman
//the first thing we do in the POST function is check to make sure the required fields were submitted along with the actual request. Assuming our data checks out and all
//the required fields are accounted for (in our case, every field), we insert the entire req. body object into the array as is using the array's push function. If any of the required
//fields aren't submitted with the request, we return a 500 error message instead. Let's submit a POST request this time to the same endpoint using the Postman REST Client.
router.post('/', function(req, res) {
        // insert the new item into the collection (validate first)
        if(req.body.Id && req.body.Title && req.body.Director &&
        req.body.Year && req.body.Rating) {
        json.push(req.body);
        res.json(json);
        } else {
        res.json(500, { error: 'There was an error!' });
        }
        });
     
     
 //PUT requests will work in almost exactly the same way except, traditionally, the Id property of the data is handled a little differently.
 //in our example, we are going to require the Id attribute as a part of the URL and not accept it as a parameter in
 //the data that's submitted (since it's usually not common for an update function to change the actual Id of the object it's updating)
 router.put('/:id', function(req, res) { //we will use postman PUT is used to update reason why we pass Id differently
            // update the item in the collection
        if(req.params.id && req.body.Title && req.body.Director &&
        req.body.Year && req.body.Rating) {
        _.each(json, function(elem, index) {
        // find and update:
        if (elem.Id === req.params.id) {
            elem.Title = req.body.Title;
            elem.Director = req.body.Director;
            elem.Year = req.body.Year;
            elem.Rating = req.body.Rating;
            }
            });
            res.json(json);
            } else {
            res.json(500, { error: 'There was an error!' });
            }
    });

    //Delete will use Postman
router.delete('/:id', function(req, res) {
        var indexToDel = -1;
        _.each(json, function(elem, index) {
        if (elem.Id === req.params.id) {//comparing the values of Id .
        indexToDel = index;
        }
        });
        if (~indexToDel) { //The tilde (~) in JavaScript will bit flip a value. In other words, take a value and return the negative of that value incremented by one, that is ~n === -(n+1).
        json.splice(indexToDel, 1);//Using the array.splice function, we can remove an array item at a specific index
        }
        res.json(json);
     });

app.use('/', router);

var server = app.listen(app.get('port'), function() {
console.log('Server up: http://localhost:' + app.get('port'));
});