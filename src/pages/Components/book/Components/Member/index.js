import React, {Component} from 'react';
import {Button, Form, Input, Modal, Spin, Table, Radio , Popconfirm, Icon, message} from "antd";
import axios from 'axios';
import baseurl from "../../../../../baseurl";
import qs from "qs";
class AddForm extends Component{
    render() {
        const { visible, onCancel, onAdd, form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="添加成员"
                okText="添加"
                cancelText={"取消"}
                onCancel={onCancel}
                onOk={onAdd}
            >
                <Form layout="vertical" >
                    <Form.Item label="手机号码">
                        {getFieldDecorator('mobile', {
                            rules: [{ required: true,message:'必填选项' }],
                        })(<Input style={{ width:250 }} />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}


class Member extends Component{
    constructor(props){
        super(props);
        this.state={
            spinstatus:false,
            add_visible:false,
            book:[]
        }
    }

    handleAddCancel = () => {
        this.setState({ add_visible: false });
    };

    handleAddSubmit=()=>{
        const { form } = this.addformRef.props;
        form.validateFields((err, values) => {
            if(!err){
                this.setState({spinstatus:true})
                values.book_id=this.state.book_id
                axios({
                    method:"post",
                    url:baseurl+'api/member/add?token='+localStorage.getItem("token"),
                    data:qs.stringify(values)
                }).then((response)=> {
                    this.getDataSource()
                    message.success("添加成功")
                    this.setState({add_visible: false})
                    this.setState({spinstatus:false})
                }).catch((err)=>{
                    message.error(err)
                    this.setState({add_visible: false})
                    this.setState({spinstatus:false})
                })
            }
        })
    }


    saveFormRefAdd = formRef => {
        this.addformRef = formRef;
    };

    init=()=>{
        this.setState({spinstatus:true})
        axios({
            method:'get',
            url:baseurl+'api/book?token='+localStorage.getItem("token"),
        }).then((response)=>{
            let source=[]
            response.data.data.map((item,key)=>{
                if(item.user_id == localStorage.getItem("user_id")){
                    source.push({
                        book_name:item.name,
                        book_id:item.id
                    })
                }
            })
            this.setState({book:source})
            this.setState({spinstatus:false})
        }).catch((err)=>{
            message.error(err)
            this.setState({spinstatus:false})
        })
    }

    componentDidMount() {
        this.init();
    }

    getDataSource=()=>{
        this.setState({spinstatus:true})
        let source=[]
        axios({
            method:'get',
            url:baseurl+'api/member?token='+localStorage.getItem("token"),
            params:{book_id:this.state.book_id}
        }).then((response)=>{
            response.data.data.map((item,key)=>{
                source.push({
                    key:key,
                    nickname:item.nickname,
                    mobile:item.mobile,
                    action:item.id
                })
            })
            this.setState({dataSource:source})
            this.setState({spinstatus:false})
        }).catch((err)=>{
            message.error(err)
            this.setState({spinstatus:false})
        })
    }


    render() {
        const columns=[
            {
                title: '昵称',
                dataIndex: 'nickname',
                key: 'nickname',
            },
            {
                title: '手机',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render:(text,record)=>(
                    <div>
                        <Popconfirm
                            title="确定要删除吗？"
                            okText={'确认'}
                            cancelText={"取消"}
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            onConfirm={
                                ()=>{
                                    this.setState({spinstatus:true})
                                    axios({
                                        method:'post',
                                        url:baseurl+'api/member/delete?token='+localStorage.getItem("token"),
                                        data:qs.stringify({
                                            book_id:this.state.book_id,
                                            user_id:text
                                        })
                                    }).then((response)=>{
                                        message.success("删除成功")
                                        this.getDataSource();
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
                )
            }
        ]


        return(
            <div>
                <Spin spinning={this.state.spinstatus} tip={"loading"}>

                    <Radio.Group onChange={(e)=>{
                        this.setState({book_id:e.target.value},()=>{
                            this.getDataSource();
                        })
                    }}>
                        {this.state.book.map((item,key)=>{
                            return(
                                <Radio key={key} value={item.book_id}>{item.book_name}</Radio>
                                )
                        })}
                    </Radio.Group>

                    {this.state.book_id?(
                        <div style={{marginTop:"20px"}}>
                            <Table columns={columns} dataSource={this.state.dataSource} />
                            <Button style={{marginTop:'20px'}} icon={'team'} onClick={()=>{this.setState({add_visible:true})}}>新增成员</Button>
                        </div>
                    ):(
                        <div style={{color:'red',marginTop:'20px'}}><Icon type={'frown'} style={{fontSize:'20px',color:'black'}}/> &nbsp; 请先选择你所创建的帐簿！</div>
                    )}

                    <AddMember wrappedComponentRef={this.saveFormRefAdd} visible={this.state.add_visible} onCancel={this.handleAddCancel} onAdd={this.handleAddSubmit} />
                </Spin>
            </div>
        )
    }

}


const AddMember = Form.create("Add")(AddForm);
export default Member;