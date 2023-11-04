let userIP;

// Function to get user's IP address on page load
function getUserIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      userIP = data.ip;
      console.log("User's IP address: " + userIP);
    });
}

window.addEventListener("load", getUserIP);

// Function to fetch location information from IP API
document.getElementById("getLocationButton").addEventListener("click", () => {
  if (userIP) {
    fetch(`https://ipapi.co/${userIP}/json/`)
      .then((response) => response.json())
      .then((data) => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const timezone = data.timezone;
        const pincode = data.postal;

        // Display the latitude, longitude, and timezone information
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);
        console.log("Timezone: " + timezone);

        // Show the user's location on Google Maps (replace API_KEY with your actual Google Maps API key)
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14`;
        window.open(mapUrl, "_blank");

        // Get the current time in the user's timezone
        const timeURL = `https://worldtimeapi.org/api/timezone/${timezone}`;
        fetch(timeURL)
          .then((response) => response.json())
          .then((timeData) => {
            const userTime = new Date(timeData.utc_datetime);
            console.log("User's current time: " + userTime);
          });

        // Fetch post offices based on the pincode
        fetch(`https://api.postalpincode.in/pincode/${pincode}`)
          .then((response) => response.json())
          .then((postOfficeData) => {
            const postOffices = postOfficeData[0].PostOffice;

            // Display post offices
            postOffices.forEach((postOffice) => {
              console.log("Post Office: " + postOffice.Name);
            });

            // Create a search box and filter post offices by name and branch office
            const searchBox = document.getElementById("searchBox");
            searchBox.addEventListener("input", () => {
              const searchTerm = searchBox.value.toLowerCase();
              const filteredOffices = postOffices.filter((postOffice) => {
                return (
                  postOffice.Name.toLowerCase().includes(searchTerm) ||
                  postOffice.BranchType.toLowerCase().includes(searchTerm)
                );
              });

              // Display filtered post offices
              console.clear();
              filteredOffices.forEach((postOffice) => {
                console.log("Post Office: " + postOffice.Name);
              });
            });
          });
      })
      .catch((error) => {
        console.error("Error fetching location information: " + error);
      });
  } else {
    console.error("User's IP address not available.");
  }
});

// Event listener for the "Get Location" button
document
  .getElementById("getLocationButton")
  .addEventListener("click", async () => {
    const ipAddress = await getUserIPAddress();
    if (ipAddress) {
      const { lat, lon, timezone } = await getUserLocation(ipAddress);
      fetchPostOffices(timezone);
    }
  });
