import db from './db';

export async function checkAdminAccess() {
    const user = db.authStore.model;
    if (!user?.admin) {
        throw new Error("Bu işlem için admin yetkisi gerekiyor");
    }
}

export async function getAllUsers() {
    try {
        await checkAdminAccess();
        const records = await db.collection('users').getFullList({
            sort: 'created',
        });
        return records;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function deleteUser(userId: string) {
    try {
        await checkAdminAccess();
        return await db.collection('users').delete(userId);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export async function updateUserRole(userId: string, isAdmin: boolean) {
    try {
        await checkAdminAccess();
        return await db.collection('users').update(userId, {
            admin: isAdmin
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}
