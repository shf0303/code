import React, {Component} from 'react';
import GetTel from '../../../Components/GetTel';
import LoginName from '../../../Components/LoginName';
import PassWord from '../../../Components/PassWord';
import './index.css';
import baseurl from '../../../baseurl';
import axios from 'axios';
import qs from 'qs';
import Button from 'antd/es/button';
import {message} from 'antd';
import {createHashHistory} from 'history';
class Register extends Component {
    constructor(props){
        super(props);
        this.state={
        }  //不用写，下面会添加覆盖，但是state得声明
    }

    handleSend = (data) =>{
        this.setState({...data}); //setState函数是异步的！
    }

    handleRegister = ()=>{
        const obj = {
            mobile:this.state.mobile,
            verify:this.state.telcode,
            password:this.state.password,
            nickname:this.state.loginname
        }
        axios({
            method: 'post',
            url: baseurl+'api/user/register',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify(obj)
        }).then((response)=>{
            message.success("注册成功");
            window.localStorage.setItem("token",response.data.data.token);
            localStorage.setItem("user_id",response.data.data.id)
            this.props.send({token:window.localStorage.getItem("token")});
            createHashHistory().push("/");
        }).catch((error)=>{
            message.error("输入验证码不正确！");
        });
    }

    componentDidMount() {
        this.props.change({current_key:"2"})
    }

    render() {
        return (
            <div className={"register"}>
                <GetTel send={this.handleSend} msg={'请输入手机号'}/>
                <LoginName send={this.handleSend} />
                <PassWord send={this.handleSend} />
                <Button type={'primary'} className={'register-btn'} onClick={this.handleRegister}>注册</Button>
            </div>
        );
    }
}

export default Register;