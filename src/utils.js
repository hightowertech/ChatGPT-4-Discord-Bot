
/**
 * Method for splitting text into chunks
 * @param {String} text String you would like to chunk
 * @param {Number?} maxLength Max length that each part of the message can be
 * @returns {Array<String>} Return value is the chunks in an array of strings
 */
function splitTextIntoChunks(text, maxLength=2000) {
    /**
     * @type {Array<Array<String>>}
     */
    let chunks = []

    /**
     * Iterates over the string and chunks it
     */
    for (let i = 0; i < text.length; i += maxLength) {
        chunks.push(text.slice(i, i + maxLength))
    }

    return chunks
}

module.exports = {
    splitTextIntoChunks
}