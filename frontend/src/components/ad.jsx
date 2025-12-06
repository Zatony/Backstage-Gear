export default function Ad({adName, adDesc, adImg, adPrice}) {
  return (
    <div className="ad">
        <img src={adImg} alt={adImg} />

      <div className="adText_Button">
        <h3>{adName}</h3>
        <p>{adDesc}</p>
        <h2>{adPrice} Ft</h2>
        <button>Kosárba</button>
      </div>
    </div>
  );
}
