import React from 'react';
import {
    Form,
    Input,
    Radio,
    Button,
    message,
    Spin,
    Cascader,
    DatePicker
} from 'antd';
import axios from 'axios';
import qs from 'qs';
import baseurl from "../../../../baseurl";
import UploadPicture from "../../../../Components/UploadPicture";
import {createHashHistory} from "history";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinstatus: false,
        }
        this.filekey=[]
    }
    getCategorySource=(data,type)=>{
        if(data){
            var source = [];
            (function getsource (source,data) {
                for(var i=0;i<data.length;i++){
                    source.push({
                        value: data[i].id,
                        label:data[i].name,
                        children:[]
                    })
                    if(data[i].sub.length !== 0){
                        getsource(source[i].children,data[i].sub)
                    }
                }
            })(source,data)

            if (type===1){
                this.setState({dataSource1:source})
            }else if (type===2){
                this.setState({dataSource2:source})
            }else{return false}
        }
    }

    getAccountSource=(data)=>{
        let source=[]
        data.map((item,key)=>{
            source.push({
                value:item.id,
                label:item.name
            })
        })
        this.setState({accountSource:source})
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) =>{
            if(!err){
                values.account_id=values.account_id[0]
                values.date=values.date.format("YYYY-MM-DD")
                if(values.total_money>=Number(values.money)){
                    this.setState({spinstatus:true})
                    axios({
                        method:'post',
                        url:baseurl+'api/record/create?token='+localStorage.getItem("token"),
                        data:qs.stringify(values)
                    }).then((response)=>{
                        this.setState({spinstatus:false})
                        createHashHistory().push("/record")
                    })
                }else{
                    message.error("实付金额不能大于记账金额")
                }
            }
        })
    }
    handleSend=(filekey)=>{
        this.filekey.push(filekey) //同步的
        this.props.form.setFieldsValue({"image_keys":this.filekey.toString()})
    }

    init = ()=>{
        if(localStorage.getItem("token")){
            this.setState({spinstatus:true})
            axios({
                method:'get',
                url:baseurl+'api/account?token='+localStorage.getItem("token")
            }).then((response)=>{
                this.getAccountSource(response.data.data)
            }).catch((error)=>{
                message.error("加载失败")
            })

            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:1,dataType:3}
            }).then((response)=>{
                this.getCategorySource(response.data.data,1)
            }).catch((error)=>{
                message.error("加载失败")
            })

            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:2,dataType:3}
            }).then((response)=>{
                this.getCategorySource(response.data.data,2)
            }).catch((err)=>{
                message.error("加载失败")
            })
        }
        this.setState({spinstatus:false})
    }

    componentDidMount() {
        this.init();
    }
    render() {
        var options;
        if(this.state.type){
            if(this.state.type===1){
                options = this.state.dataSource1
            }else {
                options = this.state.dataSource2
            }
        }

        const { getFieldValue,setFieldsValue,getFieldDecorator } = this.props.form;
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

        return(
            <div>
                <Spin tip={"loading"} spinning={this.state.spinstatus}>
                    <Form
                        {...formItemLayout}
                        onSubmit={this.handleSubmit}
                    >
                        <Form.Item label="账户名称">
                            {getFieldDecorator('account_id', {
                                rules: [{ required: true,message:"必填选项" }],

                            })(<Cascader
                                options={this.state.accountSource}
                                changeOnSelect
                                placeholder="Please select"
                                style={{width:250}} />)}
                        </Form.Item>



                        <Form.Item label="收支类型">
                            {getFieldDecorator('category_id', {
                                rules: [{ required: true,message:"必填选项" }],

                            })(<div>
                                <div>
                                    <Radio.Group onChange={(e)=>{this.setState({type:e.target.value})}}>
                                        <Radio value={1}>收入</Radio>
                                        <Radio value={2}>支出</Radio>
                                    </Radio.Group>
                                </div>

                                <Cascader
                                    options = { options }
                                    changeOnSelect
                                    onChange={(value)=>{
                                        setFieldsValue({"category_id":value[value.length-1]})
                                    }}  //为什么现在又有用！
                                    notFoundContent={"请先选择基本类型分支"}
                                    placeholder="Please select"
                                    style={{width:250}} />
                            </div>)}
                        </Form.Item>

                        <Form.Item label="记账金额">
                            {getFieldDecorator('total_money', {
                                rules: [{ required: true,message:"必填选项" }],

                            })(<Input
                                style={{ width:250 }}
                                onBlur={(e)=>{
                                    if(e.target.value<Number(getFieldValue("money"))){
                                        message.error("实付金额不能大于记账金额")
                                    }
                                }}
                            />)}
                        </Form.Item>

                        <Form.Item label="实付金额">
                            {getFieldDecorator('money', {
                                rules: [{ required: true,message:"必填选项" }],

                            })(<Input
                                style={{ width:250 }}
                                onBlur={(e)=>{
                                    if(e.target.value>Number(getFieldValue("total_money"))){
                                        message.error("实付金额不能大于记账金额")
                                    }
                                }}
                            />)}
                        </Form.Item>

                        <Form.Item label="日期">
                            {getFieldDecorator('date', {
                                rules: [{ required: true,message:"必填选项" }],

                            })(<DatePicker
                                locale={locale}
                            />)}
                        </Form.Item>
                        <Form.Item label="交易对象">
                            {getFieldDecorator('company_name', {
                                rules: [{ required: false }],
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
        )
    }
}

const Addrecord = Form.create({ name: 'add' })(AddForm);
export default Addrecord;