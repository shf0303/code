import React, {Component} from 'react';
import './index.css';
import Button from 'antd/es/button';
import {ajax_get, ajax_post} from '../../../axios';
import {Link} from "react-router-dom";
import {message, Form, Input,Spin} from "antd";
import {createHashHistory} from "history";


class RegisterForm extends Component{

    constructor(props) {
        super(props);
        this.state={
            spinStatus:false
        }
    }

    //处理提交事件
    handleSubmit=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                delete values.captcha_code
                this.setState({spinStatus:true})
                ajax_post(
                    "api/user/register",
                    (data)=>{
                            message.success("注册成功")
                            window.localStorage.setItem("token",data.token);
                            this.props.init();  //让首页初始化更新页面
                            window.localStorage.setItem("user_id",data.id)
                            createHashHistory().push('/')
                        },
                    (err)=>{
                            message.error(err.data)
                        },
                    ()=>{
                        this.setState({spinStatus:false})
                    },
                    values)
            }
        })
    }

    //获取图形验证码
    init=()=>{
        this.setState({spinStatus:true})
        ajax_get(
            'api/captcha',
            (data)=>{
                this.setState({url:data.url,captcha_key:data.key})
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinStatus:false})
            }
        )
    }

    //获取手机验证码
    getVerify=()=>{
        this.props.form.validateFields(["mobile","captcha_code"],(err, values) => {
            if (!err) {
                values.captcha_key=this.state.captcha_key
                this.setState({spinStatus:true})
                ajax_post(
                    "api/sms/verify",
                    (data)=>{
                        message.success(data)
                    },
                    (err)=>{
                        if(err.data==='INVALID_CAPTCHA'){
                            message.error("图形验证码错误")
                        }else {
                            message.error(err.data)
                        }
                    },
                    ()=>{
                        this.setState({spinStatus:false})
                    },
                    values)
            }
        })
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const { getFieldDecorator } = this.props.form;

        return(
            <Spin spinning={this.state.spinStatus} tip={"loading"}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} >
                    <Form.Item label={"图形验证码"}>
                        {getFieldDecorator('captcha_code', {
                            rules: [{ required: true, message: '请输入验证码' }],
                        })(
                            <div>
                                <Input
                                    placeholder="请输入验证码"
                                    style={{maxWidth:300}}
                                />
                                <img src={this.state.url} alt="努力加载中"/>
                                <Button onClick={this.init} type="default">重新获取验证码</Button>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item label="手机号">
                        {getFieldDecorator('mobile', {
                            rules: [{ required: true, message: '请输入手机号' }],
                        })(<Input.Search
                            onSearch={this.getVerify}
                            enterButton={"获取手机验证码"}
                            style={{maxWidth:300}}
                        />)}
                    </Form.Item>

                    <Form.Item label="手机验证码">
                        {getFieldDecorator('verify', {
                            rules: [{ required: true, message: '请输入手机验证码' }],
                        })(<Input
                            style={{maxWidth:300}}
                        />)}
                    </Form.Item>
                    <Form.Item label="昵称">
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入昵称' }],
                        })(<Input
                            style={{maxWidth:300}}
                        />)}
                    </Form.Item>
                    <Form.Item label="密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(<Input.Password
                            style={{maxWidth:300}}
                        />)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            注册
                        </Button>
                        <Link to={'/login'} style={{marginLeft:200}}>登录</Link>
                    </Form.Item>
                </Form>
            </Spin>

        )
    }
}


const Register = Form.create({ name: 'register' })(RegisterForm);
export default Register;

