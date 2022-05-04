import React, { FC } from 'react';
import styles from './StaticGraphSection.module.scss';

interface StaticGraphSectionProps { }

const StaticGraphSection: FC<StaticGraphSectionProps> = () => (
  <div className={styles.StaticGraphSection}>
    <h1>Inducing structure</h1>
    <div className='wrapper'>
      <div>
        Having identified key topics for each course, it makes sense to
        consider two courses related if they share one or more topics.
        This is exactly what we've done on the graphs to the side, where
        courses are linked if they share topics, and the link strength
        is determined by the TF-IDF scores of the topics in both courses.
        From the graph
      </div>
      <div>

      </div>
    </div>
  </div>
);

export default StaticGraphSection;
