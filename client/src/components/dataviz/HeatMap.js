import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function HeatMap({ data }) {
    const svgRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 950, height: 600 }); // Increase width
    const margin = { top: 50, right: 20, bottom: 100, left: 120, legendRight: 10 }; // Additional margin for legend


//------------ This is me attempting to determine specific columns based on user interactivity - tricky!

        // I'm going to side car this for now, as I'm happy with how this chart is shaping up.
            // Before I abandon ship, I think the right approach would be to pull this up a level back to the query builder menu component.

    // const [stat1Select, setStat1Select] = useState("player");
    // const [stat2Select, setStat2Select] = useState("stat");

    // const [statSelect, setStatSelect] = useState({
    //     stat1: [...stat1Select],
    //     stat2: [...stat2Select],
    // })

    // const updateFields = (event) => {
    //     event.preventDefault();
    //     setStatSelect({
    //         ...statSelect,
    //         [event.currentTarget.name]: event.currentTarget.value,
    //     });
    // };

    useEffect(() => {
        if (data && svgRef.current) {
            
            const processedData = data.map(d => ({
                player: d.player_name,
                stat: d.stat_type,
                prob: d.component_prob
            }));

            const players = [...new Set(processedData.map(d => d.player))];
            const stats = [...new Set(processedData.map(d => d.stat))];
            const colorDomain = d3.extent(processedData, d => d.prob);

            const xScale = d3.scaleBand()
                .domain(stats)
                .range([0, dimensions.width - margin.left - margin.right])
                .padding(0.05);

            const yScale = d3.scaleBand()
                .domain(players)
                .range([0, dimensions.height - margin.top - margin.bottom])
                .padding(0.05);

            const colorScale = d3.scaleSequential()
                .interpolator(d3.interpolateInferno)
                .domain(colorDomain);

            d3.select(svgRef.current).selectAll("*").remove();

            const svg = d3.select(svgRef.current)
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

            svg.selectAll("rect")
                .data(processedData)
                .enter()
                .append("rect")
                .attr("x", d => xScale(d.stat))
                .attr("y", d => yScale(d.player))
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .style("fill", d => colorScale(d.prob))
                .on("mouseover", (event, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Player: ${d.player}<br>Stat: ${d.stat}<br>Prob: ${d.prob.toFixed(2)}`)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            svg.append("g")
                .attr("transform", `translate(0, ${dimensions.height - margin.top - margin.bottom})`)
                .call(d3.axisBottom(xScale).tickSizeOuter(0))
                .selectAll("text")
                .attr("transform", "rotate(-20)")
                .style("text-anchor", "end");

            svg.append("g")
                .call(d3.axisLeft(yScale).tickSizeOuter(0));

            svg.append("text")
                .attr("x", (dimensions.width - margin.left - margin.right) / 2)
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Average Probability per Player & Stat (hover for details)");

            d3.select('.tooltip')
                .style('position', 'absolute')
                .style('text-align', 'center')
                .style('width', '200px')
                .style('padding', '2px')
                .style('font', '12px sans-serif')
                .style('background', 'lightsteelblue')
                .style('border', '0px')
                .style('border-radius', '8px')
                .style('pointer-events', 'none');

            const legendScale = d3.scaleLinear()
                .domain(d3.extent(processedData, d => d.prob))
                .range([0, 200]);

            const legendSvg = d3.select(svgRef.current).append("g")
                .attr("transform", `translate(${dimensions.width - margin.legendRight}, ${margin.top})`);

            const colorBins = 10;
            const swatchHeight = legendScale.range()[1] / colorBins;

            for (let i = 0; i < colorBins; i++) {
                legendSvg.append("rect")
                    .attr("y", swatchHeight * i)
                    .attr("width", 10)
                    .attr("height", swatchHeight)
                    .style("fill", colorScale(legendScale.invert(swatchHeight * i + swatchHeight / 2)));
            }

            legendSvg.append("g")
                .call(d3.axisRight(legendScale).ticks(colorBins))
                .attr("transform", `translate(10, 0)`);

            legendSvg.append("text")
                .attr("class", "legend-title")
                .attr("x", 15)
                .attr("y", -10)
                .style("text-anchor", "start")
                .text("Probability Scale");

        }
    }, [data, dimensions]);

    return (
            <svg ref={svgRef} className="card container" />
    );
};

export default HeatMap;