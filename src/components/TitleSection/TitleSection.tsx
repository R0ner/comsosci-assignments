import React, { FC } from 'react';
import styles from './TitleSection.module.scss';

interface TitleSectionProps { }

const TitleSection: FC<TitleSectionProps> = () => (
  <div className={styles.TitleSection}>
    <h1>An analysis of the DTU Course Base</h1>
    <h2>Course work for 02467 Computational Social Science</h2>

  </div>
);

export default TitleSection;
