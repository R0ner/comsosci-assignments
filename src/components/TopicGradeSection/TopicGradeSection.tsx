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
        the one that this project was carried out for and we think that the topics match the theme. Observe that we are only identifying
        single words as topics, so we are not able to differentiate between bigrams such as 'social science' or 'social networks'.
        <br/>
        <br/>
        We have used the topics to visualize the average for all courses in which the topic appears. Use the scrollbar on the figure on 
        the right hand side to explore the distribution of average grades for every topic that we identified. See if you can find your
        favorite topic on the list. 
        <br/>
        <br/>
        It seems that certain topics significantly increase the mean average grade of the courses in which they appear in. However, 
        we leave any conclusive analysis of differences between topics to the reader.
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
