import { useState } from "react";
import ReactSelect from "./ui/react-select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function InstructionSelection({ instructions, setInstructions }) {
    const operations = ["ADD.S", "ADD.D", "ADDI", "SUB.S", "SUB.D", "SUBI", "MUL.S", "MUL.D", "DIV.S", "DIV.D", "L.S", "L.D", "LW", "LD", "S.S", "S.D", "SW", "SD", "BEQ", "BNE", "BEQZ", "BNEZ"];
    const destSrcTgt = ["ADD.S", "ADD.D", "SUB.S", "SUB.D", "MUL.S", "MUL.D", "DIV.S", "DIV.D"];
    const destSrcImm = ["ADDI", "SUBI"];
    const srcTgtLbl = ["BEQ", "BNE"];
    const srcLbl = ["BEQZ", "BNEZ"]; //NOT WANTED
    const srcImm = ["S.S", "S.D", "SW", "SD"];
    const destImm = ["L.S", "L.D", "LW", "LD"];
    const [instruction, setInstruction] = useState({
        operation: "ADD.S",
        destination: "F1",
        source: "F0",
        target: "F0",
        immediate: 0,
        label: ""
    });
    const [label, setLabel] = useState("");
    const [labels, setLabels] = useState([]);

    function addInstruction() {
        let finalInstruction = {};
        if (destSrcTgt.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                destination: instruction.destination,
                source: instruction.source,
                target: instruction.target,
            };
        }
        else if (destSrcImm.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                destination: instruction.destination,
                source: instruction.source,
                immediate: instruction.immediate,
            };
        }
        else if (srcImm.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                source: instruction.source,
                immediate: instruction.immediate,
            };
        }
        else if (destImm.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                destination: instruction.destination,
                immediate: instruction.immediate,
            };
        }
        else if (srcTgtLbl.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                source: instruction.source,
                target: instruction.target,
                label: instruction.label,
            };
        }
        else if (srcLbl.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                source: instruction.source,
                label: instruction.label,
            };
        }
        setInstructions([...instructions, finalInstruction]);
    }

    function addLabelToProgram() {
        setInstructions([...instructions, { label: label }]);
        console.log([...instructions, { label: label }])
        setLabel("");
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="mb-1">
                    Operation
                </h2>
                <div className="w-full">
                    <ReactSelect
                        options={operations.map((operation) => ({ value: operation, label: operation }))}
                        defaultValue={{ value: "ADD.S", label: "ADD.S" }}
                        onChange={(selectedOption) => setInstruction({ ...instruction, operation: selectedOption.value })}
                    />
                </div>
            </div>
            {(destSrcTgt.includes(instruction.operation) || destSrcImm.includes(instruction.operation) || destImm.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Destination Register
                    </h2>
                    <div className="w-full">
                        <ReactSelect
                            options={Array.from({ length: 32 }, (_, i) => ({ value: `F${i}`, label: `F${i}` }))
                                .concat(Array.from({ length: 31 }, (_, i) => ({ value: `R${i + 1}`, label: `R${i + 1}` })))}
                            defaultValue={{ value: "F1", label: "F1" }}
                            onChange={(selectedOption) => setInstruction({ ...instruction, destination: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcTgt.includes(instruction.operation) || destSrcImm.includes(instruction.operation) || srcTgtLbl.includes(instruction.operation) || srcImm.includes(instruction.operation) || srcLbl.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Source Register
                    </h2>
                    <div className="w-full">
                        <ReactSelect
                            options={Array.from({ length: 32 }, (_, i) => ({ value: `F${i}`, label: `F${i}` }))
                                .concat(Array.from({ length: 32 }, (_, i) => ({ value: `R${i}`, label: `R${i}` })))}
                            defaultValue={{ value: "F0", label: "F0" }}
                            onChange={(selectedOption) => setInstruction({ ...instruction, source: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcTgt.includes(instruction.operation) || srcTgtLbl.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Target Register
                    </h2>
                    <div className="w-full">
                        <ReactSelect
                            options={Array.from({ length: 32 }, (_, i) => ({ value: `F${i}`, label: `F${i}` }))
                                .concat(Array.from({ length: 32 }, (_, i) => ({ value: `R${i}`, label: `R${i}` })))}
                            defaultValue={{ value: "F0", label: "F0" }}
                            onChange={(selectedOption) => setInstruction({ ...instruction, target: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcImm.includes(instruction.operation) || srcImm.includes(instruction.operation) || destImm.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Immediate Value
                    </h2>
                    <Input
                        type="number"
                        defaultValue={0}
                        className="w-full"
                        onChange={(e) => setInstruction({ ...instruction, immediate: e.target.value })}
                    />
                </div>
            }
            {(srcTgtLbl.includes(instruction.operation) || srcLbl.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Label
                    </h2>
                    <ReactSelect
                        options={labels.map((label) => ({ value: label, label: label }))}
                        placeholder="Select..."
                        onChange={(selectedOption) => setInstruction({ ...instruction, label: selectedOption.value })}
                    />
                </div>
            }
            <Button
                variant="default"
                className="px-3 w-full justify-center"
                onClick={() => addInstruction()}
            >
                Add Instruction
            </Button>
            <div className="flex justify-center">
                <Button
                    variant="link"
                    className="w-max justify-center p-0 h-max"
                    onClick={() => setInstructions(instructions.slice(0, -1))}
                >
                    Undo
                </Button>
            </div>
            <div>
                <h2 className="mb-1">
                    Label
                </h2>
                <Input
                    className="w-full"
                    onChange={(e) => setLabel(e.target.value)}
                    value={label}
                    placeholder="Enter label..."
                />
            </div>
            <Button
                variant="default"
                className="px-3 w-full justify-center"
                onClick={() => {
                    setLabels([...labels, label]);
                    addLabelToProgram();
                }}
            >
                Add Label
            </Button>
        </div>
    );
}

export default InstructionSelection;