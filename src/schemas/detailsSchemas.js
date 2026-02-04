export const detailsSchemas = {
  "link-pro": {
    fields: [
      // Basic Info
      { name: "CompanyName", type: "text", label: "Company Name" },
      { name: "heading", type: "text", label: "Heading" },
      { name: "businessCategory", type: "text", label: "Business Category" },
      { name: "foundedYear", type: "text", label: "Founded Year" },
      { name: "tagline", type: "text", label: "Tagline" },

      // Contact
      { name: "email", type: "email", label: "Email" },
      { name: "phoneNumber", type: "tel", label: "Phone Number" },
      { name: "whatsappNumber", type: "tel", label: "WhatsApp Number" },
      { name: "website", type: "url", label: "Website" },

      // Social Links
      {
        name: "socialLinks",
        type: "array",
        label: "Social Media Links (Instagram, LinkedIn, Facebook, etc.)",
        multiple: true,
        itemSchema: {
          title: "",
          link: "",
        },
      },

      // Company Info
      {
        name: "companyInfo",
        type: "textarea",
        label: "Company Information",
      },
      // { name: "catalogue", type: "url", label: "Catalogue PDF URL" },

      // Founder / Vision
      { name: "founderName", type: "text", label: "Founder Name" },
      {
        name: "founderDescription",
        type: "textarea",
        label: "Founder Description",
      },
      {
        name: "founderMessage",
        type: "textarea",
        label: "Founder Message",
      },
      { name: "vission", type: "textarea", label: "Vision" },

      // Map & Apps
      { name: "mapEmbedLink", type: "url", label: "Google Map Link" },
      { name: "appStoreUrl", type: "url", label: "App Store URL" },
      { name: "playStoreUrl", type: "url", label: "Play Store URL" },
      { name: "youtubeVideo", type: "url", label: "YouTube Video URL" },

      // CTA
      { name: "ctaTitle", type: "text", label: "CTA Title" },
      { name: "ctaSubtitle", type: "text", label: "CTA Subtitle" },

      // Metrics
      {
        name: "ourNumbers",
        type: "array",
        label: "Our Numbers (like 100+ clients, 10+ years of experience, etc.)",
        multiple: true,
        itemSchema: {
          number: "",
          description: "",
        },
      },

      // Services
      {
        name: "ourServices",
        type: "array",
        label: "Our Services",
        multiple: true,
        itemSchema: {
          title: "",
          description: "",
        },
      },

      // Products
      {
        name: "ourProducts",
        type: "array",
        label: "Our Products",
        multiple: true,
        itemSchema: {
          title: "",
          price: "",
          description: "",
        },
      },

      // Why Choose Us
      {
        name: "whyChooseUs",
        type: "array",
        label: "Why Choose Us",
        multiple: true,
        itemSchema: {
          description: "",
        },
      },

      // Headquarters
      {
        name: "headquarters",
        type: "array",
        label: "Your Offices",
        multiple: true,
        itemSchema: {
          city: "",
          address: "",
          mapUrl: "",
        },
      },

      // Buttons
      // {
      //   name: "buttons",
      //   type: "array",
      //   label: "CTA Buttons",
      //   multiple: true,
      //   itemSchema: {
      //     label: "",
      //     url: "",
      //   },
      // },
    ],
  },
};
