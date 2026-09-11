const request = require("supertest");
const app = require("../src/app.js");

describe("application api", () => {
  test("health endpoint is running properly", async () => {
    const result = await request(app).get("/health");
    expect(result.status).toBe(200);
    expect(result.body.status).toBe("UP");
  });

  test("add endpoint calculates perfectly", async () => {
    const result = await request(app).get("/api/add?a=20&b=5");
    expect(result.status).toBe(200);
    expect(result.body.result).toBe(25);
  });

  test("multiply endpoint works perfectly", async () => {
    const result = await request(app).get("/api/multiply?a=2&b=22");
    expect(result.status).toBe(200);
    expect(result.body.result).toBe(44);
  });

  test("reject inappropriate values in multiply endpoint", async () => {
    const result = await request(app).get("/api/multiply?a=hello&b=5");
    expect(result.status).toBe(400);
  });
});
