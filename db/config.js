module.exports = {
    mysql: {
        user: 'root',
        password: '123321',
        host: '127.0.0.1',
        port: '3306',
        database: 'elvis_db',
        multipleStatements: true,
        connectionLimit: 20,
        charset: "UTF8MB4_GENERAL_CI"
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
}