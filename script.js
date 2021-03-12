const bigList = [];

function compare(a, b) {
    const listA = a.snippet.publishedAt;
    const listB = b.snippet.publishedAt;
    let comparison = 0;
    if (listA > listB) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
}

function unsubToAll() {
    let hNode = document.createElement("h1");
    let textNode = document.createTextNode("You are now unsubscribed to all the channels.");
    hNode.append.className = "unsubText";
    hNode.appendChild(textNode);

    document.getElementsByTagName("BODY")[0].appendChild(hNode);
    console.log("unsub click");
    for (let i = 0; i < bigList.length; i++) {
        deleteAllSubs(bigList[i].id);
    }
}

function showOnScreen() {
    let heroDiv = document.getElementsByClassName("heroMenu");
    heroDiv[0].remove();
    // append to html

    for (let i = 0; i < bigList.length; i++) {
        let subscribedAtDate = new Date(bigList[i].snippet.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });


        let aNode = document.createElement("a");
        aNode.href = ("https://youtube.com/channel/" + bigList[i].snippet.resourceId.channelId);
        aNode.target = "_blank";
        let liNode = document.createElement("li");
        liNode.id = bigList[i].id;
        let pNodeOne = document.createElement("p");
        pNodeOne.className = "youtuberName";
        let pNodeTwo = document.createElement("p");
        let channelNameNode = document.createTextNode(bigList[i].snippet.title);
        let subscribedAtNode = document.createTextNode(subscribedAtDate);
        let img = new Image();
        img.src = bigList[i].snippet.thumbnails.medium.url;

        aNode.appendChild(img);
        pNodeOne.appendChild(channelNameNode);
        pNodeTwo.appendChild(subscribedAtNode);

        aNode.appendChild(pNodeOne);
        liNode.appendChild(aNode);
        liNode.appendChild(pNodeTwo);
        document.getElementById("list").appendChild(liNode);
    }
}

/**
 * Sample JavaScript code for youtube.subscriptions.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
        .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}

function loadClient() {
    gapi.client.setApiKey("apikey");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(nextPageT) {
    return gapi.client.youtube.subscriptions.list({
            "part": "snippet, id",
            "maxResults": 50,
            "mine": true,
            "pageToken": nextPageT
        })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                let nextPage = response.result.nextPageToken;
                let list = response.result.items;
                // console.log("Response", response);
                for (let i = 0; i < list.length; i++) {
                    // append to array
                    bigList.push(list[i]);
                }
                if (nextPage) {
                    execute(nextPage);
                }
                // done loading all pages
                else {
                    // sorting the list
                    bigList.sort(compare);
                    console.log("sorted: ", bigList)
                    showOnScreen();
                }
            },
            function(err) {
                console.error("Execute error", err);
            });
}
gapi.load("client:auth2", function() {
    gapi.auth2.init({
        client_id: "client_id"
    });
});

function testFunctie(buttonElement) {
    for (let i = 0; i < bigList.length; i++) {
        if (bigList[i].id === buttonElement.parentNode.id) {
            bigList.splice(i, 1);
            break;
        }
    }
    console.log(bigList);
    buttonElement.parentNode.remove(buttonElement.parentNode);
}