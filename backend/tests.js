const fetch = require("node-fetch");
var obj;
async function f(o) {
    o = await fetch('http://localhost:3000/posts?title=sasa')
        .then(function (response) {
            return response.json();
        })

    
    console.log(o);
    ////////////////// POST /////////////////
    // var url = 'http://localhost:3000/posts';
    // var data = {};
    // data.title = "safgfgfgfgfgfgfsa";
    
    // fetch(url, {
    //     method: 'POST', // or 'PUT'
    //     body: JSON.stringify(data), // data can be `string` or {object}!
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then(res => res.json())
    // .then(response => console.log('Success:', JSON.stringify(response)))
    // .catch(error => console.error('Error:', error));


}
f(obj);





