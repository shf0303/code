import React, {Component} from 'react';
import {Button, Cascader, DatePicker, Form, Input, message, Spin} from "antd";
import baseurl from "../../../../baseurl";
import axios from "axios";
import qs from 'qs';
import UploadPicture from "../../../../Components/UploadPicture";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import {createHashHistory} from "history";
moment.locale('zh-cn');


class AddForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinstatus: false,
        }
        this.filekey = []
    }

    init = () => {
        if (localStorage.getItem("token")) {
            this.setState({spinstatus: true})
            axios({
                method: 'get',
                url: baseurl + 'api/account?token=' + localStorage.getItem("token")
            }).then((response) => {
                this.getAccountSource(response.data.data)
                this.setState({spinstatus: false})
            }).catch((error) => {
                message.error("加载失败")
                this.setState({spinstatus: false})
            })
        }

    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) =>{
            if(!err){
                values.account_id = values.account_id[0]
                values.date = values.date.format("YYYY-MM-DD")
                values.record_id = localStorage.getItem("record_id")
                if(values.money<=parseFloat(localStorage.getItem("max"))){
                    this.setState({spinstatus: true})
                    axios({
                        method:'post',
                        url:baseurl+'api/record/sequel?token='+localStorage.getItem("token"),
                        data:qs.stringify(values)
                    }).then((response)=>{
                        console.log(response)
                        message.success("添加成功")
                        this.setState({spinstatus: false})
                        createHashHistory().push('/record/detail')
                    }).catch((err)=>{
                        message.error("添加失败")
                        this.setState({spinstatus: false})
                    })
                }else {
                    message.error("金额不能超过"+localStorage.getItem("max"))
                }
            }
        })
    }

    getAccountSource=(data)=>{
        var source=[]
        data.map((item,key)=>{
            source.push({
                value:item.id,
                label:item.name
            })
        })
        this.setState({accountSource:source})
    }

    handleSend=(filekey)=>{
        this.filekey.push(filekey) //同步的
        this.props.form.setFieldsValue({"image_keys":this.filekey.toString()})
    }

    componentDidMount() {
        this.init();
    }


    render() {
        const {setFieldsValue, getFieldDecorator} = this.props.form;
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
                        <Form.Item label="账户名称">
                            {getFieldDecorator('account_id', {
                                rules: [{required: true,message:"必填选项"}],
                            })(<Cascader
                                options={this.state.accountSource}
                                changeOnSelect
                                placeholder="Please select"
                                style={{width: 250}}/>)}
                        </Form.Item>

                        <Form.Item label="实付金额">
                            {getFieldDecorator('money', {
                                rules: [{required: true,message:"必填选项"}],
                            })(<Input onBlur={(e)=>{
                                if(e.target.value>parseFloat(localStorage.getItem("max"))){
                                    message.error("金额不能超过"+localStorage.getItem("max"))
                                }
                            }} style={{ width:250 }} />)}
                        </Form.Item>

                        <Form.Item label="日期">
                            {getFieldDecorator('date', {
                                rules: [{required: true,message:"必填选项"}],
                            })(<DatePicker
                                locale={locale}
                            />)}
                        </Form.Item>

                        <Form.Item label="上传图片">
                            {getFieldDecorator('image_keys', {
                                rules: [{ required: false }],
                            })(<UploadPicture send={this.handleSend}/>)}
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


const AddItem = Form.create({ name: 'add' })(AddForm);
export default AddItem;