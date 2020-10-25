/**
 * Copyright (c) Codebox, Inc. and its affiliates. All Rights Reserved.
 */

'use strict';
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const app = express();

/* parser les formulaires  */
app.use(bodyParser.json());

const api = express.Router();
const auth = express.Router();
const chat = express.Router();
const task = express.Router();

/* middeleware accept requete depuis n'importe quel endroit donner acces a tous les port  */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header("Access-Control-Allow-Methods", 'GET, PUT,  OPTIONS, POST, DELETE');
    next();
});

task.get('/list', (req, res) => {
    //console.log("test => reussi ! ");
    fs.readFile('./JsonFiles/tasks.json', function (error, file) {
        let tasks = JSON.parse(file)
        console.log("tasks : =>", tasks)

        return res.json({
            tasks
        });

    })

});

task.post('/', (req, res, next) => {
    let task = JSON.stringify(req.body.todos);
    // let task = JSON.stringify(req.body.body.todos);
    var json = []
    console.log('task : ', task)
    if (task) {
        fs.readFile('./JsonFiles/tasks.json', function (err, data) {
            json = JSON.parse(data)
            task = JSON.parse(task)
            json.push(task)
            fs.writeFile('./JsonFiles/tasks.json', JSON.stringify(json), 'utf-8', function (err) {
                if (err) throw err
                console.log('Done!')
                res.status(200).json({
                    json
                });
                next()
            })
        })
    }

});

task.put('/', (req, res, next) => {
    let id = JSON.stringify(req.body.id);
    let todo = JSON.stringify(req.body.todo);
    fs.readFile('./JsonFiles/tasks.json', function (error, file) {
        let json = JSON.parse(file)
        json[id] = todo
        fs.writeFile('./JsonFiles/tasks.json', JSON.stringify(json), 'utf-8', function (err) {
            if (err) throw err
            console.log('Done!')
            res.json({
                json
            });
            next()
        })
    })
});


task.delete('/', (req, res, next) => {
    let id = JSON.stringify(req.body.id);
    let jsor = []
    let jso = []
    // if(id != null ) {
    fs.readFile('./JsonFiles/tasks.json', function (error, file) {
        let json = JSON.parse(file)
        delete json[id]
        Object.keys(json).forEach((key) => (json[key] !== id) && jso.push(json[key]));
        fs.writeFile('./JsonFiles/tasks.json', JSON.stringify(jso), 'utf-8', function (err) {
            if (err) throw err
            console.log('Done!')
            jsor = jso
            // console.log('jso : ', jso)
            res.json({
                jso
            });
            next()


        })
    })
});

app.use('/task', task);

const port = 8080;

app.listen(port, () => {
    //console.log(`listening on port ${port}`);
});
