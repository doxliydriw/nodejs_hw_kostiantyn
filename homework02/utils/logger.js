import 'dotenv/config';
import colors from 'colors';

class Logger
{
    constructor(prefix = '')
    {
        this.prefix = prefix;
        if (process.env.COLORS_ENABLED === '1') {
            this.colorsEnabled = true
        } else {
            this.colorsEnabled = false
        }
    }

    colorsOn(colorFunc, message)
    {
        return this.colorsEnabled ? colorFunc(message) : message;
    }

    log(message)
    {
        console.log(this.colorsOn(colors.green, `${this.prefix} :`), message);
    }

    warn(message)
    {
        console.log(this.colorsOn(colors.red, `${this.prefix} :`), message);
    }
}

export default Logger;