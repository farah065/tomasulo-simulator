import { DataTable } from "../data-table";
import { columns } from "./columns";

function MultiplicationStation({ data }) {
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