import React, {Component} from 'react';
import {DatePicker, Divider, Pagination, Row, Col, Statistic, Popconfirm, Icon, Spin, message} from "antd";
import {Link} from 'react-router-dom'
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import {ajax_get, ajax_post} from "../../../../axios";
moment.locale('zh-cn');
const {RangePicker} = DatePicker;
class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            page:1,
            spinstatus:false,
            list:[]
        }
    }

    init=(date)=>{
        this.setState({spinstatus:true});
        ajax_get(
            'api/record/account?token='+localStorage.getItem("token"),
            (data)=>{
                this.setSource(data.list);
                this.setState({in:data.in,out:data.out,total:data.list.length})
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            },
            {
                begin_date:date === undefined ||date[0] === ''? undefined : date[0],
                end_date:date === undefined || date[1]===''? undefined : date[1],
            }
        )

        ajax_get(
            'api/record/account/waiting?token='+localStorage.getItem("token"),
            (data)=>{
                this.setState({waitin:data.total})
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            },
            {
                type:1,
                begin_date:date === undefined ||date[0] === ''? undefined : date[0],
                end_date:date === undefined || date[1]===''? undefined : date[1],
            }
        )

        ajax_get(
            'api/record/account/waiting?token='+localStorage.getItem("token"),
            (data)=>{
                this.setState({waitout:data.total})
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            },
            {
                type:2,
                begin_date:date === undefined ||date[0] === ''? undefined : date[0],
                end_date:date === undefined || date[1]===''? undefined : date[1],
            }
        )
    }



    componentDidMount() {
        this.init();
    }

    showTotal=(total)=>{
        return `总共${total}笔记账`
    }

    setSource=(data)=>{
        let source=[];
        let proportion = 10;
        let num = 0;
        for(let i=0;i<data.length;i++){
            if(i % proportion === 0 && i!==0){
                source.push(data.slice(num,i))
                num = i
            }
            if(i+1 === data.length){
                source.push(data.slice(num))
            }
        }
        this.setState({list:source})
    }

    render() {

        const now = new Date(); //当前日期
        const nowMonth = now.getMonth(); //当前月
        const nowYear = now.getFullYear(); //当前年
        //本月的开始时间
        const monthStartDate = new Date(nowYear, nowMonth, 1);
        //本月的结束时间
        const monthEndDate = new Date(nowYear, nowMonth+1, 0);
        //将date对象转化为moment对象
        const begin_date = moment(monthStartDate);
        const end_date = moment(monthEndDate);


        let source=[];
        if(this.state.list.length !== 0){
            source = this.state.list[this.state.page-1]
        }

        return (
            <div>
                <Spin tip={"loading"} spinning={this.state.spinstatus}>
                    <Row gutter={[8,8]}>
                        <Col span={16}>
                            <RangePicker
                                locale={locale}
                                onChange={(value,str)=>{
                                    this.init(str)
                                }}
                                defaultValue={[begin_date,end_date]}
                                allowClear={false}
                            />
                        </Col>
                        <Col span={4}>
                            <Statistic title="账面总收入" value={this.state.in} />
                            <Statistic title="待收" value={this.state.waitin} />

                        </Col>
                        <Col span={4}>
                            <Statistic title="账面总支出" value={this.state.out} />
                            <Statistic title="待付" value={this.state.waitout} />
                        </Col>
                    </Row>
                        <table border={1} style={{width:1000,textAlign:'center',verticalAlign:'middle',borderColor:'gray'}}>
                            <thead>
                            <tr>
                                <th style={{lineHeight:'40px'}}>日期</th>
                                <th>账面收支</th>
                                <th>实际收支</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {source.map((item,key)=>{
                                return(
                                    <tr key={key}>
                                        <td style={{lineHeight:'40px'}}>
                                            {item.date}
                                        </td>
                                        <td>
                                            {item.type===1? '+'+item.total_money : '-'+item.total_money}
                                        </td>
                                        <td>
                                            {item.type===1? '+'+item.paid_money : '-'+item.paid_money}
                                        </td>
                                        <td>
                                            <Link to={"/record/detail"} onClick={()=>{
                                                localStorage.setItem("record_id",item.id)
                                            }}>
                                                详情
                                            </Link>
                                            <Divider type={'vertical'} />
                                            <Popconfirm
                                                title="确定要删除吗？"
                                                okText={'确认'}
                                                cancelText={"取消"}
                                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                                onConfirm={()=>{
                                                    this.setState({spinstatus:true})
                                                    ajax_post(
                                                        'api/record/delete?id='+item.id+'&token='+localStorage.getItem("token"),
                                                        ()=>{
                                                            message.success("删除成功")
                                                            this.init();
                                                        },
                                                        (err)=>{
                                                            message.error(err.data)
                                                        },
                                                        ()=>{
                                                            this.setState({spinstatus:false})
                                                        },
                                                    )
                                                }}
                                            >
                                                <span style={{cursor:'pointer',color:'#1890ff'}}>删除</span>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    <Pagination
                        style={{marginTop:'20px'}}
                        total={this.state.total}
                        pageSize={10}
                        onChange={(page)=>{this.setState({page:page})}}
                        showQuickJumper
                        showTotal={this.showTotal}/>
                </Spin>
            </div>
        );
    }
}


export default Index;