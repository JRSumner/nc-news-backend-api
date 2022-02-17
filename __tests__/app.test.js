const request = require("supertest");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const { response, resource } = require("../db/app.js");

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
        .then((response) => {
          expect(response.body.message).toEqual("path not found");
        });
    });
    describe("PATCH requests", () => {
      test("status 404: responds with a path not found message", () => {
        const data = { votes: 1 };
        return request(app)
          .patch("/*")
          .expect(404)
          .send(data)
          .then((response) => {
            expect(response.body.message).toEqual("path not found");
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
      .then((response) => {
        const topicsArray = response.body.topics;
        expect(topicsArray.length).toBe(3);

        topicsArray.forEach((topic) => {
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
      .then((response) => {
        expect(response.body.articles).toEqual(
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
      .then((response) => {
        expect(response.body.msg).toEqual("no article matching that id");
      });
  });
  test("status 400: when passed invalid id, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("bad request");
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
  test("status 200: responds with an object with the inc_votes prop set to the amount of votes when passed a negative number of votes", () => {
    const numOfVotes = { votes: -100 };
    return request(app)
      .patch("/api/articles/3")
      .send(numOfVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
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
      .then((response) => {
        expect(response.body.msg).toEqual("no article matching that id");
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

describe("GET: /api/articles", () => {
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
  test("status 400: when passed invalid sort_by, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles/?sort_by=INVALID_REQUEST")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("bad request");
      });
  });
});
