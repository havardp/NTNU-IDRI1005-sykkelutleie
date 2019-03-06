// @flow

import mysql from 'mysql';

let config = {
  host: 'mysql.stud.iie.ntnu.no',
  user: 'g_idri1005_27',
  password: 'zdXpJ1gC',
  database: 'g_idri1005_27'
};

// Setup database server reconnection when server timeouts connection:
export let connection = mysql.createConnection(config);

function setup() {
  // Connect to MySQL-server
  connection.connect(error => {
    if (error) console.error(error); // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error: { code: string }) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      // Reconnect if connection to server is lost
      connection = mysql.createConnection(config);
      setup();
    } else {
      console.error(error);
    }
  });
}
setup();
