const form = document.querySelector("form");

const usernameField = document.querySelector(".username-field");
const passwordField = document.querySelector(".password-field");

const usernameError = document.querySelector(".username-error");
const usernameErrorTXT = document.querySelector(".username-error > p");

const passwordError = document.querySelector(".password-error");
const passwordErrorTXT = document.querySelector(".password-error > p");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   let _ERROR_COUNT = 0;

   fetch("/api/v1/checkAuth", {
      method: "POST",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         possible_username: usernameField.value,
         possible_password: passwordField.value,
      }),
   })
   .then((res) => res.json())
   .then((data) => {
      if (!data.valid_usr) {
         usernameErrorTXT.innerText = "Username is not Existed!";
         usernameError.style.display = "flex";
         _ERROR_COUNT++;
      } else { usernameError.style.display = "none"; }

      if (!data.valid_pas) {
         passwordErrorTXT.innerText = "Password is not True!";
         passwordError.style.display = "flex";
         _ERROR_COUNT++;
      } else { passwordError.style.display = "none"; }

      if (_ERROR_COUNT === 0) { form.submit() }
   });
})