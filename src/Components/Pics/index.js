import React, {Component} from 'react';
import axios from 'axios';
import baseurl from '../../baseurl';
import  Input from 'antd/es/input';
import Button from 'antd/es/button';
import './index.css'
class Pics extends Component {
    constructor(props){
        super(props);
        this.state={
            url:'',
            mobile:"",captcha_code:'',captcha_key:''
        }
    }

    init = () =>{
        axios.get(baseurl+'api/captcha')
            .then((response) => {
                this.setState({url:response.data.data.url,captcha_key:response.data.data.key})
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const a = 0;
        return (
            <div>
                <div>
                     输入验证码：<Input
                                    className={"PicNumber"}
                                    type="text"
                                    value={this.state.captcha_code}
                                    onChange={(e)=>{this.setState(
                                            {captcha_code:e.target.value},
                                            ()=>{this.props.send({captcha_code:this.state.captcha_code,captcha_key:this.state.captcha_key})}
                                    )}}
                                />
                    <div className={"PicImg"}><img src={this.state.url} alt="努力加载中"/></div>
                    <Button onClick={this.init} type="default">重新获取验证码</Button>
                </div>

            </div>
        );
    }
}

export default Pics;