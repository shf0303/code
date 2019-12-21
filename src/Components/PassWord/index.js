import React, {Component} from 'react';
import './index.css';
import Input from 'antd/es/input';
class PassWord extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
        return (
            <div>
                密码：
                <Input.Password
                    className={"password"}
                    value={this.state.password}
                    onChange={(e)=>{this.setState(
                        {password:e.target.value},
                        ()=>{this.props.send({password:this.state.password})}
                        )}}
                    visibilityToggle
                />
            </div>
        );
    }
}

export default PassWord;