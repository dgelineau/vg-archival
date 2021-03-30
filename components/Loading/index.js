import React from "react";
import { Spin } from "antd";
import styles from "./loading.module.css";

function Loading() {
  return <Spin className={styles.loading} />;
}

export default Loading;
