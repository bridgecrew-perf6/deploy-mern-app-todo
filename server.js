const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config({ path: "./config.env" });
const cors = require('cors');
const app = express();
const path = require('path');
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB")).catch(console.error);


const Todo = require("./models/Todo");

app.get('/todos', async(req, res) =>{
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todo/new', (req, res) =>{

    const todo = new Todo({
        text: req.body.text
    });

    todo.save();
    res.json(todo);

});



app.delete("/todo/delete/:id", async (req, res) =>{

    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);

});


app.get('/todo/complete/:id', async(req, res) =>{

    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);

})

if(process.env.NODE_ENV === 'production'){

    app.use(express.static(path.join(__dirname, '/client/build')));


    app.get('*', (req, res) =>{

        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })

} else {

    app.get('/', (req, res) => {
        res.send("Api running");
    })

}

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("Server started on port "+ PORT));