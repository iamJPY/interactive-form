// "Basic Info" section
// Focus on first text field on page load
document.getElementById('name').focus();

// "Job Role" section
let jobTitlesList = document.getElementById('title');
let otherTitleInput = document.getElementById('other-title');
otherTitleInput.placeholder = 'Your Job Role';
otherTitleInput.className = 'is-hidden';

// Event handler to display an additional input field when the 'Other' job role is selected
jobTitlesList.addEventListener('change', (e) => {
  let jobTitle = e.target.value;

  if (jobTitle === 'other') {
    otherTitleInput.className = '';
  } else {
    otherTitleInput.className = 'is-hidden';
  }
});

// "T-Shirt Info" section
let designList = document.getElementById('design');
let colorList = document.getElementById('colors-js-puns');
colorList.style.display = 'none';

// Event handler to display color options when its corresponding design option is selected
designList.addEventListener('change', (e) => {
  let design = e.target.value;
  colorList.style.display = null;

  if (design === 'js puns') {
    $('select#color > option').wrap('<span/>');
    $('option[value="gold"]').unwrap();
    $('option[value="darkslategrey"]').unwrap();
    $('option[value="cornflowerblue"]').unwrap();
  } else if (design === 'heart js') {
    $('select#color > option').wrap('<span/>');
    $('option[value="dimgrey"]').unwrap();
    $('option[value="steelblue"]').unwrap();
    $('option[value="tomato"]').unwrap();
  }
});

// "Register for Activities" Section
let activities = document.querySelector('.activities');
let activityOptions = activities.getElementsByTagName('input');
let totalsSpan = document.createElement('span');
let total = 0;

// Event handler to show total costs of selected activities
// and to gray out any conflicting activities when a checkbox is ticked
for (let i = 0; i < activityOptions.length; i += 1) {
  activityOptions[i].addEventListener('change', (e) => {
    let activity = e.target.name;
    let isChecked = e.target.checked;
    let express = document.querySelector('input[name="express"]');
    let node = document.querySelector('input[name="node"]');
    let frameworks = document.querySelector('input[name="js-frameworks"]');
    let libs = document.querySelector('input[name="js-libs"]');

    let updateCheckbox = checkbox => {
      if (isChecked) {
        checkbox.disabled = true;
        checkbox.parentNode.style.fontStyle = 'italic';
        checkbox.parentNode.style.color = 'gray';
      } else if (!isChecked) {
        checkbox.disabled = false;
        checkbox.parentNode.style = null;
      }
    }
    let updateTotal = cost => {
      if (isChecked) {
        total += cost;
      } else if (!isChecked) {
        total -= cost;
      }

      if (total) {
        totalsSpan.style.fontWeight = 'bold';
        totalsSpan.innerHTML = 'Total: $' + total;
        activities.appendChild(totalsSpan);
      } else {
        activities.removeChild(totalsSpan);
      }
    }

    if (activity === 'all') {
      updateTotal(200);
    }
    if (activity === 'js-frameworks') {
      updateCheckbox(express);
      updateTotal(100);
    }
    if (activity === 'js-libs') {
      updateCheckbox(node);
      updateTotal(100);
    }
    if (activity === 'express') {
      updateCheckbox(frameworks);
      updateTotal(100);
    }
    if (activity === 'node') {
      updateCheckbox(libs);
      updateTotal(100);
    }
    if (activity === 'build-tools') {
      updateTotal(100);
    }
    if (activity === 'npm') {
      updateTotal(100);
    }
  });
}

// "Payment Info" section
let paymentList = document.getElementById('payment');
let creditCardContainer = document.getElementById('credit-card');
let paypalContainer = creditCardContainer.nextElementSibling;
let bitcoinContainer = paypalContainer.nextElementSibling;

let showPaymentOptionContainer = paymentOptionContainer => {
  creditCardContainer.className = 'is-hidden';
  paypalContainer.className = 'is-hidden';
  bitcoinContainer.className = 'is-hidden';

  if (paymentOptionContainer) {
    paymentOptionContainer.classList.remove('is-hidden');
    isPaymentOptionSelected = true;
  } else {
    addErrorMessage('select_method', 'Please select a payment method');
    isPaymentOptionSelected = false;
  }
}

// Event handler to display payment option details when a payment option is selected
paymentList.addEventListener('change', (e) => {
  let paymentOption = e.target.value;

  removeErrorMessage('select_method');
  removeErrorMessage('cc-num');
  removeErrorMessage('zip');
  removeErrorMessage('cvv');

  if (paymentOption === 'credit card') {
    showPaymentOptionContainer(creditCardContainer);
  } else if (paymentOption === 'paypal') {
    showPaymentOptionContainer(paypalContainer);
  } else if (paymentOption === 'bitcoin') {
    showPaymentOptionContainer(bitcoinContainer);
  } else if (paymentOption === 'select_method') {
    showPaymentOptionContainer(null);
  }
});

// Make Credit Card the default payment option on page load
document.querySelector('option[value="credit card"]').setAttribute('selected', 'selected');
showPaymentOptionContainer(creditCardContainer);

// Form Validation Functionality
let emailAddress = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
let creditCard = /^[1-9][0-9]{12,15}$/;
let zipCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
let cvvNum = /^[0-9]{3}$/;

// Event handler to re-validate input fields live if errors are present
$('#name, #cc-num, #zip, #cvv').focusout(function (){
  let $inputField = $(this);
  if ($inputField.css('border-color') === 'rgb(220, 20, 60)') {
    validateInputs();
  }
});

// Event handler for live email input detection and validation
$('#mail').keydown(function (){
  let mail = document.getElementById('mail');
  if (!emailAddress.test(mail.value)) {
    $('#mail').css('border-color', 'crimson');
  } else {
      $('#mail').removeAttr('style');
      removeErrorMessage('mail');
  }
});

// Event handler to re-validate activity selection
$('input[type="checkbox"]').change(function (){
  let checkboxes = document.querySelectorAll('input:checked');
  if (checkboxes.length > 0) {
      removeErrorMessage('activities');
  }
});

// Validate data from input fields
let validateInputs = () => {
  let name = document.getElementById('name');
  let mail = document.getElementById('mail');
  let ccNum = document.getElementById('cc-num');
  let zip = document.getElementById('zip');
  let cvv = document.getElementById('cvv');
  let checkboxes = document.querySelectorAll('input:checked');

  if (creditCardContainer.className !== 'is-hidden') {
    if (!cvvNum.test(cvv.value)) {
        addErrorMessage(cvv.id, 'Please enter valid CVV number');
    } else {
        removeErrorMessage('cvv');
    }
    if (!zipCode.test(zip.value)) {
        addErrorMessage(zip.id, 'Please enter a valid zip code');
    } else {
        removeErrorMessage('zip');
    }
    if (!creditCard.test(ccNum.value)) {
        removeErrorMessage(ccNum.id);
        verifyCreditCardNumber(ccNum.value, ccNum.id);
    } else {
        removeErrorMessage('cc-num');
    }
  }

  if (!isPaymentOptionSelected) {
      addErrorMessage('select_method', 'Please select a payment method');
  } else {
      removeErrorMessage('select_method');
  }
  if (checkboxes.length === 0) {
      addErrorMessage('activities', 'Please select at least one activity');
  } else if (checkboxes.length > 0) {
      removeErrorMessage('activities');
  }
  if (!emailAddress.test(mail.value)) {
      addErrorMessage(mail.id, 'Please enter a valid email address');
      $("html, body").animate({scrollTop: 0}, "slow");
  } else {
      removeErrorMessage('mail');
  }
  if (name.value === "") {
      addErrorMessage(name.id, 'Please enter your name');
      $("html, body").animate({scrollTop: 0}, "slow");
  } else {
      removeErrorMessage('name');
  }
}

// Create error message and prepend to form
let addErrorMessage = (inputID, errorM) => {
  let errorMessageContainer = document.createElement('div');
  let errorMessage = errorM;
  let numberOfErrors = $('#' + inputID + '-error').length;
  errorMessageContainer.style.color = 'crimson';
  errorMessageContainer.id = inputID + '-error';
  errorMessageContainer.innerHTML = errorMessage;

  if (numberOfErrors === 0 && (inputID === 'name' || inputID === 'mail')) {
    $('form').prepend(errorMessageContainer);
    $('#' + inputID).css('border-color', 'crimson');
  } else if (numberOfErrors === 0 && (inputID !== 'name' || inputID !== 'mail')) {
    $(errorMessageContainer).insertBefore($('button[type="submit"]'));
    $('#' + inputID).css('border-color', 'crimson');
  }
}

// Remove error message from form
let removeErrorMessage = inputID => {
  $('div[id="' + inputID + '-error"]').remove();
  $('#' + inputID).removeAttr('style');
}

// Verify Credit Card Number input
let verifyCreditCardNumber = (creditCardNumber, creditCardField) => {
  if (creditCardNumber.length === 0) {
    $('#cc-num').attr('class', 'blank-cc-num-error');
    addErrorMessage(creditCardField, 'Please enter a credit card number');
  } else if (!creditCard.test($('#cc-num').val())) {
    $('#cc-num').attr('class', 'cc-num-digits-error');
    addErrorMessage(creditCardField, 'Please enter a 13-16 digit credit card number');
  }
}

// When Submit button is pressed, event handler checks if form is complete
// If form is complete with no errors, submit form
$('form').submit(function (e) {
  e.preventDefault();
  validateInputs();
  let formErrors = $('[id*="-error"]').length;
  if (formErrors === 0) {
    $(this).unbind('submit').submit();
    alert('Thanks for registering!');
  }
});
