//initial moment
moment().format();

//upload file to storage
var storage = firebase.storage();
// Get elements
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton");
// Listen for file selection
if (fileButton !== null) {
  fileButton.addEventListener("change", function(e) {
    // Get file
    var file = e.target.files[0];
    // Create a storage ref
    var storageRef = firebase.storage().ref("ScocialPost/" + file.name);
    // Upload file
    var task = storageRef.put(file);
    // Update progress bar
    task.on(
      "state_changed",
      function progress(snapshot) {
        var percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
      },
      function error(err) {},
      function complete() {}
    );
  });
}

//get elements to display post
var postTitle = document.getElementById("post-title");
var postImgUrl = document.getElementById("post-img");
var postLinkUrl = document.getElementById("post-link");

//get data from firestore(database)
var db = firebase.firestore();
var firstPostDoc = db.collection("socialPost").doc("firstPost");
if (postTitle !== null && postImgUrl !== null && postLinkUrl !== null) {
  firstPostDoc
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // console.log("Tadaaa", doc.data());
        var postData = doc.data();

        var current = new Date(); //get the time at the moment
        var endDate = new Date(postData.endDate.seconds * 1000); //convert timestamp to date object to compare later

        if (current.getTime() <= endDate.getTime()) {
          postTitle.innerHTML = postData.title;
          postImgUrl.src = postData.imgUrl;
          postLinkUrl.href = postData.linkUrl;
        } else {
          //pass endDate -> back to default
          postTitle.innerHTML = "Launch comms &amp; elearning: Diageo";
          postImgUrl.src =
            "/images/home/large/Diageo-Coupa-elearning-launch-campaign-460-300.jpg"; //change url if needed when copy this into the app
          postLinkUrl.href = "/work/diageo-coupa.html"; //change url if needed when copy this into the app
        }
      } else {
        console.log("could not find");
      }
    })
    .catch(function(err) {
      console.log("error getting doc", err);
    });
}
