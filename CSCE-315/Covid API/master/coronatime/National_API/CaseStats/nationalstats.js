const app = document.getElementById('Cases');

const container = document.createElement('div');
container.setAttribute('id', 'container');

app.appendChild(container);


var request = new XMLHttpRequest();
request.open('GET', 'https://covid19-server.chrismichael.now.sh/api/v1/CasesInAllUSStates', true);

request.onload = function () {
  document.write("test");
  // Begin accessing JSON data here
  var req = JSON.parse(this.response);
  
  if (request.status >= 200 && request.status < 400) {
    // document.write(req.data[0].table[2].USAState);
    for(var i = 0; i < 51; ++i) {
     
      const card = document.createElement('div');
      card.setAttribute('id', 'card');
      
      const h1 = document.createElement('h1');
      h1.textContent = req.data[0].table[i].USAState;
      
      const p = document.createElement('p');
      req.data[0].table[i].TotalCases = req.data[0].table[i].TotalCases.substring(0, 300);
      req.data[0].table[i].TotalDeaths = req.data[0].table[i].TotalDeaths.substring(0, 300);
      //p.textContent = `${req.data[0].table[i].TotalCases}...`;
      p.textContent = 'Total Cases: ' + req.data[0].table[i].TotalCases + 
      '\n Total Deaths: ' + req.data[0].table[i].TotalDeaths;


      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
    }
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();