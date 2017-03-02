'use strict';
import mysql from '../utils/mysql';
import Auth from '../utils/auth';
import ElvisError from '../utils/error';
import _ from 'lodash';

export default class User{
    constructor(obj){
        if(obj){
            _.forEach(obj,(value,key)=>{
                this[key]=value;
            })
        }else{
            this.NickName="";
            this.UserID=null;
            this.Avatar="";
            this.Description="";
            this.Email="";
            this.Passwd="";
        }
    }

    _checkUser(email,Passwd){//检查用户是否已创建
        if(!email||!Passwd){
            return Promise.reject(new EvilsError(10001))
        }
        return mysql.queryAsync("SELECT count(*) as count FROM elvis_users WHERE Email=?",email).then(results=>{
            console.log(results);
            return new Promise(resolve=>resolve(results[0].count>0));
        })
    }
    CreateUser(options){//创建用户
        return this._checkUser(options.Email,options.Passwd).then(isRegistered=>{
            if(!isRegistered){
                let auth = new Auth();
                options.Passwd=auth.cryptoPasswd(options.Passwd)
                return mysql.queryAsync("INSERT INTO elvis_users SET ?",options)
            }else{
                return new Promise((resolve,reject)=>{
                    reject(new ElvisError(10002));
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

    Login(email,passwd){
        let auth = new Auth();
        return auth.authPasswd(email,passwd)
    }
}



