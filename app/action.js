"use server";

import fs from "fs";
import path from "path";

// File to persist registered emails across browsers/devices
const DATA_FILE = path.join(process.cwd(), ".submissions.json");

function getRegisteredEmails() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading submissions registry:", err);
  }
  return [];
}

function saveRegisteredEmail(email) {
  try {
    if (!email) return;
    const normalized = email.trim().toLowerCase();
    const emails = getRegisteredEmails();
    if (!emails.includes(normalized)) {
      emails.push(normalized);
      fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2));
    }
  } catch (err) {
    console.error("Error saving to submissions registry:", err);
  }
}

// Server action to check if email was already submitted
export const checkEmailSubmitted = async (email) => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const registered = getRegisteredEmails();
  return registered.includes(normalized);
};

//This file handle the registration form submission and contact us page data
const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL_REGISTRATION;
export const registrationData = async (formData) => {
  try {
    const email = formData.email?.trim().toLowerCase();
    const fullName = formData.fullName;
    const rollNumber = formData.rollNumber;
    const contactNumber = formData.contactNumber;
    const department = formData.department;
    const technicalSkills = formData.technicalSkills;
    const additionalSkills = formData.additionalSkills;
    const managementExperience = formData.managementExperience;
    const communicationSkills = formData.communicationSkills;
    const writingSkills = formData.writingSkills;
    const startupIdea = formData.startupIdea;
    const whyJoinIIC = formData.whyJoinIIC;
    const queries = formData.queries;

    // Server-side check: Block duplicate email submissions across any browser/device
    const registeredEmails = getRegisteredEmails();
    if (email && registeredEmails.includes(email)) {
      console.warn("Blocked duplicate submission attempt for email:", email);
      return {
        status: "already_submitted",
        message: "You have already submitted form with this email address!",
      };
    }

    if (!googleScriptUrl) {
      console.error("GOOGLE_SCRIPT_URL_REGISTRATION is not defined in environment variables.");
      return {
        status: "error",
        message: "Registration endpoint is not configured. Please set GOOGLE_SCRIPT_URL_REGISTRATION in your environment variables.",
      };
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        fullName,
        rollNumber,
        contactNumber,
        department,
        technicalSkills,
        additionalSkills,
        managementExperience,
        communicationSkills,
        writingSkills,
        startupIdea,
        whyJoinIIC,
        queries,
      }),
      redirect: "follow",
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // Google Apps Script successfully processed the POST and appended to the sheet
      if (response.ok || response.status === 200) {
        saveRegisteredEmail(email);
        return {
          status: "success",
          message: "Registration submitted successfully!",
        };
      }
      return {
        status: "error",
        message: "Failed to submit form. Please check your connection and try again.",
      };
    }

    if (result && typeof result === "object") {
      if (result.result === "success" || result.status === "success" || result.status === 200) {
        saveRegisteredEmail(email);
        return {
          status: "success",
          message: result.message || "Registration submitted successfully!",
        };
      }
      return result;
    }

    saveRegisteredEmail(email);
    return {
      status: "success",
      message: "Registration submitted successfully!",
    };
  } catch (error) {
    console.error("Error in registrationData action:", error);
    return {
      status: "error",
      message: "Failed to submit form. Please check your network connection and try again.",
    };
  }
};

const googleScriptUrlContactUs = process.env.GOOGLE_SCRIPT_URL_CONTACT_FORM;

export const contactUsData = async (formData) => {
  const name = formData.name;
  const email = formData.email;
  const message = formData.message;

  const response = await fetch(googleScriptUrlContactUs, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      message,
    }),
  });

  const result = await response.json();

  return result;
};
