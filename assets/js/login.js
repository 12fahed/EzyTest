function submitForm() {
    var instikeyInput = document.getElementsByName("instikey")[0];
    if (instikeyInput.value === "") {
        instikeyInput.value = "ABC123";
    }
}