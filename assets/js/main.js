

//Role checking for access managment 

function checkAccess(requiredRoles) {
    
    const userRole = AuthController.getCurrentUser().role;
    if (!requiredRoles.includes(userRole)) {
        alert('Access Denied');
        window.location.href = 'login.html'; // Redirect to login or another page
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle registration form submission
    if (document.getElementById('registration-form')) {
        document.getElementById('registration-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const form = event.target;
            const actionUrl = form.action; // Get the form action URL
            const urlObject = new URL(actionUrl);
            // Get the pathname
            const pathname = urlObject.pathname;
            // Extract the part after the last slash and before the first space or period
            const filename = pathname.split('/').pop().split('%20')[0].split('.')[0];
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // const role = document.getElementById('role').value;
           
            if (filename === 'sellerRegister') {

                const email = document.getElementById('email').value;
                const fullName = document.getElementById('fullname').value;
                const contactNumber = document.getElementById('contactNumber').value;
        
                //Validation 
                // user name not empty, not repeated, not 
                //Password validation
                //email correct and not repeated 
                if (AuthController.validateUsername(username) === false){
                    document.getElementById('usernameError').innerText = 'Invalid username. It should be 3-15 characters long and contain only alphanumeric characters and underscores.';
                }else if (AuthController.validatePassword(password) === false) {
                    document.getElementById('passwordError').innerText = 'Invalid password. It should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
                } else if (AuthController.validateEmail(email) === false) {
                    document.getElementById('emailError').innerText = 'Invalid email format.';
                }else{
                    AuthController.submitSellerRegRequest(username, password, email,'seller',contactNumber,fullName);
                }
            }else if(filename === 'customerRegister'){

                const email = document.getElementById('email').value;
        
                //Validation 
                // user name not empty, not repeated, not 
                //Password validation
                //email correct and not repeated 
                if (AuthController.validateUsername(username) === false){
                    document.getElementById('usernameError').innerText = 'Invalid username. It should be 3-15 characters long and contain only alphanumeric characters and underscores.';
                }else if (AuthController.validatePassword(password) === false) {
                    document.getElementById('passwordError').innerText = 'Invalid password. It should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
                } else if (AuthController.validateEmail(email) === false) {
                    document.getElementById('emailError').innerText = 'Invalid email format.';
                }else{
                    AuthController.register(username, password,email);
                }
            }
            
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        // Store the clicked button's value
        let clickedButtonValue = null;

        // Add event listeners to the submit buttons to capture their value
        const submitButtons = loginForm.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            button.addEventListener('click', function () {
                clickedButtonValue = this.value;
            });
        });

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            

            const formData = new FormData(this);
            formData.append('submitBtn', clickedButtonValue); // Append the clicked button's value manually

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Submit button value:', clickedButtonValue);

            if (clickedButtonValue === 'userLogin') {
                
                AuthController.customerLogin(username, password);
            } else if (clickedButtonValue === 'sellerLogin') {
                
                AuthController.sellerLogin(username, password);
            }
        });
    }


        //Handle Admin dashboard for seller's requests 
    
    if (window.location.pathname === '/Views/adminPanel.html') {

        checkAccess(['admin']); // only accessable to admins 
        
        const sellerRequestsTable = document.getElementById('sellerRequestsTable').getElementsByTagName("tbody")[0];
        const sellerRequests = AdminController.displaySellerRequests();
        sellerRequestsTable.innerHTML = ''; // Clear existing rows
        sellerRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${request.id}</th>
                <td>${request.fullName}</td>
                <td>${request.email}</td>
                <td>${request.contact}</td>
                <td>${request.username}</td>
                <td>${request.date}</td>
                <td>
                    <button class="btn btn-success btn-sm" type="button" data-id="${request.id}" data-action="approve">Approve</button>
                    <button class="btn btn-danger btn-sm" type="button" data-id="${request.id}" data-action="reject">Reject</button>
                </td>
            `;
            sellerRequestsTable.appendChild(row);
        });
        document.querySelector('#sellerRequestsTable').addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('btn')) {
                const requestId = event.target.getAttribute('data-id');
                const requestAction = event.target.getAttribute('data-action');
                
              
                if (requestAction === 'approve') {
                    const sellerRequestData = Seller.getSellerRequestById(parseInt(requestId));
                    AdminController.approveSellerRequest(sellerRequestData)
                }else if (requestAction === 'reject'){
                    const sellerRequestData = Seller.getSellerRequestById(parseInt(requestId));
                    AdminController.rejectSellerRequest(sellerRequestData)
                }
            }
        });

    }

    if (window.location.pathname === '/Views/superadminPanel.html') {

        checkAccess(['super_admin']); // only accessable to super admins 

        const adminsTable = document.getElementById('adminsTable').getElementsByTagName("tbody")[0];
        const allAdmins = AdminController.getAllAdmins();
        
        adminsTable.innerHTML = ''; // Clear existing rows
        allAdmins.forEach(admin => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${admin.id}</th>
                <td>${admin.fullName}</td>
                <td>${admin.email}</td>
                <td>${admin.contact}</td>
                <td>${admin.username}</td>
                <td>
                    <button class="btn btn-success btn-sm" type="button" data-id="${admin.id}" data-action="approve">Delete</button>
                    <button class="btn btn-danger btn-sm" type="button" data-id="${admin.id}" data-action="reject">Suspend</button>
                </td>
            `;
            adminsTable.appendChild(row);
        });

        const addAdminForm = document.getElementById('add-admin-form');
        if (addAdminForm) {
            addAdminForm.addEventListener('submit',function (event){
                event.preventDefault();
                const adminName = document.getElementById('admin-name').value;
                const adminEmail = document.getElementById('admin-email').value;
                const adminPassword = document.getElementById('admin-password').value;
                const adminUser = document.getElementById('admin-user').value;
                const adminContact = document.getElementById('admin-contact').value;

                const newAdmin = new AdminModel(adminUser,adminPassword,adminEmail,'admin',adminContact,adminName);
                //add admin controller 
                AdminController.registerAdmin(newAdmin);
                this.reset();


            });//end of add admin form

            
        }


    }
  
 
});
