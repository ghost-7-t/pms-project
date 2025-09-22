
'use client';

// A simple client-side "database" using localStorage to persist user data.
// In a real-world application, this would be replaced by a proper backend database.

const DB_KEY = 'futa_admissions_users';

export interface User {
    id: string; // JAMB number for applicant, Staff ID for admin
    role: 'applicant' | 'admin';
    fullName: string;
    email: string;
    phone: string;
    passwordHash: string; // In a real app, never store plain text passwords. This would be a hash.
    faceIdEnabled: boolean;
    gender: 'male' | 'female';
}

// Function to get all users from localStorage
function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const usersJson = window.localStorage.getItem(DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// Function to save all users to localStorage
function saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Initialize with some default users if the DB is empty
function initializeDB() {
    if (typeof window === 'undefined') return;
    const users = getUsers();
    if (users.length === 0) {
        const defaultUsers: User[] = [
            { id: 'admin@futa.edu.ng', role: 'admin', fullName: 'Admin User', email: 'admin@futa.edu.ng', phone: '1234567890', passwordHash: 'AdminPass123!', faceIdEnabled: false, gender: 'male' },
            { id: '12345678AB', role: 'applicant', fullName: 'John Doe', email: 'john@example.com', phone: '0987654321', passwordHash: 'Password123!', faceIdEnabled: false, gender: 'male' },
        ];
        saveUsers(defaultUsers);
    }
}

// Ensure DB is initialized on first load
if (typeof window !== 'undefined') {
    initializeDB();
}


export const userDB = {
    findUser: (id: string, role: 'applicant' | 'admin'): User | undefined => {
        const users = getUsers();
        return users.find(user => user.id.toLowerCase() === id.toLowerCase() && user.role === role);
    },
    
    findUserByIdOrEmail: (identifier: string, role?: 'applicant' | 'admin'): User | undefined => {
        const users = getUsers();
        const normalizedIdentifier = identifier.toLowerCase();
        return users.find(user => 
            (user.id.toLowerCase() === normalizedIdentifier || user.email.toLowerCase() === normalizedIdentifier) &&
            (!role || user.role === role)
        );
    },

    addUser: (newUser: Omit<User, 'passwordHash'>, password: string): { success: boolean; error?: string } => {
        const users = getUsers();
        const existingUser = users.find(user => user.id.toLowerCase() === newUser.id.toLowerCase() && user.role === newUser.role);
        
        if (existingUser) {
            return { success: false, error: 'User with this ID already exists for the selected role.' };
        }
        
        const userWithHashedPassword: User = {
            ...newUser,
            passwordHash: password, // In a real app, hash the password here. e.g., await bcrypt.hash(password, 10)
        };

        users.push(userWithHashedPassword);
        saveUsers(users);
        return { success: true };
    },

    verifyPassword: (id: string, role: 'applicant' | 'admin', passwordToCheck: string): boolean => {
        const user = userDB.findUser(id, role);
        if (!user) return false;

        // In a real app, compare the hashed password. e.g., await bcrypt.compare(passwordToCheck, user.passwordHash)
        return user.passwordHash === passwordToCheck;
    }
};
