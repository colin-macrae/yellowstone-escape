/* exported data */
var data = {
  savedActivities: [],
  nextSavedActivityId: 1,
  editing: [],
  apiData: {},
  viewing: null,
  view: 'home-view'
};

window.addEventListener('beforeunload', toJSON);
function toJSON(e) {
  var dataStringifiedJson = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataStringifiedJson);
}

if (localStorage.getItem('javascript-local-storage')) {
  var jsonParsedFromStorage = localStorage.getItem('javascript-local-storage');
  data = JSON.parse(jsonParsedFromStorage);
}
