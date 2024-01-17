import React, { useState } from 'react';
import HeatMap from "./dataviz/HeatMap.js";
import TimeSeriesChart from "./dataviz/TimeSeriesChart.js";
import Lissajous from "./dataviz/fun/lissajous.js";
import Scatter from "./dataviz/Scatter.js";
import TimeSeriesAnalysis from './dataviz/TimeSeriesAnalysis.js';

const STRING_QUERY_OPTIONS = [
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
    "client_name"
];

const INTEGER_QUERY_OPTIONS = [
    "",
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
    "prob_diff_at_bet",
]

function QueryBuilderMenu(props) {

    const [queryResults, setQueryResults] = useState([]);
    const [querySuccess, setQuerySuccess] = useState(false);

    const [stringFilters, setStringFilters] = useState({});
    const [numericFilters, setNumberFilters] = useState({});

    const [stringFilterSelect, setStringFilterSelect] = useState("");
    const [stringFilterInputValue, setStringFilterInputValue] = useState("");

    const [numericFilterSelect, setNumericFilterSelect] = useState("");
    const [numericFilterInputValue, setNumericFilterInputValue] = useState(null);

    const [showLissajous, setShowLissajou] = useState(true);

    const lissajousContent = showLissajous ? <div className="card bg-black display-f justify-center">
    <Lissajous data={null}/>
    <Lissajous data={null}/>
    <Lissajous data={null}/>
    <Lissajous data={null}/>
    </div> : null

    const stringQueryOptions = STRING_QUERY_OPTIONS.map(option => {
        return (
            <option key={option} id={option} name={option} value={option}>{option}</option>
        )
    })

    const handleStringPropertyValueUpdate = (event) => {
        event.preventDefault();
        setStringFilterSelect(event.currentTarget.value);
    }

    const handleStringInputValueUpdate = (event) => {
        event.preventDefault()
        setStringFilterInputValue(event.currentTarget.value);
    }

    const updateStringPropertyFields = (event) => {
        event.preventDefault();
        setStringFilters({
            ...stringFilters,
            [stringFilterSelect]: stringFilterInputValue
        });
    };

    const integerQueryOptions = INTEGER_QUERY_OPTIONS.map(option => {
        return (
            <option key={option} id={option} name={option} value={option}>{option}</option>
        )
    });

    const handleNumericPropertyValueUpdate = (event) => {
        event.preventDefault();
        setNumericFilterSelect(event.currentTarget.value);
    };

    const handleNumericInputValueUpdate = (event) => {
        event.preventDefault();
        setNumericFilterInputValue(event.currentTarget.value);
    };

    const updateNumericPropertyFields = (event) => {
        event.preventDefault();
        setNumberFilters({
            ...numericFilters,
            [numericFilterSelect]: numericFilterInputValue
        });
    };

    const resetFilters = (event) => {
        event.preventDefault();
        setNumberFilters({});
        setStringFilters({});
    }

    const UserDecidedTransactionQuery = async (event) => {
        event.preventDefault();
        try {
            const queryRequest = await fetch('http://localhost:3001/query', {
                method: "POST",
                body: JSON.stringify({ stringFilters, numericFilters }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
            if (!queryRequest.ok) {
                throw (new Error(`${queryRequest.status} (${queryRequest.statusText})`))
            }
            const queryResponseBody = await queryRequest.json();
            setQueryResults(queryResponseBody.transactions);
            setQuerySuccess(true);
            setShowLissajou(false);
        } catch (error) {
            console.error(`Error in fetch: ${error}`)
        }
    };

    const stringKeys = Object.keys(stringFilters);
    const numericKeys = Object.keys(numericFilters);
    const keyRing = [];
    for (let i = 0; i <= stringKeys.length - 1; i++) {
        <code>{keyRing.push(`${stringKeys[i]} : ${stringFilters[stringKeys[i]]}, `)}</code>
    }
    for (let i = 0; i <= numericKeys.length - 1; i++) {
        <code>{keyRing.push(`${numericKeys[i]} : ${numericFilters[numericKeys[i]]}, `)}</code>
    }

    console.log(queryResults[0]);
    return (
        <div className="">
            <div className="card bg-black text-white">
                <h4 className="display-f justify-center mb-2 mt-2"><code>Query by..</code></h4>
                <div className="display-f justify-center">
                    <form>
                        <code className="display-f justify-center">Fields Stored As Strings:</code>
                        <div className="mb-2">
                            <select className="ml-2 bg-black text-white" onChange={handleStringPropertyValueUpdate}>
                                {stringQueryOptions}
                            </select><code className="ml-1 mr-1">:</code>
                            <input type="text" className="bg-black text-white" onChange={handleStringInputValueUpdate} />
                            <button type="submit" className="btn-complement-blue ml-2" onClick={updateStringPropertyFields}><code>Set Filter</code></button>
                        </div>
                        <code className="display-f justify-center">Fields Stored As Ints/Floating Point Numbers:</code>
                        <div className="mb-2">
                            <select className="ml-2 bg-black text-white" onChange={handleNumericPropertyValueUpdate}>
                                {integerQueryOptions}
                            </select><code className="ml-1 mr-1">:</code>
                            <input type="number" className="bg-black text-white" onChange={handleNumericInputValueUpdate} />
                            <button type="submit" className="btn-complement-blue ml-2" onClick={updateNumericPropertyFields}><code>Set Filter</code></button>
                        </div>
                        <div className="display-f justify-center mt-1 mb-1">
                            <button type="button" className="btn-complement-purple mb-2" onClick={UserDecidedTransactionQuery}><code>Query Database</code></button>
                        </div>
                        <div className="display-f justify-center">
                            <button type="submit" className="btn-complement-red" onClick={resetFilters}><code>REMOVE ALL FILTERS</code></button>
                        </div>
                    </form>
                </div>
            <div>
                    <h4>Current Filters Being Applied To This Query:</h4>
                <div>
                    <div>
                        <code>{keyRing}</code>
                    </div>
                </div>
            </div>
            </div>
                {querySuccess ? <TimeSeriesAnalysis data={queryResults} /> : null}
                {querySuccess ? <HeatMap data={queryResults} /> : lissajousContent}
                {querySuccess ? <TimeSeriesChart data={queryResults} /> : null}
                {querySuccess ? <Scatter data={queryResults} /> : null}
        </div>
    )

}

export default QueryBuilderMenu;