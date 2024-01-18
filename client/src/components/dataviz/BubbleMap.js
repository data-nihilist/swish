import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BubbleMap({data}) {
    const svgRef = useRef();
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    useEffect(() => {
        if (data.length > 0) {

        }
    }, [data])

    return (
        <div className="card container">
            <svg
                ref={svgRef}
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            />
        </div>
    )
}

export default BubbleMap