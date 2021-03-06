const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const { populate } = require('../models/producto');
const app = express();
const Producto = require('../models/producto');
const log4js = require('log4js');

const logger = log4js.getLogger('PRODUCTO SERVICE');

app.get('/producto',verificaToken,(req, res) => {
    
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                if ( err ) {
                    logger.error('ERROR - OBTENER PRODUCTOS: ', err);
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: false,
                    productos,
                    cuantos: productos.length
                });
            });

});


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.find({ _id: id })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
                if ( err ) {
                    logger.error('ERROR - OBTENER PRODUCTO POR ID: ', err);
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: false,
                    producto: productoDB
                });
            });

});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');
    Producto.find({ nombre: regExp })
            .populate('categoria', 'nombre')
            .exec((err, categorias) => {
                logger.error('ERROR - OBTENER PRODUCTO POR TÉRMINO: ', err);
                if ( err ) {
                    return res.status(500).json({
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

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id,
        img: body.img
    });

    producto.save((err, productoDB) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            logger.error('ERROR - OBTENER PRODUCTOS: ');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al guardar Producto en la DB'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

app.put('/producto/:id', verificaToken, (req, res)=> {
    
    let id = req.params.id;
    let body = req.body;
    
    Producto.updateOne({ _id: id}, body, { new: true, runValidators : true}, (err, productoDB) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se puede actualizar el producto en la DB'
                }
            });
        }

        Producto.findById(id, (err, producto) => {
            return res.json({
                ok: true,
                producto
            })
        });
    });

});

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, body, (err, productoBD) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'Id no existe en la base de datos'           
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    
    });

});


module.exports = app;
