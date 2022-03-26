const request = require("supertest");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => seed(data));

describe("Global tests", () => {
  describe("GET requests", () => {
    test("status 404: responds with a path not found message", () => {
      return request(app)
        .get("/*")
        .expect(404)
        .then(({ body: message }) => {
          expect(message).toEqual({ message: "path not found" });
        });
    });
    describe("PATCH requests", () => {
      test("status 404: responds with a path not found message", () => {
        const data = { votes: 1 };
        return request(app)
          .patch("/*")
          .expect(404)
          .send(data)
          .then(({ body: message }) => {
            expect(message).toEqual({ message: "path not found" });
          });
      });
    });
  });
});

describe("GET: /api/topics", () => {
  test("status 200: responds with an array of topic objects, each of which should have the following properties 'slug' & 'description' ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("status 200: responds with an articles object with the following properties author (which is username), title, article_id, body, topic, created_at and votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status 404: when passed valid but non-existent id, responds with 'no article matching that id'", () => {
    return request(app)
      .get("/api/articles/1337")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("no article matching that id");
      });
  });
  test("status 400: when passed invalid id, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
  test("status 200: responds with an article object which will include a 'comment_count' property", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual(
          expect.objectContaining({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: "2",
          })
        );
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("status 200: responds with an object with the inc_votes prop set to the amount of votes when passed a positive number of votes", () => {
    const numOfVotes = { votes: 1 };
    return request(app)
      .patch("/api/articles/5")
      .send(numOfVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 1,
          })
        );
      });
  });
  test("status 200: responds with an object with the inc_votes prop set to the amount of votes when passed a negative number of votes", () => {
    const numOfVotes = { votes: -100 };
    return request(app)
      .patch("/api/articles/3")
      .send(numOfVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: -100,
          })
        );
      });
  });
  test("status 400: when passed invalid votes data type, responds with 'bad request'", () => {
    const numOfVotes = { votes: "hello" };
    return request(app)
      .patch("/api/articles/8")
      .send(numOfVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("status 400: when passed an empty object, responds with 'bad request'", () => {
    const numOfVotes = {};
    return request(app)
      .patch("/api/articles/4")
      .send(numOfVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("status 404: when passed valid but non-existent id, responds with 'no article matching that id'", () => {
    const numOfVotes = { votes: 1 };
    return request(app)
      .patch("/api/articles/1337")
      .send(numOfVotes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("no article matching that id");
      });
  });
});

describe("GET: /api/users", () => {
  test("status 200: response with an array of object, each object should have a 'username' property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: users }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe.only("GET: /api/articles", () => {
  test("status 200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status 200: responds with an array of article objects sorted by the query", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200: checks the default sort order is descending when not passed a sort_by", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 400: when passed invalid sort_by, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles?sort_by=INVALID")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
  test("status 200: response with an array of article objects which will include a 'comment_count' property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: articles }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("status 200: responds with an array of article objects orders by descending", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=DESC")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200: responds with an array of article objects orders by ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=ASC")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("status 200: responds with an array of article objects defaults to descending when order isn't specified", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200: responds with an array of article objects filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: articles }) => {
        articles.forEach((article) => {
          console.log(article);
          expect(article.topic).toEqual("mitch");
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("Status 200: responds an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: comments }) => {
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("Status 200: responds with an array of comment objects relating to the article_id provided", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: comments }) => {
        comments.forEach((comment) => {
          expect(comment.article_id).toEqual(1);
        });
      });
  });
  test("status 404: when passed valid but non-existent id, responds with 'no article matching that id'", () => {
    return request(app)
      .get("/api/articles/1337/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("no article matching that id");
      });
  });
  test("status 400: when passed invalid id, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("bad request");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("status 200: responds with a comment object that contains the expected comment details", () => {
    const testComment = {
      body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
      username: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status 400: responds with 'bad request' when a user tries to post and empty comment", () => {
    const testComment = {
      body: "",
      username: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
});

describe("DELETE: /api/comments/comment_id", () => {
  test("status 200: responds with a comment object containing the deleted comments details", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: expect.any(String),
            article_id: 9,
            author: "butter_bridge",
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status 404: when passed valid but non-existent id, responds with 'no comment matching that id'", () => {
    return request(app)
      .delete("/api/comments/1337")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("no comment matching that id");
      });
  });
  test("status 400: when passed valid but non-existent id, responds with 'bad request'", () => {
    return request(app)
      .delete("/api/comments/invalid-request")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
});

describe("GET: /api", () => {
  test("status 200: returns an object containing details of all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "PATCH /api/comments/:comment_id": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
            "GET /api/users/:username": expect.any(Object),
          })
        );
      });
  });
});

describe("GET: /api/users/:username", () => {
  test("status 200: returns a user object with username, avatar_url and name properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
  });
  test("status 404: returns an error when passed a valid but none existent username", () => {
    return request(app)
      .get("/api/users/validButNoneExistentUserName")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("no user matching that id");
      });
  });
  test("status 400: returns an error when passed an in-valid username", () => {
    return request(app)
      .get("/api/users/$$$")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("status 200: returns a comment object with the votes increased by the numOfVotes", () => {
    const numOfVotes = { votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(numOfVotes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status 200: checks the votes property on the comment object has been incremented correctly", () => {
    const numOfVotes = { votes: 100 };
    return request(app)
      .patch("/api/comments/1")
      .send(numOfVotes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toEqual(100);
      });
  });
  test("status 200: checks the votes property on the comment object has been decremented correctly", () => {
    const numOfVotes = { votes: -1 };
    return request(app)
      .patch("/api/comments/2")
      .send(numOfVotes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toEqual(-1);
      });
  });
  test("status 400: returns an error if passed an invalid vote property", () => {
    const numOfVotes = { votes: "Not a number" };
    return request(app)
      .patch("/api/comments/2")
      .send(numOfVotes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("bad request");
      });
  });
  test("status 404: returns an error if passed an valid but none existent comment_id", () => {
    const numOfVotes = { votes: 1 };
    return request(app)
      .patch("/api/comments/1337")
      .send(numOfVotes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("no comment matching that id");
      });
  });
});
