const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = moongose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        require: [true, 'El campo descripción es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    delete categoriaObject.__v;
    return categoriaObject;
}


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = moongose.model('Categoria', categoriaSchema);