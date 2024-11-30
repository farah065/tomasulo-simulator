import { useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";

function MultiplicationStation({ stationSizes }) {
    const [data, setData] = useState(Array.from({ length: stationSizes.fpMultipliers }, (_, i) => ({
        tag: `M${i + 1}`,
        busy: 0,
        vj: "",
        vk: "",
        qj: "",
        qk: "",
        a: "",
    })));
    return (
        <div>
            <h1 className="mb-2">
                Multiplication Reservation Station
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default MultiplicationStation;