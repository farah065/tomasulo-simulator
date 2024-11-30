import { DataTable } from "../data-table";
import { columns } from "./columns";

function IntegerRegisterFile() {
    const registers = Array.from({ length: 32 }, (_, i) => `R${i}`);
    const data = registers.map((register) => ({
        register,
        qi: null,
        data: 0,
    }));

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