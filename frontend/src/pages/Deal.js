import { useState } from "react";

export function Deal({ deal }) {

    const [copy, setCopy] = useState(false);

    function handleCopy() {
        if (copy !== false) {
            setCopy(false);
        }
        else {
            setCopy(true);
        }
    }

    return (
        <div class="main__rows">
            <div class="main__cell">{deal.id}<br></br><div className="main_cell-date">{deal.date}, {deal.time}</div></div>
            <div class="main__cell">{deal.exchangeBuyID.slice(0, 14)}<br></br>{deal.exchangeBuyID.slice(14, deal.exchangeBuyID.length)}</div>
            <div class="main__cell">{deal.exchangeBuy}</div>
            <div class="main__cell">{deal.exchangePlatform}</div>
            <div class="main__cell">{deal.received}</div>
            <div class="main__cell">{deal.usdt}</div>
            <div class="main__cell">{deal.earn}</div>
            <div class="main__cell">{deal.spread} %</div>
        </div>
    );
}