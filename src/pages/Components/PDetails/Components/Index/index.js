 import React, {Component} from 'react';
import './index.css';
import {Link} from 'react-router-dom';
import {Descriptions, Input, Avatar, Button, Icon, Divider, message,Spin} from "antd";
 import {ajax_get, ajax_post} from "../../../../../axios";
class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            show:true,
            spinStatus:false
        }
    }
    init =()=>{
        this.setState({spinStatus:true})
        ajax_get(
            'api/user/profile?token='+localStorage.getItem('token'),
            (data)=>{
                this.setState(
                    {
                        avatar_url:data.avatar_url,
                        nickname:data.nickname,
                        mobile:data.mobile
                    },
                    ()=>{
                        this.props.change({avatar_url:this.state.avatar_url})
                    })
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinStatus:false})
            }
        )
    }

    setNickname=()=>{
        this.setState({spinStatus:true})
        ajax_post(
            'api/user/profile/update?token='+localStorage.getItem('token'),
            (data)=>{
                this.props.change({nickname:this.state.nickname})
                message.success("修改成功")
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinStatus:false})
            },
            {nickname:this.state.nickname}
        )
    }

    setPassword=()=>{
        this.setState({spinStatus:true})
        ajax_post(
            'api/user/password?token='+localStorage.getItem('token'),
            (data)=>{
                message.success("修改成功")
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinStatus:false})
            },
            {password:this.state.password,new_password:this.state.new_password}
        )
    }

    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <Spin tip={"loading"} spinning={this.state.spinStatus} >
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
            </Spin>

        );
    }
}

export default Index;