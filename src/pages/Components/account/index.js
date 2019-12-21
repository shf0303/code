import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Index from "./components/Index/index";
import Addaccount from './components/add_account/index';
import Editaccount from "./components/edit_account";
import Account_detail from "./components/account_detail";
class Account extends Component {
    constructor(props){
        super(props);
        this.state={}
    }

    render() {
        return (
            <div>
                    <Route exact path={'/account'}><Index /></Route>
                    <Route path={'/account/add_account'}><Addaccount /></Route>
                    <Route path={'/account/edit_account'}>
                        <Editaccount />
                    </Route>
                    <Route path={"/account/account_detail"}>
                        <Account_detail />
                    </Route>
            </div>
        );
    }
}

export default Account;