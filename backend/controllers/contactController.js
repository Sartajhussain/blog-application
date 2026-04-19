import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    // ✅ validation
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // ✅ COOLDOWN CHECK (FIRST)
    const lastMsg = await Contact.findOne({ email })
      .sort({ createdAt: -1 });

    if (lastMsg && Date.now() - lastMsg.createdAt < 60000) {
      return res.status(400).json({
        success: false,
        message: "Wait 1 minute before sending again",
      });
    }
    // ✅ save to DB
    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact: newContact,
    });


  } catch (error) {
    console.log("CONTACT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};