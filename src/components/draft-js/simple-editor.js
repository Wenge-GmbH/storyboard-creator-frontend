import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import Suggestions from './suggestions';
const io = require('socket.io-client');
const socket = io('http://localhost:3001');



class SimpleEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    autocompleteState: null
  }

  componentDidMount() {
    socket.on('editor-state', (rawData) => {
      const editorState = EditorState.createWithContent(convertFromRaw(rawData));
      this.setState({editorState});
    })
  }

  onChange = editorState => {
    return this.setState({editorState}, () => {
      const contentSate = editorState.getCurrentContent();
      socket.emit('editor-state', convertToRaw(contentSate));
    });
  };

  handleKeyCommand = (command, editorState) => {
    console.log(command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if(newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  _onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    const { autocompleteState, editorState } = this.state;
    return (
      <div className="editor">
        {/* <button onClick={this._onBoldClick.bind(this)}>Bold</button> */}
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
        />
        <Suggestions
          autocompleteState={autocompleteState}
          renderSuggestion={(text) => this.renderSuggestion(text)}
        />
      </div>
    );

  }
}

export default SimpleEditor;
