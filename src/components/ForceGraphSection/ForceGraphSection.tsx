import { FC, useCallback, useState, useRef } from 'react';
import styles from './ForceGraphSection.module.scss';
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import Select from 'react-select';

import untypedGraphData from '../../graph_dict.json';

const graphData = untypedGraphData as any;


interface ForceGraphSectionProps { }

const ForceGraphSection: FC<ForceGraphSectionProps> = () => {

  // State definition
  const [data, setData] = useState({ nodes: [], links: [] });
  const [done, setDone] = useState(false);
  const [width, setWidth] = useState(0);

  // Reference for Force Graph object
  const fgRef = useRef<typeof ForceGraph3D>();

  // Adjust forcegraph width when div is mounted
  function onMounted(div: any) {
    if (!div) {
      return false
    }

    setWidth(div.offsetWidth);
  }

  // When course is selected in the menu, zoom to it
  const handleChange = useCallback((option: any) => {

    if (fgRef === null) {
      return false
    }

    const node = graphData.nodes[option.value]

    const ref = fgRef as any;

    // Aim at node from outside it
    const distance = 200;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    ref.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  }, [fgRef]);

  // Load data, or reset position if data is already loaded
  const buttonClick = (arg: any) => {
    console.log(done, data)
    if (!done) {

      setDone(true);
      setData(graphData);
    } else {
      const ref = fgRef as any;

      ref.current.cameraPosition(
        { x: 0, y: 0, z: 2500 }, // new position
        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
        3000  // ms transition duration
      );
    }
  };

  return (
    <div className={styles.ForceGraphSection}>
      <h3>3D interactive graph</h3>
      <p>
        To make an interactive version of the course graph, we reduced the average degree of nodes by increasing
        the TF-IDF percentile necessary for a topic to be included. This was done to allow a bearable
        framerate while the simulation is running. To find a specific course, search in the bar below:
      </p>

      <div ref={(div: any) => onMounted(div)}>
        <div className='controls'>
          <button type="button" onClick={buttonClick}>{done ? "Reset Position" : "Load Graph"}</button>
          <Select
            className='select'
            options={data.nodes.map((node: any) => { return { value: node.id, label: `${node.name} ${node.label}` } })}
            onChange={(option) => handleChange(option)}
            isSearchable={true}
          />
        </div>

        <ForceGraph3D
          graphData={data}
          width={width}
          height={Math.min(700, Math.floor(width / 16 * 9))}

          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.name);
            sprite.color = graphData.department_cmap[node.department_id];
            sprite.textHeight = 6 + Math.log2(node.weight * 1000);
            return sprite;
          }}

          nodeLabel={(node: any) => `${node.label}: ${Math.round(node.weight * 10000) / 10}`}

          linkLabel={(link: any) => `${link.words.join(", ")}: ${Math.round(link.weight * 10000) / 10}`}
          linkWidth={(link: any) => link.weight * 250}

          ref={fgRef as any}

          cooldownTime={30000}
        />
      </div>

    </div>
  )
};



export default ForceGraphSection;
