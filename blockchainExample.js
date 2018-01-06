//Adapted from example provided by: https://www.savjee.be/2017/07/Writing-tiny-blockchain-in-JavaScript/
//Xavier Decuyper
//create constant to store crypto-js library
const SHA256 = require("crypto-js/sha256");

//Create new block object
class Block {
    //Block object constructor
    constructor(index, timestamp, transaction, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    //Mine block
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }
    //Calculate Hash
    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transaction) + this.nonce).toString();
    }
}

//Create new blockchain object
class Blockchain{
    //Blockchain object constructor and mining difficulty
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }
    //First block to start new blockchain
    createGenesisBlock(){
        return new Block(0, Date.now(), "No transactions yet", 0);
    }
    //Return object of prior block
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    //Add new block to blockchain
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    //Check validity of blockchain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

//Example: create a new blockchain
var newBlockchain = new Blockchain();
console.log(newBlockchain);

//Example: Add 2 new blocks(transactions) to blockchain
newBlockchain.addBlock(new Block(1, Date.now(), 500));
newBlockchain.addBlock(new Block(2, Date.now(), 5464));
console.log(newBlockchain);

//Check if blockcahin is valid
console.log(newBlockchain.isChainValid());

//Change a previous transaction and check validity
newBlockchain.chain[1].transaction = -200;
console.log(newBlockchain.isChainValid());




