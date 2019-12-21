import React from 'react';
import {
    Form,
    Input,
    Radio,
    Button,
    message,
    Spin
} from 'antd';
import axios from 'axios';
import qs from 'qs';
import baseurl from '../../../../../baseurl';
import {createHashHistory} from "history";
class AddForm extends React.Component {
    constructor(props){
        super(props)
        this.state={
            spinstatus:false
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({spinstatus:true})
                axios({
                    method:'post',
                    url:baseurl+'api/account/create?token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    createHashHistory().push('/account');
                    message.success("添加账户成功");
                    this.setState({spinstatus:false})
                }).catch((error)=>{
                    message.error("添加账户失败")
                    this.setState({spinstatus:false})
                })
            }
        });
    };


    render() {
        const {  setFieldsValue,getFieldDecorator } = this.props.form;
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


        return (
            <div>
                <Spin tip={"loading"} spinning={this.state.spinstatus}>
                    <Form
                        {...formItemLayout}
                        onSubmit={this.handleSubmit}
                    >
                        <Form.Item label="账户名称">
                            {getFieldDecorator('name', {
                                rules: [{ required: true }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="账户类型">
                            {getFieldDecorator('type', {
                                rules: [{ required: true }],
                            })(<Radio.Group onChange={(e)=>{setFieldsValue({"type":e.target.value})}}>
                                <Radio value={1}>现金</Radio>
                                <Radio value={2}>银行</Radio>
                                <Radio value={3}>支付平台</Radio>
                                <Radio value={4}>其他</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                        <Form.Item label="初期余额">
                            {getFieldDecorator('initial_balance', {
                                rules: [{ required: true }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="排序值">
                            {getFieldDecorator('sort', {
                                rules: [{ required: true }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [{ required: false }],
                            })(<Input.TextArea
                                allowClear
                                style={{width:250}}
                            />)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType={"submit"}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}

const Addaccount = Form.create({ name: 'register' })(AddForm);
export default Addaccount;