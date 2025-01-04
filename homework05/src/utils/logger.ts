import colors from "colors/safe";

export default function getLogger ( moduleName: string )
{
    return {
        log ( message: string, ...args )
        {
            console.log( `${moduleName}: ${message}`, ...args );
        },
        warn ( message: string, ...args )
        {
            console.error( colors.red( `${moduleName}: ${message}` ), ...args );
        },
        error ( message: string, ...args )
        {
            console.error( colors.red( `${moduleName}: ${message}` ), ...args );
        }
    };
}