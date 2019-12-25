import React, {Component} from 'react';
import {createHashHistory} from "history";
import {Button,  Form, Input, message, Spin} from "antd";
import {ajax_post} from "../../../../axios";


class EditForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinstatus: false,
        }
    }

    init=()=>{
        const source = JSON.parse(localStorage.getItem("record_msg"))
        this.props.form.setFieldsValue({
            'total_money':source.total_money,
            'company_name':source.company_name,
            'remark':source.remark
        })
    }

    componentDidMount() {
        this.init()
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) =>{
            if(!err) {
                this.setState({spinstatus: true})
                ajax_post(
                    'api/record/update?id='+localStorage.getItem("record_id")+'&token='+localStorage.getItem("token"),
                    (data)=>{
                        createHashHistory().push('/record/detail')
                        message.success("修改成功")
                    },
                    (err)=>{
                        message.error(err.data)
                    },
                    ()=>{
                        this.setState({spinstatus:false})
                    },
                    values
                )
            }
        })
    }

    render() {
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
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
                        <Form.Item label="记账金额">
                            {getFieldDecorator('total_money', {
                                rules: [{ required: false }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="交易对象">
                            {getFieldDecorator('company_name', {
                                rules: [{ required: false }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [{ required: false }],
                            })(<Input style={{ width:250 }} />)}
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
const EditRecord = Form.create({ name: 'add' })(EditForm);
export default EditRecord;

