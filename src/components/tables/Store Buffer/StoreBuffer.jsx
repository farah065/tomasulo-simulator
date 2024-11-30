import { useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";

function StoreBuffer({ stationSizes }) {
    const [data, setData] = useState(Array.from({ length: stationSizes.storeBuffers }, (_, i) => ({
        tag: `S${i + 1}`,
        busy: 0,
        a: "",
    })));
    return (
        <div>
            <h1 className="mb-2">
                Store Buffer
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default StoreBuffer;