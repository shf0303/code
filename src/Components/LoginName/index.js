import React, {Component} from 'react';
import Input from 'antd/es/input';
import './index.css';

class LoginName extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
        return (
            <div className={"loginname"}>
                昵称：
                <Input
                    className={"name"}
                    type={"text"}
                    value={this.state.name}
                    onChange={(e)=>{this.setState(
                        {name:e.target.value},
                        ()=>{this.props.send({loginname:this.state.name})}
                        )}}
                />
            </div>
        );
    }
}

export default LoginName;