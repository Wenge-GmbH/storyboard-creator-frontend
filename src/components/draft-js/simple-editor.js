import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

class SimpleEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }
  onChange = editorState => {
    return this.setState({editorState});
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
    return (
      <div>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    );

  }
}

export default SimpleEditor;
