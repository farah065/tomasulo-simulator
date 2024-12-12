import { DataTable } from "../data-table";
import { columns } from "./columns";

function LoadBuffer({ data }) {
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