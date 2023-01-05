const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const {Voter, Imposter} = require('./models/Voter')
const {CVK} = require('./models/CVK')

let statistic = {
    participants: 0,
    noVote: 0,
    voteIncorrectly: 0,
    voterWithoutRight: 0,
    voteAgain: 0,
}

let CVKRes = {}

const potentialVoters = [
    {name: 'Oleksiy Minaev', age: 18, cvk: 'CVK#1', vote: 'Ivan Moroz'},
    {name: 'Oleksiy Minaev', age: 18, cvk: 'CVK#1', vote: 'Vitaliy Sonechko'},
    {name: 'Volodymyr Minchenko', age: 21, cvk: 'CVK#1', vote: 'Ivan Moroz'},
    {name: 'Dima Mihno', age: 40, cvk: 'CVK#1', vote: 'Ivan Moroz'},
    {name: 'Super SUS', age: 42, cvk: 'CVK#1', vote: 'Vitaliy Sonechko'},
    {name: 'Vladyslav Minaev', age: 20, cvk: 'CVK#1', vote: 'I have another option now...'},
    {name: 'Max Mezhyev', age: 20, cvk: 'CVK#1', vote: 'Ivan Moroz'},
    {name: 'Yehor Malynko', age: 67, cvk: 'CVK#1', vote: 'Ivan Moroz'},
    {name: 'Ivan Bogyn', age: 450, cvk: 'CVK#1', vote: 'Ivan Moroz'},
]

const eVote = (voter, cvk) => {
    const pk = cvk.givePublicKey(voter.name);
    if (pk === 0) {
        statistic.voterWithoutRight++;
        statistic.participants++;
        return 0;
    } else if (pk === 1) {
        statistic.voteAgain++;
        return 0;
    } 

    const sendedBuileten = voter.sendBuileten(pk);

    const gottenBuileten = cvk.getBuileten(sendedBuileten);

    if (gottenBuileten === 3) {
        statistic.voteIncorrectly++;
        statistic.participants++;
        return 0;
    }

    statistic.participants++;
}

const eVoting = () => {
    let CVK1 = new CVK("CVK#1");
    let voters = []

    potentialVoters.map((potent) => {
        voters.push(new Voter(potent.name, potent.age, potent.cvk, potent.vote))
    })
    voters.push(new Imposter("Ivan Bogyn", 450, "CVK#1", "Ivan Moroz"))

    voters.map((voter) => eVote(voter, CVK1));
    CVKRes = CVK1.finalResults()

    statistic.noVote = CVKRes.count;
    

    // Дослідження
    try {
        CVK1.listOfVoter();
    } catch (e) {
        console.log("");
}
}

eVoting();

app.get('/test', (req, res) => {

    const data = {
        statistic,
        title: 'test',
        CVKRes
    }
    res.send(data)
})

app.listen(4000, () => {
    console.log('Server started on port 4000')
})