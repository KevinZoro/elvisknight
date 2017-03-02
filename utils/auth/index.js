'use strict';

import crypto from 'crypto';
import mysql from '../mysql';
import Promise from 'bluebird';
import ElvisError from '../error';
import User from '../../model/user';

export default class Auth{
    constructor(){
        this.sha_text="elvisknight";
    }

    cryptoPasswd(passwd){
        return crypto.createHmac('sha1',this.sha_text).update(passwd).digest().toString('base64');
    }

    authPasswd(email,passwd){
        if(!email||!passwd){
            return Promise.reject(new ElvisError(10001));
        }
        passwd=this.cryptoPasswd(passwd);
        return mysql.queryAsync("SELECT Email,NickName,UserID,Description,Passwd FROM elvis_users WHERE Email=?",email).then(data=>{
            let serverPasswd=data[0]&&data[0].Passwd;
            if(serverPasswd==passwd){
                delete data[0].Passwd;
                return new Promise(resolve=>resolve({
                    code:10000,
                    info:data[0]
                }));
            }else{
                return Promise.reject(new ElvisError(10003));
            }
        }).catch(err=>{
            return Promise.reject(err);
        })
    }
}