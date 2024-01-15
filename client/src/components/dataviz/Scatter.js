import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function Scatter({data}) {

    const svgRef = useRef();
    const margin = { top: 30, right: 120, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        

    


    }, [data]);

    return (
        <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
    );
}

export default Scatter;