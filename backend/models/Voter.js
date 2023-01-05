const crypto = require('crypto')
class Voter {
    #theirKeys;
    #theirBuileten;
    #hashedBuileten;
        constructor(name, age, theirCVK, message) {
        this.name = name;
        this.age = age;
        this.theirCVK = theirCVK;
        this.message = message;
        this.#theirKeys = { };
        this.#theirBuileten = {
            // signa: { signature and public key of RSA sign } OBJECT
            // buileten: elGamalized with given public key from CVK } STRING
        };
        this.#hashedBuileten = "";
    }

    givePublicKey() {
        return this.#theirKeys.publicRSAKey;
    }

    #generatePublicKey() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048});
        this.#theirKeys.publicRSAKey = publicKey;
        this.#theirKeys.privateRSAKey = privateKey;  
    }

    #signBuileten() {
        this.#generatePublicKey();
        const verifiableData = this.name;
        const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
            key: this.#theirKeys.privateRSAKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
          
          this.#theirBuileten.signa = {
            theirSign: signature,
            theirPKey: this.#theirKeys.publicRSAKey
          }
    }

    #elGamalizeBuileten(channels) {
        const hashedMessage = channels.ch1.encrypt(this.message, channels.ch2.pubKey);
        this.#hashedBuileten = hashedMessage;
        this.#theirBuileten.buileten = this.#hashedBuileten;
    }

    sendBuileten(channels) {
        this.#signBuileten();
        this.#elGamalizeBuileten(channels);
        return this.#theirBuileten;
    }
}

class Imposter extends Voter {
    constructor(name, age, cvk, message) {
        super(name, age, cvk, message)
        this.name = "imposter";
    }
}

module.exports = {
    Voter,
    Imposter
}