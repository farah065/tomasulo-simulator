import { DataTable } from "../data-table";
import { columns } from "./columns";

function Cache({ data }) {
    return (
        <div>
            <h1 className="mb-2">
                Cache
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default Cache;