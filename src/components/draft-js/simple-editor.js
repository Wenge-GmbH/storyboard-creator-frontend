import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, SelectionState } from 'draft-js';
import Suggestions from './suggestions';
const io = require('socket.io-client');
const socket = io(process.env.SOCKET_URL || 'http://localhost:3001');



class SimpleEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    autocompleteState: null
  }

  componentDidMount() {
    socket.emit('check-editor', 'data');
    socket.on('editor-state', ({text, selection}) => {
      const editorState = EditorState.createWithContent(convertFromRaw(text));
      const newSelection = new SelectionState({
        anchorKey: selection.anchorKey,
        anchorOffset: selection.anchorOffset,
        focusKey: selection.focusKey,
        focusOffset: selection.focusOffset
      })

      const newEditorState = EditorState.forceSelection(
        editorState,
        newSelection
      )
      this.setState({editorState: newEditorState});
    })
  }

  onChange = editorState => {
    return this.setState({editorState}, () => {
      const selection = editorState.getSelection();
      const text = convertToRaw(editorState.getCurrentContent());

      socket.emit('editor-state', { text, selection });
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
