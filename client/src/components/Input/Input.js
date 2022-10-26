import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ReactComponent as SendIcon } from "../../assets/svg/send.svg";

import "./Input.css";

const Input = ({ setMessage, sendMessage, message, users }) => {
  const editorRef = useRef(null);
  return (
    <form className="form">
      <Editor
        apiKey="2zz32ncl6jja6pdxl0yclrhv9gqsvwpgc6wrkn8ezv6q88u9"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={message}
        onEditorChange={(newValue) => {
          console.log(newValue);
          setMessage(newValue);
        }}
        init={{
          width: "100%",
          skin: "oxide-dark",
          content_css: "dark",
          menubar: false,
          statusbar: false,
          image_description: false,
          autoresize_bottom_margin: 0,
          mentions_fetch: (query, success) => {
            let arr = [];
            arr = users?.filter(
              (user) => user.name.indexOf(query.term.toLowerCase()) !== -1
            );
            success(arr);
          },
          mentions_menu_complete: (editor, userInfo) => {
            const span = editor.getDoc().createElement("span");
            span.className = "mymention";
            span.setAttribute("data-mention-id", userInfo.id);
            span.appendChild(
              editor.getDoc().createTextNode("@" + userInfo.name)
            );
            return span;
          },
          mentions_selector: ".mymention",
          plugins:
            "link lists codesample emoticons image autoresize mentions media mediaembed",
          toolbar:
            "bold italic strikethrough link bullist numlist blockquote codesample emoticons image media | sendBtn",
          file_picker_types: "file image media",
          mediaembed_max_width: 400,
          mediaembed_max_height: 200,
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.addEventListener("change", (e) => {
              const file = e.target.files[0];

              const reader = new FileReader();
              reader.addEventListener("load", () => {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                const id = "blobid" + new Date().getTime();
                const blobCache = editorRef.current.editorUpload.blobCache;

                const base64 = reader.result.split(",")[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri());
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
          codesample_languages: [
            { text: "HTML/XML", value: "markup" },
            { text: "JavaScript", value: "javascript" },
            { text: "CSS", value: "css" },
            { text: "PHP", value: "php" },
            { text: "Ruby", value: "ruby" },
            { text: "Python", value: "python" },
            { text: "Java", value: "java" },
            { text: "C", value: "c" },
            { text: "C#", value: "csharp" },
            { text: "C++", value: "cpp" },
          ],
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } .mymention{ color: gray;font-size:16px; }",
        }}
      />
      <div
        className="sendButton"
        onClick={(e) => {
          sendMessage(e);
        }}
      >
        <SendIcon className="sendIcon" />
      </div>
    </form>
  );
};

export default Input;
