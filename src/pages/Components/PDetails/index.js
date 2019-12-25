import React, {Component} from 'react';
import {Switch,Route} from 'react-router-dom';
import Index from './Components/Index/index';
import Avatar from './Components/changeImg/index';
import ResetTel from './Components/resetTel/index';
class PDetails extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path={'/personal_details'}><Index change={this.props.change}/></Route>
                    <Route path={'/personal_details/changeImg'}><Avatar /></Route>
                    <Route path={'/personal_details/resetTel'}><ResetTel/></Route>
                </Switch>
            </div>
        );
    }
}

export default PDetails;