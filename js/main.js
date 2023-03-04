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
    // document.querySelector('.my-activities-view').className = 'container my-activities-view hide';
    document.querySelector('.home-button').className = 'home-button hide';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    data.view = 'home-view';
  } if (viewName === 'selected-activity-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    data.view = 'selected-activity-view';
  } if (viewName === 'my-activities-view') {
    // document.querySelector('.my-activities-view').className = 'container my-activities-view';
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.unordered-list').className = 'unordered-list';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.my-activities-button').className = 'my-activities-button hide';
    data.view = 'my-activities-view';
  }
}

// "MY ACTIVITIES" BUTTON
if (data.view === 'my-activities-view') {
  $viewSwap('my-activities-view');
}

var $myActivitiesButton = document.querySelector('.my-activities-button');
$myActivitiesButton.addEventListener('click', goToMyActivities);
function goToMyActivities() {
  $viewSwap('my-activities-view');
  if (data.savedActivities === []) {
    document.querySelector('.nothing-saved').className = 'nothing-saved';
  } else {
    for (var i = 0; i < data.savedActivities.length; i++) {
      $renderSavedActivities(data.savedActivities[i]);
    }
  }
}

// "HOME" BUTTON
var $homeButton = document.querySelector('.home-button');
$homeButton.addEventListener('click', goToHome);
function goToHome() {
  $viewSwap('home-view');
}

// if (data.savedActivities.length === 0) {
//   document.querySelector('.nothing-saved').className = 'nothing-saved';
// }

var $addActivityButton = document.querySelector('.add-entry-button');
$addActivityButton.addEventListener('click', $addEntryAndGoTo);
function $addEntryAndGoTo(e) {
  // console.log(data.viewing);
  // console.log(data.nextSavedActivityId);
  data.viewing.savedActivityId = data.nextSavedActivityId;
  console.log(data.viewing.savedActivityId);
  data.nextSavedActivityId += 1;
  console.log(data.viewing.savedActivityId);
  data.savedActivities.unshift(data.viewing);
  console.log(data.savedActivities);
  document.querySelector('.my-activities-button').setAttribute('class', 'my-activities-button hide');
  $viewSwap('my-activities-view');
  // $renderSavedActivities();
  for (var i = 0; i < data.savedActivities.length; i++) {
    $renderSavedActivities(data.savedActivities[i]);
  }
}

// if (data.view === 'my-activities-view') {
//   $renderSavedActivities();
// }
// data.savedActivities[0]
// $viewSwap('my-activities-view');

console.log('data.savedActivities are', data.savedActivities);
console.log('data view is', data.view);
// $renderSavedActivities(data.savedActivities[2]);
// savedActivityObject

// var $selectedActivityViewContainer = document.createElement('div');
// $selectedActivityViewContainer.setAttribute('class', 'container my-activities-view');

var $selectedActivity = document.createElement('h1');
$selectedActivity.setAttribute('class', 'selected-activity');
$selectedActivity.textContent = '';

function $renderSavedActivities(savedActivityObject) {
  // // "No Saved Activities Text"
  // var $noActivitiesDiv = document.createElement('div');
  // // $noActivitiesDiv.textContent = 'No activities have been saved.  What are you waiting for?';
  // var $noActivitiesP = document.createElement('p');
  // $noActivitiesP.setAttribute('class', 'nothing-saved'); // keep this redundant code (it's in html) hidden or unlink from here and delete
  // $noActivitiesP.textContent = 'delete these';
  // $noActivitiesDiv.appendChild($noActivitiesP);

  var $myActivitiesContainer = document.createElement('div');
  $myActivitiesContainer.setAttribute('class', 'container my-activities-view');

  var $activityCard = document.createElement('div');
  $activityCard.setAttribute('class', 'activity-card');
  $myActivitiesContainer.appendChild($selectedActivity);
  $myActivitiesContainer.appendChild($activityCard);

  var $image = document.createElement('img');
  $image.setAttribute('src', savedActivityObject.url);
  $activityCard.appendChild($image);

  var $activityCardTextContainer = document.createElement('div');
  $activityCardTextContainer.setAttribute('class', 'activity-card-text-container');
  $activityCard.appendChild($activityCardTextContainer);

  var $activityCardTitle = document.createElement('h2');
  $activityCardTitle.setAttribute('class', 'activity-card-title');
  $activityCardTitle.textContent = savedActivityObject.title;
  $activityCardTextContainer.appendChild($activityCardTitle);

  var $activityCardDescription = document.createElement('p');
  $activityCardDescription.setAttribute('class', 'activity-card-description');
  $activityCardDescription.textContent = savedActivityObject.shortDescription;
  $activityCardTextContainer.appendChild($activityCardDescription);

  // Location Info Category
  var $locationInfoCategoryDiv = document.createElement('div');
  $locationInfoCategoryDiv.setAttribute('class', 'info-category');
  $activityCardTextContainer.appendChild($locationInfoCategoryDiv);

  var $infoCategoryLocationLabel = document.createElement('div');
  $infoCategoryLocationLabel.setAttribute('class', 'info-category-label');
  var $infoCategoryLocationInfo = document.createElement('div');
  $infoCategoryLocationInfo.setAttribute('class', 'location');
  $infoCategoryLocationLabel.textContent = 'Location:  ';
  $infoCategoryLocationInfo.textContent = savedActivityObject.location;
  $locationInfoCategoryDiv.appendChild($infoCategoryLocationLabel);
  $locationInfoCategoryDiv.appendChild($infoCategoryLocationInfo);

  // Duration Info Category
  var $durationInfoCategoryDiv = document.createElement('div');
  $durationInfoCategoryDiv.setAttribute('class', 'info-category');
  $activityCardTextContainer.appendChild($durationInfoCategoryDiv);

  var $infoCategoryDurationLabel = document.createElement('div');
  $infoCategoryDurationLabel.setAttribute('class', 'info-category-label');
  var $infoCategoryDurationInfo = document.createElement('div');
  $infoCategoryDurationInfo.setAttribute('class', 'duration');
  $infoCategoryDurationLabel.textContent = 'Duration:  ';
  $infoCategoryDurationInfo.textContent = savedActivityObject.duration;
  $durationInfoCategoryDiv.appendChild($infoCategoryDurationLabel);
  $durationInfoCategoryDiv.appendChild($infoCategoryDurationInfo);

  // Accessibility Info Category
  var $accessibilityInfoCategoryDiv = document.createElement('div');
  $accessibilityInfoCategoryDiv.setAttribute('class', 'info-category');
  $activityCardTextContainer.appendChild($accessibilityInfoCategoryDiv);

  var $infoCategoryAccessibilityLabel = document.createElement('div');
  $infoCategoryAccessibilityLabel.setAttribute('class', 'info-category-label');
  var $infoCategoryAccessibilityInfo = document.createElement('div');
  $infoCategoryAccessibilityInfo.setAttribute('class', 'accessibility');
  $infoCategoryAccessibilityLabel.textContent = 'Accessibility:  ';
  $infoCategoryAccessibilityInfo.innerHTML = savedActivityObject.accessibilityInformation;
  $accessibilityInfoCategoryDiv.appendChild($infoCategoryAccessibilityLabel);
  $accessibilityInfoCategoryDiv.appendChild($infoCategoryAccessibilityInfo);

  // Fees Info Category
  var $feesInfoCategoryDiv = document.createElement('div');
  $feesInfoCategoryDiv.setAttribute('class', 'info-category info-category-last');
  $activityCardTextContainer.appendChild($feesInfoCategoryDiv);

  var $infoCategoryFeesLabel = document.createElement('div');
  $infoCategoryFeesLabel.setAttribute('class', 'info-category-label');
  var $infoCategoryFeesInfo = document.createElement('div');
  $infoCategoryFeesInfo.setAttribute('class', 'fees');
  $infoCategoryFeesLabel.textContent = 'Fees:  ';
  $infoCategoryFeesInfo.textContent = savedActivityObject.doFeesApply;
  $feesInfoCategoryDiv.appendChild($infoCategoryFeesLabel);
  $feesInfoCategoryDiv.appendChild($infoCategoryFeesInfo);

  // "Remove from my activities" button
  var $removeFromActivitiesButton = document.createElement('a');
  $removeFromActivitiesButton.setAttribute('href', '#');
  $removeFromActivitiesButton.textContent = 'Remove from My Activities';
  $activityCardTextContainer.appendChild($removeFromActivitiesButton);

  // Append to UL element
  var $unorderedList = document.querySelector('.unordered-list');
  // $selectedActivityViewContainer.appendChild($myActivitiesContainer);
  // $selectedActivityViewContainer.appendChild($myActivitiesContainer);
  $unorderedList.appendChild($myActivitiesContainer);

  // return $noActivitiesDiv;
}
console.log('data view is', data.view);

// console.log($renderSavedActivities());

// function renderEntry(entry) {
//   var $entryDomTree = document.createElement('li');
//   $entryDomTree.setAttribute('class', 'entries');
//   $entryDomTree.setAttribute('data-entry-id', entry.entryId);

//   var $entryImage = document.createElement('img');
//   $entryImage.setAttribute('src', entry.url);
//   $entryImage.setAttribute('class', 'column-half');

//   var $entryTitleAndNotesDiv = document.createElement('div');
//   $entryTitleAndNotesDiv.setAttribute('class', 'title-and-notes');

//   var $entryTitleDiv = document.createElement('div');

//   var $entryTitle = document.createElement('h2');
//   $entryTitle.setAttribute('class', 'entry-title');
//   $entryTitle.textContent = entry.title;

//   var $penIcon = document.createElement('i');
//   $penIcon.setAttribute('class', 'fa-solid fa-pen');

//   var $entryNotes = document.createElement('p');
//   $entryNotes.setAttribute('class', 'entry-notes');
//   $entryNotes.textContent = entry.notes;

//   $entryDomTree.appendChild($entryImage);
//   $entryDomTree.appendChild($entryTitleAndNotesDiv);
//   $entryTitleAndNotesDiv.appendChild($entryTitleDiv);
//   $entryTitleDiv.appendChild($entryTitle);
//   $entryTitleDiv.appendChild($penIcon);
//   $entryTitleAndNotesDiv.appendChild($entryNotes);

//   return $entryDomTree;
// }
