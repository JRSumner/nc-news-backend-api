const request = require("supertest");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const { response } = require("../db/app.js");

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
        console.log(topicsArray);
        expect(topicsArray.length).toBe(3);

        topicsArray.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );

          expect(topic.hasOwnProperty("slug")).toEqual(true);
          expect(topic.hasOwnProperty("description")).toEqual(true);
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
