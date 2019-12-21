import React, {Component} from 'react';
import {HashRouter,Switch,Route,Link} from 'react-router-dom';
import Register from '../Components/register'
import './App.css';
import Login from '../Components/login';
import PDetails from '../Components/PDetails';
import axios from 'axios';
import baseurl from '../../baseurl';
import { Layout, Menu, Breadcrumb, Icon,Spin, message,Modal  } from 'antd';
import Avatar from 'antd/es/avatar';
import {createHashHistory} from 'history';
import Index from '../Components/Index';
import Findpwd from '../Components/findpwd';
import Account from '../Components/account/index';
import Category from "../Components/category";
import Record from "../Components/record";
import Book from "../Components/book";
import Feedback from "../Components/Feedback";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            token:localStorage.getItem("token"),
            current_key:'1',
            spinstatus:false
        }
    }

    handleSend=(data)=>{
        this.setState({...data},()=>{this.init()});
    }

    handleChange=(data)=>{
        this.setState({...data})
    }

    showModal =()=>{
        const modal = Modal.confirm({
            title:"你确定要退出嘛",
            okText:"确定",
            cancelText:"取消",
            onOk:()=>{
                this.setState({spinstatus:true})
                //移除网页存储token,并注销用户
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                axios.get(baseurl+'api/user/logout?token='+localStorage.getItem('token'))
                    .then((response)=> {
                        message.success('注销成功');
                        this.setState({spinstatus:false})
                    })
                    .catch(function (error) {
                        message.error('注销失败');
                        this.setState({spinstatus:false})
                    })

                this.setState({token:localStorage.getItem("token")})
                this.init();

                //跳转首页，并显示更新光标选中对象
                createHashHistory().push('/');
                this.setState({current_key:'1'});

                //销毁确认框
                modal.destroy();
            },
            onCancel:()=>{
                modal.destroy();
            }
        })
    }


    init = ()=>{
        if (localStorage.getItem("token")){
            this.setState({spinstatus:true})
            axios.get(baseurl+'api/user/profile?token='+localStorage.getItem("token"))
                .then((response)=> {
                    this.setState({
                        avatar_url:response.data.data.avatar_url,
                        nickname:response.data.data.nickname,
                        mobile:response.data.data.mobile
                    })
                })
                .catch(function (error) {
                    message.error("请检查你的网络");
                })

            axios({
                method:'get',
                url:baseurl+'api/book/get-default?token='+localStorage.getItem("token")
            }).then((response)=>{
                this.setState({current_book:response.data.data.name})
            })

            this.setState({spinstatus:false})
        }else {
            return false;
        }
    }

    componentDidMount(){
        this.init();
    }
    render() {
        return (
            <div className={'App'}>
                <HashRouter>
                    <Spin spinning={this.state.spinstatus} tip={"loading"}>
                        <Layout>
                            <Header className="header">
                                <div className="logo">
                                    {!this.state.token?(
                                        <div className={'status'}>
                                            <Icon type={'user'} className={'load_img'}/>
                                            <span>未登录用户</span>
                                        </div>
                                    ):(
                                        <Link className={'wel-msg'} to={'/personal_details'} title={'查看个人信息'}>
                                            <Avatar style={{marginRight:'10px'}} src={this.state.avatar_url} className={'avatar_img'}/>
                                            <span >欢迎你,{this.state.nickname}</span>
                                        </Link>
                                    )}
                                </div>
                                <div style={{float:'right',fontSize:'16px'}}>
                                    {localStorage.getItem("token")?
                                        (<span>当前帐簿：<b>{this.state.current_book}</b></span>)
                                        :
                                        (<span/>)}
                                </div>
                                {this.state.token == undefined?(
                                    <Menu
                                        theme="dark"
                                        mode="horizontal"
                                        onClick={(e)=>{
                                            this.setState({current_key:e.key})
                                        }}
                                        selectedKeys={[this.state.current_key]}
                                        style={{ lineHeight: '64px' }}
                                    >
                                        <Menu.Item key="1"><Link to={'/'}>首页</Link></Menu.Item>
                                        <Menu.Item key="2"><Link to={'/register'}>注册</Link></Menu.Item>
                                        <Menu.Item key="3"><Link to={'/login'}>登录</Link></Menu.Item>
                                    </Menu>
                                ):(
                                    <Menu
                                        theme="dark"
                                        mode="horizontal"
                                        onClick={(e)=>{
                                            this.setState({current_key:e.key})
                                        }}
                                        selectedKeys={[this.state.current_key]}
                                        style={{ lineHeight: '64px' }}
                                    >
                                        <Menu.Item key="1"><Link to={'/'}>首页</Link></Menu.Item>
                                        <Menu.Item key="2"><Link to={'/personal_details'}>个人信息</Link></Menu.Item>
                                        <Menu.Item key="3" onClick={this.showModal}>注销登录</Menu.Item>
                                        <Menu.Item key="4"><Link to={'/feedback'}>反馈</Link></Menu.Item>
                                    </Menu>
                                )}
                            </Header>


                            <Layout>
                                <Sider onClick={()=>{this.setState({current_key:undefined})}} width={200} style={{ background: '#fff' }}>
                                    <Menu
                                        mode="inline"
                                        style={{ height: '100%', borderRight: 0 }}
                                    >
                                        <SubMenu
                                            key="sub1"
                                            title={
                                                <span>
                                                <Icon type="user" />
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
                                                <Icon type="fund" />
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
                                                <Icon type="money-collect" />
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
                                                <Icon type="snippets" />
                                                帐簿管理
                                            </span>
                                            }
                                        >
                                            <Menu.Item key="7"><Link to={'/book'}>我的账簿</Link></Menu.Item>
                                            <Menu.Item key="8"><Link to={'/book/member'}>成员管理</Link></Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                </Sider>

                                <Layout style={{ padding: '0 24px 24px' }}>
                                    <Content
                                        style={{
                                            background: '#fff',
                                            padding: 24,
                                            marginTop: 20,
                                            minHeight: 500,
                                        }}
                                    >
                                        <Switch>
                                            <Route exact path={'/'}><Index change={this.handleChange} /></Route>
                                            <Route path={'/register'}><Register change={this.handleChange} send={this.handleSend} /></Route>
                                            <Route path={'/login'}><Login change={this.handleChange} send={this.handleSend} /></Route>
                                            <Route path={'/personal_details'}><PDetails
                                                change={this.handleChange}
                                            /></Route>
                                            <Route path={'/findpassword'}><Findpwd /></Route>
                                            <Route path={'/account'}><Account /></Route>
                                            <Route path={'/category'}><Category /></Route>
                                            <Route path={'/record'}><Record /></Route>
                                            <Route path={'/book'}><Book change={this.handleChange}/></Route>
                                            <Route path={'/feedback'}><Feedback change={this.handleChange}/></Route>
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