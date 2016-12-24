/**
 * Created by Aakarsh on 12/22/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');



//app.use(parser.json);



var todos = [
    {
        id: 1,
        description: "Take out the trash",
        completed: false
    },
    {
        id: 2,
        description: "Get food tonight",
        completed: false
    },
    {
        id: 3,
        description: "Hit the gym",
        completed: true
    }
]; //Array of todo items




//var todos = [];
var nextTodoItem = 1;
app.use(bodyParser.json());


app.get('/', function(req, res){
    //console.log("ToDo Root");
    res.send("ToDo Root");
});

//GET REQUEST TO GET ALL TODO ITEMS
        //   GET /todos

app.get('/todos', function (req, res) {
    // Need to send back the array of todos
    res.send(todos); //array is converted to JSON.



    }

);



//ONLY COMPLETED TRUE TODOS

app.get('/todos/filtered/true', function(req, res){
    //ONLY {completed: true} status todos.
    var filteredTrueTodos = _.where(todos, {"completed": true});
    console.log("sending filterd true todos");
    res.send(filteredTrueTodos);

});


//ONLY COMPLETED FALSE TODOS
app.get('/todos/filtered/false', function (req, res) {
    var filteredFalseTodos = _.where(todos, {"completed": false});
    console.log("sending filtered false todos");
    res.send(filteredFalseTodos);

});




//GET REQUEST TO GET SOME SPECIFIC TODO
        //GET todos/:id
                //Express uses : (colon) to parse data.

app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var todoObjectWithID = -1;
    todos.forEach(function (todo) {
        if(todo.id == todoID){
            todoObjectWithID = todos[todoID - 1];

        }
    });

    if(todoObjectWithID == -1){
        res.status(404).send();


    } else {
        res.json(todoObjectWithID); //Send the JSON of the specific todo with id requested.
    }
    console.log('Asing for todo with id of ' + req.params.id);
});


//Create a POST request to create new TODO Items.

        //POST /todos
app.post('/todos', function(req, res){
    var body = req.body;
    console.log("description"  + body.description);
    body.id = nextTodoItem++;
    todos.push(body);
    res.json(todos);

});


//DELETE REQUEST

app.delete('/todos/:id', function (req, res) {
    var toDeleteID = parseInt(req.params.id, 10);
    console.log(toDeleteID);
    var matchedTodo = _.findWhere(todos, {"id": toDeleteID});
    if(!matchedTodo){
        res.status(404).json({"error": "ToDo item not found"});

    } else{

        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }


    res.send('DELETE request to homepage');


});

//PUT/PATCH

app.put('/todos/:id', function(req, res){
    var body = req.body;  ///body data
    var toDoUpdateID = parseInt(req.params.id, 10); //id of the todo to be updated.
    var matchedTodo =_.findWhere(todos, {"id": toDoUpdateID});
    var getObj = _.pick(body, "description", "completed");
    if(!matchedTodo){
        res.status(404).json({"error": "Not found todo item"});

    }


    //console.log(getObj); --> If I put in {"completed": false} prints {completed: false}, omits non-existent values i
    //in the _.pick command. If desciption not found it'll print what I just wrote above.
 else {
        if("description" in getObj && "completed" in getObj){
            matchedTodo.description = getObj.description;
            matchedTodo.completed = getObj.completed;

        }
        else if("completed" in getObj){
                matchedTodo.completed = getObj.completed;

        }
       else if("description" in getObj){
                matchedTodo.description = getObj.completed;

        }


        res.json(matchedTodo);


    }

});





//Server basic start up (port and log)

app.listen(3000, function () {
    console.log("Server up and running");
});
