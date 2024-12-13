//Initializing basic Hardware
let Instructions = []; //the array of instructions recieved from frontend,  format :{operation,operand1,operand2,destination}
let InstructionQueue = [];//instruction queue isnt used for execution only to store all previously executed instructions

let cacheMissPenalty = 2;
let cache = [];  //{address,data}
let cacheMiss = false;

let RegisterFile = [];//{waiting,data}
let memory = [];//{address,data}
let writeBackArray =[]; //has all instructions ready to be written
let pc = 0;

let addLatency = 0;
let multLatency = 0;
let loadLatency = 0;
let storeLatency = 0;
let branchLatency = 0;
let stall = false;

//Initializing reservation stations
let adderReservationStation=[]; //{busy, operation , Vj, Vk, Qj, Qk}
let multiplierReservationStation= []; //{busy, operation , Vj, Vk, Qj, Qk}
let loadBuffer = []; //{busy,Address}
let storeBuffer = []; //{busy,Address, V, Q}
let branchStation = [];
//---------------------------------------------------------------------------------------------------------

    const ADD = ["ADD.S", "ADD.D", "DADDI"]; 
    const SUB = ["SUB.S", "SUB.D","DSUBI"]; 
    const MUL = ["MUL.S", "MUL.D"];
    const DIV = ["DIV.S", "DIV.D"];
    const BRNCH = ["BEQ", "BNE"];
    const STORE = ["S.S", "S.D", "SW", "SD"];
    const LOAD = ["L.S", "L.D", "LW", "LD"];

//1)Initializing
function init(adderResSize, multResSize, loadBufferSize, storeBufferSize, branchBufferSize, _addLatency, _multLatency, _loadLatency, _storeLatency, _branchLatency){
    for (let i = 0; i < adderResSize; i++) {
        adderReservationStation.push({ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, result: 0});
    }

    for (let i = 0; i < multResSize; i++) {
        multiplierReservationStation.push({ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, result: 0});
    }

    for (let i = 0; i < loadBufferSize; i++) {
        loadBuffer.push({ busy:0 , address:-1, result: 0}); 
    }

    for (let i = 0; i < storeBufferSize; i++) {
        storeBuffer.push({ busy:0 , address:-1 , V: 0, Q: 0});
    }
    
    for (let i = 0; i < branchBufferSize; i++) {
        branchStation.push({ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, brnchDestination: 0, result: 0});
    }

    addLatency = _addLatency;
    multLatency = _multLatency;
    loadLatency = _loadLatency;
    storeLatency = _storeLatency;
    branchLatency = _branchLatency
}
//---------------------------------------------------------------------------------------------------------


function fetchInstruction() {
    if (pc < Instructions.length) {

        const fetchedInstruction = Instructions[pc]; // Fetch instruction at current pc

        //Set the values of currInstruction depending on operation
        const destSrcTgt = ["ADD.S", "ADD.D", "SUB.S", "SUB.D", "MUL.S", "MUL.D", "DIV.S", "DIV.D"];
        const destSrcImm = ["DADDI", "DSUBI"];
        const srcTgtLbl = ["BEQ", "BNE"];
        const srcImm = ["S.S", "S.D", "SW", "SD"];
        const destImm = ["L.S", "L.D", "LW", "LD"];

        let currInstruction = {};
        if (destSrcTgt.includes(fetchedInstruction.operation)) {
            currInstruction = { operation: fetchedInstruction.operation , operand1: fetchedInstruction.source , operand2: fetchedInstruction.target, destination: fetchedInstruction.destination};
        }
        else if (destSrcImm.includes(fetchedInstruction.operation)) {
            currInstruction = { operation: fetchedInstruction.operation , operand1: fetchedInstruction.source , operand2: fetchedInstruction.immediate, destination: fetchedInstruction.destination};
        }
        else if (srcTgtLbl.includes(fetchedInstruction.operation)) {
            currInstruction = { operation: fetchedInstruction.operation , operand1: fetchedInstruction.source , operand2: fetchedInstruction.target, destination: fetchedInstruction.immediate};
        }
        else if (srcImm.includes(fetchedInstruction.operation)) {
            currInstruction = { operation: fetchedInstruction.operation , operand1: fetchedInstruction.source , operand2: 0, destination: fetchedInstruction.immediate};
        }
        else if (destImm.includes(fetchedInstruction.operation)) {
            // console.log("immediate: ",fetchedInstruction);
            currInstruction = { operation: fetchedInstruction.operation , operand1: fetchedInstruction.immediate , operand2: 0, destination: fetchedInstruction.destination};
        }
        else{
            console.log("Invalid Operation");
        }

        return currInstruction;
    } else {
        console.log("No more instructions to fetch.");
    }
}
//---------------------------------------------------------------------------------------------------------



//3)Memory
//TODO: Check size of memory
function InitializingMemory(values){ //values is an array of values
    // values.forEach((value, index) => {
    //     // console.log("idk: ", {value, index})
    //     memory.push({ waiting: index, data: value }); // Assign sequential numbers starting from 1
    // });
    memory=values;
}

function InitializingCache(values){ //values is an array of values
    // values.forEach((value, index) => {
    //     // console.log("idk: ", {value, index})
    //     cache.push({ address: index, data: 0 }); // Assign sequential numbers starting from 1
    // });
    cache=values;
}
//---------------------------------------------------------------------------------------------------------


//4)Cache
function fetchToCache(memoryAddress){ // handling cache misses
    // const entry = memory.find(entry => entry.address === memoryAddress);
    const entry = memory[memoryAddress];
    // console.log("mementry: ", entry);
    // const cacheEntry = cache.find(cacheEntry => cacheEntry.address === memoryAddress); // Find the cache entry with the same address
    // cacheEntry.data = entry.data;
    cache[memoryAddress]=entry;
}

function fetchFromCache(memoryAddress){ //Fetching from cache 
    let entry = cache[memoryAddress];
    if(entry === null){
        fetchToCache(memoryAddress);
        // console.log("memory to fetch to cache: ",memoryAddress);
        // cacheMiss=true;
        // entry = cache.find(entry => entry.data === memoryData);
        entry = cache[memoryAddress];
        console.log("ENTRY",entry);
    }
    return entry;
}
//---------------------------------------------------------------------------------------------------------




//5)RegisterFile
function InitializingRegisterFile(values){ //values is an array of values
    values.forEach((value, index) => {
        RegisterFile.push({ waiting: 0, data: value }); // waiting is the field in which m1 of A0 would be written for example
    });
}
function fetchFromRegisterFile(registerNumber) {
    const register = RegisterFile[registerNumber];
    // console.log("register",register);
    // console.log("register number",registerNumber);
    return { waiting: register.waiting, data: register.data };
    // if (register) {
    // } else {
    //     return null; // Return null if the registerNumber is invalid
    // }
}

function writeToRegisterFile(registerNumber, registerData, registerWating){
    console.log("fefWFw", registerNumber,registerData,registerWating);
    if (registerData !== -1) { // -1 means the item wasn't found
        RegisterFile[registerNumber].data = registerData; // Update the data
    }
    // RegisterFile[registerNumber].data = 0;
    RegisterFile[registerNumber].waiting = registerWating;
}
//---------------------------------------------------------------------------------------------------------



//6)Adder Reservation Station 
//{busy, operation , Vj, Vk, Qj, Qk}
function updateAdderReservationStation(tag, data){
    const indexj = adderReservationStation.findIndex(entry => entry.Qj === tag);
    if (indexj !== -1) { // -1 means the item wasn't found
        adderReservationStation[indexj].Vj = data;
        adderReservationStation[indexj].Qj = 0;
    }

    const indexk = adderReservationStation.findIndex(entry => entry.Qk === tag);
    if (indexk !== -1) { // -1 means the item wasn't found
        adderReservationStation[indexk].Vk = data;
        adderReservationStation[indexk].Qk = 0;
    }
}

function addInstructionToAdderReservationStation(instruction){
    // const index = adderReservationStation.findIndex(entry => entry.busy === 0);
    const index = adderReservationStation.findIndex(entry => entry.operation===""); 
    if (index !== -1) { // -1 means the item wasn't found
        adderReservationStation[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromAdderReservationStation(index){
    // adderReservationStation[index].busy= 0;
    adderReservationStation[index] = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, result: 0};
}
//---------------------------------------------------------------------------------------------------------


//7)Multiplier Reservation Station
//{busy, operation , Vj, Vk, Qj, Qk}
function updateMultiplierReservationStation(tag, data){
    const indexj = multiplierReservationStation.findIndex(entry => entry.Qj === tag);
    if (indexj !== -1) { // -1 means the item wasn't found
        multiplierReservationStation[indexj].Vj = data;
        multiplierReservationStation[indexj].Qj = 0;
    }

    const indexk = multiplierReservationStation.findIndex(entry => entry.Qk === tag);
    if (indexk !== -1) { // -1 means the item wasn't found
        multiplierReservationStation[indexk].Vk = data;
        multiplierReservationStation[indexk].Qk = 0;
    }
}

function addInstructionToMultiplierReservationStation(instruction){
    // const index = multiplierReservationStation.findIndex(entry => entry.busy === 0);
    const index = multiplierReservationStation.findIndex(entry => entry.operation === "");
    if (index !== -1) { // -1 means the item wasn't found
        multiplierReservationStation[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromMultiplierReservationStation(index){
    // multiplierReservationStation[index].busy= 0;
    multiplierReservationStation[index] = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, result: 0};
}
//---------------------------------------------------------------------------------------------------------


//Branch Station
//{ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, result: 0}
function updateBranchReservationStation(tag, data){
    const indexj = branchStation.findIndex(entry => entry.Qj === tag);
    if (indexj !== -1) { // -1 means the item wasn't found
        branchStation[indexj].Vj = data;
        branchStation[indexj].Qj = 0;
    }

    const indexk = storeBuffer.findIndex(entry => entry.Qk === tag);
    if (indexk !== -1) { // -1 means the item wasn't found
        branchStation[indexk].Vk = data;
        branchStation[indexk].Qk = 0;
    }
}

function addInstructionToBranchReservationStation(instruction){
    // const index = branchStation.findIndex(entry => entry.busy === 0);
    const index = branchStation.findIndex(entry => entry.operation===""); 
    if (index !== -1) { // -1 means the item wasn't found
        branchStation[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromBranchReservationStation(index){
    // branchStation[index].busy= 0;
    branchStation[index] = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0, brnchDestination: 0, result: 0 };
}
//-------------------------------------------------------------------------------------



//8)Load Buffer
//{busy,Address}
function addInstructionToLoadBuffer(instruction){
    // const index = loadBuffer.findIndex(entry => entry.busy === 0);
    const index = loadBuffer.findIndex(entry => entry.entry.operation === "");
    if (index !== -1) { // -1 means the item wasn't found
        loadBuffer[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromLoadBuffer(index){
    // loadBuffer[index].busy= 0;
    loadBuffer[index] = { busy:0 , address:-1, result: 0};
}
//---------------------------------------------------------------------------------------------------------


//9)Store Buffer
//{busy,Address, V, Q}
function updateStoreBuffer(tag, data){
    const index = storeBuffer.findIndex(entry => entry.Q === tag);
    if (index !== -1) { // -1 means the item wasn't found
        storeBuffer[index].V = data;
        storeBuffer[index].Q = 0;
    } else {
        return -1;
    }
}

function addInstructionToStoreBuffer(instruction){
    // const index = storeBuffer.findIndex(entry => entry.busy === 0);
    const index = storeBuffer.findIndex(entry => entry.operation === "");
    if (index !== -1) { // -1 means the item wasn't found
        storeBuffer[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromStoreBuffer(index){
    // storeBuffer[index].busy= 0;
    storeBuffer[index] = { busy:0 , address:-1 , V: 0, Q: 0};
}
//---------------------------------------------------------------------------------------------------------

//10)Adder
function ALU(operation, operand1, operand2){
        if(ADD.includes(operation)){
            return operand1 + operand2;
        }
        else if(SUB.includes(operation)){
            return operand1 - operand2;
        }
        else if( MUL.includes(operation)){
            return operand1 * operand2;
        }
        else if(DIV.includes(operation)){
            if (operand2 === 0) {
                throw new Error("Division by zero is not allowed.");
            }
            return operand1 / operand2;
        }
        else if(operation === "BEQ"){
            if (operand1 === operand2){
                return 1;
            } else {
                return -1;
            }
        } else if(operation === "BNE"){
            if(operand1 !== operand2){
                return 1;
            } else{
                return -1;
            }
        }
    }
    
    

//---------------------------------------------------------------------------------------------------------

//11)Bus
function publishToBus(tag, data){
    console.log("published", tag, data);

    const registerNumber = RegisterFile.findIndex(entry => entry.waiting === tag);

    writeToRegisterFile(registerNumber, data, 0);
    updateAdderReservationStation(tag, data);
    updateMultiplierReservationStation(tag, data);
    updateStoreBuffer(tag, data);
    updateBranchReservationStation(tag,data);
}
//---------------------------------------------------------------------------------------------------------

//12)Instruction Cycle
function issueInstruction() {

    const { operation, operand1, operand2, destination } = fetchInstruction();
    
    let issued = false; // Flag to check if the instruction was successfully issued bec reservation station full
    
    if(stall !== true){
        console.log("ISSUING: ", { operation, operand1, operand2, destination })
        // console.log("operation: ",{ operation, operand1, operand2, destination });
        const qj = fetchFromRegisterFile(operand1).waiting;
        const qk = fetchFromRegisterFile(operand2).waiting;
        const vj = fetchFromRegisterFile(operand1).data;
        const vk = fetchFromRegisterFile(operand2).data;
        console.log("operand1",operand1);
        console.log("operand2",operand2);
        const { waiting, value} = fetchFromRegisterFile(operand2);
        console.log("vj,qj,vk,qk: ", vj,qj,vk,qk);
        // Check the operation type and find the appropriate station
        if ( ADD.includes(operation) || SUB.includes(operation)) {
            const index = adderReservationStation.findIndex(entry => entry.busy === 0);
            if (index !== -1) {
                adderReservationStation[index] = {
                    busy: addLatency+1,
                    operation: operation,
                    Vj: vj,
                    Vk: vk,
                    Qj: qj,
                    Qk: qk,
                    result: 0
                };
                issued = true;
            }
            writeToRegisterFile(destination,-1,"A"+index);
        } else if (MUL.includes(operation) || DIV.includes(operation)) {
            const index = multiplierReservationStation.findIndex(entry => entry.busy === 0);
            if (index !== -1) {
                multiplierReservationStation[index] = {
                    busy: multLatency+1,
                    operation: operation,
                    Vj: vj,
                    Vk: vk,
                    Qj: qj,
                    Qk: qk,
                    result: 0
                };
                issued = true;
            }
            writeToRegisterFile(destination,-1,"M"+index);
        } else if (LOAD.includes(operation)) {
            const index = loadBuffer.findIndex(entry => entry.busy === 0);
            if (index !== -1) {
                loadBuffer[index] = { 
                    busy: loadLatency+1, 
                    address: operand1, 
                    result: 0
                };
                issued = true;
            }
            writeToRegisterFile(destination,-1,"L" + index);
        } else if (STORE.includes(operation)) {
            const index = storeBuffer.findIndex(entry => entry.busy === 0);
            if (index !== -1) {
                storeBuffer[index] = { 
                    busy: storeLatency+1, 
                    address: destination, 
                    V: vj, 
                    Q: qj };
                issued = true;
            }
        } else if(BRNCH.includes(operation)){
            const index = branchStation.findIndex(entry => entry.busy === 0);
            if (index !== -1) {
                branchStation[index] = {
                    busy: branchLatency+1,
                    operation: operation,
                    Vj: vj,
                    Vk: vk,
                    Qj: qj,
                    Qk: qk,
                    brnchDestination: destination,
                    result: 0
                };
                issued = true;
                stall = true;
            }
        } else {
            console.error("Unsupported operation:", operation);
        }

        // If the instruction couldn't be issued, dont move to issue the next instruction (stall)
        if (issued) {
            InstructionQueue.push({ operation, operand1, operand2, destination }); // Add it to the queue
            pc++; // Increment the program counter to point to the next instruction
        }
    }
}

function execute() {
    // Execute instructions in Adder Reservation Stations
    for (let i = 0; i < adderReservationStation.length; i++) {
        const station = adderReservationStation[i];
        if(station.busy>0 && station.Qj === 0 && station.Qk === 0){
            adderReservationStation[i].busy -= 1; // subtract from busy to simulate latency
        }
        if (station.busy === 1 && station.operation !== "") {
            const result = ALU(station.operation, station.Vj, station.Vk);
            adderReservationStation[i].result = result; // Store result temporarily
        }
    }

    // Execute instructions in Multiplier Reservation Stations
    for (let i = 0; i < multiplierReservationStation.length; i++) {
        const station = multiplierReservationStation[i];
        if(station.busy>0 && station.Qj === 0 && station.Qk === 0){
            multiplierReservationStation[i].busy -= 1; // subtract from busy to simulate execution latency
        }
        if (station.busy === 1 && station.operation !== "") {
            const result = ALU(station.operation, station.Vj, station.Vk);
            multiplierReservationStation[i].result = result; // Store result temporarily
        }
    }

    // Execute instructions in branch Reservation Stations
    for (let i = 0; i < branchStation.length; i++) {
        const station = branchStation[i];
        if(station.busy>0 && station.Qj === 0 && station.Qk === 0){
            branchStation[i].busy -= 1; // subtract from busy to simulate execution latency
        }
        if (station.busy === 1 && station.operation !== "") {
            const result = ALU(station.operation, station.Vj, station.Vk);
            branchStation[i].result = result; // Store result temporarily
        }
    }

    // Execute Load Buffer
    for (let i = 0; i < loadBuffer.length; i++) { // deal with cache miss here
        const buffer = loadBuffer[i];
        let sameAddress = -1;
        if(loadBuffer[i].address!== -1){
            sameAddress = storeBuffer.findIndex(entry => entry.address === buffer.address);
        }
        if (buffer.busy>0 && (sameAddress === -1 ||  loadBuffer[i].busy < loadLatency+1)) { // Data is not yet fetched and either there's no similar one in store buffer or it was already executing
            loadBuffer[i].busy -= 1;
        }
        if(buffer.busy===1 && buffer.address !== -1){//PROBLEM
        //     console.log("problem")
            const memoryData = fetchFromCache(buffer.address); // Simulate memory access
            loadBuffer[i].result = memoryData; // Fetch the data
        }
    }

    // Execute Store Buffer
    for (let i = 0; i < storeBuffer.length; i++) {
        const buffer = storeBuffer[i];
        let sameAddressLoad = -1;
        let sameAddressStore = -1;
        if(storeBuffer[i].address!== -1){
            sameAddressLoad = loadBuffer.findIndex(entry => entry.address === storeBuffer[i].address);
            sameAddressStore = storeBuffer.findIndex(entry => entry.address === storeBuffer[i].address && entry.busy !== storeBuffer[i].busy);
        }
        console.log("sameAddressstore:" , sameAddressLoad);
        console.log("sameAddressLoad:" , sameAddressStore);
        if(buffer.busy>0 && buffer.Q === 0 && ((sameAddressLoad === -1 && sameAddressStore === -1 ) || storeBuffer[i].busy < storeLatency+1)){ // either there's no similar one in store buffer or it was already executing
            storeBuffer[i].busy -= 1;
        }
        if (buffer.busy === 1 && buffer.address !== -1) { // Data is ready for storing
            console.log("enetered store exec");
            //store's execute is done in tghe write back because its exec is writing back to memory
            //const memoryAddress = buffer.address;
            //const value = buffer.V;
            //memory[memoryAddress] = value; // Store value in memory
        }
    }
}

function writeBack() {
    console.log("WRITEBACK");
    // Check Adder Reservation Stations
    for (let i = 0; i < adderReservationStation.length; i++) {
        const station = adderReservationStation[i];
        if (station.busy === 0 && station.operation !== "") { // Execution completed
            let result = station.result;
            let tag = "A" + i;
            writeBackArray.push({tag, result});
            removeInstructionFromAdderReservationStation(i); // Free the reservation station
        }
    }

    // Check Multiplier Reservation Stations
    for (let i = 0; i < multiplierReservationStation.length; i++) {
        const station = multiplierReservationStation[i];
        if (station.busy === 0 && station.operation !== "") { // Execution completed
            let result = station.result;
            let tag = "M" + i;
            writeBackArray.push({tag, result});
            removeInstructionFromMultiplierReservationStation(i); // Free the reservation station
        }
    }

    // Check Branch Reservation Stations
    for (let i = 0; i < branchStation.length; i++) {
        const station = branchStation[i];
        if (station.busy === 0 && station.operation !== "") { // Execution completed
            let result = station.result;
            if(result === 1){
                pc = station.brnchDestination;
            }
            stall = false;
            removeInstructionFromBranchReservationStation(i); // Free the reservation station
        }
    }

    // Check Load Buffer
    for (let i = 0; i < loadBuffer.length; i++) {
        const buffer = loadBuffer[i];
        if (buffer.busy === 0 && buffer.address !== -1) { // Data ready for write-back
            // const { data, destination } = buffer;
            // writeBackArray.push({destination, result});
            let result = buffer.result;
            let tag = "L" + i;
            writeBackArray.push({tag, result});
            // const memoryData = fetchFromCache(buffer.address); // Simulate memory access
            // const register = RegisterFile.find(register => register.waiting === "L" + i);
            // register.data = memoryData; // Fetch the data
            // register.waiting = 0; // Reset the waiting field
            removeInstructionFromLoadBuffer(i); // Free the load buffer entry
        }
    }

    // Check Store Buffer
    for (let i = 0; i < storeBuffer.length; i++) {
        const buffer = storeBuffer[i];
        if (buffer.busy === 0 && buffer.address !== -1) { // Store operation ready for memory write
            const { address, V } = buffer;
            memory[address] = V; // Store value to memory
            //storeBuffer[i].busy = 0; // Mark the store buffer entry as free
            removeInstructionFromStoreBuffer(i);
        }
    }


    console.log("writeback array: ", writeBackArray);
    if(writeBackArray.length !== 0){
        let temp = writeBackArray.shift();
        publishToBus(temp.tag, temp.result); // Broadcast result on the CDB
    }
}

//---------------------------------------------------------------------------------------------------------




function main() {
    // Initialize Hardware
    const adderResSize = 3;   // Number of adder reservation stations
    const multResSize = 2;    // Number of multiplier reservation stations
    const loadBufferSize = 3; // Size of the load buffer
    const storeBufferSize = 3; // Size of the store buffer
    const brnchBufferSize = 3; // Size of the store buffer

    const addLatency = 2;     // Latency for addition/subtraction
    const multLatency = 1;   // Latency for multiplication/division
    const loadLatency = 3;    // Latency for load
    const storeLatency = 5;   // Latency for store
    const branchLatency = 2;   // Latency for store

    init(adderResSize, multResSize, loadBufferSize, storeBufferSize, brnchBufferSize, addLatency, multLatency, loadLatency, storeLatency, branchLatency);

    // Load Instructions
    // Instructions.push(
    //     { operation: "L.D", destination: 6, immediate: 0 },      // L.D F6, 0
    //     { operation: "L.D", destination: 2, immediate: 4 },      // L.D F2, 4
    //     { operation: "MUL.D", destination: 0, source: 2, target: 4 }, // MUL.D F0, F2, F4
    //     { operation: "SUB.D", destination: 8, source: 2, target: 6 }, // SUB.D F8, F2, F6
    //     { operation: "DIV.D", destination: 10, source: 0, target: 6 }, // DIV.D F10, F0, F6
    //     { operation: "ADD.D", destination: 6, source: 8, target: 2 }, // ADD.D F6, F8, F2
    //     { operation: "S.D", source: 6, immediate: 0 }          // S.D F6, 0
    // );
    Instructions.push(
       
        { operation: "S.D", source: 8, immediate: 0 },                // S.D F8, 0 => mem[0] = 100
        { operation: "SUB.D", destination: 8, source: 1, target: 0 }, // SUB.D F8, F1, F0 => F8 =  20
        { operation: "S.D", source: 8, immediate: 0 }                 // S.D F8, 0 mem[0] = 20
        //correct: F6=10

        //Make memory like registers
        //{ operation: "L.D", destination: 6, immediate: 0 } ,     // L.D F6, 0
        //{ operation: "MUL.D", destination: 0, source: 6, target: 4 }, // MUL.D F0, F6, F4
        //{ operation: "SUB.D", destination: 8, source: 0, target: 6 }, // SUB.D F8, F0, F6
        //{ operation: "BNE", destination: 1, source: 8, target: 1 }, // SUB.D F8, F0, F6
    );
    
    // Initialize Memory and Register File
    InitializingMemory([10, 20, 30, 40, 50]); // Memory values at sequential addresses
    InitializingRegisterFile([0, 20, 0, 3, 3, 0, 0, 0, 100, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]); // Initialize registers F0-F10
    InitializingCache([null, null, null, null, null]);
    // InitializingCache([-1, -1, -1, -1, -1]);

    console.log("Starting simulation...");
    
    console.log(" Register File:", RegisterFile);
    console.log(" Memory:", memory);

    // Simulation Loop
    let cycle = 0;
    const maxCycles = 30; // Prevent infinite loops
    while (cycle < maxCycles) {
        console.log(`Cycle ${cycle}`);
        
       
        execute();
        writeBack();
        if(pc < Instructions.length){
            issueInstruction();
        }

        
        

         if (InstructionQueue.length === Instructions.length && 
             adderReservationStation.every(station => station.busy === 0) &&
             multiplierReservationStation.every(station => station.busy === 0) &&
             loadBuffer.every(buffer => buffer.busy === 0) &&
             storeBuffer.every(buffer => buffer.busy === 0) &&
             branchStation.every(buffer => buffer.busy === 0)) {
             break; // All instructions have been executed
         }

        cycle++;
        
        console.log(" Register File:", RegisterFile);
        console.log(" Memory:", memory);
        console.log(" adder station:", adderReservationStation);
        console.log(" mult station:", multiplierReservationStation);
        console.log(" load station:", loadBuffer);
        console.log(" store station:", storeBuffer);
        console.log(" branch station:", branchStation);
        console.log(" Cache:", cache);
        console.log(" PC:", pc);
        
        // console.log(" current instruction:", currInstruction);
        
    }

    console.log("Simulation finished.");
    console.log("Final Register File:", RegisterFile);
    console.log("Final Memory:", memory);
}

// Run the main method
main();



//----------------------------------------------------

//TODO:
//1- branch shouldnt write back -> updates pc in exec not write back
//2- add latencies for cache miss
