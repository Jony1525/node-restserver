const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();
const log4js = require('log4js');

const logger = log4js.getLogger('USUARIO SERVICE');
logger.level = ['info', 'error'];


app.get('/usuario', verificaToken, function (req, res) {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if ( err ) {
                    logger.error('ERROR - OBTENER CATEGORÍAS: ', err);
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.countDocuments({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });
                });
            });

});
  
app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
  
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB ) => {

        if ( err ) {
            logger.error('ERROR - GUARDAR USUARIO: ', err);
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if ( !usuarioDB ) {
            let error = {
                message: 'No se puede crear el usuario en la DB'
            }
            logger.error('ERROR - CREAR USUARIO: ', error);
            return res.status(400).json({
                ok: false,
                err: error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
  
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
      
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'edad', 'email', 'estado']);
    Usuario.updateOne({ _id: id }, body, (err, usuarioDB) => {

        if ( err ) {
            logger.error('ERROR - ACTUALIZAR USUARIO: ', err);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !usuarioDB ) {
            let error = {
                message: 'No se puede actualizar le usuario eb DB'
            };
            logger.error('ERROR - ACTUALIZAR USUARIO: ', error);
            return res.status(400).json({
                ok: false,
                err: error
            });
        }

        Usuario.findById(id, (err, usuario) => {
            return res.json({
                ok: true,
                usuario
            });
        });
    });

});
  
app.delete('/usuario/:id', verificaToken, function (req, res) {
    let id = req.params.id;

    let body = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioBorrado) => {
        if ( err ) {
            logger.error('ERROR - ELIMINAR USUARIO: ', err);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( usuarioBorrado === null ) {
            let error = {
                message: 'Usuario no encontrado'
            };
            logger.error('ERROR - ELIMINAR USUARIO: ', error);
            return res.status(400).json({
                ok: false,
                err: error
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;