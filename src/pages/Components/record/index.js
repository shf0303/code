import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Index from "./Index/index";
import Addrecord from "./Addrecord";
import RecordDetail from "./Record_detail";
import EditItem from "./EditItem";
import Editrecord from "./Editrecord";
import AddItem from "./AddItem";
class Record extends Component {
    constructor(props){
        super(props)
        this.state={}
    }


    render() {
        return (
            <div>
                <Route exact path={'/record'}>
                    <Index  />
                </Route>
                <Route path={'/record/addNew'}>
                    <Addrecord />
                </Route>
                <Route path={'/record/detail'}>
                    <RecordDetail />
                </Route>
                <Route path={'/record/edit_item'}>
                    <EditItem />
                </Route>
                <Route path={'/record/edit_record'}>
                    <Editrecord />
                </Route>
                <Route path={'/record/add_item'}>
                    <AddItem />
                </Route>
            </div>
        );
    }
}

export default Record;