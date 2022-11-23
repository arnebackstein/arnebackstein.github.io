export class InputStream{
    constructor(text) {
        this.text = text;
        this.cursor = 0;
    }

    /**
     * Read the next character from the stream
     * and increment the cursor.
     * @returns {null|string} the next character or null
     * if the stream has no more characters
     */
    read(){
        if(this.cursor < this.text.length) return this.text[this.cursor++];
        this.cursor++;
        return null;
    }

    /**
     * Reverse the last read, so that the next read
     * returns the same character again.
     */
    unread(){
        if(this.cursor > 0) this.cursor--;
    }

    /**
     * If the next character equals c it is
     * returned and the cursor incremented
     * otherwise it returns null and does not
     * increment the cursor
     * @param c the character to peek for
     * @returns {null|string} null if the next character
     * is not c else c
     */
    peek(c){
        if(this.read() === c) return c;
        this.unread();
        return null;
    }
}