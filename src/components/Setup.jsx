import { Input } from "./ui/input";

function Setup({ stationSizes, setStationSizes, instructionLatencies, setInstructionLatencies, cache, setCache }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="-mb-1 text-lg mt-4">
                Reservation Station Counts
            </h2>
            <div>
                <h3 className="mb-1">
                    Addition Stations
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={stationSizes.fpAdders}
                        className="w-full"
                        onChange={(e) => setStationSizes({ ...stationSizes, fpAdders: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Multiplication Stations
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={stationSizes.fpMultipliers}
                        className="w-full"
                        onChange={(e) => setStationSizes({ ...stationSizes, fpMultipliers: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Load Buffers
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={stationSizes.loadBuffers}
                        className="w-full"
                        onChange={(e) => setStationSizes({ ...stationSizes, loadBuffers: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Store Buffers
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={stationSizes.storeBuffers}
                        className="w-full"
                        onChange={(e) => setStationSizes({ ...stationSizes, storeBuffers: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Branch Stations
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={stationSizes.branchStations}
                        className="w-full"
                        onChange={(e) => setStationSizes({ ...stationSizes, branchStations: e.target.value })}
                    />
                </div>
            </div>

            <h2 className="-mb-1 text-lg mt-4">
                Instruction Latencies
            </h2>
            <div>
                <h3 className="mb-1">
                    FP Addition
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={instructionLatencies.fpAdd}
                        className="w-full"
                        onChange={(e) => setInstructionLatencies({ ...instructionLatencies, fpAdd: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    FP Multiplication
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={instructionLatencies.fpMult}
                        className="w-full"
                        onChange={(e) => setInstructionLatencies({ ...instructionLatencies, fpMult: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Loads
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={instructionLatencies.load}
                        className="w-full"
                        onChange={(e) => setInstructionLatencies({ ...instructionLatencies, load: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Stores
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={instructionLatencies.store}
                        className="w-full"
                        onChange={(e) => setInstructionLatencies({ ...instructionLatencies, store: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Branches
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={instructionLatencies.branch}
                        className="w-full"
                        onChange={(e) => setInstructionLatencies({ ...instructionLatencies, branch: e.target.value })}
                    />
                </div>
            </div>

            <h2 className="-mb-1 text-lg mt-4">
                Cache Details
            </h2>
            <div>
                <h3 className="mb-1">
                    Cache Size
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={cache.cacheSize}
                        className="w-full"
                        onChange={(e) => setCache({ ...cache, cacheSize: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <h3 className="mb-1">
                    Block Size
                </h3>
                <div className="w-full">
                    <Input
                        type="number"
                        defaultValue={cache.blockSize}
                        className="w-full"
                        onChange={(e) => setCache({ ...cache, blockSize: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}

export default Setup;