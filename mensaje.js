const nodemailer = require('nodemailer');

// Configuración del transporte para enviar correos electrónicos
let transporter = nodemailer.createTransport({
    service: 'Gmail', // Proveedor de correo electrónico
    auth: {
        user: 'tp2mensaje@gmail.com', // Correo electrónico desde el que se enviará el mensaje
        pass: 'ttlz nphx ddxg gqbk' // Contraseña del correo electrónico
    }
});


module.exports.transporter=transporter;

/*
generar app password, link abajo

*/

//https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4O_rH5irfVc9n43ABpnauJJZ9-iqzUyYlgive3mOEaAsMgnyGBYgosMXNLi5HKTTFiJRYRRz-JqFZrFGbnX8PeKhJEDWbjVUdhOqCeVbb0upmmUZcI