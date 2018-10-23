const express = require('express');

const { verificaToken, verificaAdmin, verificaCreador } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');

const app = express();

//=================
// Mostrar categorias
//=================

app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('description')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                categoriaDB
            });
        });
});

//================================
// Mostrar categorias por usuario
//================================

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });

        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        return res.json({
            ok: true,
            categoriaDB
        }); 

    })



});

// ==============================
// Crear nueva categoria
// ==============================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        description: body.description,
        usuario: req.usuario._id
    });



    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//==============================
// actualizar categoria
//==============================

app.put('/categoria/:id', [verificaToken, verificaCreador], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
    //solo un admin puede borrar categorias
    //catfindbyidandremove
});

module.exports = app;