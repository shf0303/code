import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import baseurl from '../../../baseurl';
import {Card,Icon} from 'antd';
import './index.css';
import { List } from 'antd';

class Index extends Component {
    constructor(props){
        super(props);
        this.state={}
    }

    init=()=>{
        if (localStorage.getItem("token")){
            axios({
                method:'get',
                url:baseurl+'api/view/home?token='+localStorage.getItem("token")
            }).then((response)=>{
                this.setState({
                    currentdate:response.data.data.cash.month,
                    cashin:response.data.data.cash.in,
                    cashout:response.data.data.cash.in,
                    accountin:response.data.data.account.in,
                    accountout:response.data.data.account.out,
                    waitforpay:response.data.data.waitingForPayment,
                    waitforcollect:response.data.data.waitingForCollection
                })
            })

            axios({
                method:'get',
                url:baseurl+'api/record/real?token='+localStorage.getItem("token"),

            }).then((response)=>{
                console.log(response);
            })

        }else {
            return false;
        }
    }

    componentDidMount() {
        this.props.change({current_key:'1'});
        this.init();
    }

    render() {

        return (
            <div>

                {!localStorage.getItem('token')?(
                    <p>你还未登录，请<Link to={'/login'}>登录</Link>获取更多内容！</p>
                ):(
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
                )}
            </div>
        );
    }
}

export default Index;