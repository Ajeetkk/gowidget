import React from 'react'

export default function TabButtons(props) {
    return (
        <>
            <div className="btn-group">
                {props.TabButtons.map((data, i) =>
                    <button className={"btn btn-primary" + (data.IsActive ? " active" : '')} type="button" key={i} onClick={() => props.ChangeTab(data.Name)}> {data.Name} </button>
                )}
            </div>
        </>
    )
}
