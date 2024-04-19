import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  Label,
  Form,
  Spinner,
} from "reactstrap";
import EmojiPicker from "emoji-picker-react";
import { connect } from "formik";

const ChatInput = ({ addMessage, id }) => {
  const [textMessage, settextMessage] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [file, setfile] = useState(null);
  const [fileImage, setfileImage] = useState(null);
  const [loader, setLoader] = useState(false);

  const toggle = () => setisOpen(!isOpen);

  //function for text input value change
  const handleChange = (e) => {
    settextMessage(e.target.value);
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log("emojiiiii",emojiObject)
    console.log("emojiiiii emoji",emojiObject.emoji)

    settextMessage(textMessage + emojiObject.emoji);
  };

  //function for file input change
  const handleFileChange = (e) => {
    if (e.target.files.length !== 0) setfile(e.target.files[0]);
    // setfile({
    //     name: e.target.files[0].name,
    //     size: e.target.files[0].size
    // })
  };

  //function for image input change
  const handleImageChange = (e) => {
    if (e.target.files.length !== 0) setfileImage(e.target.files[0]);
    // setfileImage(URL.createObjectURL(e.target.files[0]))
  };

  //function for send data to onaddMessage function(in userChat/index.js component)
  const onaddMessage = async (e, textMessage) => {
    e.preventDefault();
    let response = false;
    //if text value is not emptry then call onaddMessage function
    if (textMessage !== "") {
        // todo add message
        console.log("message ",textMessage );
      response = await addMessage(textMessage, "textMessage", id);

      settextMessage("");
    }

    //if file input value is not empty then call onaddMessage function
    if (file != null) {
      setLoader(true);

      //TODO add messae
      console.log("Testinggggggg", file);

      response = await addMessage(file, "fileMessage", id);
      setfile(null);
    }

    //if image input value is not empty then call onaddMessage function
    if (fileImage !== null) {
      setLoader(true);

      console.log("Testinggggggg", fileImage);
      response = await addMessage(fileImage, "imageMessage", id);
      setfileImage(null);
    }
    console.log("responseeeeeeeeeee", response);
    if (response.status) {
      console.log("success");
      setTimeout(() => {
        setLoader(false);
      }, 500);
    } else {
      console.log("infailed fffff");
    }
  };

  //   useEffect(()=>{

  //   },[loader])
  return (
    <div className="p-3 p-lg-4 border-top mb-0">
      {loader ? (
        <div className="text-center mt-2">
          <Spinner color="primary" />
        </div>
      ) : (
        <Form onSubmit={(e) => onaddMessage(e, textMessage)}>
          <Row className="g-0">
            <Col>
              <div>
                <Input
                  type="text"
                  value={textMessage}
                  onChange={handleChange}
                  className="form-control form-control-lg bg-light border-light"
                  placeholder="Enter Message..."
                />
              </div>
            </Col>
            <Col xs="auto">
              <div className="chat-input-links ms-md-2">
                <ul className="list-inline mb-0 ms-0">
                  <li className="list-inline-item">
                    <ButtonDropdown
                      className="emoji-dropdown"
                      direction="up"
                      isOpen={isOpen}
                      toggle={toggle}
                    >
                      <DropdownToggle
                        id="emoji"
                        color="link"
                        className="text-decoration-none font-size-16 btn-lg waves-effect"
                      >
                        <i className="ri-emotion-happy-line"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </DropdownMenu>
                    </ButtonDropdown>
                    <UncontrolledTooltip target="emoji" placement="top">
                      Emoji
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item input-file">
                    <Label
                      id="files"
                      className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                    >
                      <i className="ri-attachment-line"></i>
                      <Input
                        onChange={(e) => handleFileChange(e)}
                        type="file"
                        name="fileInput"
                        size="60"
                      />
                    </Label>
                    <UncontrolledTooltip target="files" placement="top">
                      Attached File
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item input-file">
                    <Label
                      id="images"
                      className="me-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                    >
                      <i className="ri-image-fill"></i>
                      <div id="img-preview"></div>
                      <Input
                        onChange={(e) => handleImageChange(e)}
                        accept="image/*"
                        type="file"
                        name="fileInput"
                        size="60"
                        id="image-file"
                      />
                    </Label>
                    <UncontrolledTooltip target="images" placement="top">
                      Images
                    </UncontrolledTooltip>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      type="submit"
                      color="primary"
                      className="font-size-16 btn-lg chat-send waves-effect waves-light"
                    >
                      <i className="ri-send-plane-2-fill"></i>
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

//   export default (ChatInput);
export default ChatInput;
