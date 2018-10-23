const express = require('express');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

// ====================
// Obtener productos
// =====================


app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .skip(desde)
        .limit(limite)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productoDB
            });

        });

});
//trae productos
//populate: usuario caategoria
//paginado






// ====================
// Obtener producto por ID
// =====================

app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    // Producto.find({_id:id, disponible:true})
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec((err, productoDB) => {
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe producto con este id'
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
                producto: productoDB
            });


        });

    //populate: usuario categoria
    //paginado

});
// =====================
// Buscar un producto
// =====================
app.get('/producto/buscar/:termino',verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible:true })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe producto'
                    }
                });
            }
            res.json({
                ok: true,
                producto
            })
        })

});

// ====================
// Crear un nuevo producto
// =====================

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});
// grabar el usuario
// grabar una categoria del listado



// ====================
// Actualizar un nuevo producto
// =====================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let cambios = {
        nombre: body.nombre,
        precioUni: body.precio,
        categoria: body.categoria,
        disponible: body.disponible,
        descripcion: body.descripcion
    }
    Producto.findByIdAndUpdate(id, cambios, { new: true, runValidators: true }, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})




// =====================
// Borrar un producto
// =====================
app.delete('/producto/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto borrado'
        })
    })
})
//cambiar el estado disponible del producto (soft delete)




module.exports = app;