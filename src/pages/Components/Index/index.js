import React, {Component} from 'react';
import {Card,Icon,message,Spin} from 'antd';
import './index.css';
import { List } from 'antd';
import {ajax_get} from "../../../axios";

class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            spinStatus:false
        }
    }

    init=()=>{
        this.setState({spinStatus:true})
        ajax_get(
            'api/view/home?token='+localStorage.getItem("token"),
            (data)=>{
                this.setState({
                    currentdate:data.cash.month,
                    cashin:data.cash.in,
                    cashout:data.cash.in,
                    accountin:data.account.in,
                    accountout:data.account.out,
                    waitforpay:data.waitingForPayment,
                    waitforcollect:data.waitingForCollection
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

    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <div>
                <Spin spinning={this.state.spinStatus} tip={"loading"}>
                    <div style={{margin:'0 auto'}}>
                        <Card
                            style={{width:'100%'}}
                            title={<span style={{fontSize:'30px'}}><b>大家一起来记账吧！</b></span>}
                        >
                            <div className={"details"}>
                                <List
                                    header={<div>
                                        <h2>本月财经报告&nbsp;&nbsp;{this.state.currentdate}</h2>
                                    </div>}
                                    bordered
                                    dataSource={
                                        [
                                            '现金收支：'+'收入:'+this.state.cashin+" "+'支出:'+this.state.cashout,
                                            '账面收支：'+'收入:'+this.state.accountin+" "+'支出:'+this.state.accountout,
                                            '待付款：'+this.state.waitforpay,
                                            '代收款：'+this.state.waitforcollect,
                                        ]
                                    }
                                    renderItem={item => (
                                        <List.Item style={{fontSize:'14px'}}>
                                            <Icon type={'pay-circle'}></Icon>{item}
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default Index;