import { DataTable } from "../data-table";
import { columns } from "./columns";

function StoreBuffer({ data }) {
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