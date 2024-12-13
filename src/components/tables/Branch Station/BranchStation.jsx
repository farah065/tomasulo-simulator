import { DataTable } from "../data-table";
import { columns } from "./columns";

function BranchStation({ data }) {
    return (
        <div>
            <h1 className="mb-2">
                Branch Reservation Station
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default BranchStation;