export default function HomeMenu({ onSelect }) {
  return (
    <div className="home-shell">
      <div className="home-card">
        <div className="home-header">
          <h1>Sticker Printing</h1>
          <p>Choose what you want to print</p>
        </div>

        <div className="home-buttons">
          <button
            type="button"
            className="home-btn"
            onClick={() => onSelect('gemba')}
          >
            <span className="home-btn-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21V9.5L12 3l9 6.5V21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 21v-6h8v6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12h.01M12 12h.01M15 12h.01M9 9h.01M12 9h.01M15 9h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="home-btn-text">
              <span className="home-btn-title">Gemba Number</span>
              <span className="home-btn-sub">Print Gemba stickers</span>
            </span>
            <span className="home-btn-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <button
            type="button"
            className="home-btn"
            onClick={() => onSelect('shade')}
          >
            <span className="home-btn-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3c3.5 4 6 7.2 6 10.5A6 6 0 1 1 6 13.5C6 10.2 8.5 7 12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 14.2c0 1.5 1.1 2.6 2.5 2.6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="home-btn-text">
              <span className="home-btn-title">Shade Number</span>
              <span className="home-btn-sub">Print shade stickers</span>
            </span>
            <span className="home-btn-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}