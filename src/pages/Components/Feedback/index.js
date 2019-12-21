import React, {Component} from 'react';
import {Input, Button, Row, Col, Spin, message} from 'antd';
import axios from 'axios';
import qs from 'qs';
import baseurl from "../../../baseurl";
class Feedback extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false
        }
    }
    componentDidMount() {
        this.props.change({current_key:'4'})
    }

    handleClick=()=>{
        this.setState({spinstatus:true})
        axios({
            method:'post',
            url:baseurl+'api/feedback/add?token='+localStorage.getItem("token"),
            data:qs.stringify({
                content:this.state.feedback,
                contact:this.state.contact
            })
        }).then((response)=>{
            if(response.data.status){
                message.success("感谢您的反馈")
            }else {
                message.error(response.data.data)
            }
            this.setState({spinstatus:false})
        }).catch((err)=>{
            message.error(err)
            this.setState({spinstatus:false})
        })
    }

    render() {
        return (
            <div style={{marginTop:'50px'}}>
                <Spin tip={'loading'} spinning={this.state.spinstatus}>
                    <Row>
                        <Col span={8}/>
                        <Col span={8}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>反馈内容：</td>
                                    <td><Input.TextArea value={this.state.feedback} onChange={(e)=>{
                                        this.setState({feedback:e.target.value})
                                    }}/></td>
                                </tr>
                                <tr>
                                    <td>联系方式：</td>
                                    <td>
                                        <Input value={this.state.contact} onChange={(e)=>{
                                            this.setState({contact:e.target.value})
                                        }}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><Button onClick={this.handleClick} icon={'smile'}>提交反馈</Button></td>
                                </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col span={8}/>
                    </Row>
                </Spin>
            </div>
        );
    }
}

export default Feedback;