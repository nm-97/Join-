function getSuccessSignUpMessageTemplate(params) {
  const message = params.message || "Sign Up successfull";
  return `
  <div class="ntfcenterS ntfmask" id="signUpToastMessage">${message}
   <img src="../assets/icons/board/checked button hover.svg" alt="checkIcon"></img>
    </div>`;
}

async function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate({ message: "Sign Up successful!" })
  );
}
