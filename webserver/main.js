let selected_server = ""
let buffers = {}

function Display(text) {
    let display = document.getElementById("display");
    let html_Text = "";
    //if any \n in text , change to <br/>
    let lines = text.split("\\n")
    console.log(lines)
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (line.length > 0) {
            html_Text += line + "<br/>"
        }
    }
    display.innerHTML += `<code class="server_text">${html_Text}</code>`;
}

addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        command = document.getElementById('command').value;
        if (selected_server == "") {
            alert("Choose a server!");
        }
        fetch('/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: command,
                ip: selected_server
            })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            buffers[selected_server] = data.result
            //for each line in the buffer, display it
            Display(`${command}: <br/>`)
            buffers[selected_server].split("\n").forEach(function (line) {
                Display(line + "\n")
            })
            
        });
       

    }
});



fetch('/servers').then(function (response) {
    return response.json();
}).then(function (data) {
    let servers_tab = document.getElementById('servers');
    for (let i = 0; i < data.length; i++) {
        servers_tab.innerHTML += '<div class="server_tab" id="server_tab_' + i + '"class="ip">' + data[i].ip + '</div>';        
    }

    for (let i = 0; i < data.length; i++) {
        let server_tab = document.getElementById('server_tab_' + i);
        server_tab.addEventListener('click', function () {
            //make it selected using this class server_tab_selected
            let selected_server_tab = document.getElementsByClassName('server_tab_selected');
            if (selected_server_tab.length > 0) {
                selected_server_tab[0].classList.remove('server_tab_selected');
            }
            server_tab.classList.add('server_tab_selected');
            selected_server = data[i].ip;
            
            
        });
    }                
});
