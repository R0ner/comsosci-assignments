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
        is determined by the TF-IDF scores of the topics in both courses.
        The upper graph is partitioned by department, and we see that
        while some grouping is noticeable, it is not a particularly good
        one (at least in two dimensions).
      </div>
      <div>
        <img src={String(department_graph)} alt="Courses partitioned by department" />

      </div>
    </div>
    <div className='wrapper'>
      <div>
        A natural question to ask then is: can we partition the courses in
        a better way? And the just as natural answer is yes. To partition the
        courses in a better way, we must know what a better partition is. In
        this case, we will define a good partition as on with high
        <a href='https://en.wikipedia.org/wiki/Modularity'>modularity</a>.
        Modularity is a measure of how well a partition of a graph matches
        the actual structure of the graph. To optimize the modularity we
        use the <a href='https://en.wikipedia.org/wiki/Louvain_method'>Louvain Algorithm</a>,
        which is extremely effective both in time and results.
      </div>
      <div>
        <img src={String(partition_graph)} alt="Courses partitioned by Louvain community" />

      </div>
    </div>
  </div>
);

export default StaticGraphSection;
