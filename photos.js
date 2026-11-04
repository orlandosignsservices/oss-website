// Fotos exactamente como están en Wix (1 nov 2026), por página y sección.
const j = (id) => id + ".jpg";
module.exports = function apply(W, L) {
  // HOME
  W.home.heroPhoto = j("c33736_297144"); // Mikado Sushi
  W.home.aboutPhoto = j("c33736_1f9cce"); // Saku de noche (foto real; el pylon OSS al atardecer era generado con IA, quitado 4 nov 2026)
  W.home.tiles[0][2] = j("c33736_ca2798"); // Ji Bei Chuan flush mount (collage original)
  W.home.tiles[1][2] = j("c33736_cb2a53"); // Coin Laundry contour lightbox
  W.home.tiles[2][2] = j("c33736_d18eaa"); // pylon
  W.home.tiles[3][2] = j("c33736_819ac0"); // interior lobby
  W.home.tiles[4][2] = j("06307d_12a5ec"); // Avia monument
  W.home.tiles[5][2] = j("c33736_25e10f"); // Saku antes y después lado a lado (3 nov 2026) // Saku pole before/after
  W.home.gallery = [
    ["c33736_c8fd0f", "Relax or Knot Chair Massage halo-lit storefront sign installation, Central Florida"],
    ["c33736_fcd189", "Modani Furniture illuminated channel letter sign at night, Central Florida"],
    ["c33736_5cc3a1", "Mikado Sushi storefront channel letters installed in Central Florida"],
    ["c33736_0a41f7", "Mikado Sushi channel letter sign installation in Orlando, FL"],
    ["c33736_0ecda4", "Yamato Sushi Steak House storefront sign installation, Central Florida"],
    ["c33736_1f9cce", "Saku Sauna & Massage illuminated channel letter sign at night, Orlando FL"],
    ["c33736_a16424", "Saku Sauna & Massage pylon sign installation in Orlando, FL"],
    ["c33736_31d66f", "Supermarket exterior building sign installation, Central Florida"],
    ["c33736_7a62af", "Coin Laundry channel letter sign installation in Orlando FL"],
    ["c33736_431ed6", "Spa Nails salon sign installation Orlando FL"],
  ].map(([f, a]) => [j(f), a]);

  // ABOUT
  W.about.heroPhoto = "adobe_674401807.jpg"; // Our Mission: pantallas de Adobe Stock (sin personas)
  W.about.whoPhoto = j("c33736_0a41f7"); // Mikado Sushi

  // SERVICES (círculos de cada servicio)
  W.services.heroPhoto = j("06307d_d58e03");
  const svc = ["06307d_d58e03", "c33736_e36c30", "06307d_12a5ec", "c33736_7178b6", "c33736_970f76", "c33736_cb2a53"];
  W.services.list.forEach((s, i) => (s[3] = j(svc[i])));

  // PÁGINAS DE INSTALACIÓN: foto principal + galería "Recent ..."
  const channelGallery = ["06307d_559a98", "06307d_715008", "06307d_eea0e4", "06307d_38874a", "c33736_431ed6", "c33736_7a62af"];
  const map = {
    "channel-letter-installation": ["c33736_1920f0", channelGallery],
    "pylon-sign-installation": ["c33736_9943c4", ["06307d_912310", "06307d_a434ef", "06307d_fede1b", "06307d_6d8bca", "06307d_d3a3c6"]],
    "monument-sign-installation": ["06307d_12a5ec", ["06307d_bde9d7", "06307d_ce3ac0", "06307d_112cc8", "06307d_6e93ce", "06307d_45de19"]],
    "cabinet-sign-installation": ["c33736_7178b6", ["06307d_4701c6", "06307d_b689bb", "06307d_be1330", "06307d_902c4a", "06307d_1417bd"]],
    "interior-sign-installation": ["c33736_970f76", ["06307d_56774e", "06307d_ae3193", "06307d_ec99cc", "06307d_9784a1", "06307d_3b30ba", "c33736_354056"]],
    "sign-removal-rebranding": ["c33736_25e10f", ["c33736_ac6f05", "c33736_de62ad", "c33736_c8c0fe", "c33736_8f2fec", "c33736_43cd17"]],
  };
  W.installs.forEach((P) => {
    const [main, gal] = map[P.slug];
    P.mainPhoto = j(main);
    P.photos = gal.map(j);
  });
  W.partner.mainPhoto = j("c33736_1f9cce"); // Saku de noche
  W.partner.photos = channelGallery.map(j);
  W.repair.mainPhoto = "sanford-relax-or-knot-chair-massage.jpg"; // Relax or Knot de noche (Os, 4 nov 2026)
  W.repair.photos = channelGallery.map(j);

  W.work.groups = [
    ["RECENT CHANNEL LETTER INSTALLATIONS", channelGallery],
    ["RECENT PYLON SIGNS INSTALLATIONS", map["pylon-sign-installation"][1]],
    ["RECENT MONUMENT SIGN INSTALLATIONS", map["monument-sign-installation"][1]],
    ["RECENT CABINET SIGN INSTALLATIONS", map["cabinet-sign-installation"][1]],
    ["RECENT INTERIOR SIGN INSTALLATIONS", map["interior-sign-installation"][1]],
    ["RECENT SIGN REMOVAL PROJECTS", map["sign-removal-rebranding"][1]],
  ].map(([t, g]) => [t, g.map(j)]);
  W.contact.photo = "adobe_674401807.jpg"; // Adobe Stock #674401807 (colección gratis, licenciada en la cuenta de Adobe de Os, 2 nov 2026)

  // SIGN REPAIR LOCAL: fotos de tu Wix según el tipo de reparación
  const R = {
    "led-sign-repair": ["06307d_715008", "c33736_1f9cce", "c33736_431ed6"],
    "sign-face-replacement": ["c33736_cb2a53", "c33736_7178b6", "c33736_ac6f05"], // fc722b quitada: era window vinyl, no face (Os 4 nov),
    "channel-letter-repair": ["06307d_559a98", "06307d_eea0e4", "06307d_38874a"],
    "sign-lighting-power-repair": ["c33736_1f9cce", "c33736_7178b6", "c33736_5cc3a1"],
    "neon-to-led-conversion": ["c33736_c8fd0f", "c33736_fcd189", "c33736_0ecda4"],
    "sign-cleaning": ["c33736_7a62af", "c33736_cb2a53", "c33736_ca2798"],
    "sign-maintenance": ["c33736_431ed6", "c33736_7a62af", "c33736_0a41f7"],
    "pylon-pole-sign-repair": ["c33736_a16424", "c33736_8f2fec", "c33736_d18eaa"],
  };
  L.repairs.forEach((r) => (r.photos = R[r.slug].map(j)));

  // FOTO DE FONDO DE CADA ZONA: solo un trabajo real hecho en esa zona.
  // Si la zona no tiene foto propia, va el pylon de Orlando Signs Services al atardecer (sin cliente ni ciudad).
  const neutral = j("c33736_297144"); // Mikado Sushi (foto real)
  const areaPhoto = {
    "altamonte-springs": j("06307d_715008"), // Sushi Rock (Os, 3 nov 2026: es de Altamonte Springs)
    "downtown-orlando": j("c33736_7a62af"), // Coin Laundry (Os, 3 nov 2026: Downtown Orlando)
    kissimmee: j("c33736_0ecda4"),
    "winter-park": j("c33736_431ed6"), // Spa Nails (Os, 3 nov 2026)
    "waterford-lakes": "waterford-lakes-peoples-tax.jpg", // The People's Tax (Os, 3 nov 2026; recortada sin la mesa ni la bolsa)
    clermont: "clermont-lemont-coffee-lounge.jpg", // LeMont Coffee Lounge (Os, 3 nov 2026; recortada sin escalera ni herramientas)
    "ucf-east-orlando": j("c33736_1f9cce"), // Saku Sauna & Massage de noche (Os, 3 nov 2026: East Orlando)
    sanford: "sanford-relax-or-knot-chair-massage.jpg", // Relax or Knot Chair Massage (foto que mandó Os, 3 nov 2026)
    millenia: "millenia-mattress-mars.jpg", // Mattress Mars (Os, 3 nov 2026; recortada sin el parqueo)
    "dr-phillips": "dr-phillips-bay-hill-jewelers.jpg", // Bay Hill Jewelers (Os, 3 nov 2026; recortada sin el equipo abajo)
    "international-drive": "international-drive-cafe-tu-tu-tango.jpg", // Cafe Tu Tu Tango (Os, 3 nov 2026)
    "lake-nona": "lake-nona-nona-park-monument.jpg", // Nona Park monument (Os, 3 nov 2026; recortada sin herramientas en el piso) // Yamato Sushi Steak House (Os, 3 nov 2026: Yamato y Mikado son de Kissimmee)
  };
  L.areas.forEach((a) => (a.photo = areaPhoto[a.slug] || neutral));
};
