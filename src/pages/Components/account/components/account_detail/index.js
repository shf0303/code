import React, {Component} from 'react';
import { Descriptions, DatePicker,Spin,message } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import {ajax_get} from "../../../../../axios";
moment.locale('zh-cn');
const {MonthPicker} = DatePicker;


class Account_detail extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false
        };
    }

    getDetail =()=>{
        this.setState({spinstatus:true})
        ajax_get(
            'api/account/detail?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token"),
            (data)=>{
                switch (data.type) {
                    case 1: data.type="现金";break;
                    case 2: data.type="银行";break;
                    case 3: data.type="支付平台";break;
                    case 4: data.type="其他";break;
                }
                this.setState({
                    name:data.name,
                    type:data.type,
                    initial_balance:data.initial_balance,
                    balance:data.balance,
                    create_time:data.created_at,
                    update_time:data.updated_at,
                    sort:data.sort,
                    remark:data.remark,
                })
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            }
        )
    }



    getMoneyChange =(data)=>{

        if(data){
            this.setState({spinstatus:true})
            ajax_get(
                'api/account/change?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token"),
                (data)=>{
                    this.setState({in:data.in,out:data.out})
                },
                (err)=>{
                    message.error(err.data)

                },
                ()=>{
                    this.setState({spinstatus:false})
                },
                {month:data}
            )
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    render() {
        return (
            <div>
                <Spin tip={"loading"} spinning={this.state.spinstatus}>
                    <Descriptions column={2} bordered title="账户详情" size={'default'}>
                        <Descriptions.Item label="账户名称">{this.state.name}</Descriptions.Item>
                        <Descriptions.Item label="账户类型">{this.state.type}</Descriptions.Item>
                        <Descriptions.Item label="排序">{this.state.sort}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{this.state.create_time}</Descriptions.Item>
                        <Descriptions.Item label="最后修改时间">{this.state.update_time}</Descriptions.Item>
                        <Descriptions.Item label="期初余额">{this.state.initial_balance}</Descriptions.Item>
                        <Descriptions.Item label="现存余额">{this.state.balance}</Descriptions.Item>
                        <Descriptions.Item label="备注">{this.state.remark}</Descriptions.Item>
                    </Descriptions>
                    <br/><br/>
                    <Descriptions title={"账户月金额变化"} size={"default"}>
                        <Descriptions.Item label="日期"><MonthPicker
                            locale={locale}
                            onChange={(value,str)=>{this.getMoneyChange(str)}}
                        /></Descriptions.Item>
                        <Descriptions.Item label="总收入">{this.state.in}</Descriptions.Item>
                        <Descriptions.Item label="总支出">{this.state.out}</Descriptions.Item>
                    </Descriptions>
                </Spin>
            </div>
        );
    }
}

export default Account_detail;