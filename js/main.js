document.addEventListener('DOMContentLoaded', $createAndAppend);
function $createAndAppend() {
  var $select = document.querySelector('select');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://developer.nps.gov/api/v1/thingstodo?parkCode=yell&api_key=iSpPR5udcPCzijjVFDgRMe2hLAfepOt9jbFeGFjX');
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    console.log(xhr.response);
    data.apiData = xhr.response.data;
    // console.log(data.apiData[0].title);
    for (var i = 0; i < xhr.response.data.length; i++) {
      var thingToDo = xhr.response.data[i];
      var $option = document.createElement('option');
      $option.textContent = thingToDo.title;
      $select.appendChild($option);
    }
  });
  xhr.send();
}

// document.querySelector('activity-card-title').textContent =

// var $dropdown = document.querySelector('option');
// $dropdown.addEventListener('change', function() {
//   console.log(event.target.textContent);
// });
var $submit = document.querySelector('form');
$submit.addEventListener('submit', function (e) {
  e.preventDefault();
  // console.log('submitted console');
  // console.log(document.forms[0].elements.activities.value);
  // console.log(data.apiData[0].title);

  for (var i = 0; i < data.apiData.length; i++) {
    if (data.apiData[i].title === document.forms[0].elements.activities.value) {
      // console.log('match', data.apiData[i]);
      data.viewing = data.apiData[i];
      console.log(data.viewing);
      // return;
    };
  }
});
