const form = document.querySelector("form");

const usernameField = document.querySelector(".username-field");
const emailField = document.querySelector(".email-field");
const phoneNumField = document.querySelector(".phoneNum-field");
const passwordField = document.querySelector(".password-field");
const repasswordField = document.querySelector(".repassword-field");

const usernameError = document.querySelector(".username-error");
const usernameErrorTXT = document.querySelector(".username-error > p");

const emailError = document.querySelector(".email-error");
const emailErrorTXT = document.querySelector(".email-error > p");

const phoneNumError = document.querySelector(".phoneNum-error");
const phoneNumErrorTXT = document.querySelector(".phoneNum-error > p");

const passwordError = document.querySelector(".password-error");
const passwordErrorTXT = document.querySelector(".password-error > p");

const repasswordError = document.querySelector(".repassword-error");
const repasswordErrorTXT = document.querySelector(".repassword-error > p");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   let _ERROR_COUNT = 0;

   fetch("/api/v1/checkEx", {
      method: "POST",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         unm: usernameField.value,
         eml: emailField.value,
      }),
   })
   .then((res) => res.json())
   .then((data) => {
      if (data.unm_code === 1) {
         usernameErrorTXT.innerText = "Username has been Owned!";
         usernameError.style.display = "flex";
         _ERROR_COUNT++;
      } else { usernameError.style.display = "none"; }
   
      if (data.eml_code === 1) {
         emailErrorTXT.innerText = "Email has been Owned!";
         emailError.style.display = "flex";
         _ERROR_COUNT++;
      } else { emailError.style.display = "none"; }

      if (usernameField.value === "") {
         usernameErrorTXT.innerText = "Username cannot be Empty!";
         usernameError.style.display = "flex";
         _ERROR_COUNT++;
      }

      if (
         usernameField.value.indexOf("@") !== -1 || 
         usernameField.value.indexOf("!") !== -1 || 
         usernameField.value.indexOf("#") !== -1 || 
         usernameField.value.indexOf("$") !== -1 || 
         usernameField.value.indexOf("%") !== -1 || 
         usernameField.value.indexOf("^") !== -1 || 
         usernameField.value.indexOf("&") !== -1 || 
         usernameField.value.indexOf("*") !== -1 || 
         usernameField.value.indexOf("(") !== -1 || 
         usernameField.value.indexOf(")") !== -1 || 
         usernameField.value.indexOf("-") !== -1 || 
         usernameField.value.indexOf("=") !== -1 || 
         usernameField.value.indexOf("+") !== -1 || 
         usernameField.value.indexOf("/") !== -1 || 
         usernameField.value.indexOf("|") !== -1 || 
         usernameField.value.indexOf("~") !== -1 || 
         usernameField.value.indexOf("`") !== -1 || 
         usernameField.value.indexOf("{") !== -1 || 
         usernameField.value.indexOf("}") !== -1 || 
         usernameField.value.indexOf("[") !== -1 || 
         usernameField.value.indexOf("]") !== -1 || 
         usernameField.value.indexOf("'") !== -1 || 
         usernameField.value.indexOf("\"") !== -1 || 
         usernameField.value.indexOf(":") !== -1 || 
         usernameField.value.indexOf("\\") !== -1 || 
         usernameField.value.indexOf("?") !== -1 || 
         usernameField.value.indexOf("<") !== -1 || 
         usernameField.value.indexOf(">") !== -1
      ) {
         usernameErrorTXT.innerText = "Username cannot contain Symbols!";
         usernameError.style.display = "flex";
         _ERROR_COUNT++;
      }
   
      if (emailField.value.indexOf("@") === -1) {
         emailErrorTXT.innerText = "Email in not Valid!";
         emailError.style.display = "flex";
         _ERROR_COUNT++;
      }
   
      if (isNaN(phoneNumField.value) || phoneNumField.value === "") {
         phoneNumErrorTXT.innerText = "Enter a valid Phone Number!";
         phoneNumError.style.display = "flex";
         _ERROR_COUNT++;
      } else { phoneNumError.style.display = "none"; }
   
      if (passwordField.value.length < 5 || repasswordField.value.length < 5) {
         passwordErrorTXT.innerText = "Password length shold be at least 5!";
         passwordError.style.display = "flex";
         repasswordErrorTXT.innerText = "Password length shold be at least 5!";
         repasswordError.style.display = "flex";
         _ERROR_COUNT++;
      } else {
         passwordError.style.display = "none";
         repasswordError.style.display = "none";
      }
   
      if (passwordField.value !== repasswordField.value) {
         repasswordErrorTXT.innerText = "Passwords are not Match!";
         repasswordError.style.display = "flex";
         _ERROR_COUNT++;
      } else { repasswordError.style.display = "none"; }
   
      if (_ERROR_COUNT === 0) { form.submit(); }
   });
});