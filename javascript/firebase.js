"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser(params) {
  const currentUser = sessionStorage.getItem("currentUser")
  if (currentUser) {
    return JSON.parse(currentUser);

  } else {
    return {type: "guest"};
}
}

function setUserPath(params) {
  const user = getCurrentUser();
  let userPath;
  if (user.type === "guest") {
    userPath = "guest";
  } else {
    userPath = user.registered; 
  }
  return userPath; 
}
