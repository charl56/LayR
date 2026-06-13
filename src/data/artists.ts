import { type Info, type Artist } from '@/types/types'

export const ACCUEIL: Info = {
    id: 'home',
    name: 'Accueil',
    shortBio1: 'LayR transforme chacunes de vos affiches en expérience immersive tout en donnant vie à votre univers dans l’espace urbain',
    shortBio2: 'Chaque affiche que vous découvrez peut être scannée, vécue et conservée dans votre collection',
    image1: 'accueil/chat_face.png',
    image2: 'accueil/chat_dos.png',
    description: 'Nous vous écoutons, observons avec attention, et transformons l’authenticité en expériences visuelles qui marquent la rue',
}



export const ARTISTS: Artist[] = [
    {
        id: 'kelaggs',
        name: 'Kelaggs',
        shortBio1: 'Kelaggs est un beatmaker indépendant qui fusionne l\'univers internet, expériences électroniques et influences hyperpop actuelles.',
        shortBio2: 'Son style mêle culture internet, expériences électroniques et influences hyperpop actuelles. Entièrement auto-produit, il mélange esthétique pop 2010.',
        image1: 'artists/kelaggs/kelaggs1.jpg',
        image2: 'artists/kelaggs/kelaggs2.jpg',
        projets: [
            { name: 'RestInStarr', img: 'kelaggs/restinstarr.jpg' },
            { name: 'Bass Krush', img: 'kelaggs/basskrush.jpg' },
            { name: 'Jm bcp trop', img: 'kelaggs/jmbcptrop.jpg' },
            { name: 'Nvl vie/Need4Speed', img: 'kelaggs/nouvellevie.webp', videoId:'kelaggs_nvlvie', video: 'kelaggs/nvlvie.mp4' }
        ],        
        description: 'Kelaggs redonne à la rue son pouvoir d\'expression, en transformant chaque affiche en expérience à vivre et à garder.',
        links: {
            spotify: 'https://spotify.com/kelaggs',
            soundcloud: 'https://soundcloud.com/kelaggs'
        }
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
    },
    {
        id: 'luvresval',
        name: 'Luv Resval',
        shortBio1: 'Luv Resval est un rappeur français influencé par Young Thug et Lil Uzi Vert, connu pour son approche poétique du rap et ses freestyles viraux.',
        shortBio2: 'Avec son univers fantasy et ses rimes soignées, il a marqué le rap français par des flows chantés et une écriture percutante, mélangeant amour, nostalgie et culture pop.',
        image1: 'artists/luvresval/luvresval1.jpg',
        image2: 'artists/luvresval/luvresval2.jpg',
        projets: [
            { name: 'Mariah', img: 'luvresval/mariah.jpg' },
            { name: 'Etoile Noire', img: 'luvresval/etoilenoire.jpg' },
            { name: 'Etoile Noire 2.0', img: 'luvresval/etoilenoire2.png' },
            { name: 'Mustafar', img: 'luvresval/mustafar.jpg' },
            { name: 'Jutsu', img: 'luvresval/jutsu.png' }
        ],
        description: 'Étoile filante du rap français, Luv Resval transforme chaque couplet en poésie urbaine, donnant voix aux sentiments et rêves de sa génération avec une écriture soignée et un flow inégalé.',
        links: {
            spotify: 'https://open.spotify.com/intl-fr/artist/5l8WyvJ50fdSghK2ySNq1y',
            soundcloud: 'https://soundcloud.com/91666',
            deezer: 'https://www.deezer.com/fr/artist/53325902'
        }
    },
];