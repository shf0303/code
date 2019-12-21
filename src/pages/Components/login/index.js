import React, {Component} from 'react';
import Pics from '../../../Components/Pics';
import './index.css';
import{Input,Button} from "antd";
import Password from '../../../Components/PassWord';
import axios from 'axios';
import baseurl from '../../../baseurl';
import qs from 'qs';
import {createHashHistory} from 'history';
import {message} from 'antd';
import {Link} from 'react-router-dom'
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    handleSend = (data)=>{
        this.setState({...data})
    }

    handleLogin = ()=>{
        const obj = {
            mobile:this.state.mobile,
            password:this.state.password,
            captcha_code: this.state.captcha_code,
            captcha_key: this.state.captcha_key
        }
        axios({
            method: 'post',
            url: baseurl+'api/user/token/mobile',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify(obj)
        }).then((response)=>{
            if(response.data.status){
                message.success("登陆成功");
                window.localStorage.setItem("token",response.data.data.token);
                this.props.send({token:window.localStorage.getItem("token")});
                localStorage.setItem("user_id",response.data.data.id)
                createHashHistory().push("/");
            }else{
                message.error("账号密码不匹配！");
            }
        })
    }

    componentDidMount() {
        this.props.change({current_key:"3"})
    }

    render() {
        return (
            <div className={'login'}>
                <Pics send={this.handleSend}></Pics>
                手机号码：<Input className={'input-mobile'} value={this.state.mobile} onChange={(e)=>{this.setState({mobile:e.target.value})}} />
                <Password send={this.handleSend}></Password>
                <Button type={'primary'} onClick={this.handleLogin}>登录</Button><Link to={'/findpassword'}>？忘记密码</Link>
            </div>
        );
    }
}

export default Login;