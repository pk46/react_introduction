import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function WysiwygEditor(props) {
    const { value, onChange } = props;
    const handleContentChange = (content) => {
        onChange(content);
    };

    return (
        <div>
            <ReactQuill value={value}
                        onChange={handleContentChange}
                        style={{ height: "6rem", overflow: "auto" }}/>
        </div>
    );
}

export default WysiwygEditor;
