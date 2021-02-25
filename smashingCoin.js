const sha256 = require('js-sha256');

class CryptoBlock {
    constructor(data, index = 0, timestamp = Date.now(), precedingHash=' ') {
        this.data = data;
        this.index = index;
        this.timestamp = timestamp;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return sha256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    proofOfWork(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.computeHash();
        }        
    }
    
}

class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 5;
    }

    startGenesisBlock() {
        return new CryptoBlock('Initial Block in Chain');
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    
    addNewBlock(data) {
        const newBlock = new CryptoBlock(data)
        newBlock.index = this.obtainLatestBlock().index + 1;
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty)
        this.blockchain.push(newBlock)
    }

    checkChainValidity() {
        for(let i = 1; i < this.blockchain.length; i++) {
            const currBlock = this.blockchain[i];
            const preBlock = this.blockchain[i - 1];

            if(currBlock.hash !== currBlock.computeHash()) return false
    
            if(currBlock.precedingHash !== preBlock.hash) return false
        }

        return true
    }

}

let smashingCoin = new CryptoBlockchain()



smashingCoin.addNewBlock({sender: 'Joe Dickey', recipient: 'Lauren Dickey', quantity: 50})
smashingCoin.addNewBlock({sender: 'James Robinson', recipient: 'Sandra Bullock', quantity: 70})
smashingCoin.addNewBlock({sender: 'Edd Kerr', recipient: 'Burt Reynolds', quantity: 20})

console.log(JSON.stringify(smashingCoin, null, 4) + ` This chain is valid: ${smashingCoin.checkChainValidity()}`)



