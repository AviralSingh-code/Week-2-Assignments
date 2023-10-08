/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000
const app = express();

var idCounter = 0;

const database = [];

app.use(bodyParser.json());


function retrieveTodo(req,res)
{
  res.status(200).send(database);
}

function retrieveTodoByID(req,res)
{
  var idTarget = req.params.id;
  console.log(idTarget);
  var flag = false;
  for(let i = 0 ; i < database.length; i++)
  {
    if(database[i] && database[i].id == idTarget)
    {
      flag = true;
      res.status(200).send(database[i]);
    }
  }
  if(!flag)
  {
    res.status(404).send();
  }
}

function createTodo(req,res)
{
  var titleVal = req.body.title;
  var statusVal = req.body.completed;
  var desVal = req.body.description;

  var obj = {};
  var result = {};

  obj["id"] = idCounter;
  result["id"] = idCounter;
  obj["title"] = titleVal;
  obj["completed"] = statusVal;
  obj["description"] = desVal;

  idCounter += 1;

  database.push(obj);

  res.status(201).send(result);
}

function updateTodo(req,res)
{
  var idTarget = req.params.id;
  var statusVal = req.body.completed;

  var flag = false;
  for(let i = 0; i < database.length; i++)
  {
    if(database[i].id == idTarget)
    {
      flag = true;
      database[i].completed = statusVal;
      break;
    }
  }

  if(!flag)
  {
    res.status(404).send();
  }
  else{
    res.status(200).send();
  }
}

function deleteTodo(req,res)
{
  var idTarget = req.params.id;

  var pos = -1;
  for(let i = 0; i < database.length; i++)
  {
    if(database[i].id == idTarget)
    {
      pos = i;
      break;
    }
  }

  if(pos !== -1)
  {
    delete database[pos];
    res.status(200).send();
  }
  else
  {
    res.status(404).send();
  }
}

function errorRoute(req,res)
{
  res.status(404).send();
}


function started()
{
    console.log(`Example app listening on port ${port}`)
}


app.get('/todos', retrieveTodo);
app.get('/todos/:id', retrieveTodoByID);
app.post('/todos', createTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);

app.get('*', errorRoute);
app.post('*', errorRoute);
app.put('*', errorRoute);
app.delete('*', errorRoute);

app.listen(port, started)

module.exports = app;
