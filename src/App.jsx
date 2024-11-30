import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import InstructionSelection from "./components/InstructionSelection";
import FpRegisterFile from "./components/tables/FP Register File/FpRegisterFile";
import InstructionQueue from "./components/tables/Instruction Queue/InstructionQueue";

function App() {
    const [instructions, setInstructions] = useState([]);
    const [stationSizes, setStationSizes] = useState({
        fpAdders: 3,
        fpMultipliers: 2,
        loadBuffers: 2,
        storeBuffers: 2,
    });
    const [page, setPage] = useState(0);

    function formatInstructions(instructions) {
        const instructionStrings = instructions.map(instruction => {
            let string = instruction.operation;
            if (!instruction.operation) {
                string = instruction;
            }
            else if (["L.S", "L.D", "LW", "LD"].includes(instruction.operation)) {
                string += ` ${instruction.destination}, ${instruction.immediate}(${instruction.source})`;
            }
            else if (["S.S", "S.D", "SW", "SD"].includes(instruction.operation)) {
                string += ` ${instruction.source}, ${instruction.immediate}(${instruction.target})`;
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

    useEffect(() => {
        console.log("INSTRUCTIONS: ", instructions);
        console.log("FORMATTED INSTRUCTIONS: ", formatInstructions(instructions));
    }, [instructions]);

    return (
        <div className="min-h-screen py-12 flex flex-col gap-12 justify-center items-center bg-neutral-800 text-neutral-100 font-mono dark">
            {page === 0 &&
                <div className="w-max flex flex-col items-center gap-8">
                    <h1 className="text-3xl">
                        Tomasulo's Algorithm Simulator
                    </h1>
                    <div className="flex justify-between w-full">
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
                    </div>
                    <Button className="w-full justify-center" onClick={() => setPage(1)}>
                        Start Simulation
                    </Button>
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
