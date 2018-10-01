import React from 'react';

export const addMark = ({type, key, Component}) => ({
    onKeyDown(e, change) {
      if (!e.ctrlKey || e.key !== key) return;
      e.preventDefault()
      change.toggleMark(type)
      return true
    },
    renderMark(props) {
      if(props.mark.type === type)
        return <Component {...props} />;
    }
  }
)
