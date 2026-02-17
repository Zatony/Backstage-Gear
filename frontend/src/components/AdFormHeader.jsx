export default function AdFormHeader({ page, title }) {
  const isNewAd = page.newAdTextContainer !== undefined;

  return (
    <>
      <div className={isNewAd ? page.newAdTextContainer : page.editAdTextContainer}>
        <h1 className={isNewAd ? page.newAdText : page.editAdText}>{title}</h1>
        <div className={isNewAd ? page.newAdLine : page.editAdLine}></div>
      </div>
    </>
  );
}
