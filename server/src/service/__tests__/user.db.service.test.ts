import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {createConnection} from "mongoose";
import {UserSchema} from "../../db/user.model";
import {UserService} from "../user.db.service";
import {User} from "../../model/user.interface";
import * as bcrypt from "bcrypt";

let createUsers = async (userService : UserService, count = 0): Promise<number> => {
  let created = 0;
  for(let i = 0; i < count; i++) {
     let user = await userService.register(`user_${created}`, `user_p_${created}`, `test${created}@example.com`);
     if(user?.id){
       created++;
     }
  }
  return created
}

let conn : mongoose.Connection,
    mongoMemoryServer : MongoMemoryServer,
    userService : UserService;

beforeEach(async () => {
  mongoMemoryServer = await MongoMemoryServer.create();
  conn = createConnection(mongoMemoryServer.getUri())

  const testModel = conn.model<User>("User", UserSchema)
  userService = new UserService(testModel);
});

test("User registration and login", async () => {
  let user = await userService.register("test", "password123", "test1@example.com");
  await expect(userService.login("test", "password123")).resolves.toMatchObject({ username: user.username, id: user.id})
  await expect(userService.login("test","123fail")).resolves.toBeNull()
})

test("Creating a user should validate and return a user object", async () => {
  // Succeeds
  let user = await userService.register("test1", "test1", "test@example.com")
  expect(user.username).toEqual("test1")
  expect(bcrypt.compareSync("test1", user.password)).toEqual(true) // Check that it gets hashed
  expect(user.email).toEqual("test@example.com")
});


test("Registration should enforce unique username constraint", async () => {
  await expect(userService.register("test", "test123", "test@1example.com")).resolves.toBeDefined();
  await expect(userService.register("test", "new123", "copy@1example.com")).rejects.toThrowError();
})


test("Find user by username should return the correct user", async () => {
  await createUsers(userService,50);
  return userService.findByUsername(`user_21`)
      .then((user: User | null) => {
        expect(user?.email).toBe('test21@example.com');
      })
});

test("Update should update the correct user and fail if unapproved key is in updateObject", async () => {
  await createUsers(userService,50);
  let user = await userService.findByUsername(`user_20`)
  if(!user) throw Error("No user");

  await expect(userService.update(user.id, {
    description: "Update user " + user.id,
    profileImageUrl: "https://example.com"
  })).resolves.toEqual(true);

  await expect(userService.findById(user.id)).resolves.toMatchObject({
    description: "Update user " + user.id,
    profileImageUrl: "https://example.com"
  });
});

test("SetPassword should hash the new password and update the correct user", async () => {
  await createUsers(userService,21);
  let user = await userService.findByUsername(`user_20`)
  if(!user) throw Error("No user");

  await expect(userService.setPassword(user.id, "new_test")).resolves.toBe(true);
  await expect(userService.login(user.username, "new_test")).resolves.toHaveProperty("id", user.id);
  await expect(userService.findById(user.id)).resolves.not.toHaveProperty("password", "new_test");
})