import { useState } from "react";
import ReactSelect from "./ui/react-select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function InstructionSelection({ instructions, setInstructions }) {
    const operations = ["ADD.S", "ADD.D", "DADDI", "SUB.S", "SUB.D", "DSUBI", "MUL.S", "MUL.D", "DIV.S", "DIV.D", "L.S", "L.D", "LW", "LD", "S.S", "S.D", "SW", "SD", "BEQ", "BNE", "BEQZ", "BNEZ"];
    const destSrcTgt = ["ADD.S", "ADD.D", "SUB.S", "SUB.D", "MUL.S", "MUL.D", "DIV.S", "DIV.D"];
    const destSrcImm = ["DADDI", "DSUBI"];
    const srcTgtImm = ["BEQ", "BNE"];
    const srcImm = ["S.S", "S.D", "SW", "SD"];
    const destImm = ["L.S", "L.D", "LW", "LD"];
    const [instruction, setInstruction] = useState({
        operation: "ADD.S",
        destination: 0,
        source: 0,
        target: 0,
        immediate: 0,
    });

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
        else if (srcTgtImm.includes(instruction.operation)) {
            finalInstruction = {
                operation: instruction.operation,
                source: instruction.source,
                target: instruction.target,
                immediate: instruction.immediate,
            };
        }
        else {
            return;
        }
        setInstructions([...instructions, finalInstruction]);
    }

    function getOptions(destination) {
        let options = Array.from({ length: 32 }, (_, i) => ({ value: i, label: `F${i}` }))
            .concat(Array.from({ length: 32 }, (_, i) => ({ value: i + 32, label: `R${i}` })))
        if (["DADDI", "DSUBI", "BEQ", "BNE", "SW", "SD", "LW", "LD"].includes(instruction.operation)) {
            // remove F registers
            options = options.filter((option) => option.value >= 32);
            if (!options.find((option) => option.value == instruction.source)) {
                setInstruction({ ...instruction, source: options[0].value });
            }
            if (!options.find((option) => option.value == instruction.target)) {
                setInstruction({ ...instruction, target: options[0].value });
            }
            if (destination) {
                // remove R0 register
                options = options.filter((option) => option.value !== 32);
            }
        }
        else {
            // remove R registers
            options = options.filter((option) => option.value < 32);
            if (!options.find((option) => option.value == instruction.source)) {
                setInstruction({ ...instruction, source: options[0].value });
            }
            if (!options.find((option) => option.value == instruction.target)) {
                setInstruction({ ...instruction, target: options[0].value });
            }
        }

        if (!options.find((option) => option.value == instruction.destination)) {
            setInstruction({ ...instruction, destination: options[0].value });
        }

        return options;
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
                        onChange={(selectedOption) => {
                            setInstruction({ ...instruction, operation: selectedOption.value });
                        }}
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
                            options={getOptions(true)}
                            defaultValue={getOptions(true)[0]}
                            value={instruction.destination == 0 ? 0 : getOptions(true).find((option) => option.value == instruction.destination) || getOptions(true)[0]}
                            onChange={(selectedOption) => setInstruction({ ...instruction, destination: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcTgt.includes(instruction.operation) || destSrcImm.includes(instruction.operation) || srcTgtImm.includes(instruction.operation) || srcImm.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Source Register
                    </h2>
                    <div className="w-full">
                        <ReactSelect
                            options={getOptions(false)}
                            defaultValue={getOptions(false)[0]}
                            value={instruction.source == 0 ? 0 : getOptions(false).find((option) => option.value == instruction.source) || getOptions(false)[0]}
                            onChange={(selectedOption) => setInstruction({ ...instruction, source: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcTgt.includes(instruction.operation) || srcTgtImm.includes(instruction.operation)) &&
                <div>
                    <h2 className="mb-1">
                        Target Register
                    </h2>
                    <div className="w-full">
                        <ReactSelect
                            options={getOptions(false)}
                            defaultValue={getOptions(false)[0]}
                            value={instruction.target == 0 ? 0 : getOptions(false).find((option) => option.value == instruction.target) || getOptions(false)[0]}
                            onChange={(selectedOption) => setInstruction({ ...instruction, target: selectedOption.value })}
                        />
                    </div>
                </div>
            }
            {(destSrcImm.includes(instruction.operation) || srcImm.includes(instruction.operation) || srcTgtImm.includes(instruction.operation) || destImm.includes(instruction.operation)) &&
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
        </div>
    );
}

export default InstructionSelection;