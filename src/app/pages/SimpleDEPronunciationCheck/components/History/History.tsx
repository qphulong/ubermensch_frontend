import React from "react";
import styles from "./History.module.css";

const History: React.FC = () => {
  return (
    <div className={styles.history}>
      <h3>History</h3>
      <p>(Future history items will be shown here)</p>
    </div>
  );
};

export default History;
