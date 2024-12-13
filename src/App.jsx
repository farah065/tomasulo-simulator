import "./App.css";
import { useState } from "react";
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
import BranchStation from "./components/tables/Branch Station/BranchStation";
import Cache from "./components/tables/Cache/Cache";
import { initializeSimulation, advanceCycle } from "./logic";

function App() {
    // const [instructions, setInstructions] = useState([]);
    const [instructions, setInstructions] = useState([
        // {
        //     "operation": "DADDI",
        //     "destination": 33,
        //     "source": 33,
        //     "immediate": 24
        // },
        // {
        //     "operation": "DADDI",
        //     "destination": 34,
        //     "source": 34,
        //     "immediate": 0
        // },
        // {
        //     "operation": "L.D",
        //     "destination": 0,
        //     "immediate": 8
        // },
        // {
        //     "operation": "MUL.D",
        //     "destination": 4,
        //     "source": 0,
        //     "target": 2
        // },
        // {
        //     "operation": "S.D",
        //     "source": 4,
        //     "immediate": 8
        // },
        // {
        //     "operation": "DSUBI",
        //     "destination": 33,
        //     "source": 33,
        //     "immediate": 8
        // },
        // {
        //     "operation": "BNE",
        //     "source": 33,
        //     "target": 34,
        //     "immediate": 2
        // }
    ]);
    //TEST CASES
    // 1
    // {
    //     "operation": "L.D",
    //     "destination": 6,
    //     "immediate": 0
    // },
    // {
    //     "operation": "ADD.D",
    //     "destination": 7,
    //     "source": 1,
    //     "target": 3
    // },
    // {
    //     "operation": "L.D",
    //     "destination": 2,
    //     "immediate": 20
    // },
    // {
    //     "operation": "MUL.D",
    //     "destination": 0,
    //     "source": 2,
    //     "target": 4
    // },
    // {
    //     "operation": "SUB.D",
    //     "destination": 8,
    //     "source": 2,
    //     "target": 6
    // },
    // {
    //     "operation": "DIV.D",
    //     "destination": 10,
    //     "source": 0,
    //     "target": 6
    // },
    // {
    //     "operation": "S.D",
    //     "source": 10,
    //     "immediate": 0
    // },

    //2 
    const [instructionQueue, setInstructionQueue] = useState([]);
    const [stationSizes, setStationSizes] = useState({
        fpAdders: 3,
        fpMultipliers: 2,
        loadBuffers: 2,
        storeBuffers: 2,
        branchStations: 1,
    });
    const [instructionLatencies, setInstructionLatencies] = useState({
        fpAdd: 4,
        fpMult: 6,
        load: 2,
        store: 2,
        branch: 1,
    });
    const [cache, setCache] = useState({ cacheSize: 256, blockSize: 4 }); // 256 Bytes, 4 Bytes per block, 64 blocks total
    const [cacheData, setCacheData] = useState([]);

    const [page, setPage] = useState(0);
    const [cycle, setCycle] = useState(0);

    function formatInstructions(instructions) {
        const instructionStrings = instructions.map(instruction => {
            let string = instruction.operation;
            if (["L.S", "L.D", "LW", "LD"].includes(instruction.operation)) {
                string += ` ${instruction.destination < 32 ? "F" + instruction.destination : "R" + (instruction.destination - 32)}, ${instruction.immediate}`;
            }
            else if (["S.S", "S.D", "SW", "SD"].includes(instruction.operation)) {
                string += ` ${instruction.source < 32 ? "F" + instruction.source : "R" + (instruction.source - 32)}, ${instruction.immediate}`;
            }
            else if (["BEQ", "BNE"].includes(instruction.operation)) {
                string += ` ${instruction.source < 32 ? "F" + instruction.source : "R" + (instruction.source - 32)}, ${instruction.target < 32 ? "F" + instruction.target : "R" + (instruction.target - 32)}, ${instruction.immediate}`;
            }
            else if (["DADDI", "DSUBI"].includes(instruction.operation)) {
                string += ` ${instruction.destination < 32 ? "F" + instruction.destination : "R" + (instruction.destination - 32)}, ${instruction.source < 32 ? "F" + instruction.source : "R" + (instruction.source - 32)}, ${instruction.immediate}`;
            }
            else {
                string += ` ${instruction.destination < 32 ? "F" + instruction.destination : "R" + (instruction.destination - 32)}, ${instruction.source < 32 ? "F" + instruction.source : "R" + (instruction.source - 32)}, ${instruction.target < 32 ? "F" + instruction.target : "R" + (instruction.target - 32)}`;
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

    const [addData, setAddData] = useState(Array.from({ length: stationSizes.fpAdders }, (_, i) => ({
        tag: `A${i}`,
        busy: 0,
        Vj: "",
        Vk: "",
        Qj: "",
        Qk: "",
    })));

    const [multData, setMultData] = useState(Array.from({ length: stationSizes.fpMultipliers }, (_, i) => ({
        tag: `M${i}`,
        busy: 0,
        Vj: "",
        Vk: "",
        Qj: "",
        Qk: "",
    })));

    const [loadData, setLoadData] = useState(Array.from({ length: stationSizes.loadBuffers }, (_, i) => ({
        tag: `L${i}`,
        busy: 0,
        address: "",
    })));

    const [storeData, setStoreData] = useState(Array.from({ length: stationSizes.storeBuffers }, (_, i) => ({
        tag: `S${i}`,
        busy: 0,
        address: "",
    })));

    const [branchData, setBranchData] = useState(Array.from({ length: stationSizes.branchStation }, (_, i) => ({
        tag: `B${i}`,
        busy: 0,
        Vj: "",
        Vk: "",
        Qj: "",
        Qk: "",
        address: "",
    })));

    const intRegs = Array.from({ length: 32 }, (_, i) => `R${i}`);
    const [intRegData, setIntRegData] = useState(intRegs.map((register) => ({
        register,
        qi: null,
        data: 0,
    })));

    const fpRegs = Array.from({ length: 32 }, (_, i) => `F${i}`);
    const [fpRegData, setFpRegData] = useState(fpRegs.map((register) => ({
        register,
        qi: null,
        data: 0,
    })));

    async function startSimulation() {
        // make sure all station sizes are ints
        const intStations = Object.fromEntries(Object.entries(stationSizes).map(([key, value]) => [key, parseInt(value)]));
        // make sure all instruction latencies are ints
        const intLatencies = Object.fromEntries(Object.entries(instructionLatencies).map(([key, value]) => [key, parseInt(value)]));
        let modifiedCache = { ...cache };
        modifiedCache.cacheSize = modifiedCache.cacheSize / 4;
        // make sure all immediates are ints
        const modifiedInstructions = instructions.map(instruction => {
            let modifiedInstruction = { ...instruction };
            if (instruction.immediate) {
                modifiedInstruction.immediate = parseInt(instruction.immediate);
            }
            return modifiedInstruction;
        });
        const result = await initializeSimulation(intStations, intLatencies, modifiedInstructions, modifiedCache);
        console.log("RESULT: ", result);
        setInstructionQueue(result.frontendUpdate.instructionQueue);
        setAddData(result.frontendUpdate.addData);
        setMultData(result.frontendUpdate.multData);
        setLoadData(result.frontendUpdate.loadData);
        setStoreData(result.frontendUpdate.storeData);
        setFpRegData(result.frontendUpdate.fpRegData);
        setIntRegData(result.frontendUpdate.intRegData);
        setBranchData(result.frontendUpdate.branchData);
        setCacheData(result.frontendUpdate.cacheData);
        setCycle(result.currentCycle);
        setPage(1);
    }

    async function advance() {
        const result = await advanceCycle(cycle + 1);
        setInstructionQueue(result.frontendUpdate.instructionQueue);
        setAddData(result.frontendUpdate.addData);
        setMultData(result.frontendUpdate.multData);
        setLoadData(result.frontendUpdate.loadData);
        setStoreData(result.frontendUpdate.storeData);
        setFpRegData(result.frontendUpdate.fpRegData);
        setIntRegData(result.frontendUpdate.intRegData);
        setBranchData(result.frontendUpdate.branchData);
        setCacheData(result.frontendUpdate.cacheData);
        setCycle(cycle + 1);
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
                            <Setup
                                stationSizes={stationSizes} setStationSizes={setStationSizes}
                                instructionLatencies={instructionLatencies} setInstructionLatencies={setInstructionLatencies}
                                cache={cache} setCache={setCache}
                            />
                        </div>
                    </div>
                    <div className="w-2/3">
                        <Button className="w-full justify-center" onClick={() => startSimulation()}>
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
                            <InstructionQueue instructionQueue={instructionQueue} />
                            <div className="flex gap-12">
                                <FpRegisterFile data={fpRegData} />
                                <IntegerRegisterFile data={intRegData} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-12 col-span-4">
                            <AdditionStation data={addData} />
                            <MultiplicationStation data={multData} />
                            <LoadBuffer data={loadData} />
                            <StoreBuffer data={storeData} />
                            <BranchStation data={branchData} />
                            <Cache data={cacheData} />
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
                    <Button onClick={() => advance()} className="fixed bottom-8 right-14">
                        Next Cycle
                    </Button>
                </div>
            }
        </div>
    )
}

export default App
