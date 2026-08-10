const API_URL =
    "http://localhost:5000";


// =====================================================
// LOGIN FORM
// =====================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


// =====================================================
// PASSWORD TOGGLE
// =====================================================

const passwordInput =
    document.getElementById(
        "password"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


togglePassword.addEventListener(
    "click",
    () => {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁️";

        }

    }
);


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById(
                    "username"
                )
                .value
                .trim();


        const password =
            passwordInput
                .value;


        loginMessage.textContent =
            "";


        loginMessage.className =
            "login-message";


        loginButton.disabled =
            true;


        loginButtonText.textContent =
            "LOGGING IN...";


        try {

            const response =
                await fetch(

                    `${API_URL}/api/auth/login`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                username,

                                password

                            })

                    }

                );


            const data =
                await response.json();


            if (
                !response.ok
            ) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );

            }


            // Save JWT token

            localStorage.setItem(

                "carCrazeAdminToken",

                data.token

            );


            localStorage.setItem(

                "carCrazeAdminUsername",

                data.admin.username

            );


            loginMessage.textContent =
                "Login successful. Redirecting...";


            loginMessage.classList.add(
                "success"
            );


            // Redirect to dashboard

            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },

                800

            );


        } catch (error) {

            console.error(
                error
            );


            loginMessage.textContent =
                error.message ||
                "Unable to login.";


            loginMessage.classList.add(
                "error"
            );


            loginButton.disabled =
                false;


            loginButtonText.textContent =
                "LOGIN TO DASHBOARD";

        }

    }
);