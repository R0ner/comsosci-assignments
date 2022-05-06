import React, { FC } from 'react';
import { setSyntheticTrailingComments } from 'typescript';
import styles from './TopicGradeSection.module.scss';

interface TopicGradeSectionProps { }

const grades_by_topic: any = require('../../img/grades_by_topic.png');

const TopicGradeSection: FC<TopicGradeSectionProps> = () => (
  <div className={styles.TopicGradeSection}>
    <h1>Is the course topic a predictor for average grade?</h1>
    <div className='wrapper'>
      <div>
        In the previous section, we identified topics for each department at DTU.
        Using the same tools, we can identify topics for each course at DTU. For instance, we identified the following 
        topics for the course 02467 Computational Social Science:
        <br/>
        <br/>
        Social, text, data, visualization, metrics, networks, communities, exploration and plots.
        <br/>
        <br/>
        The course in question is
        the one that this project was carried out for and we think topics match the theme. Observe that we are only identifying
        single words as topics, so we are not able to differentiate between bigrams such as 'social science' or 'social networks'.
      </div>
      <div className={styles.Scrollable}>
        <div>
          <img src={String(grades_by_topic)} alt="Courses partitioned by department"/>
        </div>
      </div>
    </div>
  </div>
);

export default TopicGradeSection;
