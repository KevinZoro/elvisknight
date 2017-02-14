'use strict';
import mysql from 'mysql';
import config from '../../db/config';
import Pool from 'mysql/lib/Pool';
import Connection from 'mysql/lib/Connection';
import Promise from 'bluebird';

Promise.promisifyAll([Pool, Connection]);

var pool = mysql.createPool(config.mysql);

pool.on('enqueue', function () {
    // console.log('Waiting for available connection slot');
});

module.exports = {
    query: function (sql, callback) {
        pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, result) {
                connection.release();
                callback(err, result);
            });
        });
    },
    queryWithParam: function (sql, arr, callback) {
        pool.getConnection(function (err, connection) {
            connection.query(sql, arr, function (err, result) {
                connection.release();
                callback(err, result);
            });
        });
    },
    escape: function (str) {
        return pool.escape(str);
    },
    transferData: function (obj) {
        var toArray = [];
        for (var key in obj) {
            toArray.push(obj[key]);
        }
        return toArray;
    },
    queryAsync: function (sql, param) {
        return pool.getConnectionAsync().then(function (connection) {
            connection.release();
            return connection.queryAsync(sql, param)
        })
    }
};
