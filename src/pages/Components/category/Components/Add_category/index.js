import React from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Spin,
    Cascader
} from 'antd';
import axios from 'axios';
import qs from 'qs';
import baseurl from '../../../../../baseurl';
import {createHashHistory} from "history";

class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spinstatus:false
        }
    }



    getSource=(data,type)=>{
        if(data){
            var source = []; //在(),``之前，前一段代码必须加分号
            /*function change(children,data){
                if(data.sub.length != 0) {
                    for(var j=0;j<data.sub.length;j++){
                        children.push({
                          value:data.sub[j].id,
                          label:data.sub[j].name,
                          children:[]
                        })
                        change(children[j].children,data.sub[j])
                    }
                }
            }

            for(var i=0;i<data.length;i++){
                var obj = {
                    value: data[i].id,
                    label:data[i].name,
                    children:[]
                }
                change(obj.children,data[i])
                options.push(obj);
            }*/
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



    init = ()=>{
        if(localStorage.getItem("token")){
            this.setState({spinstatus:true})
            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:1,dataType:3}
            }).then((response)=>{
                this.getSource(response.data.data,1)
            }).catch((error)=>{
                message.error("请检查你的网络")
            })

            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:2,dataType:3}
            }).then((response)=>{
                this.getSource(response.data.data,2)
            }).catch((err)=>{
                message.error("请检查你的网络")
            })
        }
        this.setState({spinstatus:false})
    }



    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.type = values.type[0]
                values.parent_id = values.parent_id[values.parent_id.length-1]
                axios({
                    method:'post',
                    url:baseurl+'api/category/create?token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    createHashHistory().push('/category');
                    message.success("添加账户成功");
                    console.log(response);
                }).catch((error)=>{
                    message.error("添加账户失败")
                })
            }
        });
    }

    componentDidMount() {
        this.init();
    }

    render() {
        var options;
        if(this.state.type){
            if(this.state.type===1){
                 options = [{value:0, label:"最高级"}].concat(this.state.dataSource1)
            }else {
                 options = [{value:0, label:"最高级"}].concat(this.state.dataSource2)
            }
        }

        const { getFieldDecorator } = this.props.form;
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
                        action={baseurl+'api/category/create?token='+localStorage.getItem("token")}
                        method={"post"}
                    >
                        <Form.Item label="类别名称">
                            {getFieldDecorator('name', {
                                rules: [{ required: true }],
                            })(<Input style={{ width:250 }} />)}
                        </Form.Item>

                        <Form.Item label="类型">
                            {getFieldDecorator('type', {
                                rules: [{ required: true }],
                            })(<Cascader
                                options={[
                                    {value:1,label:"收入"},
                                    {value:2,label:"支出"}
                                ]}
                                onChange={(value)=>{
                                    this.setState({type:value[0]})
                                }}
                                changeOnSelect
                                placeholder="Please select"
                                style={{width:250}} />)}
                        </Form.Item>

                        <Form.Item label="父类型">
                            {getFieldDecorator('parent_id', {
                                rules: [{ required: true }],
                            })(<Cascader
                                options = { options }
                                changeOnSelect
                                notFoundContent={"请先选择基本类型分支"}
                                placeholder="Please select"
                                style={{width:250}} />)}
                        </Form.Item>
                        <Form.Item label="排序值">
                            {getFieldDecorator('sort', {
                                rules: [{ required: true }],
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
        )
    }

}

const Addcategory = Form.create({ name: 'add' })(AddForm);
export default Addcategory;