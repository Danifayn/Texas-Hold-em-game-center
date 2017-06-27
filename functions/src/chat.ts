import * as assign from 'object.assign';
export class chatMsg {
    uid: string = "";
    message: string = "";

    constructor(id?: string, msg?: string) {
        this.uid = id;
        this.message = msg;
    }
    
    static from(json: any): chatMsg {
        let chat: chatMsg = assign(new chatMsg(), json);
        return chat;
    }
}