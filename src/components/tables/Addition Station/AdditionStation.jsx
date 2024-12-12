import { DataTable } from "../data-table";
import { columns } from "./columns";

function AdditionStation({ data }) {
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