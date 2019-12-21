import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Index from './Components/Index/index';
import Editcategory from "./Components/Edit_category";
import Addcategory from "./Components/Add_category";
class Category extends Component {
    constructor(props){
        super(props);
        this.state={}
    }

    render() {
        return (
            <div>
                <Route exact path={'/category'}><Index/></Route>
                <Route path={'/category/edit'}><Editcategory/></Route>
                <Route path={'/category/create'}> <Addcategory /></Route>
            </div>
        );
    }
}

export default Category;