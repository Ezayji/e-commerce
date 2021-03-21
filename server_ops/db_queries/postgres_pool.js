if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Initialize Postgres pool
const Pool = require('pg').Pool;

const devConfig = { 
    connectionString: `postgresql://${process.env.PG_USER}:${process.env.PG_PW}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}` 
};

const prodConfig = { 
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    } 
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);

module.exports = pool;