import React, {Component} from 'react';
import {HashRouter, Switch, Route, Link} from 'react-router-dom';
import Register from '../Components/register'
import './App.css';
import Login from '../Components/login';
import PDetails from '../Components/PDetails';
import {Layout, Menu,  Icon, Spin, message, Modal, Dropdown} from 'antd';
import Avatar from 'antd/es/avatar';
import Index from '../Components/Index';
import Findpwd from '../Components/findpwd';
import Account from '../Components/account/index';
import Category from "../Components/category";
import Record from "../Components/record";
import Book from "../Components/book";
import Feedback from "../Components/Feedback";
import {ajax_get} from '../../axios';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinStatus: false
        }
    }


    //登陆注册后更新页面
    handleInit=()=>{
        this.init();
    }


    //改变当前显示帐簿信息
    handleChange= (data)=>{
        this.setState({...data})
    }


    showModal = () => {
        const modal = Modal.confirm({
            title: "你确定要退出嘛",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                this.setState({spinStatus: true})
                ajax_get(
                    'api/user/logout?token=' + localStorage.getItem("token"),
                    () => {
                        message.success('注销成功');
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_id");
                        this.init();
                    },
                    () => {
                        message.error('注销失败');
                    },
                    ()=>{
                        this.setState({spinStatus: false})
                    }
                    )

                //销毁确认框
                modal.destroy();
            },

            onCancel: () => {
                modal.destroy();
            }
        })
    }


    init = () => {
        this.setState({spinStatus:true})
            ajax_get(
                'api/user/profile?token=' + localStorage.getItem("token"),
                (data) => {
                    this.setState({
                        avatar_url: data.avatar_url,
                        nickname: data.nickname,
                    })
                },
                (err) => {
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinStatus: false})
                }
            )


            ajax_get(
                'api/book/get-default?token=' + localStorage.getItem("token"),
                (data) => {
                    this.setState({current_book: data.name})
                },
                (err) => {
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinStatus: false})
                })
    }


    componentDidMount() {
        this.init();
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Link to={'/personal_details'}>个人详情</Link>
                </Menu.Item>
                <Menu.Item onClick={() => {
                    this.showModal()
                }} key="1">
                    注销
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to={'/feedback'}>反馈</Link>
                </Menu.Item>
            </Menu>
        )


        return (
            <div className={'App'}>
                <HashRouter>
                    <Spin spinning={this.state.spinStatus} tip={"loading"}>
                        <Layout>
                            <Header className="header">
                                <div className="logo">
                                    {!localStorage.getItem("token") ? (
                                        <div className={'status'}>
                                            <Icon type={'user'} className={'load_img'}/>
                                            <span>未登录用户</span>
                                        </div>
                                    ) : (
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <div>
                                                <Avatar style={{marginRight: '10px'}} src={this.state.avatar_url}
                                                        className={'avatar_img'}/>
                                                <span>欢迎你,{this.state.nickname}</span>
                                                <Icon type="down"/>
                                            </div>
                                        </Dropdown>
                                    )}
                                </div>


                                <div style={{float: 'right', fontSize: '16px'}}>
                                    {localStorage.getItem("token") ?
                                        (<span>当前帐簿：<b>{this.state.current_book}</b></span>)
                                        :
                                        (<span/>)}
                                </div>
                            </Header>

                            <Layout>
                                {localStorage.getItem("token") ? (<Sider onClick={() => {
                                    this.setState({current_key: undefined})
                                }} width={200} style={{background: '#fff'}}>
                                    <Menu
                                        mode="inline"
                                        style={{height: '100%', borderRight: 0}}
                                    >
                                        <SubMenu
                                            key="sub1"
                                            title={
                                                <span>
                                                <Icon type="user"/>
                                                账户管理
                                             </span>
                                            }
                                        >
                                            <Menu.Item key="1"><Link to={'/account'}>我的账户</Link></Menu.Item>
                                            <Menu.Item key="2"><Link to={'/account/add_account'}>新增账户</Link></Menu.Item>
                                        </SubMenu>
                                        <SubMenu
                                            key="sub2"
                                            title={
                                                <span>
                                                <Icon type="fund"/>
                                                收支类别
                                            </span>
                                            }
                                        >
                                            <Menu.Item key="3"><Link to={'/category'}>类别一览</Link></Menu.Item>
                                            <Menu.Item key="4"><Link to={'/category/create'}>新增类别</Link></Menu.Item>

                                        </SubMenu>
                                        <SubMenu
                                            key="sub3"
                                            title={
                                                <span>
                                                <Icon type="money-collect"/>
                                                帐本管理
                                            </span>
                                            }
                                        >
                                            <Menu.Item key="5"><Link to={'/record'}>我的账本</Link></Menu.Item>
                                            <Menu.Item key="6"><Link to={'/record/addNew'}>新增账本</Link></Menu.Item>
                                        </SubMenu>
                                        <SubMenu
                                            key="sub4"
                                            title={
                                                <span>
                                                <Icon type="snippets"/>
                                                帐簿管理
                                            </span>
                                            }
                                        >
                                            <Menu.Item key="7"><Link to={'/book'}>我的账簿</Link></Menu.Item>
                                            <Menu.Item key="8"><Link to={'/book/member'}>成员管理</Link></Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                </Sider>) : (null)}

                                <Layout style={{padding: '0 24px 24px'}}>
                                    <Content
                                        style={{
                                            background: '#fff',
                                            padding: 24,
                                            marginTop: 20,
                                            minHeight: 500,
                                        }}
                                    >
                                        <Switch>
                                            <Route exact path={'/'}><Index/></Route>
                                            <Route path={'/register'}><Register init={this.handleInit}/></Route>
                                            <Route path={'/login'}><Login init={this.handleInit}/></Route>
                                            <Route path={'/personal_details'}><PDetails change={this.handleChange}/></Route>
                                            <Route path={'/findpassword'}><Findpwd/></Route>
                                            <Route path={'/account'}><Account/></Route>
                                            <Route path={'/category'}><Category/></Route>
                                            <Route path={'/record'}><Record/></Route>
                                            <Route path={'/book'}><Book change={this.handleChange}/></Route>
                                            <Route path={'/feedback'}><Feedback /></Route>
                                        </Switch>
                                    </Content>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Spin>
                </HashRouter>
            </div>
        );
    }
}

export default App;