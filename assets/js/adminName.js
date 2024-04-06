document.addEventListener('DOMContentLoaded', function () {
    var adminName = getCookie('admin');
    document.getElementById('adminName').textContent = adminName || 'Unknown'; // Display admin name or 'Unknown' if cookie not found

    // Function to get cookie by name
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }
});