
//Initializing basic Hardware
const InstructionQueue = [];//{operation,operand1,operand2,destination}
const cache = [];  //{address,data}
const RegisterFile = [];//{number,data}
const memory = [];//{address,data}

//Initializing reservation stations
const adderReservationStation=[]; //{busy, operation , Vj, Vk, Qj, Qk}
const multiplierReservationStation= []; //{busy, operation , Vj, Vk, Qj, Qk}
const loadBuffer = []; //{busy,Address}
const storeBuffer = []; //{busy,Address, V, Q}
//---------------------------------------------------------------------------------------------------------


//1)Initializing
function init(adderResSize, multResSize, loadBufferSize, storeBufferSize, latency){
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
}
//---------------------------------------------------------------------------------------------------------


//2)InstructionQueue
function addInstructionToInstructionQueue(instruction) { //Filling the instruction Queue with instructions
    InstructionQueue.push(instruction);
}
function fetchInstruction() { //Filling the instruction Queue with instructions
    return InstructionQueue.pop();
}
//---------------------------------------------------------------------------------------------------------


//3)Memory
//TODO: Check size of memory
function InitializingMemory(values){ //values is an array of values
    values.forEach((value, index) => {
        RegisterFile.push({ number: index, data: value }); // Assign sequential numbers starting from 1
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
    const index = adderReservationStation.findIndex(entry => entry.busy === 0);
    if (index !== -1) { // -1 means the item wasn't found
        adderReservationStation[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromAdderReservationStation(index){
    adderReservationStation[index].busy= 0;
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
    const index = multiplierReservationStation.findIndex(entry => entry.busy === 0);
    if (index !== -1) { // -1 means the item wasn't found
        multiplierReservationStation[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromMultiplierReservationStation(index){
    multiplierReservationStation[index].busy= 0;
}
//---------------------------------------------------------------------------------------------------------


//8)Load Buffer
//{busy,Address}
function addInstructionToLoadBuffer(instruction){
    const index = loadBuffer.findIndex(entry => entry.busy === 0);
    if (index !== -1) { // -1 means the item wasn't found
        loadBuffer[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromLoadBuffer(index){
    loadBuffer[index].busy= 0;
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
    const index = storeBuffer.findIndex(entry => entry.busy === 0);
    if (index !== -1) { // -1 means the item wasn't found
        storeBuffer[index]= instruction;
    }
    else{
        return -1;
    }
}

function removeInstructionFromStoreBuffer(index){
    storeBuffer[index].busy= 0;
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




//TODO:
//1-add instruction issue, exec and write back
//1-make a fake main method to test everything and fake link methods
//2-recheck when address is register address or reservation station addtess or instruction address bec they're all named the same
//3-check hazards: RAW,WAW,WAR
//4- add latencies
    //You can take any assumptions about the cache hit latency and penalty
    //The user should be able to input the latency of each type of instruction before we start simulating
//5- two instructions wish to publish their result on the bus in the same cycle
