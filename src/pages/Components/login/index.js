import React from 'react';
import './index.css';
import{Form, Icon, Input, Button,message,Spin} from "antd";
import {createHashHistory} from 'history';
import {ajax_get, ajax_post} from "../../../axios";
import {Link} from "react-router-dom";


class LoginForm extends React.Component {
    constructor(props){
        super(props)
        this.state={
            captcha:false,
            spinStatus:false
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.captcha_key=this.state.captcha_key
                this.setState({spinStatus:true})
                ajax_post(
                    'api/user/token/mobile',
                    (data)=>{
                        message.success("登录成功")
                        window.localStorage.setItem("token",data.token);
                        this.props.init(); //让首页初始化更新页面
                        window.localStorage.setItem("user_id",data.id)
                        createHashHistory().push('/')
                    },
                    (err)=>{
                        if(err.code === 'INVALID_CAPTCHA'){
                            this.getCaptcha();
                            this.setState({captcha:true})
                        }else {
                            message.error(err.data)
                        }
                    },
                    ()=>{
                        this.setState({spinStatus:false})
                    },
                    values)
            }
        });
    };


    getCaptcha=()=>{
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
            })

    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={'form-box'}>
                <Spin tip={'loading'} spinning={this.state.spinStatus}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('mobile', {
                                rules: [{ required: true, message: '请输入手机号' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入手机号码"
                                />,
                            )}
                        </Form.Item>

                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="请输入密码"
                                />,
                            )}
                        </Form.Item>

                        {this.state.captcha?(
                            <Form.Item>
                                {getFieldDecorator('captcha_code', {
                                    rules: [{ required: true, message: '请输入验证码' }],
                                })(
                                    <div>
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="请输入验证码"
                                        />
                                        <img src={this.state.url} alt="努力加载中"/>
                                        <Button onClick={this.getCaptcha} type="default">重新获取验证码</Button>
                                    </div>
                                )}
                            </Form.Item>
                        ):(null)}

                        <Form.Item>
                            <Link className="login-form-forgot" to={'/findpassword'}>
                                忘记密码
                            </Link>
                            <Link to={'/register'}>注册</Link>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}

const Login = Form.create({ name: 'login' })(LoginForm);
export default Login;