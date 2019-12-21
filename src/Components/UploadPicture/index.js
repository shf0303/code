import React from 'react';
import { Upload, Icon, Modal,message } from 'antd';
import baseurl from "../../baseurl";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
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

class UploadPicture extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList:[]
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = (info) => {
        this.setState({ fileList:info.fileList })
        if (info.file.status === 'done'){
            message.success("上传成功")
            this.props.send(info.file.response.data.file.fileKey)
        }else if(info.file.status === 'error'){
            message.error("上传失败")
        }
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    method={'post'}
                    action = {baseurl+"api/upload/image?token="+localStorage.getItem("token")}
                    name={'file'}
                    listType="picture-card"
                    fileList={fileList}
                    multiple={true}
                    beforeUpload={beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadPicture;