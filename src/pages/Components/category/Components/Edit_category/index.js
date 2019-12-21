import React, {Component} from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Spin
} from 'antd';
import axios from 'axios';
import qs from 'qs';
import baseurl from '../../../../../baseurl';
import {createHashHistory} from "history";
class EditForm extends Component {
    constructor(props){
        super(props)
        this.state={
            spinstatus:false
        }
        this.source = JSON.parse(localStorage.getItem("category_msg"))
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) =>{
            if(!err){
                this.setState({spinstatus:true})
                axios({
                    method:'post',
                    url:baseurl+'api/category/update?id='+this.source.category_id+'&token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    message.success("修改成功")
                    createHashHistory().push('/category');
                    this.setState({spinstatus:false})
                }).catch((error)=>{
                    message.error("修改失败")
                    this.setState({spinstatus:false})
                })
            }
        })
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
                                initialValue:this.source.category_name,
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>
                        <Form.Item label="排序值">
                            {getFieldDecorator('sort', {
                                rules: [{ required: true }],
                                initialValue:this.source.category_sort,
                            })(<Input style={{ width:250 }} />)}
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


const Editcategory = Form.create({ name: 'edit' })(EditForm);
export default Editcategory;