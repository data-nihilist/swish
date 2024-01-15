import React, { useState } from 'react';
import HeatMap from "./dataviz/HeatMap.js";
import TimeSeriesChart from "./dataviz/TimeSeriesChart.js";
import Lissajous from "./dataviz/fun/lissajous.js";
import Scatter from "./dataviz/Scatter.js";

const LIMIT = 100000;

const CLIENTS = [
    "",
    "client_27",
    "client_17",
    "client_1",
    "client_31",
    "client_34",
    "client_21",
    "client_35",
    "client_3",
    "client_25",
    "client_9",
    "client_18",
    "client_8",
    "client_5",
    "client_10",
];

function QueryBuilderMenu(props) {

    // binary flag enums  >> This is a standard in many OSS projects I've picked up. If you have a checkbox, it should be mapped to state. That state should be as simple as possible + null i.e. a strict true/false binary.

    // const BINARY_FLAGS = {
    //     is_alternate: "is_alternate",
    //     is_inplay: "is_inplay",
    //     is_active: "is_active",
    //     is_cashout: "is_cashout"
    // };

    // const DEFAULT_BINARY_FLAGS_STATE = {
    //     [BINARY_FLAGS.is_alternate]: false,
    //     [BINARY_FLAGS.is_inplay]: false,
    //     [BINARY_FLAGS.is_active]: false,
    //     [BINARY_FLAGS.is_cashout]: false,
    // };

    // const [binaryFlagsState, setBinaryFlagsState] = useState(DEFAULT_BINARY_FLAGS_STATE);   // Bah, I want this to work. I'm very happy with the state management side, but, because these four binary flags have varying data types (null, "0", 0) etc, it gets tricky to manage.
    //                                                                                         // The Prisma ORM refactor has greatly improved the quality of considering more complex queries, but I'm also not 100% I've been interpreting much of this data correctly. Gonna keep at it.
    // const createToggleBinaryFlag = (flag) => (event) => {
    //     event.preventDefault();
    //     const update = { ...binaryFlagsState };
    //     update[flag] = !update[flag];
    //     setBinaryFlagsState(update);
    // }

    // const binaryValues = Object.keys(binaryFlagsState);

    // const binaryBoxes = binaryValues.map(flag => {
    //     const value = binaryFlagsState[flag];
    //     return (
    //         <div key={flag}>
    //             <input type="checkbox" id={flag} checked={value} onChange={createToggleBinaryFlag(flag)} />
    //             <label htmlFor={flag}>{flag}</label>
    //         </div>
    //     )
    // })
    
    /* Use this info to construct a value on the backend representing the time in UTCzulu (zoneless).
     Figure out an end-time, too, so we're not making d3 (front end) do aggregating all the data.
     A serializer on the backend would be a good option, using different methods for different types of constraints. 
    */


// const [query_TIME_Filters, setQuery_TIME_Filters] = useState({       
//     LIMIT: "",
//     DAY: "",
//     HOUR: "",
//     MINUTE: "",
//     SECOND: "",
// });

    const [queryResults, setQueryResults] = useState([]);
    const [querySuccess, setQuerySuccess] = useState(false);

    const [propertyFilters, setPropertyFilters] = useState({
        client_name: null,
        LIMIT: null,
        team_abbr: null
    });

    const updateFields = (event) => {
        event.preventDefault();
        setPropertyFilters({
            ...propertyFilters,
            client_name: event.currentTarget.value
        });
    };

    const updateLimit = (event) => {
        event.preventDefault()
        setPropertyFilters({
            ...propertyFilters,
            LIMIT: event.currentTarget.value
        });
    };

    const updateTeamChoice = (event) => {
        event.preventDefault()
        setPropertyFilters({
            ...propertyFilters,
            team_abbr: event.currentTarget.value
        });
    };



    const clientNameOptions = CLIENTS.map(client => {
        return (
            <option key={client} id={client} name={client} value={client}>{client}</option>
        )
    })

    const limitOptions = [];
    for(let i = 0; i <= LIMIT; i+= 500) {
        limitOptions.push(i);
    }
    
    const limiterSelect = limitOptions.map(limit => {
        return (
            <option key={limit} id={limit} name={limit} value={limit}>{limit}</option>
        )
    })

    const teamOptions = ['', 'MIN', 'UTA'];
    const teamSelect = teamOptions.map(team => {
        return (
            <option key={team} id={team} name={team} value={team}>{team}</option>
        )
    })

    const testAPI = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/');
            if(!response.ok) {
                throw(new Error(`${response.status} (${response.statusText})`));
            }
            const responseBody = await response.json();
            setQueryResults(responseBody.transactions);
            setQuerySuccess(true);
            console.log("set results: ", queryResults);
        } catch(error) {
            console.error(`Error in fetch: ${error}`);
        }
    }

    const UserDecidedTransactionQuery = async (event) => {
        event.preventDefault();
        console.log("PropertyFilters: ", propertyFilters)
        try {
            const queryRequest = await fetch('http://localhost:3001/query', {
                method: "POST",
                body: JSON.stringify(propertyFilters),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
            if (!queryRequest.ok) {
                throw (new Error(`${queryRequest.status} (${queryRequest.statusText})`))
            }
            const queryResponseBody = await queryRequest.json();
            console.log("transactions", queryResponseBody.transactions)
            setQueryResults(queryResponseBody.transactions);
            setQuerySuccess(true);
        } catch (error) {
            console.error(`Error in fetch: ${error}`)
        }
    };

    return (
        <div className="container">
            <div className="col-6-xl col-6-md col-4-sm col-8-xs">
                <form onSubmit={UserDecidedTransactionQuery}>
                    <div className="card bg-black text-white">
                        <h4 className="display-f justify-center mb-2 mt-2"><code>Query by client_id</code></h4>
                        <div className="display-f justify-center">
                            <select onChange={updateFields} className="bg-pink-light-6 text-black card">
                                {clientNameOptions}
                            </select>
                        </div>
                        <h4 className="display-f justify-center mb-2 mt-2"><code>LIMIT(`amount`)</code></h4>
                        <div className="display-f justify-center">
                            <select onChange={updateLimit} className="bg-pink-light-6 text-black card">
                                {limiterSelect}
                            </select>
                        </div>
                        <h4 className="display-f justify-center mb-2 mt-2"><code>TEAM(`Minnesota Timberwolves vs. Utah Jazz`)</code></h4>
                        <div className="display-f justify-center">
                            <select onChange={updateTeamChoice} className="bg-pink-light-6 text-black card">
                                {teamSelect}
                            </select>
                        </div>
                        <div className="display-f justify-center mt-2 mb-1">
                            <button type="submit" className="btn-complement-purple mb-2">Query DB</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className=" display-f justify-center">
            {querySuccess ? <HeatMap data={queryResults} /> : null}
            {querySuccess ? <Scatter data={queryResults} /> : null}
            {querySuccess ? <div className="card"><TimeSeriesChart data={queryResults} /> </div>: null}
            </div> : <div><Lissajous data={queryResults}/><Lissajous data={queryResults}/></div>
        </div>

    )

}

export default QueryBuilderMenu;

const ORDER_BY_PROPERTIES = [
    '',
    'date',
    'home',
    'line',
    'score',
    'sport',
    'state',
    'actual',
    'opp_id',
    'period',
    'pos_id',
    'season',
    'country',
    'product',
    'team_id',
    'bet_prob',
    'bet_type',
    'currency',
    'event_id',
    'opp_abbr',
    'pos_abbr',
    'sport_id',
    'state_id',
    'usage_id',
    'bet_price',
    'book_risk',
    'client_id',
    'gamestate',
    'is_active',
    'is_inplay',
    'opp_score',
    'player_id',
    'selection',
    'stat_type',
    'team_abbr',
    'country_id',
    'is_cashout',
    'is_in_game',
    'product_id',
    'bet_type_id',
    'client_name',
    'currency_id',
    'game_played',
    'line_at_bet',
    'parlay_type',
    'player_name',
    'proj_at_bet',
    'bet_id_swish',
    'datetime_utc',
    'game_started',
    'gamestate_id',
    'is_alternate',
    'settled_date',
    'stat_type_id',
    'usage_at_bet',
    'actual_at_bet',
    'event_time_id',
    'event_type_id',
    'received_date',
    'component_prob',
    'parlay_type_id',
    'component_price',
    'event_status_id',
    'line_diff_at_bet',
    'orig_proj_at_bet',
    'prob_diff_at_bet',
    'prob_norm_at_bet',
    'book_profit_gross',
    'component_cnt_bet',    // art.     Keeping here because it's a nice shape and it's fun to play with when reading about sports betting
    'component_num_bet',
    'component_id_swish',
    'market_duration_id',
    'book_risk_component',
    'market_suspended_id',
    'event_time_remaining',
    'market_duration_type',
    'accepted_datetime_utc',
    'market_duration_value',
    'accepted_min_before_start',
    'book_profit_gross_component',
    'market_suspended_description'
];
