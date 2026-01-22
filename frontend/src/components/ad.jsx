export default function Ad({adName, adDesc, adImg, adPrice, page, inCart}) {
  return (
    <div className={page.ad}>
        <img src={adImg} alt={adImg} />

      <div className={page.adText_Button}>
        <h3>{adName}</h3>
        <div className="row">
          <div className={`${page.adDescPriceBtn} col-sm-12 col-md-6 col-lg-4`}>
            <p>{adDesc}</p>
          </div>

          <div className={`${page.priceButtonGroup} col-sm-12 col-md-6 col-lg-4 align-text-bottom`}>
            <h2>{adPrice.toLocaleString("hu-HU")} Ft</h2>
            <button>{inCart ? "asd" : "Kosárba"}</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
