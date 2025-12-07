export default function Registration({ onClose, onRegister }) {
  return (
    <div className="log_reg-overlay" onClick={onClose}>
      <div className="log_reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log_reg-header">
          <h2>Regisztráció</h2>
          <div className="registrationLine"></div>
          <button className="log_reg-close" onClick={onClose} aria-label="Bezárás">x</button>
        </div>

        <form className="registration-form" onSubmit={(e) => {
          e.preventDefault();
        }}>
        <div className="log_reg-row">
          <label htmlFor="username">Felhasználó név:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="log_reg-row">
          <label htmlFor="email">E-mail cím:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="log_reg-row">
          <label htmlFor="password">Jelszó:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="log_reg-row">
          <label htmlFor="rePassword">ismételt jelszó:</label>
          <input type="password" id="rePassword" name="rePassword" required />
        </div>
        <div className="log_reg-row">
          <label htmlFor="phone">Telefonszám:</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        <div className="log_reg-row">
          <label htmlFor="birthdate">Születési dátum:</label>
          <input type="date" id="birthdate" name="birthdate" required />
        </div>
        <div className="log_reg-actions">
          <button type="submit" className="registration-button" onClick={onRegister}>Regisztráció</button>
        </div>
        </form>
      </div>
    </div>
  );
}
