import { DataTable } from "../data-table";
import { columns } from "./columns";

function IntegerRegisterFile({ data }) {
    return (
        <div>
            <h1 className="mb-2">
                Integer Register File
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default IntegerRegisterFile;