function Section({ id, title, subtitle, action, children }) {
  return (
    <section className="library-section" id={id}>
      <div className="section-heading">
        <div>
          <span className="section-kicker">THƯ VIỆN CỦA BẠN</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default Section;
