
//const direccionNodoConsenso="http://127.0.0.1:3000";
const direccionNodoConsenso="https://five-server-consenso.onrender.com";


//const direccionNodeExecutive="http://127.0.0.1:3008";
const direccionNodeExecutive="https://api-nodeexecutive.onrender.com";

//const direccionNodeLogistics="http://127.0.0.1:3010";
const direccionNodeLogistics="https://api-nodelogistics.onrender.com"


const certificadoDigital={
    details: {
      Name: 'Api Central Logistica',
      CA_Name: 'CA_Commerce',
      Expire: '10/12/2024'
    },
    digital_signature: 'dNDOVImj4LJ6+i3RUp0tSINnA5lQjcVM9FK6Db66XhuF43q/u7lWLt8NSlmPCDkSWzDZqWZ695n8aglrpVrWs9UZodZSuq0vG65zlhKPQGAf8rNvm4M8Z6wD7lG3Iw0Ks8kF67tpUBTp+qrNxgeDwbQkbwGVbWCnvc9B/a1/5J8Nx6olWtBpjwR95LhBcMCM0eL47o4Qi/BIiNkp3l8Tcfsr0tM/z+q9MfDhK3qfxjWv1aBk4RDUVWTbn250Jlab+0wN7MHe4OyUPwbKMvk2pU/PU8CspuV3LHao+iENwY6HAYBwNSUemiVwgP5fp3CoqDpB5srRVABBZRMaaQNvbQ=='
  }

module.exports={
    certificadoDigital,
    direccionNodoConsenso,
    direccionNodeLogistics,
    direccionNodeExecutive
}