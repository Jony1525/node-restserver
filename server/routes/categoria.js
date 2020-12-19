const express = require('express');
const app = express();
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
const Categoria = require('../models/categoria');


app.get('/categoria',verificaToken, (req, res) => {


    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) => {

        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });

});

app.get('/categoria/:id', verificaToken, (req, res) => {

    Categoria.findById({ _id: id }).exec((err, categoria) => {

        if ( err ) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let usuarioId = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioId
    });

    categoria.save((err, categoriaDB) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });

});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.updateOne({_id: id }, body, (err, categoriaDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de la categoria no existe en la base de datos'
                }
            });
        }
        Categoria.findById(id,(err, categoria) => {
            return res.json({
                ok: true,
                categoria
            });
        });

    });

});


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });

});

module.exports = app;