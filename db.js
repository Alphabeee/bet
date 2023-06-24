const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("gamedata");
db.serialize(() => {
  db.run("CREATE TABLE players (userid char(20),money INT)");
});
db.close();
