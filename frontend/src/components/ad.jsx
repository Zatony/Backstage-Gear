export default function Ad({adName, adDesc, adImg, adPrice, page}) {
  return (
    <div className={page.ad}>
        <img src={adImg} alt={adImg} />

      <div className={page.adText_Button}>
        <h3>{adName}</h3>
        <p>{adDesc}</p>
        <h2>{adPrice.toLocaleString("hu-HU")} Ft</h2>
        <button>Kosárba</button>
      </div>
    </div>
  );
}
