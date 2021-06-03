import "./../css/main.scss";
import { cssVar } from './colors';
import { select, selectAll } from 'd3-selection';
import { hierarchy, tree, HierarchyPointLink, HierarchyPointNode } from 'd3-hierarchy';
import { linkVertical } from 'd3-shape';

const d3 = { select, selectAll, hierarchy, tree, linkVertical }


const btn = document.querySelector('.button-start');

const greet = () => {
  console.log("jello?");
}

if (btn) {
  btn.addEventListener('click', greet);
}


const mainSvg = d3.select(".svg-main");

const family = d3.hierarchy({
  name: "root",
  children: [
    { name: "child #1" },
    {
      name: "child #2",
      children: [
        { name: "grandchild #1" },
        { name: "grandchild #2" },
        { name: "grandchild #3" }
      ]
    }
  ]
})

const btree = d3.tree<{ name: string }>();
btree.size([100, 100]);
const root = btree(family);

const linkGenerator = d3.linkVertical<HierarchyPointLink<{ name: string }>, HierarchyPointNode<{ name: string }>>()
  .x(d => d.x)
  .y(d => d.y)

mainSvg.append("g")
  .attr("fill", "none")
  .attr("stroke", cssVar('--grey'))
  .attr("stroke-opacity", 1)
  .attr("stroke-width", .5)
  .selectAll("path")
  .data(root.links())
  .join("path")
  .attr("d", linkGenerator);

const nodeRectWidth = 10;
mainSvg.append("g")
  .attr("fill", cssVar('--crimson'))
  .selectAll("rect")
  .data(root.descendants())
  .join("rect")
  .attr("width", nodeRectWidth)
  .attr("height", nodeRectWidth)
  .attr("x", d => d.x-(nodeRectWidth/2))
  .attr("y", d => d.y);

export const hello = () => {
  return false;
}
