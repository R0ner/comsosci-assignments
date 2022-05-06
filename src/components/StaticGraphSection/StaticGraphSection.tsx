import React, { FC } from 'react';
import styles from './StaticGraphSection.module.scss';

interface StaticGraphSectionProps { }

const department_graph: any = require('../../img/department_graph.png');
const partition_graph: any = require('../../img/partition_graph.png');

const StaticGraphSection: FC<StaticGraphSectionProps> = () => (
  <div className={styles.StaticGraphSection}>
    <h1>Inducing structure</h1>
    <div className='wrapper'>
      <div>
        Having identified key topics for each course, it makes sense to
        consider two courses related if they share one or more topics.
        This is exactly what we've done on the graphs to the side, where
        courses are linked if they share topics, and the link strength
        is determined by the term frequence (TF) scores of the topics in both courses.
        The upper graph is partitioned by department. Interesting patterns emerge when taking a closer look. 
        For instance, the courses in the Department of Chemical Engineering seem to grouped with the courses 
        in the Department of Chemistry. However, while we see that some grouping is noticeable, 
        it is not a particularly good one (at least in two dimensions).
        <br />
        <br />
        A natural question to ask then is: "Can we partition the courses in
        a better way?" And the just as natural answer is yes. To partition the
        courses in a better way, we must know what a better partition is. In
        this case, we will define a good partition as one with high 
        <a href='https://en.wikipedia.org/wiki/Modularity'>modularity</a>.
        Modularity is a measure of how well a partition of a graph matches
        the actual structure of the graph. To optimize the modularity we
        use the <a href='https://en.wikipedia.org/wiki/Louvain_method'>Louvain Algorithm</a>,
        which is extremely effective both in time and results.
        The result is seen in the bottom graph and we find that the similarity between the department 
        partition and the partition that we identified are only 8.5% similar in terms of <a href='https://en.wikipedia.org/wiki/Jaccard_index'>Jaccard similarity</a>. 
        We argue that the partition that we identified is more informative for students in terms of what topics one can expect to be taught in
        the courses within each grouping.

      </div>
      <div>
        <img src={String(department_graph)} alt="Courses partitioned by department" />
        <img src={String(partition_graph)} alt="Courses partitioned by Louvain community" />

      </div>
    </div>
  </div>
);

export default StaticGraphSection;
