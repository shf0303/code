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
class EditForm extends React.Component {
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
                this.setState({spinstatus:true});
                axios({
                    method:'post',
                    url:baseurl+'api/account/update?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    message.success("修改成功")
                    createHashHistory().push('/account');
                    this.setState({spinstatus:false});
                }).catch((error)=>{
                    message.error("修改失败")
                    this.setState({spinstatus:false});
                })
            }
        });
    };

    init = ()=>{
        this.setState({spinstatus:true});
        axios({
            method: 'get',
            url:baseurl+'api/account/detail?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token")
        }).then((response)=>{
            this.setState({
                name:response.data.data.name,
                type:response.data.data.type,
                sort:response.data.data.sort,
                remark:response.data.data.remark
            },()=>{this.setState({spinstatus:false});})
        })
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const { setFieldsValue,getFieldDecorator } = this.props.form;
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
                                initialValue:this.state.name,
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="账户类型">
                            {getFieldDecorator('type', {
                                rules: [{ required: true }],
                                initialValue:this.state.type,
                            })(<Radio.Group  onChange={(e)=>{setFieldsValue({"type":e.target.value})}}>
                                <Radio value={1}>现金</Radio>
                                <Radio value={2}>银行</Radio>
                                <Radio value={3}>支付平台</Radio>
                                <Radio value={4}>其他</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                        <Form.Item label="排序值">
                            {getFieldDecorator('sort', {
                                rules: [{ required: true }],
                                initialValue:this.state.sort,
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [{ required: false }],
                                initialValue:this.state.remark,
                            })(<Input.TextArea
                                allowClear
                                style={{width:250}}
                            />)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType={"submit"}>
                                提交修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}

const Editaccount = Form.create({ name: 'edit' })(EditForm);
export default Editaccount;