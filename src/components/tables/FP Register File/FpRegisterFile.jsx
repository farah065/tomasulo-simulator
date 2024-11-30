import { DataTable } from "../data-table";
import { columns } from "./columns";

function FpRegisterFile() {
    const registers = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "F25", "F26", "F27", "F28", "F29", "F30", "F31", "F32"];
    const data = registers.map((register) => ({
        register,
        qi: null,
        data: 0,
    }));

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