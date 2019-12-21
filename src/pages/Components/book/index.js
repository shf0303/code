import React, {Component} from 'react';
import {Route} from "react-router-dom";
import Index from "./Components/Index/index";
import Member from "./Components/Member";
class Book extends Component {
    render() {
        return (
            <div>
                <Route exact path={'/book'}>
                    <Index change={this.props.change} />
                </Route>
                <Route path={'/book/member'}>
                    <Member />
                </Route>
            </div>
        );
    }
}

export default Book;