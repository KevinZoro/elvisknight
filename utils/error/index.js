'use strict';

export default class ElvisError{
    constructor(code,message){
        Error.call(this);
        if(!message){
            switch(code){
                case 10001:
                    message="缺少参数";
                    break;
                case 10002:
                    message="该用户已注册";
                    break;
                case 10003:
                    message="密码不正确";
                    break;
                default:
                    code=10000;
                    message="everything is right";
                    break;
            }
        }
        
        this.message = JSON.stringify({
            code:code,
            message:message
        })
    }
}