// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector) {
    // Getting a domelement
    this.container = document.querySelector(domSelector);
    // Store my data
    this.data = null;
    // Represents the currently displayed data
    this.viewData = null;

    // Show stuff
    this.render();
    this.addEventListeners();
  }

  modViewData(newData) {
    this.viewData = newData;
    this.render();
  }

  template(music) {
    // Mapping over data and returning HTML String
    // For now we just assume that all data is there and that it is
    // from datatype string
    // TODO: create a template function
    return music
      .map(track => {
        return `
        <div class="row">
          <div><img src="${track.artworkUrl100}"</img></div>
          <div>${track.trackName}</div>
          <div>${track.artistName}</div>
          <div>${track.trackPrice}</div>
        </div>
    `;
      })
      .join("");
  }

  updateData(data) {
    // Store my data
    this.data = data;
    // Represents the currently displayed data
    this.viewData = data;

    this.render();
  }

  defaultTemplate() {
    return `
    <div>Search to see music</div>
    `;
  }
  filterTracks(search) {
    this.filtered = this.data.filter(track =>
      track.artistName.toLowerCase().includes(search.toLowerCase())
    );
    this.modViewData(this.filtered);
  }
  sortArtist(direction) {
    this.sorted = this.data.sort((trackA, trackB) => {
      if (trackA.artistName > trackB.artistName) {
        // hier wird mit direction multipliziert, da dadurch das Vorzeichen des returns geändert wird, und somit auch die Sortierrichtung
        return 1 * direction;
      } else if (trackA.artistName < trackB.artistName) {
        return -1 * direction;
      }
      return 0;
      // funktion ist beendet, wenn etwas returened wird.
    });
    this.modViewData(this.sorted);
  }
  sortByPrice(direction) {
    let sorted = this.data.sort(
      (priceA, priceB) => (priceA.trackPrice - priceB.trackPrice) * direction
      // funktion ist beendet, wenn etwas returened wird.
    );
    this.modViewData(sorted);
  }
  addEventListeners() {
    // Add event listener for filter input
    document.querySelector("#filter-input").addEventListener("keyup", event => {
      this.filterTracks(event.target.value);
    });
    // "input " reagiert auch auf "select"-Tags
    document.querySelector("select").addEventListener("input", event => {
      switch (event.target.value) {
        case "ArtistDescending":
          this.sortArtist(-1);
          break;
        case "ArtistAscending":
          this.sortArtist(1);
          break;
        case "PriceAscending":
          this.sortByPrice(1);
          break;
        case "PriceDescending":
          this.sortByPrice(-1);
          break;
        default:
          this.modViewData(this.data);
        // wird eine Optin ausgewählt, die keinem der cases entspricht, wird als default die oririginal-Sortierung aus this.data übernommen.
      }
      //
    });
  }
  render() {
    // Out put will hold the complete view
    let output = "";

    // Setting up data for our view
    const header = `<h1>My Tracks</h1>`;
    // template methode accepts data to view and returns html string
    const template = this.viewData
      ? this.template(this.viewData)
      : this.defaultTemplate();
    // Adding data in to our view !Order Matters!
    output += header;
    output += "<p>Data from iTunes</p>";
    output += template;
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output;
  }
  doOnSearch() {
    let search = document.querySelector("#search-input").value;
    const url = `https://dci-fbw12-search-itunes.now.sh/?term=${search}`;
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "json";
    req.onload = function() {
      var jsonResponse = req.response;
      console.log(jsonResponse.results);
      myTrackList.updateData(jsonResponse.results);
      // do something with jsonResponse
    };
    req.send(null);
  }
}
const myTrackList = new TrackList("#tracks");

// input changes

// const search = this.container = document.querySelector("domSelector")
// var search = "jack johnson"
//
// Add event listener for artist input
document.querySelector("#searchNow").addEventListener("click", event => {
  myTrackList.doOnSearch();
});
document
  .querySelector("#search-input")
  .addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    console.log(key);
    if (key === 13) {
      // 13 is enter
      // code for enter
      myTrackList.doOnSearch();
    }
  });
