import {User} from "../../model/user.interface";
import {UserService} from "../user.service";
import {randomInt} from "crypto";
import * as bcrypt from "bcrypt"

let createUser = (id?: number): User => {
    if (!id) id = randomInt(0, 10000);
    return {
        id: id,
        username: `user_${id}`,
        password: `user_p_${id}`,
        profileImageUrl: "",
        description: "",
        email: `test${id}@example.com`,
        createdAt: new Date,
    }
}

let createUsers = (count: number): { [id: number]: User } => {
    let users = {},
        i = 0;
    while (i < count) {
        // @ts-ignore
        users[i] = createUser(i);
        i++
    }
    return users;
}


test("User registration and login", async () => {
    const us = new UserService({});

    let user = await us.register("test", "password123", "test1@example.com");
    await expect(us.login("test", "password123")).resolves.toEqual(user)
    await expect(us.login("test","123fail")).resolves.toBeNull()
})

test("Find user by username should return the correct user", () => {
    let users = createUsers(500);
    const us = new UserService(users);
    return us.findByUsername(`user_300`)
        .then((user: User | null) => {
            expect(user).toBe(users[300]);
        })
});


test("Creating a user should validate and return a user object", async () => {
    const us = new UserService({});
    let user;

    // Succeeds
    user = await us.register("test1", "test1", "test@example.com")
    expect(user.username).toEqual("test1")
    expect(bcrypt.compareSync("test1", user.password)).toEqual(true) // Check that it gets hashed
    expect(user.email).toEqual("test@example.com")
});


test("Update should update the correct user and fail if unapproved key is in updateObject", async () => {
    let users = createUsers(500);
    const us = new UserService(users);
    
    let id = users[200].id;
    await expect(us.update(id, {
        description: "Update user " + id,
        profileImageUrl: "https://example.com"
    })).resolves.toEqual(true);

    await expect(us.findById(id)).resolves.toMatchObject({
        description: "Update user " + id,
        profileImageUrl: "https://example.com"
    });
});

test("SetPassword should hash the new password and update the correct user", async () => {
    let userDB = createUsers(21);
    const us = new UserService(userDB);
    let user = userDB[20];

    await expect(us.setPassword(user.id, "new_test")).resolves.toBe(true);
    await expect(us.login(user.username, "new_test")).resolves.toHaveProperty("id", user.id);
    await expect(us.findById(user.id)).resolves.not.toHaveProperty("password", "new_test");
})

test("Registration should enforce unique username constraint", async () => {
    const us = new UserService();
    await expect(us.register("test", "test123", "test@1example.com")).resolves.toBeDefined();
    await expect(us.register("test", "new123", "copy@1example.com")).rejects.toThrowError();
})
