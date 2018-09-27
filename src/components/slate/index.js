import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
const io = require('socket.io-client');
const socket = io(process.env.SOCKET_URL || 'http://localhost:3001');

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

  onChange = ({ value }) => {
    this.setState({ value });
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

  renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      case 'code':
        return <code>{props.children}</code>
      case 'italic':
        return <em>{props.children}</em>
      case 'strikethrough':
        return <del>{props.children}</del>
      case 'underline':
        return <u>{props.children}</u>
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
          renderMark={this.renderMark}
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

const MarkHotkey = ({type, key}) => ({
    onKeyDown(e, change) {
      if (!e.ctrlKey || e.key !== key) return;
      // Prevent the default characters from being inserted.
      e.preventDefault()
      change.toggleMark(type)
      return true
    }
  }
)

const plugins = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: 'ü', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: '~', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
];
