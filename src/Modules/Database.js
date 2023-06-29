const { STARTING_VALUE } = require("./../Utility/config");
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const fs = require("node:fs");

const DATABASE_FILE_NAME = "StoredData.db";
const DATABASE_FILE_PATH = "StoredData";
const DATABASE_PATH = path.join(__dirname, "..", DATABASE_FILE_PATH, DATABASE_FILE_NAME);

function OpenConnection() {
    return new sqlite3.Database(DATABASE_PATH, sqlite3.OPEN_READWRITE, (error) => {
        if (error) {
            console.error(error);
            return;
        }
    });
}

function init() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(DATABASE_PATH)) {
            if (!fs.existsSync(path.join(__dirname, "..", DATABASE_FILE_PATH))) {
                fs.mkdirSync(path.join(__dirname, "..", DATABASE_FILE_PATH), { recursive: true });
                console.log("created directory");
            }
            fs.writeFileSync(DATABASE_PATH, "");
            console.log("Created file");
        }
        const db = OpenConnection();
        db.exec("CREATE TABLE IF NOT EXISTS Users (id TEXT PRIMARY KEY, money INTEGER, team INTEGER);", (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            console.log("Database initialized successfully");
            return resolve(true);
        });
    });
}

async function FindUser(id) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.all("SELECT * FROM Users WHERE id = ?", String(id), (error, results) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(null);
            }
            return resolve(results[0]);
        });
    });
}

async function GetAllUsers() {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.all("SELECT * FROM Users ORDER BY money", (error, results) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(null);
            }
            return resolve(results);
        });
    });
}

async function UpdateUser(id, NewVal) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.run("UPDATE Users SET money = ? WHERE id = ?", [NewVal, String(id)], (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function CreateUser(id) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.run("INSERT INTO Users (id, money) VALUES ( ? , ? )", [String(id), STARTING_VALUE], (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function DeleteUser(id) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.run("DELETE FROM Users WHERE id = ?", String(id), (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function ClearAllData() {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.exec("DELETE FROM Users", (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function UpdateTeam(teamid, userid) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.run("UPDATE Users SET team = ? WHERE id = ?", [teamid, String(userid)], (error) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

async function GetAllTeamStatistic() {
    return new Promise((resolve) => {
        const db = OpenConnection();
        db.all(
            "SELECT team, SUM(money) AS sum_money FROM Users GROUP BY team ORDER BY sum_money DESC",
            (error, results) => {
                db.close();
                if (error) {
                    console.error(error);
                    return resolve(null);
                }
                return resolve(results);
            }
        );
    });
}

module.exports = {
    init: init,
    FindUser: FindUser,
    GetAllUsers: GetAllUsers,
    CreateUser: CreateUser,
    UpdateUser: UpdateUser,
    DeleteUser: DeleteUser,
    ClearAllData: ClearAllData,
    UpdateTeam: UpdateTeam,
    GetAllTeamStatistic: GetAllTeamStatistic,
};
