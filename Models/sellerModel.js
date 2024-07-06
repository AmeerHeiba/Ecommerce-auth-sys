class Seller {
    constructor(id, username, password, email, role, date, contact, fullName) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role; // 'customer', 'seller', 'admin'
        this.date = date;
        this.contact= contact;
        this.fullName = fullName;
    }

    static getSeller() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    static getSellerRequests(){
        return JSON.parse(localStorage.getItem('sellersRequests')) || [];
    }

    static getSellerRequestById(id){
        const sellers = Seller.getSellerRequests();
        return sellers.find(seller =>seller.id === id);
    }

    // static saveSellers(sellers) {
    //     localStorage.setItem('users', JSON.stringify(sellers));
    // }

    static removeSellerRequest(id){

        const sellersRequests = Seller.getSellerRequests();
        let index = sellersRequests.findIndex(obj => obj.id === id);
        if (index !== -1) {
            sellersRequests.splice(index, 1);
        }

        Seller.saveSellersRequests(sellersRequests)
  

    }

    static saveSellersRequests(sellersRequests){

        localStorage.setItem('sellersRequests', JSON.stringify(sellersRequests));

    }

    static addSeller(seller) {
        const users = User.getUsers();
        users.push(seller);
        User.saveUsers(users);
    }

    static authenticate(username, password) {
        const sellers = Seller.getSeller();
        return sellers.find(seller =>seller.role === 'seller'&& seller.username === username && seller.password === password);
    }
// register a seller account request to be validated by the available admin then to be approved or rejected 
    static requestAccount(sellerRequest){

        const sellersRequests = Seller.getSellerRequests();
        sellersRequests.push(sellerRequest)
        Seller.saveSellersRequests(sellersRequests)

    }

    
}
