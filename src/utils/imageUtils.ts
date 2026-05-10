export default function getAssetSrc(imagePath:string) {
    console.log("utiImage : " + imagePath)
    return import.meta.env.DEV
        ? new URL(`../../images/${imagePath}`, import.meta.url).href
        : `images/${imagePath}`;
}