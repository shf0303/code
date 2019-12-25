 import React from 'react';
import {Upload,Icon,message,Spin} from 'antd';
import baseurl from '../../../../../baseurl';
import Button from 'antd/es/button';
 import {createHashHistory} from "history";
 import {ajax_post} from "../../../../../axios";
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
    state = {
        loading: false,
        spinStatus:false
    };

    handleChange = info => {

        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
            console.log(info.file.response.data.file.fileKey);
            this.setState({fileKey:info.file.response.data.file.fileKey})
        }
    };


    handleClick =()=>{
        if(this.state.fileKey===undefined){
            message.error("您还未上传头像")
        }else{
            this.setState({spinStatus:true})
            const obj = {avatar:this.state.fileKey}
            ajax_post(
                'api/user/profile/update?token='+localStorage.getItem('token'),
                ()=>{
                    message.success("修改成功")
                    createHashHistory().push('/personal_details')
                },
                (err)=>{
                    message.error(err.data)
                },
                ()=>{
                    this.setState({spinStatus:false})
                },
                obj
            )
        }
    }


    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <div>
                <Spin spinning={this.state.spinStatus} tip={"loading"}>
                    <Upload
                        method='post'
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action = {baseurl+"api/upload/image?token="+localStorage.getItem("token")}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                    <Button type={"primary"} onClick={this.handleClick}>保存为头像</Button>
                </Spin>
            </div>
        );
    }
}

export default Avatar;