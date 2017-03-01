'use strict';
import mysql from '../utils/mysql';

export default class User{
    constructor(){
        this.NickName="";
        this.UserID=null;
        this.Avatar="";
        this.Description="";
        this.Email="";
    }

    _checkUser(email){//检查用户是否已创建
        if(!email){
            return Promise.reject(new Error({
                code:10001,
                message:"非法输入!"
            }))
        }
        return mysql.queryAsync("SELECT count(*) as count FROM elvis_users WHERE Email=?",email).then(results=>{
            console.log(results);
            return new Promise(resolve=>resolve(results[0].count>0));
        })
    }
    CreateUser(options){//创建用户
        return this._checkUser(options.Email).then(isRegistered=>{
            if(!isRegistered){
                return mysql.queryAsync("INSERT INTO elvis_users SET ?",options)
            }else{
                return new Promise((resolve,reject)=>{
                    reject(new Error(JSON.stringify({
                        code:10002,
                        message:"该邮箱已被注册!"
                    })));
                })
            }
        })
        
    }

    UpdateUserInfo(info,email){
        return mysql.queryAsync("UPDATE elvis_users SET ? WHERE Email=?",[info,email])
    }

    GetUserInfo(userId){
        let self = this;
        return mysql.queryAsync("SELECT * from elvis_users WHERE UserID=?",userId).then(results=>{
            return new Promise(resolve=>resolve(results[0]||self));
        })
    }
}



