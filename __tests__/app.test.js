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
  test("status 404: responds with a path not found message", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
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
  test("status 404: when passed invalid id, responds with 'bad request'", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("bad request");
      });
  });
});
