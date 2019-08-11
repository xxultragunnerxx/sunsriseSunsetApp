"use strict";

const apikey = "zkn6RGyTDlLGsN8i8RfEmURf2GozTAkL"
const sunriseURL = "https://api.sunrise-sunset.org/json"
const mapquestURL = "https://www.mapquestapi.com/geocoding/v1/address"
const staticMapURL = "https://www.mapquestapi.com/staticmap/v5/map?"
const mapquestLatLong = {};
let userDateSelected = 0;
let mapquestLat = 0
let mapquestLng = 0

//makes call to the mapquest static map api
function getStaticMap(userLocation) {
  const staticMapParams = {
    "key": apikey,
    "center": userLocation,
    "locations": userLocation,
    "size": "170,170"
  }
  const formattedStaticMapParams = formatUserParamsQuery(staticMapParams);
  const staticMapRequestURL = staticMapURL + formattedStaticMapParams



  fetch(staticMapRequestURL)
    .then(response => {
      if (response.ok) {
        return response;
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      drawMap(responseJson.url);
    })
    .catch(err => {
      $('.search-results').text('Something went wrong')
    });
}

//builds object data for mapquest api and fetches lattitude and longitude from JSON and stores the values in mapquestLatLong
function getUserMapquestInfo(location) {
  const mapquestInfo = {
    "key": apikey,
    "location": location
  }

  const mapquestQueryInfo = formatUserParamsQuery(mapquestInfo);
  const mapquestSearchURL = mapquestURL + '?' + mapquestQueryInfo;

  fetch(mapquestSearchURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      mapquestLat = `${responseJson.results[0].locations[0].latLng.lat}`
      mapquestLng = `${responseJson.results[0].locations[0].latLng.lng}`
      sunriseQuery(mapquestLat, mapquestLng, userDateSelected);
    })
    .catch(err => {
      $('.search-results').txt(`${err.message}`)
    });

}

//makes the call to the sunrise api
function sunriseQuery(mapquestLat, mapquestLng, userDateSelected) {
  const sunriseParams = {
    "lat": mapquestLat,
    'lng': mapquestLng,
    "date": userDateSelected
  }

  const sunriseQueryInfo = formatUserParamsQuery(sunriseParams);
  const completedSunriseURL = sunriseURL + '?' + sunriseQueryInfo;

  fetch(completedSunriseURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      sunriseResultsData(responseJson);
    })
    .catch(err => {
      $('.search-results').txt('Something went wrong')
    });
}

//formats data for params for api query
function formatUserParamsQuery(mapquestObjectData) {
  const mapquestQueryItems = Object.keys(mapquestObjectData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapquestObjectData[key])}`)
  return mapquestQueryItems.join('&');
}


//the results
function sunriseResultsData(responseJSON) {
  const newDate = Object.keys(responseJSON.results).map(key => `${new Date(`${userDateSelected.replace(/-/g, '/')} ${responseJSON.results[key]} UTC`)}`).map(string => string.slice(0, 24)).map(string => string.concat(` Local Time`))
  $('.search-results').append(
    `<div id="sunriseTime"><span>Sunrise: ${newDate[0]}<br>
  Sunset Time: ${newDate[1]}<br>
  Solar Noon: ${newDate[2]}</span></div>
  <div id="civilTime"><span>Civil Twilight Begin: ${newDate[4]}<br>
  Civil Twilight End: ${newDate[5]}</span></div>
  <div id="nauticalTime"><span>Nautical Twilight Begin: ${newDate[6]}<br>
  Nautical Twilight End: ${newDate[7]}</span></div>
  <div id="astronomicalTime"><span>Astronomical Twilight Begin: ${newDate[8]}<br>
  Astronomical Twilight End: ${newDate[9]}</span></div>`).hide().fadeIn(1000)
  //$('#sunriseTime, #civilTime, #nauticalTime, #astronomicalTime').fadeIn(1000);
}


//to draw map
function drawMap(responseJson) {
  $('.map').empty()
  return $('.map').fadeIn(1000).append(`<img class="mapImg" src="${responseJson}" alt="picture of location">`).hide().fadeIn(1000);
}


//sets up event listeners
function main() {
  $('form').on('submit', function (event) {
    event.preventDefault();
    let userLocation = $('#user-input-location').val();
    userDateSelected = $('#user-input-date').val();
    getUserMapquestInfo(userLocation);
    getStaticMap(userLocation);
    $('h1, fieldset, .tribute-text, .intro-text').fadeOut(250)
    $('#reset, #results-header').fadeIn(1000).css('display', 'block');
    return userDateSelected;
  })
}

$(main);

//takes user back to start
function reset() {
  $('.reset').on('click', '#reset', function () {
    $('#sunriseTime, #civilTime, #nauticalTime, #astronomicalTime, .mapImg, .results-header').remove();
    //$('#sunriseTime, #civilTime, #nauticalTime, #astronomicalTime, .mapImg, .results-header').remove();
    $('h1, fieldset').fadeIn(1000);
    //$('h1, fieldset').css('display','block');
    //$('#reset',).fadeOut(250);
    $('#reset').css('display', 'none');
    //$('#results-header').fadeOut(250);
    $('#results-header').css('display', 'none');
    $('.tribute-text, .intro-text').fadeIn(1000)
  })
}
$(reset);
