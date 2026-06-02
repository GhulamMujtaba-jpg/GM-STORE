export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (email && password) {
      res.status(200).json({
        message: "Login successful",
        user: {
          email,
          role: email === "admin@gmail.com" ? "admin" : "client"
        }
      });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  }
}
