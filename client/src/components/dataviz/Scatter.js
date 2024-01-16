import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Scatter({ data }) {
    const d3Container = useRef(null);

    useEffect(() => {
        if (data && d3Container.current) {
            const svg = d3.select(d3Container.current);

            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            svg.selectAll("*").remove();

            const x = d3.scaleUtc()
                .domain(d3.extent(data, d => new Date(d.accepted_datetime_utc)))
                .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
                .domain(d3.extent(data, d => d.component_price)).nice()
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));

            svg.append("g")
                .attr("fill", "steelblue")
                .selectAll("circle")
                .data(data)
                .join("circle")
                    .attr("cx", d => x(new Date(d.accepted_datetime_utc)))
                    .attr("cy", d => y(d.component_price))
                    .attr("r", 3);
        }
    }, [data]);

    return (
        <svg
            className="d3-component"
            width={800}
            height={400}
            ref={d3Container}
        />
    );
};

export default Scatter;