class AdminController {

   static displaySellerRequests() {
        const requests = AdminModel.getSellerRequests();
        return requests ; 
        // this.view.renderSellerRequests(requests);
    }

    static approveSellerRequest(request){
        
        //addSeller(seller)
        const id = request.id;
        const username = request.username;
        const password = request.password;
        const email = request.email;
        const role = 'seller';
        const newUser = new User(id, username, password, email, role);
        Seller.addSeller(newUser);
        Seller. removeSellerRequest(id);
        location.reload();

        // Seller.addSeller(request);
    }
    static rejectSellerRequest(request){
        const id = request.id;
        Seller.removeSellerRequest(id);
        location.reload();
    }

    static registerAdmin(admin){
        
        const newAdmin = new AdminModel(AdminController.getAllAdmins().length +1,admin.username,admin.password,admin.password,admin.email,'admin',admin.contact,admin.fullName);
        AdminModel.addAdmin(newAdmin);
    }

    static getAllAdmins(){
        return AdminModel.getAdmins();
    }
}