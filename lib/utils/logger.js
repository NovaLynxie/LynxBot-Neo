const { createLogger, addColors, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { name: appName } = require("../../package.json");
//const { addColors } = require("winston/lib/winston/config");
const parentdir = "./logs";
const timestamp = "YYYY-MM-DD HH:mm:ss";
const getTimeZone = () => new Date().toLocaleString(
    Intl.DateTimeFormat().resolvedOptions().locale,
    { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
);
const customLevels = {
    colors: {
        error: "red",
        warn: "yellow",
        info: "white",
        data: "grey",
        debug: "blue",
        verbose: "magenta"
    },
    levels: {
        info: 0,
        warn: 1,
        error: 2,
        debug: 3,
        data: 4,
        verbose: 5
    }
};
addColors(customLevels.colors);
const customOutputFormat = format.printf(({ processName, serviceName, level, message, timestamp }) => `${timestamp} [${processName}/${serviceName}] (${level}): ${message}`);
const logger = (service = "") => 
    createLogger({
        defaultMeta: {
            processName: appName ?? "discordjs-v14-app",
            serviceName: service ? service : "runtime"
        },
        levels: customLevels.levels,
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.timestamp({ format: "HH:mm:ss" }),
                    customOutputFormat
                ),
                level: (Object.keys(customLevels.levels).includes(process.env.LOG_LEVEL)) ? process.env.LOG_LEVEL : "error"
            }),
            new transports.DailyRotateFile({
                filename: `${parentdir}/debug-%DATE%.log`,
                format: format.combine(
                    format.timestamp({ format: timestamp }),
                    customOutputFormat
                ),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: "debug"
            }),
            new transports.DailyRotateFile({
                filename: `${parentdir}/latest-%DATE%.log`,
                format: format.combine(
                    format.timestamp({ format: timestamp }),
                    customOutputFormat
                ),
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: "info"
            })
        ]
    });
module.exports = logger;