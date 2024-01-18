import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Y_AXIS_OPTIONS = [
    "",
    "selection",
    "is_active",
    "is_cashout",
    "currency",
    "country",
    "state",
    "bet_type",
    "parlay_type",
    "state_id",
    "sport",
    "stat_type",
    "product",
    "team_abbr",
    "opp_abbr",
    "player_name",
    "pos_abbr",
    "market_duration_value",
    "market_duration_type",
    "bet_id_swish",
    "component_id_swish",
    "market_suspended_id",
    "market_suspended_description",
    "gamestate",
    "client_name",
    "component_cnt_bet",
    "line",
    "is_alternate",
    "is_inplay",
    "book_risk_component",
    "book_profit_gross_component",
    "client_id",
    "component_price",
    "component_prob",
    "component_num_bet",
    "bet_type_id",
    "book_risk",
    "parlay_type_id",
    "book_profit_gross",
    "bet_price",
    "bet_prob",
    "country_id",
    "currency_id",
    "sport_id",
    "season",
    "event_id",
    "event_status_id",
    "event_type_id",
    "stat_type_id",
    "product_id",
    "team_id",
    "opp_id",
    "home",
    "player_id",
    "pos_id",
    "game_played",
    "game_started",
    "actual",
    "accepted_min_before_start",
    "market_duration_id",
    "line_at_bet",
    "prob_norm_at_bet",
    "proj_at_bet",
    "gamestate_id",
    "score",
    "opp_score",
    "period",
    "usage_at_bet",
    "actual_at_bet",
    "is_in_game",
    "event_time_id",
    "event_time_remaining",
    "usage_id",
    "orig_proj_at_bet",
    "line_diff_at_bet",
    "prob_diff_at_bet"
]

function TimeSeriesChart({ data }) {
    const svgRef = useRef();
    const margin = { top: 30, right: 120, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const [currentYAxisDataValue, setCurrentYAxisDataValue] = useState("book_risk");

    const YaxisSelectOptions = Y_AXIS_OPTIONS.map(option => {
        return (
            <option key={option} id={option} name={option} value={option}>{option}</option>
        )
    })

    const handleYAxisAssignment = (event) => {
        event.preventDefault();
        setCurrentYAxisDataValue(event.currentTarget.value);
    }

    useEffect(() => {

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

        const xScale = d3.scaleUtc()
            .domain(d3.extent(data, d => parseDate(d.accepted_datetime_utc)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[`${currentYAxisDataValue}`])])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale);

        const area = d3.area()
            .x(d => xScale(parseDate(d.accepted_datetime_utc)))
            .y0(height)
            .y1(d => yScale(d[`${currentYAxisDataValue}`]))
            .curve(d3.curveStepBefore);

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
            .text(`${currentYAxisDataValue}`)
            .style("font-size", "12px")
            .attr("text-anchor", "start");


        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", 30 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(`Time Series Analysis of ${currentYAxisDataValue} Over Time`);

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
            .text(`${currentYAxisDataValue}`);

        svg.style("background-color", "lightgrey")
    }, [data, currentYAxisDataValue]);

    return (
        <div
            className="card container"
        >
            <div className="display-f justify-center">
            <code>Select Which Value To Plot Over Time</code>
                <select className="ml-2 bg-black text-white" onChange={handleYAxisAssignment}>
                    {YaxisSelectOptions}
                </select>
            </div>
            <svg
                ref={svgRef}
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            />
        </div>
    );
}

export default TimeSeriesChart