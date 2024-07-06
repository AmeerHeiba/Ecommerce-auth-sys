class UserController {
    static getUserOrders(userId) {
        const orders = Order.getOrders();
        return orders.filter(order => order.userId === userId);
    }

    static updateUserDetails(userId, newDetails) {
        const users = User.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...newDetails };
            User.saveUsers(users);
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex])); // Update current user data in localStorage
            alert('Account details updated successfully.');
        } else {
            alert('User not found.');
        }
    }
}
