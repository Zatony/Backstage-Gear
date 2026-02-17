export default function AdFormActions({ page, submitting, error, buttonText }) {
  return (
    <>
      <div className={page.submitBtnWrapper}>
        <button type="submit" className={page.submitBtn} disabled={submitting}>
          {buttonText}
        </button>
      </div>

      {error && <p className={page.errorMsg}>{error}</p>}
    </>
  );
}
