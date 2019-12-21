import React, {Component} from 'react';
import GetTel from '../../../Components/GetTel';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import axios from 'axios';
import qs from 'qs';
import baseurl from '../../../baseurl';
import {message} from 'antd';
import {createHashHistory} from 'history';
class Findpwd extends Component {
    constructor(props){
        super(props);
        this.state={
            /*telcode password mobile  */
        }
    }

    handleSend = (data)=>{
        this.setState({...data});
    }
    handleClick=()=>{
        axios({
            method:'post',
            url:baseurl+'api/user/token/sms',
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data:qs.stringify({
                mobile:this.state.mobile,
                verify:this.state.telcode,
                password: this.state.password
            })
        }).then((response)=>{
            message.success("修改成功")
            createHashHistory().push("/login")
        })
    }
    render() {
        return (
            <div>
                <GetTel msg={"输入手机号"} send={this.handleSend}/>
                输入新密码：<Input.Password
                                style={{width:200}}
                                value={this.state.password}
                                onChange={(e)=>{
                                    this.setState({password:e.target.value})
                                }}
                />
                <div><Button onClick={this.handleClick}>重置密码</Button></div>
            </div>
        );
    }
}

export default Findpwd;