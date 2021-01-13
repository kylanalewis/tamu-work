const app = document.getElementById('CountyCases');
  findkey = "Brazos";
  const container = document.createElement('div');
  container.setAttribute('id', 'container');

  app.appendChild(container);

  // Data provided from John Hopkins
  
  var request = new XMLHttpRequest();
  request.open('GET', 'https://covid19-server.chrismichael.now.sh/api/v1/JohnsHopkinsDataDailyReport', true);
  
  request.onload = function () {

    var req = JSON.parse(this.response);
    
  if (request.status >= 200 && request.status < 400) {


    var results = [];
    var searchField = "Combined_Key";
    var searchVal =  findkey + ", Texas, US";
    for (var i=0 ; i < req.data.table.length ; i++)
    {
        if (req.data.table[i][searchField] == searchVal) {
            results.push(req.data.table[i]); // [Object object]
        }
    }   console.log(results);
        // document.write(results[0].Province_State); //Texas

        const card = document.createElement('div');
        card.setAttribute('id', 'card');
        
        const h1 = document.createElement('h1');
        h1.textContent = results[0].Combined_Key;
        
        const p = document.createElement('p');
        // results[0].Combined_Key = req.data.table[i].Combined_Key.substring(0, 300);
        results[0].Active = results[0].Active.substring(0, 300);
        results[0].Recovered = results[0].Recovered.substring(0, 300);
        results[0].Deaths = results[0].Deaths.substring(0, 300);
        
        p.textContent =  
        'Last Updated: ' + results[0].Last_Update +
        '\n Confirmed: ' + results[0].Confirmed +
        '\n Recovered: ' + results[0].Recovered + 
        '\n Active Cases: ' + results[0].Active + 
        '\n Deaths: ' + results[0].Deaths;
  
        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(p);
      




    }
  }
request.send();
