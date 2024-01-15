import React, { useState } from 'react';
// import HeatMap from "./dataViz/HeatMap.js";
// import TimeSeriesChart from './dataViz/TimeSeriesChart.js';

const LIMIT = 5000;

// Object.keys came in for the W on these select fields. As did 'SELECT DISTINCT..'

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

const DAY_SELECT = ['4', '5'];
const HOUR_SELECT = []
for (let i = 0; i < 24; i++) {
    if (i < 10) {
        HOUR_SELECT.push(`0${i}`);
    } else {
        HOUR_SELECT.push(`${i}`);
    }
}
const MINUTE_SELECT = [];
for (let i = 0; i < 60; i++) {
    if (i < 10) {
        MINUTE_SELECT.push(`0${i}`);
    } else {
        MINUTE_SELECT.push(`${i}`);
    }
}
const SECOND_SELECT = [];
for (let i = 0; i < 60; i++) {
    if (i < 10) {
        SECOND_SELECT.push(`0${i}`);
    } else {
        SECOND_SELECT.push(`${i}`);
    }
}

function QueryBuilderMenu(props) {

    // binary flag enums  >> This is a standard in many OSS projects I've picked up. If you have a checkbox, it should be mapped to state. That state should be as simple as possible + null i.e. a strict true/false binary.

    const BINARY_FLAGS = {
        is_alternate: "is_alternate",
        is_inplay: "is_inplay",
        is_active: "is_active",
        is_cashout: "is_cashout"
    };

    const DEFAULT_BINARY_FLAGS_STATE = {
        [BINARY_FLAGS.is_alternate]: false,
        [BINARY_FLAGS.is_inplay]: false,
        [BINARY_FLAGS.is_active]: false,
        [BINARY_FLAGS.is_cashout]: false,
    };

    const [queryResults, setQueryResults] = useState([]);
    const [querySuccess, setQuerySuccess] = useState(false);

    const [client, setClient] = useState("");

    const [limit, setLimit] = useState("");

    const [daySelector, setDaySelector] = useState("");
    const [hourSelector, setHourSelector] = useState("");
    const [minuteSelector, setMinuteSelector] = useState("");
    const [secondSelector, setSecondSelector] = useState("");
    const [timeSelect, setTimeSelect] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [ascOrDesc, setAscOrDesc] = useState("");
    const [searchStringFromBackend, setSearchStringFromBackEnd] = useState("");

    const [binaryFlagsState, setBinaryFlagsState] = useState(DEFAULT_BINARY_FLAGS_STATE);

    const createToggleBinaryFlag = (flag) => (event) => {
        event.preventDefault();
        const update = { ...binaryFlagsState };
        update[flag] = !update[flag];
        setBinaryFlagsState(update);
    }

    const ascDescOptions = ['ASC', 'DESC'].map(clause => {
        return (
            <option key={clause} id={clause} name={clause} value={clause}>{clause}</option>
        )
    })

    function handleAscOrDescSelection(event) {
        event.preventDefault();
        setAscOrDesc(event.currentTarget.value);
    }

    const orderBySelectOptions = ORDER_BY_PROPERTIES.map(property => {
        return (
            <option key={property} id={property} name={property} value={property}>{property}</option>
        )
    })

    function handleOrderBySelection(event) {
        setOrderBy(event.currentTarget.value);
    }

    const binaryValues = Object.keys(binaryFlagsState);

    const binaryBoxes = binaryValues.map(flag => {
        const value = binaryFlagsState[flag];
        return (
            <div key={flag}>
                <input type="checkbox" id={flag} checked={value} onChange={createToggleBinaryFlag(flag)} />
                <label htmlFor={flag}>{flag}</label>
            </div>
        )
    })

    const limitOptions = [];
    for (let i = 50; i <= LIMIT; i += 50) {
        limitOptions.push(i);
    }

    const limitSelectOptions = limitOptions.map(limit => {
        return (
            <option key={limit} id={limit} name={limit} value={limit}>{limit}</option>
        )
    })

    function handleLimitSelection(event) {
        setLimit(event.currentTarget.value);
    }

    const clientNameOptions = CLIENTS.map(client => {
        return (
            <option key={client} id={client} name={client} value={client}>{client}</option>
        )
    })

    function handleClientSelection(event) {
        setClient(event.currentTarget.value);
    }

    const daySelectOptions = DAY_SELECT.map(day => {
        return (
            <option key={day} id={day} name={day} value={day}>{day}</option>
        )
    })

    function handleDaySelection(event) {
        setDaySelector(event.currentTarget.value);
    }

    const hourSelectOptions = HOUR_SELECT.map(hour => {
        return (
            <option key={hour} id={hour} name={hour} value={hour}>{hour}</option>
        )
    })

    function handleHourSelection(event) {
        setHourSelector(event.currentTarget.value);
    }

    const minuteSelectOptions = MINUTE_SELECT.map(minute => {
        return (
            <option key={minute} id={minute} name={minute} value={minute}>{minute}</option>
        )
    })

    function handleMinuteSelection(event) {
        setMinuteSelector(event.currentTarget.value);
    }

    const secondSelectOptions = SECOND_SELECT.map(second => {
        return (
            <option key={second} id={second} name={second} value={second}>{second}</option>
        )
    })

    function handleSecondSelection(event) {
        setSecondSelector(event.currentTarget.value);
    }

    const testAPI = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/');
            if(!response.ok) {
                throw(new Error(`${response.status} (${response.statusText})`));
            }
            const responseBody = await response.json();
            console.log(responseBody);
        } catch(error) {
            console.error(`Error in fetch: ${error}`);
        }
    }

    const UserDecidedTransactionQuery = async (event) => {
        event.preventDefault();
        if (daySelector && hourSelector && minuteSelector && secondSelector) {
            setTimeSelect(`2023-11-0${daySelector}T${hourSelector}:${minuteSelector}:${secondSelector}.000Z`)
        }
        try {
            const response = await fetch('http://localhost:3001/', {
                method: "POST",
                body: JSON.stringify({ client, ...binaryFlagsState, timeSelect, orderBy, ascOrDesc, limit }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
            if (!response.ok) {
                throw (new Error(`${response.status} (${response.statusText})`))
            }
            const responseBody = await response.json();
            // setQueryResults(responseBody.transactions);
            setQuerySuccess(true);

            console.log(responseBody)
            setSearchStringFromBackEnd(responseBody.string);
        } catch (error) {
            console.error(`Error in fetch: ${error}`)
        }
    };

    const TIME_SELECT_DECORATOR = "Time Select (returns transactions >= DD:HH:MM:SS)"

    return (
        <div className="container">
            <div className="col-6-xl col-6-md col-4-sm col-8-xs">
                <form onSubmit={testAPI}>
                    <div className="card bg-black text-white">
                        <h4 className="display-f justify-center mb-2 mt-2"><code>Query by client_id</code></h4>
                        <div className="display-f justify-center">
                            <select onChange={handleClientSelection} className="bg-pink-light-6 text-black card">
                                {clientNameOptions}
                            </select>
                        </div>
                        {/* <div className="text-goldenrod display-f justify-center">
                            <fieldset>
                                <legend>Add Binary Filter
                                    <code>SELECT FROM</code>                                    // building the query string is already spaghetti coded - removing these filters for now (you can still sort either one of these);
                                </legend>
                                {binaryBoxes}
                            </fieldset>
                        </div> */}
                        <code><h4 className="mt-2 display-f justify-center">{TIME_SELECT_DECORATOR}</h4></code>
                        <h6 className="text-info bg-pink-dark-8 display-f justify-center">TOFIX: Selecting one field will result in error - please select '00' if you don't need a specific interval.</h6>
                        <h6 className="text-info bg-pink-dark-8 display-f justify-center">defaults to: '..ORDER BY accepted_datetime_utc ASC LIMIT(1000);</h6>
                        <div className="navbar">
                            <code className="bg-green text-white">day</code>
                            <select onChange={handleDaySelection} className="card bg-pink-light-5 text-black">
                                <option></option>
                                {daySelectOptions}
                            </select>
                            <code className="bg-green text-white">hour</code>
                            <select onChange={handleHourSelection} className="card bg-pink-light-4 text-black">
                                <option></option>
                                {hourSelectOptions}
                            </select>
                            <code className="bg-green text-white">min</code>
                            <select onChange={handleMinuteSelection} className="card bg-pink-light-3 text-black">
                                <option></option>
                                {minuteSelectOptions}
                            </select>
                            <code className="bg-green text-white">sec</code>
                            <select onChange={handleSecondSelection} className="card bg-pink-light-2 text-black">
                                <option></option>
                                {secondSelectOptions}
                            </select>
                        </div>
                        <code className="text-info display-f justify-center mb-1 mt-1">Order Results By</code>
                        <div className="display-f justify-center">
                            <select onChange={handleOrderBySelection} className="card bg-blue-light-5 text-white">
                                {orderBySelectOptions}
                            </select>
                        </div>
                        <code><h4 className="display-f justify-center mb-2 mt-2">/ASCENDING // DESCENDING\</h4></code>
                        <div className="display-f justify-center">
                            <select onChange={handleAscOrDescSelection} className="card bg-white text-black">
                                {ascDescOptions}
                            </select>
                        </div>
                        <div>
                        </div>
                        <code><h4 className="display-f justify-center mb-2 mt-2">Set Limit Of Query</h4></code>
                        <div className="display-f justify-center">
                            <select onChange={handleLimitSelection} className="card bg-yellow-light-5 text-black">
                                <option></option>
                                {limitSelectOptions}
                            </select>
                        </div>
                        <div className="display-f justify-center mt-2 mb-1">
                            <button type="submit" className="btn-complement-purple mb-2">Query DB</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="card container">
                <code>{searchStringFromBackend}</code>
                {/* {querySuccess ? <div className="card"><HeatMap data={queryResults} /></div> : null}
                {querySuccess ? <div className="card"><TimeSeriesChart data={queryResults} /></div> : null} */}
            </div>
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
    'component_cnt_bet',
    'component_num_bet',
    'component_id_swish',
    'market_duration_id', // bet
    'book_risk_component', //bet
    'market_suspended_id',  //bet
    'event_time_remaining',  //event
    'market_duration_type',    // bet
    'accepted_datetime_utc',    // bet
    'market_duration_value',    // betting?
    'accepted_min_before_start', // bet
    'book_profit_gross_component', // bet
    'market_suspended_description' // bet market
];
