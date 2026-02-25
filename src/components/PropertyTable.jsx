import { Link } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) => new Date(value).toLocaleDateString();
const getCoverMedia = (property) => (Array.isArray(property.media) ? property.media[0] : null);

const PropertyTable = ({
  items,
  loading,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return <div className="panel panel-muted">Loading properties...</div>;
  }

  if (!items.length) {
    return <div className="panel panel-muted">No properties found.</div>;
  }

  return (
    <div className="panel table-panel">
      <div className="table-wrapper">
        <table className="property-table">
          <thead>
            <tr>
              <th>Listing</th>
              <th>Status</th>
              <th>Price</th>
              <th>Media</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((property) => {
              const coverMedia = getCoverMedia(property);

              return (
                <tr key={property._id}>
                  <td>
                    <div className="listing-cell">
                      <div className="listing-thumb">
                        {coverMedia ? (
                          coverMedia.kind === "video" ? (
                            <video src={coverMedia.url} muted playsInline />
                          ) : (
                            <img src={coverMedia.url} alt={property.title} />
                          )
                        ) : (
                          <span>No media</span>
                        )}
                      </div>
                      <div className="listing-meta">
                        <strong>{property.title}</strong>
                        <small>{property.location}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${property.status}`}>
                      {property.status}
                    </span>
                  </td>
                  <td>{formatPrice(property.price)}</td>
                  <td>{property.media?.length || 0} files</td>
                  <td>{formatDate(property.updatedAt)}</td>
                  <td className="table-actions">
                    <Link to={`/properties/${property._id}/edit`} className="button button-light">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => onDelete(property)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyTable;
