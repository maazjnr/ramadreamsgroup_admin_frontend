const MediaGrid = ({ items, selectable = false, selected = [], onToggle }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="media-grid">
      {items.map((item) => {
        const checked = selectable && selected.includes(item.id);
        return (
          <label key={item.id} className="media-card">
            {item.kind === "video" ? (
              <video src={item.url} controls />
            ) : (
              <img src={item.url} alt={item.label} />
            )}

            {selectable ? (
              <div className="media-meta">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                />
                <span>Remove this media</span>
              </div>
            ) : (
              <p className="media-label">{item.label}</p>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default MediaGrid;
