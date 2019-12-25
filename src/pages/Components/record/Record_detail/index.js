import React, {Component} from 'react';
import {Descriptions, Table, Divider, Popconfirm, Icon, Button, message,Spin} from "antd";
import {Link} from "react-router-dom";
import {ajax_get} from "../../../../axios";
class RecordDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            spinStatus:false
        }
    }

    init=()=>{
        this.setState({spinStatus:true})
        ajax_get(
            'api/record/detail?id='+localStorage.getItem("record_id")+'&token='+localStorage.getItem("token"),
            (data)=>{
                this.setState({
                    category_name:data.category_name,
                    user_name:data.user_nickname,
                    type:data.type===1? "收入":'支出',
                    total_money:data.total_money,
                    paid_money:data.paid_money,
                    date:data.date,
                    company_name:data.company_name,
                    remark:data.remark,
                    created_at:data.created_at,
                    updated_at:data.updated_at
                },()=>{
                    this.getDataSource(data.items);
                })
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinStatus:false})
            }

        )
    }

    getDataSource=(data)=>{
        if(data){
            let source=[];
            data.map((item,key)=>{
                source.push({
                    key:key,
                    account_name:item.account_name,
                    money:item.money,
                    date:item.date,
                    create_time:item.created_at,
                    update_time:item.updated_at,
                    image:item.images,
                    action:{
                        item_id:item.id,
                        account_id:item.account_id,
                        date:item.date,
                        money:item.money,
                        max:this.state.total_money-(this.state.paid_money-item.money)
                    }
                })
            })
            this.setState({dataSource:source})
        }
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const columns =
            [
                {
                    title: '账户名称',
                    dataIndex: 'account_name',
                    key: 'account_name',
                },
                {
                    title: '实付金额',
                    dataIndex: 'money',
                    key: 'money',
                },
                {
                    title: '记账日期',
                    dataIndex: 'date',
                    key: 'date',
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: '修改时间',
                    dataIndex: 'update_time',
                    key: 'update_time',
                },
                {
                    title: '上传图片',
                    dataIndex: 'image',
                    key: 'image',
                    render:(text,record)=>(
                        <div>
                            {text.map((item,key)=>{
                                return (
                                    <img key={key} src={item.thumbnail} style={{width:50}} alt="缩略图"/>
                                )
                            })}
                        </div>
                    ),
                },
                {
                    title:'操作',
                    dataIndex:'action',
                    key:'action',
                    render:(text, record)=>(
                        <span>
                        <Link to={'/record/edit_item'}><span onClick={()=>{window.localStorage.setItem("item_msg",JSON.stringify(text))}}>编辑</span></Link>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定要删除吗？"
                            okText={'确认'}
                            cancelText={"取消"}
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                        >
                            <span style={{cursor:'pointer',color:'#1890ff'}}>删除</span>
                        </Popconfirm>
                    </span>
                    ),
                }
            ]
        return (
            <div>
                <Spin tip={"loading"} spinning={this.state.spinStatus}>
                    <Descriptions title="单笔详情" bordered>
                        <Descriptions.Item label="类型">{this.state.type}</Descriptions.Item>
                        <Descriptions.Item label="类别名称">{this.state.category_name}</Descriptions.Item>
                        <Descriptions.Item label="记账人">{this.state.user_name}</Descriptions.Item>
                        <Descriptions.Item label="账面金额">{this.state.total_money}</Descriptions.Item>
                        <Descriptions.Item label="已付金额">{this.state.paid_money}</Descriptions.Item>
                        <Descriptions.Item label="记账日期">{this.state.date}</Descriptions.Item>
                        <Descriptions.Item label="交易对象">{this.state.company_name}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{this.state.created_at}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{this.state.updated_at}</Descriptions.Item>
                        <Descriptions.Item label="备注" span={3}>{this.state.remark}</Descriptions.Item>
                        <Descriptions.Item label="记账记录" span={3}>
                            <Table
                                columns={columns}
                                dataSource={this.state.dataSource}
                            />
                            <Link to={'/record/add_item'}><Button
                                icon={'plus'}
                                style={{marginTop:30}}
                                onClick={()=>{
                                    localStorage.setItem("max",(this.state.total_money-this.state.paid_money))
                                }}
                            >点我添加</Button></Link>
                        </Descriptions.Item>
                    </Descriptions>
                    <Link to={'/record/edit_record'}><Button
                        icon={'edit'}
                        style={{marginTop:30}}
                        onClick={()=>{
                            localStorage.setItem("record_msg",JSON.stringify({
                                total_money:this.state.total_money,
                                company_name:this.state.company_name,
                                remark:this.state.remark
                            }))
                        }}
                    >点我修改</Button></Link>
                </Spin>
            </div>
        );
    }
}

export default RecordDetail;