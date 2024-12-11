
//Initializing basic Hardware
const Instructions = []; //the array of instructions recieved from frontend,  format :{operation,operand1,operand2,destination}
const InstructionQueue = [];//instruction queue isnt used for execution only to store all previously executed instructions
const currInstruction = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0}; // the instruction that is currently getting issued

const cacheMissPenalty = 2;
const cache = [];  //{address,data}
const cacheMiss = false;

const RegisterFile = [];//{number,data}
const memory = [];//{address,data}
const writeBackArray =[]; //has all instructions ready to be written
const pc = 0;

const addLatency = 0;
const multLatency = 0;
const loadLatency = 0;
const storeLatency = 0;


//Initializing reservation stations
const adderReservationStation=[]; //{busy, operation , Vj, Vk, Qj, Qk}
const multiplierReservationStation= []; //{busy, operation , Vj, Vk, Qj, Qk}
const loadBuffer = []; //{busy,Address}
const storeBuffer = []; //{busy,Address, V, Q}
//---------------------------------------------------------------------------------------------------------


//1)Initializing
function init(adderResSize, multResSize, loadBufferSize, storeBufferSize, _addLatency, _multLatency, _loadLatency, _storeLatency){
    for (let i = 0; i < adderResSize; i++) {
        adderReservationStation.push({ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0});
    }

    for (let i = 0; i < multResSize; i++) {
        multiplierReservationStation.push({ busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0});
    }

    for (let i = 0; i < loadBufferSize; i++) {
        loadBuffer.push({ busy:0 , address:0});
    }

    for (let i = 0; i < storeBufferSize; i++) {
        storeBuffer.push({ busy:0 , address:0 , V: 0, Q: 0});
    }

    addLatency = _addLatency;
    multLatency = _multLatency;
    loadLatency = _loadLatency;
    storeLatency = _storeLatency;
}
//---------------------------------------------------------------------------------------------------------


function fetchInstruction() {
    if (pc < Instructions.length) {
        const currInstruction = Instructions[pc]; // Fetch instruction at current pc
        InstructionQueue.push(currInstruction); // Add it to the queue
        pc++; // Increment the program counter to point to the next instruction
    } else {
        console.log("No more instructions to fetch.");
    }
}
//---------------------------------------------------------------------------------------------------------


//3)Memory
//TODO: Check size of memory
function InitializingMemory(values){ //values is an array of values
    values.forEach((value, index) => {
        memory.push({ number: index, data: value }); // Assign sequential numbers starting from 1
    });
}
//---------------------------------------------------------------------------------------------------------


//4)Cache
function fetchToCache(memoryAddress){ // handling cache misses
    const entry = memory.find(entry => entry.address === memoryAddress);
    cache.push(entry);
}

function fetchFromCache(memoryAddress , memoryData){ //Fetching from cache 
    const entry = cache.find(entry => entry.data === memoryData);
    if(entry == null){
        fetchToCache(memoryAddress);
        cacheMiss=true;
        entry = cache.find(entry => entry.data === memoryData);
    }
    return entry;
}
//---------------------------------------------------------------------------------------------------------




//5)RegisterFile
function InitializingRegisterFile(values){ //values is an array of values
    values.forEach((value, index) => {
        RegisterFile.push({ number: index, data: value }); // Assign sequential numbers starting from 1
    });
}
function fetchFromRegisterFile(registerNumber){
    const register = RegisterFile.find(register => register.number === registerNumber);
    return register.data;
}

function writeToRegisterFile(registerNumber, registerData){
    const index = RegisterFile.findIndex(entry => entry.number === registerNumber);
    if (index !== -1) { // -1 means the item wasn't found
        RegisterFile[index].data = registerData; // Update the data
    } else {
        return -1;
    }
}
//---------------------------------------------------------------------------------------------------------



//6)Adder Reservation Station 
//{busy, operation , Vj, Vk, Qj, Qk}
function updateAdderReservationStation(address, data){
    const indexj = adderReservationStation.findIndex(entry => entry.Qj === address);
    if (indexj !== -1) { // -1 means the item wasn't found
        adderReservationStation[indexj].Vj = data;
        adderReservationStation[indexj].Qj = 0;
    }

    const indexk = storeBuffer.findIndex(entry => entry.Qk === address);
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
    adderReservationStation[index] = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0};
}
//---------------------------------------------------------------------------------------------------------


//7)Multiplier Reservation Station
//{busy, operation , Vj, Vk, Qj, Qk}
function updateMultiplierReservationStation(address, data){
    const indexj = multiplierReservationStation.findIndex(entry => entry.Qj === address);
    if (indexj !== -1) { // -1 means the item wasn't found
        multiplierReservationStation[indexj].Vj = data;
        multiplierReservationStation[indexj].Qj = 0;
    }

    const indexk = storeBuffer.findIndex(entry => entry.Qk === address);
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
    multiplierReservationStation[index] = { busy:0 , operation:"", Vj: 0, Vk: 0, Qj: 0, Qk: 0};
}
//---------------------------------------------------------------------------------------------------------


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
    loadBuffer[index] = { busy:0 , address:0};
}
//---------------------------------------------------------------------------------------------------------


//9)Store Buffer
//{busy,Address, V, Q}
function updateStoreBuffer(address, data){
    const index = storeBuffer.findIndex(entry => entry.Q === address);
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
    storeBuffer[index] = { busy:0 , address:0 , V: 0, Q: 0};
}
//---------------------------------------------------------------------------------------------------------

//10)Adder
function ALU(operation, operand1, operand2){
    switch (operation) {
        case "ADD": // Addition
            return operand1 + operand2;

        case "SUB": // Subtraction
            return operand1 - operand2;

        case "MUL": // Multiplication
            return operand1 * operand2;

        case "DIV": // Division
            if (operand2 === 0) {
                throw new Error("Division by zero is not allowed.");
            }
            return operand1 / operand2;
    }
    
}
//---------------------------------------------------------------------------------------------------------

//11)Bus
function publishToBus(address, data){
    writeToRegisterFile(address, data);
    updateAdderReservationStation(address, data);
    updateMultiplierReservationStation(address, data);
    updateStoreBuffer(address, data);
}
//---------------------------------------------------------------------------------------------------------

//12)Instruction Cycle
function issueInstruction() {

    const { operation, operand1, operand2, destination } = currInstruction;

    let issued = false; // Flag to check if the instruction was successfully issued bec reservation station full

    // Check the operation type and find the appropriate station
    if (operation === "ADD" || operation === "SUB") {
        const index = adderReservationStation.findIndex(entry => entry.busy === 0);
        if (index !== -1) {
            adderReservationStation[index] = {
                busy: addLatency,
                operation,
                Vj: fetchFromRegisterFile(operand1),
                Vk: fetchFromRegisterFile(operand2),
                Qj: 0,
                Qk: 0
            };
            issued = true;
        }
    } else if (operation === "MUL" || operation === "DIV") {
        const index = multiplierReservationStation.findIndex(entry => entry.busy === 0);
        if (index !== -1) {
            multiplierReservationStation[index] = {
                busy: multLatency,
                operation,
                Vj: fetchFromRegisterFile(operand1),
                Vk: fetchFromRegisterFile(operand2),
                Qj: 0,
                Qk: 0
            };
            issued = true;
        }
    } else if (operation === "LOAD") {
        const index = loadBuffer.findIndex(entry => entry.busy === 0);
        if (index !== -1) {
            loadBuffer[index] = { busy: loadLatency, address: operand1 };
            issued = true;
        }
    } else if (operation === "STORE") {
        const index = storeBuffer.findIndex(entry => entry.busy === 0);
        if (index !== -1) {
            storeBuffer[index] = { busy: storeLatency, address: operand1, V: fetchFromRegisterFile(operand2), Q: 0 };
            issued = true;
        }
    } else {
        console.error("Unsupported operation:", operation);
    }

    // If the instruction couldn't be issued, dont move to issue the next instruction (stall)
    if (!issued) {
        pc-=1;
    }
}

function execute() {
    // Execute instructions in Adder Reservation Stations
    for (let i = 0; i < adderReservationStation.length; i++) {
        const station = adderReservationStation[i];
        if(station.busy>0 && station.Qj === 0 && station.Qk === 0){
            adderReservationStation[i].busy -= 1; // subtract from busy to simulate latency
        }
        if (station.busy === 0 ) {
            const result = ALU(station.operation, station.Vj, station.Vk);
            adderReservationStation[i].result = result; // Store result temporarily
        }
    }

    // Execute instructions in Multiplier Reservation Stations
    for (let i = 0; i < multiplierReservationStation.length; i++) {
        const station = multiplierReservationStation[i];
        if(station.busy>0 && station.Qj === 0 && station.Qk === 0){
            adderReservationStation[i].busy -= 1; // subtract from busy to simulate execution latency
        }
        if (station.busy === 0 ) {
            const result = ALU(station.operation, station.Vj, station.Vk);
            adderReservationStation[i].result = result; // Store result temporarily
        }
    }

    // Execute Load Buffer
    for (let i = 0; i < loadBuffer.length; i++) { // deal with cache miss here
        const buffer = loadBuffer[i];
        if (buffer.busy && buffer.data == null) { // Data is not yet fetched
            const memoryData = fetchFromCache(buffer.address); // Simulate memory access
            loadBuffer[i].data = memoryData; // Fetch the data
            loadBuffer[i].busy -= 1;
        }
    }

    // Execute Store Buffer
    for (let i = 0; i < storeBuffer.length; i++) {
        const buffer = storeBuffer[i];
        if(station.busy>0 && buffer.Q === 0){
            storeBuffer[i].busy -= 1;
        }
        if (station.busy === 0 ) { // Data is ready for storing
            const memoryAddress = buffer.address;
            const value = buffer.V;
            memory[memoryAddress] = value; // Store value in memory
        }
    }
}

function writeBack() {
    // Check Adder Reservation Stations
    for (let i = 0; i < adderReservationStation.length; i++) {
        const station = adderReservationStation[i];
        if (station.busy === 0) { // Execution completed
            const { result, destination } = station;
            writeBackArray.push({destination, result});
            removeInstructionFromAdderReservationStation(i); // Free the reservation station
        }
    }

    // Check Multiplier Reservation Stations
    for (let i = 0; i < multiplierReservationStation.length; i++) {
        const station = multiplierReservationStation[i];
        if (station.busy === 0) { // Execution completed
            const { result, destination } = station;
            writeBackArray.push({destination, result});
            removeInstructionFromMultiplierReservationStation(i); // Free the reservation station
        }
    }

    // Check Load Buffer
    for (let i = 0; i < loadBuffer.length; i++) {
        const buffer = loadBuffer[i];
        if (buffer.busy === 0 && buffer.data != null) { // Data ready for write-back
            const { data, destination } = buffer;
            writeBackArray.push({destination, result});
            removeInstructionFromLoadBuffer(i); // Free the load buffer entry
        }
    }

    // Check Store Buffer
    for (let i = 0; i < storeBuffer.length; i++) {
        const buffer = storeBuffer[i];
        if (buffer.busy === 0 && buffer.Q === 0) { // Store operation ready for memory write
            const { address, V } = buffer;
            memory[address] = V; // Store value to memory
            storeBuffer[i].busy = 0; // Mark the store buffer entry as free
        }
    }

    publishToBus(writeBackArray.shift()); // Broadcast result on the CDB
}

//---------------------------------------------------------------------------------------------------------

//TODO:
//1- Edit instruction format to be based on the instruction(refrence in Instruction Selection)
//2- change in issue instruction to accomodated rest of operations & check reg file for Qj/k
//3- add latencies for cache miss
//4- two instructions wish to publish their result on the bus in the same cycle -> make a ready for publishing array