import React, { useRef, useEffect, useState } from 'react';
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


function TimeSeriesAnalysis({ data }) {
    const svgRef = useRef();
    const margin = { top: 50, right: 10, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
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
        if (data.length > 0) {
            
            const svg = d3.select(svgRef.current).style("background-color", "#77D1B1")
            svg.selectAll("*").remove();
            
            let parsedData = [];
            data.forEach(value => {
                parsedData.push({ dateTime: d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(value.accepted_datetime_utc), dataPoint: parseFloat(value[`${currentYAxisDataValue}`])});
            })

            const xScale = d3.scaleUtc()
                .domain(d3.extent(parsedData, d => d.dateTime))
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(parsedData, d => d.dataPoint)])
                .range([height, 0]);

            const line = d3.line()
                .x(function(d) { return xScale(d.dateTime)})
                .y(function(d) { return yScale(d.dataPoint)})
                .curve(d3.curveCardinal);
            
//-----------------------messing around
            const area = d3.area()
                .x(d => xScale(d.dateTime))
                .y0(height)
                .y1(d => yScale(d.dataPoint))
                .curve(d3.curveNatural);
            
            const zoom = d3.zoom()
                .scaleExtent([1, 10])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", (event) => {
                    const newXScale = event.transform.rescaleX(xScale);
                    svg.select(".x-axis").call(d3.axisBottom(xScale))
                    svg.select(".area").attr("d", area.x(d => newXScale(d.dateTime)));
                });
            
            svg.call(zoom);
        
            const brush = d3.brushX()
                .extent([[0, 0], [width, height]])
                .on("end", (event) => {
                    if (!event.selection) return;
                    const [x0, x1] = event.selection.map(d => xScale.invert(d));
                    xScale.domain([x0, x1]);
                    svg.select(".x-axis").call(d3.axisBottom(xScale))
                    svg.select(".area").attr("d", area);
                    svg.select(".brush").call(brush.move, null);
                });
                
                svg.append("path")
                    .datum(parsedData)
                    .attr("class", "area")
                    .attr("fill", "none")
                    .attr("stroke", "#EB5A38")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);
                
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
                    .call(d3.axisBottom(xScale));

                svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .call(d3.axisLeft(yScale));

                svg.append("g")
                    .attr("class", "brush")
                    .call(brush);

            }
    }, [data, currentYAxisDataValue]);

    const TITLE_DECORATOR = `Time Series Analysis of ${currentYAxisDataValue} Over Time (utcZ)`

    return (
        <div className="card container">
            <div>
                <div className="display-f justify-center"><code>What To Plot Over Time?</code>
                    <select className="ml-2 bg-black text-white" onChange={handleYAxisAssignment}>
                        {YaxisSelectOptions}
                    </select>
                </div>
            </div>
            <h4>{TITLE_DECORATOR}</h4>
            <svg
                ref={svgRef}
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            />
        </div>
    )
}

export default TimeSeriesAnalysis