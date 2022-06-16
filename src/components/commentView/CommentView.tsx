import React from 'react';
import { ChevronLeft } from 'react-feather';
import './CommentView.css';

interface Props {
  showCommentView: boolean;
  useToggleCommentView: () => void;
}

function CommentView({ showCommentView, useToggleCommentView }: Props) {
  const commentElems = Array(4)
    .fill({})
    .map((item, index) => {
      return (
        <li className="comment-item" key={index}>
          <h3>Guest</h3>
          <span>Great song</span>
        </li>
      );
    });

  return (
    <div
      className="comment-view"
      style={{
        right: showCommentView ? 0 : -550,
        display: showCommentView ? 'block' : 'none',
        // opacity: sidebar ? 1 : 0,
      }}
    >
      <h2 className="comment-title">DISCUSSION {"<IN-DEVELOPMENT>"}</h2>
      <section className="comment-list">
        <ul>{commentElems}</ul>
      </section>
      <section onClick={useToggleCommentView} className="comment-view__btm">
        <div>
          <ChevronLeft size={21} color={'#333'} />
          <h3>Back</h3>
        </div>
      </section>
    </div>
  );
}

export default CommentView;
