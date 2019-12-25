import React, {Component} from 'react';
import {Table} from 'antd';
import {Button,Icon,Divider,Popconfirm,message,Spin} from 'antd';
import {Link} from 'react-router-dom';
import {ajax_get, ajax_post} from "../../../../../axios";
import {createHashHistory} from "history";
class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false
        };
        this.columns = [
            {
                title: '账户名称',
                dataIndex: 'name',
                key: 'name',
                render: text =>
                    <Link to={"/account/account_detail"}>
                        <span
                            style={{cursor:'pointer',color:'#1890ff'}}
                            onClick={()=>{
                                localStorage.setItem("account_id",text[1])
                            }}
                        >{text[0]}</span>
                    </Link>
            },
            {
                title: '账户类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title:'初期账户余额',
                dataIndex:'initial_balance',
                key:'initial_balance',
            },
            {
                title: '账户余额',
                dataIndex: 'balance',
                key: 'balance',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                key:'create_time'
            },
            {
                title:'最后修改时间',
                dataIndex:'update_time',
                key:'update_time'
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title:'操作',
                dataIndex:'action',
                key:'action',
                render:(text,record)=>(
                    <span>
                        <Link to={'/account/edit_account'}>
                            <span
                                onClick={()=>{
                                    localStorage.setItem("account_id",text)
                                }}
                            >编辑</span>
                        </Link>
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
                                        'api/account/delete?id='+text+'&token='+localStorage.getItem("token"),
                                        (data)=>{
                                            message.success(data)
                                            this.init()
                                        },
                                        (err)=>{
                                            message.error(err.data)
                                        },
                                        ()=>{
                                            this.setState({spinstatus:false})
                                        }
                                    )
                                }
                            }
                        >
                            <span style={{cursor:'pointer',color:'#1890ff'}}>删除</span>
                        </Popconfirm>
                    </span>
                ),
            }
        ]
    }

    getDataSource=(data)=>{
        if(data){
            let finalarray = [];
            data.map((item,key)=>{

                switch(item.type){
                    case 1: item.type="现金";break;
                    case 2: item.type="银行";break;
                    case 3: item.type="支付平台";break;
                    case 4: item.type="其他";break;
                }
                finalarray.push({
                    key:key,
                    name:[item.name,item.id],
                    type:item.type,
                    initial_balance:item.initial_balance,
                    balance:item.balance,
                    create_time:item.created_at,
                    update_time:item.updated_at,
                    remark:item.remark,
                    action:item.id,
                })
            })
            this.setState({dataSource:finalarray})
        }
    }

    init=()=>{
        if(localStorage.getItem("token")){
            //判断加载状态
            this.setState({spinstatus:true})
            ajax_get(
                'api/account?token='+localStorage.getItem("token"),
                (data)=>{
                    this.getDataSource(data)
                },
                (err)=>{
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinstatus:false})
                }
                )
        }else {
            createHashHistory().push('/login')
        }
    }


    componentDidMount() {
        this.init()
    }

    render() {
        return (
            <div>
                <Spin tip={'loading'} spinning={this.state.spinstatus}>
                    <Table
                        columns={this.columns}
                        onRow={record => {
                            return{
                                onMouseEnter: event => {
                                    this.setState({account_id:record.action});
                                }
                            }}}
                        dataSource={this.state.dataSource} />
                </Spin>

                <Link to={'/account/add_account'}><Button icon={'plus'} >新增帐户</Button></Link>
            </div>
        );
    }
}

export default Index;