import express from 'express'
import { spawn } from 'child_process'
import { v1 } from 'uuid'
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api', (req, res) => {
    res.send("Hello, world!")
})

app.post('/', (req, res) => {
    const uuid = v1()
    const genObj = spawn('java', [
        `-jar`,
        `./jmc2obj.jar`,
        `../mc/${req.query.world}`,
        `--area=${req.query.minx},${req.query.minz},${req.query.maxx},${req.query.maxz}`,
        `--objfile=../htdocs/navis/${uuid}.obj`,
        `--mtlfile=../htdocs/navis/${uuid}.mtl`,
        `--optimize-geometry`,
        `--remove-dup`,
    ]).on('exit', () => {
        res.json({
            id: uuid
        })
    })
    genObj.stdout.on('data', c => console.log(c.toString()))
    genObj.stderr.on('data', c => console.log(c.toString()))
})

app.listen(4000, () => {
    console.log("Start!")
})