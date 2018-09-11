require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('get Usuario');
})

app.post('/usuario', function (req, res) {

    let body = req.body;

    if ( body.usuario === undefined ){
        res.status(400).json({
            ok: false,
            info: 'El usuario es necesario'
        })
    }else{
        res.json({
            body
        });
    }
})

app.put('/usuario', function (req, res) {
    res.json('put Usuario');
})

app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
})
  
  


app.listen(process.env.PORT, () => console.log('Escuchando el puerto: ', process.env.PORT));