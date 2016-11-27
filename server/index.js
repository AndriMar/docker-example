const createApp = require('./app');
const config = require('./config.json');
const r = require('rethinkdb');

const PORT = +(process.env.PORT || '4000');
function createDB(conn) {
  return r.dbList().contains(config.rethinkdb.DB).run(conn).then((containsDb) => {
    if(containsDb){
      console.log('Database exists!');
      return conn;
    } else {
      console.log('Creating db!');
      return r.dbCreate(config.rethinkdb.DB).run(conn).then((conf) => {
        return conn
      })
    }
  })
}
function createTable(conn){
  return r.db(config.rethinkdb.DB).tableList().contains(config.rethinkdb.Table).run(conn).then((containsTable) => {
    if(containsTable){
      console.log('Table exists!')
      return conn
    } else {
      console.log('Creating Table!');
      return r.db(config.rethinkdb.DB).tableCreate(config.rethinkdb.Table).run(conn).then((conf) => {
        return conn;
      })
    }
  })
}
function createIndex(conn) {
    console.log('Creating index!');
    return r.db(config.rethinkdb.DB).table(config.rethinkdb.Table).indexList().contains('createdAt').run(conn).then((hasIndex) => {
      if(hasIndex){
        console.log('Index exists');
        return conn;
      } else {
        r.db(config.rethinkdb.DB).table(config.rethinkdb.Table).indexCreate('createdAt').run(conn)
        .then((conf) => {
          return conn;
        });
      }
    });
  }
function createDbConnection() {
  let dbHost = process.env.DBHOST || 'localhost'
  console.log(`Connecting to database host: ${dbHost}`);
  return r.connect({ host:dbHost })
  .then(createDB)
  .then(createTable)
  .then(createIndex);
}
createDbConnection().then((dbconn) => {
  console.log('Starting app');
  const app = createApp(dbconn,config);
  app.listen(PORT, () => {
    console.log(`Server starting on port: ${PORT}`);
    console.log(`Server running in mode: ${process.env.NODE_ENV}`);
  });
}).catch((err) => {
  console.error('Error conncting to db!');
  console.error(err);
})
