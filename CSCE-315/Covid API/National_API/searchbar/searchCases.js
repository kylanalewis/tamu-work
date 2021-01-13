var findkey; //  Returned county name from html form ( to give to API )

function returnGuess(){ // Get User Submitted  Name
  var guess = document.forms["form"]["county"].value;
  doAsearch(guess);
  
}

function doAsearch(guess) {

  const app = document.getElementById('CountyCases');
  findkey = guess;
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

}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
   
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        
        this.parentNode.appendChild(a);
        
        for (i = 0; i < arr.length; i++) {
          
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            
            b = document.createElement("DIV");
            
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            
            b.addEventListener("click", function(e) {
                
                inp.value = this.getElementsByTagName("input")[0].value;
                
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          
          currentFocus++;
          
          addActive(x);
        } else if (e.keyCode == 38) { 
          currentFocus--;
          
          addActive(x);
        } else if (e.keyCode == 13) {
          
          e.preventDefault();
          if (currentFocus > -1) {
            
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      
      if (!x) return false;
      
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
  /*An array containing all the county names in Texas:*/
  var counties = ["Anderson",
  "Andrews",
  "Angelina",
  "Aransas",
  "Archer",
  "Armstrong",
  "Atascosa",
  "Austin",
  "Bailey",
  "Bandera",
  "Bastrop",
  "Baylor",
  "Bee",
  "Bell",
  "Bexar",
  "Blanco",
  "Borden",
  "Bosque",
  "Bowie",
  "Brazoria",
  "Brazos",
  "Brewster",
  "Briscoe",
  "Brooks",
  "Brown",
  "Burleson",
  "Burnet",
  "Caldwell",
  "Calhoun",
  "Callahan",
  "Cameron",
  "Camp",
  "Carson",
  "Cass",
  "Castro",
  "Chambers",
  "Cherokee",
  "Childress",
  "Clay",
  "Cochran",
  "Coke",
  "Coleman",
  "Collin",
  "Collingsworth",
  "Colorado",
  "Comal",
  "Comanche",
  "Concho",
  "Cooke",
  "Coryell",
  "Cottle",
  "Crane",
  "Crockett",
  "Crosby",
  "Culberson",
  "Dallam",
  "Dallas",
  "Dawson",
  "Deaf Smith",
  "Delta",
  "Denton",
  "DeWitt",
  "Dickens",
  "Dimmit",
  "Donley",
  "Duval",
  "Eastland",
  "Ector",
  "Edwards",
  "El Paso",
  "Ellis",
  "Erath",
  "Falls",
  "Fannin",
  "Fayette",
  "Fisher",
  "Floyd",
  "Foard",
  "Fort Bend",
  "Franklin",
  "Freestone",
  "Frio",
  "Gaines",
  "Galveston",
  "Garza",
  "Gillespie",
  "Glasscock",
  "Goliad",
  "Gonzales",
  "Gray",
  "Grayson",
  "Gregg",
  "Grimes",
  "Guadalupe",
  "Hale",
  "Hall",
  "Hamilton",
  "Hansford",
  "Hardeman",
  "Hardin",
  "Harris",
  "Harrison",
  "Hartley",
  "Haskell",
  "Hays",
  "Hemphill",
  "Henderson",
  "Hidalgo",
  "Hill",
  "Hockley",
  "Hood",
  "Hopkins",
  "Houston",
  "Howard",
  "Hudspeth",
  "Hunt",
  "Hutchinson",
  "Irion",
  "Jack",
  "Jackson",
  "Jasper",
  "Jeff Davis",
  "Jefferson",
  "Jim Hogg",
  "Jim Wells",
  "Johnson",
  "Jones",
  "Karnes",
  "Kaufman",
  "Kendall",
  "Kenedy",
  "Kent",
  "Kerr",
  "Kimble",
  "King",
  "Kinney",
  "Kleberg",
  "Knox",
  "La Salle",
  "Lamar",
  "Lamb",
  "Lampasas",
  "Lavaca",
  "Lee",
  "Leon",
  "Liberty",
  "Limestone",
  "Lipscomb",
  "Live Oak",
  "Llano",
  "Loving",
  "Lubbock",
  "Lynn",
  "Madison",
  "Marion",
  "Martin",
  "Mason",
  "Matagorda",
  "Maverick",
  "McCulloch",
  "McLennan",
  "McMullen",
  "Medina",
  "Menard",
  "Midland",
  "Milam",
  "Mills",
  "Mitchell",
  "Montague",
  "Montgomery",
  "Moore",
  "Morris",
  "Motley",
  "Nacogdoches",
  "Navarro",
  "Newton",
  "Nolan",
  "Nueces",
  "Ochiltree",
  "Oldham",
  "Orange",
  "Palo Pinto",
  "Panola",
  "Parker",
  "Parmer",
  "Pecos",
  "Polk",
  "Potter",
  "Presidio",
  "Rains",
  "Randall",
  "Reagan",
  "Real",
  "Red River",
  "Reeves",
  "Refugio",
  "Roberts",
  "Robertson",
  "Rockwall",
  "Runnels",
  "Rusk",
  "Sabine",
  "San Augustine",
  "San Jacinto",
  "San Patricio",
  "San Saba",
  "Schleicher",
  "Scurry",
  "Shackelford",
  "Shelby",
  "Sherman",
  "Smith",
  "Somervell",
  "Starr",
  "Stephens",
  "Sterling",
  "Stonewall",
  "Sutton",
  "Swisher",
  "Tarrant",
  "Taylor",
  "Terrell",
  "Terry",
  "Throckmorton",
  "Titus",
  "Tom Green",
  "Travis",
  "Trinity",
  "Tyler",
  "Upshur",
  "Upton",
  "Uvalde",
  "Val Verde",
  "Van Zandt",
  "Victoria",
  "Walker",
  "Waller",
  "Ward",
  "Washington",
  "Webb",
  "Wharton",
  "Wheeler",
  "Wichita",
  "Wilbarger",
  "Willacy",
  "Williamson",
  "Wilson",
  "Winkler",
  "Wise",
  "Wood",
  "Yoakum",
  "Young",
  "Zapata",
  "Zavala "];
  
  autocomplete(document.getElementById("myInput"), counties);

