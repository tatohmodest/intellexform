/**
 * InTelleX SEO keyword bank - Cameroon-first tech education.
 * Used in root metadata, share cards, and on-page copy cues.
 */

export const CAMEROON_REGIONS = [
  { name: 'Adamawa', fr: 'Adamaoua', capital: 'Ngaoundéré', code: 'CM-AD' },
  { name: 'Centre', fr: 'Centre', capital: 'Yaoundé', code: 'CM-CE' },
  { name: 'East', fr: 'Est', capital: 'Bertoua', code: 'CM-ES' },
  { name: 'Far North', fr: 'Extrême-Nord', capital: 'Maroua', code: 'CM-EN' },
  { name: 'Littoral', fr: 'Littoral', capital: 'Douala', code: 'CM-LT' },
  { name: 'North', fr: 'Nord', capital: 'Garoua', code: 'CM-NO' },
  { name: 'Northwest', fr: 'Nord-Ouest', capital: 'Bamenda', code: 'CM-NW' },
  { name: 'South', fr: 'Sud', capital: 'Ebolowa', code: 'CM-SU' },
  { name: 'Southwest', fr: 'Sud-Ouest', capital: 'Buea', code: 'CM-SW' },
  { name: 'West', fr: 'Ouest', capital: 'Bafoussam', code: 'CM-OU' },
] as const;

export const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Bafoussam',
  'Buea',
  'Limbe',
  'Kribi',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Ebolowa',
  'Kumba',
  'Dschang',
  'Nkongsamba',
  'Edéa',
  'Foumban',
  'Bamenda Northwest',
  'Buea Southwest',
  'Bonabéri',
  'Akwa Douala',
  'Bastos Yaoundé',
  'Molyko Buea',
] as const;

/** HQ / primary place for geo meta + ImageObject contentLocation */
export const SITE_GEO = {
  country: 'Cameroon',
  countryCode: 'CM',
  region: 'Littoral',
  regionCode: 'CM-LT',
  city: 'Douala',
  placename: 'Douala, Littoral, Cameroon',
  /** WGS84 - Douala city centre */
  latitude: 4.0511,
  longitude: 9.7679,
  icbm: '4.0511, 9.7679',
  geoPosition: '4.0511;9.7679',
  address: 'Douala, Cameroon',
  phone: '+237650318856',
  email: 'intellex@loopingbinary.com',
} as const;

export const FOUNDER = {
  name: 'Tatoh Modest Wilton',
  role: 'Founder & CEO',
  company: 'Looping Binary',
  companyUrl: 'https://loopingbinary.com',
  product: 'InTelleX',
  productUrl: 'https://intellex.loopingbinary.com',
  profileUrl: 'https://tatohmodest.vercel.app',
  shortBio:
    'Tatoh Modest Wilton is the Founder and CEO of Looping Binary, the Cameroon-based technology company that builds InTelleX - the learning operating system for skills, mentorship, and campus education.',
} as const;

/**
 * 100+ high-intent + geo keywords for meta keywords / discovery.
 * Google largely ignores meta keywords; they still help some engines
 * and keep our content briefings consistent.
 */
export const SITE_KEYWORDS: string[] = [
  // Brand
  'InTelleX',
  'Intellex',
  'Intellex Cameroon',
  'Intellex Looping Binary',
  'intellex.loopingbinary.com',
  'Looping Binary',
  'LoopingBinary',
  'Tatoh Modest Wilton',
  'Tatoh Modest',
  'EduOS Cameroon',
  'learning operating system Cameroon',

  // Core product
  'online courses Cameroon',
  'tech education Cameroon',
  'coding bootcamp Cameroon',
  'learn to code Cameroon',
  'programming courses Cameroon',
  'digital skills Cameroon',
  'vocational training Cameroon',
  'e-learning Cameroon',
  'online learning Douala',
  'online learning Yaoundé',
  'AI tutor Cameroon',
  'live tutoring Cameroon',
  'mentorship Cameroon',
  'self-paced courses Africa',
  'edtech Cameroon',
  'edtech Douala',
  'edtech Yaoundé',
  'campus learning platform',
  'institution LMS Cameroon',
  'teacher course studio',
  'student tutorials Cameroon',

  // Skills
  'web development Cameroon',
  'JavaScript course Cameroon',
  'Python course Cameroon',
  'React course Cameroon',
  'Next.js course Cameroon',
  'Flutter course Cameroon',
  'data science Cameroon',
  'data analysis Cameroon',
  'cybersecurity Cameroon',
  'digital marketing Cameroon',
  'Django course Cameroon',
  'Node.js course Cameroon',
  'MongoDB course Cameroon',
  'PostgreSQL course Cameroon',
  'Docker Kubernetes Cameroon',
  'computer architecture tutorial',
  'HTML CSS JavaScript Cameroon',
  'mobile app development Cameroon',
  'cloud computing Cameroon',
  'CEH certification prep Cameroon',
  'Azure cloud Cameroon',

  // Geo - regions
  'tech education Northwest Cameroon',
  'coding courses Bamenda',
  'learn programming Bamenda',
  'online courses Northwest Region Cameroon',
  'tech education Southwest Cameroon',
  'coding courses Buea',
  'learn programming Buea',
  'online courses Southwest Region Cameroon',
  'tech education West Cameroon',
  'coding courses Bafoussam',
  'online courses West Region Cameroon',
  'tech education Littoral Cameroon',
  'coding courses Douala',
  'programming school Douala',
  'online courses Douala',
  'tech education Centre Cameroon',
  'coding courses Yaoundé',
  'programming school Yaoundé',
  'online courses Yaoundé',
  'tech education Far North Cameroon',
  'coding courses Maroua',
  'tech education North Cameroon',
  'coding courses Garoua',
  'tech education Adamawa Cameroon',
  'coding courses Ngaoundéré',
  'tech education East Cameroon',
  'coding courses Bertoua',
  'tech education South Cameroon',
  'coding courses Ebolowa',
  'Limbe tech courses',
  'Kribi digital skills',
  'Kumba online learning',
  'Dschang university tech skills',

  // Intent / French bilingual Cameroon market
  'cours en ligne Cameroun',
  'formation informatique Cameroun',
  'apprendre la programmation Cameroun',
  'cours de code Douala',
  'cours de code Yaoundé',
  'formation digitale Cameroun',
  'tutorat en ligne Cameroun',
  'mentorat tech Cameroun',
  'école de code Cameroun',
  'compétences numériques Cameroun',
  'formation professionnelle Cameroun',
  'éducation tech Afrique Centrale',
  'plateforme e-learning Cameroun',
  'certificat formation Cameroun',

  // Outcomes
  'skills to income Cameroon',
  'junior developer Cameroon',
  'internship Cameroon tech',
  'remote jobs skills Cameroon',
  'freelance coding Cameroon',
  'certifications Cameroon',
  'career switch tech Cameroon',
];

/** Compact geo phrase for image alt / captions */
export function geoImageAlt(title: string): string {
  return `${title} - InTelleX course image, tech education in Douala & across Cameroon (${SITE_GEO.placename})`;
}
