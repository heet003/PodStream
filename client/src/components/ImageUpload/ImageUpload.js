import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      setIsValid(true);
      props.onInput(props.id, fileReader.result, isValid);
    };
    fileReader.readAsDataURL(file);
  }, [file, props, isValid]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
      props.onInput(props.id, null, false);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          <img
            src={
              previewUrl
                ? previewUrl
                : props.userImage
                ? props.userImage
                : `https://bootdey.com/img/Content/avatar/avatar7.png`
            }
            alt="Preview"
          />
        </div>
        <button type="button" onClick={pickImageHandler}>
          Pick Image
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
