import 'dotenv/config';
import fs from 'fs';
import colors from 'colors';
import path from 'path';

class Logger
{
    constructor(prefix = '')
    {
        this.prefix = prefix;
        const logsDir = path.resolve('./logs');
        if (process.env.COLORS_ENABLED === '1') {
            this.colorsEnabled = true
        } else {
            this.colorsEnabled = false
        }
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
        this.logStream = fs.createWriteStream(path.join(logsDir, 'server.log'), {
            flags: 'a',
        });
    }

    writeToFile(message)
    {
        const timestamp = new Date().toISOString();
        this.logStream.write(`[${timestamp}] ${message}\n`);
    }

    colorsOn(colorFunc, message)
    {
        return this.colorsEnabled ? colorFunc(message) : message;
    }

    log(message)
    {
        const formattedMessage = `${this.prefix} : ${message}`;
        console.log(this.colorsOn(colors.green, formattedMessage));
        this.writeToFile(`[INFO] ${formattedMessage}`);
    }

    warn(message)
    {
        console.log(this.colorsOn(colors.red, `${this.prefix} :`), message);
        const formattedMessage = `${this.prefix} : ${message}`;
        this.writeToFile(`[WARN] ${formattedMessage}`);
    }
    close()
    {
        this.logStream.end();
    }
}

export default Logger;