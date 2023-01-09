import { Connection, createConnection } from "mysql";

const connection : Connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'heroes'
});

export {
    connection
}