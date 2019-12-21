import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import baseurl from '../../baseurl';
import './index.css';
import {message} from "antd";
class GetTel extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinstatus:false
        }
    }

    handleClick = () =>{
       this.obj = {
           mobile:this.state.mobile,
           captcha_code:this.state.captcha_code,
           captcha_key:this.state.captcha_key
       }
       this.setState({spinstatus:true})
       axios({
           method: 'post',
           url: baseurl+'api/sms/verify',
           headers: {
               "Content-Type": "application/x-www-form-urlencoded"
           },
           data: qs.stringify(this.obj)
       }).then((response)=>{
           if (response.data.status){
               const number = response.data.data.match(/\d/g).join("")
               this.setState({hideTelCode:number})
           }else {
               message.error(response.data.data)
           }
           this.setState({spinstatus:false})
       }).catch((error)=>{
           message.error(error);
           this.setState({spinstatus:false})
       });
   }

    init = () =>{
        axios.get(baseurl+'api/captcha')
            .then((response) => {
                this.setState({url:response.data.data.url,captcha_key:response.data.data.key})
            })
            .catch(function (error) {
                message.error(error)
            })
    }

    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <div>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{textAlign:'right'}}>输入验证码：</td>
                                <td>
                                    <Input
                                        className={"PicNumber"}
                                        type="text"
                                        value={this.state.captcha_code}
                                        onChange={(e)=>{this.setState({captcha_code:e.target.value})}}
                                    />


                                </td>
                                <td><div className={"PicImg"}><img src={this.state.url} alt="努力加载中"/></div></td>
                                <td><Button onClick={this.init} type="default">重新获取验证码</Button></td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'right'}}>
                                    {this.props.msg}：
                                </td>
                                <td>
                                    <Input.Search
                                        className={"TelNumber"}
                                        value={this.state.mobile}
                                        onChange={(e)=>{this.setState(
                                            {mobile:e.target.value},
                                            ()=>{this.props.send({mobile:this.state.mobile})}
                                        )}}
                                        onSearch={this.handleClick}
                                        enterButton={"获取手机验证码"}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'right'}}>输入手机验证码：</td>
                                <td>
                                    <Input
                                        className={"telCode"}
                                        type="text"
                                        value={this.state.telCode}
                                        onChange={(e)=>{this.setState(
                                            {telCode:e.target.value},
                                            ()=>{this.props.send({telcode:this.state.telCode})}
                                        )}}
                                    />
                                </td>
                                <td>
                                    <Button type={'default'} onClick={()=>{this.setState(
                                        {telCode:this.state.hideTelCode},
                                        ()=>{this.props.send({telcode:this.state.telCode})}
                                    )}}
                                    >自动填充</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        );
    }
}

export default GetTel;