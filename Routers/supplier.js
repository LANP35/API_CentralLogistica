const express = require('express');
const cradle = require('cradle');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');
const moment = require('moment-timezone');


//Router
const routerProveedores = express.Router();

//-----------------------------------------------------------------------------------

// Middleware para procesar solicitudes con datos JSON
routerProveedores.use(express.json());


//------------------Dirección de nodos-----------------:

const { direccionNodoConsenso, certificadoDigital, direccionNodeExecutive, direccionNodeLogistics } = require('../variables');

//--------------------Configurar Api Key--------------------

const headerconsenso = {
    'api-key': 'Password783',
    'cert-dig': JSON.stringify(certificadoDigital)
};

const headerExecutive = {
    'api-key': 'Password785',
    'cert-dig': JSON.stringify(certificadoDigital)
};

const headerLogistics = {
    'api-key': 'Password786',
    'cert-dig': JSON.stringify(certificadoDigital)
};

//----------------------------------Peticiones---------------------

//Registrar Supplier

routerProveedores.post('/registerSupplier', async (req, res) => {

    const { name, email, phone, ruc } = req.body;

    const lastSupplier = {
        name: name,
        email: email,
        phone: phone,
        ruc: ruc
    };

    /*
    let fecha = new Date();
    let fechaString = fecha.toLocaleString();
    */
    let fechaServidor = moment();
    fechaServidor.tz('America/Lima');
    let fechaString = fechaServidor.format('DD/MM/YYYY, HH:mm:ss');

    lastSupplier["date"] = fechaString;

    //Enviar informacion a los nodos

    try {
        response1 = await axios.post(direccionNodoConsenso + "/api/logistica/suppliers/newSupplier", lastSupplier, { headers: headerconsenso });

    } catch (error) {
        //console.log("Error al hacer la petición");
        response1 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Consensus");
    }

    try {
        response2 = await axios.post(direccionNodeExecutive + "/api/logistica/suppliers/newSupplier", lastSupplier, { headers: headerExecutive });

    } catch (error) {
       // console.log("Error al hacer la petición");
        response1 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Executive");
    }

    try {
        response3 = await axios.post(direccionNodeLogistics + "/api/logistica/suppliers/newSupplier", lastSupplier, { headers: headerLogistics });

    } catch (error) {
        //console.log("Error al hacer la petición");
        response1 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Logistics");
    }

    //--------------Verificar Consistencia de todos los nodos----------------
    {
        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            && JSON.stringify(response2.data) == JSON.stringify(response3.data)
            && JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {
           // console.log("Todos concuerdan");
        } else {
            //console.log("No concuerdan todos");
            //Envia mensaje
            noConcuerdanTodos(response1.data, response2.data, response3.data);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });
        }
    }

    {
       // console.log("Enviando información a los bloques");

        let bloqueComun;

        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            || JSON.stringify(response2.data) == JSON.stringify(response3.data)
            || JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {

            if (JSON.stringify(response1.data) == JSON.stringify(response3.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response2.data) == JSON.stringify(response3.data)) {
                bloqueComun = response2.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response1.data) == JSON.stringify(response2.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            //---------------------Enviar Bloque-----------------------

            try {
                let responseConsenso = await axios.post(direccionNodoConsenso + "/api/logistica/suppliers/addBlockNew", bloqueComun, { headers: headerconsenso });
            } catch (error) {
                MensajeNodeOffline(error, "Node Consensus");
            }


            try {
                let responseExecutive = await axios.post(direccionNodeExecutive + "/api/logistica/suppliers/addBlockNew", bloqueComun, { headers: headerExecutive });
            } catch (error) {
                MensajeNodeOffline(error, "Node Executive");
            }

            try {
                let responseLogistics = await axios.post(direccionNodeLogistics + "/api/logistica/suppliers/addBlockNew", bloqueComun, { headers: headerLogistics });
            } catch (error) {
                MensajeNodeOffline(error, "Node Logistics");
            }

            let fechaServidor2 = moment();
            fechaServidor2.tz('America/Lima');
            let fechaString2 = fechaServidor2.format('DD/MM/YYYY, HH:mm:ss');

            let diferencia = fecha2.diff(fecha1);
            let duration = moment.duration(diferencia);
            let diferenciaString = `El tiempo de procesamiento del registro del proveedor es: ${duration.hours()} horas, ${duration.minutes()} minutos, ${duration.seconds()} segundos, ${duration.milliseconds()} milisegundos`;

            console.log(diferenciaString);

           // console.log("Transferencia Correcta");
            return res.status(200).json({ "message": "Todo Correcto" });
        }
        else {
            TransaccionErronea(objEnviar);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });
        }
    }

});


//Modify Supplier
routerProveedores.put('/modifySupplier/:id', async (req, res) => {

    const id = req.params.id;
    const objEnviar = req.body;

    /*
    let fecha = new Date();
    let fechaString = fecha.toLocaleString();
*/

    let fechaServidor = moment();
    fechaServidor.tz('America/Lima');
    let fechaString = fechaServidor.format('DD/MM/YYYY, HH:mm:ss');


    objEnviar["date"] = fechaString;

    //-----------------------------------------------------
    //-----------------------------------------------------
    //Enviar informacion a los nodos

    try {
        response1 = await axios.put(direccionNodoConsenso + "/api/logistica/suppliers/ModifySupplier/" + id, objEnviar, { headers: headerconsenso });

    } catch (error) {
        response1 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Consensus");
    }

    try {
        response2 = await axios.put(direccionNodeExecutive + "/api/logistica/suppliers/ModifySupplier/" + id, objEnviar, { headers: headerExecutive });

    } catch (error) {
        response2 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Executive");
    }

    try {
        response3 = await axios.put(direccionNodeLogistics + "/api/logistica/suppliers/ModifySupplier/" + id, objEnviar, { headers: headerLogistics });

    } catch (error) {
        response3 = { status: 404, data: "123" };
        MensajeNodeOffline(error, "Node Logistics");
    }

    //--------------Verificar Consistencia de todos los nodos----------------
    {
        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            && JSON.stringify(response2.data) == JSON.stringify(response3.data)
            && JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {
            //console.log("Todos concuerdan");
        } else {
            //console.log("No concuerdan todos");
            //Envia mensaje
            noConcuerdanTodos(response1.data, response2.data, response3.data);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });
        }
    }

    {
        //console.log("Enviando información a los bloques");

        let bloqueComun;

        if (JSON.stringify(response1.data) == JSON.stringify(response3.data)
            || JSON.stringify(response2.data) == JSON.stringify(response3.data)
            || JSON.stringify(response1.data) == JSON.stringify(response2.data)
        ) {

            if (JSON.stringify(response1.data) == JSON.stringify(response3.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response2.data) == JSON.stringify(response3.data)) {
                bloqueComun = response2.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            if (JSON.stringify(response1.data) == JSON.stringify(response2.data)) {
                bloqueComun = response1.data;
                //console.log("El bloque común es:", bloqueComun);
            }

            //---------------------Enviar Bloque-----------------------

            try {
                let responseConsenso = await axios.post(direccionNodoConsenso + "/api/logistica/suppliers/addBlockModify/" + id, bloqueComun, { headers: headerconsenso });
            } catch (error) {
                //console.log("Hubo un error");
                MensajeNodeOffline(error, "Node Consensus");
            }

            try {
                let responseExecutive = await axios.post(direccionNodeExecutive + "/api/logistica/suppliers/addBlockModify/" + id, bloqueComun, { headers: headerExecutive });
            } catch (error) {
                //console.log("Hubo un error");
                MensajeNodeOffline(error, "Node Consensus");
            }

            try {
                let responseLogistics = await axios.post(direccionNodeLogistics + "/api/logistica/suppliers/addBlockModify/" + id, bloqueComun, { headers: headerLogistics });
            } catch (error) {
                //console.log("Hubo un error");
                MensajeNodeOffline(error, "Node Consensus");
            }

            //console.log("Se modifico el supplier");
            return res.status(200).json({ "message": "Se modificó el proveedor de manera correcta" })

        }
        else {

            TransaccionErronea(objEnviar);
            return res.status(404).json({ "messageError": "No se pudo procesar la transacción" });

        }
    }

});


//--------------------Mensajes de Error-------------------

function MensajeNodeOffline(error, nombreNodo) {

    if (error.code === 'ECONNREFUSED') {

        console.error("Error al enviar la información al servidor. Al menos un nodo esta offline, revisar el estado de los nodos por favor");

        // Detalles del correo electrónico para notificar falla
        let mailOptions = {
            from: 'tp2mensaje@gmail.com', // Remitente
            to: 'tp2mensaje@gmail.com', // Destinatario
            subject: 'Problemas con el nodo: ' + nombreNodo, // Asunto
            text: 'Aparentemente un el nodo' + nombreNodo + 'se encuentra offline, por favor revisar su estado' // Contenido del correo
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                //console.log('Correo electrónico enviado:', info.response);
            }
        });
    } else {
        console.error("Error al enviar la información. Detalles:", error);
    }
}

function noConcuerdanTodos(a, b, c) {
    let mailOptions = {
        from: 'tp2mensaje@gmail.com', // Remitente
        to: 'tp2mensaje@gmail.com', // Destinatario
        subject: 'Problemas de Consistencia entre los bloques de transacción', // Asunto
        text: 'Detalle: \n Response del API nodeConsensus' + a.data + "-------\n Response del API nodeExecutive" + b.data + "-------\n  Response del API nodeLogistics" + c.data// Contenido del correo
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            //console.log('Correo electrónico enviado:', info.response);
        }
    });
}

function TransaccionErronea(objEnviar) {
    let mailOptions = {
        from: 'tp2mensaje@gmail.com', // Remitente
        to: 'tp2mensaje@gmail.com', // Destinatario
        subject: 'Transacción Erronea', // Asunto
        text: 'Detalles de la transacción: ' + objEnviar
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            //console.log('Correo electrónico enviado:', info.response);
        }
    });
}


//-----------------------------------------------------------------------------------------------------
//---------------------------------------------GET----------------------------------------------------


//Obtener todos los suppliers
routerProveedores.get('/getSuppliers', async (req, res) => {

    //-----
    try {
        response1 = await axios.get(direccionNodoConsenso + "/api/logistica/suppliers/getAllSuppliers", { headers: headerconsenso });

    } catch (error) {
        try {
            response1 = await axios.get(direccionNodeExecutive + "/api/logistica/suppliers/getAllSuppliers", { headers: headerExecutive });

        } catch (error) {

            res.status(404).send(error);
        }
    }
    res.status(200).json(response1.data);

});

//Obtener un proveedor en Específico:

routerProveedores.get('/getSupplier/:id', async (req, res) => {

    try {
        response1 = await axios.get(direccionNodoConsenso + "/api/logistica/suppliers/Supplier/" + id, { headers: headerconsenso });

    } catch (error) {
        try {
            response1 = await axios.get(direccionNodeExecutive + "/api/logistica/suppliers/Supplier/" + id, { headers: headerExecutive });
            res.status(200).json(response1.data);
        } catch (error) {

            res.status(404).send(error);
        }
    }

    res.status(200).json(response1.data);

});


module.exports.routerProveedores = routerProveedores;