/**
 * Logs the string given if we are in development environment
 * @param text Text to console.log
 */
export const printText = (text) => {
    if(process.env.NODE_ENV === 'development') {
        console.log(text)
    }
}