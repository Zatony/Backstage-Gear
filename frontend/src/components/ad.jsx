export default function Ad({adName, adDesc, adImg}){
  return (
    <div className="ad">
        <div className="adImage"><img src={adImg} alt={adImg} /></div>

      <div className="adText_Button">
        <h2>{adName}</h2>
        <p>{adDesc}</p>
        <button>Kosárba</button>
      </div>
    </div>
  );
}
