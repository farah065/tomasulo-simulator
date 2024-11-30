import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import InstructionSelection from "./components/InstructionSelection";
import FpRegisterFile from "./components/tables/FP Register File/FpRegisterFile";
import InstructionQueue from "./components/tables/Instruction Queue/InstructionQueue";
import Setup from "./components/Setup";

function App() {
    const [instructions, setInstructions] = useState([]);
    const [stationSizes, setStationSizes] = useState({
        fpAdders: 3,
        fpMultipliers: 2,
        loadBuffers: 2,
        storeBuffers: 2,
    });
    const [instructionLatencies, setInstructionLatencies] = useState({
        fpAdd: 4,
        fpMult: 6,
        load: 2,
        store: 2,
    });
    const [page, setPage] = useState(0);

    function formatInstructions(instructions) {
        const instructionStrings = instructions.map(instruction => {
            let string = instruction.operation;
            if (!instruction.operation) {
                string = instruction;
            }
            else if (["L.S", "L.D", "LW", "LD"].includes(instruction.operation)) {
                string += ` ${instruction.destination}, ${instruction.immediate}`;
            }
            else if (["S.S", "S.D", "SW", "SD"].includes(instruction.operation)) {
                string += ` ${instruction.source}, ${instruction.immediate}`;
            }
            else if (["BEQ", "BNE"].includes(instruction.operation)) {
                string += ` ${instruction.source}, ${instruction.target}, ${instruction.label}`;
            }
            else if (["BEQZ", "BNEZ"].includes(instruction.operation)) {
                string += ` ${instruction.source}, ${instruction.label}`;
            }
            else if (["ADDI", "SUBI"].includes(instruction.operation)) {
                string += ` ${instruction.destination}, ${instruction.source}, ${instruction.immediate}`;
            }
            else {
                string += ` ${instruction.destination}, ${instruction.source}, ${instruction.target}`;
            }
            return string;
        });
        const formattedInstructions = instructionStrings.map((instruction) => {
            if (instruction instanceof Object) {
                return instruction;
            }
            return {
                instruction: instruction,
                issue: "",
                execute: "",
                writeResult: "",
            };
        });
        return formattedInstructions;
    }

    return (
        <div className="min-h-screen py-12 flex flex-col gap-12 justify-center items-center bg-neutral-800 text-neutral-100 font-mono dark">
            {page === 0 &&
                <div className="w-full flex flex-col items-center gap-8">
                    <h1 className="text-3xl">
                        Tomasulo's Algorithm Simulator
                    </h1>
                    <div className="flex justify-between w-2/3">
                        <div>
                            <h2 className="text-xl mb-3">
                                Enter your program
                            </h2>
                            <InstructionSelection instructions={instructions} setInstructions={setInstructions} />
                        </div>
                        <div>
                            <h2 className="text-xl mb-3">
                                Instructions
                            </h2>
                            <div className="flex flex-col gap-2 w-48">
                                {formatInstructions(instructions).map((instruction, index) => (
                                    <p key={index}>
                                        {instruction.instruction ? instruction.instruction : `${instruction.label}:`}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl mb-3">
                                Settings
                            </h2>
                            <Setup />
                        </div>
                    </div>
                    <div className="w-2/3">
                        <Button className="w-full justify-center" onClick={() => setPage(1)}>
                            Start Simulation
                        </Button>
                    </div>
                </div>
            }
            {page === 1 &&
                <div className="flex flex-col gap-12">
                    <InstructionQueue instructions={instructions} />
                    <FpRegisterFile />
                </div>
            }
        </div>
    )
}

export default App
