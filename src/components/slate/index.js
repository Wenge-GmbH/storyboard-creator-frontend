import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import plugins from './prepare-plugins';

import axios from 'axios';
const io = require('socket.io-client');
const socket = io('/');

// progress link
// https://docs.slatejs.org/walkthroughs/applying-custom-formatting

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Type here:>',
              },
            ],
          },
        ],
      },
    ],
  },
});

function writeOutAnd(e, change) {
  if(e.key !== '&') return;
  e.preventDefault();
  change.insertText('and');
  return true;
}

export default class SlateEditor extends Component {
  state = {
    value: initialValue,
  }

  onChange = (change, options = {}) => {
    //https://github.com/ianstormtaylor/slate/blob/master/examples/syncing-operations/index.js
    const { value, operations } = change;
    this.setState({ value });
    socket.emit('sync-editor', {
      operations,
      state: JSON.stringify(value.toJSON())
    });
  }
  componentDidMount() {
    axios.get('/editor-state').then(({data}) => {
      console.log('axios');
      const actualState = Value.fromJSON(data);
      this.setState({value: actualState})
    })
    socket.on('sync-editor', (ops) => {
      console.log('as');
      this.applyOperations(ops);
    })
  }
  applyOperations = operations => {
    console.log('apply Operations');
    const ops = operations
      .filter(o => o.type !== 'set_selection' && o.type !== 'set_value')

    ;
    const { value } = this.state
    const change = value.change().applyOperations(ops);
    // this.onChange(change, { remote: true })
    this.setState({value: change.value})
  }

  onKeyDown = (e, change) => {
    writeOutAnd(e, change);
    if (!e.ctrlKey) return;
    switch (e.key) {
      // When "`" is pressed, keep our existing code block logic.
      case '+': {
        e.preventDefault();
        // Determine whether any of the currently selected blocks are code blocks.
        const isCode = change.value.blocks.some(block => block.type === 'code')
        change.setBlocks(isCode ? 'paragraph' : 'code');
        return true;
      }
      default:
        return;
    }
  }

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />;
    }
  }

  render() {
    return (
      <div className="editor">
        <Editor
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
        />
      </div>
    )
  }
}


const CodeNode = ({ attributes, children }) => (
  <pre {...attributes}>
    <code>{children}</code>
  </pre>
)

// const BoldMark= ({ children }) => <strong>{children}</strong>;


// const renderMarks = () => ({
//   renderMark: props => {
//     switch (props.mark.type) {
//       case 'bold':
//         return <strong>{props.children}</strong>
//       case 'code':
//         return <code>{props.children}</code>
//       case 'italic':
//         return <em>{props.children}</em>
//       case 'strikethrough':
//         return <del>{props.children}</del>
//       case 'underline':
//         return <u>{props.children}</u>
//     }
//   }
// });
