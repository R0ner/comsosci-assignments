import React, { FC } from 'react';
import styles from './DescriptionSection.module.scss';


const courseBaseScreenshot: any = require('../../img/course_base.png');

interface DescriptionSectionProps { }

const DescriptionSection: FC<DescriptionSectionProps> = () => (
  <div className={styles.DescriptionSection}>
    <h1>What is the DTU Course Base?</h1>
    <p>
      <a href='https://www.kurser.dtu.dk'>The DTU Course Base</a> is an online collection of the available
      courses at the Technical University of Denmark (DTU). The database
      is searchable by keyword, course number, department etc., and is
      a useful resource for students researching potential courses to take
      in the coming semesters. Apart from the details readily available
      on the front page of a course, it also provides access to evaluations
      from the students. For each course, we collected:
    </p>
    <div className='list'>
      <ul>
        <li>Course name and number</li>
        <li>Language of instruction</li>
        <li>ECTS points</li>
        <li>Department</li>
        <li>Location</li>
        <li>Course responsible and co-responsible</li>
        <li>Grade history</li>
        <li>Student evaluations</li>
        <li>DTU Course Analyzer data</li>
      </ul>
    </div>
    <img src={String(courseBaseScreenshot)} alt="Course Base Screenshot" />
  </div>
);

export default DescriptionSection;
