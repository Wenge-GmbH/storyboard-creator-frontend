import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

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
    if (e.key != '+' || !e.ctrlKey) return;
    e.preventDefault();
    // Determine whether any of the currently selected blocks are code blocks.
    const isCode = change.value.blocks.some(block => block.type == 'code')
    change.setBlocks(isCode ? 'paragraph' : 'code');
    return true;
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
