import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/*
    Lissajous curves are a family of curves described by the parametric equations: x = A sin(a t + δ), y = B sin(b t).

    The appearance of the figure is highly sensitive to the ratio a/b. For a/b a rational number, the curve will be closed; otherwise, it will be dense and never close. The shape of the curve is also sensitive to the phase difference δ.
    The curves are named after Jules Antoine Lissajous, who studied them in 1857. He was sort of a maniac, but in a cool way.
    
    He was a French mathematician, physicist, and philosopher.
    He was a professor at the Faculté des Sciences at the Sorbonne in Paris and a member of the French Academy of Sciences. He was also a member of the Bureau des Longitudes, and an officer of the Légion d'honneur.
    He was born in Versailles, France, and died in Plombières-les-Bains.
*/

function Lissajous() {
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
            
            if(t > 360e3 ) { timer.stop(); } // 120 seconds
    })
        },


 []);
return (
    <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
);
}

export default Lissajous