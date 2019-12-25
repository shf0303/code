import React, {Component} from 'react';
import Button from 'antd/es/button';
import {Col, Form, message, Row, Spin} from "antd";
import {createHashHistory} from "history";
import Input from "antd/es/input";
import {Link} from "react-router-dom";
import {ajax_get, ajax_post} from "../../../../../axios";
class ResetForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            spinStatus:false
        }
    }


    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({spinStatus:true})
                ajax_post(
                    'api/user/mobile?token='+localStorage.getItem("token"),
                    (data)=>{
                        message.success("重置成功")
                        createHashHistory().push("/personal_details")
                    },
                    (err)=>{
                        if(err.status===false){
                            message.error(err.data)
                        }else{
                            console.log(err)
                        }
                    },
                    ()=>{
                        this.setState({spinStatus:false})
                    },
                    values)
            }
        })
    }

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
            })
    }

    componentDidMount() {
        this.init();
    }

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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={'form-box'}>
                <Spin tip={'loading'} spinning={this.state.spinStatus}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item >
                            {getFieldDecorator('captcha_code', {
                                rules: [{ required: true, message: '请输入验证码' }],
                            })(
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <Input
                                                placeholder="请输入验证码"
                                                style={{maxWidth:300}}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <img src={this.state.url} alt="努力加载中"/>
                                        </Col>
                                        <Col span={6}>
                                            <Button onClick={this.init} type="default" style={{float:'right'}}>刷新</Button>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item >
                            {getFieldDecorator('mobile', {
                                rules: [{ required: true, message: '请输入新手机号' }],
                            })(<Input.Search
                                onSearch={this.getVerify}
                                enterButton={"获取手机验证码"}
                                style={{maxWidth:300}}
                                placeholder={"请输入新手机号码"}
                            />)}
                        </Form.Item>

                        <Form.Item>
                            {getFieldDecorator('verify', {
                                rules: [{ required: true, message: '请输入手机验证码' }],
                            })(<Input
                                style={{maxWidth:300}}
                                placeholder={"请输入手机验证码"}
                            />)}
                        </Form.Item>

                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(<Input.Password
                                style={{maxWidth:300}}
                                placeholder={"请输入密码"}
                            />)}
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                重置手机号
                            </Button>
                            <Link to={'/personal_details'} style={{float:'right'}}>取消</Link>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        )

    }
}
const ResetTel = Form.create({ name: 'reset' })(ResetForm);
export default ResetTel;
