function get(url, response) {
    var xhttp = new XMLHttpRequest();
    var method = 'GET';
    var urls = 'https://api.github.com/' + url;
    var asynchronous = true;

    xhttp.open(method, urls, asynchronous);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 409)) {
            var data = JSON.parse(this.responseText);
            response(data);
        }
    };
    xhttp.send();
}

function getUserRepos(user, callback) {
    var url = "users/" + user + "/repos";
    get(url, function(data){
        callback(data);
    });
}

function getUserCommitsFromRepo(user, repo, callback) {
    var url = "repos/"+ user +"/"+ repo +"/commits?per_page=100&author=" + user;
    get(url, function(data){
        callback(data);
    });
}


function countUserCommits(user, callback) {
    var commits = 0;
    var responses = 0;
    getUserRepos(user, function(data){
        var reposLength = data.length;
        console.log(data);
        for(var i = 0; i < reposLength; i++) {
            getUserCommitsFromRepo(user, data[i].name, function(data){
                responses++;
                console.log(data);
                commits += (data.length ? data.length : 0);
                if(responses == reposLength) {
                    callback(commits);
                } 
            });
        }
    });
}

function rise(from, to, output) {
    if(from >= to) return;
    var speed = 800/(to - from);
    setTimeout(function(){
        output.innerText = ++from;
        rise(from, to, output);
    }, speed);
}

var confirm = document.getElementById("count-confirm");
var input = document.getElementById("user-input");
var output = document.getElementById("commit-output");

confirm.addEventListener("click", function(){
    if(!input.value.length) {
        output.innerText = "Podaj nazwę !";
    } else {
    countUserCommits(input.value, function(data){
        console.log(data);
        rise(0, data, output);
    });
    }
});