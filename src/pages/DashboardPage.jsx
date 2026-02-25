import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePropertyRequest, listPropertiesRequest } from "../api/propertyApi";
import PropertyTable from "../components/PropertyTable";
import useAuth from "../hooks/useAuth";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dashboardStats = useMemo(() => {
    const published = items.filter((item) => item.status === "published").length;
    const draft = items.filter((item) => item.status === "draft").length;
    const archived = items.filter((item) => item.status === "archived").length;

    return [
      {
        title: "Total Listings",
        value: meta.total || 0,
        helper: "Across all pages",
      },
      {
        title: "Published",
        value: published,
        helper: "Visible to customers",
      },
      {
        title: "Draft",
        value: draft,
        helper: "Not yet public",
      },
      {
        title: "Archived",
        value: archived,
        helper: "Hidden from listings",
      },
    ];
  }, [items, meta.total]);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await listPropertiesRequest(token, {
        page: String(page),
        limit: "10",
        status,
        search,
      });

      setItems(response.data);
      setMeta(response.meta || { page, totalPages: 1 });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, status, search]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (property) => {
    const shouldDelete = window.confirm(`Delete "${property.title}"? This cannot be undone.`);
    if (!shouldDelete) {
      return;
    }

    try {
      await deletePropertyRequest(token, property._id);
      if (items.length === 1 && page > 1) {
        setPage((current) => current - 1);
        return;
      }
      loadProperties();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > (meta.totalPages || 1)) {
      return;
    }
    setPage(nextPage);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setPage(1);
    setStatus(event.target.value);
  };

  return (
    <section className="dashboard-scene">
      <div className="dashboard-hero animate-fade-up">
        <div>
          <p className="hero-kicker">Property Dashboard</p>
          <h2>Manage Listings</h2>
          <p>Create, edit, publish, and remove property listings with media.</p>
        </div>
        <button type="button" className="button" onClick={() => navigate("/properties/new")}>
          Add Property
        </button>
      </div>

      <div className="dashboard-metrics">
        {dashboardStats.map((item) => (
          <article key={item.title} className="metric-card animate-fade-up">
            <p>{item.title}</p>
            <h3>{item.value}</h3>
            <span>{item.helper}</span>
          </article>
        ))}
      </div>

      <form className="filter-panel animate-fade-up" onSubmit={handleSearchSubmit}>
        <div className="filter-row">
          <input
            placeholder="Search title, location, description..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select value={status} onChange={handleStatusChange}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button type="submit" className="button button-secondary">
            Apply Filters
          </button>
        </div>
      </form>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="dashboard-table-wrap animate-fade-up">
        <PropertyTable
          items={items}
          loading={loading}
          onDelete={handleDelete}
          page={meta.page || page}
          totalPages={meta.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
