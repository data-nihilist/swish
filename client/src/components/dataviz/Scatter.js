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
                .domain(d3.extent(data, d => d.component_prob)).nice()
                .range([height - margin.bottom, margin.top]);


            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .attr("fill", "white")


            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .attr("fill", "white")



            svg.append("g")
                .attr("fill", "#F55F41")
                .attr("id", "component_prob")
                .selectAll("circle")
                .data(data)
                .join("circle")
                .attr("cx", d => x(new Date(d.accepted_datetime_utc)))
                .attr("cy", d => y(d.component_prob))
                .attr("r", 3)
                .attr("opacity", .1);
                

            //--------------------------------
            const y2 = d3.scaleLinear()
                .domain(d3.extent(data, d => d.book_risk)).nice()
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(${height / 2},0)`)
                .call(d3.axisRight(y2))
                .attr("fill", "white")


            svg.append("g")
                .attr("fill", "#8AEDF5")
                .attr("id", "book_risk")
                .selectAll("circle")
                .data(data)
                .join("circle")
                .attr("cx", d => x(new Date(d.accepted_datetime_utc)))
                .attr("cy", d => y2(d.book_risk))
                .attr("r", 3)
                .style("opacity", .3);
            //--------------------------------
            const y3 = d3.scaleLinear()
                .domain(d3.extent(data, d => d.book_profit_gross)).nice()
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(${height * 2},0)`)
                .call(d3.axisLeft(y3))
                .attr("fill", "white")

            svg.append("g")
                .attr("fill", "lime")
                .attr("id", "book_profit_gross")
                .selectAll("circle")
                .data(data)
                .join("circle")
                .attr("cx", d => x(new Date(d.accepted_datetime_utc)))
                .attr("cy", d => y3(d.book_profit_gross))
                .attr("r", 3)
                .attr("opacity", .5)

            //--------------------------------
            const y4 = d3.scaleLinear()
                .domain(d3.extent(data, d => d.component_num_bet)).nice()
                .range([height - margin.bottom, margin.top]);

            svg.append("g")
                .attr("transform", `translate(${height * 2},0)`)
                .call(d3.axisLeft(y4));

            svg.append("g")
                .attr("fill", "#3F2273") 
                .attr("id", "component_num_bet")
                .selectAll("circle")
                .data(data)
                .join("circle")
                .attr("cx", d => x(new Date(d.accepted_datetime_utc)))
                .attr("cy", d => y4(d.component_num_bet))
                .attr("r", 3)
                .style("opacity", .3);


            // svg.selectAll("#component_num_bet")
            //     .attr("fill", "none")

            // svg.selectAll("#book_profit_gross")
            //     .attr("fill", "none")

            // svg.selectAll("#book_risk")
            //     .attr("fill", "none")

            // svg.selectAll("#component_prob")
            //     .attr("fill", "none")



            svg.style("background-color", "lightgrey");

        }
    }, [data]);

    return (
        <svg
            className="card container"
            width={800}
            height={400}
            ref={d3Container}
        />
    );
};

export default Scatter;