import React, {Component} from 'react';
import { Descriptions, DatePicker,Spin,message } from 'antd';
import axios from 'axios';
import baseurl from "../../../../../baseurl";
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
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
        axios({
            method: 'get',
            url:baseurl+'api/account/detail?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token")
        }).then((response)=>{
            this.setState({spinstatus:false})
            switch (response.data.data.type) {
                case 1: response.data.data.type="现金";break;
                case 2: response.data.data.type="银行";break;
                case 3: response.data.data.type="支付平台";break;
                case 4: response.data.data.type="其他";break;
            }
            this.setState({
                        name:response.data.data.name,
                        type:response.data.data.type,
                        initial_balance:response.data.data.initial_balance,
                        balance:response.data.data.balance,
                        create_time:response.data.data.created_at,
                        update_time:response.data.data.updated_at,
                        sort:response.data.data.sort,
                        remark:response.data.data.remark,
            })

        })
    }



    getMoneyChange =(data)=>{

        if(data){
            this.setState({spinstatus:true})
            axios({
                method: 'get',
                url:baseurl+'api/account/change?id='+localStorage.getItem("account_id")+'&token='+localStorage.getItem("token"),
                params:{month:data}
            }).then((response)=>{
                this.setState({spinstatus:false})
                this.setState({in:response.data.data.in,out:response.data.data.out})
            }).catch((err)=>{
                this.setState({spinstatus:false})
                message.error("获取失败")
            })
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