export const emptyPropertyForm = {
  title: "",
  location: "",
  description: "",
  price: "0",
  propertyType: "other",
  status: "draft",
  bedrooms: "0",
  bathrooms: "0",
  toilets: "0",
  kitchens: "0",
  areaSqm: "0",
  featuresText: "",
};

export const mapPropertyToForm = (property) => ({
  title: property.title || "",
  location: property.location || "",
  description: property.description || "",
  price: String(property.price ?? 0),
  propertyType: property.propertyType || "other",
  status: property.status || "draft",
  bedrooms: String(property.bedrooms ?? 0),
  bathrooms: String(property.bathrooms ?? 0),
  toilets: String(property.toilets ?? 0),
  kitchens: String(property.kitchens ?? 0),
  areaSqm: String(property.areaSqm ?? 0),
  featuresText: Array.isArray(property.features) ? property.features.join(", ") : "",
});

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    formData.append(key, value);
  }
};

export const buildPropertyFormData = (values, files, removedMedia) => {
  const formData = new FormData();

  appendIfPresent(formData, "title", values.title.trim());
  appendIfPresent(formData, "location", values.location.trim());
  appendIfPresent(formData, "description", values.description.trim());
  appendIfPresent(formData, "price", values.price);
  appendIfPresent(formData, "propertyType", values.propertyType);
  appendIfPresent(formData, "status", values.status);
  appendIfPresent(formData, "bedrooms", values.bedrooms);
  appendIfPresent(formData, "bathrooms", values.bathrooms);
  appendIfPresent(formData, "toilets", values.toilets);
  appendIfPresent(formData, "kitchens", values.kitchens);
  appendIfPresent(formData, "areaSqm", values.areaSqm);

  const features = values.featuresText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  formData.append("features", JSON.stringify(features));
  formData.append("removedMedia", JSON.stringify(removedMedia));

  files.forEach((file) => formData.append("media", file));
  return formData;
};
