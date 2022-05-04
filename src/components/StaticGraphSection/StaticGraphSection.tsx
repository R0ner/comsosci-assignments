import React, { FC } from 'react';
import styles from './StaticGraphSection.module.scss';

interface StaticGraphSectionProps {}

const StaticGraphSection: FC<StaticGraphSectionProps> = () => (
  <div className={styles.StaticGraphSection}>
    StaticGraphSection Component
  </div>
);

export default StaticGraphSection;
