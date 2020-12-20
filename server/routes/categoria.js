const express = require('express');
const app = express();
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const log4js = require('log4js');

const logger = log4js.getLogger('CATEGORIA SERVICE');

logger.leve = ['info', 'error'];


app.get('/categoria',verificaToken, (req, res) => {
    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) => {

        if ( err ) {
            logger.error('ERROR - OBTENER CATEGORIAS: ', err);
            return res.status(400).json({
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
            logger.error('ERROR - OBTENER CATEGORIA POR ID: ', err);
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
            logger.error('ERROR - GUARDAR CATEGORIA: ', err);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            let error = {
                message: 'No se puede guardar le categoria en DB'
            };
            logger.error('ERROR - GUARDAR CATEGORIA: ', error);
            return res.status(400).json({
                ok: false,
                err: error
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
            logger.error('ERROR - EDITAR CATEGORIA: ', err);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            logger.error('ERROR - EDITAR CATEGORIA: ', err);
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
            logger.error('ERROR - ELIMINAR CATEGORIA: ', err);
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