import { DataTable } from "../data-table";
import { columns } from "./columns";

function FpRegisterFile({ data }) {
    return (
        <div>
            <h1 className="mb-2">
                FP Register File
            </h1>
            <DataTable columns={columns()} data={data} />
        </div>
    );
}

export default FpRegisterFile;