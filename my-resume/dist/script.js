const control_of_admin_btn = document.getElementById("admin-btn");
const control_of_admin_login_section = document.getElementById("admin-login");
const control_of_user_responses_section = document.getElementById("user-responses");

control_of_admin_btn.addEventListener('click', function(){
  control_of_admin_login_section.style.display = "block";
});

const control_of_toggle_btn = document.getElementById("toggle-theme");
control_of_toggle_btn.addEventListener('click', function(){
document.body.classList.toggle("dark-theme");
});

const db_url ="https://script.google.com/macros/s/AKfycbyb5BuhYYXt8sR_tFGBpt6IGcheFGx-XI2ATJj2GVQGIpXEElS1X-O68PIxKAh8grHI5Q/exec"

const control_of_contact_form = document.getElementById("contact-form");

control_of_contact_form.addEventListener("submit", async function(event){

  event.preventDefault();
  
  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let msg = document.getElementById("input-msg").value;
  // let date = new Date().toLocaleString();

try {
  let response = await fetch (
    db_url,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "save_message",
        name: name,
        email: email,
        msg: msg
      })
      
    }
  );
  
  let result = await response.json();
  if (result.success) {
    alert("Message submitted, will get back to you shortly!");
  }
  else{
    alert("Message could not be saved!");
  }
}
  catch(error){
    console.error(error);
    alert("there was a problem submitting the message");
  }
});


let control_of_admin_form = document.getElementById("admin-form");

control_of_admin_form.addEventListener("submit", async function(event){
  let username = document.getElementById("input-username").value;
  let password = document.getElementById("input-password").value;

try {
  let response = await fetch (
    db_url,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
      })
      
    }
  );
  let result = await response.json();
  if (result.success) {
    alert("Login Successful!");

    control_of_admin_login_section.style.display = "none";
    control_of_user_responses_section.style.display = "block";
    
    getUserMessages();
  }
  else{
    alert("Access denied, please try again!");
  }
}
  catch(error){
    console.error(error);
    alert("there was a loging in!");
  }

}
)

async function getUserMessages() {
  try{
    let response = await fetch(
      db_url
    );

    let result = await response.json();

    if(!result.success){
      alert("Could not fetch the messages.");
      return;
    }

    const control_of_user_messages_div = document.getElementById("user-messages");

    result.messages.forEach(
      responses => {
        let control_of_new_div = document.createElement("div");

        let nameParagraph = document.createElement("p");
        nameParagraph.textContent = "Name: " + responses.name;
        
        let emailParagraph = document.createElement("p");
        emailParagraph.textContent = "Email: " + responses.email;
        
        let messageParagraph = document.createElement("p");
        messageParagraph.textContent = "Message: " + responses.msg;
        
        let dateParagraph = document.createElement("p");
        dateParagraph.textContent = "Date: " + responses.date;

        let separator = document.createElement("hr");

        control_of_new_div.appendChild(nameParagraph);
        control_of_new_div.appendChild(emailParagraph);
        control_of_new_div.appendChild(messageParagraph);
        control_of_new_div.appendChild(dateParagraph);
        control_of_new_div.appendChild(separator);
        control_of_user_messages_div.appendChild(control_of_new_div);
      }
    )
  }

  catch(error) {
    console.error(error);
    alert("There was a problem in fetching messages from DB!");
  }
}

