 import React, {Component} from 'react';
import axios from 'axios';
import baseurl from '../../../../../baseurl';
import './index.css';
import {Link} from 'react-router-dom';
import {Descriptions, Input, Avatar, Button, Icon, Divider, message} from "antd";
 import qs from 'qs';
class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            show:true
        }
    }
    init =()=>{
        axios.get(baseurl+'api/user/profile?token='+localStorage.getItem('token'))
            .then((response)=> {
                this.setState({
                    avatar_url:response.data.data.avatar_url,
                    nickname:response.data.data.nickname,
                    mobile:response.data.data.mobile
                })
                this.props.change({avatar_url:response.data.data.avatar_url})
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    setNickname=()=>{
        axios({
            method: 'post',
            url: baseurl+'api/user/profile/update?token='+localStorage.getItem('token'),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify({nickname:this.state.nickname})
        }).then((response)=>{
            this.props.change({nickname:this.state.nickname})
            message.success("修改成功")
        }).catch((error)=>{
            message.error(error)
        });
    }

    setPassword=()=>{
        axios({
            method: 'post',
            url: baseurl+'api/user/password?token='+localStorage.getItem('token'),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: qs.stringify({password:this.state.password,new_password:this.state.new_password})
        }).then((response)=>{
            if (response.data.status){
                message.success("修改成功")
            }else {
                message.error(response.data.data)
            }
        }).catch((error)=>{
            message.error(error)
        });
    }

    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <div className={'PersonalInfo'}>
                <div className={'info'}>
                    <Avatar src={this.state.avatar_url} alt="努力加载中" className={'head_img'}/>
                    <Link to={'/personal_details/changeImg'}><div className={'hide'}>修改头像</div></Link>
                    {this.state.show?(
                        <span style={{marginLeft:'10px',fontSize:'16px'}}>
                            <span>{this.state.nickname}</span>
                            <Icon type={'edit'} style={{cursor:'pointer'}} onClick={()=>{
                                this.setState({show:false})
                            }}/>
                        </span>
                    ):(
                        <span style={{marginLeft:'10px',fontSize:'14px'}}>
                            <Input
                                style={{width:'150px'}}
                                className={this.state.nickname}
                                type={'text'}
                                value={this.state.nickname}
                                onChange={(e)=>{
                                    this.setState({nickname:e.target.value})
                                }}
                            />
                            <span style={{marginLeft:'10px', cursor:'pointer',color:'#1890ff'}}
                                  onClick={()=>{
                                      this.setState({show:true})
                                      this.setNickname()
                                  }}
                            >确认</span>
                            <Divider type={'vertical'}/>
                            <span style={{cursor:'pointer',color:'#1890ff'}}
                                  onClick={()=>{
                                      this.setState({show:true})
                                  }}
                            >取消</span>
                        </span>
                    )}

                </div>
                <Descriptions title={'账号安全'} bordered style={{marginTop:'30px'}}>
                    <Descriptions.Item label="手机号码" span={3}>
                        <span style={{marginRight:'10px'}}>{this.state.mobile}</span>
                        <Link to={'/personal_details/resetTel'}>
                            <Icon type={'edit'} />
                        </Link>
                    </Descriptions.Item>

                    <Descriptions.Item label="密码">
                        <table style={{width:'25%'}}>
                            <tbody>
                            <tr >
                                <td style={{textAlign:'right'}}>输入当前密码：</td>
                                <td>
                                    <Input.Password
                                        style={{width:200}}
                                        value={this.state.password}
                                        onChange={(e)=>{this.setState({password:e.target.value})}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'right'}}>
                                    输入新密码：
                                </td>
                                <td>
                                    <Input.Password
                                        style={{width:200}}
                                        value={this.state.new_password}
                                        onChange={(e)=>{this.setState({new_password:e.target.value})}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={{textAlign:'right'}}><Button icon={'edit'} onClick={this.setPassword}>修改密码</Button></td>
                            </tr>
                            </tbody>
                        </table>

                    </Descriptions.Item>
                </Descriptions>
            </div>
        );
    }
}

export default Index;