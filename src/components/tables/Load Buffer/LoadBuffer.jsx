import { useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";

function LoadBuffer({ stationSizes }) {
    const [data, setData] = useState(Array.from({ length: stationSizes.loadBuffers }, (_, i) => ({
        tag: `L${i + 1}`,
        busy: 0,
        a: "",
    })));
    return (
        <div>
            <h1 className="mb-2">
                Load Buffer
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default LoadBuffer;