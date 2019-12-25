import baseurl from "./baseurl";
import axios from 'axios';
import {message} from "antd";
import qs from 'qs';
import {createHashHistory} from "history";
const ajax_get=(url,successFn,failFn,changeStatus,params)=>{
        axios({
            method:'get',
            url:baseurl+url,
            params:params,
        }).then((response)=>{
            if(response.data.status){
                successFn(response.data.data)
                changeStatus()
            }else {
                if(response.data.code === 'INVALID_TOKEN'){
                    createHashHistory().push('/login')
                    changeStatus()
                }else{
                    failFn(response.data)
                    changeStatus()
                }
            }
        }).catch((err)=>{
            changeStatus()
            console.log(err)
            message.error("网络错误，请检查你的网络")  //
        })
}




const ajax_post = (url,successFn,failFn,changeStatus,data)=>{
    axios({
        method:'post',
        url:baseurl+url,
        data:qs.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }).then((response)=>{
        if(response.data.status){
            successFn(response.data.data)
            changeStatus()
        }else {
            if(response.data.code === 'INVALID_TOKEN'){
                createHashHistory().push('/login')
                changeStatus()
            }else{
                failFn(response.data)
                changeStatus()
            }
        }
    }).catch((err)=>{
        changeStatus()
        console.log(err)
        message.error("网络错误，请检查你的网络")
    })
}


export {ajax_get,ajax_post};

