import jsbCrownLogo from '../assets/images/jsb_crown_logo_1787524043859.jpg';
import jsbCrownEmblem from '../assets/images/jsb_crown_emblem_1787326196081.jpg';
import jsbBandLogo from '../assets/images/jsb_band_logo_1787260167707.jpg';
import jsbOfficialLogo from '../assets/images/jsb_official_logo_1787277853304.jpg';

export interface PredefinedLogo {
  id: string;
  name: string;
  url: string;
  description: string;
  isCustom?: boolean;
}

export const PREDEFINED_BAND_LOGOS: PredefinedLogo[] = [
  {
    id: 'logo-crown-deluxe',
    name: 'Logo Oficial Dourado (JSB)',
    url: jsbCrownLogo,
    description: 'Logotipo clássico com coroa dourada e tipografia Jet Samba Black'
  },
  {
    id: 'logo-crown-emblem',
    name: 'Emblema da Coroa Imperial',
    url: jsbCrownEmblem,
    description: 'Brasão premium com coroa em ouro e tipografia samba black'
  },
  {
    id: 'logo-band-shield',
    name: 'Escudo & Marca Jet',
    url: jsbBandLogo,
    description: 'Escudo comemorativo de palco e materiais de turnê'
  },
  {
    id: 'logo-stamp-official',
    name: 'Selo Oficial 2026',
    url: jsbOfficialLogo,
    description: 'Selo gráfico moderno para banners e mídias sociais'
  },
  {
    id: 'logo-official-gold-stage',
    name: 'Selo Dourado Palco',
    url: jsbCrownLogo,
    description: 'Visual brilhante de alta definição para destaque'
  },
  {
    id: 'logo-emblem-dark-alt',
    name: 'Emblema Preto & Ouro',
    url: jsbCrownEmblem,
    description: 'Visual minimalista elegante para contrastes em fundo escuro'
  }
];

export const DEFAULT_BAND_LOGO = jsbCrownLogo;

