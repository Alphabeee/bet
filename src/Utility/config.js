const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    BOT_TOKEN : process.env.TOKEN,
    BOT_ID : process.env.BOTID,
    STARTING_VALUE: 500,
};