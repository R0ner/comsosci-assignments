import React, { FC, useCallback, useMemo, useState, useRef } from 'react';
import styles from './ForceGraphSection.module.scss';
import * as d3 from 'd3';
import { Force, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import ForceGraph3D from "react-force-graph-3d";
import { Sprite, CanvasTexture, SpriteMaterial } from "three";
import SpriteText from "three-spritetext";
import Select from 'react-select';

import untypedGraphData from '../../graph_dict.json';

interface ForceGraphSectionProps { }

interface ForceGraphNode extends SimulationNodeDatum {
  id: number,
  r: number
}

interface ForceGraphLink extends SimulationLinkDatum<ForceGraphNode> {
  source: number,
  target: number
}

interface ForceGraphProps {
  nodes: ForceGraphNode[],
  links: ForceGraphLink[],
  charge: number
}

const graphData = untypedGraphData as any;

const genRandomTree: any = (N = 1000) => {
  return {
    nodes: Array.from(Array(N).keys()).map(i => ({
      id: i,
      name: "bruh",
      label: "full name",
      color: "#ff0000"
    })),
    links: Array.from(Array(N).keys())
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id - 1)),
      }))
  };
};

function getRandomHexColor(): string {
  return '#' + Math.floor((Math.random() * 0xffffff)).toString(16).padStart(6, '0');
}

const colorMap = Array.from(Array(20).keys()).map(i => getRandomHexColor())


const ForceGraphSection: FC<ForceGraphSectionProps> = () => {

  const [data, setData] = useState({ nodes: [], links: [] });
  const [done, setDone] = useState(false);
  const [width, setWidth] = useState(0);

  function onMounted(div: any) {
    if (!div) {
      return false
    }

    setWidth(div.offsetWidth);

  }

  const fgRef = useRef<typeof ForceGraph3D>();

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

  const buttonClick = (arg: any) => {
    console.log(done, data)
    if (!done) {

      setDone(true);
      console.log("Loading data")
      setData(graphData);
    } else {
      console.log("Resetting position")
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
      <h3>Inducing structure</h3>
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
          linkWidth={(link: any) => link.weight * 200}

          ref={fgRef as any}
        />
      </div>

    </div>
  )
};



export default ForceGraphSection;
