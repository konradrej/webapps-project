import {User} from "../../model/user.interface";
import {UserService} from "../user.service";
import {randomInt} from "crypto";

let createUser = (id?: number): User => {
    if (!id) id = randomInt(0, 10000);
    return {
        id: id,
        username: `user_${id}`,
        password: `user_p_${id}`,
        posts: [],
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


test("Find user should return the correct user", () => {
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

    // "Bad username"
    await expect(us.register("!#!", "test1", "test@example.com")).rejects.toBeInstanceOf(Error);

    // "Bad email"
    await expect(us.register("test1", "test1", "test@1#!#!")).rejects.toBeInstanceOf(Error)


    // Succeeds
    user = await us.register("test1", "test1", "test@example.com")
    expect(user.username).toEqual("test1")
    //expect(user.password).toEqual(hash("test1")) // Check that it gets hashed
    expect(user.email).toEqual("test@example.com")

    // Fails due to non-unique username
    await expect(us.register("test1", "test1", "test@example.com")).rejects.toBeInstanceOf(Error)
});


test("Update should update the correct user", () => {
    let users = createUsers(500);
    const us = new UserService(users);
    return us.update(users[200], {
        description: "Update user 200"
    }).then((bool) => {
        expect(bool).toEqual(true)
        expect(users[200].description).toEqual("Update user 200");
    })
});
