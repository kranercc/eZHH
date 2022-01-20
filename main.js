var express = require("express")
var json = require("body-parser");
const { exec } = require("child_process");
var app = express();

let servers = []
let bkend_servers = []

function read_server_list() {
    let fs = require("fs")
    let data = fs.readFileSync("servers.txt")
    //template: "x.x.x.x:user:pass"
    let lines = data.toString().split("\n")
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (line.length > 0) {
            let parts = line.split(":")
            let ip = parts[0]
            let user = parts[1]
            let pass = parts[2]
            pass = pass.replace(/\r/g, "")
            servers.push({
                ip: ip,
                user: user,
                pass: pass
            })
            bkend_servers[ip] = {
                user: user,
                pass: pass
            }

        }


    }

    return servers
}

read_server_list()
console.log(servers)

//webserver is webserver/index.html
app.use(express.static(__dirname + '/webserver'));


app.get("/servers", function (req, res) {
    res.send(servers)
});


//err http headers sent
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//listen for a json post request
app.post('/command', json(), function (req, res) {
    var command = req.body.command;
    var ip = req.body.ip;

    console.log("executing command: " + command + " on server: " + ip)
    exec("py SSHER.py " + ip + " " + command, function (err, stdout, stderr) {
        if (err) {
            let data = JSON.stringify({result: err})
            res.send(data);
        }
        else {
            //return fron the 2nd caracther forth until the length -1
            let data = JSON.stringify({result: stdout.substring(2, stdout.length - 3)})
            res.send(data);
        }
    });

});

app.listen(80, function () {
    console.log('[+]_[+]');
});


