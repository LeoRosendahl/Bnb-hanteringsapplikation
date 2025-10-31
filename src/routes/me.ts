import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";

const meApp = new Hono();

meApp.get("/", requireAuth, async (c) => {
  const user = c.get("user");
console.log(user)
  if (!user) {
    return c.json({ error: "User not authenticated" }, 401);
  }

  // Returnera användarens data
  return c.json({
    id: user.id,
    email: user.email
    // name: user.name, // eller username om du använder det
    // isAdmin: user.isAdmin, 
  });
});

export default meApp;