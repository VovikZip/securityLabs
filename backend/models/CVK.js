const { ElGamal, Alphabet } = require('../utils/elGamal.js');
const crypto = require('crypto')

class CVK {
    #listOfVoters;
    constructor(nameOfCVK) {
        this.nameOfCVK = nameOfCVK;
        this.listOfCandidates = [
            {
                name: "Ivan Moroz",
                votes: 0
            },
            {
                name: "Vitaliy Sonechko",
                votes: 0
            }
        ];
        this.#listOfVoters = [
            {
                name: "Oleksiy Minaev",
                age: 18,
                channels: {
                    ch1: ElGamal(Alphabet, 19),
                    ch2: ElGamal(Alphabet, 19)
                }
            },
            {
                name: "Volodymyr Minchenko",
                age: 21,
                channels: {
                    ch1: ElGamal(Alphabet, 27),
                    ch2: ElGamal(Alphabet, 27)
                }
            },
            {
                name: "Volodymyr Alioshkin",
                age: 19,
                channels: {
                    ch1: ElGamal(Alphabet, 26),
                    ch2: ElGamal(Alphabet, 26)
                }
            },
            {
                name: "Max Mezhyev",
                age: 20,
                channels: {
                    ch1: ElGamal(Alphabet, 15),
                    ch2: ElGamal(Alphabet, 15)
                }
            },
            {
                name: "Dima Mihno",
                age: 40,
                channels: {
                    ch1: ElGamal(Alphabet, 18),
                    ch2: ElGamal(Alphabet, 18)
                }
            },
            {
                name: "Super SUS",
                age: 42,
                channels: {
                    ch1: ElGamal(Alphabet, 24),
                    ch2: ElGamal(Alphabet, 24)
                }
            },
            {
                name: "Ivan Bogyn",
                age: 450,
                channels: {
                    ch1: ElGamal(Alphabet, 11),
                    ch2: ElGamal(Alphabet, 11)
                }
            },
            {
                name: "Vladyslav Minaev",
                age: 20,
                channels: {
                    ch1: ElGamal(Alphabet, 62),
                    ch2: ElGamal(Alphabet, 62)
                }
            }];
    }
   

    givePublicKey(voterName) {
        let indexOfName; 
        const canFindName = this.#listOfVoters.find((v, i) => {
            indexOfName = i;
            
            return v.name === voterName;
        });

        const checkedStatus = this.#listOfVoters[indexOfName].status === "checked";
        if (checkedStatus) {
            console.warn(`You're trying to vote second time or you're imposter, ${voterName}`);
            return 1;
        } else if (!canFindName) {
            console.warn(`Sorry, but you registered on this voting, ${voterName}`);
            return 0;
        } else if (canFindName) {
            return this.#listOfVoters[indexOfName].channels;
        }
    };

    getBuileten(buileten) {
        const encryptedMessage = buileten.buileten;

        const profileOfVoter = this.#listOfVoters.find((voterN, i) => {
            const isVerified = crypto.verify(
                "sha256",
                Buffer.from(voterN.name),
                {
                    key: buileten.signa.theirPKey,
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                },
                buileten.signa.theirSign
            )

            if (isVerified) {
                this.#listOfVoters[i].status = "checked";
            }

            return isVerified;
        });

        const decryptedMessage = profileOfVoter.channels.ch2.decrypt(buileten.buileten);
        
        const favourite = this.listOfCandidates.find((candidate) => {
            if (candidate.name === decryptedMessage) {
                profileOfVoter.voteFor = decryptedMessage;
                candidate.votes++;
            }
            return candidate.name === decryptedMessage;
        });

        if (!favourite) {
            console.warn(`We don't have this option, please pay attention, ${profileOfVoter.name}!`);
            return 3;
        }
    }

    finalResults() {
        return {
            count: this.#listOfVoters.length - this.#listOfVoters.filter((persona) => {
                return persona.status === "checked"
            }).length,
            first: `${this.listOfCandidates[0].name} has scored ${this.listOfCandidates[0].votes}`,
            second: `${this.listOfCandidates[1].name} has scored ${this.listOfCandidates[1].votes}`,
            winner: `The winner is ${this.listOfCandidates[0].votes >= this.listOfCandidates[1].votes ? this.listOfCandidates[0].name : this.listOfCandidates[1].name}`,
        } 

        // return this.#listOfVoters.length - this.#listOfVoters.filter((persona) => {
        //     return persona.status === "checked"
        // }).length

        // return {
        //     first: `${this.listOfCandidates[0].name} has scored ${this.listOfCandidates[0].votes}!`,
        //     second: `${this.listOfCandidates[1].name} has scored ${this.listOfCandidates[1].votes}!`,
        //     winner: `The winner is ${this.listOfCandidates[0].votes >= this.listOfCandidates[1].votes ? this.listOfCandidates[0].name : this.listOfCandidates[1].name}!`,         
        // }
    }
}

module.exports = {
    CVK
}