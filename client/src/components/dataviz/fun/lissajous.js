import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Lissajous({ data }) {
    const svgRef = useRef();
    const margin = { top: 30, right: 120, bottom: 50, left: 60 };
    const width = 350 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    useEffect(() => {
        
            var a = 3.2;
            var b = 5.9;
            
            var phi, omega = 2 * Math.PI/10000;
            
            var crrX = 150 + 100;
            var crrY = 150 + 0;
            
            var prvX = crrX;
            var prvY = crrY;
        
        const svg = d3.select(svgRef.current);
        // svg.selectAll("*").remove();

        var timer = d3.timer(function(t) {
            phi = omega * t;


            crrX = 150 + 100 * Math.cos(a * phi);
            crrY = 150 + 100 * Math.sin(b * phi);

            svg.selectAll("line")
                .each(function() { this.bogus_opacity *= .99 })
                .attr("stroke-opacity",
                    function() { return this.bogus_opacity })
                .filter(function() { return this.bogus_opacity < 0.05 })
                .remove();
                
            svg.append("line")
                .each(function(){ this.bogus_opacity = 1.0 } )
                .attr("x1", prvX).attr("y1", prvY)
                .attr("x2", crrX).attr("y2", crrY)
                .attr("stroke", "lime").attr("stroke-width", 2);
                
            prvX = crrX;
            prvY = crrY;
            
            if(t > 120e3 ) { timer.stop(); } // 120 seconds
    })
        },


 [data]);
return (
    <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
);
}

export default Lissajous