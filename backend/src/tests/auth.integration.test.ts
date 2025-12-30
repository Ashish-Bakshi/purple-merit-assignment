import request from "supertest";
import app from "../index";

describe("Auth Integration Test", () => {
  const testUser = {
    fullName: "Integration User2",
    email: `integration_${Date.now()}@test.com`,
    password: "Password123",
  };

  test("Signup → Login → Auth Me flow works", async () => {
    // 1. Signup
    const signupRes = await request(app)
      .post("/auth/signup")
      .send(testUser);

    expect(signupRes.status).toBe(201);

    // 2. Login
    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    const cookies = loginRes.headers["set-cookie"];

    // 3. Get current user using cookie
    const meRes = await request(app)
      .get("/auth/me")
      .set("Cookie", cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(testUser.email);
  });
});
