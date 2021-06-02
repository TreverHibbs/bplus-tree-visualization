import "./../css/main.scss";
import { select, selectAll } from 'd3-selection';
import { hierarchy } from 'd3-hierarchy';

const d3 = { select, selectAll, hierarchy }


const btn = document.querySelector('.button-start');

const greet = () => {
  console.log("hello");
}

if(btn){
  btn.addEventListener('click', greet);
}

document.addEventListener("DOMContentLoaded", function(event) {
  const mainSvg = d3.select(".svg-main");
  const myCircle = mainSvg.append("circle")
    .attr("cx", 50)
    .attr("cy", 50)
    .attr("r", 40)
    .attr("fill", "blue");
});

export const hello = () => {
  return false;
}
