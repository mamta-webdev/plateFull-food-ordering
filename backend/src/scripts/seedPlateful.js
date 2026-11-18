
require("dotenv").config();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const foodPartnerModel = require("../models/foodPartner.model");
const foodModel = require("../models/foodItem.model");

const { foodPartners, foodItems } = require("../data/platefulSeedData");

async function seedPlateful() {
  // Validate video URLs before making any database changes.
  for (const item of foodItems) {
    if (
      !item.videoUrl ||
      item.videoUrl.includes("REPLACE_WITH") ||
      !/^https?:\/\//i.test(item.videoUrl)
    ) {
      throw new Error(
        `Please add a valid video URL for "${item.name}" in platefulSeedData.js`
      );
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from your environment variables.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const partnerIds = new Map();

  // Create demo partners or reuse matching existing demo accounts.
  for (const partner of foodPartners) {
    let savedPartner = await foodPartnerModel.findOne({
      email: partner.email,
    });

    if (savedPartner) {
      if (savedPartner.businessName !== partner.businessName) {
        throw new Error(
          `The email ${partner.email} belongs to a different business.`
        );
      }

      console.log(`Partner already exists: ${partner.businessName}`);
    } else {
      const hashedPassword = await bcryptjs.hash(partner.password, 10);

      savedPartner = await foodPartnerModel.create({
        businessName: partner.businessName,
        ownerName: partner.ownerName,
        email: partner.email,
        password: hashedPassword,
      });

      console.log(`Created partner: ${partner.businessName}`);
    }

    partnerIds.set(partner.businessName, savedPartner._id);
  }

  // Create each food item and connect it to its partner.
  for (const item of foodItems) {
    const partnerId = partnerIds.get(item.foodPartnerName);

    if (!partnerId) {
      throw new Error(
        `Partner not found for food item: ${item.name}`
      );
    }

    const existingFood = await foodModel.findOne({
      name: item.name,
      foodPartner: partnerId,
    });

    if (existingFood) {
      console.log(`Food item already exists: ${item.name}`);
      continue;
    }

    await foodModel.create({
      name: item.name,
      description: item.description,
      price: item.price,
      videoUrl: item.videoUrl,
      foodPartner: partnerId,
    });

    console.log(`Created food item: ${item.name}`);
  }

  console.log("Plateful demo data seeding completed.");
}

seedPlateful()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
