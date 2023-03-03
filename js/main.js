document.addEventListener('DOMContentLoaded', $createAndAppend);
function $createAndAppend() {
  var $select = document.querySelector('select');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://developer.nps.gov/api/v1/thingstodo?parkCode=yell&api_key=iSpPR5udcPCzijjVFDgRMe2hLAfepOt9jbFeGFjX');
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    data.apiData = xhr.response.data;
    for (var i = 0; i < xhr.response.data.length; i++) {
      var thingToDo = xhr.response.data[i];
      var $option = document.createElement('option');
      $option.textContent = thingToDo.title;
      $select.appendChild($option);
    }
  });
  xhr.send();
}

var $submit = document.querySelector('form');
$submit.addEventListener('submit', function (e) {
  e.preventDefault();
  for (var i = 0; i < data.apiData.length; i++) {
    if (data.apiData[i].title === document.forms[0].elements.activities.value) {
      data.viewing = data.apiData[i];
    }
  }
  renderViewingEntry();
  $viewSwap('selected-activity-view');
});

if (data.viewing !== {}) {
  renderViewingEntry();
}

$viewSwap(data.view);

function renderViewingEntry() {
  document.querySelector('.activity-image').src = data.viewing.images[0].url;
  document.querySelector('.activity-image').alt = data.viewing.images[0].alt;

  document.querySelector('.activity-card-title').innerHTML = data.viewing.title;

  document.querySelector('.activity-card-description').innerHTML = data.viewing.shortDescription;

  document.querySelector('.location').innerHTML = data.viewing.locationDescription;

  document.querySelector('.duration').innerHTML = data.viewing.duration;

  document.querySelector('.accessibility').innerHTML = data.viewing.accessibilityInformation;

  document.querySelector('.fees').innerHTML = data.viewing.doFeesApply;
}

function $viewSwap(viewName) {
  if (viewName === 'home-view') {
    document.querySelector('.home-view').className = 'dropdown-container home-view';
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    data.view = 'home-view';
  } if (viewName === 'selected-activity-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.home-button').className = 'home-button';
    data.view = 'selected-activity-view';
  }
}

var $homeButton = document.querySelector('.home-button');
$homeButton.addEventListener('click', goToHome);
function goToHome() {
  $viewSwap('home-view');
  data.viewing = {};
}
