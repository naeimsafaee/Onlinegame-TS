module.exports = {
    'default': "mysql",
    'connections': {
        'mysql': {
            'driver': 'mysql',
            'url': "",
            'host': process.env.DB_HOST,
            'port': process.env.DB_PORT,
            'database': process.env.DB_NAME,
            'username': process.env.DB_USER,
            'password': process.env.DB_PASS,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci',
        },

    },
};
