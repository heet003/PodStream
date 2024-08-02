import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./UploadPodcast.css"; // Ensure this file exists and is styled
import { useAuth } from "../hooks/auth-hook";
import { storage } from "./firebase";
import { useHttpClient } from "../hooks/http-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadPodcast = ({ podcast, onEditSuccess }) => {
  const { token } = useAuth();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [isUploading, setIsUploading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (podcast) {
      form.setFieldsValue({
        name: podcast.name,
        publisher: podcast.publisher,
        isExplicit: podcast.explicit,
        description: podcast.description,
        duration: podcast.durationMs,
      });
    }
  }, [podcast, form]);

  const handleUpload = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("publisher", values.publisher);
    formData.append("isExplicit", values.isExplicit);
    formData.append("description", values.description);
    formData.append("durationText", values.duration);
    setIsUploading(true);

    if (podcast) {
      // Upload audio file
      if (values.audio && values.audio.originFileObj) {
        const audioFile = values.audio.originFileObj;
        const audioRef = ref(storage, `podcasts/${audioFile.name}`);
        try {
          await uploadBytes(audioRef, audioFile);
          const audioUrl = await getDownloadURL(audioRef);
          formData.append("audio", audioUrl);
        } catch (error) {
          console.error("Error uploading audio file:", error);
        }
      }

      // Upload cover image
      if (values.cover && values.cover.originFileObj) {
        const coverFile = values.cover.originFileObj;
        const coverRef = ref(storage, `covers/${values.cover.name}`);
        try {
          await uploadBytes(coverRef, coverFile);
          const coverUrl = await getDownloadURL(coverRef);
          formData.append("cover", coverUrl);
        } catch (error) {
          console.error("Error uploading cover image:", error);
        }
      }
    }

    try {
      const url = podcast
        ? `http://localhost:5000/api/podcasts/edit/${podcast._id}`
        : "http://localhost:5000/api/podcasts/upload";
      const method = "POST";
      console.log(formData);
      await sendRequest(url, method, formData, {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      message.success(
        `Podcast ${podcast ? "edited" : "uploaded"} successfully!`
      );
      form.resetFields();
      if (podcast) {
        onEditSuccess();
      }
    } catch (error) {
      console.log(error);
      message.error(
        `Failed to ${podcast ? "edit" : "upload"} podcast. Please try again.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-podcast">
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <h2>{podcast ? "Edit Podcast" : "Upload Podcast"}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpload}
        initialValues={{ isExplicit: false }}
      >
        <Form.Item
          label="Podcast Name"
          name="name"
          rules={[{ required: true, message: "Please enter podcast name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Publisher Name"
          name="publisher"
          rules={[{ required: true, message: "Please enter publisher name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="18+ Content"
          name="isExplicit"
          rules={[{ required: true, message: "Please select content rating" }]}
        >
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter podcast description" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Duration (in seconds)"
          name="duration"
          rules={[{ required: true, message: "Please enter duration" }]}
        >
          <Input type="number" />
        </Form.Item>

        {!podcast && (
          <React.Fragment>
            <Form.Item
              label="Audio File"
              name="audio"
              valuePropName="file"
              getValueFromEvent={(e) => e.fileList[0]}
              rules={[
                {
                  required: podcast ? false : true,
                  message: "Please upload audio file",
                },
              ]}
            >
              <Upload
                name="audio"
                beforeUpload={() => false}
                accept=".mp3,.wav"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Audio</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Cover Thumbnail"
              name="cover"
              valuePropName="file"
              getValueFromEvent={(e) => e.fileList[0]}
              rules={[
                {
                  required: podcast ? false : true,
                  message: "Please upload cover thumbnail",
                },
              ]}
            >
              <Upload
                name="cover"
                beforeUpload={() => false}
                accept=".jpg,.jpeg,.png"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Cover</Button>
              </Upload>
            </Form.Item>
          </React.Fragment>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUploading}
            disabled={isUploading}
          >
            {podcast ? "Edit" : "Upload"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadPodcast;
