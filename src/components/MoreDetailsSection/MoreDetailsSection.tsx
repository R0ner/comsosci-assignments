import React, { FC } from 'react';
import styles from './MoreDetailsSection.module.scss';

interface DescriptionSectionProps { }

const MoreDetailsSection: FC<DescriptionSectionProps> = () => (
  <div className={styles.DescriptionSection}>
    <h1>More details</h1>
    <p>
      For an in-depth breakdown of the technical details of this analysis, check out 
      our <a href="https://github.com/R0ner/comsosci-assignments/blob/main/analysis.ipynb">explainer notebook</a>.
      <br/>
      <br/>
      This project was carried out using Python. If you are interested in the details of the implmentation or if 
      you want to use the course data that we collected for your own project, visit our <a href="https://github.com/R0ner/comsosci-assignments/blob/main/analysis.ipynb">GitHub page</a>.
    </p>
    
  </div>
);

export default MoreDetailsSection;
