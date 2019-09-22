var mysqlModel = require('mysql');

var MyAppModel = mysqlModel.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gps_hydrabad',
  });

  module.exports.db = {MyAppModel}

// let config = 


// const mysql = require( 'mysql' );
// class Database {
//     constructor(){
//         this.connection = mysql.createConnection( {
//           host     : 'localhost',
//           user     : 'root',
//           password : '',
//           database : 'teamup'
//         } );
//     }

//     getConnectMethod(){
//        return this.connection;
//     }

//     query( sql, args ) {
//         return new Promise( ( resolve, reject ) => {
//             this.connection.query( sql, args, ( err, rows ) => {
//                 if ( err )
//                     return reject( err );
//                 resolve( rows );
//             } );
//         } );
//     }
//     close() {
//         return new Promise( ( resolve, reject ) => {
//             this.connection.end( err => {
//                 if ( err )
//                     return reject( err );
//                 resolve();
//             } );
//         } );
//     }
// }
// const MyAppModel = new Database();
// module.exports.db = {MyAppModel}


const QueryBuilder = require('node-querybuilder');
const settings = {
    host: 'localhost',
    database: 'teamup',
    user: 'root',
    password: ''
};
const qb = new QueryBuilder(settings, 'mysql', 'single');

module.exports ={qb}