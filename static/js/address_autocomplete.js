function initialize() {
    var input = document.getElementById('autocomplete');
    var options = {
        types: ['geocode'],
        componentRestrictions: { country: "us" }
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            document.getElementById('autocomplete').classList.add('is-invalid');
        } else {
            document.getElementById('autocomplete').classList.remove('is-invalid');
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initialize();
});
