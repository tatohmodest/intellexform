import { Testimonial } from '@/lib/types';

const S3 = 'https://intellex-images.s3.eu-north-1.amazonaws.com/StudentPictures(InTelleX)';

/**
 * Student testimonials. The first three include short video testimonials and are
 * showcased in the animated video wall; the rest render as quote cards.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'cm7n7ndzq000021m8v1jsn6es',
    name: 'Mbeng Thelvis',
    testimonial:
      "I'm thoroughly impressed with InTelleX! The platform has been instrumental in my web development journey, offering professional, concise, and enjoyable courses at unbeatable prices. Initially skeptical, I quickly realized its immense value. I've gained expertise in Data Analysis, JavaScript, Next.js, React.js, Node.js, Express, MongoDB, and MySQL. Thank you, InTelleX, for your exceptional resources!",
    fieldOfInterest: 'FullStack Web Developer',
    rating: 5,
    photo: `${S3}/thelvis.jpg`,
    video: `${S3}/mbengvideo.mp4`,
  },
  {
    id: 'cm7n7neve000121m8r358d8zd',
    name: 'Eleazar',
    testimonial:
      'Intellex has given me a once in a life time opportunity to pursue my dreams by acquiring skills from the unlimited access to courses in any field of studies.',
    fieldOfInterest: 'Cyber Security',
    rating: 5,
    photo: `${S3}/WhatsApp+Image+2024-10-23+at+10.14.17_2f51c865.jpg`,
    video: `${S3}/eleazarvideo.mp4`,
  },
  {
    id: 'cm7n7nfvn000221m8b3bashfo',
    name: 'Fah Ferrand Njoh',
    testimonial:
      'Acquiring customers is one thing, keeping them is another thing. What I enjoy most with the intellex community is the awareness of "customer care". They provide valuable resources and go all the way to ensure their clients enjoy both the resources and the hospitality of customer care. This is why I enjoy the intellex community and choose to stick with them.',
    fieldOfInterest: 'Cyber Security',
    rating: 5,
    photo: `${S3}/ferrand.jpg`,
    video: `${S3}/feranvideo.mp4`,
  },
  {
    id: 'cm7n7nh9c000321m8scomtk83',
    name: 'Mokenyu Atsimbom Gwe',
    testimonial:
      'In one word? Bountiful! It is even better than a lifetime opportunity; it is generational wealth! Thanks for such an opportunity.',
    fieldOfInterest: 'Software Engineering',
    rating: 5,
    photo: `${S3}/Mokenyu_Atsimbom_Gwe.jpg`,
    video: '',
  },
  {
    id: 'cm7n7nidx000421m8mrxajvei',
    name: 'Fon Bradley',
    testimonial:
      "Sir you've made dreams come true. Giving this access to the best educational platforms for just a little amount is really of a good heart. Everything is now left to us to study. Intellex is really a place to be for people who are into tech like us.",
    fieldOfInterest: 'Cyber Security',
    rating: 5,
    photo: `${S3}/fon_bradley.jpg`,
    video: '',
  },
  {
    id: 'cm7n7nj9e000521m8dty884as',
    name: 'Marie-Noel Ngala',
    testimonial:
      'These courses are great and good because the explanations are easy to understand. Thank you InTelleX.',
    fieldOfInterest: 'Web development',
    rating: 5,
    photo: `${S3}/ma_rie.jpg`,
    video: '',
  },
  {
    id: 'cm7n7nkzg000621m85gss9ttq',
    name: 'Kunah Marion',
    testimonial:
      "I've had an incredible learning experience with Intellex! The engaging courses and user-friendly interface made online learning enjoyable and accessible. Intellex has expanded my knowledge and boosted my confidence. Thank you for empowering youths like me with quality education!",
    fieldOfInterest: 'Data Analyst, Web development',
    rating: 5,
    photo: `${S3}/marion.jpg`,
    video: '',
  },
  {
    id: 'cm7n7nmd9000721m8a1f49dv4',
    name: 'Kengum Toukam Danielle',
    testimonial:
      'Intellex has been a game changer for me. Their comprehensive courses from LinkedIn and Udemy helped me master AI, programming and graphic design skills. Highly recommend, 5 stars!',
    fieldOfInterest: 'AI, Machine Learning',
    rating: 5,
    photo: `${S3}/kengum.jpg`,
    video: '',
  },
  {
    id: 'cm7n7nnys000821m8dtxtxtjo',
    name: 'Besong Ebobe Christa',
    testimonial:
      "I'm still in disbelief at the cost Intellex offers for such a lifetime opportunity. The generosity hasn't gone unnoticed, and I'm deeply thankful for the doors you've opened for me. InTelleX to the World!",
    fieldOfInterest: 'Software Development',
    rating: 5,
    photo: '',
    video: '',
  },
  {
    id: 'cm7n7noym000921m8vvi65d13',
    name: 'Abdul Fadiga',
    testimonial:
      'Thanks for this wonderful opportunity you have given to us. I appreciate the courses that Intellex provides at such even costs. Intellex has many more courses than I expected.',
    fieldOfInterest: 'Software development',
    rating: 5,
    photo: '',
    video: '',
  },
  {
    id: 'cm7n7nqbr000a21m8ka2p40f0',
    name: 'Awah Fortune',
    testimonial:
      'InTelleX, thank you very much for giving us access to Udemy courses and books for free. These resources have really helped me in my educational life. I hope this platform continues to create more opportunities.',
    fieldOfInterest: 'Data science',
    rating: 5,
    photo: '',
    video: '',
  },
];
