import React, {Component} from 'react';
import axios from 'axios';
import baseurl from "../../../../../baseurl";
import {Spin, message, Table, Divider, Popconfirm, Icon} from 'antd';
import {Link} from "react-router-dom";
class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false,
        }
    }
    init=()=>{
        if(localStorage.getItem("token")){
            this.setState({spinstatus:true})
            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:1,dataType:3}  //get请求和post请求不同，get请求的数据用params,而且格式是对象，post是data,格式是qs转换后的格式
            }).then((response)=>{
                this.getDataSource(response.data.data,1)
            }).catch((error)=>{
                message.error("请检查你的网络")
            })

            axios({
                method:'get',
                url:baseurl+'api/category?token='+localStorage.getItem("token"),
                params:{type:2,dataType:3}
            }).then((response)=>{
                this.getDataSource(response.data.data,2)
            }).catch((err)=>{
                message.error("请检查你的网络")
            })
        }
        this.setState({spinstatus:false})
    }


    getDataSource=(data,type)=>{
        if(data){
            var source =[];
            /*function change(children,data) {
                if(data.sub.length != 0) {
                    for(var j=0;j<data.sub.length;j++){
                        children.push({
                            key:data.sub[j].id,
                            name:data.sub[j].name,
                            parent:data.sub[j].parent_id,
                            create_time:data.sub[j].created_at,
                            update_time:data.sub[j].updated_at,
                            sort:data.sub[j].sort,
                            action:[data.sub[j].id,data.sub[j].name,data.sub[j].sort],
                            children:[]
                        })
                        change(children[j].children,data.sub[j])
                    }
                }
            }

            for(var i=0;i<data.length;i++){
                var obj={
                    key:data[i].id,
                    name:data[i].name,
                    parent:data[i].parent_id,
                    create_time:data[i].created_at,
                    update_time:data[i].updated_at,
                    sort:data[i].sort,
                    action:[data[i].id,data[i].name,data[i].sort],
                    children:[]
                }
                change(obj.children,data[i])
                source.push(obj)
            }  */
            //递归优化
            (function getsource (source,data) {
                for(var i=0;i<data.length;i++){
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
                                    axios({
                                        method: 'post',
                                        url:baseurl+'api/category/delete?id='+text[0]+'&token='+localStorage.getItem("token")
                                    }).then((response)=>{
                                        this.init();
                                    }).catch((error)=>{
                                        this.setState({spinstatus:false})
                                    })
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
                    <h3>收入类别</h3>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource1}
                    />
                    <h3>支出类别</h3>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource2}
                    />
                </Spin>
            </div>
        );
    }
}

export default Index;