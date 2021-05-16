$(function() {
	'use strict';

	
  $('.form-control').on('input', function() {
	  var $field = $(this).closest('.form-group');
	  if (this.value) {
	    $field.addClass('field--not-empty');
	  } else {
	    $field.removeClass('field--not-empty');
	  }
	});

});

function myFunction() {
	
  var copyText = document.getElementById("myInput");
 // alert('clipboard '+ copyText);
  console.log(copyText);
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function terms_changed(termsCheckBox){
    //If the checkbox has been checked
    if(termsCheckBox){
        //Set the disabled property to FALSE and enable the button.
        document.getElementById("submit_button").disabled = false;
		document.getElementById("ckbox").disabled=true;
    } 
}