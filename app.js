const express = require('express');
const path = require('path');
const app = express();


//Encriptacion y mongodb
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./public/user');


app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.use(express.static(path.join(__dirname, 'public')));

//cadena de conexion
const mongo_uri = 'mongodb://localhost/node';

//verificando conexion a la base de datos
mongoose.connect(mongo_uri, function(err) {
    if(err){
        throw err;
    } else {
        console.log(`Se ha conectado a ${mongo_uri}`);
    }
});


//rutas a utilizar en metodos post
app.post('/register', (req, res) =>{
    const {username, password} = req.body;
    const user = new User({username, password});
    user.save(err =>{
        if(err){
           res.status(500).send('Error al registrar nuevo ususario'); 
        }else{
            res.status(200).send('Exito al registrar nuevo ususario');
        }
    });
});

app.post('/authenticate', (req, res) =>{
    const {username, password} = req.body;
    User.findOne({username}, (err, user) =>{
        if(err){
            res.status(500).send('Error al verificar el ususario'); 
         }else if(!user){
             res.status(500).send('Error el ususario no existe en la base de datos');
         }else{
             user.isCorrectPassword(password, (err,result) =>{
                if(err){
                    res.status(500).send('Error al verificar el ususario'); 
                 }else if(result){
                     res.status(200).send('EL ususario se ha verificado en la base de datos');
                 }else{
                    res.status(500).send('El usuario o contraseña son incorrectos');
                 }
             })
         }
    })
});

app.listen(3000, () =>{
    console.log('Server Started')
});
module.exports = app;