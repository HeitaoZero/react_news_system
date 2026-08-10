import React from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'
import { useState, useEffect } from 'react';
import { convertToRaw } from 'draft-js';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
    useEffect(() => {
        // console.log(props.content)
        // html-===> draft, 
        const html = props.content
        console.log(html)
        if (html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    console.log(draftToHtml(editorState.getCurrentContent()))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
