import React, {Component} from 'react';
import {Input, Button, Row, Col, Spin, message} from 'antd';
import {ajax_post} from "../../../axios";
class Feedback extends Component {
    constructor(props){
        super(props);
        this.state={
            spinstatus:false
        }
    }

    handleClick=()=>{
        this.setState({spinstatus:true})
        ajax_post(
            'api/feedback/add?token='+localStorage.getItem("token"),
            ()=>{
                message.success("感谢您的反馈")
            },
            (err)=>{
                message.error(err.data)
            },
            ()=>{
                this.setState({spinstatus:false})
            },
            {
                content:this.state.feedback,
                contact:this.state.contact
            }
        )
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