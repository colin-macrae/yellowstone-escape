document.addEventListener('DOMContentLoaded', $createAndAppend);
function $createAndAppend() {
  var $select = document.querySelector('select');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://developer.nps.gov/api/v1/thingstodo?parkCode=yell&api_key=iSpPR5udcPCzijjVFDgRMe2hLAfepOt9jbFeGFjX');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.data.length; i++) {
      var thingToDo = xhr.response.data[i];
      var $option = document.createElement('option');
      $option.textContent = thingToDo.title;
      $select.appendChild($option);
    }
  });
  xhr.send();
}
