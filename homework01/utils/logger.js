class Logger
{
    constructor(prefix = '')
    {
        this.prefix = prefix;
    }

    log(message)
    {
        console.log(`${this.prefix} ${message}`);
    }

    warn(message)
    {
        console.error(`${this.prefix} ${message}`);
    }
}

module.exports = Logger;