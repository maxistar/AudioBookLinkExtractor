
(function () {
const domain = "" + window.location.hostname + "";

function createAlert(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.width = '100%';
    textarea.style.height = '100%';
    textarea.style.top = '0';
    textarea.style.left = '0';

    const parentDiv = document.createElement('div');
    parentDiv.style.width = '80%';
    parentDiv.style.height = '80%';
    parentDiv.style.top = '10%';
    parentDiv.style.left = '10%';
    parentDiv.style.padding = '2px';
    parentDiv.style.position = 'fixed';
    parentDiv.style.zIndex = '10000';
    parentDiv.style.backgroundColor = 'blue';
    parentDiv.style.backgroundSize = '1px';
    parentDiv.appendChild(textarea);
    document.body.appendChild(parentDiv);
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

if (domain === 'audio-books.club') {
    //const links = "defaultText\ndefaultText\ndefaultText\ndefaultText\n"
    const scripts = [... document.querySelectorAll("script")];
    scripts.forEach((script) => {
        const scriptText = script.text;
        if (scriptText === "") {
            return;
        }
        const start = scriptText.indexOf('Amplitude.init({');
        if (start !== -1) {
            const newScript = scriptText.substr(start + 30);
            const newScript2 = newScript.substr(0, newScript.indexOf('playback_speed: BookSpeedPlayed') - 7);
            const links = eval(newScript2);
            let result = "";
            for (let link of links) {
                result = result + "wget \"" + link.url + "\"\n";
            }
            createAlert(result);
        }
    });
} else if (domain === 'knigorai.com') {
    //var player = new Playerjs({id:"player", title: "Капитан &quot;Единорога&quot;", file:"https://knigorai.com/books/198161/playlist.txt?t=1643911679"});
    const scripts = [... document.querySelectorAll("script")];
    scripts.forEach((script) => {
        const scriptText = script.text;
        if (scriptText === "") {
            return;
        }
        const start = scriptText.indexOf('var player = new Playerjs(');
        if (start !== -1) {
            const newScript = scriptText.substr(start + 26);
            const newScript2 = newScript.substr(0, newScript.indexOf(');'));

            const fileUrl = newScript2.substr(newScript2.indexOf('file:"') + 6);
            const fileUrl2 = fileUrl.substr(0, fileUrl.length - 2);
            const request = new XMLHttpRequest();
            request.open('GET', fileUrl2);
            request.responseType = 'text';

            request.onload = function() {
                //alert(eval(request.response));
                const links = eval(request.response);
                console.log(links);
                let result = "";
                let counter = 1;
                for (let link of links) {
                    const linksParts = link.file.split(" or ");
                    const filename = "".concat(pad(counter++, 5)).concat(".mp3");
                    result = result.concat("wget --output-document=").concat(filename).concat(" \"").concat(linksParts[0]).concat("\"\n");
                }
                console.log(result);
                createAlert(result);
            };

            request.send();
        }
    });
} else if (domain === 'vse-audioknigi.com') {
    const scripts = [... document.querySelectorAll("script")];
    scripts.forEach((script) => {
        const scriptText = script.text;
        if (scriptText === "") {
            return;
        }
        const start = scriptText.indexOf('var player = new Playerjs(');
        if (start !== -1) {
            const newScript = scriptText.substr(start + 26);
            const newScript2 = newScript.substr(0, newScript.indexOf(');'));
            let links = [];
            eval('links = ' + newScript2);

            const request = new XMLHttpRequest();
            request.open('GET', links.file);
            request.responseType = 'text';

            request.onload = function() {
                const links = eval(request.response);
                let result = "";
                let counter = 1;
                for (let link of links) {
                    const linksParts = link.file.split(" or ");
                    result = result.concat("wget ").concat(" --user-agent=\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36\" --referer \"https://vse-audioknigi.com/\" \"").concat(linksParts[0]).concat("\"\n");
                }
                createAlert(result);
            };

            request.send();
        }
    });
} else if (domain === 'baza-knig.ru') {
    let links = []; //the global list already on the page
    eval("links = " + file1);
    let result = "";
    for (let link of links) {
        result = result.concat("wget ").concat(" --user-agent=\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36\" --referer \"https://baza-knig.ru/\" \"").concat(link.file).concat("\"\n");
    }
    createAlert(result);
} else {
    alert("The Domain ".concat(domain).concat(" is not supported!"));
}


})();
