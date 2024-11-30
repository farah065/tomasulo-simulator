import { useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";

function AdditionStation({ stationSizes }) {
    const [data, setData] = useState(Array.from({ length: stationSizes.fpAdders }, (_, i) => ({
        tag: `A${i + 1}`,
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
                Addition Reservation Station
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default AdditionStation;