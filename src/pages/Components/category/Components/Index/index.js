import React, {Component} from 'react';
import {Spin, message, Table, Divider, Popconfirm, Icon,Menu} from 'antd';
import {Link} from "react-router-dom";
import {ajax_get, ajax_post} from "../../../../../axios";
class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false,
            current_key:"in"
        }
    }
    init=()=>{
        if(localStorage.getItem("token")){
            this.setState({spinstatus:true})
            ajax_get(
                'api/category?token='+localStorage.getItem("token"),
                (data)=>{
                    this.getDataSource(data,1)
                },
                (err)=>{
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinstatus:false})
                },
                {type:1,dataType:3}
            )

            ajax_get(
                'api/category?token='+localStorage.getItem("token"),
                (data)=>{
                    this.getDataSource(data,2)
                },
                (err)=>{
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinstatus:false})
                },
                {type:2,dataType:3}
            )
        }
    }


    getDataSource=(data,type)=>{
        if(data){
            var source =[];
            //递归优化
            (function getsource (source,data) {
                for(let i=0;i<data.length;i++){
                    source.push({
                        key:data[i].id,
                        name:data[i].name,
                        create_time:data[i].created_at,
                        update_time:data[i].updated_at,
                        sort:data[i].sort,
                        action:[data[i].id,data[i].name,data[i].sort],
                        children:[]
                    })
                    if(data[i].sub.length != 0){
                        getsource(source[i].children,data[i].sub)
                    }else{
                        //当该分类下没有分支时，删除Children
                        delete source[i].children
                    }
                }
            })(source,data)

            if (type==1){
                this.setState({dataSource1:source})
            }else if (type==2){
                this.setState({dataSource2:source})
            }else{return false}
        }
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const columns=[
            {
                title: '类别名称',
                dataIndex: 'name',
                key: 'name',
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
                title: '排序值',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title:'操作',
                dataIndex:'action',
                key:'action',
                render:(text,record)=>(
                    <span>
                        <Link to={'/category/edit'}><span
                            onClick={()=>{
                                localStorage.setItem("category_msg",JSON.stringify(
                                    {
                                        category_id:text[0],
                                        category_name:text[1],
                                        category_sort:text[2]
                                    }
                            ))
                           }}>编辑</span></Link>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定要删除吗？该分类下的子类也会一并删除！"
                            okText={'确认'}
                            cancelText={"取消"}
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            onConfirm={
                                ()=>{
                                    this.setState({spinstatus:true})
                                    ajax_post(
                                        'api/category/delete?id='+text[0]+'&token='+localStorage.getItem("token"),
                                        ()=>{
                                            this.init()
                                            message.success("删除成功")
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

        return (
            <div>
                <Spin tip={'loading'} spinning={this.state.spinstatus}>
                    <Menu
                        onClick={(e)=>{this.setState({current_key:e.key})}}
                        selectedKeys={this.state.current_key}
                        mode="horizontal"
                    >
                        <Menu.Item key="in">
                            <Icon type="mail" />
                            收入类别
                        </Menu.Item>
                        <Menu.Item key="out" >
                            <Icon type="appstore" />
                            支出类比
                        </Menu.Item>
                    </Menu>
                    <div style={{marginTop:'20px'}}>
                        {this.state.current_key==="in"?(
                            <Table
                                columns={columns}
                                dataSource={this.state.dataSource1}
                            />
                        ):(
                            <Table
                                columns={columns}
                                dataSource={this.state.dataSource2}
                            />
                        )}
                    </div>

                </Spin>
            </div>
        );
    }
}

export default Index;