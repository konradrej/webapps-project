import Express from "express";
import {IUpdateObject, IUserService} from "../service/user.service";
import assert from "assert";


export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService
  }

  showUser = async (req: Express.Request, res: Express.Response): Promise<void> => {
    const id: number = Number(req.params.id);
    const user = await this.userService.findById(id);

    if (user) {
      res.status(200).send({
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        description: user.description,
        posts: [
          {
            "post": {
              "id": 0,
              "title": "id eu reprehenderit excepteur amet",
              "description": "Anim consectetur nulla magna culpa voluptate deserunt occaecat commodo. Deserunt occaecat fugiat duis est ipsum id nulla laborum fugiat do Lorem quis non. Labore sunt nulla voluptate exercitation veniam dolore anim laboris est eiusmod.",
              "imageUrl": "https://picsum.photos/200/300",
              "createdAt": "Tue Oct 27 1987 16:58:09 GMT+0100 (centraleuropeisk normaltid)",
              "modifiedAt": "Sat Mar 15 1997 20:13:49 GMT+0100 (centraleuropeisk normaltid)"
            },
            "user": {
              "id": 1,
              "createdAt": "2022-02-16T14:41:02.665Z",
              "description": "",
              "profileImageUrl": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
              "username": "test2"
            }
          },
          {
            "post": {
              "id": 1,
              "title": "amet ut ea exercitation esse",
              "description": "Dolore excepteur mollit dolore laborum excepteur pariatur Lorem officia aliquip do ipsum dolor cillum. Nostrud minim cupidatat elit ut. Dolore aute enim irure fugiat aliquip.",
              "imageUrl": "https://picsum.photos/200/300",
              "createdAt": "Sun Jul 19 1981 20:00:50 GMT+0200 (centraleuropeisk sommartid)",
              "modifiedAt": "Tue Jul 12 2016 08:40:45 GMT+0200 (centraleuropeisk sommartid)"
            },
            "user": {
              "id": 1,
              "createdAt": "2022-02-16T14:41:02.665Z",
              "description": "",
              "profileImageUrl": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
              "username": "test2"
            }
          },
          {
            "post": {
              "id": 2,
              "title": "reprehenderit proident occaecat nulla laboris",
              "description": "Veniam esse labore qui dolor tempor ad. Ullamco quis proident occaecat dolor commodo aliquip magna elit. Quis ipsum occaecat ut minim.",
              "imageUrl": "https://picsum.photos/200/300",
              "createdAt": "Sun Jan 21 1979 09:03:55 GMT+0100 (centraleuropeisk normaltid)",
              "modifiedAt": "Mon Mar 04 2013 14:52:13 GMT+0100 (centraleuropeisk normaltid)"
            },
            "user": {
              "id": 1,
              "createdAt": "2022-02-16T14:41:02.665Z",
              "description": "",
              "profileImageUrl": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
              "username": "test2"
            }
          },
          {
            "post": {
              "id": 3,
              "title": "exercitation velit consequat incididunt amet",
              "description": "Exercitation anim cupidatat aute quis incididunt officia. Do magna ipsum cupidatat anim anim duis aute cupidatat. Qui dolore est elit cillum consequat eiusmod aute commodo.",
              "imageUrl": "https://picsum.photos/200/300",
              "createdAt": "Tue Jan 18 1994 04:55:02 GMT+0100 (centraleuropeisk normaltid)",
              "modifiedAt": "Tue May 19 2009 18:38:24 GMT+0200 (centraleuropeisk sommartid)"
            },
            "user": {
              "id": 1,
              "createdAt": "2022-02-16T14:41:02.665Z",
              "description": "",
              "profileImageUrl": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
              "username": "test2"
            }
          },
          {
            "post": {
              "id": 4,
              "title": "ea qui magna dolore deserunt",
              "description": "Cupidatat consequat amet ipsum veniam qui elit ut aliquip. Occaecat in laborum ullamco est excepteur sit. Voluptate nulla pariatur excepteur excepteur enim esse cupidatat fugiat reprehenderit anim sint nisi veniam magna.",
              "imageUrl": "https://picsum.photos/200/300",
              "createdAt": "Thu Mar 08 1984 00:27:53 GMT+0100 (centraleuropeisk normaltid)",
              "modifiedAt": "Tue Jun 22 1999 14:51:53 GMT+0200 (centraleuropeisk sommartid)"
            },
            "user": {
              "id": 1,
              "createdAt": "2022-02-16T14:41:02.665Z",
              "description": "",
              "profileImageUrl": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
              "username": "test2"
            }
          }
        ],
        createdAt: user.createdAt,
      });
      return;
    }

    res.status(404).send("Invalid user");
  }

  updatePassword = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const id: number = req.session.currentUser.id;
      const password: string = req.body.password;

      let updated = await this.userService.setPassword(id, password)
      if (!updated) {
        res.status(400).send({status: "Password could not be updated"});
      } else {
        res.status(200).send({status: "Password updated"});
      }
    } catch (e: any) {
      res.status(500).send({error: e.message});
    }
  }

  updateUser = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const id: number = req.session.currentUser.id;

      const updateObject: IUpdateObject = {};
      const email: string = req.body.email;
      const description: string = req.body.description;
      const profileImageUrl: string = req.body.profileImageUrl;

      if (email)
        updateObject.email = email;

      if (description)
        updateObject.description = description;

      if (profileImageUrl)
        updateObject.profileImageUrl = profileImageUrl;

      let updated = await this.userService.update(id, updateObject)
      if (!updated) {
        res.status(400).send({status: "User could not be updated"});
      } else {
        res.status(200).send({status: "User updated"});
      }
    } catch (e: any) {
      res.status(500).send({error: e.message});
    }
  }
}
