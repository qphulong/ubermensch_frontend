import React from 'react';
import styles from './FirstPage.module.css';
import Animation from './Animation/Animation';
import Post from './Post/Post';

const FirstPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <Animation />
      </div>
      <div className={styles.rightColumn}>
        <Post />
      </div>
    </div>
  );
};

export default FirstPage;