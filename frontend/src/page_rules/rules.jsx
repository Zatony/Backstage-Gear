import rules from "./rules.module.css";

export default function Rules() {
  return (
    <div className={rules.textBox}>
      <h1>Szabályok</h1>

      <h2>1. Általános rendelkezések</h2>
      <p>
        A Backstage Gear célja egy biztonságos, kulturált és megbízható online
        piactér biztosítása a zenei hangszerek és audioeszközök adás-vételéhez.
        A platform használatával minden felhasználó elfogadja a jelen
        szabályzatban foglalt feltételeket.
      </p>

      <h2>2. Tiltott tartalmak és hirdetések</h2>
      <p>
        A Backstage Gear felületén tilos olyan hirdetéseket, képeket, leírásokat
        közzétenni, amelyek:
      </p>
      <ul>
        <li>
          kompromittáló, megbotránkoztató, obszcén vagy erőszakos tartalmat
          tartalmaznak,
        </li>
        <li>
          gyűlöletkeltőek, diszkriminatívak vagy más személyek emberi méltóságát
          sértik,
        </li>
        <li>
          megtévesztőek, valótlan információt tartalmaznak a termék állapotáról,
          eredetéről vagy áráról,
        </li>
        <li>
          lopott, hamisított vagy jogellenesen megszerzett termékek
          értékesítésére irányulnak,
        </li>
        <li>
          reklám- vagy spam jellegűek, amelyek nem kapcsolódnak a platform
          céljához.
        </li>
      </ul>

      <h2>3. Felhasználói felelősség</h2>
      <p>
        A felhasználók teljes felelősséget vállalnak az általuk feltöltött
        hirdetések tartalmáért, azok jogszerűségéért és valóságtartalmáért.
      </p>

      <h2>4. Jelentési rendszer</h2>
      <p>
        Amennyiben egy felhasználó olyan hirdetéssel vagy tartalommal
        találkozik, amely véleménye szerint megsérti a szabályzatot, jogosult
        azt a platformon keresztül jelenteni. A jelentések célja a közösség
        védelme és a felület minőségének fenntartása.
      </p>

      <h2>5. Adminisztrátori elbírálás és intézkedések</h2>
      <p>
        A beérkezett jelentéseket a Backstage Gear adminisztrátorai egyedileg
        bírálják el. A vizsgálat eredményétől függően az alábbi intézkedések
        kerülhetnek alkalmazásra:
      </p>
      <ul>
        <li>a kifogásolt hirdetés törlése,</li>
        <li>
          súlyos vagy ismétlődő szabálysértés esetén a felhasználói fiók
          végleges törlése.
        </li>
      </ul>
      <p>
        Az adminisztrátori döntések a platform biztonságát és a közösség
        érdekeit szolgálják, és azok ellen külön jogorvoslati lehetőség nem
        biztosított.
      </p>

      <p>
        <strong>
          A szabályzat célja egy tiszta, korrekt és biztonságos közösség
          fenntartása, ahol a zenélés és az alkotás öröme áll a középpontban.
        </strong>
      </p>
    </div>
  );
}
