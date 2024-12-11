import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import InstructionSelection from "./components/InstructionSelection";
import FpRegisterFile from "./components/tables/FP Register File/FpRegisterFile";
import InstructionQueue from "./components/tables/Instruction Queue/InstructionQueue";
import Setup from "./components/Setup";
import IntegerRegisterFile from "./components/tables/Integer Register File/IntegerRegisterFile";
import AdditionStation from "./components/tables/Addition Station/AdditionStation";
import MultiplicationStation from "./components/tables/Multiplication Station/MultiplicationStation";
import LoadBuffer from "./components/tables/Load Buffer/LoadBuffer";
import StoreBuffer from "./components/tables/Store Buffer/StoreBuffer";

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
    const [cycle, setCycle] = useState(0);

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
                string += ` ${instruction.source}, ${instruction.target}, ${instruction.immediate}`;
            }
            else if (["DADDI", "DSUBI"].includes(instruction.operation)) {
                string += ` ${instruction.destination}, ${instruction.source}, ${instruction.immediate}`;
            }
            else {
                string += ` ${instruction.destination}, ${instruction.source}, ${instruction.target}`;
            }
            return string;
        });
        const formattedInstructions = instructionStrings.map((instruction) => {
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
                    <div className="grid grid-cols-3 gap-20 w-2/3">
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
                            <div className="flex flex-col gap-2">
                                {formatInstructions(instructions).map((instruction, index) => (
                                    <p key={index}>
                                        {instruction.instruction}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl mb-3">
                                Settings
                            </h2>
                            <Setup stationSizes={stationSizes} setStationSizes={setStationSizes} instructionLatencies={instructionLatencies} setInstructionLatencies={setInstructionLatencies} />
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
                <div className="w-full flex flex-col items-center gap-12 relative">
                    <h1 className="text-3xl">
                        Cycle {cycle}
                    </h1>
                    <div className="grid grid-cols-10 gap-12">
                        <div className="flex flex-col gap-12 col-span-4">
                            <InstructionQueue instructions={instructions} />
                            <div className="flex gap-12">
                                <FpRegisterFile />
                                <IntegerRegisterFile />
                            </div>
                        </div>
                        <div className="flex flex-col gap-12 col-span-4">
                            <AdditionStation stationSizes={stationSizes} />
                            <MultiplicationStation stationSizes={stationSizes} />
                            <LoadBuffer stationSizes={stationSizes} />
                            <StoreBuffer stationSizes={stationSizes} />
                            {console.log("SIZES:", stationSizes)}
                        </div>
                        <div className="col-span-2">
                            <h2 className="text-xl mb-3">
                                Program
                            </h2>
                            <div className="flex flex-col gap-2">
                                {formatInstructions(instructions).map((instruction, index) => (
                                    <p key={index}>
                                        {instruction.instruction}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setCycle(cycle + 1)} className="fixed bottom-8 right-14">
                        Next Cycle
                    </Button>
                </div>
            }
        </div>
    )
}

export default App
