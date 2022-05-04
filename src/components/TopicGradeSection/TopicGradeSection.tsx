import React, { FC } from 'react';
import styles from './TopicGradeSection.module.scss';

interface TopicGradeSectionProps { }

const TopicGradeSection: FC<TopicGradeSectionProps> = () => (
  <div className={styles.TopicGradeSection}>
    <h1>Is the course topic a predictor for average grade?</h1>
    <div className='wrapper'>
      <div>

      </div>
      <div>

      </div>
    </div>
  </div>
);

export default TopicGradeSection;
