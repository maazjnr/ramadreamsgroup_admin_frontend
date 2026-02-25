import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createPropertyRequest,
  getPropertyRequest,
  updatePropertyRequest,
} from "../api/propertyApi";
import { toApiAssetUrl } from "../api/httpClient";
import useAuth from "../hooks/useAuth";
import {
  buildPropertyFormData,
  emptyPropertyForm,
  mapPropertyToForm,
} from "../utils/propertyForm";
import MediaGrid from "./MediaGrid";
const PROPERTY_TYPES = ["apartment", "duplex", "land", "villa", "office", "other"];
const PROPERTY_STATUSES = ["draft", "published", "archived"];
const ACCEPTED_MEDIA = "image/*,video/mp4,video/webm,video/quicktime,video/x-matroska";
const getExistingMediaId = (item) => item.publicId || item.filename || "";
const numberFields = [
  { name: "price", label: "Price (NGN)" },
  { name: "bedrooms", label: "Bedrooms" },
  { name: "bathrooms", label: "Bathrooms" },
  { name: "toilets", label: "Toilets" },
  { name: "kitchens", label: "Kitchens" },
  { name: "areaSqm", label: "Area (sqm)" },
];

const PropertyForm = ({ mode, propertyId }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  const [values, setValues] = useState(emptyPropertyForm);
  const [existingMedia, setExistingMedia] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;
    setLoading(true);

    getPropertyRequest(token, propertyId)
      .then((response) => {
        if (!isMounted) {
          return;
        }
        setValues(mapPropertyToForm(response.data));
        setExistingMedia(response.data.media || []);
        setRemovedMedia([]);
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isEditMode, token, propertyId]);

  useEffect(() => {
    const previews = newFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

    setNewFilePreviews(previews);

    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [newFiles]);

  const mediaCountAfterSubmit = useMemo(() => {
    const remainingExisting = existingMedia.filter(
      (item) => !removedMedia.includes(getExistingMediaId(item))
    );
    return remainingExisting.length + newFiles.length;
  }, [existingMedia, removedMedia, newFiles]);

  const existingMediaItems = useMemo(
    () =>
      existingMedia.map((item) => ({
        id: getExistingMediaId(item),
        kind: item.kind,
        url: toApiAssetUrl(item.url),
        label: item.filename || item.publicId || "media",
      })),
    [existingMedia]
  );

  const newMediaItems = useMemo(
    () =>
      newFilePreviews.map((item) => ({
        id: item.id,
        kind: item.type.startsWith("video/") ? "video" : "image",
        url: item.url,
        label: item.name,
      })),
    [newFilePreviews]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setNewFiles(files);
  };

  const toggleMediaRemoval = (filename) => {
    setRemovedMedia((current) => {
      if (current.includes(filename)) {
        return current.filter((item) => item !== filename);
      }
      return [...current, filename];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mediaCountAfterSubmit === 0) {
      setError("At least one image or video is required.");
      return;
    }

    const formData = buildPropertyFormData(values, newFiles, removedMedia);
    setSaving(true);

    try {
      if (isEditMode) {
        await updatePropertyRequest(token, propertyId, formData);
      } else {
        await createPropertyRequest(token, formData);
      }
      navigate("/");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="panel panel-muted">Loading property...</div>;
  }

  return (
    <form className="panel property-form property-editor" onSubmit={handleSubmit}>
      <div className="editor-header">
        <h2>{isEditMode ? "Edit Property" : "Create Property"}</h2>
        <p>Build complete listings with images, videos, and details.</p>
        <div className="editor-pills">
          <span>{isEditMode ? "Editing existing listing" : "Creating new listing"}</span>
          <span>{mediaCountAfterSubmit} media attached</span>
          <span>Status: {values.status}</span>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="editor-top-grid">
        <section className="editor-section animate-fade-up">
          <h3>Property Basics</h3>
          <div className="form-grid-two">
            <label className="form-field">
              <span>Title</span>
              <input
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Guzape Modern Duplex"
                required
              />
            </label>

            <label className="form-field">
              <span>Location</span>
              <input
                name="location"
                value={values.location}
                onChange={handleChange}
                placeholder="Guzape, Abuja"
                required
              />
            </label>
          </div>
        </section>

        <section className="editor-section animate-fade-up">
          <div className="form-grid-two">
            <label className="form-field">
              <span>Property Type</span>
              <select name="propertyType" value={values.propertyType} onChange={handleChange}>
                {PROPERTY_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Status</span>
              <select name="status" value={values.status} onChange={handleChange}>
                {PROPERTY_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-grid-three">
            {numberFields.map((field) => (
              <label key={field.name} className="form-field">
                <span>{field.label}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  required={field.name === "price"}
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <section className="editor-section animate-fade-up">
        <label className="form-field">
          <span>Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>

        <label className="form-field">
          <span>Features (comma separated)</span>
          <input
            name="featuresText"
            value={values.featuresText}
            onChange={handleChange}
            placeholder="Gated access, backup power, smart home"
          />
        </label>
      </section>

      <section className="editor-section animate-fade-up">
        <label className="form-field">
          <span>Upload Media</span>
          <input type="file" accept={ACCEPTED_MEDIA} multiple onChange={handleFileChange} />
        </label>

        {existingMedia.length ? (
          <h3>Existing Media</h3>
        ) : null}
        {existingMedia.length ? (
          <MediaGrid
            items={existingMediaItems}
            selectable
            selected={removedMedia}
            onToggle={toggleMediaRemoval}
          />
        ) : null}

        {newFilePreviews.length ? (
          <>
            <h3>New Uploads</h3>
            <MediaGrid items={newMediaItems} />
          </>
        ) : null}
      </section>

      <div className="form-actions sticky-actions">
        <Link to="/" className="button button-secondary">
          Cancel
        </Link>
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Update Property" : "Create Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
