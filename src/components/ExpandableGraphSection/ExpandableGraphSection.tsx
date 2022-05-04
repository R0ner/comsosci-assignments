import React, { FC, useCallback, useMemo, useState } from 'react';
import styles from './ExpandableGraphSection.module.scss';
import * as d3 from 'd3';
import { Force, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import ForceGraph3D from "react-force-graph-3d";
import { Sprite, CanvasTexture, SpriteMaterial } from "three";
import SpriteText from "three-spritetext";

interface ExpandableGraphSectionProps { }

const ExpandableGraphSection: FC<ExpandableGraphSectionProps> = () => (
  <div className={styles.ExpandableGraphSection}>
    ExpandableGraphSection Component
  </div>
);

const ExpandableGraph = ({ graphData }: any) => {
  const rootId = 0;

  const nodesById = useMemo(() => {
    const nodesById = Object.fromEntries(graphData.nodes.map((node: any) => [node.id, node]));

    // link parent/children
    graphData.nodes.forEach((node: any) => {
      node.collapsed = node.id !== rootId;
      node.childLinks = [];
    });
    graphData.links.forEach((link: any) => nodesById[link.source].childLinks.push(link));

    return nodesById;
  }, [graphData]);

  const getPrunedTree = useCallback(() => {
    const visibleNodes = [];
    const visibleLinks = [];
    (function traverseTree(node = nodesById[rootId]) {
      visibleNodes.push(node);
      if (node.collapsed) return;
      visibleLinks.push(...node.childLinks);
      node.childLinks
        .map((link: any) => ((typeof link.target) === 'object') ? link.target : nodesById[link.target]) // get child node
        .forEach(traverseTree);
    })();

    return { nodes: visibleNodes, links: visibleLinks };
  }, [nodesById]);

  const [prunedTree, setPrunedTree] = useState(getPrunedTree());

  const handleNodeClick = useCallback((node: any) => {
    node.collapsed = !node.collapsed; // toggle collapse state
    setPrunedTree(getPrunedTree())
  }, []);

  return <ForceGraph3D
    graphData={prunedTree}
    linkDirectionalParticles={2}
    nodeColor={(node: any) => !node.childLinks.length ? 'green' : node.collapsed ? 'red' : 'yellow'}
    onNodeClick={handleNodeClick}
  />;
};

export default ExpandableGraphSection;
