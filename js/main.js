if (data.viewing !== null) {
  renderViewingEntry();
}
$viewSwap(data.view);
document.addEventListener('DOMContentLoaded', $createAndAppend);

// API REQUESTS
var targetUrl = encodeURIComponent('https://developer.nps.gov/api/v1/thingstodo?parkCode=yell&api_key=iSpPR5udcPCzijjVFDgRMe2hLAfepOt9jbFeGFjX');

function $createAndAppend() {
  var $select = document.querySelector('select');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
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

// VIEW AN ACTIVITY BUTTON ('GO' BUTTON)
var $submit = document.querySelector('form');
$submit.addEventListener('submit', function (e) {
  for (var i = 0; i < data.apiData.length; i++) {
    if (data.apiData[i].title === document.forms[0].elements.activities.value) {
      data.viewing = data.apiData[i];
    }
  }
  renderViewingEntry();
  $viewSwap('selected-activity-view');
});

// FUNCTION FOR 'GO' BUTTON, FOR RENDERING ENTRY
function renderViewingEntry() {
  document.querySelector('.activity-image').src = data.viewing.images[0].url;
  document.querySelector('.activity-image').alt = data.viewing.images[0].alt;
  document.querySelector('.activity-card-title').innerHTML = data.viewing.title;
  document.querySelector('.activity-card-description').innerHTML = data.viewing.shortDescription;
  document.querySelector('.location').innerHTML = data.viewing.locationDescription;
  document.querySelector('.duration').innerHTML = data.viewing.duration;
  document.querySelector('.accessibility').innerHTML = data.viewing.accessibilityInformation;
  document.querySelector('.fees').innerHTML = data.viewing.doFeesApply;
  if (data.viewing.doFeesApply === 'false') {
    data.viewing.doFeesApply = 'No fees';
  }
}

// SWAPPING SCREEN VIEWS
function $viewSwap(viewName) {
  if (viewName === 'home-view') {
    document.querySelector('.home-view').className = 'dropdown-container home-view';
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    document.querySelector('.home-button').className = 'home-button hide';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    document.querySelector('.nothing-saved').className = 'nothing-saved hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label hide';
    data.view = 'home-view';
  } if (viewName === 'selected-activity-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label hide';
    data.view = 'selected-activity-view';
    document.querySelector('.nothing-saved').className = 'nothing-saved hide';
  } if (viewName === 'my-activities-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.unordered-list').className = 'unordered-list';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.my-activities-button').className = 'my-activities-button hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label';
    data.view = 'my-activities-view';
    if (data.savedActivities.length === 0) {
      document.querySelector('.nothing-saved').className = 'nothing-saved';
    }
  }
}

// "HOME" BUTTON
var $homeButton = document.querySelector('.home-button');
$homeButton.addEventListener('click', goToHome);
function goToHome() {
  $viewSwap('home-view');
}

// ADD ACTIVITY TO MY ACTIVITIES BUTTON
var $addActivityButton = document.querySelector('.add-entry-button');
$addActivityButton.addEventListener('click', $addEntryAndGoTo);
function $addEntryAndGoTo(e) {
  data.viewing.savedActivityId = data.nextSavedActivityId;
  data.nextSavedActivityId += 1;
  data.savedActivities.unshift(data.viewing);
  document.querySelector('.my-activities-button').setAttribute('class', 'my-activities-button hide');
  for (var i = 0; i < data.savedActivities.length; i++) {
    $renderSavedActivities(data.savedActivities[i]);
  }
  // location.reload();
  data.viewing = null;
  $viewSwap('my-activities-view');
}

// how can you copy that savedActivityId and put it on an attribute of each saved entry? not only on the object?
// ANSWER:
// create an attribute on the dom which will be on each entry (on a button is fine), data-saved-activity-id="", for example
// in the $addActivityButton handler, set the attribute value to that value
// now, use this to access that value when the button is clicked (getAttribute or sth), and find the object with that id for editing

// VIEW "MY ACTIVITIES" BUTTON
// if (data.view === 'my-activities-view') {
//   $viewSwap('my-activities-view');
// }

var $myActivitiesButton = document.querySelector('.my-activities-button');
$myActivitiesButton.addEventListener('click', goToMyActivities);
function goToMyActivities(e) {
  if (data.savedActivities === []) {
    document.querySelector('.nothing-saved').className = 'nothing-saved';
  } else {
    for (var i = 0; i < data.savedActivities.length; i++) {
      $renderSavedActivities(data.savedActivities[i]);
    }
  }
  $viewSwap('my-activities-view');
}

var $selectedActivity = document.createElement('h1');
$selectedActivity.setAttribute('class', 'selected-activity');
$selectedActivity.textContent = '';

function $renderSavedActivities(savedActivityObject) {

  var $myActivitiesContainer = document.createElement('div');
  $myActivitiesContainer.setAttribute('class', 'container my-activities-view');

  var $activityCard = document.createElement('div');
  $activityCard.setAttribute('class', 'activity-card');
  $myActivitiesContainer.appendChild($selectedActivity);
  $myActivitiesContainer.appendChild($activityCard);

  var $image = document.createElement('img');
  $image.setAttribute('src', 'https://www.nps.gov/common/uploads/cropped_image/44AEEA15-1DD8-B71B-0BA7357E1BA0E948.jpg');
  $image.setAttribute('alt', 'Photo of yellowstone activity site');

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
  if ($infoCategoryFeesInfo.textContent === 'false') {
    $infoCategoryFeesInfo.textContent = 'No fees';
  }
  $feesInfoCategoryDiv.appendChild($infoCategoryFeesLabel);
  $feesInfoCategoryDiv.appendChild($infoCategoryFeesInfo);

  // "my notes" section
  var $myNotesFormContainer = document.createElement('div');
  $myNotesFormContainer.setAttribute('class', 'my-notes-form-container');
  $activityCardTextContainer.appendChild($myNotesFormContainer);

  var $myNotesForm = document.createElement('div');
  $myNotesForm.setAttribute('class', 'my-notes-form');
  $myNotesForm.setAttribute('name', 'mynotesformname');
  $myNotesFormContainer.appendChild($myNotesForm);

  var $notesTextboxLabel = document.createElement('div');
  // $notesTextboxLabel.setAttribute('for', 'notes-textbox');
  $notesTextboxLabel.setAttribute('class', 'notes-textbox-label');
  $notesTextboxLabel.textContent = 'My notes';
  $myNotesForm.appendChild($notesTextboxLabel);

  var $notesTextbox = document.createElement('div');
  $notesTextbox.setAttribute('class', 'notes-textbox');
  $myNotesForm.appendChild($notesTextbox);

  var $notesSaveButtonDiv = document.createElement('div');
  $notesSaveButtonDiv.setAttribute('class', 'notes-save-div');
  $myNotesForm.appendChild($notesSaveButtonDiv);

  var $notesSaveButton = document.createElement('button');
  $notesSaveButton.setAttribute('class', 'notes-save-button notes-write-edit-button');
  // $notesSaveButton.setAttribute('data-saved-activity-id', data.savedActivities);
  $notesSaveButton.textContent = 'Write/Edit notes';
  $notesSaveButtonDiv.appendChild($notesSaveButton);

  // "Remove from my activities" button
  var $removeFromActivitiesButton = document.createElement('a');
  $removeFromActivitiesButton.setAttribute('href', '#');
  $removeFromActivitiesButton.textContent = 'Remove from My Activities';
  $activityCardTextContainer.appendChild($removeFromActivitiesButton);

  // Append to UL element
  var $unorderedList = document.querySelector('.unordered-list');
  $unorderedList.appendChild($myActivitiesContainer);
}

// right now, when viewing 'my activities' after adding a new one, OR clicking 'my activities', it takes you there, no problem, and all correct entries show up. however, if the screen is refreshed, they disappear, UNLESS i have the below function on (so it renders when page loads).  BUT, then when you click on 'my entries', all entries are duplicated.  so neither of above works perfectly.  leaving it the way it is for now in order to move on
// for (var i = 0; i < data.savedActivities.length; i++) {
//   $renderSavedActivities(data.savedActivities[i]);
// }
// console.log(data.savedActivities);

// "Write/Edit notes" BUTTON

var $editButton = document.querySelector('.unordered-list');
$editButton.addEventListener('click', $editButtonFunction);
function $editButtonFunction(e) {
  if (e.target.tagName === 'BUTTON') {
    // console.log('edit button clicked');
    // console.log(e.target.closest('button').getAttribute('data-saved-activity-id'));
    // var editButtonClosestTitle = e.target.closest('h2');
    // // console.log(editButtonClosestTitle);
    // console.log(e.target.closest('h2').textContent);
    var closestDiv = e.target.closest('ul > div > div > div');
    console.log('closestDiv\'s text content', '(or entry title):', closestDiv.childNodes[0].textContent);
    // console.log('e', e.target.closest('ul > div > div > div > h2'));
  }

  // var editButtonClosestTitle = e.target.closest('h2').textContent;
  // console.log(editButtonClosestTitle);
}

// = e.target.closest('li').getAttribute('data-entry-id');
// for (var i = 0; i < data.entries.length; i++) {
//   if (Number($pensClosestEntryId) === data.entries[i].entryId) {
//     data.editing = data.entries[i];
//   }
// }

// var $ul = document.querySelector('.ul-no-bullets');
// $ul.addEventListener('click', $penButtonFunction);
// function $penButtonFunction(e) {

//   if (e.target.tagName === 'I') {
//     $viewSwap('entry-form');
//     var $deleteButton = document.querySelector('.delete-button');
//     $deleteButton.className = 'delete-button';
//   }

//   var $pensClosestEntryId = e.target.closest('li').getAttribute('data-entry-id');
//   for (var i = 0; i < data.entries.length; i++) {
//     if (Number($pensClosestEntryId) === data.entries[i].entryId) {
//       data.editing = data.entries[i];
//     }
//   }

//   var $image = document.querySelector('.image');
//   $image.src = data.editing.url;

//   var $titleInputField = document.querySelector('#title-id');
//   $titleInputField.value = data.editing.title;

//   var $urlInputField = document.querySelector('#photo-url-id');
//   $urlInputField.value = data.editing.url;

//   var $notesInputField = document.querySelector('.notes');
//   $notesInputField.value = data.editing.notes;

//   var $newEntryTitle = document.querySelector('#new-entry-edit-entry');
//   $newEntryTitle.textContent = 'Edit Entry';
// }


/// right now i have a couple of problems
// 1)  i can't add the entryID to the button attribute (or other nearby attribute)
// 2) i can't get my listener to get the nearest h2 element so i can get its text content (to use it to find the entry in saved entries)
