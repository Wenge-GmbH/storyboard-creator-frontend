import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import Suggestions from './suggestions';

const getTriggerRange = (trigger) => {
  const selection = window.getSelection();
  if(selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const text = range.startContainer.textContent.substring(0, range.startOffset);
  if(/s+$/.test(text)) return null;
  const index = text.lastIndexOf(trigger);
  if(index === -1) return null;

  return {
    text: text.substring(index),
    start: index,
    end: range.startOffset,
  }
}

class SimpleEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    autocompleteState: null
  }

  onChange = editorState => {
    return this.setState({editorState}, () => {
      const triggerRange = getTriggerRange('#');
      if(!triggerRange) {
        this.setState({autocompleteState: null});
        return;
      }
      console.log('as');
      this.setState({
        autocompleteSate: {
          searchText: triggerRange.text.slice(1, triggerRange.text.length),
        },
      })
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
  enderSuggestion(text) {
    const { editorState, autocompleteState } = this.state;

    this.onChange(
      addHashTag(editorState, autocompleteState, text)
    );

    this.setState({ autocompleteState: null });
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
