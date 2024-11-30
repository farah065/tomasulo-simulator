import { DataTable } from "../data-table";
import { columns } from "./columns";

function InstructionQueue( { instructions } ) {
    return (
        <div>
            <h1 className="mb-2">
                Instruction Queue
            </h1>
            <DataTable columns={columns()} data={[]} />
        </div>
    );
}

export default InstructionQueue;