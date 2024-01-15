import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/*
    client_34 displays some really radical overlapping here. Be it the vertexes where a bet price quickly jumps from positive to negative over the course of a bet's performance over time
                            .. or if it's just me not understanding the best secondary y2 to plot :)
*/

function TimeSeriesChart({ data }) {
    const svgRef = useRef();
    const margin = { top: 30, right: 120, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

        const xScale = d3.scaleUtc()
            .domain(d3.extent(data, d => parseDate(d.accepted_datetime_utc)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.bet_price)])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale);

        const area = d3.area()
            .x(d => xScale(parseDate(d.accepted_datetime_utc)))
            .y0(height)
            .y1(d => yScale(d.bet_price))
            .curve(d3.curveBumpX);

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", (event) => {
                const newXScale = event.transform.rescaleX(xScale);
                svg.select(".x-axis").call(xAxis.scale(newXScale));
                svg.select(".area").attr("d", area.x(d => newXScale(parseDate(d.accepted_datetime_utc))));
            });

        svg.call(zoom);

        const brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("end", (event) => {
                if (!event.selection) return;
                const [x0, x1] = event.selection.map(d => xScale.invert(d));
                xScale.domain([x0, x1]);
                svg.select(".x-axis").call(xAxis);
                svg.select(".area").attr("d", area);
                svg.select(".brush").call(brush.move, null);
            });

        svg.append("g")
            .attr("class", "brush")
            .call(brush);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("fill", "coral")
            .attr("d", area)
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        const legend = svg.append("g")
            .attr("transform", `translate(${width + margin.left}, ${margin.top})`);

        legend.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "coral");

        legend.append("circle")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "coral");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Bet Price")
            .style("font-size", "12px")
            .attr("text-anchor", "start");


        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", 30 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Time Series Analysis of Bet Price Over Time");

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left + 150)
            .attr("y", height + margin.top + 40)
            .text("Accepted Datetime UTC (Zoomable & Brushable)");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 75)
            .attr("x", -height / 2 - margin.top)
            .text("Book Risk");
    }, [data]);

    return (
        <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
    );
}

export default TimeSeriesChart