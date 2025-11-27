import { db } from '../db/index.js'
import { usersTable } from '../models/user.model.js'
import { eq } from 'drizzle-orm';
import { hashedPasswordWithSalt} from '../utils/hash.js';

export async function getUserByEmail(email) {
     const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstname: usersTable.firstname,
            lastname: usersTable.lastname,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));
    
    return existingUser;
} 

export async function createdUser({email, firstname, lastname, password}) {
    
    if(!email || !password) throw new Error('email and password required');

    const {salt, password: hashedPassword} = hashedPasswordWithSalt(password); 

    const [inserted] = await db.insert(usersTable).values({
        email,
        firstname,
        lastname,
        salt,
        password: hashedPassword,
    })
    .returning({ id: usersTable.id });

    return inserted;
}