class Exceptions {
    static get MISSING_OPTION_EXCEPTION() {
        return function(missing_value) {
            return new Error(`Please provide a value for ${missing_value} in the Bot constructors options, or in the .env file.`)
        }
    }

    static get MISSING_DATA_EXCEPTION() {
        return new Error("Please provide a 'data' value in your command object.")
    }

    static get MISSING_COMMAND_EXCEPTION() {
        return new Error("Please provide a 'command' method in your command object.")
    }
}

module.exports ={
    Exceptions
}