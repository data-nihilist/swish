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

function Histogram({ data }) {
    const svgRef = useRef();
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const [currentYAxisDataValue, setCurrentYAxisDataValue] = useState("bet_prob");

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
            var svg = d3.select(svgRef.current).style("background-color", "#77D1B1")
            svg.selectAll("*").remove();

            svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            let parsedData = [];
            data.forEach(datum => {
                parsedData.push({ val: datum[`${currentYAxisDataValue}`] })
            })

            var mx = d3.max(parsedData);

            var xScale = d3.scaleLinear()
                .domain([0, d3.max(parsedData, function (d) { return +d.val })])
                .range([0, width])

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));

            var histogram = d3.bin()
                .value(function (d) { return d.val * 100 })
                .domain(xScale.domain())
                .thresholds(xScale.ticks(20));

            var bins = histogram(parsedData);

            var yScale = d3.scaleLinear()
                .range([height, 0]);

            yScale.domain([0, d3.max(bins, function (d) { return d.length; })]);

            svg.append("g")
                .call(d3.axisLeft(yScale));

            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", parsedData, d => d.val)
                .attr("transform", function (d) { return `translate(${xScale(+d.x0)}, ${yScale(d.length)})` })
                .attr("width", function (d) { return xScale(d.x1) - xScale(d.x0) })
                .attr("height", function (d) { return height - yScale(d.length) })
                .style("fill", "coral");


        }
    }, [data, currentYAxisDataValue])


    return (
        <div className="card container">
            <div>
                <div className="display-f justify-center"><code>What To Plot Over Time?</code>
                    <select className="ml-2 bg-black text-white" onChange={handleYAxisAssignment}>
                        {YaxisSelectOptions}
                    </select>
                </div>
            </div>
            <svg
                ref={svgRef}
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
            />
        </div>
    )
}

export default Histogram