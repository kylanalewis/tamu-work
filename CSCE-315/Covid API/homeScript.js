const app = document.getElementById('homeScript');

const container = document.createElement('div');
container.setAttribute('id', 'container');

app.appendChild(container);

var request = new XMLHttpRequest();
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    data.forEach(covid => {
      const card = document.createElement('div');
      card.setAttribute('id', 'card');

      const h1 = document.createElement('h1');
      h1.textContent = covid.state;

      const p = document.createElement('p');
      covid.confirmed = covid.confirmed.substring(0, 300);
      p.textContent = `${covid.confirmed}`;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
    });
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();
