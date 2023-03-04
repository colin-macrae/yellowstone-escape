/* exported data */
var data = {
  savedActivities: [],
  nextSavedActivityId: 1,
  editing: [],
  apiData: {},
  viewing: {},
  view: 'home-view'
};
// console.log(data);

window.addEventListener('beforeunload', toJSON);
function toJSON(e) {
  var dataStringifiedJson = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataStringifiedJson);
}
// console.log(data.nextSavedActivityId);

if (localStorage.getItem('javascript-local-storage')) {
  var jsonParsedFromStorage = localStorage.getItem('javascript-local-storage');
  data = JSON.parse(jsonParsedFromStorage);
}
// console.log(data.nextSavedActivityId);
