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
      var yellActivitiesList = xhr.response.data[i];
      var $option = document.createElement('option');
      $option.textContent = yellActivitiesList.title;
      $select.appendChild($option);
    }
  });
  xhr.send();
  for (var i = 0; i < data.savedActivities.length; i++) {
    $renderSavedActivities(data.savedActivities[i]);
  }
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

// FUNCTION FOR 'GO' BUTTON, FOR RENDERING, VIEWING ENTRY
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
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    document.querySelector('.nothing-saved').className = 'nothing-saved hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label hide';
    document.querySelector('.writing-editing-notes-view').className = 'container writing-editing-notes-view hide';
    data.view = 'home-view';
  } if (viewName === 'selected-activity-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.my-activities-button').className = 'my-activities-button';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label hide';
    document.querySelector('.writing-editing-notes-view').className = 'container writing-editing-notes-view hide';
    document.querySelector('.nothing-saved').className = 'nothing-saved hide';
    data.view = 'selected-activity-view';
  } if (viewName === 'my-activities-view') {
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.unordered-list').className = 'unordered-list';
    document.querySelector('.home-button').className = 'home-button';
    document.querySelector('.writing-editing-notes-view').className = 'container writing-editing-notes-view hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label';
    data.view = 'my-activities-view';
    if (data.savedActivities.length === 0) {
      document.querySelector('.nothing-saved').className = 'nothing-saved';
    }
  } if (viewName === 'writing-editing-notes-view') {
    document.querySelector('.writing-editing-notes-view').className = 'container writing-editing-notes-view';
    document.querySelector('.home-view').className = 'dropdown-container home-view hide';
    document.querySelector('.selected-activity-view').className = 'container selected-activity-view hide';
    document.querySelector('.my-activities-view-label').className = 'my-activities-view-label hide';
    document.querySelector('.unordered-list').className = 'unordered-list hide';
    data.view = 'writing-editing-notes-view';
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
  for (var j = 0; j < data.savedActivities.length; j++) {
    if (data.savedActivities[j].title === data.viewing.title) {
      alert('This activity has already been saved.  Please click on "My Activities" to locate your saved activity');
      return;
    }
  } data.viewing.savedActivityId = data.nextSavedActivityId;
  data.nextSavedActivityId += 1;
  data.savedActivities.unshift(data.viewing);
  $renderSavedActivities(data.viewing);
  data.viewing = null;
  $viewSwap('my-activities-view');
}

// VIEW "MY ACTIVITIES" BUTTON
var $myActivitiesButton = document.querySelector('.my-activities-button');
$myActivitiesButton.addEventListener('click', goToMyActivities);
function goToMyActivities(e) {
  $viewSwap('my-activities-view');
}

function $renderSavedActivities(savedActivityObject) {

  var $myActivitiesContainer = document.createElement('div');
  $myActivitiesContainer.setAttribute('class', 'container my-activities-view');

  var $activityCard = document.createElement('div');
  $activityCard.setAttribute('class', 'activity-card');
  $myActivitiesContainer.appendChild($activityCard);

  var $image = document.createElement('img');
  $image.setAttribute('src', savedActivityObject.images[0].url);
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
  $notesTextboxLabel.setAttribute('class', 'notes-textbox-label');
  $notesTextboxLabel.textContent = 'My notes';
  $myNotesForm.appendChild($notesTextboxLabel);

  var $notesTextbox = document.createElement('div');
  $notesTextbox.setAttribute('class', 'notes-textbox');
  $notesTextbox.textContent = savedActivityObject.notes;
  $myNotesForm.appendChild($notesTextbox);

  var $notesSaveButtonDiv = document.createElement('div');
  $notesSaveButtonDiv.setAttribute('class', 'notes-save-div');
  $myNotesForm.appendChild($notesSaveButtonDiv);

  var $notesSaveButton = document.createElement('button');
  $notesSaveButton.setAttribute('class', 'notes-save-button notes-write-edit-button');
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

// "write/edit" notes button
var $editButton = document.querySelector('.unordered-list');
$editButton.addEventListener('click', $editButtonFunction);
function $editButtonFunction(e) {
  if (e.target.tagName === 'BUTTON') {
    var closestDiv = e.target.closest('ul > div > div > div');
    for (var i = 0; i < data.savedActivities.length; i++) {
      if (data.savedActivities[i].title === closestDiv.childNodes[0].textContent) {
        data.editing = data.savedActivities[i];
        var notesInputField = document.querySelector('.notes-textbox-prepopulate');
        if (data.savedActivities[i].notes) {
          notesInputField.value = data.savedActivities[i].notes;
        } else {
          notesInputField.value = null;
        }
        renderEditingEntry(data.editing[0]);
        $viewSwap('writing-editing-notes-view');
      }
    }
  }
}

function renderEditingEntry(entryToEdit) {
  document.querySelector('.editing-activity-image').src = data.editing.images[0].url;
  document.querySelector('.editing-activity-image').alt = data.editing.images[0].alt;
  document.querySelector('.editing-activity-card-title').innerHTML = data.editing.title;
  document.querySelector('.editing-activity-card-description').innerHTML = data.editing.shortDescription;
  document.querySelector('.editing-activity-location').innerHTML = data.editing.locationDescription;
  document.querySelector('.editing-activity-duration').innerHTML = data.editing.duration;
  document.querySelector('.editing-activity-accessibility').innerHTML = data.editing.accessibilityInformation;
  document.querySelector('.editing-activity-fees').innerHTML = data.editing.doFeesApply;
  if (data.editing.doFeesApply === 'false') {
    data.editing.doFeesApply = 'No fees';
  }
}

var saveNotesButton = document.querySelector('.notes-save-button');
saveNotesButton.addEventListener('click', saveNotesFunction);
function saveNotesFunction(e) {
  data.editing.notes = document.forms[1].elements.notes.value;
  for (var i = 0; i < data.savedActivities.length; i++) {
    if (data.editing.title === data.savedActivities[i].title) {
      data.savedActivities[i] = data.editing;
      $viewSwap('my-activities-view');
    }
  }
}
