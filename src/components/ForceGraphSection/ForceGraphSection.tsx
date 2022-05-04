import React, { FC, useCallback, useMemo, useState } from 'react';
import styles from './ForceGraphSection.module.scss';
import * as d3 from 'd3';
import { Force, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import ForceGraph3D from "react-force-graph-3d";
import { Sprite, CanvasTexture, SpriteMaterial } from "three";
import SpriteText from "three-spritetext";

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


const ForceGraphSection: FC<ForceGraphSectionProps> = () => {

  const [data, setData] = useState({ nodes: [], links: [] });
  const [done, setDone] = useState(false);
  const [width, setWidth] = useState(0);

  function onMounted(div: any) {
    if (!div) {
      return false
    }

    if (!done) {
      setData(graphData);
      setDone(true);
    }

    setWidth(div.offsetWidth);

  }



  return (
    <div className={styles.ForceGraphSection}>
      ForceGraphSection Component


      <div ref={(div: any) => onMounted(div)}>
        <ForceGraph3D
          graphData={data}
          nodeLabel="id"
          width={width}
          height={Math.min(700, Math.floor(width / 16 * 9))}

          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          }}

          linkThreeObjectExtend={true}
          linkLabel={(link: any) => `${link.source} > ${link.target}`}
          linkThreeObject={(link: any) => {
            // extend link with text sprite
            const sprite = new SpriteText(`${link.source} > ${link.target}`);
            sprite.color = 'lightgrey';
            sprite.textHeight = 1.5;
            return sprite;
          }}
          linkPositionUpdate={(sprite, { start, end }) => {

            const middlePos = {
              x: start.x + (end.x - start.x) / 2,
              y: start.y + (end.y - start.y) / 2,
              z: start.z + (end.z - start.z) / 2
            }

            // Position sprite
            Object.assign(sprite.position, middlePos);

            return true
          }}
        />
      </div>

    </div>
  )
};



export default ForceGraphSection;
