import React, { Component } from 'react';

const HASHTAGS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven'
];

export default class Suggestions extends Component {
  render() {
    const { autocompleteState } = this.props;
    if (!autocompleteState) return null;
    const { searchText } = autocompleteState;
    return (
      <div>
        <ul>
          {
            HASHTAGS
              .filter(item => item.substring(0, searchText.length) === searchText)
              .map(result => <li>{result}</li>)
          }
        </ul>
      </div>
    )
  }
}
