import React, {Component} from 'react';
import GetTel from '../../../../../Components/GetTel';
import PassWord from '../../../../../Components/PassWord';
import Button from 'antd/es/button';
import baseurl from '../../../../../baseurl';
import axios from 'axios';
import qs from 'qs';
import {message} from "antd";
import {createHashHistory} from "history";
class ResetTel extends Component {
    constructor(props){
        super(props);
        this.state = {
            //{mobile,telcode,password}
        }
    }

    handleReset = () => {
        const obj = {
            mobile:this.state.mobile,
            verify:this.state.telcode,
            password:this.state.password
        }
        axios({
            method: 'post',
            url: baseurl+'api/user/mobile?token='+localStorage.getItem('token'),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify(obj)
        }).then((response)=>{
            if(response.data.status){
                message.success("修改成功")
                createHashHistory().push('/personal_details')
            }else {
                message.error(response.data.data)
            }
        }).catch((error)=>{
            message.error(error)
        });
    }
    handleSend = (data)=>{
        this.setState({...data})
    }
    render() {
        return (
            <div style={{margin:'0 auto'}}>
                <GetTel send={this.handleSend} msg={'请输入新的手机号'}/>
                <div style={{marginLeft:'87px'}}><PassWord send={this.handleSend}/></div>
                <Button style={{marginTop:'20px',marginLeft:'87px'}} type={'primary'} onClick={this.handleReset}>更换手机号</Button>
            </div>
        )

    }
}

export default ResetTel;
