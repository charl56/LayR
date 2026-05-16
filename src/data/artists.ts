import { type Info, type Artist } from '@/types/types'

export const ACCUEIL: Info = {
    id: 'home',
    name: 'Accueil',
    shortBio1: 'LayR transforme chacunes de vos affiches en expérience immersive tout en donnant vie à votre univers dans l’espace urbain',
    shortBio2: 'Chaque affiche que vous découvrez peut être scannée, vécue et conservée dans votre collection',
    image1: 'accueil/accueil1.jpg',
    image2: 'accueil/accueil2.png',
    description: 'Nous vous écoutons, observons avec attention, et transformons l’authenticité en expériences visuelles qui marquent la rue',
}



export const ARTISTS: Artist[] = [
    {
        id: 'kelaggs',
        name: 'Kelaggs',
        shortBio1: 'Kelaggs est un beatmaker indépendant qui fusionne l\'univers internet, expériences électroniques et influences hyperpop actuelles.',
        shortBio2: 'Son style mêle culture internet, expériences électroniques et influences hyperpop actuelles. Entièrement auto-produit, il mélange esthétique pop 2010.',
        image1: 'restinstar.png',
        image2: 'stronboscoo.png',
        projets: [
            { name: 'RestInStar', img: 'galerie.png' },
            { name: 'Stronbosco', img: 'galerie.png' }
        ],        
        description: 'Kelaggs redonne à la rue son pouvoir d\'expression, en transformant chaque affiche en expérience à vivre et à garder.',
        spotify: 'https://spotify.com/kelaggs',
        soundcloud: 'https://soundcloud.com/kelaggs'
    },
    {
        id: 'dimes',
        name: 'Dimes',
        shortBio1: 'Dimes crée des expériences visuelles captivantes qui marient art urbain et technologie moderne.',
        shortBio2: 'Ses créations explorent les frontières entre street art traditionnel et art numérique contemporain.',
        image1: 'stronboscoo.png',
        image2: 'restinstar.png',
        projets: [
            { name: 'RestInStar', img: 'galerie.png' },
            { name: 'Stronbosco', img: 'galerie.png' }
        ],
        description: 'Dimes transforme les murs en galeries éphémères, donnant vie aux rues avec chaque coup de pinceau et chaque pixel.',
        spotify: '',
        soundcloud: ''
    },
    {
        id: 'luvresval',
        name: 'Luv Resval',
        shortBio1: 'Luv Resval est un rappeur français influencé par Young Thug et Lil Uzi Vert, connu pour son approche poétique du rap et ses freestyles viraux.',
        shortBio2: 'Avec son univers fantasy et ses rimes soignées, il a marqué le rap français par des flows chantés et une écriture percutante, mélangeant amour, nostalgie et culture pop.',
        image1: 'artists/luvresval/luvresval1.jpg',
        image2: 'artists/luvresval/luvresval2.jpg',
        projets: [
            { name: 'Mariah', img: 'artists/luvresval/mariah.jpg' },
            { name: 'Etoile Noire', img: 'artists/luvresval/etoilenoire.jpg' },
            { name: 'Etoile Noire 2.0', img: 'artists/luvresval/etoilenoire2.png' },
            { name: 'Mustafar', img: 'mustafar.jpg' },
            { name: 'Jutsu', img: 'jutsu.png' }
        ],
        description: 'Étoile filante du rap français, Luv Resval transforme chaque couplet en poésie urbaine, donnant voix aux sentiments et rêves de sa génération avec une écriture soignée et un flow inégalé.',
        spotify: '',
        soundcloud: ''
    },
];