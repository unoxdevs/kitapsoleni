import db from "./db";

export async function createUser(username: string, email: string, emailVisibility: boolean, password: string, passwordConfirm: string, name: string, admin: boolean) {
    return await db.collection('users').create({
        username,
        email,
        emailVisibility,
        password,
        passwordConfirm,
        name,
        admin
    });
}

export async function loginUser(email: string, password: string) {
    return await db.collection('users').authWithPassword(email, password);
}

export async function logoutUser() {
    return await db.authStore.clear();
}

export async function isUserLoggedIn() {
    return await db.authStore.isValid;
}

export async function editUserProfile(
    id: string,
    email?: string,
    password?: string,
    username?: string,
    emailVisibility?: boolean,
    name?: string,
    admin?: boolean,
    oldPassword?: string
) {
    const data: any = {
        email,
        username,
        emailVisibility,
        name,
        admin
    };
    
    if (password) {
        if (!oldPassword) {
            throw new Error("Current password is required to update password");
        }
        data.oldPassword = oldPassword;
        data.password = password;
        data.passwordConfirm = password;
    }
    
    return await db.collection('users').update(id, data);
}

export async function getUserProfile(id: string) {
    return await db.collection('users').getOne(id);
}