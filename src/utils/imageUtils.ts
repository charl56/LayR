export default function getAssetSrc(imagePath:string) {
    // return import.meta.env.DEV
    //     ? new URL(`../../images/${imagePath}`, import.meta.url).href
    //     : `images/${imagePath}`;

    return `/images/${imagePath}`;

}