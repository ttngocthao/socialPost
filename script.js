//initial moment
moment().format();
//get elements to display post
var postTitle = document.getElementById("post-title");
var postImgUrl = document.getElementById("post-img");
var postLinkUrl = document.getElementById("post-link");
// var previewImg = document.getElementById("preview-img");
//get input elements
var titleInput = document.getElementById("title-input");
var linkInput = document.getElementById("link-input");
var endDateInput = document.getElementById("endDate-input");
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton"); //for display progress
var submitPost = document.getElementById("submit-post-btn");

//get the post from database to show on home page
if (postTitle !== null && postImgUrl !== null && postLinkUrl !== null) {
  getSocialPost();
}
var file, imgUrl, titleVal, linkVal, endDateVal;
if (fileButton !== null) {
  fileButton.addEventListener("change", function(e) {
    file = e.target.files[0];
    console.log(file);
  });
}
if (titleInput !== null) {
  titleInput.addEventListener("change", function(e) {
    titleVal = e.target.value;
    console.log("titleVal", titleVal);
  });
}
if (linkInput !== null) {
  linkInput.addEventListener("change", function(e) {
    linkVal = e.target.value;
    console.log("linkVal", linkVal);
  });
}
if (endDateInput !== null) {
  endDateInput.addEventListener("change", function(e) {
    //covert string to date obj then timestamp
    endDateVal = new Date(e.target.value);
  });
}
//submit post form
if (submitPost !== null) {
  submitPost.addEventListener("click", function() {
    // e.preventDefault();
    //upload file to storage
    var storage = firebase.storage();
    // Create a storage ref
    var storageRef = firebase.storage().ref("SocialPost/postImg.jpg");
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
      function complete() {
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          // previewImg.innerHTML = '<img src="' + downloadURL + '"/>';
          imgUrl = downloadURL;
          console.log("Img url", imgUrl);
          updateSocialPost(imgUrl, titleVal, linkVal, endDateVal);
        });
      }
    );
  });
}

//get data from firestore(database)
function getSocialPost() {
  var db = firebase.firestore();
  var firstPostDoc = db.collection("socialPost").doc("firstPost");

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

function updateSocialPost(imgUrl, title, linkUrl, endDate) {
  var db = firebase.firestore();
  var firstPostDoc = db.collection("socialPost").doc("firstPost");
  firstPostDoc.set({ imgUrl }, { merge: true });
  if (title !== null && title !== "") {
    firstPostDoc.set({ title }, { merge: true });
  }
  if (linkUrl !== null && linkUrl !== "") {
    firstPostDoc.set({ linkUrl }, { merge: true });
  }
  if (endDate !== null && endDate !== "") {
    firstPostDoc.set({ endDate }, { merge: true });
  }
}
