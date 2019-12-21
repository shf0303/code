import React, {Component} from 'react';
import {Table, Spin, Divider, Popconfirm, Icon, Button, Drawer, Form, Input,message,Modal,Badge} from "antd";
import axios from 'axios';
import qs from 'qs';
import baseurl from "../../../../../baseurl";

class EditForm extends Component{
    render() {
        const { visible, onCancel, onEdit, form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="修改帐簿"
                okText="修改"
                cancelText={"取消"}
                onCancel={onCancel}
                onOk={onEdit}
            >
                <Form layout="vertical" >
                    <Form.Item label="帐簿名称">
                        {getFieldDecorator('book_name', {
                            rules: [{ required: true,message:'必填选项' }],
                        })(<Input style={{ width:250 }} />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}



class AddForm extends Component{
    render() {
        const { visible, onCancel, onAdd, form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="新增帐簿"
                okText="新增"
                cancelText={"取消"}
                onCancel={onCancel}
                onOk={onAdd}
            >
                <Form layout="vertical">
                    <Form.Item label="帐簿名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true,message:'必填选项' }],
                        })(<Input style={{ width:250 }} />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}


class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            spinstatus:false,
            add_visible:false,
            edit_visible:false
        }
    }

    init=()=>{
        let source=[]
        this.setState({spinstatus:true})
        axios({
            method:'get',
            url:baseurl+'api/book/get-default?token='+localStorage.getItem("token")
        }).then((response)=>{
            this.props.change({current_book:response.data.data.name})
            this.setState({current_book_id:response.data.data.id},()=>{
                axios({
                    method:'get',
                    url:baseurl+'api/book?token='+localStorage.getItem("token"),
                }).then((response)=>{
                    this.setState({spinstatus:false})
                    response.data.data.map((item,key)=>{
                        source.push({
                            key:key,
                            name:item.name,
                            user_name:item.user_name,
                            sort:item.sort,
                            created_at:item.created_at,
                            updated_at: item.updated_at,
                            status:[item.id,item.name],
                            action:[item.id,item.user_id]
                        })
                    })
                    this.setState({dataSource:source})
                }).catch((err)=>{
                    message.error(err)
                    this.setState({spinstatus:false})
                })
            })
        })
    }
    handleAddCancel = () => {
        this.setState({ add_visible: false });
    };

    handleAddSubmit=()=>{
        const { form } = this.addformRef.props;
        form.validateFields((err, values) => {
            if (!err){
                this.setState({spinstatus:true})
                axios({
                    method:"post",
                    url:baseurl+'api/book/create?token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    if (response.data.status){
                        message.success("添加成功")
                        this.setState({add_visible:false})
                        this.init();
                    }else {
                        message.error(response.data.data)
                        this.setState({spinstatus:false})
                    }
                }).catch((err)=>{
                    message.error(err)
                    this.setState({spinstatus:false})
                })
            }
        })
    }

    handleEditCancel = () => {
        this.setState({ edit_visible: false });
    };

    handleEditSubmit=()=>{
        const { form } = this.editformRef.props;
        form.validateFields((err, values) => {
            if (!err){
                this.setState({spinstatus:true})
                values.book_id=this.state.book_id;
                axios({
                    method:"post",
                    url:baseurl+'api/book/update?token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=>{
                    this.setState({edit_visible:false})
                    if (response.data.status){
                        message.success("修改成功")
                        console.log(response);
                        this.init();
                    }else {
                        message.error(response.data.data)
                        this.setState({spinstatus:false})
                    }
                }).catch((err)=>{
                    message.error(err)
                    this.setState({spinstatus:false})
                })
            }
        })
    }


    componentDidMount() {
        this.init();
    }

    saveFormRefEdit = formRef => {
        this.editformRef = formRef;
    };

    saveFormRefAdd = formRef => {
        this.addformRef = formRef;
    };

    render() {
        const columns=[
            {
                title: '帐簿名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建者',
                dataIndex: 'user_name',
                key: 'user_name',
            },
            {
                title: '排序值',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
            },
            {
                title: '更新时间',
                dataIndex: 'updated_at',
                key: 'updated_at',
            },
            {
                title: '状态/更新',
                dataIndex: 'status',
                key: 'status',
                render: (text,record) => (
                    <div>
                        {text[0] == this.state.current_book_id?(
                            <Badge status="processing" />
                        ):(
                            <Badge status="default"/>
                        )}
                        <Divider type={'vertical'} />
                        <Button icon={'sync'} onClick={()=>{
                            this.setState({spinstatus:true})
                            axios({
                                method:'post',
                                url:baseurl+'api/book/set-default?token='+localStorage.getItem("token"),
                                data:qs.stringify({book_id:text[0]})
                            }).then((response)=>{
                                this.setState({current_book_id:text[0],spinstatus:false})
                                this.props.change({current_book: text[1]})
                            }).catch((err)=>{
                                message.error(err)
                                this.setState({spinstatus:false})
                            })
                        }}>切换</Button>
                    </div>
                )
            },

            {
                title:'操作',
                dataIndex:'action',
                key:'action',
                render:(text,record)=>(
                    <div>
                        {text[1] == localStorage.getItem("user_id")?(
                            <div>
                                <span
                                    style={{cursor:'pointer',color:'#1890ff'}}
                                    onClick={()=>{
                                    this.setState({edit_visible:true,book_id:text[0]})
                                }}>编辑</span>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title="确定要删除吗？"
                                    okText={'确认'}
                                    cancelText={"取消"}
                                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                    onConfirm={
                                        ()=>{
                                            this.setState({spinstatus:true})
                                            axios({
                                                method: 'post',
                                                url:baseurl+'api/book/delete?token='+localStorage.getItem("token"),
                                                data:qs.stringify({book_id:text[0]})
                                            }).then((response)=>{
                                                if(response.data.status){
                                                    this.init();
                                                }else {
                                                    this.setState({spinstatus:false})
                                                    message.error(response.data.data)
                                                }
                                            }).catch((err)=>{
                                                message.error(err)
                                                this.setState({spinstatus:false})
                                            })
                                        }
                                    }
                                >
                                    <span style={{cursor:'pointer',color:'#1890ff'}}>删除</span>
                                </Popconfirm>
                            </div>
                        ):(
                            <span>暂无权限</span>
                        )}
                    </div>
                )
            }
        ]

        return (
            <div>
                <Spin spinning={this.state.spinstatus} tip={"loading"}>
                    <Table dataSource={this.state.dataSource} columns={columns} />
                    <Button icon={"plus"} onClick={()=>{this.setState({add_visible:true})}}>新增帐簿</Button>
                    <EditBook wrappedComponentRef={this.saveFormRefEdit} visible={this.state.edit_visible} onCancel={this.handleEditCancel} onEdit={this.handleEditSubmit} />
                    <AddBook wrappedComponentRef={this.saveFormRefAdd} visible={this.state.add_visible} onCancel={this.handleAddCancel} onAdd={this.handleAddSubmit} />
                </Spin>
            </div>
        );
    }
}

const EditBook =Form.create("edit")(EditForm);
const AddBook = Form.create("add")(AddForm);
export default Index;
