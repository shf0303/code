import React, {Component} from 'react';
import {Table, Spin, Divider, Popconfirm, Icon, Button, Drawer, Form, Input,message,Modal,Badge} from "antd";
import {ajax_get, ajax_post} from "../../../../../axios";

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
        ajax_get(
            'api/book/get-default?token='+localStorage.getItem("token"),
            (data)=>{
                this.setState(
                    {current_book_id:data.id},
                    ()=>{
                        ajax_get(
                            'api/book?token='+localStorage.getItem("token"),
                            (data)=>{
                                data.map((item,key)=>{
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
                            },
                            (err)=>{message.error(err.data)},
                            ()=>{
                                this.setState({spinstatus:false})
                            }
                        )
                    }
                    )
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            }
        )
    }

    handleAddCancel = () => {
        this.setState({ add_visible: false });
    };

    handleAddSubmit=()=>{
        const { form } = this.addformRef.props;
        form.validateFields((err, values) => {
            if (!err){
                this.setState({spinstatus:true})
                ajax_post(
                    'api/book/create?token='+localStorage.getItem("token"),
                    (data)=>{
                        message.success("添加成功")
                        this.init();
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

    handleEditCancel = () => {
        this.setState({ edit_visible: false });
    };

    handleEditSubmit=()=>{
        const { form } = this.editformRef.props;
        form.validateFields((err, values) => {
            if (!err){
                this.setState({spinstatus:true})
                values.book_id=this.state.book_id;
                ajax_post(
                    'api/book/update?token='+localStorage.getItem("token"),
                    (data)=>{
                        message.success("修改成功")
                        this.init();
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
                            <div>
                                <Badge status="processing" />
                                <Divider type={'vertical'} />
                                <span style={{color:'#1890ff'}}>当前帐簿</span>
                            </div>
                        ):(
                            <div>
                                <Badge status="default"/>
                                <Divider type={'vertical'} />
                                <Button icon={'sync'} onClick={()=>{
                                    this.setState({spinstatus:true})
                                    ajax_post(
                                        'api/book/set-default?token='+localStorage.getItem("token"),
                                        (data)=>{
                                            this.setState({current_book_id:text[0]})
                                            this.props.change({current_book: text[1]})
                                        },
                                        (err)=>{
                                            message.error(err.data)
                                        },
                                        ()=>{
                                            this.setState({spinstatus:false})
                                        },
                                        {book_id:text[0]}
                                    )
                                }}>切换</Button>
                            </div>
                        )}
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
                                            ajax_post(
                                                'api/book/delete?token='+localStorage.getItem("token"),
                                                ()=>{
                                                    this.init();
                                                },
                                                (err)=>{
                                                    message.error(err.data)
                                                },
                                                ()=>{
                                                    this.setState({spinstatus:false})
                                                },
                                                {book_id:text[0]}
                                            )
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
