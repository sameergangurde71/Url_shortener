import { error } from 'console';
import express from 'express'
import { db } from '../db/index.js'
import { usersTable } from '../models/index.js'
import { signupPostRequestBodySchema } from '../validation/request.validation.js'
import { hashedPasswordWithSalt} from '../utils/hash.js';
import {getUserByEmail, createdUser} from '../services/user.services.js'

const router = express.Router();

router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({ error : validationResult.error.format()})
    }

    //if(!firstname) return res.status(400).json({ error: 'firstname is required '});

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) return res.status(400).json({ error: `User with email ${email} already exists!`});

    const {salt, password: hashedPassword} = hashedPasswordWithSalt(password);

    const user = await createdUser(email, firstname, lastname, password);

    return res.status(200).json({ data: {userId: user.id} });
})


export default router;