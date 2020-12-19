const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false }
});

productoSchema.methods.toJSON = function() {
    let producto = this;
    let productoObject = producto.toObject();
    delete productoObject.__v;
    return productoObject;
}


module.exports = mongoose.model('Producto', productoSchema);