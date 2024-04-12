document.addEventListener("DOMContentLoaded", function() {
    var fileNameInput = document.getElementById('fileName');
    var fileName = '<%= file %>';
    var testName = fileName.split('/').pop().split('.')[0].toUpperCase();
    document.getElementById('testName').textContent = testName;
    fileNameInput.value = testName;
});

document.addEventListener("DOMContentLoaded", function() {
    var divisionButtons = document.querySelectorAll('.testInfo button');
    var selectedDivisions = [];

    divisionButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            button.classList.toggle('pressed');
            var divisionName = button.textContent.trim();
            if (button.classList.contains('pressed')) {
                selectedDivisions.push(divisionName);
            } else {
                var index = selectedDivisions.indexOf(divisionName);
                if (index !== -1) {
                    selectedDivisions.splice(index, 1);
                }
            }

            // Update the hidden input field with the updated selectedDivisions array
            document.getElementById('selectedDivisions').value = JSON.stringify(selectedDivisions);
        });
    });
});

export const duration=document.getElementById('duration');