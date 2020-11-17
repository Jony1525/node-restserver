

// ====================
// Port
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Base de Datos
// ====================

let urlDB;

if ( process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://jony:Mnolose15@cluster0.4w7l7.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
