export default function Login({ onClose, onLogin, callRegister }) {
  return (
    <div className="log_reg-overlay" onClick={onClose}>
      <div className="log_reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log_reg-header">
          <h2>Belépés</h2>
          <div className="loginLine"></div>
          <button className="log_reg-close" onClick={onClose} aria-label="Bezárás">x</button>
        </div>

        <form className="login-form" onSubmit={(e) => {
            e.preventDefault();
          }}>
          <div className="log_reg-row">
            <label htmlFor="email">E-mail cím:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="log_reg-row">
            <label htmlFor="password">Jelszó:</label>
            <input type="password" id="password" name="password" required />
            <label htmlFor="forgot-password" className="forgot-psw">Elfelejtetted a jelszavad?</label>
          </div>
          <div className="log_reg-actions">
            <button type="submit" className="login-button" onClick={onLogin}>Belépés</button>
            <button type="button" className="register-button" onClick={callRegister}>Regisztráció</button>
          </div>
        </form>
      </div>
    </div>
  );
}