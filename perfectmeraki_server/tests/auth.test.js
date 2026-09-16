process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

jest.mock("../models/User");
jest.mock("../config/db", () => jest.fn().mockResolvedValue(undefined));

const request = require("supertest");
const User = require("../models/User");
const app = require("../server");

function fakeUser(overrides = {}) {
  return {
    _id: "507f1f77bcf86cd799439011",
    name: "Test User",
    email: "test@example.com",
    phoneNumber: "1234567890",
    role: "user",
    matchPassword: jest.fn().mockResolvedValue(true),
    getSignedJwtToken: jest.fn().mockReturnValue("fake-access-token"),
    getSignedRefreshToken: jest.fn().mockReturnValue("fake-refresh-token"),
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("POST /api/auth/register", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects an invalid body before touching the database", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "", email: "not-an-email", phoneNumber: "123", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it("rejects a duplicate email", async () => {
    User.findOne.mockResolvedValue(fakeUser());

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "1234567890",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("creates a user and sets an httpOnly refresh cookie", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(fakeUser());

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "1234567890",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("fake-access-token");
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.password).toBeUndefined();

    const cookies = res.headers["set-cookie"] || [];
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
    expect(cookies.some((c) => /HttpOnly/i.test(c))).toBe(true);
  });
});

describe("POST /api/auth/login", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects an unknown email", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("rejects a wrong password", async () => {
    User.findOne.mockResolvedValue(fakeUser({ matchPassword: jest.fn().mockResolvedValue(false) }));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("logs in with correct credentials", async () => {
    User.findOne.mockResolvedValue(fakeUser());

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe("fake-access-token");
  });
});

describe("Role-guarded admin routes", () => {
  afterEach(() => jest.clearAllMocks());

  it("blocks a request with no token", async () => {
    const res = await request(app).get("/api/admin/getAllAdmins");
    expect(res.status).toBe(401);
  });

  it("blocks a request with an invalid token", async () => {
    const res = await request(app)
      .get("/api/admin/getAllAdmins")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  it("blocks a non-admin user from an admin-only route", async () => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: "507f1f77bcf86cd799439011" }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    User.findById.mockResolvedValue(fakeUser({ role: "user" }));

    const res = await request(app)
      .get("/api/admin/getAllAdmins")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("allows an admin through to the route handler", async () => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: "507f1f77bcf86cd799439011" }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    User.findById.mockResolvedValue(fakeUser({ role: "admin" }));
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      }),
    });

    const res = await request(app)
      .get("/api/admin/getAllAdmins")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Public browse routes require no auth", () => {
  it("returns products without a token", async () => {
    const Product = require("../models/Product");
    jest.spyOn(Product, "find").mockResolvedValue([]);

    const res = await request(app).post("/api/admin/getProductsByType").send({ type: "danglers" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
